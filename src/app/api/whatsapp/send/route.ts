import { NextResponse } from 'next/server'
import { getWhatsAppProvider } from '@/lib/whatsapp/provider'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { to, text, templateName, templateLanguage, templateComponents } = body

        if (!to) {
            return NextResponse.json({ error: "Missing 'to' parameter" }, { status: 400 })
        }

        const provider = getWhatsAppProvider()

        const result = await provider.sendMessage({
            to,
            text,
            templateName,
            templateLanguage,
            templateComponents
        })

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 })
        }

        return NextResponse.json({ success: true, messageId: result.messageId })

    } catch (error: any) {
        console.error("[API/WhatsApp] Send Error:", error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
