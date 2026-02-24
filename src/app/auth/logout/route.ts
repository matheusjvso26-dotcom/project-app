import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    await supabase.auth.signOut()

    const isProd = process.env.NODE_ENV === 'production'
    const baseUrl = isProd ? 'https://app.fire675.com' : request.url

    const url = new URL('/login', baseUrl)
    return NextResponse.redirect(url, { status: 303 })
}

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    await supabase.auth.signOut()

    const isProd = process.env.NODE_ENV === 'production'
    const baseUrl = isProd ? 'https://app.fire675.com' : request.url

    const url = new URL('/login', baseUrl)
    return NextResponse.redirect(url, { status: 303 })
}
