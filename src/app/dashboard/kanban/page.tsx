import { KanbanBoard, Stage, DealStatus } from "./KanbanBoard"
import prisma from "@/lib/prisma"
import { requireUser } from "@/lib/auth-utils"

export default async function KanbanPage() {
    const user = await requireUser()

    // Fetch the first pipeline available for this organization
    let pipeline = await prisma.pipeline.findFirst({
        where: { organizationId: user.organizationId },
        include: {
            stages: {
                orderBy: { order: 'asc' },
                include: {
                    deals: {
                        include: {
                            company: true
                        }
                    }
                }
            }
        }
    })

    if (!pipeline) {
        console.log("[Kanban] Criando Pipeline Padrão porque a Organização não tinha nenhum.")
        pipeline = await prisma.pipeline.create({
            data: {
                organizationId: user.organizationId,
                name: "Funil de Vendas",
                stages: {
                    create: [
                        { name: "1. Triagem", order: 1 },
                        { name: "2. Qualificação", order: 2 },
                        { name: "3. Negociação", order: 3 },
                        { name: "4. Ganho", order: 4 }
                    ]
                }
            },
            include: {
                stages: {
                    orderBy: { order: 'asc' },
                    include: { deals: { include: { company: true } } }
                }
            }
        })
    }

    let initialData: Stage[] = []

    if (pipeline) {
        initialData = pipeline.stages.map(stage => ({
            id: stage.id,
            name: stage.name,
            deals: stage.deals.map(deal => ({
                id: deal.id,
                title: deal.title,
                company: deal.company?.name || 'Sem Empresa',
                value: deal.value,
                status: deal.status as DealStatus
            }))
        }))
    }

    return (
        <div className="flex flex-col h-full bg-[#151515]">
            <div className="p-6 border-b border-border bg-[#151515]">
                <h1 className="text-2xl font-bold text-white tracking-tight">Pipeline de Vendas</h1>
                <p className="text-sm text-muted-foreground mt-1">Gerencie oportunidades e arraste os cards pelas etapas do funil.</p>
            </div>
            <div className="flex-1 overflow-hidden p-6 bg-[#151515]">
                <KanbanBoard initialData={initialData} />
            </div>
        </div>
    )
}
