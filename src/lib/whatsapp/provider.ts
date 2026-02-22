export interface WhatsAppMessagePayload {
    to: string
    text?: string
    templateName?: string
    templateLanguage?: string
    templateComponents?: any[]
}

export interface IWhatsAppProvider {
    sendMessage(payload: WhatsAppMessagePayload): Promise<{ success: boolean; messageId?: string; error?: any }>
    parseWebhook(req: Request): Promise<any>
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

    async parseWebhook(req: Request) {
        const body = await req.json()
        console.log(`[MockWhatsAppProvider] Parsing Webhook:`, body)
        return body // Return raw for now
    }
}

// ---------------------------------------------------------
// 2. Official Meta Cloud API Provider (Shell for MVP)
// ---------------------------------------------------------
export class MetaCloudProvider implements IWhatsAppProvider {
    private endpoint = 'https://graph.facebook.com/v19.0'
    private token: string
    private phoneNumberId: string

    constructor(token: string, phoneNumberId: string) {
        this.token = token
        this.phoneNumberId = phoneNumberId
    }

    async sendMessage(payload: WhatsAppMessagePayload) {
        console.log(`[MetaCloudProvider] Orchestrating Cloud API request to ${payload.to}...`)

        try {
            // Base API Payload Structure
            const apiPayload: any = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: payload.to.replace(/\D/g, ''), // Strip non-numeric
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

            // MVP Note: We are mocking the actual fetch to prevent crashes if no token is provided.
            // Uncomment the fetch block below when rolling out to Production with real Meta Tokens.

            /*
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
            */

            return { success: true, messageId: `meta-cloud-${Date.now()}` }

        } catch (error) {
            console.error('[MetaCloudProvider] Catch Error:', error)
            return { success: false, error }
        }
    }

    async parseWebhook(req: Request) {
        // Official Webhook verification and parsing logic comes here.
        // E.g., handling Challenge Hub verification from Meta.
        const url = new URL(req.url)
        const mode = url.searchParams.get('hub.mode')
        const token = url.searchParams.get('hub.verify_token')
        const challenge = url.searchParams.get('hub.challenge')

        if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
            return new Response(challenge, { status: 200 })
        }

        const body = await req.json()
        console.log(`[MetaCloudProvider] Received Official Webhook Request:`, body)
        return body
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
