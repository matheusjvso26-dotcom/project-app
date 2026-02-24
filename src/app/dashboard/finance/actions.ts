'use server'

import prisma from "@/lib/prisma"
import { requireUser } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"

export async function getFinancialMetrics() {
    const user = await requireUser()

    // 1. Organização e Custos Fixos
    const org = await prisma.organization.findUnique({
        where: { id: user.organizationId },
        select: { id: true, name: true, fixedCosts: true }
    })
    const fixedCosts = org?.fixedCosts || 0

    // 2. Deals Ganhos (Receita Real)
    // No MVP, consideramos "Ganho" qualquer Stage que contenha "Ganho" no nome
    const wonStageDeals = await prisma.deal.findMany({
        where: {
            organizationId: user.organizationId,
            stage: { name: { contains: 'Ganho', mode: 'insensitive' } }
        },
        include: { stage: true, company: true },
        orderBy: { updatedAt: 'desc' }
    })

    const totalRevenue = wonStageDeals.reduce((acc, current) => acc + (current.value || 0), 0)

    // 3. Receita Projetada (MRR Futuro)
    // Consideramos deals que saíram da primeira etapa (Triagem/order 1) mas ainda não foram Ganhos
    const projectedDeals = await prisma.deal.findMany({
        where: {
            organizationId: user.organizationId,
            stage: {
                name: { not: { contains: 'Ganho' } },
                order: { gt: 1 } // Ignora Triagem (topo frio de funil)
            }
        },
        include: { stage: true }
    })

    // Usaremos um WinRate estático de 50% para projetar valor realista ou podemos mostrar o bruto.
    // O usuário MVP pode querer ver o "dinheiro na mesa" (Pipeline Value). Vamos somar tudo.
    const projectedRevenue = projectedDeals.reduce((acc, current) => acc + (current.value || 0), 0)

    // 4. Gráfico de Evolução (Últimos 30 Dias)
    const thirtyDaysAgo = subDays(new Date(), 30)

    // Puxa ganhos dos últimos 30 dias para chart
    const chartDeals = await prisma.deal.findMany({
        where: {
            organizationId: user.organizationId,
            stage: { name: { contains: 'Ganho', mode: 'insensitive' } },
            updatedAt: { gte: thirtyDaysAgo }
        }
    })

    // Agrupa por dia (DD/MM)
    const dailyDataMap = new Map<string, number>()

    // Preenche últimos 30 dias com R$ 0 para gráfico não quebrar
    for (let i = 29; i >= 0; i--) {
        const d = subDays(new Date(), i)
        const dateKey = format(d, 'dd/MM')
        dailyDataMap.set(dateKey, 0)
    }

    // Soma os valores
    chartDeals.forEach(deal => {
        const dateKey = format(deal.updatedAt, 'dd/MM')
        if (dailyDataMap.has(dateKey)) {
            dailyDataMap.set(dateKey, dailyDataMap.get(dateKey)! + deal.value)
        }
    })

    const chartData = Array.from(dailyDataMap.entries()).map(([date, amount]) => ({
        date,
        amount
    }))

    return {
        revenue: totalRevenue,
        projectedRevenue,
        fixedCosts,
        dealsCount: wonStageDeals.length,
        chartData,
        recentWons: wonStageDeals.slice(0, 5).map(d => ({
            id: d.id,
            name: d.title,
            companyName: d.company?.name || 'B2C',
            amount: d.value,
            date: d.updatedAt.toLocaleDateString('pt-BR')
        }))
    }
}

/**
 * Atualiza o Custo Operacional Mensal do SaaS para a DRE
 */
export async function updateFixedCosts(amount: number) {
    const user = await requireUser()

    await prisma.organization.update({
        where: { id: user.organizationId },
        data: { fixedCosts: amount }
    })

    revalidatePath('/dashboard/finance')
    return { success: true }
}
