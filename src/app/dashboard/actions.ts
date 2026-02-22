'use server'

import prisma from "@/lib/prisma"
import { requireUser } from "@/lib/auth-utils"

export interface DashboardMetrics {
    mrr: number
    activeClients: number
    cac: number
    churn: string
    messagesSent: number
    winRate: string
    chartData: { name: string; income: number; outcome: number }[]
    recentDeals: {
        id: string
        name: string
        plan: string
        amount: number
        type: 'positive' | 'negative'
    }[]
}

export async function getDashboardMetrics(periodDays: number): Promise<DashboardMetrics> {
    const user = await requireUser()
    const organizationId = user.organizationId

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)

    // Agregações básicas
    const totalLeads = await prisma.lead.count({
        where: {
            organizationId,
            createdAt: { gte: startDate }
        }
    })

    const totalMessages = await prisma.message.count({
        where: {
            conversation: {
                organizationId
            },
            createdAt: { gte: startDate }
        }
    })

    // Deals Won no período para composição de Receita/MRR
    const wonDeals = await prisma.deal.findMany({
        where: {
            organizationId,
            status: "WON",
            updatedAt: { gte: startDate }
        },
        include: {
            lead: true,
            company: true,
            stage: true
        },
        orderBy: { updatedAt: 'desc' }
    })

    const totalMRR = wonDeals.reduce((acc, deal) => acc + deal.value, 0)

    // Todos os deals no período (para Win Rate)
    const allDealsInPeriod = await prisma.deal.count({
        where: {
            organizationId,
            createdAt: { gte: startDate }
        }
    })

    const winRateVal = allDealsInPeriod > 0 ? (wonDeals.length / allDealsInPeriod) * 100 : 0

    // Vamos buscar todas as conversas/Deals recentes
    const recentDealsRaw = await prisma.deal.findMany({
        where: {
            organizationId,
        },
        include: {
            lead: true,
            company: true,
            stage: true
        },
        orderBy: { updatedAt: 'desc' },
        take: 4
    })

    const recentDealsFormatted = recentDealsRaw.map(deal => ({
        id: deal.id,
        name: deal.company?.name || deal.lead?.name || deal.title || "Cliente Desconhecido",
        plan: deal.stage.name,
        amount: deal.value,
        type: (deal.status === 'LOST' || deal.value < 0 ? 'negative' : 'positive') as 'positive' | 'negative'
    }))

    // Custo Fictício por Lead para CAC como placeholder (Ex: R$ 8.50 por contato/lead)
    const cac = totalLeads > 0 ? (totalLeads * 8.5) / totalLeads : 0

    // Churn Simulado (Deals Perdidos / Total)
    const lostDeals = await prisma.deal.count({
        where: {
            organizationId,
            status: "LOST",
            updatedAt: { gte: startDate }
        }
    })
    const churn = allDealsInPeriod > 0 ? ((lostDeals / allDealsInPeriod) * 100).toFixed(1) + '%' : '0%'

    // Construção do Gráfico
    // Vamos subdividir o período em X partes proporcionais para o Chart
    // Como simplificação, injetaremos mocks preenchidos pela escalada real do MRR diário se necessário,
    // Mas para ser 100% autêntico, precisamos agrupar os 'wonDeals' por data.
    const chartData: Record<string, { income: number, outcome: number }> = {}

    // Inicializar os buckets vazios
    for (let i = periodDays; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateKey = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}` // Ex: 01/02
        chartData[dateKey] = { income: 0, outcome: 0 }
    }

    // Povoar com os ganhos reais
    wonDeals.forEach(deal => {
        const d = new Date(deal.updatedAt)
        const dateKey = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
        if (chartData[dateKey]) {
            chartData[dateKey].income += deal.value
        }
    })

    const chartDataArray = Object.keys(chartData).map(key => ({
        name: key,
        income: chartData[key].income,
        outcome: chartData[key].income * 0.15 // Simula despesas/impostos 15% do ganho real para efeito gráfico
    }))

    return {
        mrr: totalMRR,
        activeClients: totalLeads, // Representando todos os leads gerados
        cac: parseFloat(cac.toFixed(2)),
        churn,
        messagesSent: totalMessages,
        winRate: winRateVal.toFixed(1) + '%',
        chartData: chartDataArray,
        recentDeals: recentDealsFormatted
    }
}
