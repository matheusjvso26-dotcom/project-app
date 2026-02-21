'use client'

import React, { useState } from 'react'
import { Bot, Plus, Settings, MessageSquare, BrainCircuit, Activity, BookOpen, AlertCircle } from 'lucide-react'

// --- Mock Data ---
interface BotConfig {
    id: string
    name: string
    role: string
    status: 'active' | 'training' | 'offline'
    sessions: number
    resolutionRate: string
}

const mockBots: BotConfig[] = [
    { id: '1', name: 'FlowBot BANT', role: 'SDR de Qualificação', status: 'active', sessions: 1245, resolutionRate: '68%' },
    { id: '2', name: 'Suporte L1', role: 'Atendimento Dúvidas', status: 'training', sessions: 320, resolutionRate: '45%' },
]

export function ChatbotBoard() {
    const [bots] = useState<BotConfig[]>(mockBots)
    const [viewMode, setViewMode] = useState<'list' | 'training'>('list')
    const [activeBot, setActiveBot] = useState<BotConfig | null>(null)

    const openTraining = (bot: BotConfig) => {
        setActiveBot(bot)
        setViewMode('training')
    }

    if (viewMode === 'training' && activeBot) {
        return (
            <div className="flex flex-col h-full bg-slate-50/50">
                {/* Header */}
                <div className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setViewMode('list')} className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                            ← Voltar
                        </button>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Bot className="w-5 h-5 text-indigo-600" />
                            {activeBot.name} - Treinamento de Intenções
                        </h2>
                    </div>
                    <button className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors">
                        Salvar Modelo
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
                    {/* SLA Configuration */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                            <Activity className="w-4 h-4 text-indigo-600" /> Gatilhos SLA e Transbordo (Handoff)
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">SLA de Resposta Automática</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500">
                                    <option>Imediato (0s)</option>
                                    <option>Atraso Natural (3s)</option>
                                    <option>Pensando (5s)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Transbordo (Fallback para Humano)</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500">
                                    <option>Após 2 falhas de NLP</option>
                                    <option>Solicitação explícita do lead</option>
                                    <option>Nunca transferir</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Intents List */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 text-indigo-600" /> Mapeamento de Intenções
                            </h3>
                            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                <Plus className="w-3 h-3" /> Nova Intenção
                            </button>
                        </div>

                        <div className="divide-y divide-slate-100 flex-1 overflow-auto p-4 flex flex-col gap-4">
                            {/* Intent Card 1 */}
                            <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-indigo-300 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md">@intent_falar_humano</span>
                                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Ação: Transbordo (Handoff)</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-2">Frases de treinamento (Exemplos que o cliente digita):</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">falar com atendente</span>
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">quero suporte humano</span>
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">sair do robô</span>
                                </div>
                            </div>

                            {/* Intent Card 2 */}
                            <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-indigo-300 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md">@intent_saber_precos</span>
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Ação: Enviar Tabela + Push CRM</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-2">Frases de treinamento:</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">qual o valor?</span>
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">me passa a tabela de preços</span>
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">custa quanto</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-6xl mx-auto flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agentes de IA & Chatbots</h1>
                    <p className="text-sm text-slate-500 mt-1">Configure seus agentes virtuais, gerencie bases de conhecimento e monitore as métricas de retenção antes do transbordo.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors font-medium text-sm">
                    <Plus className="w-4 h-4" /> Novo Agente
                </button>
            </div>

            {/* Dashboard Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-500 mb-4">
                        <MessageSquare className="w-5 h-5" />
                        <h3 className="text-sm font-medium">Conversas IA (Mês)</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">1,565</span>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-500 mb-4">
                        <Activity className="w-5 h-5" />
                        <h3 className="text-sm font-medium">Taxa de Resolução</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">62.8%</span>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+4%</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-500 mb-4">
                        <AlertCircle className="w-5 h-5" />
                        <h3 className="text-sm font-medium">Handoffs (Humano)</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">582</span>
                        <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">+5%</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 rounded-xl border border-indigo-600 shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
                    <BrainCircuit className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-400/30" />
                    <div className="flex items-center gap-2 text-indigo-100 mb-4 relative z-10">
                        <BookOpen className="w-5 h-5" />
                        <h3 className="text-sm font-medium">Base de Conhecimento</h3>
                    </div>
                    <div className="relative z-10">
                        <span className="text-3xl font-bold line-clamp-1">8 Documentos</span>
                        <p className="text-xs text-indigo-200 mt-1">Última leitura: Hoje</p>
                    </div>
                </div>
            </div>

            {/* Bots List */}
            <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-4">Seus Agentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bots.map(bot => (
                    <div key={bot.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">{bot.name}</h3>
                                    <p className="text-sm text-slate-500">{bot.role}</p>
                                </div>
                            </div>
                            <div>
                                {bot.status === 'active' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">Online</span>}
                                {bot.status === 'training' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Treinando</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sessões Totais</p>
                                <p className="text-lg font-semibold text-slate-800">{bot.sessions}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Resolução (S/ Humano)</p>
                                <p className="text-lg font-semibold text-slate-800">{bot.resolutionRate}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button onClick={() => openTraining(bot)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors z-10">
                                <Settings className="w-4 h-4" /> Configurar Intenções
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New */}
                <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-colors min-h-[220px]">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm mb-3">
                        <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Criar Novo Agente</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-[200px]">Personalize os prompts e a base de conhecimento de um novo bot.</p>
                </div>
            </div>
        </div>
    )
}
