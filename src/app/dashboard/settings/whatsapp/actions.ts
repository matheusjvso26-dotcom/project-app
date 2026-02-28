'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

/**
 * Checa a conexão atual do Meta Cloud (Business Account Logada).
 */
export async function checkMetaConnectionStatus() {
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

    if (org.metaOauthConnected && org.phoneNumberId) {
        return {
            error: null,
            status: 'CONNECTED',
            wabaId: org.wabaId,
            phoneNumberId: org.phoneNumberId
        }
    }

    return { error: null, status: 'DISCONNECTED' }
}

/**
 * Simula a troca do Token Oauth (Code) retornado pelo Popup do Facebook SDK
 * por um Token de Acesso Longo, amarrando a Phone Number ID na Plataforma B2B.
 */
export async function exchangeMetaCodeForToken(oauthCode: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { organization: true }
    })

    if (!dbUser) return { error: 'Usuário não encontrado' }
    const org = dbUser.organization

    // NOTA: Num cenário Real em Produção, nós enviaríamos o `oauthCode` 
    // para a API do Facebook pegar o Access Token e o WabaID.
    // fetch(`graph.facebook.com/v20.0/oauth/access_token?code=${oauthCode}...`)

    // Simulação do resultado positivo para fluir a demonstração visual:
    const mockWabaId = `waba_${Date.now()}`
    const mockPhoneId = `phone_${Date.now()}`
    const mockToken = `EAAGm0PX...${Date.now()}...mock`

    await prisma.organization.update({
        where: { id: org.id },
        data: {
            wabaId: mockWabaId,
            phoneNumberId: mockPhoneId,
            metaAccessToken: mockToken,
            metaOauthConnected: true
        }
    })

    return { success: true }
}

/**
 * Revoga as permissões de Escrita do App e apaga o vínculo do SaaS.
 */
export async function disconnectMetaWhatsApp() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { organization: true }
    })

    const org = dbUser?.organization
    if (!org) return { error: 'Empresa não encontrada' }

    // Limpa o banco de dados local da Empresa cortando a Ponte
    await prisma.organization.update({
        where: { id: org.id },
        data: {
            wabaId: null,
            phoneNumberId: null,
            metaAccessToken: null,
            metaOauthConnected: false
        }
    })

    return { success: true }
}
