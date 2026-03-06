import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const msgs = await prisma.message.findMany({
        where: { direction: 'INBOUND' },
        orderBy: { createdAt: 'desc' },
        take: 5
    })
    console.log("=== LATEST INBOUND ===")
    msgs.forEach(m => console.log(`ID: ${m.id} | Date: ${m.createdAt} | Content: ${m.content}`))

    const orgs = await prisma.organization.findMany()
    console.log("=== WABA IDs ===")
    orgs.forEach(o => console.log(`Org: ${o.name} | WABA: ${o.wabaId}`))
}
main().catch(console.error).finally(() => prisma.$disconnect())
