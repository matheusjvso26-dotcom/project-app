import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

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

    const supabase = createClient()

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
        redirect('/register?message=Could not create user')
    }

    // Note: During the Real Database Phase, we will hook the organization creation into this Auth process
    // using either Prisma here or via a Supabase Database Trigger.

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
