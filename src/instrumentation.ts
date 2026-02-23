export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { campaignWorker } = await import('./lib/worker')
        console.log(`[FlowSaaS] BullMQ Worker Initialized: ${campaignWorker.id}`)
    }
}
