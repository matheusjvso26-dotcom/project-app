'use client'

import { useState, useEffect } from 'react'
import { Server, MessageCircle, AlertCircle, ShieldCheck, ZapOff } from 'lucide-react'
import { checkWzapiConnectionStatus, saveWzapiCredentials, disconnectWzapiWhatsApp } from './actions'

type StatusType = 'DISCONNECTED' | 'CONNECTED'

export default function WhatsAppLegacySettings() {
    const [status, setStatus] = useState<StatusType>('DISCONNECTED')
    const [instanceId, setInstanceId] = useState('')
    const [token, setToken] = useState('')

    const [savedInstanceId, setSavedInstanceId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchStatus() {
            setLoading(true)
            const res = await checkWzapiConnectionStatus()
            if (res.error && res.status === 'DISCONNECTED') {
                setError(res.error)
            } else {
                setStatus(res.status as StatusType)
                if (res.instanceId) setSavedInstanceId(res.instanceId)
            }
            setLoading(false)
        }
        fetchStatus()
    }, [])

    const handleSaveConnection = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!instanceId || !token) {
            setError("Instância e Token são obrigatórios.")
            return
        }

        setActionLoading(true)
        setError(null)

        const res = await saveWzapiCredentials(instanceId, token)
        if (res.error) {
            setError(res.error)
        } else {
            setStatus('CONNECTED')
            setSavedInstanceId(instanceId)
        }
        setActionLoading(false)
    }

    const handleDisconnect = async () => {
        if (!confirm("Sua empresa deixará de receber as mensagens automaticamente no Inbox. Confirma a exclusão do Token?")) return;

        setActionLoading(true)
        const res = await disconnectWzapiWhatsApp()
        if (res.error) {
            setError(res.error)
        } else {
            setStatus('DISCONNECTED')
            setSavedInstanceId(null)
            setInstanceId('')
            setToken('')
        }
        setActionLoading(false)
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="border-b border-zinc-800 pb-6 mb-8">
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                    <span>Mensagens</span>
                    <span>&gt;</span>
                    <span className="text-zinc-200">Adicionar WhatsApp (API Tradicional)</span>
                </div>

                <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
                    <div className="bg-[#25D366] p-1.5 rounded-full text-white">
                        <MessageCircle className="w-5 h-5 fill-current" />
                    </div>
                    Adicionar Canal WhatsApp
                </h1>
                <p className="text-zinc-400 mt-2 text-sm max-w-3xl">
                    Sincronize sua API de Mensagens de WhatsApp via Evolution API / Z-API. Cole sua Instância e Token abaixo.
                </p>
            </div>

            {/* Error Banners */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 text-red-500 rounded-md text-sm mb-6 flex items-center gap-2">
                    <ZapOff className="w-5 h-5 flex-shrink-0" /> {error}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#141414] border border-zinc-800 rounded-lg">
                    <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin mb-4" />
                    <span className="text-zinc-400 text-sm">Carregando Conexão...</span>
                </div>
            ) : status === 'DISCONNECTED' ? (
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#ff7b00]/10 border border-[#ff7b00]/20 text-[#ff7b00] flex items-center justify-center text-sm font-semibold flex-shrink-0">1</div>
                        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 w-full">
                            <h3 className="font-medium text-white mb-2">Credenciais de API</h3>
                            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                Insira o nome ou ID da sua Instância e a Chave de Acesso (Token) para habilitar envios e recebimentos no FlyUp SaaS.
                            </p>

                            <form onSubmit={handleSaveConnection} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">ID da Instância</label>
                                    <input
                                        type="text"
                                        value={instanceId}
                                        onChange={(e) => setInstanceId(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#ff7b00]"
                                        placeholder="Ex: flow_inst_45"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Apikey / Token</label>
                                    <input
                                        type="password"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#ff7b00]"
                                        placeholder="Ex: 885A8SD8FSA80S0A"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#ff7b00] hover:bg-[#e66a00] text-white font-medium text-sm rounded transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? 'Salvando...' : 'Conectar API Local'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-[#18181b] border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-[#1e1e21]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Canal Online (API Conectada)</h2>
                                <p className="text-sm text-green-400 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Trafegando Servidor Externo
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDisconnect}
                            disabled={actionLoading}
                            className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium rounded-md"
                        >
                            {actionLoading ? 'Revogando...' : 'Desconectar API'}
                        </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1 mt-2">Nome da Instância</p>
                            <p className="text-sm font-mono text-zinc-300 bg-zinc-900 p-2 rounded border border-zinc-800 truncate">{savedInstanceId}</p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1 mt-2">Status do Token</p>
                            <p className="text-sm font-mono text-zinc-300 bg-zinc-900 p-2 rounded border border-zinc-800 text-green-500 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Válido (Oculto)
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
