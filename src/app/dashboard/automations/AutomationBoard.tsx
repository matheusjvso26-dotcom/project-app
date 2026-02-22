'use client'

import React, { useState } from 'react'
import { Plus, Settings2, Play, Pause, GitPullRequestDraft, MessageSquarePlus, Clock, Zap, ArrowRight, UserPlus, FileSignature, CheckCircle2, Bot } from 'lucide-react'

// --- Mock Data ---
interface Workflow {
    id: string
    name: string
    trigger: string
    status: 'active' | 'draft' | 'paused'
    lastRun: string
    icon: React.ElementType
}

const mockWorkflows: Workflow[] = [
    { id: '1', name: 'Qualificação Initial (Bot BANT)', trigger: 'Nova conversa iniciada', status: 'active', lastRun: 'Hoje, 10:45', icon: MessageSquarePlus },
    { id: '2', name: 'Roteamento Inteligente (Skills)', trigger: 'Bot Handoff Solicitado', status: 'active', lastRun: 'Ontem, 16:20', icon: GitPullRequestDraft },
    { id: '3', name: 'Follow-up D+1 (Sem Resposta)', trigger: 'Deal parado em Proposta por 24h', status: 'paused', lastRun: '--', icon: Clock },
    { id: '4', name: 'Agendamento Pró-ativo', trigger: 'Tag "Pediu Demo" adicionada', status: 'active', lastRun: 'Hoje, 09:15', icon: Zap },
    { id: '5', name: 'Alerta Fechamento (Won)', trigger: 'Deal movido para Won', status: 'draft', lastRun: '--', icon: CheckCircle2 },
    { id: '6', name: 'Lembrete de Reunião (1h antes)', trigger: 'Evento de Calendário próximo', status: 'active', lastRun: 'Hoje, 14:00', icon: Clock },
    { id: '7', name: 'SLA Estourado (Bot -> Humano)', trigger: 'Lead aguardando > 5 min', status: 'active', lastRun: 'Hoje, 11:30', icon: Zap },
    { id: '8', name: 'Recuperação de Proposta (D+3)', trigger: 'Deal sem interação há 3 dias', status: 'draft', lastRun: '--', icon: MessageSquarePlus },
]

