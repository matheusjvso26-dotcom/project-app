import { processAgendaCommand } from "./src/lib/agents/agenda"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function test() {
    const org = await prisma.organization.findFirst()
    if (!org) { console.log("NO ORG"); return; }
    
    let conv = await prisma.conversation.findFirst({ where: { organizationId: org.id } })
    if(!conv) { console.log("NO CONVS"); return; }
    
    console.log("OLD DB STATUS:", conv.status)
    await prisma.conversation.update({ where: { id: conv.id }, data: { status: 'ARCHIVED' } })
    
    const check = await prisma.conversation.findUnique({ where: { id: conv.id } })
    console.log("NEW DB STATUS:", check.status)
}

test().catch(console.error).finally(()=>prisma.$disconnect())
