import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log(`Start seeding ...`)

    // 1. Create Organization
    const org = await prisma.organization.create({
        data: {
            name: 'Flow SaaS Demo Org',
            planTier: 'PRO',
        },
    })

    // 2. Create User
    const user = await prisma.user.create({
        data: {
            organizationId: org.id,
            email: 'matheus@flowcrm.com',
            name: 'Matheus',
            role: 'ADMIN',
        },
    })

    // 3. Create Pipeline and Stages
    const pipeline = await prisma.pipeline.create({
        data: {
            organizationId: org.id,
            name: 'Vendas SaaS (B2B)',
            stages: {
                create: [
                    { name: 'Leads Recentes (Bot)', order: 0 },
                    { name: 'Qualificação Bot', order: 1 },
                    { name: 'Follow-up Humano', order: 2 },
                    { name: 'Apresentação/Demo', order: 3 },
                    { name: 'Em Negociação', order: 4 },
                ]
            }
        },
        include: { stages: true }
    })

    // Get stage IDs for deals
    const stageLeads = pipeline.stages.find(s => s.name === 'Leads Recentes (Bot)')!.id
    const stageQualificacao = pipeline.stages.find(s => s.name === 'Qualificação Bot')!.id
    const stageNegociacao = pipeline.stages.find(s => s.name === 'Em Negociação')!.id

    // 4. Create Companies
    const company1 = await prisma.company.create({ data: { organizationId: org.id, name: 'Acme Corp', domain: 'acmecorp.com' } })
    const company2 = await prisma.company.create({ data: { organizationId: org.id, name: 'StartUp XYZ', domain: 'startupxyz.com' } })

    // 5. Create Contacts (which are linked to Leads concept in the CRM)
    const contact1 = await prisma.contact.create({
        data: { organizationId: org.id, companyId: company1.id, name: 'Carlos Mendes', email: 'carlos@acmecorp.com', phone: '+55 11 98888-7777', jobTitle: 'CEO' }
    })

    const contact2 = await prisma.contact.create({
        data: { organizationId: org.id, companyId: company2.id, name: 'Ana Beatriz', email: 'ana.b@startupxyz.com', phone: '+55 21 97777-6666', jobTitle: 'CTO' }
    })

    // 6. Create Deals
    await prisma.deal.create({
        data: {
            organizationId: org.id,
            pipelineId: pipeline.id,
            stageId: stageNegociacao,
            companyId: company1.id,
            ownerId: user.id,
            title: 'Licenças Flow CRM - Acme',
            value: 15000,
        }
    })

    await prisma.deal.create({
        data: {
            organizationId: org.id,
            pipelineId: pipeline.id,
            stageId: stageQualificacao,
            companyId: company2.id,
            ownerId: user.id,
            title: 'Upgrade Plano PRO - StartUp XYZ',
            value: 5000,
        }
    })

    await prisma.deal.create({
        data: {
            organizationId: org.id,
            pipelineId: pipeline.id,
            stageId: stageLeads,
            title: 'Consultoria Implementação - Inbound',
            value: 8000,
        }
    })

    console.log(`Seeding finished.`)
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
