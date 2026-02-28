'use server'

import prisma from "@/lib/prisma"
import { requireUser } from "@/lib/auth-utils"
import { getWhatsAppProvider } from "@/lib/whatsapp/provider"
import { processAgendaCommand } from "@/lib/whatsapp/agendaHandler"
import { sendMetaTextMessage } from "@/lib/meta-whatsapp"
import { revalidatePath } from "next/cache"

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

    const leadIds = conversations.map(c => c.leadId)
    const deals = await prisma.deal.findMany({
        where: { organizationId: user.organizationId },
        include: { stage: true },
        orderBy: { createdAt: 'desc' }
    })

    // Serializando o retorno para o Client Component não quebrar com Datas
    return conversations.map(c => {
        // Encontra negócios que estajam associados opcionalmente ao user via tags ou etc. (Como leadId não existe, buscamos por title)
        // Solução temporária para o Inbox: Buscamos Deals que contém o nome do lead no titulo ou se a company cruzar (MVP)
        const leadName = c.lead?.name || 'Sem Nome'
        const cDeals = deals.filter(d => d.title.includes(leadName) || (d.companyId && d.companyId === c.leadId))
        return {
            id: c.id,
            name: c.lead?.name || 'Sem Nome',
            phone: c.lead?.phone || '',
            status: c.status,
            tags: c.tags || [],
            lgpdConsent: c.lead?.lgpdConsent || false,
            deals: cDeals.map(d => ({
                id: d.id,
                title: d.title,
                value: d.value ? Number(d.value) : 0,
                stageName: d.stage?.name || 'Sem Etapa'
            })),
            time: c.updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            lastMessage: c.messages[0]?.content || 'Nova conversa',
            isBotHandling: c.status === 'BOT_HANDLING',
            unread: 0,
            messages: [...c.messages].reverse().map(m => ({
                id: m.id,
                content: m.content || '',
                type: m.type,
                transcription: m.transcription || null,
                sender: (m.direction === 'OUTBOUND' ? (m.senderId ? 'me' : 'bot') : 'client') as "me" | "bot" | "client",
                time: m.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                status: (m.status === 'READ' ? 'read' : (m.status === 'DELIVERED' ? 'delivered' : 'sent')) as "read" | "delivered" | "sent"
            }))
        }
    })
}
/**
 * Alterna o controle da conversa entre Atendente (OPEN) e Chatbot (BOT_HANDLING)
 */
export async function toggleBotStatus(conversationId: string, isBotActive: boolean) {
    const user = await requireUser()

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
    })

    if (!conversation || conversation.organizationId !== user.organizationId) {
        throw new Error("Chat não encontrado ou permissão negada.")
    }

    await prisma.conversation.update({
        where: { id: conversationId },
        data: {
            status: isBotActive ? 'BOT_HANDLING' : 'OPEN'
        }
    })

    return { success: true }
}

/**
 * Envia uma mensagem de um Atendente/Usuário para o Lead via WhatsApp (Meta Graph API)
 */
export async function sendMessage(conversationId: string, content: string) {
    try {
        const user = await requireUser()

        // 1. Validar propriedade e obter formato do lead e da Organização para pegar o Token WZAPI
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                lead: true,
                organization: true
            }
        })

        if (!conversation || conversation.organizationId !== user.organizationId) {
            throw new Error("Chat não encontrado ou permissão negada.")
        }

        const org = conversation.organization;
        if (!org.metaOauthConnected || !org.phoneNumberId || !org.metaAccessToken) {
            throw new Error("Sua Agência não possui um Número de WhatsApp Atrelado via Meta Oficial. Conecte pelo Painel de Configurações Administrativas.");
        }

        // Interceptar comando "/agenda" antes de enviar para a API (Opcional Mantido)
        let messageContent = content
        try {
            const agendaResult = await processAgendaCommand(conversation.leadId, content)
            if (agendaResult) {
                messageContent = agendaResult
            }
        } catch (cmdErr: any) {
            console.error("[AGENDA ERROR]", cmdErr)
        }

        // 2. Disparar API do Facebook Cloud API v20.0
        const result = await sendMetaTextMessage(org.phoneNumberId, org.metaAccessToken, {
            number: conversation.lead.phone,
            text: messageContent
        })

        if (!result.success) {
            console.error("[META API HTTP ERROR]", result.error)
            throw new Error(result.error || "A API do Facebook bloqueou este envio temporariamente.");
        }

        // 3. Registrar "Saída" no banco de dados
        const novaMensagem = await prisma.message.create({
            data: {
                conversationId: conversation.id,
                direction: "OUTBOUND",
                content: messageContent,
                type: "TEXT",
                senderId: user.id,
                status: result.success ? "SENT" : "FAILED", // Em APIs Reais você muda de SENT pra DELIVERED via Webhooks depois
                // providerId:  Id da mensagem se a API retornar, senão nulo
                providerId: result?.data?.messageId || null
            }
        })

        // Atualizar updatedAt da conversa para ela subir na lista principal do Inbox
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() }
        })

        revalidatePath('/dashboard/inbox')

        return {
            id: novaMensagem.id,
            content: novaMensagem.content,
            sender: 'me' as const,
            time: novaMensagem.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status: result.success ? 'sent' : 'failed' as any
        }
    } catch (error: any) {
        console.error("[SendMessage Action Error]", error)
        throw new Error(error.message || "Falha intermitente ao enviar mensagem. Tente novamente.")
    }
}

