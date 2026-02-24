import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    await supabase.auth.signOut()

    const isProd = process.env.NODE_ENV === 'production'
    const baseUrl = isProd ? 'https://app.fire675.com' : request.url

    const url = new URL('/login?message=Cadastro%20não%20encontrado%20no%20Banco%20de%20Dados.%20Por%20favor%2C%20crie%20uma%20conta%20novamente.', baseUrl)
    return NextResponse.redirect(url, { status: 303 })
}

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    await supabase.auth.signOut()

    const isProd = process.env.NODE_ENV === 'production'
    const baseUrl = isProd ? 'https://app.fire675.com' : request.url

    const searchParams = request.nextUrl.searchParams
    const reason = searchParams.get('reason')

    let message = 'Sessão expirada com sucesso.'
    if (reason === 'db_missing') {
        message = 'Conta de banco resetada! Por favor, REGISTRE-SE de novo utilizando OUTRO E-MAIL.'
    }

    const url = new URL(`/login?message=${message}`, baseUrl)
    return NextResponse.redirect(url, { status: 303 })
}
