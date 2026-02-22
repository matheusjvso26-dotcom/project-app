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

export async function getDealDetails(dealId: string) {
    try {
        const deal = await prisma.deal.findUnique({
            where: { id: dealId },
            include: {
                company: true,
                owner: { select: { name: true, email: true } },
                stage: { select: { name: true } },
                organization: { select: { name: true } }
            }
        })
        return deal
    } catch (error) {
        console.error("Failed to fetch deal details:", error)
        return null
    }
}
