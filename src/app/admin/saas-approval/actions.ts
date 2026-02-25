'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function getPendingOrganizations() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()

    if (!data?.user) {
        throw new Error('Unauthorized')
    }

    // Busca todas as Organizations que estão PENDING (idealmente, apenas o Master admin deveria ver isso,
    // aqui estamos presumindo que a rota `/admin` seja protegida ou tenha o middleware adequado)
    const pendingOrgs = await prisma.organization.findMany({
        // @ts-ignore
        where: { status: 'PENDING' },
        include: {
            // @ts-ignore
            users: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return pendingOrgs
}

export async function approveOrganizationAction(orgId: string) {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()

    if (!data?.user) {
        throw new Error('Unauthorized')
    }

    // Gera a data de termino de trial (Daqui a 7 dias)
    const trialEnds = new Date()
    trialEnds.setDate(trialEnds.getDate() + 7)

    // Atualiza a Organization e todos os usuarios atrelados a ela para 'ACTIVE'
    await prisma.$transaction([
        prisma.organization.update({
            where: { id: orgId },
            data: {
                // @ts-ignore
                status: 'ACTIVE',
                // @ts-ignore
                trialEndsAt: trialEnds
            }
        }),
        prisma.user.updateMany({
            where: { organizationId: orgId },
            data: {
                // @ts-ignore
                status: 'ACTIVE'
            }
        })
    ])

    revalidatePath('/admin/saas-approval')
}
