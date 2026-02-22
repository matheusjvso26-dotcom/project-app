import React from 'react'
import { KpiFloatingCard } from "@/components/kpi-floating-card"
import { DollarSign, TrendingUp, Users, CreditCard, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react"

export default function FinancePage() {
    return (
        <div className="flex flex-col h-full bg-background overflow-y-auto scrollbar-thin">
            {/* Header */}
            <div className="p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Financeiro & MRR</h1>
                    <p className="text-sm text-muted-foreground mt-1">Visualize suas métricas de faturamento e desempenho financeiro.</p>
                </div>
            </div>

            <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
                {/* KPIs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiFloatingCard
                        title="Faturamento (MRR)"
                        value="R$ 45.231,00"
                        delta={15}
                        deltaType="increase"
                        icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
                        className="bg-emerald-500/5 border-emerald-500/20"
                    />
                    <KpiFloatingCard
                        title="Novos Contratos"
                        value="R$ 12.500,00"
                        delta={5}
                        deltaType="increase"
                        icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
                    />
                    <KpiFloatingCard
                        title="Custo de Aquisição (CAC)"
                        value="R$ 850,00"
                        delta={2}
                        deltaType="decrease"
                        icon={<Users className="w-4 h-4 text-amber-500" />}
                    />
                    <KpiFloatingCard
                        title="Inadimplência (Churn)"
                        value="R$ 2.100,00"
                        delta={8}
                        deltaType="decrease"
                        icon={<CreditCard className="w-4 h-4 text-rose-500" />}
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Placeholder for future Recharts graph */}
                    <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card p-6 shadow-sm flex flex-col">
                        <h2 className="text-lg font-bold text-foreground mb-4">Projeção de Faturamento</h2>
                        <div className="flex-1 min-h-[300px] flex items-center justify-center rounded-xl bg-muted/30 border border-dashed border-border text-muted-foreground/50">
                            Gráfico de MRR (Recharts) em breve
                        </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-foreground">Receitas Recentes</h2>
                            <button className="text-xs text-primary font-semibold hover:underline">Ver tudo</button>
                        </div>
                        <div className="flex-1 space-y-4">
                            {[
                                { id: 1, name: 'Acme Corp', type: 'Licenciamento Anual', amount: '+ R$ 15.000,00', status: 'Pago', date: 'Hoje, 14:30' },
                                { id: 2, name: 'Tech Solutions', type: 'Setup Fee', amount: '+ R$ 2.500,00', status: 'Pago', date: 'Ontem' },
                                { id: 3, name: 'Mega Retail', type: 'Mensalidade', amount: '+ R$ 850,00', status: 'Pendente', date: 'Há 2 dias' },
                                { id: 4, name: 'Consultoria B', type: 'Mensalidade', amount: '+ R$ 850,00', status: 'Pago', date: 'Há 3 dias' },
                            ].map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {tx.status === 'Pago' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{tx.name}</p>
                                            <p className="text-[11px] text-muted-foreground font-medium">{tx.type} • {tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{tx.amount}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">{tx.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
