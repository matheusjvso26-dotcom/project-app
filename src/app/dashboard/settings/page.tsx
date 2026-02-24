import React from 'react'
import { Save } from 'lucide-react'
import { requireAdmin } from '@/lib/auth-utils'
import { SettingsTabs } from './SettingsTabs'
import prisma from '@/lib/prisma'
import { getOrganizationUsers } from './team-actions'

export default async function SettingsPage() {
    const user = await requireAdmin()

    // Obter dados da organização do usuário
    const org = await prisma.organization.findUnique({
        where: { id: user.organizationId }
    })

    if (!org) throw new Error("Organização não encontrada")

    const orgUsers = await getOrganizationUsers()

    return (
        <div className="p-8 max-w-5xl mx-auto flex flex-col h-full bg-[#151515]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Configurações</h1>
                    <p className="text-sm text-zinc-400 mt-1">Gerencie sua conta, equipe, e preferências do sistema da organização.</p>
                </div>
                {/* O botão de Salvar agora ficará dinâmico dentro da Tab selecionada */}
            </div>

            <SettingsTabs
                initialUser={{ ...user, avatarUrl: null }}
                initialOrg={{ ...org, welcomeMessage: null, closureMessage: null, closureMinutes: 1440 }}
                initialTeam={orgUsers}
            />
        </div>
    )
}
