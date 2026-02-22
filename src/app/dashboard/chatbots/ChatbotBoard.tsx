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
    { id: '1', name: 'FLY UP Bot BANT', role: 'SDR de Qualificação', status: 'active', sessions: 1245, resolutionRate: '68%' },
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
            <div className="flex flex-col h-full bg-[#151515]">
                {/* Header */}
                <div className="h-16 flex-shrink-0 bg-[#1c1c1c] border-b border-border/10 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setViewMode('list')} className="text-sm text-zinc-400 hover:text-white font-medium transition-colors">
                            ← Voltar
                        </button>
                        <div className="h-4 w-px bg-white/10"></div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Bot className="w-5 h-5 text-[#ff7b00]" />
                            {activeBot.name} - Treinamento de Intenções
                        </h2>
                    </div>
                    <button className="px-4 py-1.5 text-sm font-medium text-white bg-[#ff7b00] hover:bg-[#e66a00] rounded-md shadow-lg shadow-[#ff7b00]/20 transition-colors">
                        Salvar Modelo
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
                    {/* SLA Configuration */}
                    <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                            <Activity className="w-4 h-4 text-[#ff7b00]" /> Gatilhos SLA e Transbordo (Handoff)
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">SLA de Resposta Automática</label>
                                <select className="w-full bg-[#151515] border border-white/10 rounded-md px-3 py-2 text-sm text-zinc-200 outline-none focus:border-[#ff7b00]/50">
                                    <option>Imediato (0s)</option>
                                    <option>Atraso Natural (3s)</option>
                                    <option>Pensando (5s)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Transbordo (Fallback para Humano)</label>
                                <select className="w-full bg-[#151515] border border-white/10 rounded-md px-3 py-2 text-sm text-zinc-200 outline-none focus:border-[#ff7b00]/50">
                                    <option>Após 2 falhas de NLP</option>
                                    <option>Solicitação explícita do lead</option>
                                    <option>Nunca transferir</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Intents List */}
                    <div className="bg-[#1c1c1c] border border-white/5 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                        <div className="p-4 bg-[#151515]/50 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 text-[#ff7b00]" /> Mapeamento de Intenções
                            </h3>
                            <button className="text-xs font-semibold text-[#ff7b00] hover:text-[#ff7b00]/80 flex items-center gap-1 transition-colors">
                                <Plus className="w-3 h-3" /> Nova Intenção
                            </button>
                        </div>

                        <div className="divide-y divide-white/5 flex-1 overflow-auto p-4 flex flex-col gap-4">
                            {/* Intent Card 1 */}
                            <div className="border border-white/5 rounded-lg p-4 bg-[#151515] hover:border-[#ff7b00]/30 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="inline-block px-2.5 py-1 bg-[#2a2a2a] text-[#ff7b00] text-xs font-bold rounded-md border border-[#ff7b00]/10">@intent_falar_humano</span>
                                    <span className="text-xs font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Ação: Transbordo (Handoff)</span>
                                </div>
                                <p className="text-xs text-zinc-500 mb-2">Frases de treinamento (Exemplos que o cliente digita):</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-[#1c1c1c] border border-white/5 text-zinc-400 text-xs px-2 py-1 rounded">falar com atendente</span>
                                    <span className="bg-[#1c1c1c] border border-white/5 text-zinc-400 text-xs px-2 py-1 rounded">quero suporte humano</span>
                                    <span className="bg-[#1c1c1c] border border-white/5 text-zinc-400 text-xs px-2 py-1 rounded">sair do robô</span>
                                </div>
                            </div>

                            {/* Intent Card 2 */}
                            <div className="border border-white/5 rounded-lg p-4 bg-[#151515] hover:border-[#ff7b00]/30 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="inline-block px-2.5 py-1 bg-[#2a2a2a] text-[#ff7b00] text-xs font-bold rounded-md border border-[#ff7b00]/10">@intent_saber_precos</span>
                                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Ação: Enviar Tabela + Push CRM</span>
                                </div>
                                <p className="text-xs text-zinc-500 mb-2">Frases de treinamento:</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-[#1c1c1c] border border-white/5 text-zinc-400 text-xs px-2 py-1 rounded">qual o valor?</span>
                                    <span className="bg-[#1c1c1c] border border-white/5 text-zinc-400 text-xs px-2 py-1 rounded">me passa a tabela de preços</span>
                                    <span className="bg-[#1c1c1c] border border-white/5 text-zinc-400 text-xs px-2 py-1 rounded">custa quanto</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-6xl mx-auto flex flex-col h-full bg-[#151515]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Agentes de IA & Chatbots</h1>
                    <p className="text-sm text-zinc-400 mt-1">Configure seus agentes virtuais, gerencie bases de conhecimento e monitore as métricas de retenção antes do transbordo.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#ff7b00] hover:bg-[#e66a00] text-white rounded-lg shadow-lg shadow-[#ff7b00]/20 transition-colors font-medium text-sm">
                    <Plus className="w-4 h-4" /> Novo Agente
                </button>
            </div>

            {/* Dashboard Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#1c1c1c] p-5 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-zinc-400 mb-4">
                        <MessageSquare className="w-5 h-5" />
                        <h3 className="text-sm font-medium">Conversas IA (Mês)</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">1,565</span>
                        <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">+12%</span>
                    </div>
                </div>

                <div className="bg-[#1c1c1c] p-5 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-zinc-400 mb-4">
                        <Activity className="w-5 h-5" />
                        <h3 className="text-sm font-medium">Taxa de Resolução</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">62.8%</span>
                        <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">+4%</span>
                    </div>
                </div>

                <div className="bg-[#1c1c1c] p-5 rounded-xl border border-white/5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-zinc-400 mb-4">
                        <AlertCircle className="w-5 h-5" />
                        <h3 className="text-sm font-medium">Handoffs (Humano)</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">582</span>
                        <span className="text-xs font-semibold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">+5%</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#ff8a00] to-[#e65c00] p-5 rounded-xl border-none shadow-lg shadow-[#ff7b00]/10 flex flex-col justify-between text-white relative overflow-hidden group">
                    <BrainCircuit className="absolute -right-4 -bottom-4 w-24 h-24 text-white/20 transition-transform group-hover:scale-110" />
                    <div className="flex items-center gap-2 text-white/90 mb-4 relative z-10">
                        <BookOpen className="w-5 h-5" />
                        <h3 className="text-sm font-medium">Base de Conhecimento</h3>
                    </div>
                    <div className="relative z-10">
                        <span className="text-3xl font-bold line-clamp-1">8 Documentos</span>
                        <p className="text-xs text-white/70 mt-1">Última leitura: Hoje</p>
                    </div>
                </div>
            </div>

            {/* Bots List */}
            <h2 className="text-lg font-bold text-white tracking-tight mb-4">Seus Agentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bots.map(bot => (
                    <div key={bot.id} className="bg-[#1c1c1c] border border-white/5 rounded-xl p-6 shadow-sm hover:border-[#ff7b00]/30 transition-all cursor-pointer group flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-[#ff7b00] border border-white/5 group-hover:bg-[#ff7b00] group-hover:text-white transition-colors">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white">{bot.name}</h3>
                                    <p className="text-sm text-zinc-400">{bot.role}</p>
                                </div>
                            </div>
                            <div>
                                {bot.status === 'active' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">Online</span>}
                                {bot.status === 'training' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">Treinando</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                            <div>
                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Sessões Totais</p>
                                <p className="text-lg font-semibold text-white">{bot.sessions}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Resolução (S/ Humano)</p>
                                <p className="text-lg font-semibold text-white">{bot.resolutionRate}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button onClick={() => openTraining(bot)} className="text-sm font-medium text-zinc-400 hover:text-[#ff7b00] flex items-center gap-1 transition-colors z-10">
                                <Settings className="w-4 h-4" /> Configurar Intenções
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New */}
                <div className="bg-[#151515] border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#ff7b00]/30 hover:bg-[#1c1c1c] transition-colors min-h-[220px]">
                    <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center text-zinc-500 shadow-sm mb-3">
                        <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">Criar Novo Agente</h3>
                    <p className="text-sm text-zinc-500 mt-1 max-w-[200px]">Personalize os prompts e a base de conhecimento de um novo bot.</p>
                </div>
            </div>
        </div>
    )
}
