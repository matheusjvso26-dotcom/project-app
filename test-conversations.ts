import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function run() {
    try {
        console.log("Fetching all conversations to map...");

        const conversations = await p.conversation.findMany({
            include: {
                lead: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 50
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        console.log("Found convs:", conversations.length);

        const deals = await p.deal.findMany({
            include: { stage: true },
            orderBy: { createdAt: 'desc' }
        });

        // Simulating the mapping exactly as in actions.ts
        const mapped = conversations.map(c => {
            const leadName = c.lead?.name || 'Sem Nome'
            const cDeals = deals.filter(d => d.title.includes(leadName) || (d.companyId && d.companyId === c.leadId))
            return {
                id: c.id,
                name: c.lead?.name || 'Sem Nome',
                phone: c.lead?.phone || '',
                status: c.status,
                tags: c.tags || [],
                lgpdConsent: c.lead?.lgpdConsent || false,
                deals: cDeals.map(d => ({
                    id: d.id,
                    title: d.title,
                    value: d.value,
                    stageName: d.stage?.name || 'Sem Etapa'
                })),
                time: c.updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                lastMessage: c.messages[0]?.content || 'Nova conversa',
                isBotHandling: c.status === 'BOT_HANDLING',
                unread: 0,
                messages: c.messages.reverse().map(m => ({
                    id: m.id,
                    content: m.content || '',
                    type: m.type,
                    transcription: m.transcription || null,
                    sender: (m.direction === 'OUTBOUND' ? (m.senderId ? 'me' : 'bot') : 'client') as "me" | "bot" | "client",
                    time: m.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    status: (m.status === 'READ' ? 'read' : (m.status === 'DELIVERED' ? 'delivered' : 'sent')) as "read" | "delivered" | "sent"
                }))
            }
        });

        console.log("Mapped successfully! First conv name:", mapped[0]?.name);

    } catch (e) {
        console.error("CRASHED DURING MAPPING:", e);
    } finally {
        await p.$disconnect();
    }
}
run();
