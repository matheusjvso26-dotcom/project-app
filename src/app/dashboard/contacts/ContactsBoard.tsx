'use client'

import React, { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, MessageCircle, Building2, ArrowUpDown } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CpfInput, PhoneInput, MoneyInput } from "@/components/ui/masked-input"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createLeadWithDeal } from './actions'

export interface Contact {
    id: string
    name: string
    company: string
    email: string
    phone: string
    status: string
    lastContact: string
}

const getStatusBadge = (status: string) => {
    const s = status.toLowerCase()

    if (s.includes('novo') || s.includes('triagem')) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{status}</span>
    if (s.includes('qualificado') || s.includes('qualificação')) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">{status}</span>
    if (s.includes('negociação')) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">{status}</span>
    if (s.includes('ganho') || s.includes('cliente') || s.includes('won')) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">{status}</span>
    if (s.includes('perdido') || s.includes('lost')) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{status}</span>

    // Genérico caso usuário do CRM crie Etapa Inédita no Kanban
    return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">{status}</span>
}

interface ContactsBoardProps {
    initialContacts: Contact[]
}

export function ContactsBoard({ initialContacts }: ContactsBoardProps) {
    const [contacts] = useState<Contact[]>(initialContacts)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [formData, setFormData] = useState({ name: '', company: '', document: '', phone: '', value: 0 })
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    const handleCreateContact = async () => {
        if (!formData.name || !formData.phone) {
            toast.error("Nome e Telefone são obrigatórios.")
            return
        }

        setIsSaving(true)
        try {
            await createLeadWithDeal(formData)
            toast.success("Lead salvo e adicionado ao Kanban!")
            setIsCreateOpen(false)
            setFormData({ name: '', company: '', document: '', phone: '', value: 0 })
            router.refresh()
        } catch (e: any) {
            toast.error(e.message || "Erro ao criar lead.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col h-full relative z-10 bg-[#151515]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Leads & Contatos</h1>
                    <p className="text-sm text-zinc-400 mt-1">Gerencie seu banco de dados de clientes, leads B2B e histórico de comunicações.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-[#1c1c1c] text-white border-white/10 hover:bg-white/5 hover:text-white gap-2 transition-colors">
                        <Filter className="w-4 h-4" /> Filtros
                    </Button>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#ff7b00] hover:bg-[#e66a00] text-white gap-2 shadow-lg shadow-[#ff7b00]/20 transition-all border-none">
                                <Plus className="w-4 h-4" /> Novo Lead
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-[#1c1c1c] border-border/20 text-white">
                            <DialogHeader>
                                <DialogTitle>Criar Novo Lead</DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                    Adicione as informações de prospecção do novo lead.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right text-zinc-300">Nome</Label>
                                    <Input id="name" placeholder="Roberto Carlos" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="col-span-3 bg-[#151515] border-white/10 focus-visible:ring-[#ff7b00]" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right text-zinc-300">Telefone</Label>
                                    <PhoneInput id="phone" placeholder="(11) 99999-9999" value={formData.phone} onValueChange={val => setFormData({ ...formData, phone: val })} className="col-span-3 bg-[#151515] border-white/10 focus-visible:ring-[#ff7b00]" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="doc" className="text-right text-zinc-300">CPF / CNPJ</Label>
                                    <CpfInput id="doc" placeholder="000.000.000-00" value={formData.document} onValueChange={val => setFormData({ ...formData, document: val })} className="col-span-3 bg-[#151515] border-white/10 focus-visible:ring-[#ff7b00]" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="company" className="text-right text-zinc-300">Empresa</Label>
                                    <Input id="company" placeholder="Acme Corp" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="col-span-3 bg-[#151515] border-white/10 focus-visible:ring-[#ff7b00]" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="value" className="text-right text-zinc-300">Ticket Médio</Label>
                                    <MoneyInput id="value" value={formData.value} onValueChange={val => setFormData({ ...formData, value: val })} className="col-span-3 bg-[#151515] border-white/10 focus-visible:ring-[#ff7b00]" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSaving} className="bg-[#ff7b00] hover:bg-[#e66a00] text-white" onClick={handleCreateContact}>
                                    {isSaving ? "Salvando..." : "Salvar Lead"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-[#1c1c1c] rounded-t-2xl border-b-0 p-5 flex items-center justify-between">
                <div className="relative w-80">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-zinc-500" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Buscar por nome, empresa..."
                        className="w-full pl-10 bg-[#151515] border-white/5 text-white placeholder:text-zinc-600 rounded-xl h-10 focus-visible:ring-[#ff7b00]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-zinc-500 font-medium">
                    Total: <span className="text-white">{contacts.length} registros</span>
                </div>
            </div>

            {/* DataTable */}
            <div className="bg-[#1c1c1c] rounded-b-2xl shadow-sm overflow-hidden flex-1 flex flex-col border-t-0 rounded-t-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#151515] border-y border-white/5 text-[11px] font-bold text-zinc-500 tracking-wider uppercase">
                            <tr>
                                <th className="px-6 py-5 cursor-pointer hover:text-white transition-colors group">
                                    <div className="flex items-center gap-2">
                                        Contato <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#ff7b00]" />
                                    </div>
                                </th>
                                <th className="px-6 py-5 cursor-pointer hover:text-white transition-colors group">
                                    <div className="flex items-center gap-2">
                                        Empresa <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#ff7b00]" />
                                    </div>
                                </th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Ações Rápidas</th>
                                <th className="px-6 py-5">Último Contato</th>
                                <th className="px-6 py-5 text-right">Opções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {contacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#ff7b00]/10 border border-[#ff7b00]/20 flex items-center justify-center text-[#ff7b00] font-bold text-xs">
                                                {contact.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">{contact.name}</div>
                                                <div className="text-zinc-400 text-xs">{contact.email}</div>
                                                <div className="text-zinc-500 text-[10px] mt-0.5 tracking-wide">{contact.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-zinc-300 font-medium">
                                            <Building2 className="w-4 h-4 text-zinc-500" />
                                            {contact.company}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {getStatusBadge(contact.status)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1">
                                            <button className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all" title="Chamar no WhatsApp">
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all" title="Enviar E-mail">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all" title="Ligar">
                                                <Phone className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-zinc-400">
                                        {contact.lastContact}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-all">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="mt-auto px-6 py-4 border-t border-white/5 bg-[#1a1a1a] flex items-center justify-between text-sm text-zinc-500">
                    <div>Mostrando 1 a 5 de 12 registros</div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent border-none text-zinc-500 hover:bg-white/5 hover:text-white" disabled>Anterior</Button>
                        <Button variant="default" size="sm" className="w-8 h-8 p-0 bg-[#ff7b00] hover:bg-[#e66a00] text-white">1</Button>
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white">2</Button>
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white">3</Button>
                        <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white">Próximo</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
