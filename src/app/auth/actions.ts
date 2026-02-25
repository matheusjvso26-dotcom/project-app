import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string()
        .min(8, 'A senha deve ter pelo menos 8 caracteres')
        .regex(/[A-Z]/, 'A senha deve conter uma letra maiúscula')
        .regex(/[0-9]/, 'A senha deve conter um número')
        .regex(/[^A-Za-z0-9]/, 'A senha deve conter um caractere especial'),
    name: z.string().min(2, 'Nome inválido'),
    company: z.string().min(2, 'Nome da empresa inválido'),
    phone: z.string().min(10, 'WhatsApp inválido')
})

export async function login(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/login?message=E-mail ou senha incorretos')
    }

    const prisma = (await import('@/lib/prisma')).default
    const dbUser = await prisma.user.findUnique({
        where: { id: authData.user.id },
        include: { organization: true }
    })

    // @ts-ignore: Propriedades incluídas recentemente no Prisma DB Schema
    if (dbUser?.organization?.status === 'PENDING' || dbUser?.status === 'PENDING') {
        await supabase.auth.signOut()
        redirect('/login?message=Sua conta aguarda aprovação em nosso sistema.')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard?message=Login efetuado com sucesso')
}

export async function register(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const company = formData.get('company') as string
    const phone = formData.get('phone') as string

    // 1. Zod Validation
    const parsed = registerSchema.safeParse({ email, password, name, company, phone })
    if (!parsed.success) {
        const errorMsg = parsed.error.issues[0].message
        redirect(`/register?message=${errorMsg}`)
    }

    const prisma = (await import('@/lib/prisma')).default

    // 2. Strict Duplication Check
    const existingCompany = await prisma.organization.findFirst({ where: { name: company } })
    if (existingCompany) {
        redirect('/register?message=Nome de empresa já cadastrado em nosso sistema. Escolha outro.')
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        redirect('/register?message=E-mail já cadastrado.')
    }

    const supabase = await createClient()

    // 3. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: name, phone }
        }
    })

    if (authError || !authData.user) {
        redirect(`/register?message=${authError?.message || 'Erro ao criar conta.'}`)
    }

    const userId = authData.user.id
    const userEmail = authData.user.email ?? email

    // 4. Create the Organization (Pending Status) and User in Prisma
    try {
        await prisma.$transaction(async (tx: any) => {
            const org = await tx.organization.create({
                data: {
                    name: company,
                    planTier: 'TRIAL',
                    status: 'PENDING',
                    ownerPhone: phone
                }
            })

            await tx.user.create({
                data: {
                    id: userId,
                    email: userEmail,
                    name: name,
                    role: 'ADMIN',
                    status: 'PENDING',
                    organizationId: org.id
                }
            })
        })
    } catch (err) {
        console.error("Erro ao provisionar workspace:", err)
        redirect('/register?message=Erro interno ao criar Workspace')
    }

    // Force signout precisely because they must wait for approval to login
    await supabase.auth.signOut()
    redirect('/login?message=Cadastro finalizado! Sua conta aguarda a aprovação da nossa equipe.')
}
