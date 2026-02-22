import React from 'react'
import { KpiFloatingCard } from "@/components/kpi-floating-card"
import { BarChart3, Users, CreditCard, Activity, ArrowUpRight, ArrowDownRight, Server, ShieldCheck } from "lucide-react"

export default function SaaSAdminMetricsPage() {
    return (
        <div className="flex flex-col h-full bg-background overflow-y-auto scrollbar-thin">
            {/* Admin Topbar */}
            <div className="p-6 border-b border-border/50 bg-slate-900 text-slate-50 sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Flow SaaS Admin Console</h1>
                        <p className="text-sm text-slate-400 mt-0.5">Visão global da infraestrutura e assinaturas (SaaS Metrics).</p>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-8 max-w-[1400px] w-full mx-auto">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">Global Performance</h2>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold ring-1 ring-inset ring-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Status Operacional Saudável
                    </span>
                </div>

                {/* KPIs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <KpiFloatingCard
                        title="Total MRR (SaaS)"
                        value="R$ 145.200"
                        delta={22}
                        deltaType="increase"
                        icon={<BarChart3 className="w-4 h-4 text-emerald-500" />}
                        className="bg-emerald-500/5 border-emerald-500/30"
                    />
                    <KpiFloatingCard
                        title="Active Workspaces"
                        value="128"
                        delta={12}
                        deltaType="increase"
                        icon={<Server className="w-4 h-4 text-indigo-500" />}
                    />
                    <KpiFloatingCard
                        title="Total Active Users"
                        value="1,402"
                        delta={10}
                        deltaType="increase"
                        icon={<Users className="w-4 h-4 text-blue-500" />}
                    />
                    <KpiFloatingCard
                        title="Global Churn Rate"
                        value="1.2%"
                        delta={15}
                        deltaType="decrease"
                        icon={<Activity className="w-4 h-4 text-emerald-500" />}
                    />
                </div>

                {/* Split Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-foreground mb-4">Top Workspaces (By Volume)</h3>
                        <div className="flex-1 space-y-3">
                            {[
                                { name: 'Acme LTDA', plan: 'Enterprise', mrr: 'R$ 5.500', users: 45 },
                                { name: 'Tech Inovadora', plan: 'Pro', mrr: 'R$ 1.200', users: 12 },
                                { name: 'Vendas Alpha', plan: 'Pro', mrr: 'R$ 1.200', users: 8 },
                                { name: 'Startup Zeta', plan: 'Starter', mrr: 'R$ 299', users: 3 },
                            ].map((org, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {org.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{org.name}</p>
                                            <p className="text-[11px] font-medium text-muted-foreground">{org.plan} • {org.users} users</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-foreground">{org.mrr}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-foreground mb-4">Latest System Events</h3>
                        <div className="flex-1 space-y-4">
                            {[
                                { event: 'New Workspace Provisioned', tenant: 'Vendas Alpha', time: '10 mins ago', type: 'success' },
                                { event: 'Plan Upgraded to Enterprise', tenant: 'Acme LTDA', time: '2 hours ago', type: 'success' },
                                { event: 'API Rate Limit Warning', tenant: 'Tech Inovadora', time: '5 hours ago', type: 'warning' },
                                { event: 'Failed Webhook Delivery', tenant: 'Startup Zeta', time: '1 day ago', type: 'error' },
                            ].map((log, i) => (
                                <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-background border border-border/50 hover:bg-muted/50 transition-colors">
                                    <div className={`mt-0.5 w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_hsl(142,71%,45%)]' :
                                        log.type === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_hsl(38,92%,50%)]' :
                                            'bg-rose-500 shadow-[0_0_8px_hsl(346,87%,43%)]'
                                        }`} />
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{log.event}</p>
                                        <p className="text-xs font-medium text-muted-foreground mt-0.5">{log.tenant} • {log.time}</p>
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
