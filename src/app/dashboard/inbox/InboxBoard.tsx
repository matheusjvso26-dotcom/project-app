'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, MoreVertical, Phone, Mail, Globe, Send, Paperclip, Smile, Mic, ShieldAlert, Bot, Plus, Download, FileText, Image as ImageIcon, FileAudio, Video, Sparkles, MessageCircle, Briefcase, Settings, Archive, Trash2, X } from 'lucide-react'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MoneyInput } from "@/components/ui/masked-input"
import { sendMessage, getConversations, updateDealValue, sendMediaMessage, createDealFromInbox, toggleBotStatus, generateAiReply, toggleTag, getTagsConfig, updateTagsConfig, archiveConversation } from './actions'
import { toast } from 'sonner'

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

export interface CustomTag { 
    id: string
    name: string
    color: string 
}

export interface Chat {
    id: string
    name: string
    phone: string
    status: string
    lastMessage: string
    time: string
    unread: number
    isBotHandling: boolean
    lgpdConsent: boolean
    tags: string[] // Custom Tags
    profilePictureUrl?: string | null
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
    const [customTags, setCustomTags] = useState<CustomTag[]>([])
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [editingTags, setEditingTags] = useState<CustomTag[]>([])
    const [activeTab, setActiveTab] = useState<'OPEN'|'ARCHIVED'>('OPEN')

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isSendingRef = useRef(false)

    useEffect(() => {
        getTagsConfig().then(res => {
            if(Array.isArray(res)) setCustomTags(res)
        }).catch(console.error)
    }, [])

    // Sincronizando o estado isSending com o Ref para acesso síncrono no Polling
    useEffect(() => {
        isSendingRef.current = isSending
    }, [isSending])

    // Auto-scroll messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }, [activeChatId]) // Only auto scroll on chat change, not on background poll 'chats' update

    // --- REALTIME MOTOR (POLLING) --- 
    useEffect(() => {
        const fetchMessages = async () => {
            if (isSendingRef.current) return // pausa a varredura se estiver ocorrendo uma ação
            try {
                const refreshedChats = (await getConversations(Date.now())) as Chat[]

                // RAÇA (RACE CONDITION) CHECK:
                if (isSendingRef.current) return

                setChats((prevChats) => {
                    let hasNewAlert = false

                    const mergedChats = refreshedChats.map(newChat => {
                        const oldChat = prevChats.find(c => c.id === newChat.id)

                        if (oldChat) {
                            if (newChat.messages.length > oldChat.messages.length) {
                                const lastTipMessage = newChat.messages[newChat.messages.length - 1]
                                if (lastTipMessage?.sender === 'client') hasNewAlert = true
                            }

                            // Blindagem de Optimistic Messages
                            const optimisticMessages = oldChat.messages.filter(m => m.id.toString().startsWith('opt-'))
                            if (optimisticMessages.length > 0) {
                                const mergedMessages = [...newChat.messages]
                                optimisticMessages.forEach(optMsg => {
                                    if (!mergedMessages.find(m => m.content === optMsg.content && m.status === 'sent')) {
                                        mergedMessages.push(optMsg)
                                    }
                                })
                                return { ...newChat, messages: mergedMessages }
                            }
                        } else if (newChat.messages.length > 0) {
                            hasNewAlert = true
                        }

                        return newChat
                    })

                    // Se a constou NOVIDADE DE FORA... PLIM!
                    if (hasNewAlert) {
                        try {
                            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
                            audio.volume = 0.6
                            audio.play().catch(e => console.warn('Browser bloqueou Audio Autoplay sem interação'))
                        } catch (e) { }
                    }

                    // FILTRO DEFINITIVO: Impede que conversas excluídas/arquivadas retornem para a tela
                    return mergedChats.filter(c => c.status === activeTab || (activeTab === 'OPEN' && c.status === 'BOT_HANDLING'))
                })
            } catch (error) {
                console.error("[Polling] Erro ao sincronizar as conversas:", error)
            }
        }

        const intervalId = setInterval(fetchMessages, 1500)
        return () => clearInterval(intervalId)
    }, [isSending, activeTab])

    const [isAddDealOpen, setIsAddDealOpen] = useState(false)
    const [newDeal, setNewDeal] = useState({ title: '', value: 0 })

