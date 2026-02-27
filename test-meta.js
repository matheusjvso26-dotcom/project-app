require('dotenv').config();

const token = process.env.META_ACCESS_TOKEN;
const phoneId = process.env.META_PHONE_NUMBER_ID;

const phone = '5521920220524';

const apiPayload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phone,
    type: "text",
    text: { body: "🤖 [TESTE DO SERVIDOR]: Olá Matheus! Esta é uma injeção de diagnóstico da arquitetura da API do FLY UP. Chegou aí?", preview_url: false }
}

console.log(`Sending to Meta API with Token: ${token?.substring(0, 10)}...`);

fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(apiPayload)
})
    .then(res => res.json())
    .then(data => {
        console.log("Response from Meta:");
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(err => {
        console.error("Error fetching", err);
    });
