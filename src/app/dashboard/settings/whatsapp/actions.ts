'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { createInstance, getInstanceStatus, logoutInstance } from '@/lib/wzapi'

export async function checkWhatsAppStatus() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado', qrCode: null, status: 'DISCONNECTED' }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { organization: true }
    })

    if (!dbUser || !dbUser.organization) {
        return { error: 'Organização não encontrada', qrCode: null, status: 'DISCONNECTED' }
    }

    const org = dbUser.organization

    // 1. Se não tem instância registrada, retorna DISCONNECTED
    if (!org.wzapiInstanceId) {
        return { error: null, qrCode: null, status: 'DISCONNECTED' }
    }

    // 2. Se tem instância, pede pro WZAPI qual o status real (Online ou QRCode pendente)
    const wzResp = await getInstanceStatus(org.wzapiInstanceId, org.wzapiToken || '')

    if (!wzResp.success || !wzResp.data) {
        return { error: null, qrCode: null, status: 'DISCONNECTED' } // Falha de comunicação ou apagou lá
    }

    const state = wzResp.data.state || wzResp.data.status // Depende do JSON retornado pelo WZAPI
    let newStatus = org.wzapiStatus

    if (state === 'open' || state === 'connected') {
        newStatus = 'CONNECTED'
    } else if (state === 'connecting' || state === 'qr') {
        newStatus = 'QRCODE_READY'
    } else {
        newStatus = 'DISCONNECTED'
    }

    // Sincroniza Banco
    if (newStatus !== org.wzapiStatus) {
        await prisma.organization.update({
            where: { id: org.id },
            data: { wzapiStatus: newStatus }
        })
    }

    return {
        error: null,
        status: newStatus,
        qrCode: wzResp.data.qrcode || null // String base64 provida pelo WZAPI (se em fase de QR)
    }
}

export async function generateWhatsAppQR() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { organization: true }
    })

    if (!dbUser) return { error: 'Usuário não encontrado' }

    const org = dbUser.organization
    // Nome único da instância baseada no ID da Empresa
    const instanceName = `org_${org.id.split('-')[0]}_${Date.now()}`

    // Chama nossa Lib WZAPI
    const result = await createInstance(instanceName)

    if (!result.success) {
        return { error: 'Falha ao comunicar com os servidores do WhatsApp' }
    }

    // Sucesso ao Criar Instancia. O WZAPI retorna um Token para gerenciar só essa.
    const instanceToken = result.data.hash || result.data.token || ''

    // Salva no Banco as chaves e muda status para aguardando Leitura
    await prisma.organization.update({
        where: { id: org.id },
        data: {
            wzapiInstanceId: instanceName,
            wzapiToken: instanceToken,
            wzapiStatus: 'QRCODE_READY'
        }
    })

    // Retorna Ok para o Front começar a fazer Polling (perguntar pela Base64)
    return { success: true }
}

export async function disconnectWhatsApp() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { organization: true }
    })

    const org = dbUser?.organization
    if (!org || !org.wzapiInstanceId) return { error: 'Nenhuma conexão ativa encontrada' }

    // Envia Delete HTTP pro Backend Oficial da WZAPI apagar a sessão
    await logoutInstance(org.wzapiInstanceId, org.wzapiToken || '')

    // Limpa o banco de dados local da Empresa
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
