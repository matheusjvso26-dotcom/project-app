'use client'

import React, { useEffect, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDealDetails } from './actions'
import { Building, DollarSign, User as UserIcon, Calendar, Activity, MessageSquare, Plus } from 'lucide-react'

interface DealDrawerProps {
    dealId: string | null
    isOpen: boolean
    onClose: () => void
}

export function DealDrawer({ dealId, isOpen, onClose }: DealDrawerProps) {
    const [deal, setDeal] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen && dealId) {
            setIsLoading(true)
            getDealDetails(dealId).then(data => {
                setDeal(data)
                setIsLoading(false)
            })
        } else {
            setDeal(null)
        }
    }, [isOpen, dealId])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100)
    }

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString))
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-[450px] sm:w-[540px] border-l border-border/50 bg-background overflow-y-auto sm:max-w-xl">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : !deal ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        Negócio não encontrado.
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <SheetHeader className="pb-6 border-b border-border/20">
                            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                                {deal.title}
                            </SheetTitle>
                            <SheetDescription className="flex flex-wrap gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                    {formatCurrency(deal.value)}
                                </span>
                                <span className="flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">
                                    {deal.status.replace('_', ' ')}
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                                    Vendedor: {deal.owner?.name || 'Não atribuído'}
                                </span>
                            </SheetDescription>
                        </SheetHeader>

                        <Tabs defaultValue="overview" className="flex-1 mt-6">
                            <TabsList className="grid w-full grid-cols-2 bg-muted/30">
                                <TabsTrigger value="overview">Informações</TabsTrigger>
                                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-6 space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                                        <Building className="w-4 h-4" /> Detalhes da Empresa
                                    </h4>
                                    <div className="glass-card p-4 rounded-xl flex flex-col gap-2">
                                        {deal.company ? (
                                            <>
                                                <p className="text-sm"><span className="font-semibold text-foreground">Nome:</span> {deal.company.name}</p>
                                                <p className="text-sm"><span className="font-semibold text-foreground">Domínio:</span> {deal.company.domain || 'N/A'}</p>
                                                <p className="text-sm"><span className="font-semibold text-foreground">Criada em:</span> {formatDate(deal.company.createdAt)}</p>
                                            </>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Nenhuma empresa veiculada a este negócio.</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                                        <Activity className="w-4 h-4" /> Estágio no Pipeline
                                    </h4>
                                    <div className="glass-card p-4 rounded-xl flex flex-col gap-2">
                                        <p className="text-sm"><span className="font-semibold text-foreground">Funil Atual:</span> {deal.stage?.name || 'Desconhecido'}</p>
                                        <p className="text-sm"><span className="font-semibold text-foreground">Aberto em:</span> {formatDate(deal.createdAt)}</p>
                                        <p className="text-sm"><span className="font-semibold text-foreground">Última Modificação:</span> {formatDate(deal.updatedAt)}</p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="timeline" className="mt-6">
                                <div className="flex flex-col gap-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
                                    {/* Mocked Timeline Item 1 */}
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                            <Plus className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-4 rounded-xl shadow-sm">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-foreground text-sm">Negócio Criado</div>
                                                <time className="font-caveat font-medium text-xs text-muted-foreground">{formatDate(deal.createdAt)}</time>
                                            </div>
                                            <div className="text-sm text-muted-foreground">Oportunidade adicionada ao pipeline por {deal.owner?.name || 'Sistema'}.</div>
                                        </div>
                                    </div>

                                    {/* Mocked Timeline Item 2 */}
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                            <MessageSquare className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-4 rounded-xl shadow-sm">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-foreground text-sm">WhatsApp Enviado</div>
                                                <time className="font-caveat font-medium text-xs text-muted-foreground">Agora mesmo</time>
                                            </div>
                                            <div className="text-sm text-muted-foreground">Mensagem de prospecção iniciada via Template HSM.</div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
