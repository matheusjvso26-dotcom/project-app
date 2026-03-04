import { getWhatsAppProvider } from "./provider"
import prisma from "@/lib/prisma"

// --- TEXTOS CONSTANTES DO FUNIL M2R CRED ---

const M2R_00_BOAS_VINDAS = `🤖 Atendente Virtual — M2R Cred
Olá! Vou te ajudar com sua simulação 😊

Trabalhamos com diversas modalidades.
📌 Para começarmos, em qual opção você se enquadra?`

const M2R_01_AJUDA = `Sem problema 😊 
Me diga qual destas opções se parece mais com o seu perfil atual:`

const M2R_02_TIPO = `Perfeito! Agora me diga o tipo de serviço que você deseja:`

const M2R_02_TIPO_FGTS = `Agora me diga o serviço exato que você deseja:`

const M2R_03_MARGEM = `Ótimo ✅ Você já possui uma margem disponível e pré-aprovada? Ou ainda não sabe o valor?`

const M2R_04_DOCUMENTOS = `Para dar andamento, me envie por favor:

Nome completo:
CPF (somente números):

Documento:
📸 RG (frente e verso) + CPF OU CNH (frente e verso)

✅ Envie fotos nítidas, com boa iluminação.

🔒 Segurança (LGPD): seus dados serão usados apenas para simulação e atendimento.
⚠️ Nunca solicitamos senhas (Gov.br, Meu INSS, banco).`

const M2R_05A_INSS = `Perfeito ✅
Agora só me confirme:

Número do Benefício (NB) (se tiver):
Banco onde recebe o benefício:
Você já tem consignado ativo? (SIM/NÃO):
Qual valor você deseja liberar? (ou "melhor proposta"):

📎 Opcional (acelera): extrato de consignados / HISCON ou extrato de pagamento.`

const M2R_05B_MILITAR = `Show ✅
Confirma pra mim:

Você é ATIVO / INATIVO / PENSIONISTA?
Banco onde recebe:
Possui consignado ativo? (SIM/NÃO):
Valor desejado: (ou "melhor proposta"):

📎 Opcional: contracheque/holerite mais recente.`

const M2R_05C_SERVIDOR = `Perfeito ✅
Me informe:

Órgão / Prefeitura / Estado:
UF:
Vínculo: ATIVO / APOSENTADO / PENSIONISTA:
Banco onde recebe:
Possui consignado ativo? (SIM/NÃO):
Valor desejado: (ou "melhor proposta"):

📎 Opcional: contracheque atualizado.`

const M2R_05D_FGTS = `Certo ✅ Só confirmar:

Você está no Saque-Aniversário? (SIM/NÃO/NÃO SEI):
Mês de nascimento:
Saldo aproximado do FGTS: (ou "não sei"):
Quer antecipar quantos anos? (ex.: 3, 5, "melhor oferta"):

📎 Opcional: print do saldo do FGTS (sem dados sensíveis).`

const M2R_05E_CLT = `Perfeito ✅
Me diga:

Empresa onde trabalha:
Tempo de carteira assinada:
Salário líquido aproximado:
Possui restrição no CPF? (SIM/NÃO/NÃO SEI):
Valor desejado: (ou "melhor proposta"):

📎 Opcional: holerite + comprovante de residência.`

// MENUS INTERATIVOS M2R CRED
const M2R_00_OPTIONS = {
    type: 'list',
    body: M2R_00_BOAS_VINDAS,
    buttonText: "Ver Modalidades",
    options: [
        { id: "1", title: "Aposentados (INSS)" },
        { id: "2", title: "Pensionistas (INSS)" },
        { id: "3", title: "Militares Exército" },
        { id: "4", title: "Servidores Públicos" },
        { id: "5", title: "Antecipação FGTS" },
        { id: "6", title: "Crédito CLT" },
        { id: "7", title: "Me ajude a escolher" },
        { id: "0", title: "Falar com atendente" }
    ]
}

