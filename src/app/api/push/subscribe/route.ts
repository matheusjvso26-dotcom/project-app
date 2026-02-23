import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const user = await requireUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const subscription = await req.json();

        if (!subscription || !subscription.endpoint || !subscription.keys) {
            return NextResponse.json({ error: 'Formato de Inscrição Inválido' }, { status: 400 });
        }

        const existing = await prisma.pushSubscription.findUnique({
            where: { endpoint: subscription.endpoint }
        });

        if (!existing) {
            await prisma.pushSubscription.create({
                data: {
                    userId: user.id,
                    endpoint: subscription.endpoint,
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth
                }
            });
        }

        return NextResponse.json({ success: true, message: 'Dispositivo Registrado para PWA Push' });
    } catch (e: any) {
        console.error('[API/Push] Erro de Subscribe:', e);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
