import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("----- LEADS -----")
    const leads = await prisma.lead.findMany()
    console.log(leads)

    console.log("----- PIPELINES -----")
    const p = await prisma.pipeline.findMany({ include: { stages: true } })
    console.log(JSON.stringify(p, null, 2))

    console.log("----- DEALS (NEGÓCIOS) -----")
    const deals = await prisma.deal.findMany({ include: { stage: true } })
    console.log(JSON.stringify(deals, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
