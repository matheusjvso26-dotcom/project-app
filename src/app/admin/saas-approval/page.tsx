import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPendingOrganizations, approveOrganizationAction } from "./actions"
import { Building2, CheckCircle2, Clock, Phone, User as UserIcon } from "lucide-react"

export default async function SaasApprovalPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // TODO: Adicionar checagem real de Super Admin (exemplo: e-mail seu chumbado ou flag isSuperAdmin)
    // if(user.email !== 'meu-email@master.com') redirect('/dashboard')

    const pendingOrgs = await getPendingOrganizations()

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Aprovação de Contas (SaaS)</h1>
                    <p className="text-muted-foreground mt-2">
                        Gerencie os leads que se cadastraram na Landing Page e aguardam liberação do Trial de 7 Dias.
                    </p>
                </div>

                {pendingOrgs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-dashed border-border/50">
                        <CheckCircle2 className="h-16 w-16 text-primary mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-foreground">Zero pendências!</h3>
                        <p className="text-muted-foreground">Todos os clientes já foram avaliados e aprovados.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingOrgs.map((org) => {
                            // @ts-ignore
                            const adminUser = org.users[0] || { name: 'Desconhecido', email: 'N/A' }

                            return (
                                <div key={org.id} className="bg-card rounded-xl border border-primary/20 shadow-lg p-6 relative flex flex-col justify-between">
                                    <div className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded shadow animate-pulse font-bold tracking-wider">
                                        PENDING
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                                            <Building2 className="h-5 w-5 text-primary" /> {org.name}
                                        </h3>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                <span>{adminUser.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-foreground/80 break-all">
                                                <div className="w-4 flex flex-shrink-0" /> {/* Spacer */}
                                                <span className="text-xs">{adminUser.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                {/* @ts-ignore */}
                                                <span>{org.ownerPhone || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>Registrado em {new Date(org.createdAt).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <form action={approveOrganizationAction.bind(null, org.id)}>
                                        <button
                                            type="submit"
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded uppercase tracking-wider text-sm transition-colors shadow-md flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Aprovar Trial (7 Dias)
                                        </button>
                                    </form>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
