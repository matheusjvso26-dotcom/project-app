import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const email = 'matheusjvso4@gmail.com';

    const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: true }
    });

    if (!user) {
        console.log(`Usuário não encontrado: ${email}`);
        process.exit(1);
    }

    // Define a role do usuário como OWNER ou ADMIN master (caso sua model preveja isso futuramente,
    // mas o principal para logar é que a ORGANIZATION esteja ACTIVE!)

    console.log(`Organização atual do usuário: ${user.organization.name} - Status: ${user.organization.status}`);

    await prisma.organization.update({
        where: { id: user.organizationId },
        data: {
            status: 'ACTIVE',
            trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias a partir de agora
        }
    });

    console.log('✅ Organização ativada com sucesso!');
    console.log('Você já pode fazer o login em app.fire675.com/login');
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
