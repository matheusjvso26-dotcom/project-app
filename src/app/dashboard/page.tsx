'use client'

import React from 'react'
import {
    CreditCard, Landmark, UserPlus, Coins,
    Droplet, Globe, Lightbulb, ChevronDown
} from 'lucide-react'
import {
    ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from 'recharts'
import { cn } from '@/lib/utils'

const chartData = [
    { name: 'Mon', income: 10, outcome: 15 },
    { name: 'Tue', income: 45, outcome: 38 },
    { name: 'Wed', income: 30, outcome: 25 },
    { name: 'Thu', income: 60, outcome: 45 },
    { name: 'Fri', income: 40, outcome: 38 },
    { name: 'Sat', income: 35, outcome: 28 },
    { name: 'Sun', income: 75, outcome: 60 },
]

export default function AnalyticsDashboard() {
    return (
        <div className="p-8 max-w-[1400px] mx-auto flex flex-col gap-6 h-full z-10 relative bg-[#151515] text-white">
            {/* Top Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ActionCard title="Transfer Via\nCard Number" icon={<CreditCard className="w-6 h-6 text-primary" strokeWidth={1.5} />} />
                <ActionCard title="Transfer to\nAnother Bank" icon={<Landmark className="w-6 h-6 text-primary" strokeWidth={1.5} />} />
                <ActionCard title="Transfer to\nSame Bank" icon={<UserPlus className="w-6 h-6 text-primary" strokeWidth={1.5} />} />
                <ActionCard title="Transfer to\nInternational Bank" icon={<Coins className="w-6 h-6 text-primary" strokeWidth={1.5} />} />
            </div>

            {/* Middle Section: Chart & Bills */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart Area */}
                <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm font-semibold text-foreground mb-1">Total Balance</p>
                            <h2 className="text-3xl font-bold tracking-tight">$ 68.657</h2>
                        </div>
                        <div className="flex items-center gap-8 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-[#facc15]" />
                                <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Income</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-primary" />
                                <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Outcome</span>
                            </div>
                            <button className="flex items-center gap-2 bg-transparent border border-border px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-4">
                                Week <ChevronDown className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff7b00" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ff7b00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => `$ ${v}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: '#555', strokeWidth: 1, strokeDasharray: '3 3' }}
                                />
                                <Area type="monotone" dataKey="outcome" stroke="#ff7b00" strokeWidth={3} fillOpacity={1} fill="url(#colorOutcome)" />
                                <Line type="monotone" dataKey="income" stroke="#facc15" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#facc15', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bills */}
                <div className="bg-transparent flex flex-col gap-4">
                    <h3 className="text-base font-semibold text-foreground px-1">Bills</h3>
                    <div className="flex flex-col gap-3">
                        <BillCard title="Water Bill" icon={<Droplet />} />
                        <BillCard title="Broadband" icon={<Globe />} />
                        <BillCard title="Electricity" icon={<Lightbulb />} />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Transactions & Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">

                {/* Recent Transactions */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="text-base font-semibold mb-6">Recent Transactions</h3>
                    <div className="flex flex-col gap-6">
                        <TransactionItem color="bg-primary" name="Ahsan Jilani" date="24-Dec-2022 12:33:23 PM" amount="- $ 190" type="negative" />
                        <TransactionItem color="bg-[#facc15]" name="Furqan Ashiq" date="24-Dec-2022 09:54:23 AM" amount="+ $ 270" type="positive" />
                        <TransactionItem color="bg-primary" name="Ahtishami" date="02-Dec-2022 05:15:00 PM" amount="- $ 150" type="negative" />
                    </div>
                </div>

                {/* Cards Section */}
                <div className="bg-card rounded-2xl p-6 border border-border flex flex-col">
                    <h3 className="text-base font-semibold mb-6">Cards</h3>
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                        {/* Physical Card */}
                        <div className="w-[320px] h-[190px] shrink-0 rounded-[1.2rem] p-6 flex flex-col justify-between bg-gradient-to-br from-[#ff8a00] to-[#e65c00] text-white shadow-xl shadow-primary/10 relative overflow-hidden group">
                            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/20 rounded-full blur-2xl transition-all duration-700 group-hover:bg-white/30" />
                            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-black/20 rounded-full blur-2xl transition-all duration-700 group-hover:bg-black/30" />

                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-lg tracking-wide">Ahsan Jilani</p>
                                    <p className="text-[11px] text-white/80 mt-3 font-medium tracking-wider">Balance</p>
                                    <p className="text-[22px] font-bold tracking-tight mt-0.5">$ 68.657.00</p>
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col gap-3">
                                <p className="font-mono tracking-[0.25em] text-sm text-white/95">
                                    1124 5666 6599 1788
                                </p>
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] text-white/80 tracking-widest font-medium uppercase">Valid <span className="font-semibold text-white ml-1">11/25</span></p>
                                    <div className="flex -space-x-2">
                                        <div className="w-7 h-7 rounded-full bg-red-500/90 mix-blend-multiply" />
                                        <div className="w-7 h-7 rounded-full bg-yellow-400/90 mix-blend-multiply" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Limit Info */}
                        <div className="flex flex-col gap-6 w-full max-w-[280px]">
                            <div className="flex items-center gap-6 justify-center md:justify-start">
                                {/* Circular Progress */}
                                <div className="relative w-20 h-20 shrink-0">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-border"
                                            strokeWidth="4"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-primary"
                                            strokeWidth="4"
                                            strokeDasharray="65, 100"
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-bold text-foreground">65%</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-[#ef4444] font-bold text-[15px] tracking-tight">$ 270</span>
                                        <span className="text-xs text-muted-foreground font-medium">Available Limit</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[#22c55e] font-bold text-[15px] tracking-tight">$ 760</span>
                                        <span className="text-xs text-muted-foreground font-medium">Total Limit</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-3 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-white/5 hover:border-primary/50 transition-all shadow-sm">
                                Add New Card
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

function ActionCard({ title, icon }: { title: string, icon: React.ReactNode }) {
    return (
        <div className="bg-card cursor-pointer hover:border-primary/50 transition-all rounded-[1rem] p-6 border border-border flex items-center justify-between shadow-sm">
            <p className="text-[13px] font-medium text-muted-foreground whitespace-pre-line leading-relaxed">
                {title.split('\\n').map((line, i) => (
                    <React.Fragment key={i}>
                        {line}
                        {i === 0 && <br />}
                    </React.Fragment>
                ))}
            </p>
            <div className="w-[3.5rem] h-[3.5rem] rounded-full border border-primary/30 flex items-center justify-center shrink-0">
                {icon}
            </div>
        </div>
    )
}

function BillCard({ title, icon }: { title: string, icon: React.ReactNode }) {
    return (
        <div className="bg-card cursor-pointer hover:border-primary/50 transition-all rounded-[1rem] p-[1.15rem] border border-border flex items-center justify-between group shadow-sm">
            <span className="text-[15px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{title}</span>
            <div className="w-12 h-12 border border-primary/30 rounded-xl flex items-center justify-center shrink-0 [&>svg]:w-[1.35rem] [&>svg]:h-[1.35rem] [&>svg]:text-primary">
                {icon}
            </div>
        </div>
    )
}

function TransactionItem({ color, name, date, amount, type }: { color: string, name: string, date: string, amount: string, type: 'positive' | 'negative' }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={cn("w-3.5 h-3.5 rounded-full", color)} />
                <div className="flex flex-col">
                    <span className="font-bold text-[15px] text-foreground tracking-tight">{name}</span>
                    <span className="text-[11px] text-muted-foreground font-medium mt-0.5">{date}</span>
                </div>
            </div>
            <span className={cn("font-bold text-[15px] tracking-tight", type === 'positive' ? 'text-[#22c55e]' : 'text-[#ef4444]')}>
                {amount}
            </span>
        </div>
    )
}
