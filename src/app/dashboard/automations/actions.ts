'use server'

import prisma from "@/lib/prisma"
import { requireUser } from "@/lib/auth-utils"
import { getWhatsAppProvider } from "@/lib/whatsapp/provider"

export async function launchCampaignAction(payload: { phone: string, name: string }[], templateText: string) {
    const user = await requireUser()
    if (!payload || payload.length === 0) return { success: false, error: "Planilha Vazia" }

    const organization = await prisma.organization.findUnique({
        where: { id: user.organizationId }
    })
    if (!organization) throw new Error("Org não encontrada")

    const provider = getWhatsAppProvider()
    const { campaignQueue } = await import('@/lib/queue')

    // O ideal em campanhas grandes seria jogar pra uma Fila/Background Job (Redis/SQS).
    // Implementamos o BullMQ aqui!
    const jobs = payload.map(item => ({
        name: 'campaign-message',
        data: {
            phone: item.phone,
            name: item.name,
            templateText,
            organizationId: organization.id,
            userId: user.id
        }
    }))

    // Adiciona os items na Queue em lote
    await campaignQueue.addBulk(jobs)

    return { success: true, count: jobs.length }
}
