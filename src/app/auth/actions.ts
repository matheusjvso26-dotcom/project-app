import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/login?message=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function register(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const company = formData.get('company') as string

    const supabase = await createClient()

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            }
        }
    })

    if (authError || !authData.user) {
        redirect(`/register?message=${authError?.message || 'Could not create user'}`)
    }

    const userId = authData.user.id
    const userEmail = authData.user.email ?? email

    // 2. Create the Organization and the first User (Owner/Admin) in Prisma
    const prisma = (await import('@/lib/prisma')).default

    try {
        await prisma.$transaction(async (tx: any) => {
            const org = await tx.organization.create({
                data: {
                    name: company,
                    planTier: 'TRIAL',
                }
            })

            await tx.user.create({
                data: {
                    id: userId, // Vínculo com UUID do Supabase
                    email: userEmail,
                    name: name,
                    role: 'ADMIN',
                    organizationId: org.id
                }
            })
        })
    } catch (err) {
        console.error("Erro ao provisionar workspace:", err)
        // Rollback strategy or alert admin in production
        redirect('/register?message=Erro interno ao criar Workspace')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
