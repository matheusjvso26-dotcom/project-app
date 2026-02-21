'use client'

import React from 'react'
import { User, Bell, Lock, Building, Zap, Save } from 'lucide-react'

export default function SettingsPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto flex flex-col h-full bg-slate-50/50">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configurações</h1>
                    <p className="text-sm text-slate-500 mt-1">Gerencie sua conta, preferências do sistema e dados da organização.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors font-medium text-sm">
                    <Save className="w-4 h-4" /> Salvar Alterações
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="flex flex-col gap-1">
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700">
                            <User className="w-4 h-4" /> Perfil Pessoal
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                            <Building className="w-4 h-4" /> Organização e Faturamento
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                            <Bell className="w-4 h-4" /> Notificações
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                            <Lock className="w-4 h-4" /> Segurança e Acesso
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                            <Zap className="w-4 h-4" /> Integrações (API)
                        </button>
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900">Perfil Pessoal</h2>
                        <p className="text-sm text-slate-500 mt-1">Atualize suas informações pessoais e email de login.</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                                M
                            </div>
                            <div>
                                <button className="px-4 py-2 border border-slate-300 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition-colors mb-2 block">
                                    Mudar Foto
                                </button>
                                <p className="text-xs text-slate-500">JPG, GIF ou PNG. Tamanho máximo de 2MB.</p>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo</label>
                                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" defaultValue="Matheus" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Cargo / Função</label>
                                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" defaultValue="Administrador" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Endereço de E-mail</label>
                                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" defaultValue="matheus@exemplo.com" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Fuso Horário Local</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                                    <option>Horário de Brasília (BRT) - UTC-3</option>
                                    <option>Horário do Amazonas (AMT) - UTC-4</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
