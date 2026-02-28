"use client"

import * as React from "react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PushProvider } from "./PushProvider"
import {
    LayoutDashboard,
    KanbanSquare,
    Inbox,
    Contact,
    Workflow,
    Bot,
    LayoutTemplate,
    Settings,
    LogOut,
    Hexagon,
    Landmark
} from 'lucide-react'
import { cn } from "@/lib/utils"

const mainMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: KanbanSquare, label: "Pipeline (Kanban)", href: "/dashboard/kanban" },
    { icon: Inbox, label: "Caixa de Entrada", href: "/dashboard/inbox" },
    { icon: Contact, label: "Contatos e Leads", href: "/dashboard/contacts" },
    { icon: Workflow, label: "Campanhas em Lote", href: "/dashboard/automations" },
    { icon: Bot, label: "Meus Chatbots", href: "/dashboard/chatbots" },
    { icon: Landmark, label: "Relatórios Financeiros", href: "/dashboard/finance" },
    { icon: LayoutTemplate, label: "Templates Meta", href: "/dashboard/templates" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
]

export function AnimatedSidebar({ userRole }: { userRole?: string }) {
    const pathname = usePathname()
    const [isHovered, setIsHovered] = React.useState(false)

    // Agrega item SuperAdmin se necessário
    const finalMenuItems = [...mainMenuItems];
    if (userRole === 'SUPERADMIN') {
        finalMenuItems.push({ icon: Hexagon, label: "Painel Super Admin", href: "/dashboard/super-admin" });
    }

    return (
        <aside
            className={cn(
                "group relative h-screen bg-[#151515] transition-all duration-300 ease-in-out flex flex-col z-20",
                isHovered ? "w-[240px]" : "w-[5.5rem]"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="h-32 flex items-center px-4 transition-all">
                <div className="flex items-center overflow-hidden whitespace-nowrap w-full justify-center">
                    <img
                        src="/logo.png"
                        alt="FLY UP"
                        className={cn(
                            "transition-all duration-300",
                            isHovered ? "w-40 h-auto object-contain" : "w-14 h-14 object-cover object-left"
                        )}
                    />
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col gap-6 pt-2">

                {/* Main Menu */}
                <div className="flex flex-col space-y-1">
                    <div className={cn("px-[4.5rem] mb-3 text-xs font-semibold text-muted-foreground transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0")}>
                        Main Menu
                    </div>
                    {finalMenuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex flex-row items-center py-3 relative group/item transition-all",
                                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                                title={isHovered ? undefined : item.label}
                            >
                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-foreground rounded-r-md" />
                                )}

                                <div className="min-w-[5.5rem] flex items-center justify-center flex-shrink-0">
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover/item:text-foreground")} strokeWidth={isActive ? 2 : 1.5} />
                                </div>
                                <span className={cn("whitespace-nowrap font-medium text-sm transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0 w-0 hidden")}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Push Notifications Opt-In (Only visible when hovered/expanded) */}
            <div className={cn("px-2 pb-2 overflow-hidden transition-all duration-300", isHovered ? "opacity-100 h-auto" : "opacity-0 h-0 w-0 hidden")}>
                <div className="border border-border/10 bg-background/50 rounded-lg p-2 flex flex-col items-center">
                    <PushProvider />
                </div>
            </div>

            <div className="pb-8 pt-4">
                <form action="/auth/logout" method="POST">
                    <button type="submit" title={isHovered ? undefined : "Logout"} className="w-full flex items-center py-3 text-muted-foreground hover:text-foreground transition-all group/item relative">
                        <div className="min-w-[5.5rem] flex items-center justify-center flex-shrink-0">
                            <LogOut className="w-5 h-5 text-primary/80 group-hover/item:text-primary" strokeWidth={1.5} />
                        </div>
                        <span className={cn("whitespace-nowrap font-medium text-sm transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0 w-0 hidden")}>
                            Logout
                        </span>
                    </button>
                </form>
            </div>
        </aside>
    )
}
