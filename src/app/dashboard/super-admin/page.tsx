import { getSaaSOrganizations, getGlobalStats } from './actions'
import { Server, Users, DollarSign, Activity, AlertTriangle, ShieldCheck, ZapOff, Play, Info, MoreHorizontal, MessageCircle, Settings, Trash2, Edit3, PauseCircle } from 'lucide-react'
import { MasterControlsMenu } from './MasterControlsMenu'

// Renderiza a parte do Dashboard no Lado do Servidor
export default async function SuperAdminPage() {
    const orgs = await getSaaSOrganizations()
    const stats = await getGlobalStats()

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header Mestre */}
            <div className="border-b border-rose-500/20 pb-6 mb-8 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 text-sm text-rose-400/80 mb-4 font-semibold uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4" />
                        <span>SaaS Master Control</span>
                    </div>

                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        Painel Super Admin
                    </h1>
                    <p className="text-zinc-400 mt-2 text-sm max-w-3xl leading-relaxed">
                        Controle absoluto do sistema SaaS. As alterações realizadas aqui afetam bancos de dados isolados e têm poder destrutivo e reversível (bloqueios, injeções API, suspensões). Proceda com cautela.
                    </p>
                </div>

                {/* Master Badge */}
                <div className="hidden sm:flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-lg text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-sm font-medium">Privilégios de Deus Ativados</span>
                </div>
            </div>

            {/* Global Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Kpi 1 */}
                <div className="bg-[#18181b] p-6 rounded-lg border border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                    <div className="flex items-center justify-between z-10 relative">
                        <div>
                            <p className="text-sm font-medium text-zinc-500">Agências Clientes</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats.totalOrgs}</h3>
                        </div>
                        <div className="p-3 bg-rose-500/10 text-rose-500 rounded-lg group-hover:scale-110 transition-transform">
                            <Server className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Kpi 2 */}
                <div className="bg-[#18181b] p-6 rounded-lg border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center justify-between z-10 relative">
                        <div>
                            <p className="text-sm font-medium text-zinc-500">MRR System (Fechado)</p>
                            <h3 className="text-3xl font-bold text-white mt-2">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalRevenue)}
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Kpi 3 */}
                <div className="bg-[#18181b] p-6 rounded-lg border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center justify-between z-10 relative">
                        <div>
                            <p className="text-sm font-medium text-zinc-500">Total Leads (Aggregated)</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats.totalLeads}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Kpi 4 */}
                <div className="bg-[#18181b] p-6 rounded-lg border border-white/5 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
                    <div className="flex items-center justify-between z-10 relative">
                        <div>
                            <p className="text-sm font-medium text-zinc-500">Processos de Venda Ativos</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats.totalDeals}</h3>
                        </div>
                        <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela de Inquilinos (Tenant Board) */}
            <div className="bg-[#18181b] rounded-lg border border-zinc-800/50 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                {/* Header TB */}
                <div className="p-5 border-b border-zinc-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1a1a1d]">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-medium text-white flex items-center gap-2">
                            Inquilinos do Sistema (Organizations)
                        </h2>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/5 text-zinc-400">{orgs.length} orgs</span>
                    </div>
                </div>

                {/* Table Layout Wrapper */}
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-[#151518] text-zinc-400 border-b border-zinc-800/50 lowercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Empresa (Organization)</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-center">Assinantes</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-center">Meta API</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Membro Principal</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-right">Controles Master</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                            {orgs.map((org) => (
                                <tr key={org.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-[#222] border border-white/5 flex items-center justify-center text-zinc-400 font-bold uppercase shrink-0">
                                                {org.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-zinc-200 font-medium mb-0.5">{org.name}</div>
                                                <div className="text-xs text-zinc-500 font-mono" title="Identificador Prisma UUID">
                                                    ID: {org.id.split('-')[0]}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {org.status === 'ACTIVE' && <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">ATIVO</span>}
                                        {org.status === 'SUSPENDED' && <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">SUSPENSO / BANIDO</span>}
                                        {org.status === 'PENDING' && <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">PENDENTE INICIALIZAÇÃO</span>}
                                    </td>
                                    <td className="px-6 py-5 text-center text-zinc-400">
                                        {org.usersCount} Usuários
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {org.metaOauthConnected ? (
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                <MessageCircle className="w-3 h-3" /> Conectado (Nuvem)
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs text-zinc-500">
                                                <ZapOff className="w-3 h-3" /> N/A (Usando Evolution)
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-zinc-400">
                                        {org.ownerEmail}
                                    </td>
                                    <td className="px-6 py-5 text-right relative">
                                        <MasterControlsMenu
                                            orgId={org.id}
                                            currentStatus={org.status}
                                            orgName={org.name}
                                            wabaId={org.wabaId}
                                            phoneNumberId={org.phoneNumberId}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
