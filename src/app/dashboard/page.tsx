'use client'

import React from 'react'
import { Activity, Users, DollarSign, TrendingUp, ArrowRight, MessageSquare, Bot, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// --- Mock Data for Charts ---
const revenueData = [
    { name: 'Jan', total: 12000 },
    { name: 'Fev', total: 19000 },
    { name: 'Mar', total: 15000 },
    { name: 'Abr', total: 28000 },
    { name: 'Mai', total: 32000 },
    { name: 'Jun', total: 45000 },
    { name: 'Jul', total: 52000 },
]

const botResolutionData = [
    { name: 'Seg', humano: 15, bot: 45 },
    { name: 'Ter', humano: 20, bot: 52 },
    { name: 'Qua', humano: 12, bot: 48 },
    { name: 'Qui', humano: 18, bot: 60 },
    { name: 'Sex', humano: 25, bot: 65 },
    { name: 'Sáb', humano: 5, bot: 30 },
    { name: 'Dom', humano: 8, bot: 25 },
]

export default function AnalyticsDashboard() {
    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral</h1>
                    <p className="text-sm text-slate-500 mt-1">Acompanhe as métricas do seu funil comercial e da operação do WhatsApp.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium">
                        <option>Últimos 30 dias</option>
                        <option>Este Mês</option>
                        <option>Mês Passado</option>
                        <option>Este Ano</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* KPI 1 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +24%
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 mb-1">Receita Gerada (Won)</p>
                        <h3 className="text-2xl font-bold text-slate-900">R$ 152.000</h3>
                    </div>
                </div>

                {/* KPI 2 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +12%
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 mb-1">Novos Leads (WhatsApp)</p>
                        <h3 className="text-2xl font-bold text-slate-900">845</h3>
                    </div>
                </div>

                {/* KPI 3 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded">
                            <ArrowDownRight className="w-3 h-3 mr-1" /> -2%
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 mb-1">Tempo de Rsp. (FRT)</p>
                        <h3 className="text-2xl font-bold text-slate-900">4m 12s</h3>
                    </div>
                </div>

                {/* KPI 4 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <Bot className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +8%
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 mb-1">Resolução via Bot</p>
                        <h3 className="text-2xl font-bold text-slate-900">68.5%</h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Graph (Revenue) */}
                <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Receita Fechada (MRR + Setup)</h3>
                            <p className="text-sm text-slate-500">Crescimento ano a data (YTD)</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={(value) => `R$${value / 1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                                />
                                <Area type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Graph (Bot vs Human) */}
                <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-base font-bold text-slate-900">Carga de Atendimento</h3>
                        <p className="text-sm text-slate-500">Chats resolvidos Bot vs. Transbordo</p>
                    </div>
                    <div className="flex-1 w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={botResolutionData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="bot" name="Resolvido (Bot)" stackId="a" fill="#4f46e5" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="humano" name="Transbordo (Humano)" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-bold text-slate-900">Deals Recentes Fechados</h3>
                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1 transition-colors">
                            Ver Pipeline <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: 1, company: 'Acme Corp', value: 'R$ 15.000', owner: 'Carlos M.' },
                            { id: 2, company: 'Tech Solutions SA', value: 'R$ 8.500', owner: 'Ana B.' },
                            { id: 3, company: 'Global Retail', value: 'R$ 45.000', owner: 'Marcos P.' },
                        ].map((deal) => (
                            <div key={deal.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200">
                                        {deal.company.substring(0, 1)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900">{deal.company}</h4>
                                        <p className="text-xs text-slate-500">Fechado por {deal.owner}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-900 text-sm">{deal.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-bold text-slate-900">Atividade do Robô (Log Automático)</h3>
                    </div>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                        {[
                            { text: 'Bot transferiu um lead por complexidade (Pricing)', time: 'Há 5m', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-100' },
                            { text: 'Novo HSM aprovado pela Meta: "Promo Inverno"', time: 'Há 12m', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-100' },
                            { text: 'Workflow Lembrete disparado para 45 Leads', time: 'Há 1h', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-100' },
                        ].map((log, i) => (
                            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-white ${log.bg} ${log.color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10`}>
                                    <log.icon className="w-3 h-3" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded border border-slate-100 bg-slate-50 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <time className="text-xs font-medium text-indigo-600 uppercase">{log.time}</time>
                                    </div>
                                    <div className="text-sm font-normal text-slate-600 leading-snug">{log.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
