import { Worker } from 'bullmq'
import Redis from 'ioredis'
import { PrismaClient } from '@prisma/client'
import { getWhatsAppProvider } from './whatsapp/provider'

const prisma = new PrismaClient()

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
})

export const campaignWorker = new Worker('whatsapp-campaigns', async job => {
    const { phone, name, templateText, organizationId, userId } = job.data

    try {
        const provider = getWhatsAppProvider()

        let finalPhone = phone
        if (!finalPhone.startsWith('55')) {
            finalPhone = `55${finalPhone}`
        }

        const personalizedMsg = templateText
            .replace(/\{\{nome\}\}/gi, name)
            .replace(/\{\{telefone\}\}/gi, finalPhone)

        let lead = await prisma.lead.findFirst({
            where: { phone: finalPhone, organizationId }
        })

        if (!lead) {
            lead = await prisma.lead.create({
                data: {
                    organizationId,
                    phone: finalPhone,
                    name,
                    lgpdConsent: true
                }
            })
        }

        let conversation = await prisma.conversation.findFirst({
            where: { leadId: lead.id, organizationId }
        })

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    organizationId,
                    leadId: lead.id,
                    status: 'OPEN'
                }
            })
        } else {
            await prisma.conversation.update({
                where: { id: conversation.id },
                data: { status: 'OPEN', updatedAt: new Date() }
            })
        }

        const res = await provider.sendMessage({
            to: finalPhone,
            text: personalizedMsg
        })

        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                direction: "OUTBOUND",
                content: personalizedMsg,
                type: "TEXT",
                senderId: userId,
                status: res.success ? "SENT" : "DELIVERED",
                providerId: res.messageId || null
            }
        })

        console.log(`[Worker] Sent to ${finalPhone}: ${res.success}`)

    } catch (err) {
        console.error(`[Worker] Error sending to ${phone}:`, err)
        throw err
    }

}, {
    connection: redisConnection,
    concurrency: 5 // Processa 5 mensagens simultâneas da fila
})

// Tratamento de erros globais do Worker
campaignWorker.on('failed', (job, err) => {
    if (job) {
        console.log(`${job.id} falhou com o erro: ${err.message}`);
    } else {
        console.log(`Worker apresentou um erro isolado: ${err.message}`)
    }
})
