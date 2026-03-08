'use server'

import prisma from "@/lib/prisma"
import { requireUser } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"

/**
 * Salva o JSON da árvore do fluxo de um robô específico
 */
export async function saveVisualFlow(botName: string, workflowData: any) {
    const user = await requireUser()

    const jsonString = JSON.stringify(workflowData)

    // Tentar encontrar uma automation existente com esse nome
    let automation = await prisma.automation.findFirst({
        where: {
            organizationId: user.organizationId,
            name: botName
        }
    })

    if (automation) {
        await prisma.automation.update({
            where: { id: automation.id },
            data: { workflowJson: jsonString }
        })
    } else {
        await prisma.automation.create({
            data: {
                organizationId: user.organizationId,
                name: botName,
                triggerType: "INBOUND_MESSAGE",
                workflowJson: jsonString
            }
        })
    }

    revalidatePath('/dashboard/chatbots')
    return { success: true }
}

/**
 * Retorna todos os robôs (Automações) do usuário
 */
export async function getBots() {
    const user = await requireUser()
    const bots = await prisma.automation.findMany({
        where: { organizationId: user.organizationId },
        orderBy: { createdAt: 'desc' }
    })

    // Tratamos no servidor as conversões de Interface
    return bots.map(b => ({
        id: b.id,
        name: b.name,
        role: b.triggerType === 'INBOUND_MESSAGE' ? 'Atendente Omnichannel' : 'Automação Interna',
        status: b.isActive ? 'active' : 'offline',
        sessions: 0, // Mockado por enquanto até contagem analítica real
        resolutionRate: '0%', // Mockado até analytics real
        workflowJson: b.workflowJson
    }))
}

/**
 * Toggles a bot status (active/offline)
 */
export async function toggleBotActive(botId: string, currentState: boolean) {
    const user = await requireUser()

    // Safety check - user can only toggle their own org bots
    const bot = await prisma.automation.findFirst({
        where: { id: botId, organizationId: user.organizationId }
    })

    if (!bot) throw new Error("Acesso negado.")

    await prisma.automation.update({
        where: { id: botId },
        data: { isActive: !currentState }
    })

    revalidatePath('/dashboard/chatbots')
    return { success: true }
}

/**
 * Cria diretamente o Bot Consignado M2R
 */
export async function createDefaultConsignadoBot(initialNodes: any, initialEdges: any) {
    const user = await requireUser()

    const jsonString = JSON.stringify({ nodes: initialNodes, edges: initialEdges })

    await prisma.automation.create({
        data: {
            organizationId: user.organizationId,
            name: "Assistente Consignado Oficial",
            triggerType: "INBOUND_MESSAGE",
            workflowJson: jsonString,
            isActive: true
        }
    })

    revalidatePath('/dashboard/chatbots')
    return { success: true }
}

/**
 * Deleta uma Automação Visual (Bot)
 */
export async function deleteBot(botId: string) {
    const user = await requireUser()
    await prisma.automation.deleteMany({
        where: { id: botId, organizationId: user.organizationId }
    })
    revalidatePath('/dashboard/chatbots')
    return { success: true }
}

/**
 * Gera os nós e arestas de um fluxo usando o Google Gemini
 */
export async function generateFlowWithGemini(prompt: string) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("GEMINI_API_KEY não configurada no servidor (.env).")

    const systemPrompt = `Você é um especialista em criar fluxos conversacionais (Chatbots).
O usuário vai pedir uma automação por texto.
Você precisa retornar puramente um JSON válido contendo os arrays 'nodes' e 'edges' necessários para ser renderizado no React Flow.
Sempre inclua um node gatilho no topo:
[
  { "id": "1", "type": "trigger", "position": { "x": 250, "y": 50 }, "data": { "label": "Gatilho Inicial", "description": "Início da Conversa" } }
]
Depois insira os nodes tipo "message", "action", ou "condition" conectando uns aos outros.
Exemplo de message node:
  { "id": "2", "type": "message", "position": { "x": 250, "y": 200 }, "data": { "label": "Enviar Mensagem", "content": "Olá! Bem vindo." } }

Exemplo de connection edge:
  { "id": "e1-2", "source": "1", "target": "2" }

Return APENAS o JSON com a raiz: {"nodes": [...], "edges": [...]}. Espace os Y em 150 pixels um do outro para ficar organizado visualmente.`

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error?.message || "Erro retornado da API do Gemini.")

        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (!jsonText) throw new Error("IA não retornou um formato de texto válido.")

        const parsed = JSON.parse(jsonText.trim())
        return { success: true, nodes: parsed.nodes || [], edges: parsed.edges || [] }
    } catch (e: any) {
        console.error("Gemini Error:", e)
        throw new Error(e.message || "Erro no processamento da Inteligência Artificial.")
    }
}