/**
 * Atualiza o valor de um Deal (Card do Kanban)
 */
export async function updateDealValue(dealId: string, newValue: number) {
    const user = await requireUser()

    const deal = await prisma.deal.findUnique({
        where: { id: dealId }
    })

    if (!deal || deal.organizationId !== user.organizationId) {
        throw new Error("Deal não encontrado ou sem permissão.")
    }

    await prisma.deal.update({
        where: { id: dealId },
        data: { value: newValue }
    })

    return { success: true }
}

/**
 * Cria um novo Deal para um Lead através da Caixa de Entrada
 */
export async function createDealFromInbox(conversationId: string, title: string, value: number) {
    const user = await requireUser()

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { lead: true }
    })

    if (!conversation || conversation.organizationId !== user.organizationId) {
        throw new Error("Conversa não encontrada ou sem permissão.")
    }

    let pipeline = await prisma.pipeline.findFirst({
        where: { organizationId: user.organizationId },
        include: { stages: { orderBy: { order: 'asc' }, take: 1 } }
    })

    if (!pipeline || pipeline.stages.length === 0) {
        console.log("[CreateDeal] Criando Pipeline Padrão porque Organização não tinha nenhum.")
        pipeline = await prisma.pipeline.create({
            data: {
                organizationId: user.organizationId,
                name: "Funil de Vendas",
                stages: {
                    create: [
                        { name: "1. Triagem", order: 1 },
                        { name: "2. Qualificação", order: 2 },
                        { name: "3. Negociação", order: 3 },
                        { name: "4. Ganho", order: 4 }
                    ]
                }
            },
            include: { stages: { orderBy: { order: 'asc' }, take: 1 } }
        })
    }

    const savedDeal = await prisma.deal.create({
        data: {
            organizationId: user.organizationId,
            pipelineId: pipeline.id,
            stageId: pipeline.stages[0].id,
            title,
            value,
            ownerId: user.id
        },
        include: { stage: true }
    })

    revalidatePath('/dashboard/kanban')

    return {
        id: savedDeal.id,
        title: savedDeal.title,
        value: savedDeal.value,
        stageName: savedDeal.stage?.name || 'Sem Etapa'
    }
}

/**
 * Envia arquivo de Mídia pelo Chat e faz upload oficial na Cloud API Meta.
 */
export async function sendMediaMessage(conversationId: string, formData: FormData) {
    const user = await requireUser()
    const file = formData.get('file') as File
    if (!file) throw new Error("Arquivo não recebido no servidor.")

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { lead: true }
    })

    if (!conversation || conversation.organizationId !== user.organizationId) {
        throw new Error("Conversa não encontrada ou não autorizada.")
    }

    const provider = getWhatsAppProvider()

    let mediaId = ""
    let mediaType = "document"

    if (file.type.startsWith('image/')) mediaType = 'image'
    else if (file.type.startsWith('video/')) mediaType = 'video'
    else if (file.type.startsWith('audio/')) mediaType = 'audio'

    if (provider.uploadMedia) {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const uploadedId = await provider.uploadMedia(buffer, file.type, file.name)
        if (!uploadedId) throw new Error("A API da Meta recusou a Mídia. Verifique formato/tamanho.")
        mediaId = uploadedId
    } else {
        mediaId = `mock-media-${Date.now()}`
    }

    // Now send the message
    const result = await provider.sendMessage({
        to: conversation.lead.phone,
        mediaId: mediaId,
        mediaType: mediaType as 'document' | 'image' | 'audio' | 'video',
        mediaCaption: file.name
    })

    const finalContent = JSON.stringify({
        text: `[ENVIADO: ${mediaType.toUpperCase()}] ${file.name}`,
        mediaId,
        caption: file.name,
        type: mediaType.toUpperCase()
    })

    const msg = await prisma.message.create({
        data: {
            conversationId,
            senderId: user.id,
            direction: "OUTBOUND",
            type: mediaType.toUpperCase(),
            content: finalContent,
            status: result.success ? "SENT" : "FAILED",
            providerId: result.messageId || null
        }
    })

    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
    })

    return {
        id: msg.id,
        content: finalContent,
        type: msg.type,
        time: msg.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        sender: 'me' as const,
        status: 'sent' as const
    }
}

