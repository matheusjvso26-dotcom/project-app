/**
 * Utilitário centralizado para comunicação com a API Oficial da Meta Cloud
 * (Zendesk-like Integration Model)
 */

export interface MetaMessagePayload {
    number: string;
    text: string;
}

/**
 * Envia uma mensagem em Texto Simples pela API REST da Meta (v20.0)
 * Requisito: O `phoneNumberId` e `accessToken` pertencem ao cliente do SaaS (Embedded Oauth).
 */
export async function sendMetaTextMessage(
    phoneNumberId: string,
    accessToken: string,
    payload: MetaMessagePayload
) {
    const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

    // Meta Cloud exige DDI sem '+' e sem caracteres especiais (Ex: 5511999999999)
    const recipient = payload.number.replace(/\D/g, '');

    const body = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "text",
        text: {
            preview_url: false,
            body: payload.text
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Meta API Error:', data);
            return { success: false, error: data.error?.message || 'Falha Desconhecida da Meta' };
        }

        return { success: true, data };
    } catch (err: any) {
        console.error('Network Error Dispatching Meta Msg:', err);
        return { success: false, error: err.message };
    }
}
