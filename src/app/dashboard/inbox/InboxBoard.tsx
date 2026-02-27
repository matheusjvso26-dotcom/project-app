'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, MoreVertical, Phone, Mail, Globe, Send, Paperclip, Smile, Mic, ShieldAlert, Bot, Plus, Download, FileText, Image as ImageIcon, FileAudio, Video, Sparkles } from 'lucide-react'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MoneyInput } from "@/components/ui/masked-input"
import { sendMessage, getConversations, updateDealValue, sendMediaMessage, createDealFromInbox, toggleBotStatus, generateAiReply, toggleTag } from './actions'
import { toast } from 'sonner'

const AVAILABLE_TAGS = ['Urgente', 'Reclamação', 'Dúvida']

// --- Interfaces ---
export interface Message {
    id: string
    content: string
    sender: 'me' | 'client' | 'bot'
    time: string
    status?: 'sent' | 'delivered' | 'read'
    type?: string
    transcription?: string | null
}

export interface ChatDeal {
    id: string
    title: string
    value: number
    stageName: string
}

export interface Chat {
    id: string
    name: string
    phone: string
    lastMessage: string
    time: string
    unread: number
    isBotHandling: boolean
    lgpdConsent: boolean
    tags: string[] // Custom Tags
    messages: Message[]
    deals: ChatDeal[]
}

interface InboxBoardProps {
    initialConversations: Chat[]
}

