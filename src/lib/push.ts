import webpush from 'web-push';
import prisma from './prisma';

// Para produção, você deve gerar essas chaves via console (npx web-push generate-vapid-keys)
// E salvá-las no .env (NEXT_PUBLIC_VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY)
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BEl62iR9vYZc50o5W_Jp9E0x2oG9s5rC_5W1tG5r2-P4gAQAQ_Q' // Fake/Example Key for missing ENV
const privateKey = process.env.VAPID_PRIVATE_KEY || '8tjx9rP0s_E'

try {
    webpush.setVapidDetails(
        'mailto:suporte@flyup.com',
        publicKey,
        privateKey
    );
} catch (error) {
    console.error("[WebPush] Falha ao configurar VAPID. Verifique as chaves no .env")
}

export async function sendPushNotification(userId: string, payload: { title: string, body: string, url?: string }) {
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        console.warn("[WebPush] Desabilitado devido à falta de Chaves VAPID reais na ENV.")
        return;
    }

    try {
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId }
        });

        const promises = subscriptions.map(async (sub) => {
            try {
                const pushSubscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth
                    }
                };

                await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
            } catch (error: any) {
                // Remove a inscrição se ela não for mais válida (usuário revogou no browser)
                if (error.statusCode === 410 || error.statusCode === 404) {
                    await prisma.pushSubscription.delete({ where: { id: sub.id } });
                } else {
                    console.error('[WebPush] Erro ao notificar endpoint:', error);
                }
            }
        });

        await Promise.all(promises);
    } catch (e) {
        console.error('[WebPush] Falha fatal no módulo de disparo:', e);
    }
}
