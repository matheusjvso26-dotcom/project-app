'use server'

import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

export async function updateUserProfile(formData: FormData) {
    try {
        const user = await requireUser()

        const name = formData.get('name') as string

        if (!name || name.trim() === '') {
            return { error: 'O nome não pode estar vazio.' }
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: name.trim(),
            }
        })

        // Revalida a página para atualizar os dados no frontend
        revalidatePath('/dashboard/settings')

        return { success: true, message: 'Perfil atualizado com sucesso.' }
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error)
        return { error: 'Ocorreu um erro ao atualizar o perfil.' }
    }
}

export async function updateAvatarUrl(publicUrl: string) {
    try {
        const user = await requireUser()

        if (!publicUrl) {
            return { error: 'URL da imagem não fornecida.' }
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                avatarUrl: publicUrl,
            }
        })

        // Revalida a página para atualizar os dados no frontend
        revalidatePath('/dashboard/settings')
        revalidatePath('/dashboard') // Para atualizar topo da sidebar e afins

        return { success: true, message: 'Foto de perfil atualizada!' }
    } catch (error) {
        console.error('Erro ao atualizar foto de perfil:', error)
        return { error: 'Ocorreu um erro ao vincular a foto de perfil.' }
    }
}
