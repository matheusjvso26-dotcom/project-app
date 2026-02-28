import { ContactsBoard } from "./ContactsBoard"
import prisma from "@/lib/prisma"
import { requireUser } from "@/lib/auth-utils"

export default async function ContactsPage() {
    const user = await requireUser()

    const leads = await prisma.lead.findMany({
        where: { organizationId: user.organizationId },
        include: {
            deals: {
                include: {
                    company: true,
                    stage: true
                },
                orderBy: { createdAt: 'desc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    const formattedContacts = leads.map(lead => {
        const firstDeal = lead.deals[0] // O Negócio mais recente (caso exista)
        return {
            id: lead.id,
            name: lead.name || 'Sem Nome',
            company: firstDeal?.company?.name || 'Sem Empresa',
            email: lead.email || 'N/A',
            phone: lead.phone || 'N/A',
            status: firstDeal?.stage?.name || 'Novo',
            lastContact: new Date(lead.createdAt).toLocaleDateString('pt-BR')
        }
    })

    return (
        <div className="flex flex-col h-full bg-[#151515]">
            <div className="flex-1 overflow-auto">
                <ContactsBoard initialContacts={formattedContacts} />
            </div>
        </div>
    )
}
