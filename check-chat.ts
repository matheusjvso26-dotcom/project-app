import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const msgs = await prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { conversation: { select: { lead: { select: { phone: true } } } } }
    })
    console.log('--- ÚLTIMAS 10 MENSAGENS ---');
    msgs.forEach(m => {
        console.log(`[${m.createdAt.toLocaleString('pt-BR')}] ${m.direction} (To/From: ${m.conversation?.lead?.phone}) | Type: ${m.type} | Content: ${m.content?.substring(0, 50)} | Status: ${m.status}`)
    })
}

main().catch(console.error).finally(() => prisma.$disconnect())
