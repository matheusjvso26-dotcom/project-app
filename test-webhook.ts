async function run() {
    const payload = {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "1983874599180925", // Simulando a org do Matheus
                "changes": [
                    {
                        "value": {
                            "metadata": {
                                "display_phone_number": "5511999999999",
                                "phone_number_id": "942164935654919"
                            },
                            "contacts": [
                                {
                                    "profile": { "name": "Lead Teste" },
                                    "wa_id": "5511999999999"
                                }
                            ],
                            "messages": [
                                {
                                    "from": "5511999999999",
                                    "id": "wamid.HBgL" + Date.now(),
                                    "timestamp": Math.floor(Date.now() / 1000).toString(),
                                    "type": "text",
                                    "text": { "body": "ola" }
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    };

    console.log("Enviando POST...");
    try {
        const res = await fetch('https://app.fire675.com/api/whatsapp/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Fetch falhou:", e);
    }
}

run();
