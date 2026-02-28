'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function checkWzapiConnectionStatus() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado', status: 'DISCONNECTED' }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { organization: true }
    })

    if (!dbUser || !dbUser.organization) {
        return { error: 'Organização não encontrada', status: 'DISCONNECTED' }
    }

    const org = dbUser.organization

    if (org.wzapiStatus === 'CONNECTED' && org.wzapiInstanceId) {
        return {
            error: null,
            status: 'CONNECTED',
            instanceId: org.wzapiInstanceId
        }
    }

    return { error: null, status: 'DISCONNECTED' }
}

export async function saveWzapiCredentials(instanceId: string, token: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { organization: true }
    })

    if (!dbUser) return { error: 'Usuário não encontrado' }
    const org = dbUser.organization

    await prisma.organization.update({
        where: { id: org.id },
        data: {
            wzapiInstanceId: instanceId,
            wzapiToken: token,
            wzapiStatus: 'CONNECTED',
            metaOauthConnected: false // Desativa cloud api
        }
    })

    return { success: true }
}

export async function disconnectWzapiWhatsApp() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { organization: true }
    })

    const org = dbUser?.organization
    if (!org) return { error: 'Empresa não encontrada' }

    await prisma.organization.update({
        where: { id: org.id },
        data: {
            wzapiInstanceId: null,
            wzapiToken: null,
            wzapiStatus: 'DISCONNECTED'
        }
    })

    return { success: true }
}
