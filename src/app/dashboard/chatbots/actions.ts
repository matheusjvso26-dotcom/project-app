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
