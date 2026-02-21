'use client'

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { MoreHorizontal, Clock, DollarSign, User as UserIcon } from 'lucide-react'

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
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const getStatusColor = (status: DealStatus) => {
    switch (status) {
        case 'ON_TRACK': return 'bg-emerald-100 text-emerald-700'
        case 'AT_RISK': return 'bg-amber-100 text-amber-700'
        case 'LATE': return 'bg-rose-100 text-rose-700'
        default: return 'bg-slate-100 text-slate-700'
    }
}

interface KanbanBoardProps {
    initialData: Stage[]
}

import { updateDealStageAction } from './actions'

export function KanbanBoard({ initialData }: KanbanBoardProps) {
    const [data, setData] = useState<Stage[]>([])
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setData(initialData)
        setIsMounted(true)
    }, [initialData])


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

        // Remove from source array
        sourceStage.deals.splice(source.index, 1)

        // Append to destination array
        destStage.deals.splice(destination.index, 0, draggedDeal)

        setData(newData)

        // Update the DB via Server Action
        updateDealStageAction(draggedDeal.id, destStage.id).catch(err => {
            console.error(err)
            // Rollback UI could be implemented here
        })
    }

    // Prevent hydration mismatch for react-beautiful-dnd / hello-pangea
    if (!isMounted) return null

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full w-full gap-6 overflow-x-auto p-2">
                {data.map((stage) => (
                    <div key={stage.id} className="flex min-w-[320px] max-w-[320px] flex-col rounded-xl bg-slate-100/80 p-3 h-fit border border-slate-200/60">
                        {/* Stage Header */}
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="font-semibold text-slate-800 text-sm">{stage.name}</h3>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                                {stage.deals.length}
                            </span>
                        </div>

                        {/* Droppable Area */}
                        <Droppable droppableId={stage.id}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`flex flex-col gap-3 min-h-[150px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-indigo-50/50' : ''
                                        }`}
                                >
                                    {stage.deals.map((deal, index) => (
                                        <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm transition-all ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-md border-indigo-300' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-medium text-slate-900 text-sm leading-snug">{deal.title}</h4>
                                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                                <UserIcon className="w-3 h-3" />
                                                                {deal.company}
                                                            </p>
                                                        </div>
                                                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                                                        <div className="flex items-center gap-1 text-slate-700 font-medium text-sm">
                                                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                                                            {formatCurrency(deal.value)}
                                                        </div>
                                                        <div className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 uppercase tracking-wider ${getStatusColor(deal.status)}`}>
                                                            {deal.status === 'LATE' && <Clock className="w-3 h-3" />}
                                                            {deal.status.replace('_', ' ')}
                                                        </div>
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
    )
}
