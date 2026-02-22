export interface WhatsAppMessagePayload {
    to: string
    text?: string
    templateName?: string
    templateLanguage?: string
    templateComponents?: any[]
}

export interface IWhatsAppProvider {
    sendMessage(payload: WhatsAppMessagePayload): Promise<{ success: boolean; messageId?: string; error?: any }>
    parseWebhook(req: Request, method?: string): Promise<any>
}

// ---------------------------------------------------------
// 1. Mock Provider for Development & Testing MVP
// ---------------------------------------------------------
export class MockWhatsAppProvider implements IWhatsAppProvider {
    async sendMessage(payload: WhatsAppMessagePayload) {
        console.log(`[MockWhatsAppProvider] Sending message to ${payload.to}:`, payload)

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800))

        return {
            success: true,
            messageId: `mock-msg-${Date.now()}`
        }
    }

    async parseWebhook(req: Request, method?: string) {
        if (method !== 'POST') return null
        const body = await req.json()
        console.log(`[MockWhatsAppProvider] Parsing Webhook:`, body)
        return body // Return raw for now
    }
}

// Helper function to format phone numbers correctly to the Meta Graph API.
// To ensure the Outbound message reaches the exact same thread that initiated the Inbound Webhook,
// we must mirror the EXACT digits (including the Brazilian 9th digit if Meta provided it).
function formatToWhatsAppJid(phone: string): string {
    return phone.replace(/\D/g, '')
}

export class MetaCloudProvider implements IWhatsAppProvider {
    private endpoint = 'https://graph.facebook.com/v19.0'
    private token: string
    private phoneNumberId: string

    constructor(token: string, phoneNumberId: string) {
        this.token = token
        this.phoneNumberId = phoneNumberId
    }

    async sendMessage(payload: WhatsAppMessagePayload) {
        const formattedPhone = formatToWhatsAppJid(payload.to)
        console.log(`[MetaCloudProvider] Orchestrating Cloud API request to ${formattedPhone} (Original: ${payload.to})...`)

        try {
            // Base API Payload Structure
            const apiPayload: any = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: formattedPhone,
            }

            if (payload.templateName) {
                apiPayload.type = "template"
                apiPayload.template = {
                    name: payload.templateName,
                    language: { code: payload.templateLanguage || "pt_BR" },
                    components: payload.templateComponents || []
                }
            } else if (payload.text) {
                apiPayload.type = "text"
                apiPayload.text = { body: payload.text, preview_url: false }
            } else {
                throw new Error("Message must have either text or templateName")
            }

            const response = await fetch(`${this.endpoint}/${this.phoneNumberId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiPayload)
            })

            const data = await response.json()

            if (!response.ok) {
                console.error('[MetaCloudProvider] Error:', data)
                return { success: false, error: data }
            }

            return { success: true, messageId: data.messages?.[0]?.id }

        } catch (error) {
            console.error('[MetaCloudProvider] Catch Error:', error)
            return { success: false, error }
        }
    }

    async parseWebhook(req: Request) {
        // Official Webhook verification and parsing logic comes here.
        // E.g., handling Challenge Hub verification from Meta.
        // Handles relative and absolute urls properly to extract search parameters
        const urlStr = req.url || ''
        const searchParams = urlStr.includes('?')
            ? new URLSearchParams(urlStr.substring(urlStr.indexOf('?')))
            : new URL(urlStr, 'https://dummy.com').searchParams

        const mode = searchParams.get('hub.mode')
        const token = searchParams.get('hub.verify_token')
        const challenge = searchParams.get('hub.challenge')

        console.log(`[MetaCloudProvider] Handshake Request Params: mode=${mode} token="${token}" challenge=${challenge}`)
        console.log(`[MetaCloudProvider] Server ENV Token: "${process.env.META_WEBHOOK_VERIFY_TOKEN}"`)

        if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
            // A Meta exige OBRIGATORIAMENTE que o challenge seja retornado cru, sem aspas JSON
            return challenge
        }

        // Only parse body for POST (Message/Event Receiving)
        if (req.method === 'POST') {
            try {
                const body = await req.json()
                console.log(`[MetaCloudProvider] Received Official Webhook Request:`, body)
                return body
            } catch (e) {
                console.error("[MetaCloudProvider] Failed to parse JSON body:", e)
                return null
            }
        }

        return null
    }
}

// ---------------------------------------------------------
// Factory / Dependency Injection Strategy
// ---------------------------------------------------------
export const getWhatsAppProvider = (): IWhatsAppProvider => {
    // Define if we should use Mock or Real based on Environment variables
    const useMock = process.env.USE_MOCK_WHATSAPP === 'true'

    if (useMock || !process.env.META_ACCESS_TOKEN || !process.env.META_PHONE_NUMBER_ID) {
        console.warn("⚠️ Using MockWhatsAppProvider. Set Meta Env Vars to use real API.")
        return new MockWhatsAppProvider()
    }

    return new MetaCloudProvider(
        process.env.META_ACCESS_TOKEN,
        process.env.META_PHONE_NUMBER_ID
    )
}
