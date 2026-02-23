import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth-utils'

/**
 * Proxy Server-Side para baixar Mídias do WhatsApp protegidamente.
 * A Meta obriga que requests de media URL sejam feitos com o Token Bearer. 
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Bloquear acesso não autenticado para não vazar anexos B2B
        await requireUser()

        const { id: mediaId } = await params
        const token = process.env.META_ACCESS_TOKEN

        if (!token) return NextResponse.json({ error: "Token não configurado." }, { status: 500 })

        // 1. Obter a URL de Download pelo Media ID
        const urlRes = await fetch(`https://graph.facebook.com/v19.0/${mediaId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!urlRes.ok) {
            return NextResponse.json({ error: "Media não encontrada na Meta." }, { status: 404 })
        }

        const urlData = await urlRes.json()
        const mediaUrl = urlData.url

        if (!mediaUrl) {
            return NextResponse.json({ error: "URL da media indisponível." }, { status: 404 })
        }

        // 2. Fazer Streaming do binário original para o Client do Dashboard
        const mediaRes = await fetch(mediaUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!mediaRes.ok) {
            return NextResponse.json({ error: "Falha ao puxar binário da Meta." }, { status: mediaRes.status })
        }

        // Criar resposta proxy mantendo os headers originais de MimeType (PDF, Images, etc)
        const contentType = mediaRes.headers.get('content-type') || 'application/octet-stream'

        const disposition = contentType.startsWith('image/') || contentType.startsWith('audio/') || contentType.startsWith('video/')
            ? 'inline'
            : 'attachment'

        return new NextResponse(mediaRes.body, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `${disposition}; filename="whatsapp-media-${mediaId}"`,
                'Cache-Control': 'public, max-age=86400' // Cache na cloudflare/browser por 1 dia
            }
        })

    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Internal Error" }, { status: 500 })
    }
}
