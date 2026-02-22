import React from 'react'
import { Save } from 'lucide-react'
import { requireAdmin } from '@/lib/auth-utils'
import { SettingsTabs } from './SettingsTabs'

export default async function SettingsPage() {
    const user = await requireAdmin()

    return (
        <div className="p-8 max-w-5xl mx-auto flex flex-col h-full bg-[#151515]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Configurações</h1>
                    <p className="text-sm text-zinc-400 mt-1">Gerencie sua conta, preferências do sistema e dados da organização.</p>
                </div>
                <button form="settings-profile-form" type="submit" className="flex items-center gap-2 px-4 py-2 bg-[#ff7b00] text-white rounded-lg shadow-sm hover:bg-[#e66a00] transition-colors font-medium text-sm">
                    <Save className="w-4 h-4" /> Salvar Alterações
                </button>
            </div>

            <SettingsTabs initialUser={user} />
        </div>
    )
}
