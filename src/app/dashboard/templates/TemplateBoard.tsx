'use client'

import React, { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal, RefreshCw, MessageSquareDashed, CheckCircle2, XCircle, Clock } from 'lucide-react'

// --- Mock Data ---
interface Template {
    id: string
    name: string
    category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'
    language: string
    status: 'APPROVED' | 'PENDING' | 'REJECTED'
    lastUpdated: string
}

const mockTemplates: Template[] = [
    { id: '1', name: 'boas_vindas_lead', category: 'MARKETING', language: 'pt_BR', status: 'APPROVED', lastUpdated: 'Hoje, 10:00' },
    { id: '2', name: 'lembrete_reuniao', category: 'UTILITY', language: 'pt_BR', status: 'APPROVED', lastUpdated: 'Ontem' },
    { id: '3', name: 'recuperacao_carrinho', category: 'MARKETING', language: 'pt_BR', status: 'PENDING', lastUpdated: '2 horas atrás' },
    { id: '4', name: 'codigo_verificacao', category: 'AUTHENTICATION', language: 'pt_BR', status: 'APPROVED', lastUpdated: 'Semana passada' },
    { id: '5', name: 'promocao_black_friday', category: 'MARKETING', language: 'pt_BR', status: 'REJECTED', lastUpdated: '3 dias atrás' },
]

const getStatusBadge = (status: Template['status']) => {
    switch (status) {
        case 'APPROVED': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" /> Aprovado</span>
        case 'PENDING': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><Clock className="w-3.5 h-3.5" /> Em Análise</span>
        case 'REJECTED': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700"><XCircle className="w-3.5 h-3.5" /> Rejeitado</span>
    }
}

const getCategoryBadge = (category: Template['category']) => {
    switch (category) {
        case 'MARKETING': return <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Marketing</span>
        case 'UTILITY': return <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Utilidade</span>
        case 'AUTHENTICATION': return <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Autenticação</span>
    }
}

export function TemplateBoard() {
    const [templates] = useState<Template[]>(mockTemplates)
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Templates WhatsApp (HSM)</h1>
                    <p className="text-sm text-slate-500 mt-1">Sincronize e gerencie seus modelos de mensagens aprovados pela Meta.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 transition-colors font-medium text-sm">
                        <RefreshCw className="w-4 h-4 text-indigo-600" /> Sincronizar da Meta
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors font-medium text-sm">
                        <Plus className="w-4 h-4" /> Criar Template
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white border rounded-t-xl border-slate-200 border-b-0 p-4 flex items-center justify-between">
                <div className="relative w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar template..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors text-sm">
                        <Filter className="w-4 h-4" /> Filtros
                    </button>
                    <div className="text-sm text-slate-500 font-medium border-l pl-3 ml-1 border-slate-200">
                        Total: <span className="text-slate-900">{templates.length}</span>
                    </div>
                </div>
            </div>

            {/* DataTable */}
            <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/80 border-b border-slate-200 uppercase text-[11px] font-bold text-slate-500 tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">Nome do Template</th>
                                <th scope="col" className="px-6 py-4">Categoria</th>
                                <th scope="col" className="px-6 py-4">Idioma</th>
                                <th scope="col" className="px-6 py-4">Status Meta</th>
                                <th scope="col" className="px-6 py-4">Última Sincronização</th>
                                <th scope="col" className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {templates.map((template) => (
                                <tr key={template.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                                                <MessageSquareDashed className="w-4 h-4" />
                                            </div>
                                            <div className="font-semibold text-slate-900">{template.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getCategoryBadge(template.category)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        {template.language}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(template.status)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {template.lastUpdated}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="mt-auto p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
                    <div>Mostrando 1 a 5 de 5 templates</div>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50 disabled:opacity-50" disabled>Anterior</button>
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-md font-medium">1</button>
                        <button className="px-3 py-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50 disabled:opacity-50" disabled>Próximo</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
