'use server'

import prisma from "@/lib/prisma"
import { requireUser } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"

export async function createLeadWithDeal(data: { name: string, phone: string, document: string, company: string, value: number }) {
    const user = await requireUser()

    if (!data.name || !data.phone) {
        throw new Error("Nome e Telefone são obrigatórios.")
    }

    // Identifica ou cria a empresa (se fornecida)
    let companyId = null
    if (data.company && data.company.trim() !== '') {
        let company = await prisma.company.findFirst({
            where: { organizationId: user.organizationId, name: data.company }
        })
        if (!company) {
            company = await prisma.company.create({
                data: {
                    organizationId: user.organizationId,
                    name: data.company
                }
            })
        }
        companyId = company.id
    }

    // Cria o Lead
    const lead = await prisma.lead.create({
        data: {
            organizationId: user.organizationId,
            name: data.name,
            phone: data.phone,
            lgpdConsent: true
        }
    })

    // Adiciona o negocio (Deal) automaticamente na primeira etapa do pipeline
    const pipeline = await prisma.pipeline.findFirst({
        where: { organizationId: user.organizationId },
        include: {
            stages: { orderBy: { order: 'asc' }, take: 1 }
        }
    })

    if (pipeline && pipeline.stages.length > 0) {
        await prisma.deal.create({
            data: {
                organizationId: user.organizationId,
                pipelineId: pipeline.id,
                stageId: pipeline.stages[0].id,
                leadId: lead.id,
                companyId: companyId,
                title: `Contato Manual: ${data.name}`,
                value: data.value,
                ownerId: user.id
            }
        })
    }

    revalidatePath('/dashboard/contacts')
    revalidatePath('/dashboard/kanban')

    return { success: true }
}