const M2R_01_OPTIONS = {
    type: 'list',
    body: M2R_01_AJUDA,
    buttonText: "Opções",
    options: [
        { id: "ajuda_a", title: "Recebo INSS" },
        { id: "ajuda_b", title: "Militar do Exército" },
        { id: "ajuda_c", title: "Servidor Público" },
        { id: "ajuda_d", title: "Antecipar FGTS" },
        { id: "ajuda_e", title: "Carteira (CLT)" }
    ]
}

const M2R_02_OPTIONS = {
    type: 'list',
    body: M2R_02_TIPO,
    buttonText: "Serviços",
    options: [
        { id: "novo", title: "Novo empréstimo" },
        { id: "portabilidade", title: "Portabilidade" },
        { id: "refinanciamento", title: "Refinanciamento" },
        { id: "duvidas", title: "Tirar dúvidas" }
    ]
}

const M2R_02_FGTS_OPTIONS = {
    type: 'button',
    body: M2R_02_TIPO_FGTS,
    options: [
        { id: "simular_fgts", title: "Simular FGTS" },
        { id: "comparar", title: "Comparar proposta" },
        { id: "duvidas_fgts", title: "Tirar dúvidas" }
    ]
}

const M2R_03_OPTIONS = {
    type: 'button',
    body: M2R_03_MARGEM,
    options: [
        { id: "nao_sei", title: "NÃO SEI" }
    ]
}

// EXCEÇÕES
const EXC_01_MARGEM = `Sem problema 😊
Me diga seu objetivo:`

const EXC_01_OPTIONS = {
    type: 'button',
    body: EXC_01_MARGEM,
    options: [
        { id: "obj_a", title: "Menor parcela" },
        { id: "obj_b", title: "Maior valor liberado" },
        { id: "obj_c", title: "Melhor proposta" }
    ]
}

const EXC_02_DOCS = `Tranquilo 😊 Posso fazer uma pré-simulação.
Me diga só:

Valor que você quer liberar:
Você tem margem? (valor ou "não sei")

Quando puder, você envia RG+CPF ou CNH para concluir.`

const EXC_03_INVALIDO = `Só para eu seguir certinho ✅

Modalidade: responda 1 a 6
Tipo de serviço: A/B/C/D
Se preferir: digite 0 para atendente.`

const EXC_04_HUMANO = `Certo ✅ Vou te direcionar para um atendente agora.
Para agilizar, envie nome + CPF (se ainda não enviou).`

const FECHAMENTO = `Perfeito ✅ Já tenho as informações necessárias.
Vou encaminhar sua simulação e te retorno com as melhores condições.`

type ProcessBotArgs = {
    conversationId: string;
    leadPhone: string;
    incomingText: string;
    incomingType: string; // 'text', 'document', 'image', etc.
    isNewLead: boolean;
}

