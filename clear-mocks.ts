import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log(`🧹 Inciando Limpeza Segura do Banco de Dados...`)

    // Deletar Entidades de Vendas e CRM geradas pelo Seed Antigo (Mock Data)
    console.log("Deletando Mensagens...")
    await prisma.message.deleteMany()

    console.log("Deletando Conversas...")
    await prisma.conversation.deleteMany()

    console.log("Deletando Oportunidades (Deals)...")
    await prisma.deal.deleteMany()

    console.log("Deletando Contatos...")
    await prisma.contact.deleteMany()

    console.log("Deletando Leads...")
    await prisma.lead.deleteMany()

    console.log("Deletando Empresas...")
    await prisma.company.deleteMany()

    console.log(`✅ Base de Operações ZERADA. Organização, Usuários e Pipeline Foram Preservados.`)
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
