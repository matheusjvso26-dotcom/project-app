import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    await supabase.auth.signOut()

    // Pega o host real do proxy Reverso (Cloudflare/Traefik) para evitar redirecionamento a IP de container
    const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'

    if (forwardedHost) {
        return NextResponse.redirect(`${forwardedProto}://${forwardedHost}/login`, { status: 303 })
    }

    // Fallback normal
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url, { status: 303 })
}

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    await supabase.auth.signOut()

    // Pega o host real do proxy Reverso (Cloudflare/Traefik)
    const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'

    if (forwardedHost) {
        return NextResponse.redirect(`${forwardedProto}://${forwardedHost}/login`, { status: 303 })
    }

    // Fallback normal
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url, { status: 303 })
}
