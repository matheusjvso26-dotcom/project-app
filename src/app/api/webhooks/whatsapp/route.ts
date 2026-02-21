import { NextResponse } from 'next/server'

// The token you will configure in the Meta App Dashboard
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'flow_saas_secure_token'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    // Verify the webhook subscription
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED')
        return new NextResponse(challenge, { status: 200 })
    }

    return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Log the incoming webhook payload for debugging
        console.log('Incoming WhatsApp Webhook:', JSON.stringify(body, null, 2))

        // Basic structural validation for Meta WhatsApp Cloud API webhooks
        if (body.object === 'whatsapp_business_account') {
            for (const entry of body.entry) {
                for (const change of entry.changes) {
                    // Check if it is a message payload
                    if (change.value && change.value.messages) {
                        const message = change.value.messages[0]
                        const contact = change.value.contacts[0]
                        const phoneNumberId = change.value.metadata.phone_number_id

                        console.log(`Received message from ${contact.profile.name} (${message.from}): ${message.text?.body}`)

                        // TODO: 
                        // 1. Identify if the lead exists by phone number
                        // 2. Either Create Lead or Get Lead
                        // 3. Save Message to Database
                        // 4. Trigger Automations / Bot Handoff Event
                    }

                    // Check if it is a status payload (delivered, read)
                    if (change.value && change.value.statuses) {
                        const status = change.value.statuses[0]
                        console.log(`Message ${status.id} is now ${status.status}`)

                        // TODO: Update Message status in DB
                    }
                }
            }
        }

        // Must always return a 200 OK fast to Meta, otherwise they retry and eventually block the webhook
        return new NextResponse('EVENT_RECEIVED', { status: 200 })
    } catch (error) {
        console.error('Error processing webhook:', error)
        return new NextResponse('INTERNAL_SERVER_ERROR', { status: 500 })
    }
}
