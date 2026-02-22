'use server'

import prisma from "@/lib/prisma"
import { requireUser } from "@/lib/auth-utils"
import { getWhatsAppProvider } from "@/lib/whatsapp/provider"

/**
 * Busca todas as conversas da organização atual
 */
export async function getConversations() {
    const user = await requireUser()

    const conversations = await prisma.conversation.findMany({
        where: {
            organizationId: user.organizationId
        },
        include: {
            lead: true,
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 50
            }
        },
        orderBy: { updatedAt: 'desc' }
    })

    // Serializando o retorno para o Client Component não quebrar com Datas
    return conversations.map(c => ({
        id: c.id,
        name: c.lead.name || 'Sem Nome',
        phone: c.lead.phone,
        status: c.status,
        lgpdConsent: c.lead.lgpdConsent,
        time: c.updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        lastMessage: c.messages[0]?.content || 'Nova conversa',
        isBotHandling: c.status === 'BOT_HANDLING',
        unread: 0,
        messages: c.messages.reverse().map(m => ({
            id: m.id,
            content: m.content || '',
            sender: (m.direction === 'OUTBOUND' ? (m.senderId ? 'me' : 'bot') : 'client') as "me" | "bot" | "client",
            time: m.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status: (m.status === 'READ' ? 'read' : (m.status === 'DELIVERED' ? 'delivered' : 'sent')) as "read" | "delivered" | "sent"
        }))
    }))
}

/**
 * Envia uma mensagem de um Atendente/Usuário para o Lead via WhatsApp 
 */
export async function sendMessage(conversationId: string, content: string) {
    const user = await requireUser()

    // 1. Validar propriedade e obter formato do lead
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { lead: true }
    })

    if (!conversation || conversation.organizationId !== user.organizationId) {
        throw new Error("Chat não encontrado ou permissão negada.")
    }

    // 2. Disparar API do WhatsApp (Provedor Dinâmico: Mock ou Real)
    const provider = getWhatsAppProvider()
    const result = await provider.sendMessage({
        to: conversation.lead.phone,
        text: content
    })

    if (!result.success) {
        // Toleramos a falha visual no dashboard mas é logada se o provider cair
        console.error("WhatsApp Provider Error:", result.error)
    }

    // 3. Registrar "Saída" no banco de dados independentemente do mock para consistência visual
    const novaMensagem = await prisma.message.create({
        data: {
            conversationId: conversation.id,
            direction: "OUTBOUND",
            content: content,
            type: "TEXT",
            senderId: user.id,
            status: "SENT"
        }
    })

    // Atualizar updatedAt da conversa para ela subir na lista
    await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() }
    })

    return {
        id: novaMensagem.id,
        content: novaMensagem.content,
        sender: 'me' as const,
        time: novaMensagem.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent' as const
    }
}
