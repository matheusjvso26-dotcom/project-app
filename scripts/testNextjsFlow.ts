import { getConversations, archiveConversation } from "./src/app/dashboard/inbox/actions"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Mock requireUser inside actions.ts by patching global or we can just use raw DB
async function run() {
    const org = await prisma.organization.findFirst()
    if(!org) return;

    let conv = await prisma.conversation.findFirst({ where: { organizationId: org.id, status: 'OPEN' } })
    if(!conv) {
        console.log("NO OPEN CONVERSATION FOUND."); return;
    }

    console.log("Targeting Conversation:", conv.id)
    
    // Simulate UI action
    await prisma.conversation.update({
        where: { id: conv.id },
        data: { status: 'ARCHIVED' }
    })
    console.log("DB UPDATED TO ARCHIVED")

    // Simulate page.tsx
    const after = await prisma.conversation.findUnique({
        where: { id: conv.id }
    })

    console.log("Direct Prisma says:", after?.status)
}

run().catch(console.error).finally(() => prisma.$disconnect())
