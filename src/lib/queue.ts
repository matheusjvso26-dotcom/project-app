import { Queue } from 'bullmq'
import Redis from 'ioredis'

// Redis Connection
const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
})

redisConnection.on('error', (err) => {
    console.error('[Queue Redis] Connection Error:', err.message)
})

// Tipagem do Payload da Fila
export interface CampaignJobData {
    phone: string
    name: string
    templateText: string
    organizationId: string
    userId: string
}

// Inicializa Fila
export const campaignQueue = new Queue<CampaignJobData>('whatsapp-campaigns', {
    connection: redisConnection
})

campaignQueue.on('error', (err) => {
    console.error('[Queue] Error:', err.message)
})
