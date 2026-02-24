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
