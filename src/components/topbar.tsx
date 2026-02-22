import * as React from "react"
import { Search, Plus, User as UserIcon, Bell } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

import { GlobalSearch } from "./global-search"
import { requireUser } from "@/lib/auth-utils"

export async function Topbar() {
    const user = await requireUser()

    const firstName = user.name ? user.name.split(' ')[0] : 'Usuário'

    return (
        <header className="h-[5.5rem] flex-shrink-0 flex items-center justify-between px-8 sticky top-0 z-10 w-full bg-[#151515]">
            {/* Left side: Greeting */}
            <div className="flex flex-col justify-center flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-foreground text-lg">Olá,</span>
                    <span className="text-foreground text-lg font-bold">{firstName}</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground mt-0.5">Bem-vindo ao dashboard</span>
            </div>

            {/* Center: Search */}
            <div className="flex-1 flex justify-center items-center">
                <GlobalSearch />
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center justify-end gap-5 flex-1 p-2">
                <button className="relative text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-white/5">
                    <Bell className="w-[1.2rem] h-[1.2rem]" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-[#151515]"></span>
                </button>
                <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center overflow-hidden border border-border shrink-0 cursor-pointer p-0 text-white font-bold uppercase">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={firstName} className="w-full h-full object-cover" />
                    ) : (
                        <span>{firstName.charAt(0)}</span>
                    )}
                </div>
            </div>
        </header>
    )
}
