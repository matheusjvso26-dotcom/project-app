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
                                <div className="flex flex-col gap-6 relative md:before:mx-auto mt-4 items-center text-center">
                                    <p className="text-zinc-500 text-sm">O histórico cronológico rastreado aparecerá aqui em breve.</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
