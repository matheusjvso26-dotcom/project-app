'use client'

import React, { useState, useRef } from 'react'
import { Plus, Settings2, Play, Pause, FileSpreadsheet, Send, Info, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

export function AutomationBoard() {
    const [viewMode, setViewMode] = useState<'list' | 'builder'>('list')
    const [fileOptions, setFileOptions] = useState<any[]>([])
    const [messageTemplate, setMessageTemplate] = useState('')
    const [isSending, setIsSending] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result
                const wb = XLSX.read(bstr, { type: 'binary' })
                const wsname = wb.SheetNames[0]
                const ws = wb.Sheets[wsname]
                const data = XLSX.utils.sheet_to_json(ws)
                setFileOptions(data)
                toast.success(`Planilha lida com sucesso! ${data.length} contatos encontrados.`)
            } catch (err) {
                toast.error("Erro ao ler planilha. Garanta que é um .xlsx com colunas 'Numero' e 'Nome'.")
            }
        }
        reader.readAsBinaryString(file)
    }

    const startCampaign = async () => {
        if (fileOptions.length === 0) {
            toast.error("Faça o upload de uma planilha primeiro.")
            return
        }
        if (!messageTemplate.trim()) {
            toast.error("Digite a mensagem padrão que será enviada.")
            return
        }

        setIsSending(true)
        const toastId = toast.loading("Registrando Disparos em Lote. Aguarde...")

        try {
            const { launchCampaignAction } = await import('./actions')

            // Format phones and extract variables
            const payload = fileOptions.map(row => {
                const rawPhone = row.telefone || row.Telefone || row.numero || row.Numero || row.phone || row.Phone || ''
                const cleanedPhone = rawPhone.toString().replace(/\D/g, '')
                const name = row.nome || row.Nome || row.name || row.Name || 'Cliente'
                return { phone: cleanedPhone, name }
            }).filter(p => p.phone.length >= 10)

            const result = await launchCampaignAction(payload, messageTemplate)

            if (result?.success) {
                toast.success(`Campanha disparada para fila! ${payload.length} na lista.`, { id: toastId })
                setTimeout(() => {
                    setFileOptions([])
                    setMessageTemplate('')
                    setViewMode('list')
                }, 1500)
            } else {
                throw new Error(result?.error || "Erro misterioso no servidor.")
            }

        } catch (error: any) {
            toast.error(error.message || "Erro crasso ao disparar webhook de campanhas.", { id: toastId })
        } finally {
            setIsSending(false)
        }
    }

    if (viewMode === 'builder') {
        return (
            <div className="flex flex-col h-full bg-[#151515] overflow-auto">
                <div className="h-16 flex-shrink-0 bg-[#1c1c1c] border-b border-white/5 flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setViewMode('list')} className="text-sm text-zinc-400 hover:text-white font-medium transition-colors">
                            ← Voltar para Campanhas
                        </button>
                    </div>
                </div>

                <div className="p-8 max-w-4xl mx-auto w-full">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Send className="w-6 h-6 text-[#ff7b00]" /> Nova Campanha em Lote
                        </h1>
                        <p className="text-sm text-zinc-400 mt-2">Dispare mensagens de forma escalável para sua base lendo do Excel.</p>
                    </div>

                    <div className="bg-[#1c1c1c] border border-white/5 rounded-xl shadow-sm overflow-hidden p-6 mb-6">
                        <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-emerald-500" /> 1. Upload de Contatos (.XLSX, .CSV)</h3>

                        <div
                            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:border-[#ff7b00]/50 hover:bg-[#ff7b00]/5 transition-all"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />

                            {fileOptions.length > 0 ? (
                                <>
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3" />
                                    <h4 className="text-white font-medium">Planilha Carregada ({fileOptions.length} linhas)</h4>
                                    <p className="text-xs text-zinc-500 mt-1">Clique novamente para trocar o arquivo.</p>
                                </>
                            ) : (
                                <>
                                    <FileSpreadsheet className="w-10 h-10 text-zinc-600 mb-3" />
                                    <h4 className="text-white font-medium">Arraste a planilha ou clique aqui</h4>
                                    <p className="text-xs text-zinc-500 mt-1">A planilha deve conter uma coluna "Telefone" e opcionalmente "Nome".</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#1c1c1c] border border-white/5 rounded-xl shadow-sm overflow-hidden p-6">
                        <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2"><Send className="w-4 h-4 text-[#ff7b00]" /> 2. Mensagem Padrão</h3>

                        <div className="bg-[#ff7b00]/10 border border-[#ff7b00]/20 rounded-lg p-3 flex items-start gap-3 mb-4">
                            <Info className="w-4 h-4 text-[#ff7b00] mt-0.5" />
                            <p className="text-xs text-[#ff7b00]/90">
                                Você pode usar as variáveis <strong className="text-white bg-black/20 px-1 py-0.5 rounded">{'{{nome}}'}</strong> ou <strong className="text-white bg-black/20 px-1 py-0.5 rounded">{'{{telefone}}'}</strong>. Ex: "Olá {'{{nome}}'}, temos uma oferta..."
                            </p>
                        </div>

                        <textarea
                            disabled={isSending}
                            value={messageTemplate}
                            onChange={(e) => setMessageTemplate(e.target.value)}
                            placeholder="Escreva a mensagem mestre para todos os contatos. Ex: Olá {{nome}}, seu FGTS liberou R$ 3.000!"
                            className="w-full h-32 bg-[#151515] border border-white/10 rounded-lg p-4 text-sm text-zinc-200 resize-none focus:outline-none focus:border-[#ff7b00]/50 transition-colors"
                        />

                        <div className="mt-6 flex justify-end">
                            <button
                                disabled={isSending}
                                onClick={startCampaign}
                                className="px-6 py-2.5 bg-[#ff7b00] hover:bg-[#e66a00] text-white font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSending ? 'Processando Lote...' : 'Disparar Campanha'}
                                <Play className="w-4 h-4 fill-white" />
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
                    <h1 className="text-2xl font-bold text-white tracking-tight">Disparador de Campanhas Massivas</h1>
                    <p className="text-sm text-zinc-400 mt-1">Acione Leads dormentes do seu CRM via Disparo Batch do WhatsApp Oficial.</p>
                </div>
                <button onClick={() => setViewMode('builder')} className="flex items-center gap-2 px-4 py-2 bg-[#ff7b00] text-white rounded-lg shadow-lg shadow-[#ff7b00]/20 hover:bg-[#e66a00] transition-colors font-medium text-sm">
                    <Plus className="w-4 h-4" /> Nova Campanha
                </button>
            </div>

            <div className="bg-[#1c1c1c] border border-white/5 rounded-xl shadow-sm overflow-hidden p-16 flex flex-col items-center text-center">
                <FileSpreadsheet className="w-16 h-16 text-zinc-600 mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-white mb-2">Sem disparos ocorrendo</h3>
                <p className="text-sm text-zinc-400 max-w-sm mb-6">Para aquecer sua Base Morta, clique no botão "Nova Campanha" e suba uma planilha de prospecção.</p>
                <button onClick={() => setViewMode('builder')} className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-semibold border border-white/10">
                    Iniciar Minha Rotina de Marketing
                </button>
            </div>
        </div>
    )
}
