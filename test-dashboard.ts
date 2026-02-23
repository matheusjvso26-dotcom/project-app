import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testQuery() {
    console.time("Query execution time")

    // Simulate requireUser
    const user = await prisma.user.findFirst()
    if (!user) {
        console.log("No user found")
        return
    }
    const organizationId = user.organizationId
    const periodDays = 30

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)

    try {
        console.log("Fetching leads...")
        const totalLeads = await prisma.lead.count({
            where: {
                organizationId,
                createdAt: { gte: startDate }
            }
        })

        console.log("Fetching messages...")
        const totalMessages = await prisma.message.count({
            where: {
                conversation: { organizationId },
                createdAt: { gte: startDate }
            }
        })

        console.log("Fetching wonDeals...")
        const wonDeals = await prisma.deal.findMany({
            where: {
                organizationId,
                status: "WON",
                updatedAt: { gte: startDate }
            },
            include: { lead: true, company: true, stage: true },
            orderBy: { updatedAt: 'desc' }
        })

        const totalMRR = wonDeals.reduce((acc, deal) => acc + deal.value, 0)

        console.log("Fetching allDealsInPeriod...")
        const allDealsInPeriod = await prisma.deal.count({
            where: {
                organizationId,
                createdAt: { gte: startDate }
            }
        })

        const winRateVal = allDealsInPeriod > 0 ? (wonDeals.length / allDealsInPeriod) * 100 : 0

        console.log("Fetching recentDealsRaw...")
        const recentDealsRaw = await prisma.deal.findMany({
            where: { organizationId },
            include: { lead: true, company: true, stage: true },
            orderBy: { updatedAt: 'desc' },
            take: 4
        })

        const recentDealsFormatted = recentDealsRaw.map(deal => ({
            id: deal.id,
            name: deal.company?.name || deal.lead?.name || deal.title || "Cliente Desconhecido",
            plan: deal.stage.name, // THIS WILL THROW IF deal.stage IS NULL! But deal.stage is guaranteed?
            amount: deal.value,
            type: (deal.status === 'LOST' || deal.value < 0 ? 'negative' : 'positive') as 'positive' | 'negative'
        }))

        console.log("Success! Data preview:", { totalLeads, totalMessages, totalMRR, recentCount: recentDealsFormatted.length })
    } catch (e) {
        console.error("ERROR CAUGHT IN QUERIES:", e)
    }

    console.timeEnd("Query execution time")
}

testQuery().finally(() => prisma.$disconnect())
