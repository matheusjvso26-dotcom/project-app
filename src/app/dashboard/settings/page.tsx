'use client'

import React, { useState } from 'react'
import { User, Bell, Lock, Building, Zap, Save } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')

    return (
        <div className="p-8 max-w-5xl mx-auto flex flex-col h-full bg-[#151515]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Configurações</h1>
                    <p className="text-sm text-zinc-400 mt-1">Gerencie sua conta, preferências do sistema e dados da organização.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#ff7b00] text-white rounded-lg shadow-sm hover:bg-[#e66a00] transition-colors font-medium text-sm">
                    <Save className="w-4 h-4" /> Salvar Alterações
                </button>
            </div>

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
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-[#252525] border border-white/10 flex items-center justify-center text-white text-2xl font-bold">
                                        M
                                    </div>
                                    <div>
                                        <button className="px-4 py-2 border border-white/10 bg-[#151515] text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-colors mb-2 block">
                                            Mudar Foto
                                        </button>
                                        <p className="text-xs text-zinc-500">JPG, GIF ou PNG. Tamanho máximo de 2MB.</p>
                                    </div>
                                </div>

                                <hr className="border-white/10" />

                                {/* Form */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Nome Completo</label>
                                        <input type="text" className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#ff7b00]/20 focus:border-[#ff7b00] transition-colors" defaultValue="Matheus" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Cargo / Função</label>
                                        <input type="text" className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#ff7b00]/20 focus:border-[#ff7b00] transition-colors" defaultValue="Administrador" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Endereço de E-mail</label>
                                        <input type="email" className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#ff7b00]/20 focus:border-[#ff7b00] transition-colors" defaultValue="matheus@exemplo.com" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Fuso Horário Local</label>
                                        <select className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#ff7b00]/20 focus:border-[#ff7b00] transition-colors appearance-none">
                                            <option>Horário de Brasília (BRT) - UTC-3</option>
                                            <option>Horário do Amazonas (AMT) - UTC-4</option>
                                        </select>
                                    </div>
                                </div>
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
        </div>
    )
}