    const activeChat = chats.find(c => c.id === activeChatId)

    const handleSaveTags = async () => {
        setIsSending(true)
        try {
            await updateTagsConfig(editingTags)
            setCustomTags(editingTags)
            setIsSettingsOpen(false)
            toast.success("Etiquetas coloridas salvas!")
        } catch(e: any) { toast.error(e.message) }
        finally { setIsSending(false) }
    }

    const handleArchive = async (id: string, archive: boolean) => {
        if(confirm(archive ? "Deseja arquivar/excluir esta conversa? Ela sairá da sua lista de ativas." : "Deseja restaurar esta conversa? Ela voltará para as ativas.")) {
            setIsSending(true)
            // Optimistic UI Update - Força que ActiveChat mude instantaneamente
            setChats(prev => prev.map(c => c.id === id ? {...c, status: archive ? 'ARCHIVED' : 'OPEN'} : c))
            if(id === activeChatId) setActiveChatId('')
            
            try {
                await archiveConversation(id, archive)
            } catch(e) {
                toast.error("Erro ao modificar status da conversa")
                // Rollback em caso de erro
                setChats(prev => prev.map(c => c.id === id ? {...c, status: !archive ? 'ARCHIVED' : 'OPEN'} : c))
            } finally {
                setIsSending(false)
            }
        }
    }

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeChatId || isSending) return

        const tempText = messageInput.trim()
        setMessageInput('') // Clear UI instantly
        setIsSending(true)
        setShowEmojiPicker(false)

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
            const realMessage = await sendMessage(activeChatId, tempText)
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

            setChats(prev => prev.map(c => {
                if (c.id === activeChatId) {
                    return { ...c, deals: c.deals.map(d => d.id === dealId ? { ...d, value: num } : d) }
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
        const newStatus = !activeChat.isBotHandling
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, isBotHandling: newStatus } : c))

        try {
            await toggleBotStatus(activeChatId, newStatus)
            toast.success(newStatus ? "Robô reativado para esta conversa." : "Atendimento assumido pelo Humano.")
        } catch (error: any) {
            toast.error("Falha ao alterar controle do bot.")
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

        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, tags: newTags } : c))

        try {
            await toggleTag(activeChatId, tag)
            toast.success(newTags.includes(tag) ? `Tag '${tag}' adicionada.` : `Tag '${tag}' removida.`)
        } catch (error: any) {
            toast.error("Falha ao atualizar tag.")
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

    const baseChats = chats.filter(c => activeTab === 'ARCHIVED' ? c.status === 'ARCHIVED' : c.status !== 'ARCHIVED')
    const filteredChats = activeTagFilter
        ? baseChats.filter(c => c.tags?.includes(activeTagFilter))
        : baseChats

    return (
        <div className="flex h-full w-full bg-background text-foreground overflow-hidden font-sans border-l border-border/50 relative z-10">
            {/* TAGS SETTINGS MODAL */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent className="sm:max-w-[500px] bg-card border border-border text-foreground shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-foreground text-lg font-medium">Configurar Etiquetas</DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm mt-1">
                            Crie etiquetas customizadas com cores M2R para classificar suas conversas.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2 flex flex-col gap-3 min-h-[150px] max-h-[350px] overflow-y-auto scrollbar-thin">
                        {editingTags.map((tag, idx) => (
                            <div key={tag.id} className="flex items-center gap-2 bg-background p-2 rounded border border-border">
                                <input type="color" value={tag.color} onChange={e => {
                                    const newTags = [...editingTags];
                                    newTags[idx].color = e.target.value;
                                    setEditingTags(newTags);
                                }} className="w-8 h-8 rounded shrink-0 cursor-pointer border-0 p-0 bg-transparent" />
                                <Input value={tag.name} onChange={e => {
                                    const newTags = [...editingTags];
                                    newTags[idx].name = e.target.value;
                                    setEditingTags(newTags);
                                }} className="bg-transparent border-none text-[14px] flex-1 text-foreground h-8 focus-visible:ring-0 px-2" placeholder="Ex: INSS Aposentado..." />
                                <button onClick={() => setEditingTags(editingTags.filter(t => t.id !== tag.id))} className="p-1 hover:bg-accent rounded">
                                    <X className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        ))}
                        <button onClick={() => setEditingTags([...editingTags, { id: 'tag-'+Date.now(), name: 'Nova Etiqueta', color: '#00a884' }])}
                            className="bg-accent hover:bg-accent text-foreground py-2 rounded-lg text-sm font-medium transition-colors border border-dashed border-[#8696a0]/50 flex items-center justify-center gap-2 mt-2">
                            <Plus className="w-4 h-4" /> Adicionar Etiqueta
                        </button>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" className="text-foreground border-border hover:bg-accent" onClick={() => setIsSettingsOpen(false)}>Cancelar</Button>
                        <Button className="bg-[#00a884] hover:bg-[#00bfa5] text-primary-foreground font-bold" disabled={isSending} onClick={handleSaveTags}>
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* 1. Sidebar (Esquerda, Lista de Chats) */}
            <div className={`flex-shrink-0 flex flex-col border-r border-border transition-all duration-300 ${activeChatId ? 'hidden lg:flex w-full lg:w-[32%]' : 'w-full lg:w-[32%]'}`}>
                {/* Header Sidebar */}
                <div className="h-[59px] flex items-center justify-between px-4 bg-card shrink-0 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-[#6b7c85] text-foreground flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 border-2 border-transparent hover:border-[#00a884] cursor-pointer transition-colors shadow">
                        <img src="https://ui-avatars.com/api/?name=EU&background=6b7c85&color=fff" alt="User" />
                    </div>
                    <div className="flex gap-2 text-muted-foreground">
                        <button title="Conversas Abertas" onClick={() => setActiveTab('OPEN')} className={`p-1 transition-colors ${activeTab === 'OPEN' ? 'text-foreground' : 'hover:text-foreground'}`}>
                            <MessageCircle className="w-[20px] h-[20px]" />
                        </button>
                        <button title="Excluídas / Arquivadas" onClick={() => setActiveTab('ARCHIVED')} className={`p-1 transition-colors ${activeTab === 'ARCHIVED' ? 'text-foreground' : 'hover:text-foreground'}`}>
                            <Archive className="w-[20px] h-[20px]" />
                        </button>
                        <button title="Configurar Etiquetas" onClick={() => { setEditingTags(customTags); setIsSettingsOpen(true); }} className="p-1 hover:text-foreground transition-colors">
                            <Settings className="w-[20px] h-[20px]" />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-[10px] border-b border-border bg-background">
                    <div className="relative flex items-center bg-card rounded-[8px] h-[35px] px-3">
                        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                        <input
                            type="text"
                            placeholder="Pesquisar ou começar uma nova conversa"
                            className="bg-transparent border-none outline-none text-[14px] ml-4 w-full placeholder:text-muted-foreground text-foreground font-normal"
                        />
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex px-3 py-2.5 gap-[7px] border-b border-border overflow-x-auto scrollbar-none">
                    <button onClick={() => setActiveTagFilter(null)} className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-colors whitespace-nowrap ${!activeTagFilter ? 'bg-[#00a884]/20 text-[#00a884] hover:bg-[#00a884]/30' : 'bg-card hover:bg-accent text-muted-foreground'}`}>
                        Todas do {activeTab === 'OPEN' ? 'Inbox' : 'Lixo'}
                    </button>
                    {customTags.map(tag => (
                        <button key={tag.id} onClick={() => setActiveTagFilter(tag.name)} 
                            style={{ 
                                backgroundColor: activeTagFilter === tag.name ? tag.color + '33' : '#202c33', 
                                color: activeTagFilter === tag.name ? tag.color : '#aebac1',
                                border: `1px solid ${activeTagFilter === tag.name ? tag.color + '55' : 'transparent'}`
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap overflow-hidden flex items-center gap-1.5 ${activeTagFilter !== tag.name && 'hover:bg-accent'}`}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></span>
                            {tag.name}
                        </button>
                    ))}
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#202c33] scrollbar-track-transparent">
                    {filteredChats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={`flex items-center gap-[14px] pl-[13px] pr-4 cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-accent' : 'hover:bg-card'}`}
                        >
                            <div className="relative shrink-0 py-[11px]">
                                <div className="w-[49px] h-[49px] rounded-full bg-muted border border-border flex items-center justify-center text-primary-foreground font-semibold text-xl overflow-hidden shadow-sm shrink-0">
                                    {chat.profilePictureUrl ? (
                                        <img src={chat.profilePictureUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        chat.name.substring(0, 2).toUpperCase()
                                    )}
                                </div>
                                {chat.isBotHandling && (
                                    <div className="absolute bottom-2.5 -right-0.5 bg-background rounded-full p-0.5 shadow-sm border border-[#111b21]">
                                        <Bot className="w-[14px] h-[14px] text-[#00a884]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 border-b border-border py-[13px] h-full flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-[3px]">
                                    <h3 className="text-[17px] leading-[21px] truncate text-foreground -mt-1 font-normal flex items-center gap-2">
                                        {chat.name}
                                        {chat.tags && chat.tags.length > 0 && (
                                            <div className="flex gap-1 overflow-hidden">
                                                {chat.tags.slice(0, 2).map(tagStr => {
                                                    const tagData = customTags.find(t => t.name === tagStr)
                                                    return tagData ? <span key={tagStr} className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: tagData.color }} title={tagStr}></span> : null
                                                })}
                                            </div>
                                        )}
                                    </h3>
                                    <span className={`text-[12px] whitespace-nowrap ml-2 leading-[14px] -mt-1 ${chat.unread > 0 ? 'text-[#00a884] font-medium' : 'text-muted-foreground'}`}>
                                        {chat.time}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[14px] leading-[20px] truncate text-muted-foreground font-normal tracking-wide">
                                        {chat.lastMessage}
                                    </p>
                                    {chat.unread > 0 && (
                                        <div className="w-[18px] h-[18px] rounded-full bg-[#00a884] flex items-center justify-center text-primary-foreground text-[11px] font-bold shrink-0 ml-2">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredChats.length === 0 && (
                        <div className="text-center p-6 mt-10 text-muted-foreground text-sm">
                            Nenhuma conversa encontrada.
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Chat Area Principal (Direita) */}
            {activeChat ? (
                <div className={`flex-1 flex flex-col bg-muted relative ${!activeChatId && 'hidden lg:flex'}`}>

                    {/* Background Pattern WPP Overlay dark default WPP Doodles */}
                    <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0 mix-blend-screen" style={{ backgroundImage: 'url("https://static.whatsapp.net/rsrc.php/v3/yl/r/r_QxIsuT8R4.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }}></div>

                    {/* Chat Header */}
                    <div className="h-[59px] flex items-center justify-between px-4 bg-card z-10 shrink-0 shadow-sm border-l border-transparent">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveChatId('')}>
                            {/* Botão de voltar (mobile) */}
                            <button className="lg:hidden text-muted-foreground hover:text-foreground" title="Voltar para a lista">
                                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="fill-current"><path d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path></svg>
                            </button>
                            <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-primary-foreground text-lg shrink-0 overflow-hidden shadow">
                                {activeChat.profilePictureUrl ? (
                                    <img src={activeChat.profilePictureUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    activeChat.name.substring(0, 2).toUpperCase()
                                )}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0 pr-2">
                                <h2 className="text-[16px] text-foreground font-normal truncate">{activeChat.name}</h2>
                                <p className="text-[13px] text-muted-foreground truncate mt-[1px]">
                                    {activeChat.isBotHandling ? (
                                        <span className="flex items-center gap-1.5 font-medium text-[#00a884]">
                                            <Bot className="w-3.5 h-3.5" /> robô auto-piloto
                                        </span>
                                    ) : 'online... escrevendo sua mensagem'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-[22px] text-muted-foreground">

                            {/* Modal de CRM Oculto no ícone de Sidebar (Listra) */}
                            <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
                                <DialogTrigger asChild>
                                    <button title="Gestão de Negócios / Painel Comercial" className="hover:text-foreground transition-colors">
                                        <Briefcase className="w-[22px] h-[22px]" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] bg-card border border-border text-foreground shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-foreground text-lg font-medium">Perfil Comercial</DialogTitle>
                                        <DialogDescription className="text-muted-foreground text-sm mt-1">{activeChat.name} • {activeChat.phone}</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-2 flex flex-col gap-4">
                                        <div className="bg-background p-3.5 rounded-lg flex items-center justify-between border border-transparent">
                                            <span className="text-sm font-semibold tracking-wide text-foreground">LGPD: Assinatura de Conversa</span>
                                            <ShieldAlert className={`w-[18px] h-[18px] ${activeChat.lgpdConsent ? 'text-[#00a884]' : 'text-orange-500'}`} />
                                        </div>

                                        <div>
                                            <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#00a884] mb-2 px-1">Negócios no Kanban:</h4>
                                            <div className="flex flex-col gap-2">
                                                {activeChat.deals?.map(deal => (
                                                    <div key={deal.id} className="bg-background p-3.5 rounded-lg flex justify-between items-center cursor-pointer border border-border hover:border-[#00a884]/40 transition-all shadow-sm" onClick={() => handleEditDealValue(deal.id, deal.value)}>
                                                        <div>
                                                            <p className="font-medium text-[15px] text-foreground">{deal.title}</p>
                                                            <p className="text-[#00a884] text-[11px] font-bold uppercase mt-1 tracking-wider bg-[#00a884]/10 rounded px-1.5 py-0.5 inline-block">{deal.stageName}</p>
                                                        </div>
                                                        <span className="font-bold text-[16px] text-foreground">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.value)}
                                                        </span>
                                                    </div>
                                                ))}

                                                {(!activeChat.deals || activeChat.deals.length === 0) && (
                                                    <div className="text-center p-5 bg-background rounded-lg border border-border">
                                                        <p className="text-[13px] text-muted-foreground font-medium">Você ainda não converteu negócios com este contato.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-background p-3 rounded-lg border border-border mt-2">
                                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Criar Oportunidade</h4>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <Input placeholder="Título Comercial" value={newDeal.title} onChange={e => setNewDeal({ ...newDeal, title: e.target.value })} className="bg-card border-none text-[13px] h-[34px] text-foreground placeholder:text-muted-foreground" />
                                                <MoneyInput value={newDeal.value} onValueChange={val => setNewDeal({ ...newDeal, value: val })} className="bg-card border-none text-[13px] h-[34px] text-foreground placeholder:text-muted-foreground" />
                                            </div>
                                            <Button type="button" className="bg-[#00a884] hover:bg-[#00bfa5] text-primary-foreground font-bold h-9 w-full shadow border-none transition-colors" onClick={async () => {
                                                if (!newDeal.title) return toast.error("Por favor dê um nome a Oportunidade Kanban.");
                                                setIsSending(true)
                                                try {
                                                    const deal = await createDealFromInbox(activeChat.id, newDeal.title, newDeal.value || 0)
                                                    setChats(prev => prev.map(c => c.id === activeChat.id ? { ...c, deals: [deal, ...c.deals] } : c))
                                                    setNewDeal({ title: '', value: 0 })
                                                    toast.success("Negócio Criado!")
                                                } catch (e: any) { toast.error(e.message) }
                                                finally { setIsSending(false) }
                                            }}>
                                                ENVIAR PARA KANBAN B2B
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Search className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />

                            <button
                                onClick={handleToggleBot}
                                className={`px-[10px] py-[4px] text-[11.5px] font-bold rounded flex items-center gap-1.5 uppercase tracking-wide transition-colors ${activeChat.isBotHandling ? 'text-muted-foreground bg-background border border-border hover:bg-accent' : 'bg-[#00a884] text-primary-foreground hover:bg-[#00bfa5] shadow'}`}
                            >
                                {activeChat.isBotHandling ? "Assumir" : <><Bot className="w-3.5 h-3.5" /> Automático</>}
                            </button>
                            {/* TAGS Selector In-Chat */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button title="Adicionar Etiqueta ao Cliente" className="px-2.5 py-1 bg-card border border-border rounded hover:bg-accent text-[12.5px] font-medium flex items-center gap-1.5 text-foreground">
                                        {activeChat.tags && activeChat.tags.length > 0 ? (
                                            <>
                                                <div className="flex gap-0.5">
                                                    {activeChat.tags.slice(0, 3).map(tagStr => {
                                                        const color = customTags.find(t => t.name === tagStr)?.color || '#00a884'
                                                        return <span key={tagStr} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                                                    })}
                                                </div>
                                            </>
                                        ) : "+ Tags"}
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] bg-card border border-border text-foreground shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-foreground text-lg font-medium">Classificar Cliente ({activeChat.name})</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-2 py-4">
                                        {customTags.map(tag => {
                                            const isActive = activeChat.tags?.includes(tag.name)
                                            return (
                                                <button key={tag.id} onClick={() => handleToggleTag(tag.name)}
                                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isActive ? 'bg-background' : 'bg-background/50 hover:bg-background'}`}
                                                    style={{ borderColor: isActive ? tag.color : '#30424d' }}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: tag.color }}></span>
                                                        <span className="font-medium text-[14px]" style={{ color: isActive ? tag.color : '#e9edef' }}>{tag.name}</span>
                                                    </div>
                                                    {isActive && <span className="text-[12px] text-foreground/50 bg-accent px-2 py-0.5 rounded">Aplicada</span>}
                                                </button>
                                            )
                                        })}
                                        {customTags.length === 0 && <p className="text-center text-muted-foreground text-sm">Nenhuma etiqueta cadastrada na Organização. Acesse as Configurações ⚙️</p>}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <button onClick={() => handleArchive(activeChat.id, activeChat.status !== 'ARCHIVED')} title={activeChat.status === 'ARCHIVED' ? "Restaurar Cliente" : "Excluir/Arquivar"} className="hover:text-red-400 text-muted-foreground transition-colors bg-transparent border-0 p-1">
                                {activeChat.status === 'ARCHIVED' ? <MessageCircle className="w-[20px] h-[20px] text-[#00a884]"/> : <Trash2 className="w-[20px] h-[20px]" />}
                            </button>
                        </div>
                    </div>

                    {/* Messages Window Layers */}
                    <div className="flex-1 overflow-y-auto px-[5%] lg:px-[9%] py-[15px] z-20 flex flex-col gap-[2px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <div className="text-center mb-5 mt-2">
                            <span className="bg-card border border-border text-muted-foreground text-[12.5px] px-3 py-1.5 rounded-lg shadow-sm tracking-wide uppercase font-medium inline-block">Hoje</span>
                        </div>

                        {activeChat.messages.map((message, index) => {
                            const isMe = message.sender === 'me'
                            const isBot = message.sender === 'bot'

                            // Agrupar balões consecutivos
                            const prevMessage = activeChat.messages[index - 1]
                            const nextMessage = activeChat.messages[index + 1]
                            const isFirstInGroup = !prevMessage || prevMessage.sender !== message.sender
                            const isLastInGroup = !nextMessage || nextMessage.sender !== message.sender

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

                            // WPP Web Balões
                            let bubbleClass = "relative px-2.5 py-1.5 text-[14.2px] leading-[19px] max-w-[85%] lg:max-w-[70%] min-w-[90px] text-foreground shadow-sm "
                            if (isMe || isBot) {
                                bubbleClass += "bg-primary text-primary-foreground ml-auto "
                                bubbleClass += isFirstInGroup ? "rounded-l-[7.5px] rounded-bl-[7.5px] rounded-br-[7.5px] rounded-tr-none " : "rounded-[7.5px] "
                            } else {
                                bubbleClass += "bg-card mr-auto "
                                bubbleClass += isFirstInGroup ? "rounded-r-[7.5px] rounded-br-[7.5px] rounded-bl-[7.5px] rounded-tl-none " : "rounded-[7.5px] "
                            }

                            // Adicionar espaçamento se for primeiro do grupo (exceto o 1o absoluto)
                            const groupSpacing = isFirstInGroup && index !== 0 ? "mt-[9px]" : ""

                            return (
                                <div key={message.id} className={`flex w-full ${groupSpacing}`}>
                                    <div className={bubbleClass}>

                                        {/* Corner SVG emulation via Tailwind border trick or skipped for pure clean css */}

                                        {isBot && isFirstInGroup && (
                                            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#b1dfd6] mb-[2px] leading-none">
                                                🤖 Atendente Virtual
                                            </div>
                                        )}
                                        {(!isBot && !isMe) && isFirstInGroup && (
                                            <div className="text-[12.5px] font-bold text-[#25d366] mb-[2px] leading-[21px] flex justify-between">
                                                <span>~ {activeChat.name.split(' ')[0]}</span>
                                            </div>
                                        )}

                                        <div className="whitespace-pre-wrap relative pb-[12px]">
                                            {isMedia && (
                                                <span className="flex items-center gap-2 mb-1.5 opacity-80 text-[12px] font-bold text-foreground/60">
                                                    {msgType === 'DOCUMENT' && <FileText className="w-4 h-4" />}
                                                    {msgType === 'IMAGE' && <ImageIcon className="w-4 h-4" />}
                                                    {msgType === 'AUDIO' && <FileAudio className="w-4 h-4" />}
                                                    {msgType === 'VIDEO' && <Video className="w-4 h-4" />}
                                                </span>
                                            )}
                                            {displayContent}
                                            {/* Spacer so text doesn't overlap time absolute bottom */}
                                            <span className="inline-block w-[38px] h-[1px]"></span>
                                        </div>

                                        {isMedia && mediaId && (
                                            msgType === 'IMAGE' ? (
                                                <img src={`/api/whatsapp/media/${mediaId}`} className="max-w-full rounded-[5px] mt-1 mb-3 object-cover object-center max-h-[300px]" alt="Mídia Recebida" />
                                            ) : msgType === 'AUDIO' ? (
                                                <div className="flex flex-col gap-2 w-full mt-1 mb-3 bg-background/20 p-2 rounded-lg">
                                                    <audio src={`/api/whatsapp/media/${mediaId}`} controls className="w-full h-10 grayscale invert hue-rotate-180 brightness-150" />
                                                    {message.transcription && (
                                                        <div className="bg-black/20 p-2 rounded-[5px] border border-transparent text-[13px] italic text-foreground mt-1">
                                                            <Mic className="w-3 h-3 inline mr-1 opacity-70" />
                                                            {message.transcription}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : msgType === 'VIDEO' ? (
                                                <video src={`/api/whatsapp/media/${mediaId}`} controls className="w-full rounded-[5px] mt-1 mb-3 max-h-[250px]" />
                                            ) : (
                                                <div className="flex flex-col gap-0 w-[220px] mt-1 mb-3 bg-background/20 rounded-[5px] border border-border overflow-hidden shadow-sm">
                                                    <div className="h-[90px] bg-accent/30 flex items-center justify-center">
                                                        <FileText className="w-10 h-10 opacity-70 text-foreground" />
                                                    </div>
                                                    <div className="flex bg-card divide-x divide-border w-full">
                                                        <a href={`/api/whatsapp/media/${mediaId}`} target="_blank" rel="noreferrer" className="flex-1 py-2 text-[11.5px] font-bold hover:bg-accent transition-colors flex items-center justify-center gap-1.5 text-foreground">
                                                            <Globe className="w-3.5 h-3.5" /> Abrir no Browser
                                                        </a>
                                                        <a href={`/api/whatsapp/media/${mediaId}?download=1`} download className="flex-1 py-2 text-[11.5px] font-bold hover:bg-accent transition-colors flex items-center justify-center gap-1.5 text-foreground">
                                                            <Download className="w-3.5 h-3.5" /> Baixar Mídia
                                                        </a>
                                                    </div>
                                                </div>
                                            )
                                        )}

                                        <div className={`absolute right-1.5 bottom-1 text-[11px] flex items-center flex-row-reverse gap-1 leading-none ${isMe || isBot ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                            {isMe && message.status === 'read' && <span className="text-[#53bdeb] text-[13px] -ml-[2px] tracking-tighter mix-blend-screen brightness-125">✓✓</span>}
                                            {isMe && message.status === 'delivered' && <span className="text-[13px] -ml-[2px] tracking-tighter opacity-80">✓✓</span>}
                                            {isMe && message.status === 'sent' && <span className="text-[13px] -ml-[2px] tracking-tighter opacity-50">✓</span>}
                                            <span className="pt-[1px] font-medium opacity-90">{message.time}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} className="h-2" />
                    </div>

                    {/* Input Area (Bottom Bar) */}
                    <div className="min-h-[62px] flex-shrink-0 bg-card px-3 py-[10px] flex items-end gap-2.5 z-30 w-full relative border-t border-transparent">
                        {showEmojiPicker && (
                            <div className="absolute bottom-[70px] left-4 z-50 shadow-2xl rounded-lg overflow-hidden border border-border/50">
                                <EmojiPicker
                                    theme={Theme.DARK}
                                    onEmojiClick={(e: EmojiClickData) => setMessageInput(prev => prev + e.emoji)}
                                />
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*,audio/*,application/pdf" onChange={handleFileUpload} />

                        <div className="flex gap-[6px] items-center h-[42px] shrink-0 pl-1">
                            <button
                                className={`p-1.5 transition-colors rounded-full ${showEmojiPicker ? 'text-[#00a884] bg-accent' : 'text-muted-foreground hover:text-[#d1d7db]'}`}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <Smile className="w-[26px] h-[26px]" />
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-muted-foreground hover:text-[#d1d7db] transition-colors rounded-full" title="Anexar">
                                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="fill-current"><path d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.57.57 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"></path></svg>
                            </button>
                            <button
                                disabled={isGeneratingAi}
                                onClick={handleAiSuggestion}
                                title="Sugerir Resposta Mágica da IA Gemini"
                                className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded-full transition-colors disabled:opacity-50"
                            >
                                <Sparkles className={`w-[22px] h-[22px] ${isGeneratingAi ? 'animate-pulse' : ''}`} />
                            </button>
                        </div>

                        <div className="flex-1 bg-accent rounded-[8px] min-h-[42px] flex items-center px-4 overflow-hidden mb-1 mx-1 border border-transparent focus-within:border-[#8696a0]/20 transition-colors">
                            <input
                                type="text"
                                placeholder={activeChat?.isBotHandling ? "Robô online. Digite para invadir e pausá-lo..." : "Mensagem"}
                                className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground text-foreground py-2.5 h-full"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSendMessage()
                                    }
                                }}
                            />
                        </div>

                        <div className="flex items-center h-[42px] shrink-0 pr-1">
                            {messageInput.trim() || isSending ? (
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isSending}
                                    title="Enviar mensagem"
                                    className="p-2 text-muted-foreground hover:text-[#00a884] transition-colors rounded-full disabled:opacity-50"
                                >
                                    <Send className="w-[24px] h-[24px] ml-0.5" />
                                </button>
                            ) : (
                                <button className="p-2 text-muted-foreground hover:text-[#d1d7db] transition-colors rounded-full" title="Mensagem de voz">
                                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="fill-current"><path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2.002z"></path></svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="hidden lg:flex flex-1 bg-[#222e35] items-center justify-center flex-col text-center relative z-10 w-full">
                    {/* WPP Img Cover Home Default */}
                    <div className="w-full max-w-lg mb-8 bg-card rounded-full p-1 border-4 border-transparent flex items-center justify-center h-64 overflow-hidden text-zinc-700 font-bold opacity-30 shadow-inner">
                        <img src="https://static.whatsapp.net/rsrc.php/v3/y6/r/wa669aeJeom.png" alt="WhatsApp Immersive" className="object-cover w-full h-full scale-110" />
                    </div>

                    <h2 className="text-[32px] font-extralight text-foreground tracking-tight mb-4 mt-2">
                        WhatsApp Desktop Clone
                    </h2>
                    <p className="text-muted-foreground text-[14px] leading-[20px] max-w-[440px]">
                        Envie e receba mensagens sem precisar manter o celular conectado.
                        <br />
                        A força e potência do Pipeline CRM integrados na interface mais familiar do mundo.
                    </p>

                    <div className="absolute xl:bottom-12 bottom-8 flex flex-col items-center justify-center text-[12.5px] text-muted-foreground">
                        <div className="flex items-center gap-1.5 opacity-90 mb-1">
                            <ShieldAlert className="w-[14px] h-[14px]" /> Protegido com Criptografia e Consentimento LGPD Activo
                        </div>
                        <p className="opacity-50">Flow SaaS | Advanced B2B Dashboard</p>
                    </div>
                </div>
            )}
        </div>
    )
}
