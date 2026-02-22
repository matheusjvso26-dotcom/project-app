'use server'

import { getWhatsAppProvider } from '@/lib/whatsapp/provider'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function sendMessageAction(chatId: string, text: string) {
    // 1. Fetch Chat Info (to get Real Phone Number)
    // Note: Mocking for MVP if DB isn't seeded with exact chatId
    const chat = await prisma.conversation.findUnique({
        where: { id: chatId },
        include: { lead: true }
    })

    const toPhone = chat?.lead?.phone || '+5511999999999'

    // 2. Load the specific Provider based on Settings/Env
    const wpProvider = getWhatsAppProvider()

    // 3. Dispatch HTTP Post via Provider
    const result = await wpProvider.sendMessage({
        to: toPhone,
        text: text
    })

    if (!result.success) {
        throw new Error("Failed to send WhatsApp message")
    }

    // 4. Save to DB Audit / Message Log
    // If we had a real message table, we would save here:
    /*
    await prisma.message.create({
        data: {
            conversationId: chatId,
            content: text,
            senderType: 'AGENT',
            status: 'SENT',
            externalId: result.messageId
        }
    })
    */

    revalidatePath('/dashboard/inbox')

    return { success: true, messageId: result.messageId }
}
