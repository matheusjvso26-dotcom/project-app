'use client'

import React, { useState } from 'react'
import { Wallet, Loader2 } from 'lucide-react'
import { updateFixedCosts } from './actions'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function FixedCostsForm({ initialValue }: { initialValue: number }) {
    const [cost, setCost] = useState(initialValue.toString())
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        const num = parseFloat(cost)
        if (isNaN(num) || num < 0) {
            toast.error("Insira um valor financeiro válido.")
            return
        }

        setIsLoading(true)
        try {
            await updateFixedCosts(num)
            toast.success("Custos Operacionais atualizados!")
        } catch (error: any) {
            toast.error("Erro ao atualizar custos.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-2 p-4 bg-background border border-border/50 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
                <Wallet className="w-4 h-4" /> Configurar Custos Fixos (Mensal)
            </h3>
            <div className="flex items-center gap-2 mt-1">
                <Input
                    type="number"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    placeholder="Ex: 1500"
                    className="w-32 bg-card border-border/50 h-9"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave()
                    }}
                />
                <Button size="sm" onClick={handleSave} disabled={isLoading} className="h-9">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                </Button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
                Esse valor será deduzido da Receita Real do mês atual para projetar seu Lucro Líquido (ROI).
            </p>
        </div>
    )
}
