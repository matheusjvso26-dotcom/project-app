import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

/**
 * Ensures the user is logged in via Supabase and exists in our Prisma Database.
 * Returns the Prisma User with Organization included.
 */
export async function requireUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { organization: true }
    })

    if (!dbUser) {
        // Edge case: user exists in auth but missing in DB.
        redirect('/auth/logout?reason=db_missing')
    }

    return dbUser
}

/**
 * Enforces Role-Based Access Control (RBAC).
 * Only returns if the user role is 'ADMIN', otherwise redirects.
 */
export async function requireAdmin() {
    const user = await requireUser()

    if (user.role !== 'ADMIN') {
        redirect('/dashboard')
    }

    return user
}
