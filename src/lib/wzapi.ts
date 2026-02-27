// src/lib/wzapi.ts
/**
 * Utilitário centralizado para comunicação com a API (WZAPI / Baileys).
 * Documentação Esperada: https://wzapi.com/docs (Exemplo)
 */

// Substitua pelas variáveis reais do seu painel de Agência/Global
const WZAPI_BASE_URL = process.env.WZAPI_BASE_URL || 'https://api.wzapi.com'
const WZAPI_GLOBAL_TOKEN = process.env.WZAPI_GLOBAL_TOKEN || ''

export interface WZInstanceConfig {
    instanceName: string;
    token?: string;
}

export interface WZMessagePayload {
    number: string;
    text: string;
}

/**
 * Cria uma nova Instância Isolada no Servidor WZAPI para a Empresa (Organization) Atual.
 */
export async function createInstance(instanceName: string) {
    try {
        const response = await fetch(`${WZAPI_BASE_URL}/instance/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${WZAPI_GLOBAL_TOKEN}`,
                // 'apikey': WZAPI_GLOBAL_TOKEN // Dependendo do padrão da WZAPI
            },
            body: JSON.stringify({
                instanceName,
                qrcode: true, // Auto-generate QR
                webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/wzapi` // Onde a WZAPI avisará o Next.js
            })
        })

        if (!response.ok) {
            const err = await response.text()
            console.error('Falha ao criar instância WZAPI:', err)
            return { success: false, error: err }
        }

        const data = await response.json()
        // data.hash / data.token costuma vir no payload criador
        return { success: true, data }

    } catch (error: any) {
        console.error('Erro de Rede WZAPI createInstance:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Retorna o Status/QRCode atual da Instância
 */
export async function getInstanceStatus(instanceName: string, instanceToken: string) {
    try {
        const response = await fetch(`${WZAPI_BASE_URL}/instance/connectionState/${instanceName}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${WZAPI_GLOBAL_TOKEN}`, // Ou Global, ou Instance Token
                'apikey': instanceToken
            }
        })

        if (!response.ok) return { success: false }

        const data = await response.json()
        return { success: true, data }
        // data.state = "open", "connecting", etc
        // data.qrcode = "base64..."

    } catch (error) {
        return { success: false }
    }
}

/**
 * Desconecta o Aparelho / Apaga Instância
 */
export async function logoutInstance(instanceName: string, instanceToken: string) {
    try {
        const response = await fetch(`${WZAPI_BASE_URL}/instance/logout/${instanceName}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${WZAPI_GLOBAL_TOKEN}`,
                'apikey': instanceToken
            }
        })
        return { success: response.ok }
    } catch (error) {
        return { success: false }
    }
}

/**
 * Envia uma mensagem em Texto Simples para um destino
 */
export async function sendTextMessage(instanceName: string, instanceToken: string, payload: WZMessagePayload) {
    try {
        // Adiciona o DDI padrão brasileiro se houver necessidade na doc WZAPI
        const formattedNumber = payload.number.includes('@s.whatsapp.net')
            ? payload.number
            : `55${payload.number.replace(/\D/g, '')}@s.whatsapp.net`;

        const response = await fetch(`${WZAPI_BASE_URL}/message/sendText/${instanceName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${WZAPI_GLOBAL_TOKEN}`,
                'apikey': instanceToken
            },
            body: JSON.stringify({
                number: formattedNumber,
                options: {
                    delay: 1500, // delay anti-ban
                    presence: 'composing' // "Digitando..."
                },
                textMessage: {
                    text: payload.text
                }
            })
        });

        if (!response.ok) {
            return { success: false, error: await response.text() }
        }

        const data = await response.json();
        return { success: true, data }

    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
