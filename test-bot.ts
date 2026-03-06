import { processBotFlow } from './src/lib/whatsapp/botEngine.ts';
import prisma from './src/lib/prisma.ts';

async function simular() {
    console.log("Simulando Inbound Message com ID '1' (Aposentado)...");

    // Obtenha a ultima mensagem INBOUND
    const lastInbound = await prisma.message.findFirst({
        where: { direction: 'INBOUND' },
        orderBy: { createdAt: 'desc' },
        include: { conversation: true }
    });

    if (!lastInbound) {
        console.error("Nenhuma conversa de teste encontrada.");
        return;
    }

    const { conversationId } = lastInbound;

    const lastBotMessage = await prisma.message.findFirst({
        where: {
            conversationId,
            direction: 'OUTBOUND',
            senderId: null
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log("===============");
    console.log("MENSAGEM DO BANCO QUE VAI SER COMPARADA NO botContext:");
    console.log(JSON.stringify(lastBotMessage?.content));
    console.log("---------------");
    console.log("Procurando por: 'Em qual opção você se enquadra?'");
    console.log("Includes funcionou? ->", lastBotMessage?.content?.includes("Em qual opção você se enquadra?"));
    console.log("===============");

    await processBotFlow({
        conversationId,
        leadPhone: "5521991525053", // Seu numero
        incomingText: "1",
        incomingType: "interactive",
        isNewLead: false
    });

    console.log("Simulador finalizado.");
}

simular().then(() => prisma.$disconnect()).catch(console.error);
