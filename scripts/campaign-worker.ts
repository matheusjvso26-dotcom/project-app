import { Worker, Job } from 'bullmq'
import Redis from 'ioredis'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Resolve dirname para ESM Module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Puxa as variáveis ambientais como se estivéssemos na VPS/Local
config({ path: path.resolve(__dirname, '../.env') })

const prisma = new PrismaClient()

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false, // Ajuda a não travar se n bater
    retryStrategy(times) {
        if (times > 3) {
            console.warn("⚠️ [Redis] Servidor não encontrado. Encerrando tentativas no ambiente local.")
            return null // Pára de tentar
        }
        return Math.min(times * 100, 3000)
    }
})

redisConnection.on('error', (err) => {
    // Apenas silencia no console para não floodar de errors locais
    if ((err as any).code !== 'ECONNREFUSED') {
        console.error('[Queue Redis] Ocorreu erro interno:', err.message)
    }
})

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN
const META_PHONE_ID = process.env.META_PHONE_NUMBER_ID

if (!META_ACCESS_TOKEN || !META_PHONE_ID) {
    console.warn("⚠️ [Worker] Variáveis da Meta não encontradas no .env!")
}

interface CampaignJobData {
    phone: string
    name: string
    templateText: string
    organizationId: string
    userId: string
}

// Uma Soneca para evitar tomar Bloqueio da Meta (Rate Limit 20 msgs/s por WABA em Tier 1)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function processJob(job: Job<CampaignJobData>) {
    const { phone, name, templateText, organizationId, userId } = job.data

    try {
        // 1. Troca a variável de personalização no texto (Se houver "{{nome}}")
        let finalMessage = templateText.replace(/{{nome}}/gi, name.split(' ')[0])

        // 2. Tenta encontrar a conversa existente ou criar o Lead no Prisma 
        // para guardar nos Arquivos da Caixa de Entrada
        let lead = await prisma.lead.findFirst({
            where: { phone, organizationId }
        })

        if (!lead) {
            lead = await prisma.lead.create({
                data: { phone, name, organizationId }
            })
        }

        let conversation = await prisma.conversation.findFirst({
            where: { leadId: lead.id, organizationId }
        })

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: { leadId: lead.id, organizationId }
            })
        }

        // 3. Efetuar o disparo Hardcore pela Meta Cloud API
        if (META_ACCESS_TOKEN && META_PHONE_ID) {
            const url = `https://graph.facebook.com/v22.0/${META_PHONE_ID}/messages`
            const body = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: phone,
                type: 'text',
                text: { preview_url: false, body: finalMessage }
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error?.message || "Erro Genérico Meta")
            }

            // 4. Salvar histórico pra tela Inbox p/ o Agente
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId: userId || null, // Garante undefined bypass no schema optional
                    type: 'TEXT',
                    direction: 'OUTBOUND',
                    content: finalMessage,
                    status: 'SENT'
                }
            })

            // Ajusta o "updatedAt" da conversa pra subí-la na lista do Inbox
            await prisma.conversation.update({
                where: { id: conversation.id },
                data: { updatedAt: new Date() }
            })

            // Dorme 65ms p/ garantir ~15 disparos por segundo no máximo (Bem seguro)
            await sleep(65)
        }

        console.log(`✅ [Campanha Massiva] Msg entregue para: ${name} (${phone})`)

    } catch (error: any) {
        console.error(`❌ [Campanha Massiva] Erro para ${name} (${phone}):`, error.message)
        throw error // Joga pro BullMQ lidar como 'Failed Job' automatizado
    }
}

// Seta o Worker "Orelha" p/ processar itens enfileirados 1 a 1 de forma segura e paralela
const worker = new Worker<CampaignJobData>('whatsapp-campaigns', processJob, {
    connection: redisConnection,
    concurrency: 1 // Concorrência de 1 p/ não fuzilar a Meta rate-limits simultaneamente 
})

worker.on('ready', () => {
    console.log("🚀 [Worker] Iniciado! Escutando a fila 'whatsapp-campaigns' do Redis...")
})

worker.on('failed', (job, err) => {
    console.error(`❌ [Worker] Falha final no Job #${job?.id}:`, err.message)
})