export function InboxBoard({ initialConversations }: InboxBoardProps) {
    const [chats, setChats] = useState<Chat[]>(initialConversations)
    const [activeChatId, setActiveChatId] = useState<string>(chats.length > 0 ? chats[0].id : '')
    const [messageInput, setMessageInput] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null)
    const [isGeneratingAi, setIsGeneratingAi] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isSendingRef = useRef(false)

    // Sincronizando o estado isSending com o Ref para acesso síncrono no Polling
    useEffect(() => {
        isSendingRef.current = isSending
    }, [isSending])

    // Auto-scroll messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [activeChatId, chats])

    // --- REALTIME MOTOR (POLLING) --- 
    // Usado como MVP simples para buscar os pushes novos do Webhook da Meta
    useEffect(() => {
        const fetchMessages = async () => {
            if (isSendingRef.current) return // pausa a varredura se estiver ocorrendo uma ação
            try {
                const refreshedChats = await getConversations()

                // RAÇA (RACE CONDITION) CHECK:
                // Se o usuário clicou em algo DURANTE os milissegundos que o banco demorou pra responder, 
                // descartamos os dados velhos para não chover (overwrite) a UI do usuário.
                if (isSendingRef.current) return

                setChats((prevChats) => {
                    let hasNewAlert = false

                    // Verifica se algo novo "INBOUND" das nuvens chegou (webhook salvou e a gente pegou no pool)
                    refreshedChats.forEach(newChat => {
                        const oldChat = prevChats.find(c => c.id === newChat.id)
                        if (oldChat) {
                            // Se a thread cresceu, pegar a ultima da ponta e ver se é do cliente
                            if (newChat.messages.length > oldChat.messages.length) {
                                const lastTipMessage = newChat.messages[newChat.messages.length - 1]
                                if (lastTipMessage?.sender === 'client') hasNewAlert = true
                            }
                        } else if (newChat.messages.length > 0) {
                            // Chat inédito parindo na base (Lead recém chegado e engatilhou boas-vindas)
                            // Mesmo que a utima msg seja do bot respondendo, apitamos pro dono que tem lead novo na loja
                            hasNewAlert = true
                        }
                    })

                    // Se a constou NOVIDADE DE FORA... PLIM!
                    if (hasNewAlert) {
                        try {
                            // Toca arquivo mp3 de notificação limpo public-domain do mixkit
                            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
                            audio.volume = 0.6
                            audio.play().catch(e => console.warn('Browser Safari/Chrome bloqueou Audio Autoplay sem interação', e))
                        } catch (e) { }
                    }

                    return refreshedChats
                })
            } catch (error) {
                console.error("[Polling] Erro ao sincronizar as conversas:", error)
            }
        }

        // Polling super agressivo de 1.5s para emular Realtime perfeitamente no MVP B2B.
        const intervalId = setInterval(fetchMessages, 1500)
        return () => clearInterval(intervalId)
    }, [isSending])

    // Create Deal State
    const [isAddDealOpen, setIsAddDealOpen] = useState(false)
    const [newDeal, setNewDeal] = useState({ title: '', value: 0 })

    const activeChat = chats.find(c => c.id === activeChatId)

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeChatId || isSending) return

        const tempText = messageInput.trim()
        setMessageInput('') // Clear UI instantly
        setIsSending(true)

        // Optimistic UI Append
        const optimisticId = `opt-${Date.now()}`
        const optimisticMsg: Message = {
            id: optimisticId,
            content: tempText,
            sender: 'me',
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        }

        setChats(prev => prev.map(c => {
            if (c.id === activeChatId) {
                return {
                    ...c,
                    messages: [...c.messages, optimisticMsg],
                    lastMessage: tempText,
                    time: optimisticMsg.time
                }
            }
            return c
        }))

        try {
            // Wait for DB Transaction & WhatsApp Provider Post
            const realMessage = await sendMessage(activeChatId, tempText)

            // Swap Optimistic ID with Real DB ID
            setChats(prev => prev.map(c => {
                if (c.id === activeChatId) {
                    return {
                        ...c,
                        messages: c.messages.map(m => m.id === optimisticId ? { ...realMessage, content: realMessage.content || '' } : m)
                    }
                }
                return c
            }))

        } catch (error: any) {
            toast.error(error.message || "Erro no envio de mensagem WhatsApp.")
            // Remove optimistic on failure
            setChats(prev => prev.map(c => {
                if (c.id === activeChatId) {
                    return { ...c, messages: c.messages.filter(m => m.id !== optimisticId) }
                }
                return c
            }))
        } finally {
            setIsSending(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !activeChatId || isSending) return

        setIsSending(true)
        const toastId = toast.loading("Enviando anexo para plataforma...")

        try {
            const formData = new FormData()
            formData.append('file', file)

            const realMsg = await sendMediaMessage(activeChatId, formData)

            setChats(prev => prev.map(c => {
                if (c.id === activeChatId) {
                    return { ...c, messages: [...c.messages, realMsg] as Message[], lastMessage: "📎 Anexo enviado", time: realMsg.time }
                }
                return c
            }))
            toast.success("Anexo enviado!", { id: toastId })
        } catch (error: any) {
            toast.error(error.message || "Erro ao enviar anexo.", { id: toastId })
        } finally {
            setIsSending(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleEditDealValue = async (dealId: string, currentValue: number) => {
        const valStr = window.prompt("Digite o novo valor negociado (ex: 1500 ou 1500.50):", currentValue.toString())
        if (valStr === null) return

        const num = parseFloat(valStr.replace(',', '.'))
        if (isNaN(num)) {
            toast.error("Formato de valor inválido.")
            return
        }

        setIsSending(true)
        try {
            await updateDealValue(dealId, num)
            toast.success("Valor atualizado na esteira Kanban!")

            // Atualiza de forma otimista localmente
            setChats(prev => prev.map(c => {
                if (c.id === activeChatId) {
                    return {
                        ...c,
                        deals: c.deals.map(d => d.id === dealId ? { ...d, value: num } : d)
                    }
                }
                return c
            }))
        } catch (e: any) {
            toast.error(e.message || "Erro ao atualizar valor do negócio.")
        } finally {
            setIsSending(false)
        }
    }

    const handleToggleBot = async () => {
        if (!activeChatId || !activeChat) return

        setIsSending(true)
        // Optimistic toggle
        const newStatus = !activeChat.isBotHandling
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, isBotHandling: newStatus } : c))

        try {
            await toggleBotStatus(activeChatId, newStatus)
            toast.success(newStatus ? "Robô reativado para esta conversa." : "Atendimento assumido pelo Humano.")
        } catch (error: any) {
            toast.error("Falha ao alterar controle do bot.")
            // Rollback on fail
            setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, isBotHandling: !newStatus } : c))
        } finally {
            setIsSending(false)
        }
    }

    const handleToggleTag = async (tag: string) => {
        if (!activeChatId || !activeChat) return

        setIsSending(true)
        const currentTags = activeChat.tags || []
        const newTags = currentTags.includes(tag) ? currentTags.filter(t => t !== tag) : [...currentTags, tag]

        // Optimistic toggle
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, tags: newTags } : c))

        try {
            await toggleTag(activeChatId, tag)
            toast.success(newTags.includes(tag) ? `Tag '${tag}' adicionada.` : `Tag '${tag}' removida.`)
        } catch (error: any) {
            toast.error("Falha ao atualizar tag.")
            // Rollback on fail
            setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, tags: currentTags } : c))
        } finally {
            setIsSending(false)
        }
    }

    const handleAiSuggestion = async () => {
        if (!activeChatId) return

        setIsGeneratingAi(true)
        const toastId = toast.loading("✨ Analisando conversa com a IA Google Gemini...")
        try {
            const aiResponse = await generateAiReply(activeChatId)

            // Nova arquitetura segura contra Digest Errors
            if (aiResponse.error) {
                toast.error(aiResponse.error, { id: toastId })
                return
            }

            if (aiResponse.suggestion) {
                setMessageInput(aiResponse.suggestion)
                toast.success("Sugestão de resposta criada!", { id: toastId })
            }
        } catch (error: any) {
            toast.error(error.message || "A Mágica falhou. Tente novamente.", { id: toastId })
        } finally {
            setIsGeneratingAi(false)
        }
    }

    const filteredChats = activeTagFilter
        ? chats.filter(c => c.tags?.includes(activeTagFilter))
        : chats

    return (
        <div className="flex h-full w-full bg-[#151515] relative z-10 border-l border-border/10">

            {/* 1. Chats List Sidebar - SaaS Style */}
            <div className="w-80 flex-shrink-0 flex flex-col bg-[#1c1c1c] border-r border-border/20">
                <div className="p-3 bg-transparent flex items-center justify-between border-b border-border/10">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#151515] text-[#ff7b00] border border-border/30 flex items-center justify-center font-bold text-sm">
                            EU
                        </div>
                        <h2 className="text-sm font-bold text-white">Caixa de Entrada</h2>
                    </div>
                </div>

                <div className="p-2 border-b border-border/10">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Buscar conversas..."
                            className="w-full pl-9 bg-[#151515] text-white border-border/20 rounded-lg h-9 placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-[#ff7b00]"
                        />
                    </div>

                    {/* Tags Filer */}
                    <div className="flex items-center gap-1.5 mt-3 overflow-x-auto scrollbar-none pb-1">
                        <button
                            onClick={() => setActiveTagFilter(null)}
                            className={`text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full font-medium transition-colors border ${!activeTagFilter ? 'bg-[#ff7b00] text-white border-[#ff7b00]' : 'bg-[#151515] text-zinc-400 border-white/5 hover:border-white/10'}`}
                        >
                            Todas
                        </button>
                        {AVAILABLE_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveTagFilter(tag)}
                                className={`text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full font-medium transition-colors border ${activeTagFilter === tag ? 'bg-orange-500 text-white border-orange-500' : 'bg-[#151515] text-zinc-400 border-white/5 hover:border-white/10'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {filteredChats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-border/5 ${activeChatId === chat.id ? 'bg-[#ff7b00]/10 border-l-2 border-l-[#ff7b00]' : 'hover:bg-white/5 border-l-2 border-l-transparent'}`}
                        >
                            <div className="relative">
                                <div className="w-11 h-11 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white/90 font-bold text-sm flex-shrink-0 border border-white/5">
                                    {chat.name.substring(0, 2).toUpperCase()}
                                </div>
                                {chat.isBotHandling && (
                                    <div className="absolute -bottom-1 -right-1 bg-[#1c1c1c] rounded-full p-0.5 shadow-sm border border-border/30">
                                        <Bot className="w-3.5 h-3.5 text-[#ff7b00]" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0 pr-1 pb-1">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className={`text-[14px] truncate font-medium ${activeChatId === chat.id ? 'text-[#ff7b00]' : 'text-zinc-200'}`}>
                                        {chat.name}
                                    </h3>
                                    <span className={`text-[11px] whitespace-nowrap ml-2 ${chat.unread > 0 ? 'text-[#ff7b00] font-bold' : 'text-zinc-500'}`}>
                                        {chat.time}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <p className={`text-[12px] truncate ${chat.unread > 0 ? 'text-zinc-300 font-medium' : 'text-zinc-500'}`}>
                                        {chat.lastMessage}
                                    </p>
                                    {chat.unread > 0 && (
                                        <div className="w-4 h-4 rounded-full bg-[#ff7b00] flex items-center justify-center text-white text-[9px] font-bold shadow-sm flex-shrink-0">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Chat Area - Deep Dark SaaS Style */}
            {activeChat ? (
                <div className="flex-1 flex flex-col bg-[#151515] relative overflow-hidden">

                    {/* Chat Header */}
                    <div className="h-[60px] flex-shrink-0 flex items-center justify-between px-6 bg-[#1c1c1c] z-10 border-b border-border/10">
                        <div className="flex items-center gap-4 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center font-bold text-sm text-white border border-white/5">
                                {activeChat.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col justify-center">
                                <h2 className="text-[15px] font-medium text-white tracking-wide">{activeChat.name}</h2>
                                <p className="text-[12px] text-[#ff7b00] font-light mt-0.5">
                                    {activeChat.isBotHandling ? (
                                        <span className="flex items-center gap-1">
                                            <Bot className="w-3 h-3" /> Em triagem automática
                                        </span>
                                    ) : 'online'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1.5 hidden md:flex mr-2">
                                {AVAILABLE_TAGS.map(tag => {
                                    const isActive = activeChat.tags?.includes(tag)
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => handleToggleTag(tag)}
                                            className={`text-[10px] whitespace-nowrap px-2 py-0.5 rounded border transition-colors shadow-sm ${isActive ? 'bg-[#ff7b00]/20 text-[#ff7b00] border-[#ff7b00]/40' : 'bg-transparent text-zinc-500 border-white/5 hover:border-white/20'}`}
                                        >
                                            {tag}
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                onClick={handleToggleBot}
                                className={`text-[12px] font-bold px-3 py-1.5 rounded-md transition-colors border ${activeChat.isBotHandling ? 'text-zinc-300 border-white/20 hover:bg-white/10' : 'text-[#ff7b00] bg-[#ff7b00]/10 border-[#ff7b00]/30 hover:bg-[#ff7b00]/20'}`}
                            >
                                {activeChat.isBotHandling ? "Assumir Conversa" : "Devolver ao Robô"}
                            </button>
                        </div>
                    </div>

                    {/* Messages Canvas */}
                    <div className="flex-1 overflow-y-auto px-[10%] py-6 z-10 flex flex-col gap-4 scrollbar-thin">
                        <div className="text-center mb-4">
                            <span className="bg-[#1c1c1c] text-zinc-400 text-[11px] px-3 py-1 rounded-full border border-white/5 font-medium tracking-wide">Hoje</span>
                        </div>

                        {activeChat.messages.map((message) => {
                            const isMe = message.sender === 'me'
                            const isBot = message.sender === 'bot'

                            let displayContent = message.content
                            let isMedia = false
                            let mediaId = ""
                            let msgType = message.type || 'TEXT'

                            if (msgType !== 'TEXT') {
                                try {
                                    const parsed = JSON.parse(message.content)
                                    displayContent = parsed.text
                                    mediaId = parsed.mediaId
                                    isMedia = true
                                } catch (e) { }
                            }

                            // High Contrast SaaS Dark Bubbles
                            let bubbleClass = "px-4 py-2.5 shadow-md text-[13.5px] leading-relaxed max-w-[75%] lg:max-w-[65%] "
                            if (isMe || isBot) {
                                bubbleClass += "bg-[#ff7b00] text-white rounded-2xl rounded-tr-sm ml-auto"
                            } else {
                                bubbleClass += "bg-[#222222] text-zinc-200 border border-white/5 rounded-2xl rounded-tl-sm mr-auto"
                            }

                            return (
                                <div key={message.id} className={`flex w-full`}>
                                    <div className={bubbleClass}>
                                        {isBot && (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/80 mb-1.5 tracking-wider uppercase">
                                                <Bot className="w-3 h-3" /> FLY UP Bot
                                            </div>
                                        )}
                                        <div className="whitespace-pre-wrap">
                                            {isMedia && (
                                                <span className="flex items-center gap-2 mb-1 opacity-80 text-[11px] font-bold">
                                                    {msgType === 'DOCUMENT' && <FileText className="w-3.5 h-3.5" />}
                                                    {msgType === 'IMAGE' && <ImageIcon className="w-3.5 h-3.5" />}
                                                    {msgType === 'AUDIO' && <FileAudio className="w-3.5 h-3.5" />}
                                                    {msgType === 'VIDEO' && <Video className="w-3.5 h-3.5" />}
                                                </span>
                                            )}
                                            {displayContent}
                                        </div>

                                        {isMedia && mediaId && (
                                            msgType === 'IMAGE' ? (
                                                <img src={`/api/whatsapp/media/${mediaId}`} className="max-w-full rounded-md mt-2 object-cover object-center max-h-[300px]" alt="Mídia Recebida" />
                                            ) : msgType === 'AUDIO' ? (
                                                <div className="flex flex-col gap-2 w-full mt-2">
                                                    <audio src={`/api/whatsapp/media/${mediaId}`} controls className="w-full h-10" />
                                                    {message.transcription && (
                                                        <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 text-[12.5px] italic text-zinc-300 shadow-inner">
                                                            <Mic className="w-3 h-3 inline mr-1 opacity-70" />
                                                            {message.transcription}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : msgType === 'VIDEO' ? (
                                                <video src={`/api/whatsapp/media/${mediaId}`} controls className="w-full rounded-md mt-2 max-h-[250px]" />
                                            ) : (
                                                <a href={`/api/whatsapp/media/${mediaId}`} target="_blank" rel="noreferrer" className="mt-2 text-[11px] flex items-center justify-center gap-1.5 bg-black/20 hover:bg-black/40 w-full px-3 py-2 rounded-md border border-white/10 transition-colors shadow-inner font-medium">
                                                    <Download className="w-3.5 h-3.5 text-zinc-300" /> Baixar Anexo (Original)
                                                </a>
                                            )
                                        )}

                                        <div className={`text-[10px] text-right mt-1.5 flex items-center justify-end gap-1 float-right pl-4 pt-1 ${isMe || isBot ? 'text-white/70' : 'text-zinc-500'}`}>
                                            {message.time}
                                            {isMe && message.status === 'read' && <span className="text-white text-[10px] font-bold -ml-0.5">✓✓</span>}
                                            {isMe && message.status !== 'read' && <span className="text-white/50 text-[10px] font-bold -ml-0.5">✓✓</span>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="min-h-[70px] flex-shrink-0 bg-[#1c1c1c] px-6 py-3 flex items-center gap-3 z-10 border-t border-border/10 relative">
                        {showEmojiPicker && (
                            <div className="absolute bottom-[80px] left-6 z-50 shadow-2xl rounded-lg overflow-hidden border border-white/10">
                                <EmojiPicker
                                    theme={Theme.DARK}
                                    onEmojiClick={(e: EmojiClickData) => setMessageInput(prev => prev + e.emoji)}
                                />
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*,audio/*,application/pdf" onChange={handleFileUpload} />
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors shrink-0">
                            <Paperclip className="w-4 h-4" />
                        </button>
                        <button
                            className={`p-2 rounded-full transition-colors shrink-0 ${showEmojiPicker ? 'text-[#ff7b00] bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <Smile className="w-4 h-4" />
                        </button>

                        <button
                            disabled={isGeneratingAi}
                            onClick={handleAiSuggestion}
                            title="Sugerir Resposta Mágica"
                            className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-full transition-colors shrink-0 disabled:opacity-50"
                        >
                            <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-pulse' : ''}`} />
                        </button>

                        <div className="flex-1 bg-[#151515] border border-border/20 focus-within:border-[#ff7b00]/50 rounded-full flex items-center px-4 shadow-inner overflow-hidden transition-colors">
                            <input
                                type="text"
                                placeholder={activeChat?.isBotHandling ? "O chatbot está atendendo. Digite para assumir..." : "Escreva sua mensagem..."}
                                className="w-full py-2.5 bg-transparent text-[14px] outline-none placeholder:text-zinc-600 text-zinc-200"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSendMessage()
                                    }
                                }}
                                disabled={isSending}
                            />
                        </div>

                        {messageInput.trim() || isSending ? (
                            <button
                                onClick={handleSendMessage}
                                disabled={isSending}
                                className="p-3 bg-[#ff7b00] text-white rounded-full hover:bg-[#e66a00] transition-colors active:scale-95 shadow-lg shadow-[#ff7b00]/20 flex items-center justify-center shrink-0 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        ) : (
                            <button className="p-3 bg-[#2a2a2a] text-zinc-400 rounded-full hover:bg-[#333] hover:text-white transition-colors shrink-0">
                                <Mic className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-[#151515] flex items-center justify-center flex-col text-center">
                    <div className="rounded-full bg-[#1c1c1c] p-6 mb-6 shadow-xl border border-white/5">
                        <Globe className="w-16 h-16 text-zinc-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white tracking-tight">FLY UP Web</h2>
                    <p className="text-zinc-500 mt-3 max-w-sm text-sm">Selecione uma conversa ao lado e inicie o atendimento integrado com o CRM.</p>
                </div>
            )}

            {/* 3. Deal / Contact Info Sidebar - Dark Mode */}
            {activeChat && (
                <div className="w-80 flex-shrink-0 bg-[#1c1c1c] hidden lg:flex flex-col border-l border-border/20">
                    <div className="p-8 flex flex-col items-center text-center bg-transparent border-b border-border/10 z-10">
                        <div className="w-24 h-24 rounded-full bg-[#2a2a2a] border border-white/5 flex items-center justify-center text-white font-bold text-3xl shadow-xl mb-4">
                            {activeChat.name.substring(0, 2).toUpperCase()}
                        </div>
                        <h2 className="text-lg font-semibold text-white tracking-wide">{activeChat.name}</h2>
                        <p className="text-[13px] text-zinc-400 mt-1">{activeChat.phone}</p>
                    </div>

                    <div className="flex-1 bg-[#151515] overflow-y-auto scrollbar-thin p-4 flex flex-col gap-4">
                        <div className="bg-[#1c1c1c] rounded-xl p-5 border border-white/5 shadow-md">
                            <h3 className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 mb-4">Informações</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[14px] text-zinc-300">
                                    <Phone className="w-4 h-4 text-[#ff7b00]" />
                                    {activeChat.phone}
                                </div>
                                <div className="flex items-center gap-3 text-[14px] text-zinc-400 hover:text-white transition-colors cursor-pointer">
                                    <Mail className="w-4 h-4 text-zinc-500" />
                                    <span>Adicionar e-mail...</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1c1c1c] rounded-xl p-5 border border-white/5 shadow-md">
                            <h3 className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 mb-4">Segurança LGPD</h3>
                            <div className="flex items-start gap-3">
                                <ShieldAlert className={`w-4 h-4 mt-0.5 ${activeChat.lgpdConsent ? 'text-emerald-500' : 'text-[#ff7b00]'}`} />
                                <div>
                                    <p className="text-[14px] text-white font-medium">Opt-in via Webhook</p>
                                    <p className="text-[12px] text-zinc-500 mt-0.5">{activeChat.lgpdConsent ? 'Consentimento Ativo' : 'Pendente verificação'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1c1c1c] rounded-xl p-5 border border-white/5 shadow-md mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[12px] font-bold uppercase tracking-wider text-zinc-500">Pipeline</h3>
                                <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
                                    <DialogTrigger asChild>
                                        <button className="text-[12px] font-bold text-[#ff7b00] hover:text-[#ff7b00]/80 flex items-center gap-1 transition-colors">
                                            <Plus className="w-3.5 h-3.5" /> NOVO
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] bg-[#1c1c1c] border-border text-white">
                                        <DialogHeader>
                                            <DialogTitle>Nova Oportunidade</DialogTitle>
                                            <DialogDescription className="text-zinc-400">Criando card CRM para {activeChat.name}.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="titleDeal" className="text-right text-zinc-300">Título</Label>
                                                <Input id="titleDeal" placeholder="Venda Produto B2B..." value={newDeal.title} onChange={e => setNewDeal({ ...newDeal, title: e.target.value })} className="col-span-3 bg-[#151515] border-border/30" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="valueDeal" className="text-right text-zinc-300">Valor</Label>
                                                <MoneyInput id="valueDeal" value={newDeal.value} onValueChange={val => setNewDeal({ ...newDeal, value: val })} className="col-span-3 bg-[#151515] border-border/30" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" className="bg-[#ff7b00] hover:bg-[#e66a00] text-white" onClick={async () => {
                                                if (!newDeal.title) {
                                                    toast.error("O título não pode estar vazio.")
                                                    return
                                                }
                                                try {
                                                    const deal = await createDealFromInbox(activeChat.id, newDeal.title, newDeal.value || 0)

                                                    setChats(prev => prev.map(c => {
                                                        if (c.id === activeChat.id) {
                                                            return { ...c, deals: [deal, ...c.deals] }
                                                        }
                                                        return c
                                                    }))
                                                    toast.success("Negócio Criado e Inserido no Kanban!")
                                                    setIsAddDealOpen(false)
                                                    setNewDeal({ title: '', value: 0 })
                                                } catch (e: any) {
                                                    toast.error(e.message || "Falha ao criar oportunidade.")
                                                }
                                            }}>
                                                Confirmar
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Deals from DB */}
                            <div className="flex flex-col gap-3 mt-4">
                                {activeChat.deals && activeChat.deals.length > 0 ? (
                                    activeChat.deals.map(deal => (
                                        <div key={deal.id} onClick={() => handleEditDealValue(deal.id, deal.value)} className="bg-[#151515] rounded-xl p-3 border border-border/10 cursor-pointer shadow-inner hover:border-[#ff7b00]/30 transition-colors group">
                                            <h4 className="font-medium text-white text-[13px] group-hover:text-[#ff7b00] transition-colors">{deal.title}</h4>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider">{deal.stageName}</span>
                                                <span className="text-[13px] font-bold text-zinc-300">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.value)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-[#151515] rounded-xl p-4 border border-border/10 text-center">
                                        <p className="text-[12px] text-zinc-500 font-medium">Nenhuma oportunidade atrelada.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
