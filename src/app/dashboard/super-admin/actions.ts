'use server'

import { requireSuperAdmin } from "@/lib/auth-utils"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Busca todas as Organizações (Clientes do SaaS) com estatísticas agregadas
 */
export async function getSaaSOrganizations() {
    await requireSuperAdmin()

    const orgs = await prisma.organization.findMany({
        include: {
            users: {
                select: { id: true, email: true, role: true, name: true, status: true }
            },
            _count: {
                select: { leads: true, deals: true, conversations: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return orgs.map(org => ({
        id: org.id,
        name: org.name,
        planTier: org.planTier,
        status: org.status as 'PENDING' | 'ACTIVE' | 'SUSPENDED',
        createdAt: org.createdAt.toISOString(),
        ownerEmail: org.users.find(u => u.role === 'ADMIN' || u.role === 'SUPERADMIN')?.email || 'N/A',
        usersCount: org.users.length,
        leadsCount: org._count.leads,
        dealsCount: org._count.deals,
        metaOauthConnected: org.metaOauthConnected,
        wabaId: org.wabaId,
        phoneNumberId: org.phoneNumberId
    }))
}

/**
 * Retorna as Estatísticas Globais pro Header do SuperAdmin
 */
export async function getGlobalStats() {
    await requireSuperAdmin()

    const [totalOrgs, totalLeads, totalDeals, totalRevenue] = await Promise.all([
        prisma.organization.count(),
        prisma.lead.count(),
        prisma.deal.count(),
        prisma.deal.aggregate({
            _sum: { value: true },
            where: { status: 'WON' }
        })
    ])

    return {
        totalOrgs,
        totalLeads,
        totalDeals,
        totalRevenue: totalRevenue._sum.value || 0
    }
}

/**
 * Suspende o Acesso de um Cliente (Bloqueia Login em toda a Org)
 */
export async function toggleOrganizationStatus(orgId: string, currentStatus: string) {
    await requireSuperAdmin()

    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'

    await prisma.organization.update({
        where: { id: orgId },
        data: { status: newStatus }
    })

    // Suspende também os usuários vinculados para impedir sessão (Opcional, mas seguro)
    await prisma.user.updateMany({
        where: { organizationId: orgId },
        data: { status: newStatus }
    })

    revalidatePath('/dashboard/super-admin')
    return { success: true, newStatus }
}

/**
 * Deleta PERMANENTEMENTE um Inquilino do Sistema (OnDelete Cascade)
 */
export async function deleteOrganization(orgId: string) {
    await requireSuperAdmin()

    await prisma.organization.delete({
        where: { id: orgId }
    })

    revalidatePath('/dashboard/super-admin')
    return { success: true }
}

/**
 * Força a configuração da API Oficial (Meta) para uma Empresa específica
 */
export async function updateOrganizationMetaApi(orgId: string, wabaId: string, phoneId: string, token: string) {
    await requireSuperAdmin()

    await prisma.organization.update({
        where: { id: orgId },
        data: {
            wabaId: wabaId,
            phoneNumberId: phoneId,
            metaAccessToken: token,
            metaOauthConnected: true,
            wzapiStatus: 'DISCONNECTED' // Derruba qualquer concorrente local
        }
    })

    revalidatePath('/dashboard/super-admin')
    return { success: true }
}
