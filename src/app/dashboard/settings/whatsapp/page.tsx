'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, QrCode, Smartphone, Wifi, WifiOff, CheckCircle2, ShieldAlert } from 'lucide-react'
import { checkWhatsAppStatus, generateWhatsAppQR, disconnectWhatsApp } from './actions'

type StatusType = 'DISCONNECTED' | 'QRCODE_READY' | 'CONNECTED'

export default function WhatsAppSettings() {
    const [status, setStatus] = useState<StatusType>('DISCONNECTED')
    const [qrCodeData, setQrCodeData] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Polling Function to keep checking Status/QR
    useEffect(() => {
        let interval: NodeJS.Timeout

        async function fetchStatus() {
            const res = await checkWhatsAppStatus()
            setLoading(false)

            if (res.error) {
                setError(res.error)
                setStatus('DISCONNECTED')
                return
            }

            setStatus(res.status as StatusType)
            if (res.qrCode) {
                setQrCodeData(res.qrCode) // Ex: "data:image/png;base64,....."
            } else if (res.status !== 'QRCODE_READY') {
                // Limpa o QRCode antigo da memória se já conectou
                setQrCodeData(null)
            }
        }

        // Chama direto a primeira vez
        fetchStatus()

        // Se estiver no fluxo de QR Code, fica pingando a cada 5 segundos para descobrir se o celular leu
        if (status === 'QRCODE_READY') {
            interval = setInterval(fetchStatus, 5000)
        }

        return () => clearInterval(interval)
    }, [status])

    const handleConnect = async () => {
        setActionLoading(true)
        setError(null)
        const res = await generateWhatsAppQR()
        if (res.error) {
            setError(res.error)
        } else {
            setStatus('QRCODE_READY')
        }
        setActionLoading(false)
    }

    const handleDisconnect = async () => {
        if (!confirm("A Plataforma deixará de enviar e receber mensagens desse número. Tem certeza?")) return;

        setActionLoading(true)
        const res = await disconnectWhatsApp()
        if (res.error) {
            setError(res.error)
        } else {
            setStatus('DISCONNECTED')
            setQrCodeData(null)
        }
        setActionLoading(false)
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <Smartphone className="w-8 h-8 text-[#ff7b00]" />
                    Conexão WhatsApp
                </h1>
                <p className="text-zinc-400 mt-2">
                    Vincule seu Aparelho Comercial para ativar Automações, Funil de Vendas e o Inbox Compartilhado na Plataforma B2B. A leitura ocorre direto no seu painel.
                </p>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm flex items-center gap-3"
                    >
                        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff7b00]/10 to-transparent blur-3xl -z-10 rounded-full" />

                <div className="bg-[#0a0a0a] border border-[#333]/50 rounded-2xl p-8 shadow-2xl overflow-hidden glass-card">

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-[#ff7b00] animate-spin mb-4" />
                            <p className="text-zinc-400 font-medium">Buscando status de conexão no WZAPI...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                            {/* Left Column (Controls & Info) */}
                            <div className="flex-1 space-y-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-3 h-3 rounded-full ${status === 'CONNECTED' ? 'bg-green-500' : status === 'QRCODE_READY' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
                                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                                            {status === 'CONNECTED' ? 'Dispositivo Sincronizado' : status === 'QRCODE_READY' ? 'Aguardando Leitura...' : 'Aparelho Desconectado'}
                                        </h2>
                                    </div>
                                    <p className="text-sm text-zinc-500 font-medium">
                                        {status === 'CONNECTED'
                                            ? 'Sua linha B2B corporativa já está trocando mensagens em tempo real.'
                                            : 'Você precisa utilizar um Chip Ativo. Escaneie como se fosse o Web do navegador padrão.'}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-[#333]/50">
                                    {status === 'DISCONNECTED' && (
                                        <button
                                            onClick={handleConnect}
                                            disabled={actionLoading}
                                            className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 bg-[#ff7b00] hover:bg-orange-500 text-black font-black uppercase text-sm rounded-xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,123,0,0.25)] hover:shadow-[0_0_30px_rgba(255,123,0,0.5)]"
                                        >
                                            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
                                            Gerar QR Code de Acesso
                                        </button>
                                    )}

                                    {status === 'CONNECTED' && (
                                        <button
                                            onClick={handleDisconnect}
                                            disabled={actionLoading}
                                            className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-bold uppercase text-sm rounded-xl transition-all disabled:opacity-50"
                                        >
                                            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <WifiOff className="w-5 h-5" />}
                                            Deslogar Dispositivo
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right Column (Visual Representation / QR Base64) */}
                            <div className="flex-shrink-0 relative">
                                <div className="w-[280px] h-[280px] rounded-2xl border-2 border-dashed border-[#333] flex items-center justify-center bg-[#111] relative overflow-hidden group">

                                    {status === 'CONNECTED' && (
                                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-green-500/50">
                                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                                            </div>
                                            <span className="text-green-500 font-bold tracking-widest uppercase text-sm">Online</span>
                                        </motion.div>
                                    )}

                                    {status === 'QRCODE_READY' && qrCodeData && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white p-4">
                                            {/* Renderiza o Bese64 injetado direto no SRC */}
                                            <img src={qrCodeData} alt="WhatsApp QR Code Gen" className="w-full h-full object-contain" />

                                            {/* Scan Overlay Scanner Effect (Premium Feel) */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-[#ff7b00] blur-[2px] shadow-[0_0_15px_#ff7b00] opacity-50 scan-line-animation" />
                                        </motion.div>
                                    )}

                                    {status === 'DISCONNECTED' && (
                                        <div className="text-center opacity-40 group-hover:opacity-100 transition-opacity">
                                            <Wifi className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
                                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Aguardando<br />Autenticação</span>
                                        </div>
                                    )}

                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>

            {/* Required CSS line for the scanner inside page OR globals.css */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0.8; }
          50% { opacity: 0.2; }
          100% { top: 100%; opacity: 0.8; }
        }
        .scan-line-animation {
          animation: scan 2.5s infinite linear;
        }
      `}} />
        </div>
    )
}
