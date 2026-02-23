import React from 'react'
import { KpiFloatingCard } from "@/components/kpi-floating-card"
import { DollarSign, TrendingUp, Wallet, CheckCircle, ArrowUpRight } from "lucide-react"
import { getFinancialMetrics } from './actions'

export const dynamic = 'force-dynamic'

export default async function FinancePage() {
    const metrics = await getFinancialMetrics()

    // Mockup para Custos Operacionais (Poderia vir de uma nova Tabela 'Costs' depois)
    const custoFixoMensal = 1500 // Exemplo: Servidores, API, Ferramentas
    const lucroLiquido = metrics.revenue - custoFixoMensal

    // Formatação de Moeda
    const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    return (
        <div className="flex flex-col h-full bg-background overflow-y-auto scrollbar-thin">
            {/* Header */}
            <div className="p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Relatório Financeiro</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sincronizado automaticamente com os Negócios (Deals) movidos para o final do seu Pipeline (Ganho).
                    </p>
                </div>
            </div>

            <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
                {/* KPIs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiFloatingCard
                        title="Receita Real (Deals Ganhos)"
                        value={formatBRL(metrics.revenue)}
                        delta={100}
                        deltaType="increase"
                        icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
                        className="bg-emerald-500/5 border-emerald-500/20"
                    />
                    <KpiFloatingCard
                        title="Negócios Fechados"
                        value={`${metrics.dealsCount} vendas`}
                        delta={0}
                        deltaType="increase"
                        icon={<CheckCircle className="w-4 h-4 text-blue-500" />}
                    />
                    <KpiFloatingCard
                        title="Custos Operacionais Est."
                        value={formatBRL(custoFixoMensal)}
                        delta={0}
                        deltaType="neutral"
                        icon={<Wallet className="w-4 h-4 text-amber-500" />}
                    />
                    <KpiFloatingCard
                        title="Lucro Líquido (ROI)"
                        value={formatBRL(lucroLiquido)}
                        delta={lucroLiquido > 0 ? 100 : 0}
                        deltaType={lucroLiquido >= 0 ? "increase" : "decrease"}
                        icon={<TrendingUp className={`w-4 h-4 ${lucroLiquido >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />}
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Placeholder for future Recharts graph */}
                    <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card p-6 shadow-sm flex flex-col">
                        <h2 className="text-lg font-bold text-foreground mb-4">Evolução de Fluxo de Caixa</h2>
                        <div className="flex-1 min-h-[300px] flex items-center justify-center rounded-xl bg-muted/30 border border-dashed border-border text-muted-foreground/50 flex-col gap-2">
                            <TrendingUp className="w-8 h-8 opacity-20" />
                            A integração com o Gráfico Interativo de MRR será lançada em breve.
                        </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-foreground">Últimos Fechamentos</h2>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">Top 5</span>
                        </div>
                        <div className="flex-1 space-y-4">
                            {metrics.recentWons.length === 0 ? (
                                <p className="text-sm text-zinc-500 text-center py-10">Nenhum contrato fechado no Kanban ainda.</p>
                            ) : metrics.recentWons.map((tx: any) => (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                        <div className="max-w-[120px]">
                                            <p className="text-sm font-bold text-foreground truncate">{tx.name}</p>
                                            <p className="text-[11px] text-muted-foreground font-medium truncate">{tx.companyName} • {tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            +{formatBRL(tx.amount)}
                                        </p>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Vencido no CRM</p>
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
