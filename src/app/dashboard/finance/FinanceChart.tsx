'use client'

import React from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface FinanceChartProps {
    data: { date: string, amount: number }[]
}

export function FinanceChart({ data }: FinanceChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground w-full h-[300px]">
                Sem dados suficientes para o gráfico.
            </div>
        )
    }

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#888888' }}
                        dy={10}
                    />
                    <YAxis
                        hide
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-[#1c1c1c] border border-border/20 p-3 rounded-lg shadow-xl">
                                        <p className="text-zinc-400 text-xs mb-1 font-medium">{label}</p>
                                        <p className="text-emerald-500 font-bold text-sm">
                                            {formatCurrency(payload[0].value as number)}
                                        </p>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
