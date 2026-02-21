'use server'

import prisma from "@/lib/prisma"

export async function updateDealStageAction(dealId: string, newStageId: string) {
    try {
        await prisma.deal.update({
            where: { id: dealId },
            data: { stageId: newStageId }
        })
        return { success: true }
    } catch (error) {
        console.error("Failed to update deal stage:", error)
        return { success: false, error: "Failed to update deal" }
    }
}
