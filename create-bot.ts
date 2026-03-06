import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const initialNodes = [
    {
        id: 'start',
        type: 'input',
        data: { label: 'Início (Gatilho Webhook)' },
        position: { x: 500, y: 50 },
        style: { background: '#1c1c1c', color: '#ff7b00', border: '2px solid #ff7b00', borderRadius: '12px', fontWeight: 'bold', minWidth: '200px', textAlign: 'center' }
    },
    {
        id: 'msg-menu',
        data: { label: '🤖 Menu Inicial M2R\n\n"Hoje a M2R Cred trabalha com as seguintes modalidades de empréstimo:\n\n1️⃣ Aposentados\n2️⃣ Pensionistas\n3️⃣ Militares do Exército\n4️⃣ Servidores Públicos\n5️⃣ Antecipação do FGTS\n6️⃣ Crédito CLT\n\nEm qual dessas opções você se enquadra?"' },
        position: { x: 500, y: 150 },
        style: { background: '#1e3a8a', color: '#fff', border: '1px solid #3b82f650', borderRadius: '8px', minWidth: '350px', fontSize: '11px', padding: '10px' }
    },
    {
        id: 'f1-dados',
        data: { label: '📝 Coleta Aposentados\n\n"Perfeito! Para eu verificar as opções e simular pra você, me informe por favor:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Data de nascimento\n✅ Qual banco você recebe o benefício?"' },
        position: { x: 50, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'f2-dados',
        data: { label: '📝 Coleta Pensionistas\n\n"Perfeito! Para eu simular, me informe:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Data de nascimento\n✅ Banco que recebe o benefício"' },
        position: { x: 300, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'f3-dados',
        data: { label: '📝 Coleta Militares\n\n"Ótimo! Para eu verificar as condições pra você:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Data de nascimento\n✅ Posto/graduação\n✅ Banco onde recebe"' },
        position: { x: 550, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'f4-dados',
        data: { label: '📝 Coleta Servidor\n\n"Perfeito! Para eu simular corretamente, me informe:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Órgão/Prefeitura/Estado (qual é o vínculo?)\n✅ UF e cidade\n✅ Banco onde recebe"' },
        position: { x: 800, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'f5-dados',
        data: { label: '📝 Coleta FGTS\n\n"Perfeito! Para antecipação do FGTS, me informe por favor:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Você tem o app Meu FGTS instalado?"' },
        position: { x: 1050, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'f6-dados',
        data: { label: '📝 Coleta CLT\n\n"Ótimo! Para eu verificar a liberação do Crédito CLT, me informe:\n✅ Nome completo\n✅ CPF (somente números)\n✅ Empresa onde trabalha\n✅ Tempo de carteira assinada (aprox.)\n✅ Salário líquido (média)"' },
        position: { x: 1300, y: 350 },
        style: { background: '#2a2a2a', color: '#fff', border: '1px solid #ffffff20', borderRadius: '8px', minWidth: '200px', fontSize: '11px', padding: '8px' }
    },
    {
        id: 'act-humano',
        data: { label: '🧑‍💻 Handoff Humano\n\nAtribuir para a equipe para receber documentos e qualificar no CRM' },
        position: { x: 675, y: 560 },
        style: { background: '#450a0a', color: '#f87171', border: '1px solid #dc2626', borderRadius: '8px', minWidth: '250px', fontSize: '11px', padding: '10px' }
    }
]

const initialEdges = [
    { id: 'e-start-menu', source: 'start', target: 'msg-menu', animated: true, style: { stroke: '#ff7b00', strokeWidth: 2 } },
    { id: 'e-menu-f1', source: 'msg-menu', target: 'f1-dados', animated: true, label: 'Se Opção 1', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e-menu-f2', source: 'msg-menu', target: 'f2-dados', animated: true, label: 'Se Opção 2', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e-menu-f3', source: 'msg-menu', target: 'f3-dados', animated: true, label: 'Se Opção 3', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e-menu-f4', source: 'msg-menu', target: 'f4-dados', animated: true, label: 'Se Opção 4', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e-menu-f5', source: 'msg-menu', target: 'f5-dados', animated: true, label: 'Se Opção 5', style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e-menu-f6', source: 'msg-menu', target: 'f6-dados', animated: true, label: 'Se Opção 6', style: { stroke: '#10b981', strokeWidth: 2 } },

    // Todos desaguam no Humano apos coletar os dados
    { id: 'e-f1-act', source: 'f1-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } },
    { id: 'e-f2-act', source: 'f2-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } },
    { id: 'e-f3-act', source: 'f3-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } },
    { id: 'e-f4-act', source: 'f4-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } },
    { id: 'e-f5-act', source: 'f5-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } },
    { id: 'e-f6-act', source: 'f6-dados', target: 'act-humano', animated: true, style: { stroke: '#52525b', strokeWidth: 2 } }
]

async function main() {
    const org = await prisma.organization.findFirst()
    if (!org) {
        console.log("Nenhuma organizacao encontrada.")
        return
    }

    const jsonString = JSON.stringify({ nodes: initialNodes, edges: initialEdges })

    // Se já existir a automação, a gente deleta e recria pra garantir
    await prisma.automation.deleteMany({
        where: { name: "Assistente Consignado Oficial", organizationId: org.id }
    })

    await prisma.automation.create({
        data: {
            organizationId: org.id,
            name: "Assistente Consignado Oficial",
            triggerType: "INBOUND_MESSAGE",
            workflowJson: jsonString,
            isActive: true
        }
    })

    console.log("✅ Bot Consignado Oficial injetado com sucesso na base de dados para org: " + org.name)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