export function AutomationBoard() {
    const [workflows] = useState<Workflow[]>(mockWorkflows)
    const [viewMode, setViewMode] = useState<'list' | 'builder'>('list')
    const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null)

    const openBuilder = (workflow: Workflow) => {
        setActiveWorkflow(workflow)
        setViewMode('builder')
    }

    const backToList = () => {
        setActiveWorkflow(null)
        setViewMode('list')
    }

    // Builder Node Component Mockup
    const FlowNode = ({ icon: Icon, title, description, isTrigger = false }: any) => (
        <div className={`p-4 rounded-xl shadow-sm border ${isTrigger ? 'bg-[#1c1c1c] border-[#ff7b00]/30' : 'bg-[#1c1c1c] border-white/5'} min-w-[280px]`}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isTrigger ? 'bg-[#ff7b00]/10 text-[#ff7b00]' : 'bg-[#2a2a2a] text-zinc-400'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white">{title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{description}</p>
                </div>
            </div>
        </div>
    )

    if (viewMode === 'builder' && activeWorkflow) {
        return (
            <div className="flex flex-col h-full bg-[#151515]">
                {/* Builder Header */}
                <div className="h-16 flex-shrink-0 bg-[#1c1c1c] border-b border-white/5 flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={backToList} className="text-sm text-zinc-400 hover:text-white font-medium transition-colors">
                            ← Voltar
                        </button>
                        <div className="h-4 w-px bg-white/10"></div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <activeWorkflow.icon className="w-5 h-5 text-[#ff7b00]" />
                            {activeWorkflow.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">
                            Ativo
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white rounded-md transition-colors border border-transparent hover:border-white/10">
                            Desativar
                        </button>
                        <button className="px-4 py-1.5 text-sm font-medium text-white bg-[#ff7b00] hover:bg-[#e66a00] rounded-md shadow-lg shadow-[#ff7b00]/20 transition-colors">
                            Salvar Fluxo
                        </button>
                    </div>
                </div>

                {/* Builder Canvas (Mock Visual Representation) */}
                <div className="flex-1 overflow-auto p-12 flex justify-center bg-[#151515]" style={{ backgroundImage: 'radial-gradient(#2a2a2a 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                    <div className="flex flex-col items-center">
                        <FlowNode
                            icon={MessageSquarePlus}
                            title="Gatilho: Nova Conversa Via API"
                            description="Quando um usuário desconhecido envia a 1ª msg"
                            isTrigger={true}
                        />

                        <div className="w-px h-8 bg-[#ff7b00]/50"></div>
                        <div className="w-6 h-6 rounded-full bg-[#1c1c1c] border border-[#ff7b00]/30 flex items-center justify-center text-[#ff7b00] shadow-sm z-10">
                            <ArrowRight className="w-3 h-3 rotate-90" />
                        </div>
                        <div className="w-px h-8 bg-zinc-700"></div>

                        <FlowNode
                            icon={Settings2}
                            title="Condição: Horário Comercial"
                            description="Se for Segunda à Sexta, 09h às 18h"
                        />

                        <div className="w-px h-8 bg-zinc-700"></div>
                        <div className="w-6 h-6 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-zinc-500 shadow-sm z-10">
                            <ArrowRight className="w-3 h-3 rotate-90" />
                        </div>
                        <div className="w-px h-8 bg-zinc-700"></div>

                        <div className="flex gap-8 items-start relative">
                            {/* Branching Line visualization */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[320px] h-px bg-zinc-700"></div>

                            <div className="flex flex-col items-center pt-4 relative">
                                <span className="absolute -top-10 bg-[#1c1c1c] border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full text-emerald-500 font-medium shadow-sm">Sim</span>
                                <div className="absolute -top-4 left-1/2 w-px h-8 bg-zinc-700"></div>
                                <FlowNode
                                    icon={Bot}
                                    title="Ação: Iniciar Chatbot BANT"
                                    description="Dispara fluxo de intenções padrão do Bot"
                                />
                            </div>

                            <div className="flex flex-col items-center pt-4 relative">
                                <span className="absolute -top-10 bg-[#1c1c1c] border border-rose-500/30 text-xs px-2 py-0.5 rounded-full text-rose-500 font-medium shadow-sm">Não</span>
                                <div className="absolute -top-4 left-1/2 w-px h-8 bg-zinc-700"></div>
                                <FlowNode
                                    icon={MessageSquarePlus}
                                    title="Ação: Enviar HSM Ausência"
                                    description="Dispara template aprovado 'Fora do Horário'"
                                />
                            </div>
                        </div>

                        {/* Add Node Button */}
                        <div className="mt-8 relative group cursor-pointer flex flex-col items-center">
                            <div className="w-px h-8 bg-transparent group-hover:bg-[#ff7b00]/30 transition-colors"></div>
                            <button className="w-10 h-10 rounded-full bg-[#1c1c1c] border-2 border-dashed border-zinc-600 text-zinc-500 flex items-center justify-center group-hover:border-[#ff7b00] group-hover:text-[#ff7b00] transition-all shadow-sm">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // --- List View ---
    return (
        <div className="p-8 max-w-6xl mx-auto flex flex-col h-full bg-[#151515]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Workflows & Automações</h1>
                    <p className="text-sm text-zinc-400 mt-1">Configure gatilhos e reações automáticas para plugar no WhatsApp Cloud API e CRM Kanban.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#ff7b00] text-white rounded-lg shadow-lg shadow-[#ff7b00]/20 hover:bg-[#e66a00] transition-colors font-medium text-sm">
                    <Plus className="w-4 h-4" /> Novo Workflow
                </button>
            </div>

            <div className="bg-[#1c1c1c] border border-white/5 rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 border-b border-white/5 bg-[#151515] p-5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    <div className="col-span-5">Nome da Automação</div>
                    <div className="col-span-3">Gatilho (Trigger)</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Última Execução</div>
                </div>

                {/* List */}
                <div className="divide-y divide-white/5">
                    {workflows.map(wf => (
                        <div
                            key={wf.id}
                            onClick={() => openBuilder(wf)}
                            className="grid grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-white/5 cursor-pointer transition-colors group"
                        >
                            <div className="col-span-5 flex items-center gap-4">
                                <div className="p-2.5 bg-[#2a2a2a] rounded-lg text-zinc-400 border border-white/5 group-hover:bg-[#ff7b00]/10 group-hover:text-[#ff7b00] group-hover:border-[#ff7b00]/20 transition-all">
                                    <wf.icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-white group-hover:text-[#ff7b00] transition-colors">{wf.name}</span>
                            </div>
                            <div className="col-span-3 text-sm text-zinc-400 truncate pr-4">
                                {wf.trigger}
                            </div>
                            <div className="col-span-2">
                                {wf.status === 'active' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><Play className="w-3 h-3 fill-emerald-500" /> ATIVO</span>}
                                {wf.status === 'paused' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide bg-amber-500/10 text-amber-500 border border-amber-500/20"><Pause className="w-3 h-3" /> PAUSADO</span>}
                                {wf.status === 'draft' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide bg-[#2a2a2a] text-zinc-400 border border-white/10"><Settings2 className="w-3 h-3" /> RASCUNHO</span>}
                            </div>
                            <div className="col-span-2 text-right text-sm text-zinc-500 font-medium">
                                {wf.lastRun}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
