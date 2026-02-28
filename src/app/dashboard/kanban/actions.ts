'use server'

import prisma from "@/lib/prisma"
import { requireUser } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"

export async function updateDealStageAction(dealId: string, newStageId: string) {
    try {
        // Encontra o stage para verificar se é a última coluna ou se simboliza ganho/perda
        const stage = await prisma.stage.findUnique({
            where: { id: newStageId },
            include: {
                pipeline: {
                    include: {
                        stages: {
                            orderBy: { order: 'asc' }
                        }
                    }
                }
            }
        });

        if (!stage) throw new Error("Stage não encontrado.");

        let newStatus = "OPEN";
        const isLastStage = stage.pipeline.stages[stage.pipeline.stages.length - 1].id === newStageId;
        const stageNameLower = stage.name.toLowerCase();

        if (isLastStage || stageNameLower.includes('ganho') || stageNameLower.includes('won') || stageNameLower.includes('cliente')) {
            newStatus = "WON";
        } else if (stageNameLower.includes('perdido') || stageNameLower.includes('lost')) {
            newStatus = "LOST";
        }

        await prisma.deal.update({
            where: { id: dealId },
            data: {
                stageId: newStageId,
                status: newStatus
            }
        });

        revalidatePath('/dashboard/kanban');
        revalidatePath('/dashboard'); // Atualiza painel financeiro

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

export async function createKanbanDealAction(title: string, company: string, value: number, stageId: string) {
    const user = await requireUser()
    const stage = await prisma.stage.findUnique({ where: { id: stageId }, include: { pipeline: true } })
    if (!stage || stage.pipeline.organizationId !== user.organizationId) {
        throw new Error("Permissão Negada ou Etapa não encontrada.")
    }

    let companyId = null
    if (company && company.trim() !== '') {
        let companyObj = await prisma.company.findFirst({
            where: { organizationId: user.organizationId, name: company }
        })
        if (!companyObj) {
            companyObj = await prisma.company.create({
                data: {
                    organizationId: user.organizationId,
                    name: company
                }
            })
        }
        companyId = companyObj.id
    }

    const deal = await prisma.deal.create({
        data: {
            title,
            value,
            stageId,
            pipelineId: stage.pipelineId,
            organizationId: user.organizationId,
            ownerId: user.id,
            companyId
        }
    })

    revalidatePath('/dashboard/kanban')
    return { success: true, dealId: deal.id }
}
