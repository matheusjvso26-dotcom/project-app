import { NextResponse } from 'next/server'
import { getWhatsAppProvider } from '@/lib/whatsapp/provider'
import prisma from '@/lib/prisma'
import { processBotFlow } from '@/lib/whatsapp/botEngine'
import { processAgendaCommand } from '@/lib/whatsapp/agendaHandler'
import { transcribeAudioMessage } from '@/lib/whatsapp/transcriber'
import { sendPushNotification } from '@/lib/push'

/**
 * GET: Endpoint utilizado pela Meta (Facebook) no momento de vincular e verificar o Webhook
 * Documentação: https://developers.facebook.com/docs/graph-api/webhooks/getting-started
 */
export async function GET(request: Request) {
    console.log("[API/WhatsApp] Verificando Handshake de Webhook da Meta...")

    try {
        const provider = getWhatsAppProvider()

        // O provider original lida com a lógica de verificação
        // Ele extrai mode, token e challenge e responde se bater.
        const response = await provider.parseWebhook(request, 'GET')

        // A Meta exige o challenge numérico cru
        if (typeof response === 'string') {
            return new NextResponse(response, {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            })
        }

        return NextResponse.json({ error: "Invalid Webhook Verification Request" }, { status: 400 })
    } catch (error: any) {
        console.error("[API/WhatsApp] Erro fatal no Handshake GET:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

/**
 * POST: Endpoint primário acionado sempre que recebemos um evento do WhatsApp
 * Exemplo de eventos: Novo LEAD enviando mensagem, Confirmação de Leitura, etc.
 */
export async function POST(request: Request) {
    try {
        const provider = getWhatsAppProvider()

        // Retorna o body decodificado após leitura da request
        const body = await provider.parseWebhook(request, 'POST')

        // Estrutura padrão de Objeto da Meta para mensagens Inbound:
        // body.entry[0].changes[0].value.messages[0]
        if (body.object === 'whatsapp_business_account' && body.entry && body.entry[0].changes) {
            const changes = body.entry[0].changes[0].value

            // Tem mensagens ali dentro? (Lead digitou algo para nós)
            if (changes.messages && changes.messages.length > 0) {
                const incomingMessage = changes.messages[0]
                const contactInfo = changes.contacts?.[0]

                const leadPhone = incomingMessage.from
                const leadName = contactInfo?.profile?.name || "Desconhecido"

                const msgType = incomingMessage.type || 'text'
                const msgId = incomingMessage.id

                let textContent = ""
                let mediaId = ""
                let caption = ""

                if (msgType === 'text') {
                    textContent = incomingMessage.text?.body || ""
                } else if (msgType === 'document') {
                    mediaId = incomingMessage.document?.id || ""
                    caption = incomingMessage.document?.filename || "Documento"
                    textContent = `[ARQUIVO] ${caption}`
                } else if (msgType === 'image') {
                    mediaId = incomingMessage.image?.id || ""
                    caption = incomingMessage.image?.caption || "Imagem"
                    textContent = `[IMAGEM] ${caption}`
                } else if (msgType === 'audio') {
                    mediaId = incomingMessage.audio?.id || ""
                    textContent = `[ÁUDIO] Voz`
                } else if (msgType === 'video') {
                    mediaId = incomingMessage.video?.id || ""
                    caption = incomingMessage.video?.caption || "Vídeo"
                    textContent = `[VÍDEO] ${caption}`
                } else {
                    textContent = "[Mídia Genérica ou Interativa]"
                }

                const finalContent = mediaId ? JSON.stringify({ text: textContent, mediaId, caption, type: msgType }) : textContent

                console.log(`[API/WhatsApp] Nova Mensagem Recebida de ${leadPhone} | Tipo: ${msgType} | Texto: ${textContent}`)

                // 1. Identificar a Organização dona deste WABA ID primeiro para evitar vazamento Multi-Tenant
                const metaBusId = body.entry[0].id

                const organization = await prisma.organization.findFirst({
                    where: { wabaId: metaBusId }
                })

                if (!organization) {
                    console.warn(`[API/WhatsApp] Aviso: WABA ID ${metaBusId} não está vinculado a nenhuma Organização Ativa no sistema. Dropando mensagem silenciosamente.`)
                    return NextResponse.json({ success: true })
                }

                // 2. Procurar o Lead RESTRITO ao ecossistema daquela Organização
                let lead = await prisma.lead.findFirst({
                    where: {
                        phone: leadPhone,
                        organizationId: organization.id
                    }
                })

                let isNewLead = false

                if (!lead) {
                    // Lead totalmente novo caindo de paraquedas no WhatsApp da org
                    lead = await prisma.lead.create({
                        data: {
                            organizationId: organization.id,
                            phone: leadPhone,
                            name: leadName,
                            lgpdConsent: true
                        }
                    })
                    isNewLead = true

                    // ======================================
                    // ROBÔ DE CARNAVAL: ESTEIRA KANBAN AUTOMÁTICA
                    // ======================================
                    try {
                        // Tentar achar o primeiro pipeline e a primeira coluna (Stage) de Triagem
                        const pipeline = await prisma.pipeline.findFirst({
                            where: { organizationId: organization.id },
                            include: {
                                stages: {
                                    orderBy: { order: 'asc' },
                                    take: 1
                                }
                            }
                        })
                        if (pipeline && pipeline.stages.length > 0) {
                            await prisma.deal.create({
                                data: {
                                    organizationId: organization.id,
                                    pipelineId: pipeline.id,
                                    stageId: pipeline.stages[0].id,
                                    title: `Lead WPP: ${leadName}`,
                                    value: 0
                                }
                            })
                            console.log(`[API/WhatsApp] Deal Kanban Automático criado em "${pipeline.stages[0].name}" para o Lead inédito.`)
                        }
                    } catch (dealErr) {
                        console.error("[API/WhatsApp] Falha ao injetar Deal no Kanban:", dealErr)
                    }
                }

                if (lead && organization) {
                    // Tem conversa ativa pra esse cara?
                    let conversation = await prisma.conversation.findFirst({
                        where: { leadId: lead.id }
                    })

                    if (!conversation) {
                        conversation = await prisma.conversation.create({
                            data: {
                                organizationId: lead.organizationId,
                                leadId: lead.id,
                                status: "OPEN"
                            }
                        })
                    }

                    // Salvar no prisma (Chat de entrada)
                    const msgEntity = await prisma.message.create({
                        data: {
                            conversationId: conversation.id,
                            direction: "INBOUND",
                            type: mediaId ? msgType.toUpperCase() : "TEXT",
                            content: finalContent,
                            status: "DELIVERED"
                        }
                    })

                    // Se for áudio, engatilha a transcrição em background
                    if (msgType === 'audio' && mediaId) {
                        transcribeAudioMessage(msgEntity.id, mediaId).catch(err => {
                            console.error("[API/WhatsApp] Erro assíncrono no Transcriber:", err)
                        })
                    }

                    // Agenda Interceptor Nativo (Inbound)
                    if (textContent && textContent.trim().toLowerCase().startsWith('/agenda')) {
                        let confirmTxt = ""
                        try {
                            const agendaResult = await processAgendaCommand(lead.id, textContent)
                            if (agendaResult) confirmTxt = agendaResult
                        } catch (err: any) {
                            confirmTxt = err.message || "Erro no comando de agendamento."
                        }

                        if (confirmTxt) {
                            const providerConfirm = await provider.sendMessage({
                                to: leadPhone,
                                text: confirmTxt
                            })
                            await prisma.message.create({
                                data: {
                                    conversationId: conversation.id,
                                    direction: "OUTBOUND",
                                    content: confirmTxt,
                                    type: "TEXT",
                                    status: providerConfirm.success ? "SENT" : "FAILED",
                                    providerId: providerConfirm.messageId || null
                                }
                            })
                            // Pula o processamento do robô se foi um comando explícito
                            return NextResponse.json({ success: true })
                        }
                    }

                    // Fazemos bump na updatedAt da thread para subir ela
                    await prisma.conversation.update({
                        where: { id: conversation.id },
                        data: { updatedAt: new Date() }
                    })

                    // Notificar Atendentes via PWA Push (Background Promise)
                    prisma.user.findMany({
                        where: { organizationId: conversation.organizationId }
                    }).then(users => {
                        const pushFmt = {
                            title: `Nova mensagem de ${lead.name}`,
                            body: finalContent.length > 50 ? finalContent.substring(0, 50) + '...' : finalContent,
                            url: `/dashboard/inbox`
                        }
                        users.forEach(u => {
                            sendPushNotification(u.id, pushFmt).catch(() => { })
                        })
                    }).catch(e => console.error("[Push] Erro finding users:", e))

                    // ======================================
                    // ROBÔ AUTOMADOR M2R CRED: STATELESS FLOW
                    // ======================================

                    try {
                        await processBotFlow({
                            conversationId: conversation.id,
                            leadPhone,
                            incomingText: textContent,
                            incomingType: msgType,
                            isNewLead
                        })
                    } catch (botErr) {
                        console.error("[API/WhatsApp/BotEngine] Falha ao processar maquina de estado do robô:", botErr)
                    }
                }
            } else if (changes.statuses && changes.statuses.length > 0) {
                const statusEvent = changes.statuses[0]
                const wamid = statusEvent.id // "wamid.HBg..."
                const newStatusText = statusEvent.status // 'sent', 'delivered', 'read', 'failed'

                let finalStatus = 'SENT'
                if (newStatusText === 'delivered') finalStatus = 'DELIVERED'
                else if (newStatusText === 'read') finalStatus = 'READ'
                else if (newStatusText === 'failed') finalStatus = 'FAILED'

                let errorDesc = null
                if (newStatusText === 'failed' && statusEvent.errors) {
                    errorDesc = statusEvent.errors.map((e: any) => e.title || e.message).join(', ')
                    console.error(`[API/WhatsApp] Mensagem FALHOU para WAMID ${wamid}:`, errorDesc)
                }

                if (wamid) {
                    const msg = await prisma.message.findUnique({
                        where: { providerId: wamid }
                    })

                    if (msg) {
                        let updatedContent = msg.content || ""
                        if (errorDesc && !updatedContent.includes('Erro de Envio')) {
                            updatedContent = `${updatedContent}\n\n⚠️ Erro de Envio da Meta: ${errorDesc}`
                        }

                        await prisma.message.update({
                            where: { id: msg.id },
                            data: {
                                status: finalStatus,
                                content: updatedContent
                            }
                        })
                    }
                }
            }
        }

        // Importante: Facebook obriga a responder 200 rápido (<20s), do contrário retry e ban loop
        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error("[API/WhatsApp] Erro Fatal no Inbound:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
