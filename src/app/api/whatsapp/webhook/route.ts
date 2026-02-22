import { NextResponse } from 'next/server'
import { getWhatsAppProvider } from '@/lib/whatsapp/provider'
import prisma from '@/lib/prisma'

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
                const textContent = incomingMessage.text?.body || ""
                const msgId = incomingMessage.id

                console.log(`[API/WhatsApp] Nova Memagem Recebida de ${leadPhone}: ${textContent}`)

                // 1. Procurar o Lead no Flow SaaS
                // Obs: Aqui separamos lógica de DDD, mas vamos procurar de forma exata por hora
                let lead = await prisma.lead.findFirst({
                    where: { phone: leadPhone }
                })

                // 2. Se Lead não existe e não temos a org via token, não tem como adivinhar por enquanto.
                // Mas, numa arquitetura multi-tenant limpa, o WABA_ID (WhatsApp Business Account ID)
                // Que vem dentro do payload 'body.entry[0].id' vincula com a Organização.
                const metaBusId = body.entry[0].id

                const organization = await prisma.organization.findFirst({
                    where: { wabaId: metaBusId }
                })

                if (organization && !lead) {
                    // Lead totalmente novo caindo de paraquedas no WhatsApp da org
                    lead = await prisma.lead.create({
                        data: {
                            organizationId: organization.id,
                            phone: leadPhone,
                            name: leadName,
                            lgpdConsent: true
                        }
                    })
                }

                if (lead) {
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
                    await prisma.message.create({
                        data: {
                            conversationId: conversation.id,
                            direction: "INBOUND",
                            type: "TEXT",
                            content: textContent,
                            status: "DELIVERED"
                        }
                    })

                    // Fazemos bump na updatedAt da thread para subir ela
                    await prisma.conversation.update({
                        where: { id: conversation.id },
                        data: { updatedAt: new Date() }
                    })
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
