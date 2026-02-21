'use client'

import React, { useState } from 'react'
import { Search, MoreVertical, Phone, Mail, Globe, Send, Paperclip, Smile, Mic, ShieldAlert, Bot } from 'lucide-react'

// --- Mock Data ---
interface Message {
    id: string
    content: string
    sender: 'me' | 'client' | 'bot'
    time: string
    status?: 'sent' | 'delivered' | 'read'
}

interface Chat {
    id: string
    name: string
    phone: string
    lastMessage: string
    time: string
    unread: number
    isBotHandling: boolean
    lgpdConsent: boolean
    messages: Message[]
}

const mockChats: Chat[] = [
    {
        id: '1',
        name: 'Carlos Mendes',
        phone: '+55 11 98888-7777',
        lastMessage: 'Excelente, podemos fechar assim.',
        time: '10:45',
        unread: 0,
        isBotHandling: false,
        lgpdConsent: true,
        messages: [
            { id: 'm1', content: 'Olá, gostaria de saber mais sobre o Flow SaaS.', sender: 'client', time: '10:30' },
            { id: 'mb1', content: 'Olá! Como posso ajudar você hoje?', sender: 'bot', time: '10:30' },
            { id: 'm2', content: 'Podemos agendar uma demonstração hoje à tarde se preferir.', sender: 'me', time: '10:35', status: 'read' },
            { id: 'm3', content: 'Excelente, podemos fechar assim.', sender: 'client', time: '10:45' },
        ]
    },
    {
        id: '2',
        name: 'Ana Beatriz',
        phone: '+55 21 97777-6666',
        lastMessage: 'Qual o valor da implementação?',
        time: '09:12',
        unread: 2,
        isBotHandling: true,
        lgpdConsent: true,
        messages: [
            { id: 'm4', content: 'Bom dia. Encontrei vocês no Google.', sender: 'client', time: '09:10' },
            { id: 'mb2', content: 'Olá Ana! Sou o assistente automático. Em que ramo da indústria você atua?', sender: 'bot', time: '09:10' },
            { id: 'm5', content: 'Consultoria Financeira.', sender: 'client', time: '09:11' },
            { id: 'm6', content: 'Qual o valor da implementação?', sender: 'client', time: '09:12' },
        ]
    },
    {
        id: '3',
        name: 'Empresa XPTO Seguros',
        phone: '+55 31 96666-5555',
        lastMessage: 'Obrigado!',
        time: 'Ontem',
        unread: 0,
        isBotHandling: false,
        lgpdConsent: false,
        messages: [
            { id: 'm7', content: 'Obrigado!', sender: 'client', time: '18:00' },
        ]
    }
]

