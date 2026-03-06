import { processBotFlow } from './src/lib/whatsapp/botEngine'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testEngine() {
    // Pegar a conversa da ultima mensagem recebida q mostramos no log
    const msg = await prisma.message.findFirst({
        where: { content: 'ola', direction: 'INBOUND' },
        include: {
            conversation: {
                include: { lead: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    if (!msg) {
        console.log("Mensagem 'ola' de teste não achada no banco local");
        return;
    }

    console.log("Testando BotEngine para:", msg.id);

    try {
        await processBotFlow({
            conversationId: msg.conversationId,
            leadPhone: msg.conversation.lead.phone,
            incomingText: msg.content || '',
            incomingType: msg.type.toLowerCase(),
            isNewLead: false // Simular como se não fosse novo (geral do bug)
        });
        console.log("processBotFlow rodou e retornou sem disparar exceção explícita no script");
    } catch (e) {
        console.error("Exceção:", e);
    }
}

testEngine().finally(() => prisma.$disconnect());