/**
 * Adiciona ou remove uma Tag (Ex: "Urgente", "VIP") de uma Conversa.
 */
export async function toggleTag(conversationId: string, tag: string) {
    const user = await requireUser()

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
    })

    if (!conversation || conversation.organizationId !== user.organizationId) {
        throw new Error("Chat não encontrado ou permissão negada.")
    }

    const currentTags = conversation.tags || []
    let newTags = [...currentTags]

    if (newTags.includes(tag)) {
        newTags = newTags.filter(t => t !== tag)
    } else {
        newTags.push(tag)
    }

    await prisma.conversation.update({
        where: { id: conversationId },
        data: { tags: newTags }
    })

    return { success: true, tags: newTags }
}

/**
 * Puxa o histórico de mensagens de uma conversa e solicita uma sugestão de cópia para a IA do Google Gemini
 */
export async function generateAiReply(conversationId: string) {
    try {
        const user = await requireUser()

        // 1. Validar e buscar conversa
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                lead: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 15 // Pega as ultimas 15 mensagens de contexto
                }
            }
        })

        if (!conversation || conversation.organizationId !== user.organizationId) {
            return { error: "Chat não encontrado ou permissão negada." }
        }

        if (!process.env.GEMINI_API_KEY) {
            return { error: "A chave do Google Gemini (GEMINI_API_KEY) não está configurada no servidor." }
        }

        // 2. Formatar o mapa de conversas para envio a Gemini API
        const reversedMessages = [...conversation.messages].reverse()
        const geminiContentBlocks: Array<{ role: 'user' | 'model', parts: { text: string }[] }> = []

        // Adiciona o histórico formatado
        reversedMessages.forEach((msg) => {
            if (!msg.content) return

            let prefix = ""
            if (msg.direction === 'INBOUND') {
                prefix = `[Cliente (${conversation.lead.name})]: `
                geminiContentBlocks.push({ role: 'user', parts: [{ text: prefix + msg.content }] })
            } else {
                prefix = `[Nós (Empresa)]: `
                geminiContentBlocks.push({ role: 'model', parts: [{ text: prefix + msg.content }] })
            }
        })

        const systemInstruction = `Você é um Assistente de Vendas inteligente e educado trabalhando no WhatsApp de uma empresa. O Lead com quem estamos conversando se chama "${conversation.lead.name}". Sua missão é ler o contexto recente da conversa e redigir uma sugestão ágil, calorosa e comercial para o atendente (humano) enviar em seguida. A resposta deve ser curta (1 a 3 parágrafos no máximo), ir direto ao ponto respondendo as dores do lead, usar 1 ou 2 emojis corporativos discretos e conduzir para o fechamento. Fale sempre em Português do Brasil de maneira natural para o WhatsApp, evite ser robótico.`

        // 3. Chamar Endpoint via fetch cru da API do Google Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: systemInstruction }]
                },
                contents: geminiContentBlocks,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 250
                }
            })
        })

        if (!response.ok) {
            const errorBody = await response.text()
            console.error("[generateAiReply] Google Gemini HTTP error body:", errorBody)
            return { error: "Falha na API do Google Gemini (Verifique limites e token)." }
        }

        const data = await response.json()
        const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!suggestion) {
            return { error: "A Inteligência Artificial do Google retornou um conteúdo vazio." }
        }

        return { suggestion: suggestion.trim() }

    } catch (error: any) {
        console.error("[generateAiReply] Action Error:", error)
        return { error: error.message || "Erro inesperado ao gerar reposta com o Gemini." }
    }
}