export function InboxBoard() {
    const [chats] = useState<Chat[]>(mockChats)
    const [activeChatId, setActiveChatId] = useState<string>(chats[0].id)
    const [messageInput, setMessageInput] = useState('')

    const activeChat = chats.find(c => c.id === activeChatId)

    return (
        <div className="flex h-full w-full bg-white divide-x divide-slate-200">

            {/* 1. Chats List Sidebar */}
            <div className="w-80 flex-shrink-0 flex flex-col bg-slate-50/50">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Caixa de Entrada</h2>
                    <div className="mt-3 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar conversas..."
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={`flex items-start gap-3 p-4 cursor-pointer border-b border-slate-100 transition-colors ${activeChatId === chat.id ? 'bg-indigo-50/60 hover:bg-indigo-50/80 relative' : 'hover:bg-slate-100'}`}
                        >
                            {activeChatId === chat.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                            )}

                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm">
                                    {chat.name.substring(0, 2).toUpperCase()}
                                </div>
                                {chat.isBotHandling && (
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-200">
                                        <Bot className="w-3.5 h-3.5 text-indigo-500" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className={`text-sm truncate ${chat.unread > 0 ? 'font-semibold text-slate-900' : 'font-medium text-slate-800'}`}>
                                        {chat.name}
                                    </h3>
                                    <span className={`text-[11px] whitespace-nowrap ml-2 ${chat.unread > 0 ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>
                                        {chat.time}
                                    </span>
                                </div>
                                <p className={`text-xs truncate ${chat.unread > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                    {chat.lastMessage}
                                </p>
                            </div>

                            {chat.unread > 0 && (
                                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold mt-1 shadow-sm">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Chat Area */}
            {activeChat ? (
                <div className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden">
                    {/* Background Pattern mimicking WhatsApp Webb */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-light_04fcacde539c58cca6745483d4858c52.png")' }}></div>

                    {/* Chat Header */}
                    <div className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200 z-10 shadow-sm shadow-slate-200/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm border border-indigo-200">
                                {activeChat.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-[15px] font-semibold text-slate-900">{activeChat.name}</h2>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    {activeChat.phone}
                                    {activeChat.isBotHandling && (
                                        <span className="flex items-center gap-1 text-indigo-600 ml-2 font-medium bg-indigo-50 px-1.5 py-0.5 rounded-sm">
                                            <Bot className="w-3 h-3" /> Em triagem pelo Bot
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500">
                            <button className="hover:text-slate-700 transition-colors hidden sm:block">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="hover:text-slate-700 transition-colors hidden sm:block">
                                <ShieldAlert className="w-5 h-5" />
                            </button>
                            <button className="hover:text-slate-700 transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Canvas */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 z-10 flex flex-col gap-3">
                        {activeChat.messages.map((message) => {
                            const isMe = message.sender === 'me'
                            const isBot = message.sender === 'bot'
                            const isClient = message.sender === 'client'

                            return (
                                <div key={message.id} className={`flex w-full ${isMe || isBot ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] sm:max-w-[65%] rounded-lg px-3 sm:px-4 py-2 relative shadow-sm ${isMe
                                        ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                                        : isBot
                                            ? 'bg-white border border-indigo-200 text-slate-900 rounded-tr-none'
                                            : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                                        }`}>
                                        {isBot && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 mb-1 tracking-wide uppercase">
                                                <Bot className="w-3 h-3" /> FlowBot Automático
                                            </div>
                                        )}
                                        <p className="text-[14.5px] leading-snug whitespace-pre-wrap">{message.content}</p>
                                        <div className={`text-[10px] text-right mt-1.5 flex items-center justify-end gap-1 ${isMe ? 'text-emerald-700/80' : 'text-slate-500'}`}>
                                            {message.time}
                                            {/* Status Checkmarks (simplified representation) */}
                                            {isMe && message.status === 'read' && <span className="text-blue-500 font-bold tracking-tighter">✓✓</span>}
                                            {isMe && message.status === 'delivered' && <span className="text-slate-400 font-bold tracking-tighter">✓✓</span>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Input Area */}
                    <div className="h-[72px] flex-shrink-0 bg-[#f0f2f5] px-4 flex items-center gap-3 z-10">
                        <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-200/50">
                            <Smile className="w-6 h-6" />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-200/50">
                            <Paperclip className="w-5 h-5 mx-1" />
                        </button>

                        <div className="flex-1 bg-white rounded-lg flex items-center px-4 shadow-sm border border-slate-200 focus-within:ring-1 focus-within:ring-indigo-500">
                            <input
                                type="text"
                                placeholder={activeChat.isBotHandling ? "O chatbot está atendendo. Digite para forçar handover manual..." : "Mensagem oficial via Cloud API..."}
                                className="w-full py-3 bg-transparent text-[15px] outline-none placeholder:text-slate-400"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setMessageInput('')
                                    }
                                }}
                            />
                        </div>

                        {messageInput.trim() ? (
                            <button className="p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-sm">
                                <Send className="w-5 h-5 ml-0.5" />
                            </button>
                        ) : (
                            <button className="p-2.5 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-200/50">
                                <Mic className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-slate-50 flex items-center justify-center flex-col text-center border-l-4 border-b-8 border-transparent">
                    <Bot className="w-16 h-16 text-slate-300 mb-4" />
                    <h2 className="text-2xl font-light text-slate-500">Flow WhatsApp Inbox</h2>
                    <p className="text-slate-400 mt-2 max-w-sm">Selecione um chat para começar a conversar ou configurar as automações da Meta Cloud API.</p>
                </div>
            )}

            {/* 3. Deal / Contact Info Sidebar (Context) */}
            {activeChat && (
                <div className="w-80 flex-shrink-0 bg-white hidden lg:flex flex-col">
                    <div className="p-6 border-b border-slate-200 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-2xl border border-slate-200 shadow-sm mb-4">
                            {activeChat.name.substring(0, 2).toUpperCase()}
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">{activeChat.name}</h2>
                        <p className="text-sm text-slate-500 mt-1">Lead Qualificado</p>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Informações de Contato</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    {activeChat.phone}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    Adicionar E-mail
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <Globe className="w-4 h-4 text-slate-400" />
                                    Adicionar Site
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status LGPD / Consentimento</h3>
                            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className={`w-4 h-4 ${activeChat.lgpdConsent ? 'text-emerald-500' : 'text-amber-500'}`} />
                                    <span className="text-sm font-medium text-slate-700">Permite Contato (Opt-in)</span>
                                </div>
                                <button className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-colors duration-200 ease-in-out ${activeChat.lgpdConsent ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                    <span className="sr-only">Toggle LGPD Opt-in</span>
                                    <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${activeChat.lgpdConsent ? 'translate-x-2' : '-translate-x-2'}`} />
                                </button>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-2 leading-snug">
                                {activeChat.lgpdConsent ? 'O lead autorizou o recebimento de mensagens transacionais e de marketing.' : 'Aviso: O envio ativo de templates pode resultar em bloqueio pela Meta. Escopo receptivo apenas.'}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Oportunidades (Deals)</h3>
                                <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700 transition-colors">+ Novo</button>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors cursor-pointer">
                                <h4 className="font-semibold text-slate-800 text-sm">Consultoria Flow Premium</h4>
                                <p className="text-xs text-slate-500 mt-1">Status: <span className="font-medium text-emerald-600">Proposta Enviada</span></p>
                                <p className="text-sm font-semibold text-slate-900 mt-2">R$ 15.000,00</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
