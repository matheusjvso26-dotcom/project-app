'use server'

import prisma from "@/lib/prisma"
import { requireUser } from "@/lib/auth-utils"

export async function getFinancialMetrics() {
    const user = await requireUser()

    // 1. Puxa os Deals Ganhos
    // Podemos adotar que stage com order mais alto da pipeline seja WIN, ou filtrar por tags.
    // Vamos simplesmente pegar todos os Deals do Pipeline atual para esse MVP, fingindo que Stages 'Ganho' são os WINs reais. 
    // Como a pipeline foi gerada pela IA e nomeada como "4. Ganho", procuro nela:
    const wonStageDeals = await prisma.deal.findMany({
        where: {
            organizationId: user.organizationId,
            stage: { name: { contains: 'Ganho', mode: 'insensitive' } }
        },
        include: { stage: true, company: true }
    })

    const totalRevenue = wonStageDeals.reduce((acc, current) => acc + (current.value || 0), 0)

    // 2. Extrai Organização para checar possível 'fixedCosts' ou simular no retorno:
    const org = await prisma.organization.findUnique({
        where: { id: user.organizationId },
        select: { id: true, name: true } // Se houvesse coluna fixedCost, seria puxado daqui.
    })

    return {
        revenue: totalRevenue,
        dealsCount: wonStageDeals.length,
        recentWons: wonStageDeals.slice(0, 5).map(d => ({
            id: d.id,
            name: d.title,
            companyName: d.company?.name || 'B2C',
            amount: d.value,
            date: d.createdAt.toLocaleDateString('pt-BR')
        }))
    }
}
