import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Secret Code que você mesmo definiu no painel do Facebook -> Whatsapp Webhooks para liberar a Ponte.
const META_WEBHOOK_VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'flyup_webhook_secret_2026';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === META_WEBHOOK_VERIFY_TOKEN) {
        console.log('🔗 Meta Webhook Verificado com Sucesso!');
        // Obrigatório retornar o CHALLENGE em formato raw/text com Status 200
        return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse('Forbidden (Token Incorreto)', { status: 403 });
}

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // 1. Ignora payloads lixos ou de outras origens
        if (payload.object !== 'whatsapp_business_account') {
            return new NextResponse('Not a WhatsApp Event', { status: 404 });
        }

        const entry = payload.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const metadata = value?.metadata;
        const messages = value?.messages;
        const contacts = value?.contacts;

        // Se o facebook mandar uma notificação "Lida/Entregue" sem msg text, apenas da Bypass (200 OK)
        if (!messages || messages.length === 0) {
            return new NextResponse('EVENT_RECEIVED', { status: 200 });
        }

        const messageData = messages[0];
        const contactData = contacts?.[0];

        const senderPhone = messageData.from; // Cliente Final
        const senderName = contactData?.profile?.name || 'Lead Anônimo (Zap)';

        // Identidade da Empresa B2B registrada no Fly Up SaaS
        const receiverPhoneId = metadata?.phone_number_id;

        const messageId = messageData.id; // WAMID Unique UUID
        const messageText = messageData.text?.body || '[Arquivo não suportado V1]';
        const timestamp = new Date(parseInt(messageData.timestamp) * 1000);

        if (!receiverPhoneId) return new NextResponse('Missing Receiver PhoneId', { status: 200 });

        // 2. Busca o Dono/Organização correspondente ao Number ID
        const org = await prisma.organization.findFirst({
            where: { phoneNumberId: receiverPhoneId }
        });

        // Se não for nosso, descarta
        if (!org) {
            console.error('Meta Inbound: Unregistered Phone Number ID detectado -> ', receiverPhoneId);
            return new NextResponse('EVENT_RECEIVED', { status: 200 });
        }

        // 3. Previne Loop de Duplicidade Oficial
        const existingMsg = await prisma.message.findUnique({
            where: { providerId: messageId }
        });

        if (existingMsg) {
            return new NextResponse('ALREADY_PROCESSED', { status: 200 });
        }

        // 4. Fluxo Seguro (Lead -> Conversa -> Mensagem)
        let lead = await prisma.lead.findFirst({
            where: {
                organizationId: org.id,
                phone: senderPhone
            }
        });

        if (!lead) {
            lead = await prisma.lead.create({
                data: {
                    organizationId: org.id,
                    name: senderName,
                    phone: senderPhone,
                    source: 'WHATSAPP_CLOUD'
                }
            });
        }

        let conversation = await prisma.conversation.findFirst({
            where: {
                organizationId: org.id,
                leadId: lead.id,
                channel: 'WHATSAPP'
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    organizationId: org.id,
                    leadId: lead.id,
                    channel: 'WHATSAPP',
                    status: 'OPEN' // Move para a Coluna do Kanban
                }
            });
        }

        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderType: 'LEAD',
                content: messageText,
                status: 'DELIVERED',
                providerId: messageId,
                createdAt: timestamp
            }
        });

        // Retorna sucesso imeditatamento para o Servidor Meta não banir a rota
        return new NextResponse('EVENT_RECEIVED', { status: 200 });

    } catch (error) {
        console.error('Houve falha no Runtime da Recepcão Meta Webhook:', error);
        return new NextResponse('Database / Server Crash', { status: 500 });
    }
}
