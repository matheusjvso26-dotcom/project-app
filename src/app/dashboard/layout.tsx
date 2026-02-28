import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AnimatedSidebar } from "@/components/animated-sidebar"
import { Topbar } from "@/components/topbar"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Buscando o Role local no DB
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true }
    })

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AnimatedSidebar userRole={dbUser?.role} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
                <Topbar />
                <div className="flex-1 overflow-auto bg-background">
                    <div className="relative z-0 h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
