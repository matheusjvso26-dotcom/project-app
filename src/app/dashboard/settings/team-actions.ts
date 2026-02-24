'use server'

import { requireUser } from "@/lib/auth-utils"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const userSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(6, "A senha provisória deve ter no mínimo 6 caracteres."),
    role: z.enum(["ADMIN", "CLOSER", "SDR"], {
        message: "Selecione um cargo válido."
    }),
})

export async function getOrganizationUsers() {
    const user = await requireUser()

    const users = await prisma.user.findMany({
        where: {
            organizationId: user.organizationId
        },
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        }
    })

    return users
}

export async function inviteUser(formData: FormData) {
    try {
        const caller = await requireUser()

        // Somente ADMINS podem convidar outros membros
        if (caller.role !== 'ADMIN') {
            return { error: 'Apenas Administradores podem adicionar novos membros à equipe.' }
        }

        const data = Object.fromEntries(formData.entries())
        const parsed = userSchema.safeParse(data)

        if (!parsed.success) {
            return { error: parsed.error.issues[0].message }
        }

        const { name, email, password, role } = parsed.data

        // Verificar se e-mail já existe no banco inteiro (nosso SaaS é único por email)
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return { error: 'Este e-mail já está em uso por outra conta no sistema.' }
        }

        // Inserir no Prisma
        await prisma.user.create({
            data: {
                organizationId: caller.organizationId,
                email: email,
                name: name,
                role: role,
                // O password será lidado por provedor de auth real
            }
        })

        revalidatePath('/dashboard/settings')
        return { success: true, message: 'Membro adicionado à organização com sucesso!' }

    } catch (error: any) {
        console.error("Erro ao convidar usuário:", error)
        return { error: 'Ocorreu um erro interno ao salvar o convite.' }
    }
}
