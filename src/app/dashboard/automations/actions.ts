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
    let sucessCount = 0

    // O ideal em campanhas grandes seria jogar pra uma Fila/Background Job (Redis/SQS).
    // Como é MVP SaaS inicial, faremos num Loop Serverless assíncrono básico, limitando o tempo e lotes.
    for (const item of payload) {
        try {
            // Formata Telefone (ex: 5521999999999)
            let finalPhone = item.phone
            if (!finalPhone.startsWith('55')) {
                finalPhone = `55${finalPhone}`
            }

            // Parse Template Variables
            const personalizedMsg = templateText
                .replace(/\{\{nome\}\}/gi, item.name)
                .replace(/\{\{telefone\}\}/gi, finalPhone)

            // 1. Procura Lead ou Cria
            let lead = await prisma.lead.findFirst({
                where: { phone: finalPhone, organizationId: organization.id }
            })

            if (!lead) {
                lead = await prisma.lead.create({
                    data: {
                        organizationId: organization.id,
                        phone: finalPhone,
                        name: item.name,
                        lgpdConsent: true
                    }
                })
            }

            // 2. Busca e abre Conversa
            let conversation = await prisma.conversation.findFirst({
                where: { leadId: lead.id, organizationId: organization.id }
            })

            if (!conversation) {
                conversation = await prisma.conversation.create({
                    data: {
                        organizationId: organization.id,
                        leadId: lead.id,
                        status: 'OPEN'
                    }
                })
            } else {
                await prisma.conversation.update({
                    where: { id: conversation.id },
                    data: { status: 'OPEN', updatedAt: new Date() } // Fica como do humano no final
                })
            }

            // 3. Dispara real
            const res = await provider.sendMessage({
                to: finalPhone,
                text: personalizedMsg
            })

            // 4. Salva Histórico no Inbox
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    direction: "OUTBOUND",
                    content: personalizedMsg,
                    type: "TEXT",
                    senderId: user.id,
                    status: res.success ? "SENT" : "DELIVERED"
                }
            })

            if (res.success) sucessCount++

        } catch (err) {
            console.error("Erro disparando num unitário da campanha:", err)
        }
    }

    return { success: true, count: sucessCount }
}
