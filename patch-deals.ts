import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("Iniciando varredura de Deals para atualização de Status Financeiro...");
    const deals = await prisma.deal.findMany({
        include: {
            stage: {
                include: {
                    pipeline: {
                        include: {
                            stages: { orderBy: { order: 'asc' } }
                        }
                    }
                }
            }
        }
    });

    let updated = 0;
    for (const deal of deals) {
        if (!deal.stage) continue;

        const isLastStage = deal.stage.pipeline.stages[deal.stage.pipeline.stages.length - 1].id === deal.stageId;
        const stageNameLower = deal.stage.name.toLowerCase();

        let newStatus = deal.status;

        if (isLastStage || stageNameLower.includes('ganho') || stageNameLower.includes('won') || stageNameLower.includes('cliente')) {
            newStatus = "WON";
        } else if (stageNameLower.includes('perdido') || stageNameLower.includes('lost')) {
            newStatus = "LOST";
        } else {
            newStatus = "OPEN";
        }

        if (deal.status !== newStatus) {
            console.log(`Atualizando Deal "${deal.title}" (ID: ${deal.id}) de ${deal.status} para ${newStatus}`);
            await prisma.deal.update({ where: { id: deal.id }, data: { status: newStatus } });
            updated++;
        }
    }
    console.log(`\nConcluído! ${updated} negócios corrigidos com sucesso.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
