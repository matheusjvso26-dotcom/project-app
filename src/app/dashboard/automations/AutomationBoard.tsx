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
        <div className={`p-4 rounded-xl shadow-sm border ${isTrigger ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'} min-w-[280px]`}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isTrigger ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{description}</p>
                </div>
            </div>
        </div>
    )

    if (viewMode === 'builder' && activeWorkflow) {
        return (
            <div className="flex flex-col h-full bg-slate-50/50">
                {/* Builder Header */}
                <div className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={backToList} className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                            ← Voltar
                        </button>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <activeWorkflow.icon className="w-5 h-5 text-indigo-600" />
                            {activeWorkflow.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                            Ativo
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors border border-transparent hover:border-slate-200">
                            Desativar
                        </button>
                        <button className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors">
                            Salvar Fluxo
                        </button>
                    </div>
                </div>

                {/* Builder Canvas (Mock Visual Representation) */}
                <div className="flex-1 overflow-auto p-12 flex justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-95">
                    <div className="flex flex-col items-center">
                        <FlowNode
                            icon={MessageSquarePlus}
                            title="Gatilho: Nova Conversa Via API"
                            description="Quando um usuário desconhecido envia a 1ª msg"
                            isTrigger={true}
                        />

                        <div className="w-px h-8 bg-indigo-300"></div>
                        <div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm z-10">
                            <ArrowRight className="w-3 h-3 rotate-90" />
                        </div>
                        <div className="w-px h-8 bg-slate-300"></div>

                        <FlowNode
                            icon={Settings2}
                            title="Condição: Horário Comercial"
                            description="Se for Segunda à Sexta, 09h às 18h"
                        />

                        <div className="w-px h-8 bg-slate-300"></div>
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm z-10">
                            <ArrowRight className="w-3 h-3 rotate-90" />
                        </div>
                        <div className="w-px h-8 bg-slate-300"></div>

                        <div className="flex gap-8 items-start relative">
                            {/* Branching Line visualization */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[320px] h-px bg-slate-300"></div>

                            <div className="flex flex-col items-center pt-4 relative">
                                <span className="absolute -top-10 bg-white border border-slate-200 text-xs px-2 py-0.5 rounded-full text-emerald-600 font-medium shadow-sm">Sim</span>
                                <div className="absolute -top-4 left-1/2 w-px h-8 bg-slate-300"></div>
                                <FlowNode
                                    icon={Bot}
                                    title="Ação: Iniciar Chatbot BANT"
                                    description="Dispara fluxo de intenções padrão do Bot"
                                />
                            </div>

                            <div className="flex flex-col items-center pt-4 relative">
                                <span className="absolute -top-10 bg-white border border-slate-200 text-xs px-2 py-0.5 rounded-full text-rose-600 font-medium shadow-sm">Não</span>
                                <div className="absolute -top-4 left-1/2 w-px h-8 bg-slate-300"></div>
                                <FlowNode
                                    icon={MessageSquarePlus}
                                    title="Ação: Enviar HSM Ausência"
                                    description="Dispara template aprovado 'Fora do Horário'"
                                />
                            </div>
                        </div>

                        {/* Add Node Button */}
                        <div className="mt-8 relative group cursor-pointer flex flex-col items-center">
                            <div className="w-px h-8 bg-transparent group-hover:bg-indigo-300 transition-colors"></div>
                            <button className="w-10 h-10 rounded-full bg-white border-2 border-dashed border-slate-300 text-slate-400 flex items-center justify-center group-hover:border-indigo-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all shadow-sm">
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
        <div className="p-8 max-w-6xl mx-auto flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workflows & Automações</h1>
                    <p className="text-sm text-slate-500 mt-1">Configure gatilhos e reações automáticas para plugar no WhatsApp Cloud API e CRM Kanban.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors font-medium text-sm">
                    <Plus className="w-4 h-4" /> Novo Workflow
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50/50 p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <div className="col-span-5">Nome da Automação</div>
                    <div className="col-span-3">Gatilho (Trigger)</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Última Execução</div>
                </div>

                {/* List */}
                <div className="divide-y divide-slate-100">
                    {workflows.map(wf => (
                        <div
                            key={wf.id}
                            onClick={() => openBuilder(wf)}
                            className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                            <div className="col-span-5 flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                    <wf.icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-slate-800">{wf.name}</span>
                            </div>
                            <div className="col-span-3 text-sm text-slate-600 truncate pr-4">
                                {wf.trigger}
                            </div>
                            <div className="col-span-2">
                                {wf.status === 'active' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60"><Play className="w-3 h-3 fill-emerald-700" /> Ativo</span>}
                                {wf.status === 'paused' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60"><Pause className="w-3 h-3" /> Pausado</span>}
                                {wf.status === 'draft' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"><Settings2 className="w-3 h-3" /> Rascunho</span>}
                            </div>
                            <div className="col-span-2 text-right text-sm text-slate-500">
                                {wf.lastRun}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
