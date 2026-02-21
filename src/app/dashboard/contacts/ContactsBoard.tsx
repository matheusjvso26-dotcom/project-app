'use client'

import React, { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, MessageCircle, Building2, UserCircle2, ArrowUpDown } from 'lucide-react'

// --- Data Interface ---
export interface Contact {
    id: string
    name: string
    company: string
    email: string
    phone: string
    status: 'Novo' | 'Qualificado' | 'Em Negociação' | 'Cliente' | 'Perdido'
    lastContact: string
}

const getStatusBadge = (status: Contact['status']) => {
    switch (status) {
        case 'Novo': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Novo</span>
        case 'Qualificado': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Qualificado</span>
        case 'Em Negociação': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Em Negociação</span>
        case 'Cliente': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">Cliente</span>
        case 'Perdido': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">Perdido</span>
    }
}

interface ContactsBoardProps {
    initialContacts: Contact[]
}

export function ContactsBoard({ initialContacts }: ContactsBoardProps) {
    const [contacts] = useState<Contact[]>(initialContacts)
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads & Contatos</h1>
                    <p className="text-sm text-slate-500 mt-1">Gerencie seu banco de dados de clientes, leads B2B e histórico de comunicações.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 transition-colors font-medium text-sm">
                        <Filter className="w-4 h-4 text-slate-400" /> Filtros
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors font-medium text-sm">
                        <Plus className="w-4 h-4" /> Novo Contato
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
                        placeholder="Buscar por nome, email ou empresa..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-slate-500 font-medium">
                    Total: <span className="text-slate-900">{contacts.length} registros</span>
                </div>
            </div>

            {/* DataTable */}
            <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/80 border-b border-slate-200 uppercase text-[11px] font-bold text-slate-500 tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group">
                                    <div className="flex items-center justify-between gap-2">
                                        Contato <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group">
                                    <div className="flex items-center gap-2">
                                        Empresa <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4">Ações Rápidas</th>
                                <th scope="col" className="px-6 py-4">Último Contato</th>
                                <th scope="col" className="px-6 py-4 text-right">Opções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {contacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-xs border border-slate-200">
                                                {contact.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{contact.name}</div>
                                                <div className="text-slate-500 text-xs mt-0.5">{contact.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                                            <Building2 className="w-4 h-4 text-slate-400" />
                                            {contact.company}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(contact.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Chamar no WhatsApp">
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Enviar E-mail">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Ligar">
                                                <Phone className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {contact.lastContact}
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

                {/* Pagination Footer Mockup */}
                <div className="mt-auto p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
                    <div>Mostrando 1 a 5 de 12 registros</div>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50 disabled:opacity-50" disabled>Anterior</button>
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-md font-medium">1</button>
                        <button className="px-3 py-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50">2</button>
                        <button className="px-3 py-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50">3</button>
                        <button className="px-3 py-1 border border-slate-200 bg-white rounded-md hover:bg-slate-50">Próximo</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
