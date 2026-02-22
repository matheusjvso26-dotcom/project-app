'use client'

import React, { useState } from 'react'
import { User, Bell, Lock, Building, Zap, Save, Loader2, Bot } from 'lucide-react'
import { cn } from "@/lib/utils"
import { User as PrismaUser, Organization as PrismaOrganization } from '@prisma/client'
import { updateUserProfile, updateAvatarUrl, updateOrganizationBotSettings } from './actions'
import { AvatarUpload } from '@/components/avatar-upload'

interface SettingsTabsProps {
    initialUser: PrismaUser
    initialOrg: PrismaOrganization
}

export function SettingsTabs({ initialUser, initialOrg }: SettingsTabsProps) {
    const [activeTab, setActiveTab] = useState('profile')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    async function handleProfileSubmit(formData: FormData) {
        setIsLoading(true)
        setMessage(null)

        const result = await updateUserProfile(formData)

        if (result?.error) {
            setMessage({ type: 'error', text: result.error })
        } else if (result?.success) {
            setMessage({ type: 'success', text: result.message || 'Atualizado com sucesso!' })
        }

        setIsLoading(false)
    }

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex-shrink-0">
                <nav className="flex flex-col gap-1">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'profile' ? "bg-[#1c1c1c] text-[#ff7b00] border border-white/5" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}>
                        <User className="w-4 h-4" /> Perfil Pessoal
                    </button>
                    <button
                        onClick={() => setActiveTab('org')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'org' ? "bg-[#1c1c1c] text-[#ff7b00] border border-white/5" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}>
                        <Building className="w-4 h-4" /> Organização e Faturamento
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'notifications' ? "bg-[#1c1c1c] text-[#ff7b00] border border-white/5" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}>
                        <Bell className="w-4 h-4" /> Notificações
                    </button>
                    <button
                        onClick={() => setActiveTab('bots')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'bots' ? "bg-[#1c1c1c] text-[#ff7b00] border border-white/5" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}>
                        <Bot className="w-4 h-4" /> WhatsApp Automaker
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'security' ? "bg-[#1c1c1c] text-[#ff7b00] border border-white/5" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}>
                        <Lock className="w-4 h-4" /> Segurança e Acesso
                    </button>
                    <button
                        onClick={() => setActiveTab('api')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'api' ? "bg-[#1c1c1c] text-[#ff7b00] border border-white/5" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}>
                        <Zap className="w-4 h-4" /> Integrações (API)
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
                {activeTab === 'profile' && (
                    <>
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-lg font-bold text-white">Perfil Pessoal</h2>
                            <p className="text-sm text-zinc-400 mt-1">Atualize suas informações pessoais e email de login.</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Avatar */}
                            <AvatarUpload
                                currentAvatarUrl={initialUser.avatarUrl}
                                userName={initialUser.name}
                                onUploadSuccess={async (newUrl) => {
                                    setIsLoading(true);
                                    setMessage(null);

                                    const result = await updateAvatarUrl(newUrl);

                                    if (result?.error) {
                                        setMessage({ type: 'error', text: result.error });
                                    } else if (result?.success) {
                                        setMessage({ type: 'success', text: result.message || 'Foto atualizada!' });
                                    }
                                    setIsLoading(false);
                                }}
                            />

                            <hr className="border-white/10" />

                            {message && (
                                <div className={cn(
                                    "p-4 rounded-lg text-sm font-medium",
                                    message.type === 'success' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                )}>
                                    {message.text}
                                </div>
                            )}

                            {/* Form */}
                            <form id="settings-profile-form" action={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Nome Completo</label>
                                    <input name="name" type="text" className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#ff7b00]/20 focus:border-[#ff7b00] transition-colors" defaultValue={initialUser.name} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Cargo / Função</label>
                                    {/* Notice we are saving role on Prisma only if it's enum ADMIN/SDR, so maybe it's better to leave this as readonly for now or manage properly */}
                                    <input type="text" className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#ff7b00]/20 focus:border-[#ff7b00] transition-colors opacity-50 cursor-not-allowed" defaultValue={initialUser.role} disabled />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Endereço de E-mail</label>
                                    <input type="email" className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#ff7b00]/20 focus:border-[#ff7b00] transition-colors opacity-50 cursor-not-allowed" defaultValue={initialUser.email} disabled />
                                    <p className="text-xs text-zinc-500 mt-2">O e-mail não pode ser alterado por aqui no momento.</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Fuso Horário Local</label>
                                    <select className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#ff7b00]/20 focus:border-[#ff7b00] transition-colors appearance-none">
                                        <option>Horário de Brasília (BRT) - UTC-3</option>
                                        <option>Horário do Amazonas (AMT) - UTC-4</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </>
                )}

                {activeTab === 'bots' && (
                    <>
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white">Robôs e Automações WhatsApp</h2>
                                <p className="text-sm text-zinc-400 mt-1">Defina mensagens automáticas para otimizar o atendimento de novos Leads e encerramentos.</p>
                            </div>
                            <button form="settings-bots-form" type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-[#ff7b00] text-white rounded-lg shadow-sm hover:bg-[#e66a00] transition-colors font-medium text-sm disabled:opacity-50">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
                            </button>
                        </div>
                        <div className="p-6">
                            {message && (
                                <div className={cn(
                                    "p-4 rounded-lg text-sm font-medium mb-6",
                                    message.type === 'success' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                )}>
                                    {message.text}
                                </div>
                            )}

                            <form id="settings-bots-form" action={async (formData) => {
                                setIsLoading(true)
                                setMessage(null)
                                const result = await updateOrganizationBotSettings(formData)
                                if (result?.error) setMessage({ type: 'error', text: result.error })
                                else if (result?.success) setMessage({ type: 'success', text: result.message })
                                setIsLoading(false)
                            }} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Mensagem de Recepção (First Contact)</label>
                                    <textarea name="welcomeMessage" rows={3} className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#ff7b00]/20 focus:border-[#ff7b00] transition-colors resize-none mb-1" placeholder="Ex: Olá! Seja muito bem-vindo ao nosso atendimento." defaultValue={initialOrg.welcomeMessage || ''} />
                                    <p className="text-xs text-zinc-500">O funil responderá instantaneamente essa mensagem para Leads não cadastrados ao primeiro oi.</p>
                                </div>
                                <hr className="border-white/10" />
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Mensagem de Encerramento Automático (Inatividade)</label>
                                    <textarea name="closureMessage" rows={3} className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#ff7b00]/20 focus:border-[#ff7b00] transition-colors resize-none mb-1" placeholder="Ex: Devido à falta de comunicação nas últimas horas, estamos encerrando esse chat." defaultValue={initialOrg.closureMessage || ''} />
                                    <p className="text-xs text-zinc-500">Texto amigável disparado automaticamente quando o Lead sumir no meio do atendimento de longo prazo.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Tempo Limite de Inatividade (Minutos Mínimo de 15)</label>
                                    <input name="closureMinutes" type="number" min="15" className="w-full max-w-[200px] bg-[#151515] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#ff7b00]/20 focus:border-[#ff7b00] transition-colors" defaultValue={initialOrg.closureMinutes} />
                                </div>
                            </form>
                        </div>
                    </>
                )}

                {activeTab === 'org' && (
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-white">Organização e Faturamento</h2>
                        <p className="text-sm text-zinc-400 mt-1 mb-6">Em breve: gerencie a assinatura e os dados da sua empresa aqui.</p>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-white">Notificações</h2>
                        <p className="text-sm text-zinc-400 mt-1 mb-6">Em breve: defina quais alertas você deseja receber por e-mail ou WhatsApp.</p>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-white">Segurança e Acesso</h2>
                        <p className="text-sm text-zinc-400 mt-1 mb-6">Em breve: altere sua senha e configure a autenticação em duas etapas.</p>
                    </div>
                )}

                {activeTab === 'api' && (
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-white">Integrações (API)</h2>
                        <p className="text-sm text-zinc-400 mt-1 mb-6">Em breve: gerencie seus tokens de API e webhooks do sistema.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
