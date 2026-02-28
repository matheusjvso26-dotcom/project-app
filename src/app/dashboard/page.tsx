'use client'

import React, { useState } from 'react'
import {
    CreditCard, Landmark, UserPlus, Coins,
    Droplet, Globe, Lightbulb, ChevronDown,
    TrendingUp, Activity, Users, DollarSign,
    Zap, Handshake, Target, CheckCircle2
} from 'lucide-react'
import {
    ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from 'recharts'
import { cn } from '@/lib/utils'
import { getDashboardMetrics, DashboardMetrics } from './actions'

type Period = '7d' | '15d' | '30d'

const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

export default function AnalyticsDashboard() {
    const [period, setPeriod] = useState<Period>('30d')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    React.useEffect(() => {
        const fetchMetrics = async () => {
            setIsLoading(true)
            try {
                const days = period === '7d' ? 7 : (period === '15d' ? 15 : 30)
                const data = await getDashboardMetrics(days)
                setMetrics(data)
            } catch (error) {
                console.error("Falha ao buscar métricas:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMetrics()
    }, [period])

    const periodLabel = period === '7d' ? 'Últimos 7 Dias' : (period === '15d' ? 'Últimos 15 Dias' : 'Últimos 30 Dias')

    if (isLoading || !metrics) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-[#151515] text-[#ff7b00]">
                <Activity className="w-8 h-8 animate-pulse" />
            </div>
        )
    }

    const currentMetrics = metrics
    const currentChartData = metrics.chartData

    return (
        <div className="p-8 max-w-[1400px] mx-auto flex flex-col gap-6 h-full z-10 relative bg-[#151515] text-white">
            {/* Header com Filtro de Período */}
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Métricas de Software (SaaS)</h1>
                    <p className="text-sm text-zinc-400">Acompanhe a performance financeira e o engajamento dos seus clientes.</p>
                </div>

                {/* Custom Period Select */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 bg-[#1c1c1c] border border-white/10 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/5 transition-colors"
                    >
                        {periodLabel} <ChevronDown className="w-4 h-4 ml-1 text-zinc-400" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1c1c1c] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                            {[
                                { id: '7d', label: 'Últimos 7 Dias' },
                                { id: '15d', label: 'Últimos 15 Dias' },
                                { id: '30d', label: 'Últimos 30 Dias' },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => { setPeriod(opt.id as Period); setDropdownOpen(false) }}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 text-sm transition-colors",
                                        period === opt.id ? "bg-[#ff7b00]/10 text-[#ff7b00] font-medium" : "text-zinc-300 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Top Action Cards (Kpis Reais) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Receita Total\n(Fechada)" value={formatBRL(currentMetrics.mrr)} icon={<DollarSign className="w-6 h-6 text-[#ff7b00]" strokeWidth={1.5} />} />
                <KpiCard title="Clientes CAtivos\nAtualmente" value={currentMetrics.activeClients.toString()} icon={<Users className="w-6 h-6 text-[#ff7b00]" strokeWidth={1.5} />} />
                <KpiCard title="Despesas Totais\n(Custos Fixos)" value={formatBRL(currentMetrics.cac)} icon={<Target className="w-6 h-6 text-[#ff7b00]" strokeWidth={1.5} />} />
                <KpiCard title="Taxa de Perda\n(Negócios Perdidos)" value={currentMetrics.churn} icon={<Activity className="w-6 h-6 text-[#ff7b00]" strokeWidth={1.5} />} />
            </div>

            {/* Middle Section: Chart & Operational Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

                {/* Chart Area */}
                <div className="lg:col-span-2 bg-[#1c1c1c] rounded-2xl p-6 border border-white/5 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm font-semibold text-zinc-400 mb-1">Faturamento Total Direto</p>
                            <h2 className="text-3xl font-bold tracking-tight text-white">{formatBRL(currentMetrics.mrr)}</h2>
                        </div>
                        <div className="flex items-center gap-6 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-[#ff7b00]" />
                                <span className="text-sm font-medium text-zinc-400">Total Ganho</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-zinc-600" />
                                <span className="text-sm font-medium text-zinc-400">Despesas/CAC</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={currentChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff7b00" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ff7b00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => `R$ ${v / 1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: '#555', strokeWidth: 1, strokeDasharray: '3 3' }}
                                    formatter={(value: any) => formatBRL(Number(value))}
                                />
                                <Area type="monotone" dataKey="income" stroke="#ff7b00" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                <Line type="monotone" dataKey="outcome" stroke="#71717a" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#71717a', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Automation & Usage Stats */}
                <div className="bg-transparent flex flex-col gap-4">
                    <h3 className="text-base font-semibold text-white px-1">Saúde Operacional (CRM)</h3>
                    <div className="flex flex-col gap-3">
                        <HealthCard title="Usuários CAtivos (Logins)" icon={<Users />} value={`${currentMetrics.activeClients} Colaboradores`} />
                        <HealthCard title="Disparos de WhatsApp" icon={<Zap />} value={`${currentMetrics.messagesSent} Mensagens`} />
                        <HealthCard title="Taxa de Conversão (Win)" icon={<TrendingUp />} value={currentMetrics.winRate} />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent CRM Deals & SLA Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mt-2">

                {/* Recent Won Deals */}
                <div className="bg-[#1c1c1c] rounded-2xl p-6 border border-white/5">
                    <h3 className="text-base font-semibold mb-6 text-white">Últimos Contratos Fechados</h3>
                    <div className="flex flex-col gap-6">
                        {currentMetrics.recentDeals.length > 0 ? (
                            currentMetrics.recentDeals.map(deal => (
                                <TransactionItem
                                    key={deal.id}
                                    color={deal.type === 'positive' ? "bg-[#22c55e]" : "bg-[#ef4444]"}
                                    name={deal.name}
                                    plan={deal.plan}
                                    amount={formatBRL(deal.amount)}
                                    type={deal.type}
                                />
                            ))
                        ) : (
                            <p className="text-zinc-500 text-sm">Nenhuma oportunidade registrada ainda.</p>
                        )}
                    </div>
                </div>

                {/* SLA and Goals Section */}
                <div className="bg-[#1c1c1c] rounded-2xl p-6 border border-white/5 flex flex-col">
                    <h3 className="text-base font-semibold mb-6 text-white">Qualidade de Atendimento</h3>
                    <div className="flex flex-col items-center justify-center flex-1 py-4 gap-8">

                        {/* Circular Progress for SLA */}
                        <div className="relative w-36 h-36 shrink-0 mt-4">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-white/5"
                                    strokeWidth="3.5"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className="text-[#ff7b00]"
                                    strokeWidth="3.5"
                                    strokeDasharray="92, 100"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-white tracking-tighter">92%</span>
                                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-1">Geral</span>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-4">
                            <div className="flex justify-between items-center bg-[#151515] p-3 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#22c55e]/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300">Tempo de Primeira Resposta</span>
                                </div>
                                <span className="text-sm font-bold text-white">4m 12s</span>
                            </div>

                            <div className="flex justify-between items-center bg-[#151515] p-3 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#ff7b00]/10 flex items-center justify-center">
                                        <Handshake className="w-4 h-4 text-[#ff7b00]" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300">Resolução no 1º Contato</span>
                                </div>
                                <span className="text-sm font-bold text-white">84%</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

function KpiCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-[#1c1c1c] rounded-2xl p-6 border border-white/5 flex flex-col justify-between shadow-sm h-32 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#ff7b00]/5 rounded-full blur-2xl transition-all duration-500 group-hover:bg-[#ff7b00]/10" />
            <div className="flex justify-between items-start z-10">
                <p className="text-[13px] font-medium text-zinc-400 whitespace-pre-line leading-snug">
                    {title.split('\\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            {i === 0 && <br />}
                        </React.Fragment>
                    ))}
                </p>
                <div className="w-10 h-10 rounded-full border border-white/10 bg-[#151515] flex items-center justify-center shrink-0">
                    {icon}
                </div>
            </div>
            <div className="z-10 mt-auto">
                <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
            </div>
        </div>
    )
}

function HealthCard({ title, icon, value }: { title: string, icon: React.ReactNode, value: string }) {
    return (
        <div className="bg-[#1c1c1c] cursor-default rounded-xl p-[1.15rem] border border-white/5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-zinc-300">{title}</span>
                <span className="text-sm font-bold text-white mt-1">{value}</span>
            </div>
            <div className="w-11 h-11 border border-white/10 bg-[#151515] rounded-xl flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-[#ff7b00]">
                {icon}
            </div>
        </div>
    )
}

function TransactionItem({ color, name, plan, amount, type }: { color: string, name: string, plan: string, amount: string, type: 'positive' | 'negative' }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={cn("w-3 h-3 rounded-full shrink-0", color)} />
                <div className="flex flex-col">
                    <span className="font-bold text-[14px] text-white tracking-tight">{name}</span>
                    <span className="text-[12px] text-zinc-400 font-medium mt-0.5">{plan}</span>
                </div>
            </div>
            <span className={cn("font-bold text-[14px] tracking-tight", type === 'positive' ? 'text-[#22c55e]' : 'text-[#ef4444]')}>
                {type === 'positive' ? `+ ${amount}` : amount}
            </span>
        </div>
    )
}
