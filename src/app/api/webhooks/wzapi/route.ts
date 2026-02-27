// src/app/api/webhooks/wzapi/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json()
        console.log('[WZAPI WEBHOOK] Recebido:', JSON.stringify(payload, null, 2))

        // Validar se o evento é uma 'MESSAGE'
        if (payload.event === 'messages.upsert') {
            const messages = payload.data?.messages || []
            const instanceId = payload.instance // O ID da instancia que recebeu, essencial pra multitenant

            if (!instanceId) {
                return NextResponse.json({ error: 'Instance ID missing' }, { status: 400 })
            }

            // Procura de qual B2B (Organization) é este número que recebeu a msg
            const org = await prisma.organization.findFirst({
                where: { wzapiInstanceId: instanceNameParser(instanceId) }
            })

            if (!org) {
                console.error(`[WZAPI] Organization nâo encontrada para Instance: ${instanceId}`)
                return NextResponse.json({ error: 'Unknown Instance' }, { status: 404 })
            }

            for (const msg of messages) {
                // Ignorar Status (Story) ou Protocolos Internos
                if (msg.key.remoteJid === 'status@broadcast' || msg.message?.protocolMessage) continue;

                const isFromMe = msg.key.fromMe
                const remotePhone = extractPhone(msg.key.remoteJid) // telefone do lead
                const textContent = extractMessageText(msg.message)
                const wamid = msg.key.id // Tracking único da rede do zap

                if (!textContent) continue;

                // 1. Procurar ou Criar o Lead associado a esse telefone
                let lead = await prisma.lead.findFirst({
                    where: { organizationId: org.id, phone: remotePhone }
                })

                if (!lead) {
                    lead = await prisma.lead.create({
                        data: {
                            organizationId: org.id,
                            phone: remotePhone,
                            name: msg.pushName || 'Novo Lead (WhatsApp)'
                        }
                    })
                }

                // 2. Procurar ou Abrir Nova Conversa com esse Lead
                let conversation = await prisma.conversation.findFirst({
                    where: { organizationId: org.id, leadId: lead.id, status: { in: ['OPEN', 'BOT_HANDLING'] } }
                })

                if (!conversation) {
                    conversation = await prisma.conversation.create({
                        data: {
                            organizationId: org.id,
                            leadId: lead.id,
                            status: 'OPEN'
                        }
                    })
                }

                // 3. Salvar Mensagem e prevenir duplicações pelo WAMID (providerId)
                try {
                    await prisma.message.create({
                        data: {
                            conversationId: conversation.id,
                            direction: isFromMe ? 'OUTBOUND' : 'INBOUND',
                            type: 'TEXT',
                            content: textContent,
                            providerId: wamid,
                            status: isFromMe ? 'SENT' : 'DELIVERED'
                        }
                    })
                } catch (err: any) {
                    // Se o WAMID já existe (Unique Constraint fail = P2002), ignora repetição segura
                    if (err.code !== 'P2002') {
                        console.error('[WZAPI] Erro ao gravar mensagem:', err)
                    }
                }
            }
        }

        // Se o evento for status de conexão mudando off-line
        if (payload.event === 'connection.update') {
            const state = payload.data?.state || payload.state
            const instanceId = payload.instance

            if (state === 'close' || state === 'disconnected' && instanceId) {
                await prisma.organization.updateMany({
                    where: { wzapiInstanceId: instanceNameParser(instanceId) },
                    data: { wzapiStatus: 'DISCONNECTED' }
                })
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[WZAPI WEBHOOK] System Fault:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// Helpers Isolados
function instanceNameParser(wzapiName: string) {
    // Tratamentos de nome caso a API envie prefixos
    return wzapiName;
}

function extractPhone(jid: string) {
    if (!jid) return '';
    return jid.split('@')[0]
}

function extractMessageText(messageNode: any): string | null {
    if (!messageNode) return null;

    if (messageNode.conversation) return messageNode.conversation;
    if (messageNode.extendedTextMessage?.text) return messageNode.extendedTextMessage.text;
    if (messageNode.imageMessage?.caption) return messageNode.imageMessage.caption;
    if (messageNode.videoMessage?.caption) return messageNode.videoMessage.caption;

    return null; // áudios, vcards, etc não processados nessa versão 1.0 (somente texto)
}
