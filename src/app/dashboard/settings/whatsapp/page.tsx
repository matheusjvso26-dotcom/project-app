'use client'

import { useState, useEffect } from 'react'
import { Server, MessageCircle, AlertCircle, ShieldCheck, ZapOff } from 'lucide-react'
import { checkMetaConnectionStatus, exchangeMetaCodeForToken, disconnectMetaWhatsApp } from './actions'

type StatusType = 'DISCONNECTED' | 'CONNECTED'

export default function WhatsAppMetaSettings() {
    const [status, setStatus] = useState<StatusType>('DISCONNECTED')
    const [wabaId, setWabaId] = useState<string | null>(null)
    const [phoneId, setPhoneId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchStatus() {
            setLoading(true)
            const res = await checkMetaConnectionStatus()
            if (res.error && res.status === 'DISCONNECTED') {
                setError(res.error)
            } else {
                setStatus(res.status as StatusType)
                if (res.wabaId) setWabaId(res.wabaId)
                if (res.phoneNumberId) setPhoneId(res.phoneNumberId)
            }
            setLoading(false)
        }
        fetchStatus()
    }, [])

    const handleFacebookLoginOpen = () => {
        setActionLoading(true);

        // Dispara SDK Login (Configurações baseadas no ID App Fornecido)
        if (typeof window !== 'undefined' && (window as any).FB) {
            (window as any).FB.login(async function (response: any) {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    const res = await exchangeMetaCodeForToken(accessToken);
                    if (res.error) {
                        setError(res.error);
                    } else if (res.data) {
                        setWabaId(res.data.wabaId || '');
                        setPhoneId(res.data.phoneNumberId || '');
                        setStatus('CONNECTED');
                    }
                } else {
                    setError("Autenticação Cancelada pelo Usuário.");
                }
                setActionLoading(false);
            }, {
                config_id: 'SEU_CONFIG_ID_(Opcional)', // Requer Painel
                response_type: 'code',
                override_default_response_type: true,
                extras: {
                    setup: {
                        // Passando metadata da Sessão se necessário
                    }
                }
            });
        } else {
            setError("Meta SDK não Inicializado... Verifique seu NEXT_PUBLIC_META_APP_ID.");
            setActionLoading(false);
        }
    }

    const handleDisconnect = async () => {
        if (!confirm("Sua empresa deixará de receber as mensagens automaticamente no Inbox. Confirma a exclusão do Token?")) return;

        setActionLoading(true)
        const res = await disconnectMetaWhatsApp()
        if (res.error) {
            setError(res.error)
        } else {
            setStatus('DISCONNECTED')
            setWabaId(null)
            setPhoneId(null)
        }
        setActionLoading(false)
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Limpo Institucional */}
            <div className="border-b border-zinc-800 pb-6 mb-8">
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                    <span>Mensagens</span>
                    <span>&gt;</span>
                    <span className="text-zinc-200">Adicionar WhatsApp</span>
                </div>

                <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
                    <div className="bg-[#25D366] p-1.5 rounded-full text-white">
                        <MessageCircle className="w-5 h-5 fill-current" />
                    </div>
                    Adicionar WhatsApp
                </h1>
                <p className="text-zinc-400 mt-2 text-sm max-w-3xl">
                    Ajude os clientes a solicitar e receber suporte pelo canal de mensagens por redes sociais WhatsApp. A integração ocorre através do Cloud Oficial da Meta (Facebook).
                </p>
            </div>

            {/* Alerta Global de Monetização / Limites Facebook */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-4 flex gap-3 text-sm text-blue-400 mb-8">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-blue-300">A partir de hoje, o WhatsApp mudará seus preços para um modelo baseado em conversa.</h4>
                    <p className="mt-1">Todas as empresas que usam a API Cloud do WhatsApp Oficial (Meta) serão cobradas após a quebra do limite gratuito diário de mensagens. Suas mensagens inbound geram menos impacto na fatura em relação as ativas.</p>
                </div>
            </div>

            {/* Error Banners */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 text-red-500 rounded-md text-sm mb-6 flex items-center gap-2">
                    <ZapOff className="w-5 h-5" /> {error}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#141414] border border-zinc-800 rounded-lg">
                    <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin mb-4" />
                    <span className="text-zinc-400 text-sm">Carregando Instâncias da Meta...</span>
                </div>
            ) : status === 'DISCONNECTED' ? (

                // FLUXO DE COMPRA/CONFIGURAÇÃO -- "STEP BY STEP" (Embedded Signup View)
                <div className="space-y-6">

                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-semibold flex-shrink-0 border border-zinc-700">1</div>
                        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 w-full">
                            <h3 className="font-medium text-white mb-2">Vincular conta do WhatsApp</h3>
                            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                Vincular um número a este canal impedirá que você o utilize como um número pessoal de aplicativo padrão. Ao continuar, seu negócio passará a usar a API do WhatsApp na nuvem hospedada pelo Facebook. Prepare-se para confirmar o PIN via SMS.
                            </p>

                            <button
                                onClick={handleFacebookLoginOpen}
                                disabled={actionLoading}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium text-sm rounded transition-colors disabled:opacity-50"
                            >
                                {actionLoading ? (
                                    <div className="w-4 h-4 rounded-full border-t-2 border-b-2 border-white animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" /></svg>
                                )}
                                Continuar com o Facebook
                            </button>
                        </div>
                    </div>

                    {/* Step 2 (Disabled in UI) */}
                    <div className="flex items-start gap-4 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">2</div>
                        <div className="mt-1.5"><h3 className="font-medium text-zinc-500">Selecionar número do WhatsApp (Retornado Pelo Popup)</h3></div>
                    </div>

                    {/* Step 3 (Disabled in UI) */}
                    <div className="flex items-start gap-4 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">3</div>
                        <div className="mt-1.5"><h3 className="font-medium text-zinc-500">Configurar Roteamento para a Caixa de Entrada (Inbox)</h3></div>
                    </div>

                </div>

            ) : (

                // FLUXO DE CANAL CONECTADO - Visualização Limpa de Status
                <div className="bg-[#18181b] border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-[#1e1e21]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Canal Online e Roteando</h2>
                                <p className="text-sm text-green-400 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Recebendo Mensagens Nativamente
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDisconnect}
                            disabled={actionLoading}
                            className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium rounded-md"
                        >
                            {actionLoading ? 'Revogando...' : 'Desconectar App'}
                        </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1 mt-2">ID do Aplicativo Meta (WABA ID)</p>
                            <p className="text-sm font-mono text-zinc-300 bg-zinc-900 p-2 rounded border border-zinc-800 truncate">{wabaId}</p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1 mt-2">ID Numérico de Envio</p>
                            <p className="text-sm font-mono text-zinc-300 bg-zinc-900 p-2 rounded border border-zinc-800 truncate">{phoneId}</p>
                        </div>
                    </div>
                </div>

            )}

        </div>
    )
}
