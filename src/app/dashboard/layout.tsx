import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, MessageSquareText, GitMerge, Settings, LogOut, Zap, Bot, FileText } from 'lucide-react'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // const supabase = createClient()
    // const { data: { user } } = await supabase.auth.getUser()

    // if (!user) {
    //     redirect('/login')
    // }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <Zap className="w-6 h-6 text-indigo-600" />
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Flow</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-indigo-600 group transition-colors">
                        <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        Visão Geral
                    </Link>

                    <Link href="/dashboard/kanban" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-indigo-600 group transition-colors">
                        <GitMerge className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        CRM & Deals
                    </Link>

                    <Link href="/dashboard/inbox" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-indigo-600 group transition-colors">
                        <MessageSquareText className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        WhatsApp Inbox
                    </Link>

                    <Link href="/dashboard/templates" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-indigo-600 group transition-colors">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        Templates WhatsApp
                    </Link>

                    <Link href="/dashboard/contacts" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-indigo-600 group transition-colors">
                        <Users className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        Leads & Contatos
                    </Link>

                    <Link href="/dashboard/automations" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-indigo-600 group transition-colors">
                        <Zap className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        Automações
                    </Link>

                    <Link href="/dashboard/chatbots" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-indigo-600 group transition-colors">
                        <Bot className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        Chatbots / IA
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-indigo-600 group transition-colors">
                        <Settings className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        Configurações
                    </Link>
                    <form action="/auth/logout" method="POST">
                        <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 mt-1 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-red-600 group transition-colors">
                            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-600" />
                            Sair
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header Placeholder for mobile or global search */}
                <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:hidden">
                    <div className="flex items-center gap-2">
                        <Zap className="w-6 h-6 text-indigo-600" />
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Flow</span>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
