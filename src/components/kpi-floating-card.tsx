"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiFloatingCardProps {
    title: string
    value: string | number
    delta?: number
    deltaType?: "increase" | "decrease" | "neutral"
    showDotPattern?: boolean
    icon?: React.ReactNode
    className?: string
}

export function KpiFloatingCard({
    title,
    value,
    delta,
    deltaType = "neutral",
    showDotPattern = true,
    icon,
    className
}: KpiFloatingCardProps) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    const isPositive = deltaType === "increase" || (delta && delta > 0)
    const isNegative = deltaType === "decrease" || (delta && delta < 0)

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 1
            }}
            className={cn(
                "relative w-full rounded-2xl p-6 glass-card overflow-hidden group cursor-pointer",
                showDotPattern && "bg-dot-pattern",
                className
            )}
        >
            <div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ transform: "translateZ(-10px)" }}
            />

            <div className="relative z-10 flex flex-col gap-4" style={{ transform: "translateZ(30px)" }}>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{title}</span>
                    {icon && (
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {icon}
                        </div>
                    )}
                </div>

                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">{value}</h2>
                </div>

                {delta !== undefined && (
                    <div className={cn(
                        "flex items-center text-sm font-medium",
                        isPositive ? "text-emerald-500" : isNegative ? "text-destructive" : "text-muted-foreground"
                    )}>
                        {isPositive ? (
                            <ArrowUpIcon className="mr-1 h-4 w-4" />
                        ) : isNegative ? (
                            <ArrowDownIcon className="mr-1 h-4 w-4" />
                        ) : null}
                        <span>{Math.abs(delta)}% em relação ao mês anterior</span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
