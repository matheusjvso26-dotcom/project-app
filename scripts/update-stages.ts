import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log(`🚀 Iniciando Migração do Kanban para 4 Etapas...`)

    // 1. Pegar o Funil principal existente
    const pipeline = await prisma.pipeline.findFirst({
        include: { stages: { orderBy: { order: 'asc' } } }
    })

    if (!pipeline) {
        console.error('Nenhum Pipeline encontrado.')
        return
    }

    const stages = pipeline.stages
    console.log(`Funil encontrado: "${pipeline.name}" com ${stages.length} etapas atuais.`)

    if (stages.length === 4 && stages[0].name === 'Entrada') {
        console.log('✅ As etapas já estão configuradas como 4 (Entrada, Proposta, Negociação, Fechamento).')
        return
    }

    // Etapas antigas:
    // 0: Leads Recentes
    // 1: Em Triagem (Bot)
    // 2: Qualificados
    // 3: Apresentação Escopo
    // 4: Envio de Proposta
    // 5: Negociação Ativa

    // Etapas novas (desejadas):
    // 0: Entrada       (mescla 0 e 1)
    // 1: Proposta      (mescla 2 e 3)
    // 2: Negociação    (pega a 4)
    // 3: Fechamento    (pega a 5)

    // Ajuste da lógica de Mesclagem de forma que obedeça aos IDs que existem
    // Como os IDs não mudam, apenas os nomes e order, vamos renomear os primeiros 4 
    // e mover os DEALS dos que sobraram para a última etapa válida, e depois apagar os excedentes.

    // 1. Renomear e reordenar as Primeiras 4 
    const novosNomes = ['Entrada', 'Proposta', 'Negociação', 'Fechamento']
    for (let i = 0; i < 4; i++) {
        if (stages[i]) {
            await prisma.stage.update({
                where: { id: stages[i].id },
                data: { name: novosNomes[i], order: i }
            })
            console.log(`♻️ Etapa atualizada: [${stages[i].name}] -> [${novosNomes[i]}]`)
        }
    }

    // O id do Fechamento recém atualizado é o stages[3].id
    const targetFechamentoId = stages[3].id

    // 2. Mover todos os Deals de tabelas maiores que o índex 3 para o Fechamento
    for (let i = 4; i < stages.length; i++) {
        console.log(`🚚 Movendo oportunidades da etapa antiga: [${stages[i].name}] -> [Fechamento]`)
        await prisma.deal.updateMany({
            where: { stageId: stages[i].id },
            data: { stageId: targetFechamentoId }
        })

        // Deletar a etapa antiga limpa
        console.log(`🗑️ Deletando etapa defasada: [${stages[i].name}]`)
        await prisma.stage.delete({
            where: { id: stages[i].id }
        })
    }

    console.log(`✨ Migração concluída com sucesso!`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
