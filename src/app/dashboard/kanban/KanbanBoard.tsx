'use client'

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { MoreHorizontal, Plus, Search, DollarSign, Clock, User as UserIcon, User } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MoneyInput } from "@/components/ui/masked-input"
import { Badge } from '@/components/ui/badge'
import { updateDealStageAction, createKanbanDealAction } from './actions'
import { toast } from 'sonner'

import { DealDrawer } from './DealDrawer'
// --- Data Types ---
export type DealStatus = 'OPEN' | 'WON' | 'LOST' | 'ON_TRACK' | 'AT_RISK' | 'LATE'
export interface Deal {
    id: string
    title: string
    company: string
    value: number
    status: DealStatus
}

export interface Stage {
    id: string
    name: string
    deals: Deal[]
}

// --- Helper Functions ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100) // Prisma saves in cents!
}

const getStatusColor = (status: DealStatus) => {
    switch (status) {
        case 'ON_TRACK': return 'bg-emerald-500/10 text-emerald-500'
        case 'AT_RISK': return 'bg-amber-500/10 text-amber-500'
        case 'LATE': return 'bg-rose-500/10 text-rose-500'
        case 'WON': return 'bg-blue-500/10 text-blue-500'
        default: return 'bg-slate-500/10 text-slate-500'
    }
}

interface KanbanBoardProps {
    initialData: Stage[]
}

export function KanbanBoard({ initialData }: KanbanBoardProps) {
    const [data, setData] = useState<Stage[]>([])
    const [isMounted, setIsMounted] = useState(false)

    // Add Deal Modal State
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [activeStageId, setActiveStageId] = useState<string | null>(null)
    const [newDeal, setNewDeal] = useState({ title: '', company: '', value: 0 })

    // Deal Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedDealId, setSelectedDealId] = useState<string | null>(null)

    useEffect(() => {
        setData(initialData)
        setIsMounted(true)
    }, [initialData])

    const handleAddClick = (stageId: string) => {
        setActiveStageId(stageId)
        setNewDeal({ title: '', company: '', value: 0 })
        setIsAddOpen(true)
    }

    const handleDealClick = (dealId: string) => {
        setSelectedDealId(dealId)
        setIsDrawerOpen(true)
    }

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) return
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        const newData = [...data]
        const sourceStageIndex = newData.findIndex(s => s.id === source.droppableId)
        const destStageIndex = newData.findIndex(s => s.id === destination.droppableId)

        const sourceStage = newData[sourceStageIndex]
        const destStage = newData[destStageIndex]

        const draggedDeal = sourceStage.deals.find(d => d.id === draggableId)

        if (!draggedDeal) return

        sourceStage.deals.splice(source.index, 1)
        destStage.deals.splice(destination.index, 0, draggedDeal)

        setData(newData)

        updateDealStageAction(draggedDeal.id, destStage.id).catch(err => {
            console.error(err)
        })
    }

    if (!isMounted) return null

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex h-full w-full gap-6 overflow-x-auto p-2 pb-8 scrollbar-thin">
                    {data.map((stage) => (
                        <div key={stage.id} className="flex min-w-[320px] max-w-[320px] flex-col rounded-2xl glass-card border border-border/50 p-3 h-fit shadow-xs">
                            {/* Stage Header */}
                            <div className="flex items-center justify-between mb-4 px-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-foreground text-sm">{stage.name}</h3>
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                        {stage.deals.length}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleAddClick(stage.id)}
                                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={stage.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex flex-col gap-3 p-3 min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-[#222]/80' : 'bg-transparent'
                                            }`}
                                    >
                                        {stage.deals.map((deal, index) => (
                                            <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => handleDealClick(deal.id)}
                                                        className={`p-4 rounded-xl border flex flex-col gap-3 group transition-all shadow-sm ${snapshot.isDragging
                                                            ? 'bg-[#1c1c1c] border-primary/50 shadow-xl scale-[1.02] cursor-grabbing rotate-1 z-50'
                                                            : 'bg-[#1c1c1c] border-white/5 hover:border-primary/30 cursor-grab hover:shadow-md'
                                                            }`}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        {/* Titulo e Ações */}
                                                        <div className="flex justify-between items-start gap-2">
                                                            <h4 className="font-semibold text-white text-[15px] leading-snug line-clamp-2 pr-4">{deal.title}</h4>
                                                            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded text-muted-foreground hover:text-white transition-all shrink-0">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {/* Empresa */}
                                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                                            <User className="w-3.5 h-3.5 shrink-0" />
                                                            <span className="text-xs font-medium truncate">{deal.company}</span>
                                                        </div>

                                                        {/* Valor e Status */}
                                                        <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
                                                            <span className="text-[15px] font-bold text-[#ff7b00]">
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.value / 100)}
                                                            </span>
                                                            <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">
                                                                {deal.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Nova Oportunidade (Deal)</DialogTitle>
                        <DialogDescription>
                            Crie um novo deal de vendas para analisar na pipeline.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Título</Label>
                            <Input id="title" placeholder="Licenciamento Anual" value={newDeal.title} onChange={e => setNewDeal({ ...newDeal, title: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="company" className="text-right">Empresa</Label>
                            <Input id="company" placeholder="Acme Corp" value={newDeal.company} onChange={e => setNewDeal({ ...newDeal, company: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right">Valor Estimado</Label>
                            <MoneyInput id="value" value={newDeal.value} onValueChange={val => setNewDeal({ ...newDeal, value: val })} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={async () => {
                            if (!newDeal.title || !activeStageId) {
                                toast.error("O título e a Etapa são obrigatórios.")
                                return
                            }
                            try {
                                await createKanbanDealAction(newDeal.title, newDeal.company, newDeal.value, activeStageId)
                                toast.success("Oportunidade criada com sucesso!")
                                setIsAddOpen(false)
                                setNewDeal({ title: '', company: '', value: 0 })
                            } catch (e: any) {
                                toast.error(e.message || "Falha ao criar oportunidade.")
                            }
                        }}>Criar Oportunidade</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DealDrawer
                dealId={selectedDealId}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </>
    )
}