export async function processBotFlow({ conversationId, leadPhone, incomingText, incomingType, isNewLead }: ProcessBotArgs) {
    const provider = getWhatsAppProvider()
    let responseText = ""
    let interactiveOptions: any = undefined // Opções dinâmicas de Botões ou Listas

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { organizationId: true }
    })

    if (conversation) {
        const automation = await prisma.automation.findFirst({
            where: { organizationId: conversation.organizationId, isActive: true },
            orderBy: { updatedAt: 'desc' }
        })

        const forceNativeEngine = true; // [MOD M2R] Bypass the Visual Engine

        if (!forceNativeEngine && automation && automation.workflowJson && automation.workflowJson.length > 5) {
            try {
                const flow = JSON.parse(automation.workflowJson)
                const nodes: any[] = flow.nodes || []
                const edges: any[] = flow.edges || []

                // FUNÇÃO DE COMPARAÇÃO DE TEXTO TOLERANTE
                // Precisamos ser imunes a caracteres invisiveis, emojis perdidos ou quebras de linha ("\n" virando " " ou vice-versa)
                const normalizeForCompare = (str: string) => str ? str.replace(/\s+/g, ' ').trim().toLowerCase() : ""

                const getCleanText = (label: string) => {
                    if (!label) return ""
                    const parts = label.split('\n\n')
                    let text = parts.length > 1 ? parts.slice(1).join('\n\n') : label
                    // Remove aspas que usamos para design no canvas
                    if (text.startsWith('"') && text.endsWith('"')) {
                        text = text.slice(1, -1)
                    }
                    return text.trim()
                }

                // INTERPRETADOR NATIVO REACT FLOW
                if (nodes.length > 1) { // Tem mais que o Start apenas
                    const userT = incomingText.trim().toLowerCase()
                    const isGreeting = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'boa madruga', 'menu', 'start', 'voltar'].includes(userT)

                    let nodeToSend: any = null

                    if (isNewLead || isGreeting) {
                        const startNode = nodes.find(n => n.id === 'start')
                        if (startNode) {
                            const edge = edges.find(e => e.source === startNode.id)
                            if (edge) {
                                nodeToSend = nodes.find(n => n.id === edge.target)
                            }
                        }
                    } else {
                        const lastBotMessage = await prisma.message.findFirst({
                            where: { conversationId, direction: 'OUTBOUND', senderId: null },
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        })

                        if (lastBotMessage && lastBotMessage.content) {
                            // Encontrar de qual nó saiu a última mensagem usando Normalize Tolerance (ignorando spaces)
                            // Além disso, mensagens interativas não salvam o texto cru do menu com pontuações.
                            // Mas para o lastBotMessage, como o próprio bot enviou as quebras ou enviaria, usamos o backup content com regex
                            const targetNorm = normalizeForCompare(lastBotMessage.content)

                            const currentNode = nodes.find(n => {
                                const originalNodeText = getCleanText(n.data?.label)
                                const nodeNorm = normalizeForCompare(originalNodeText)

                                // Para interceptar menus interativos, checamos também se a primeira frase do nó bate com o db
                                const firstLineNode = normalizeForCompare(originalNodeText.split('\n')[0])
                                const firstLineDb = normalizeForCompare(lastBotMessage.content!.split('\n')[0])

                                return nodeNorm === targetNorm ||
                                    (nodeNorm.length > 10 && targetNorm.includes(nodeNorm)) ||
                                    (firstLineNode.length > 5 && firstLineNode === firstLineDb)
                            })

                            if (currentNode) {
                                const outgoingEdges = edges.filter(e => e.source === currentNode.id)

                                if (outgoingEdges.length > 0) {
                                    let nextEdge = outgoingEdges[0]

                                    // IMPLEMENTAÇÃO DE MENUS / MULTI-BRANCHING
                                    if (outgoingEdges.length > 1) {
                                        const userInput = incomingText.trim().toLowerCase()

                                        const matchedEdge = outgoingEdges.find(e => {
                                            if (!e.label) return false
                                            const labelParts = e.label.toLowerCase().trim().split(' ')
                                            const edgeDigit = e.label.replace(/\D/g, '')
                                            return labelParts.some((part: string) => part === userInput) ||
                                                (edgeDigit && userInput === edgeDigit)
                                        })

                                        if (matchedEdge) nextEdge = matchedEdge
                                    }

                                    nodeToSend = nodes.find(n => n.id === nextEdge.target)
                                }
                            } else {
                                console.log(`[Flow Debug] Não consegui encontrar o Node de origem para comparar com "${lastBotMessage.content}". Normalize foi: "${targetNorm}"`)
                                responseText = "Desculpe, o fluxo de automação deste atendimento foi descontinuado ou repensado. Posso ajudar em algo mais?"
                            }
                        }
                    }

                    // Se resolvemos qual o nó que deve ser enviado:

                    if (nodeToSend && nodeToSend.data?.label) {
                        let textCandidate = getCleanText(nodeToSend.data.label)

                        // MOCK: Para testarmos o nó de ÁUDIO e ACTIONS
                        if (nodeToSend.id.startsWith('audio-')) {
                            responseText = `*(Simulação de Áudio)* 🎙️: [Reproduzindo ${textCandidate.replace(/\n.*/g, '')}...]`
                        } else if (nodeToSend.id.startsWith('act-')) {
                            responseText = `*(Sistema)* Ação disparada! ${textCandidate}`
                        } else if (nodeToSend.id.startsWith('msg-joke')) {
                            responseText = textCandidate // Rota da piada
                        } else {
                            // É NÓ DE TEXTO. VAMOS TENTAR EXTRAIR BOTÕES INTERATIVOS
                            const outgoingForMenu = edges.filter(e => e.source === nodeToSend.id)

                            if (outgoingForMenu.length > 1) { // Tem ramificações? É menu.
                                const extractedOptions: { id: string, title: string, description?: string }[] = []
                                const lines = textCandidate.split('\n')
                                const cleanLines: string[] = []

                                for (const line of lines) {
                                    const match = line.match(/^(\d+)(?:\s|[-.)\]\uFE0F\u20E3])+(.+)$/i)
                                    if (match) {
                                        // Achou uma opção (ex: "1 - Aposentados")
                                        extractedOptions.push({
                                            id: match[1],
                                            title: match[2].trim().substring(0, 24)
                                        })
                                    } else {
                                        cleanLines.push(line)
                                    }
                                }

                                if (extractedOptions.length > 0) {
                                    // Removemos as opções do texto do balão
                                    textCandidate = cleanLines.join('\n').trim() || "Escolha uma opção:"

                                    interactiveOptions = {
                                        type: extractedOptions.length <= 3 ? 'button' : 'list',
                                        body: textCandidate,
                                        buttonText: extractedOptions.length <= 3 ? undefined : "Abrir Menu",
                                        options: extractedOptions
                                    }
                                }
                            }

                            responseText = textCandidate
                        }
                    }

                    // Disparo Final da Mensagem Visual Flow
                    if (responseText) {
                        const payloadToSend: any = { to: leadPhone, text: responseText }
                        if (interactiveOptions) {
                            payloadToSend.interactiveOptions = interactiveOptions
                            // No banco salvamos o texto original para fins de state tracking e inteligência
                            if (nodeToSend) responseText = getCleanText(nodeToSend.data.label)
                        }

                        const res = await provider.sendMessage(payloadToSend)

                        await prisma.message.create({
                            data: {
                                conversationId, direction: "OUTBOUND", type: "TEXT", content: responseText,
                                status: res.success ? "DELIVERED" : "FAILED", senderId: null, providerId: res.messageId || null
                            }
                        })
                        await prisma.conversation.update({
                            where: { id: conversationId }, data: { updatedAt: new Date(), status: 'BOT_HANDLING' }
                        })
                        return // Encerra o processo aqui com sucesso
                    } else {
                        // Não tinha próxima aresta (Fim do funil)
                        return
                    }
                }
            } catch (err) {
                console.error("[BotEngine] Fallback Ativado - Erro lendo Grafo visual:", err)
            }
        }
    }

    // --- NOVO MOTOR NATIVO M2R CRED ---
    if (isNewLead) {
        responseText = M2R_00_BOAS_VINDAS; interactiveOptions = M2R_00_OPTIONS;
    } else {
        // Encontrar a ÚLTIMA mensagem enviada PELO BOT (senderId === null && direction === OUTBOUND)
        const lastBotMessage = await prisma.message.findFirst({
            where: {
                conversationId,
                direction: 'OUTBOUND',
                senderId: null
            },
            orderBy: { createdAt: 'desc' }
        })

        const userT = incomingText.trim().toLowerCase()
        const isMedia = incomingType === 'document' || incomingType === 'image' || incomingType === 'audio' || incomingType === 'video'

        if (!lastBotMessage) {
            // Se não tem mensagem anterior do bot mas o lead digitou saudação
            const greetings = ['oi', 'olá', 'ola', 'oie', 'bom dia', 'boa tarde', 'boa noite', 'menu', 'start', 'iniciar'];
            if (greetings.some(g => userT.includes(g)) || userT === 'i') {
                responseText = M2R_00_BOAS_VINDAS; interactiveOptions = M2R_00_OPTIONS;
            } else {
                return
            }
        } else {
            const botContext = lastBotMessage.content || ""

            const greetings = ['oi', 'olá', 'ola', 'oie', 'bom dia', 'boa tarde', 'boa noite', 'menu', 'start', 'iniciar'];
            // SE O USUÁRIO FORÇAR UMA SAUDAÇÃO, REINICIA A CONVERSA
            if (greetings.some(g => userT.includes(g)) || userT === 'i') {
                responseText = M2R_00_BOAS_VINDAS; interactiveOptions = M2R_00_OPTIONS;
            }
            // ATALHO UNIVERSAL PARA FALAR COM ATENDENTE (0)
            else if (userT === '0' || userT === '0️⃣' || userT.includes('atendente') || userT.includes('falar com humano')) {
                responseText = EXC_04_HUMANO
            }
            // ----------------------------------------------------
            // STATE MACHINE M2R CRED
            // ----------------------------------------------------

            // 00 BOAS VINDAS -> 02 TIPO (ou 01 AJUDA)
            else if (botContext.includes("qual opção você se enquadra?")) {
                if (userT.includes('1') || userT.includes('aposentado') || userT.includes('2') || userT.includes('pensionista') || userT.includes('3') || userT.includes('militar') || userT.includes('4') || userT.includes('servidor') || userT.includes('6') || userT.includes('clt') || userT.includes('carteira')) {
                    responseText = M2R_02_TIPO; interactiveOptions = M2R_02_OPTIONS;
                }
                else if (userT.includes('5') || userT.includes('fgts')) {
                    responseText = M2R_02_TIPO_FGTS; interactiveOptions = M2R_02_FGTS_OPTIONS;
                }
                else if (userT.includes('7') || userT.includes('ajude') || userT.includes('sei')) {
                    responseText = M2R_01_AJUDA; interactiveOptions = M2R_01_OPTIONS;
                }
                else responseText = EXC_03_INVALIDO
            }

            // 01 AJUDA -> 02 TIPO
            else if (botContext.includes("Me diga qual destas opções se parece mais com o seu perfil atual:")) {
                if (userT === 'ajuda_a' || userT === 'a' || userT.includes('inss') || userT.includes('aposentado') || userT === 'ajuda_b' || userT === 'b' || userT.includes('militar') || userT === 'ajuda_c' || userT === 'c' || userT.includes('servidor') || userT === 'ajuda_e' || userT === 'e' || userT.includes('clt') || userT.includes('carteira')) {
                    responseText = M2R_02_TIPO; interactiveOptions = M2R_02_OPTIONS;
                }
                else if (userT === 'ajuda_d' || userT === 'd' || userT.includes('fgts')) {
                    responseText = M2R_02_TIPO_FGTS; interactiveOptions = M2R_02_FGTS_OPTIONS;
                }
                else responseText = "Por favor, responda com A, B, C, D ou E."
            }

            // 02 TIPO SERVICO -> 03 MARGEM ou EXC_04_HUMANO
            else if (botContext.includes("Agora me diga o tipo de serviço que você deseja")) {
                if (userT.includes('duvidas') || userT === 'd') {
                    responseText = EXC_04_HUMANO;
                } else {
                    responseText = M2R_03_MARGEM; interactiveOptions = M2R_03_OPTIONS;
                }
            }

            // 02 TIPO_FGTS -> 04 DOCUMENTOS (PULA MARGEM)
            else if (botContext.includes("Agora me diga o serviço exato que você deseja")) {
                if (userT.includes('duvidas')) {
                    responseText = EXC_04_HUMANO;
                } else {
                    responseText = M2R_04_DOCUMENTOS;
                }
            }

            // 03 MARGEM -> 04 DOCUMENTOS (ou EXC_01_MARGEM)
            else if (botContext.includes("Você já possui uma margem disponível e pré-aprovada")) {
                if (userT.includes("não sei") || userT.includes("nao sei") || userT === 'nao' || userT === 'não' || userT === 'nao_sei') {
                    responseText = EXC_01_MARGEM; interactiveOptions = EXC_01_OPTIONS;
                } else {
                    responseText = M2R_04_DOCUMENTOS
                }
            }

            // EXC_01_MARGEM -> 04 DOCUMENTOS
            else if (botContext.includes("Me diga seu objetivo:")) {
                responseText = M2R_04_DOCUMENTOS
            }

            // 04 DOCUMENTOS -> 05 RAMIFICAÇÕES
            else if (botContext.includes("Para dar andamento, me envie por favor:") || botContext.includes("Quando puder, você envia RG+CPF")) {

                // Cliente deu uma desculpa para não mandar doc agora
                if (!isMedia && (userT.includes("não quero") || userT.includes("depois") || userT.includes("agora não") || userT.includes("agora nao"))) {
                    responseText = EXC_02_DOCS
                } else {
                    // Cliente enviou os dados ou fotos. Vamos descobrir a modalidade lendo o histórico recente.
                    const history = await prisma.message.findMany({
                        where: { conversationId },
                        orderBy: { createdAt: 'desc' },
                        take: 15
                    })

                    let detectedModality = 'INSS' // Fallback padrão
                    for (const msg of history) {
                        if (msg.direction === 'INBOUND' && msg.type === 'TEXT' && msg.content) {
                            const c = msg.content.toLowerCase().trim()
                            if (c === '1' || c === 'ajuda_a' || c === 'a' || c.includes('aposentado') || c === '2' || c.includes('pensionista')) { detectedModality = 'INSS'; break; }
                            if (c === '3' || c === 'ajuda_b' || c === 'b' || c.includes('militar')) { detectedModality = 'MILITAR'; break; }
                            if (c === '4' || c === 'ajuda_c' || c === 'c' || c.includes('servidor')) { detectedModality = 'SERVIDOR'; break; }
                            if (c === '5' || c === 'ajuda_d' || c === 'd' || c.includes('fgts') || c === 'simular_fgts' || c === 'comparar') { detectedModality = 'FGTS'; break; }
                            if (c === '6' || c === 'ajuda_e' || c === 'e' || c.includes('clt') || c.includes('carteira')) { detectedModality = 'CLT'; break; }
                        }
                    }

                    if (detectedModality === 'INSS') responseText = M2R_05A_INSS
                    else if (detectedModality === 'MILITAR') responseText = M2R_05B_MILITAR
                    else if (detectedModality === 'SERVIDOR') responseText = M2R_05C_SERVIDOR
                    else if (detectedModality === 'FGTS') responseText = M2R_05D_FGTS
                    else if (detectedModality === 'CLT') responseText = M2R_05E_CLT
                }
            }

            // EXC_02_DOCS (Pré Simulação) -> FECHAMENTO
            else if (botContext.includes("Tranquilo 😊 Posso fazer uma pré-simulação.")) {
                responseText = FECHAMENTO
            }

            // 05 ETAPAS FINAIS -> FECHAMENTO
            else if (
                botContext.includes("Número do Benefício (NB)") ||
                botContext.includes("Você é ATIVO / INATIVO / PENSIONISTA?") ||
                botContext.includes("Órgão / Prefeitura / Estado:") ||
                botContext.includes("Você está no Saque-Aniversário?") ||
                botContext.includes("Empresa onde trabalha:")
            ) {
                responseText = FECHAMENTO
            }
            else {
                // Se não caiu em nenhuma ramificação
                console.warn(`[BotEngine M2R] FALHA NO MATCH DE CONTEXTO! 
                    - Mensagem do Lead: "${userT}"
                    - Contexto lido do banco (Resumo 100 chars): "${botContext.substring(0, 100)}"
                    - Condições testadas e falharam para avançar.`);
                return
            }
        }
    }

    if (responseText !== "") {
        console.log(`[BotEngine] Respondendo para ${leadPhone} -> ${responseText.substring(0, 30)}...`)

        // 1. Disparar o Request HTTP para a Meta/Cloud API
        const payloadToSend: any = {
            to: leadPhone,
            text: responseText
        }
        if (interactiveOptions) {
            payloadToSend.interactiveOptions = interactiveOptions
        }

        const res = await provider.sendMessage(payloadToSend)

        // 2. Salvar no Banco
        await prisma.message.create({
            data: {
                conversationId,
                direction: "OUTBOUND",
                type: "TEXT",
                content: responseText,
                status: res.success ? "DELIVERED" : "FAILED",
                senderId: null, // O bot
                providerId: res.messageId || null
            }
        })

        // Atualizar status da conversa
        await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                updatedAt: new Date(),
                status: 'BOT_HANDLING'
            }
        })
    }
}
