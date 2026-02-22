import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// --- Mock Helpers ---
const firstNames = ['Matheus', 'Lucas', 'Ana', 'Beatriz', 'Carlos', 'Eduardo', 'Fernanda', 'Gabriela', 'Henrique', 'Isabela', 'João', 'Letícia', 'Marcos', 'Natália', 'Pedro']
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida']
const companiesNames = ['Tech', 'Solutions', 'Corp', 'Enterprises', 'Group', 'Inovação', 'Digital', 'Systems', 'Consulting']
const jobs = ['CEO', 'CTO', 'Gerente de Vendas', 'Diretor Comercial', 'Coordenador', 'Analista', 'Sócio', 'Fundador']

const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
const getRandomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

async function main() {
    console.log(`🧹 Clearing database...`)
    await prisma.deal.deleteMany()
    await prisma.contact.deleteMany()
    await prisma.company.deleteMany()
    await prisma.stage.deleteMany()
    await prisma.pipeline.deleteMany()
    await prisma.user.deleteMany()
    await prisma.organization.deleteMany()

    console.log(`🚀 Start robust seeding...`)

    // 1. Create Organization
    const org = await prisma.organization.create({
        data: {
            name: 'Flow SaaS Demo Org',
            planTier: 'ENTERPRISE',
        },
    })

    // 2. Create Users
    const user1 = await prisma.user.create({
        data: {
            organizationId: org.id,
            email: 'admin@flowcrm.com',
            name: 'Admin Flow',
            role: 'ADMIN',
        },
    })

    const user2 = await prisma.user.create({
        data: {
            organizationId: org.id,
            email: 'sales@flowcrm.com',
            name: 'Vendedor Flow',
            role: 'CLOSER', // Enum might just be CLOSER/ADMIN etc based on schema
        },
    })

    // 3. Create Pipeline and Stages
    const pipeline = await prisma.pipeline.create({
        data: {
            organizationId: org.id,
            name: 'Vendas SaaS (Enterprise)',
            stages: {
                create: [
                    { name: 'Entrada', order: 0 },
                    { name: 'Proposta', order: 1 },
                    { name: 'Negociação', order: 2 },
                    { name: 'Fechamento', order: 3 },
                ]
            }
        },
        include: { stages: true }
    })

    // 4. Generate Mass Data (40 Leads/Companies)
    console.log(`⚙️ Generating 40 Companies & Contacts...`)

    for (let i = 0; i < 40; i++) {
        const cName = `${firstNames[i % firstNames.length]} ${getRandomItem(companiesNames)}`

        // Create Company
        const company = await prisma.company.create({
            data: {
                organizationId: org.id,
                name: cName,
                domain: `${cName.toLowerCase().replace(/\s/g, '')}.com.br`
            }
        })

        // Generate 1-2 Contacts per company
        const numContacts = getRandomValue(1, 2)
        for (let j = 0; j < numContacts; j++) {
            const fName = getRandomItem(firstNames)
            const lName = getRandomItem(lastNames)
            await prisma.contact.create({
                data: {
                    organizationId: org.id,
                    companyId: company.id,
                    name: `${fName} ${lName}`,
                    email: `${fName.toLowerCase()}.${lName.toLowerCase()}@${company.domain}`,
                    phone: `+55${getRandomValue(11, 21)}9${getRandomValue(1000, 9999)}${getRandomValue(1000, 9999)}`,
                    jobTitle: getRandomItem(jobs)
                }
            })
        }

        // Generate 0-2 Deals per company
        const numDeals = getRandomValue(0, 2)
        for (let k = 0; k < numDeals; k++) {
            // Assign random stage and owner
            const randomStage = getRandomItem(pipeline.stages)
            const randomOwner = getRandomValue(1, 10) > 5 ? user1.id : user2.id
            const dealValueCents = getRandomValue(1500, 50000) * 100 // saved in cents

            // Simulate some LOST and WON randomly on final stages, most are OPEN
            let status = 'OPEN'
            if (randomStage.order > 3) {
                const rand = getRandomValue(1, 100)
                if (rand > 80) status = 'WON'
                else if (rand > 60) status = 'LOST'
            }

            await prisma.deal.create({
                data: {
                    organizationId: org.id,
                    pipelineId: pipeline.id,
                    stageId: randomStage.id,
                    companyId: company.id,
                    ownerId: randomOwner,
                    title: `Licenciamento SaaS - ${cName} [Q${getRandomValue(1, 4)}]`,
                    value: dealValueCents,
                    status: status as any
                }
            })
        }
    }

    // 5. Generate Conversations and Messages (Inbox Mock Data)
    console.log(`💬 Generating Mock Conversations and Messages for Inbox...`)

    // Obter 5 contatos aleatórios para gerar chats
    const randomContacts = await prisma.contact.findMany({ take: 5 })

    for (const contact of randomContacts) {
        // Primeiro, garantir que esse Contato seja também considerado um 'Lead' pelo Prisma (Tabela unificada futura, mas hoje dividida)
        const lead = await prisma.lead.create({
            data: {
                organizationId: org.id,
                phone: contact.phone || "+5511999999999",
                name: contact.name,
                lgpdConsent: true
            }
        })

        const conversation = await prisma.conversation.create({
            data: {
                organizationId: org.id,
                leadId: lead.id,
                status: 'OPEN'
            }
        })

        // Gerar 2 a 4 mensagens antigas
        const messageCount = getRandomValue(2, 4)
        for (let m = 0; m < messageCount; m++) {
            const isBotOrAgent = m % 2 === 0

            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    direction: isBotOrAgent ? 'OUTBOUND' : 'INBOUND',
                    type: 'TEXT',
                    content: isBotOrAgent ? `Olá ${lead.name}, como posso te ajudar hoje?` : `Gostaria de saber mais sobre os planos do CRM SaaS.`,
                    senderId: isBotOrAgent ? user2.id : null,
                    status: isBotOrAgent ? 'READ' : 'DELIVERED',
                    createdAt: new Date(Date.now() - (messageCount - m) * 60000) // atraso de minutos
                }
            })
        }
    }

    console.log(`✅ Seeding finished successfully.`)
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
