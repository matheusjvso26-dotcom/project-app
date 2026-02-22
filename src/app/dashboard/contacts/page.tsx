import { ContactsBoard } from "./ContactsBoard"
import prisma from "@/lib/prisma"

export default async function ContactsPage() {
    const contacts = await prisma.contact.findMany({
        include: {
            company: true
        },
        orderBy: { createdAt: 'desc' }
    })

    const formattedContacts = contacts.map(c => ({
        id: c.id,
        name: c.name,
        company: c.company?.name || 'Sem Empresa',
        email: c.email || 'N/A',
        phone: c.phone || 'N/A',
        status: 'Novo' as 'Novo' | 'Qualificado' | 'Em Negociação' | 'Cliente' | 'Perdido',
        lastContact: new Date(c.createdAt).toLocaleDateString('pt-BR')
    }))

    return (
        <div className="flex flex-col h-full bg-[#151515]">
            <div className="flex-1 overflow-auto">
                <ContactsBoard initialContacts={formattedContacts} />
            </div>
        </div>
    )
}
