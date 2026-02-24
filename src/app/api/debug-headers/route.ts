import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const headers = Object.fromEntries(request.headers.entries())
    return NextResponse.json(headers)
}
