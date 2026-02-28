import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("Renomeando etapas '4. Ganho' para '4. Fechado'...")
    const result = await prisma.stage.updateMany({
        where: { name: "4. Ganho" },
        data: { name: "4. Fechado" }
    })
    console.log(`Etapas atualizadas: ${result.count}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
