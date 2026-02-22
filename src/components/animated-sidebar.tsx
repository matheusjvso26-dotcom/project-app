"use client"

import * as React from "react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Landmark,
    CreditCard,
    Contact,
    Calculator,
    Settings,
    LogOut,
    Calendar,
    Utensils,
    FileText,
    Hexagon
} from 'lucide-react'
import { cn } from "@/lib/utils"

const mainMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Landmark, label: "Accounts", href: "/dashboard/kanban" },
    { icon: CreditCard, label: "Cards", href: "/dashboard/inbox" },
    { icon: Contact, label: "Contacts", href: "/dashboard/contacts" },
    { icon: Calculator, label: "Loan Calculator", href: "/dashboard/automations" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

const scheduleItems = [
    { icon: Calendar, label: "Monthly Rent", href: "/dashboard/chatbots" },
    { icon: Utensils, label: "Food Payment", href: "/dashboard/templates" },
    { icon: FileText, label: "Utility Bills", href: "#" },
]

export function AnimatedSidebar() {
    const pathname = usePathname()
    const [isHovered, setIsHovered] = React.useState(false)

    return (
        <aside
            className={cn(
                "group relative h-screen bg-[#151515] transition-all duration-300 ease-in-out flex flex-col z-20",
                isHovered ? "w-[240px]" : "w-[5.5rem]"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="h-28 flex items-center justify-center px-4 transition-all">
                <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                    <Hexagon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                    <div className={cn("flex flex-col justify-center transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0 w-0")}>
                        <span className="text-xl font-bold tracking-tight text-primary leading-none">
                            FLY UP
                        </span>
                        <span className="text-[11px] font-bold tracking-[0.2em] text-[#ffffff] uppercase mt-1 leading-none">
                            BANK
                        </span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col gap-6 pt-2">

                {/* Main Menu */}
                <div className="flex flex-col space-y-1">
                    <div className={cn("px-[4.5rem] mb-3 text-xs font-semibold text-muted-foreground transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0")}>
                        Main Menu
                    </div>
                    {mainMenuItems.map((item) => {
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

                {/* Schedule Payments */}
                <div className="flex flex-col space-y-1 mt-4">
                    <div className={cn("px-[4.5rem] mb-3 text-xs font-semibold text-muted-foreground transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0")}>
                        Schedule Payments
                    </div>
                    {scheduleItems.map((item) => {
                        const isActive = pathname === item.href
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
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-foreground rounded-r-md" />
                                )}

                                <div className="min-w-[5.5rem] flex items-center justify-center flex-shrink-0">
                                    <item.icon className={cn("w-5 h-5 text-primary/80 group-hover/item:text-primary")} strokeWidth={1.5} />
                                </div>
                                <span className={cn("whitespace-nowrap font-medium text-sm transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0 w-0 hidden")}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

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
