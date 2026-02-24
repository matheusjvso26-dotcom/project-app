import prisma from "@/lib/prisma"

/**
 * Processa comandos do tipo "/agenda YYYY-MM-DD HH:MM"
 * Retorna o texto de confirmação ou erro amigável, ou nulo se não for um comando válido.
 */
export async function processAgendaCommand(leadId: string, text: string): Promise<string | null> {
    const match = text.trim().match(/^\/agenda\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/i)
    if (!match) return null

    const dateStr = match[1]
    const scheduledDate = new Date(dateStr)

    if (isNaN(scheduledDate.getTime())) {
        throw new Error("❌ Data/Hora inválida. Use o formato: /agenda YYYY-MM-DD HH:MM")
    }

    // Achar o Deal do lead para amarrar o agendamento
    const deal = await prisma.deal.findFirst({
        where: { leadId },
        orderBy: { updatedAt: 'desc' },
        include: { pipeline: { include: { stages: { orderBy: { order: 'asc' } } } } }
    })

    if (!deal) {
        throw new Error("⚠️ Nenhum cartão Kanban (Deal) encontrado para este Lead. Crie uma oportunidade primeiro.")
    }

    const pipeline = deal.pipeline
    if (pipeline && pipeline.stages.length > 0) {
        // Encontra a etapa final de conversão (exemplo: penúltima ou última, vamos usar a última)
        const targetStage = pipeline.stages[pipeline.stages.length - 1]

        await prisma.deal.update({
            where: { id: deal.id },
            data: {
                scheduledTo: scheduledDate,
                stageId: targetStage.id
            }
        })

        return `✅ Reunião confirmada para *${scheduledDate.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}*.`
    }

    // Se não encontrou pipeline, apenas atualiza a data
    await prisma.deal.update({
        where: { id: deal.id },
        data: { scheduledTo: scheduledDate }
    })

    return `✅ Reunião confirmada para *${scheduledDate.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}*.`
}
