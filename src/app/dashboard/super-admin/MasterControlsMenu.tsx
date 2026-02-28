'use client'

import { useState } from 'react'
import { MoreHorizontal, ShieldAlert, Trash2, KeyRound } from 'lucide-react'
import { toggleOrganizationStatus, deleteOrganization, updateOrganizationMetaApi } from './actions'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Props {
    orgId: string;
    currentStatus: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
    orgName: string;
    wabaId?: string | null;
    phoneNumberId?: string | null;
}

export function MasterControlsMenu({ orgId, currentStatus, orgName, wabaId, phoneNumberId }: Props) {
    const [isApiModalOpen, setIsApiModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Modal State
    const [formWaba, setFormWaba] = useState(wabaId || '')
    const [formPhoneId, setFormPhoneId] = useState(phoneNumberId || '')
    const [formToken, setFormToken] = useState('')

    const handleToggleStatus = async () => {
        if (!confirm(`Deseja alterar o status de ${orgName}? O login de todos os usuários parceiros será afetado.`)) return;

        const res = await toggleOrganizationStatus(orgId, currentStatus)
        if (res.success) {
            toast.success(`Empresa marcada como ${res.newStatus}.`);
        }
    }

    const handleDelete = async () => {
        if (!confirm(`DANGER ZONE: Você está apagando permanentemente ${orgName} do servidor. Esta ação apagará leads, deals e usuários desta organização (Cascade). Prosseguir?`)) return;

        try {
            await deleteOrganization(orgId)
            toast.success('Organização e todos os seus dados foram apagados da Máquina.')
        } catch (error) {
            toast.error('Erro de Constraint ao apagar empresa.')
        }
    }

    const handleInjectApi = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await updateOrganizationMetaApi(orgId, formWaba, formPhoneId, formToken)
            toast.success('Chaves do Facebook injetadas! EvolutionAPI derrubada para este cliente.')
            setIsApiModalOpen(false)
        } catch (error) {
            toast.error('Erro ao salvar as Chaves da Nuvem.')
        }
        setLoading(false)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="px-3 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 rounded border border-white/5 transition-colors flex items-center gap-2">
                        <span>Ações Master</span>
                        <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1a1a1a] border-zinc-800">
                    <DropdownMenuLabel className="text-xs text-zinc-500 font-mono">ID: {orgId.split('-')[0]}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-800" />

                    <DropdownMenuItem
                        onClick={() => setIsApiModalOpen(true)}
                        className="flex items-center gap-2 cursor-pointer text-blue-400 focus:text-blue-400 focus:bg-blue-400/10"
                    >
                        <KeyRound className="w-4 h-4" /> Injetar API Cloud (Meta)
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={handleToggleStatus}
                        className="flex items-center gap-2 cursor-pointer text-amber-500 focus:text-amber-500 focus:bg-amber-500/10"
                    >
                        <ShieldAlert className="w-4 h-4" /> {currentStatus === 'SUSPENDED' ? 'Remover Suspensão (Unban)' : 'Suspender/Bloquear Acesso'}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-zinc-800" />

                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="flex items-center gap-2 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-500/10 font-medium"
                    >
                        <Trash2 className="w-4 h-4" /> Apagar Servidor e Dados (Wipe)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Modal de Injeção de Meta API (Oficial) */}
            <Dialog open={isApiModalOpen} onOpenChange={setIsApiModalOpen}>
                <DialogContent className="bg-[#18181b] border-zinc-800 text-white sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-blue-500">
                            <KeyRound className="w-5 h-5" /> Configurar WhatsApp Meta
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Sobrescreva a integração deste inquilino ({orgName}) injetando o Token do Facebook Developers. Isso desligará o Z-API/Evolution deste cliente.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleInjectApi} className="space-y-4 pt-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-300 uppercase">Waba ID</label>
                            <input
                                value={formWaba}
                                onChange={(e) => setFormWaba(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none placeholder:text-zinc-600"
                                placeholder="ex: 1234567890123"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-300 uppercase">Phone Number ID</label>
                            <input
                                value={formPhoneId}
                                onChange={(e) => setFormPhoneId(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none placeholder:text-zinc-600"
                                placeholder="ex: 3210987654321"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-300 uppercase">System User Token (EAA...)</label>
                            <input
                                type="password"
                                value={formToken}
                                onChange={(e) => setFormToken(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none placeholder:text-zinc-600"
                                placeholder="EAAGm..."
                                required
                            />
                        </div>

                        <DialogFooter className="pt-4 border-t border-zinc-800 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsApiModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Injetando...' : 'Aplicar Chaves Cloud'}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
