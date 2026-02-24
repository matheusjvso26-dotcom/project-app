import { getWhatsAppProvider } from "./provider"
import prisma from "@/lib/prisma"

// --- TEXTOS CONSTANTES DO FUNIL ---

export const MENU_TEXT = `Hoje a M2R Cred trabalha com as seguintes modalidades de empréstimo:

1️⃣ Aposentados
2️⃣ Pensionistas
3️⃣ Militares do Exército
4️⃣ Servidores Públicos
5️⃣ Antecipação do FGTS
6️⃣ Crédito CLT

Em qual dessas opções você se enquadra?`

// FLUXO 1
const F1_M2 = `Perfeito! Para eu verificar as opções e simular pra você, me informe por favor:
✅ Nome completo
✅ CPF (somente números)
✅ Data de nascimento
✅ Qual banco você recebe o benefício?`

const F1_M3 = `Agora preciso do Extrato de Consignações do INSS (para ver a margem e ofertas).
Você consegue gerar no app Meu INSS?
Caminho: Meu INSS → Extrato de Empréstimos/Consignações → Baixar PDF.`

const F1_M4 = `Recebido! ✅ Vou analisar a margem e retorno com as opções liberadas.
Você prefere prazo menor (parcela menor pode não ser) ou parcela menor (prazo maior)?`

const F1_M5 = `Sem problema 😊
Você está com acesso ao app Meu INSS no seu celular?
Se sim, me diga se aparece a opção "Extrato de Empréstimos/Consignações" aí.`

// FLUXO 2
const F2_M2 = `Perfeito! Para eu simular, me informe:
✅ Nome completo
✅ CPF (somente números)
✅ Data de nascimento
✅ Banco que recebe o benefício`

const F2_M3 = `Agora preciso do Extrato de Consignações no Meu INSS para confirmar margem e ofertas:
Meu INSS → Extrato de Empréstimos/Consignações → Baixar PDF.`

const F2_M4 = `Assim que eu receber, já te passo as opções disponíveis e valores aproximados. ✅
Você quer mais valor ou parcela menor?`

// FLUXO 3
const F3_M2 = `Ótimo! Para eu verificar as condições pra você:
✅ Nome completo
✅ CPF (somente números)
✅ Data de nascimento
✅ Posto/graduação
✅ Banco onde recebe`

const F3_M3 = `Você consegue me enviar um contracheque/holerite atualizado (foto ou PDF)?
É ele que confirma margem e libera a simulação com precisão.`

const F3_M4 = `Perfeito ✅ Vou analisar e já retorno com as opções liberadas.
Você prefere: (1) maior valor ou (2) menor parcela?`

// FLUXO 4
const F4_M2 = `Perfeito! Para eu simular corretamente, me informe:
✅ Nome completo
✅ CPF (somente números)
✅ Órgão/Prefeitura/Estado (qual é o vínculo?)
✅ UF e cidade
✅ Banco onde recebe`

const F4_M3 = `Você consegue me enviar um contracheque/holerite atualizado (foto ou PDF)?
Com ele eu verifico margem e retorno as melhores condições.`

const F4_M4 = `Recebido ✅ Vou analisar e te retorno com as opções disponíveis.
Você tem preferência por parcela menor ou liberar mais valor?`

// FLUXO 5
const F5_M2 = `Perfeito! Para antecipação do FGTS, me informe por favor:
✅ Nome completo
✅ CPF (somente números)
✅ Você tem o app Meu FGTS instalado?`

const F5_M3 = `Você consegue me enviar um print do saldo do FGTS (tela inicial onde aparece o saldo)?
Assim eu já consigo estimar o valor que pode liberar.`

const F5_M4 = `Para seguir com a simulação, é necessário autorizar no Meu FGTS os bancos:
✅ PROSPECTA FINTECH
✅ ICRED

Caminho (geral): Meu FGTS → Autorizar bancos/Instituições → Buscar e autorizar.`

const F5_M5 = `Assim que autorizar, me avise aqui ✅ que eu puxo a proposta e te retorno com os valores.`

// FLUXO 6
const F6_M2 = `Ótimo! Para eu verificar a liberação do Crédito CLT, me informe:
✅ Nome completo
✅ CPF (somente números)
✅ Empresa onde trabalha
✅ Tempo de carteira assinada (aprox.)
✅ Salário líquido (média)`

const F6_M3 = `Você consegue enviar:
📌 Último holerite/contracheque (foto ou PDF)
e, se tiver, print da CTPS Digital (dados do contrato).`

const F6_M4 = `Perfeito ✅ Vou analisar e te retorno com:
🔹 valor estimado liberado
🔹 parcelas disponíveis
🔹 prazo e condições

Você prefere parcela menor ou pegar mais valor?`

// DEFAULT / FALLBACKS
const MSG_DEMORA = `Só confirmando 😊 conseguiu me enviar as informações para eu finalizar a simulação?`

const MSG_SEM_LIBERACAO = `No momento não apareceu proposta liberada para os dados informados.
Para eu tentar outras possibilidades, preciso do documento/extrato do seu caso (conforme a modalidade). Você consegue me enviar?`

export const MSG_ENCERRAMENTO = `Tenho opções para você ✅
Quer que eu te envie aqui os valores e parcelas, ou prefere que eu te chame no WhatsApp para explicar rapidinho?`

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

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { organizationId: true }
    })

    if (conversation) {
        const automation = await prisma.automation.findFirst({
            where: { organizationId: conversation.organizationId, isActive: true },
            orderBy: { updatedAt: 'desc' }
        })

        if (automation && automation.workflowJson && automation.workflowJson.length > 5) {
            try {
                const flow = JSON.parse(automation.workflowJson)
                const nodes: any[] = flow.nodes || []
                const edges: any[] = flow.edges || []

                // INTERPRETADOR NATIVO REACT FLOW
                if (nodes.length > 1) { // Tem mais que o Start apenas
                    if (isNewLead) {
                        const startNode = nodes.find(n => n.id === 'start')
                        if (startNode) {
                            const edge = edges.find(e => e.source === startNode.id)
                            if (edge) {
                                const nextNode = nodes.find(n => n.id === edge.target)
                                if (nextNode && nextNode.data?.label) responseText = nextNode.data.label
                            }
                        }
                    } else {
                        const lastBotMessage = await prisma.message.findFirst({
                            where: { conversationId, direction: 'OUTBOUND', senderId: null },
                            orderBy: { createdAt: 'desc' }
                        })

                        if (lastBotMessage && lastBotMessage.content) {
                            const currentNode = nodes.find(n => n.data?.label === lastBotMessage.content)
                            if (currentNode) {
                                const outgoingEdges = edges.filter(e => e.source === currentNode.id)
                                // Simplificação: pega a primeira aresta que sai do nó anterior, sem validar intencionalmente condição
                                if (outgoingEdges.length > 0) {
                                    const nextNode = nodes.find(n => n.id === outgoingEdges[0].target)
                                    if (nextNode && nextNode.data?.label) responseText = nextNode.data.label
                                }
                            }
                        }
                    }

                    // Se o interpretador Visual Flow gerou Resposta:
                    if (responseText) {
                        const res = await provider.sendMessage({ to: leadPhone, text: responseText })
                        await prisma.message.create({
                            data: {
                                conversationId, direction: "OUTBOUND", type: "TEXT", content: responseText,
                                status: res.success ? "DELIVERED" : "FAILED", senderId: null, providerId: res.messageId || null
                            }
                        })
                        await prisma.conversation.update({
                            where: { id: conversationId }, data: { updatedAt: new Date(), status: 'BOT_HANDLING' }
                        })
                        return // Encerra, não cai no Legacy Switch
                    } else {
                        return // Não tinha aresta. Fim do fluxo, cai pro humano.
                    }
                }
            } catch (err) {
                console.error("[BotEngine] Fallback Ativado - Erro lendo Grafo visual:", err)
            }
        }
    }

    // --- CÓDIGO LEGADO (MVP HARDCODED FUNIL M2R CRED) ---
    if (isNewLead) {
        responseText = MENU_TEXT
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
        const isMedia = incomingType === 'document' || incomingType === 'image'

        if (!lastBotMessage) {
            // Se não tem mensagem anterior do bot mas o lead digitou saudação (Lead Antigo reiniciando fluxo)
            if (['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'menu', 'start'].includes(userT)) {
                responseText = MENU_TEXT
            } else {
                // Não é saudação nem tem contexto. Deixa com Atendente Humano
                return
            }
        } else {
            const botContext = lastBotMessage.content || ""

            // SE O USUÁRIO FORÇAR UMA SAUDAÇÃO NO MEIO DO FLUXO, REINICIA A CONVERSA
            if (['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'menu', 'start'].includes(userT)) {
                responseText = MENU_TEXT
            }
            // ----------------------------------------------------
            // STATE MACHINE RULES
            // ----------------------------------------------------
            else if (botContext.includes("Em qual dessas opções você se enquadra?") || botContext.includes("Desculpe, não entendi")) {
                // ESTADO: MENU. Esperamos um numero de 1 a 6 ou texto.
                if (userT === '1' || userT.includes('aposentado')) responseText = F1_M2
                else if (userT === '2' || userT.includes('pensionista')) responseText = F2_M2
                else if (userT === '3' || userT.includes('militar') || userT.includes('exercito')) responseText = F3_M2
                else if (userT === '4' || userT.includes('servidor')) responseText = F4_M2
                else if (userT === '5' || userT.includes('fgts') || userT.includes('antecipacao')) responseText = F5_M2
                else if (userT === '6' || userT.includes('clt') || userT.includes('credito')) responseText = F6_M2
                else responseText = "Desculpe, não entendi. Digite o *NÚMERO* da opção desejada (ex: 1 para Aposentados)."
            }

            // --- FLUXO 1 ---
            else if (botContext.includes("Qual banco você recebe o benefício?")) {
                responseText = F1_M3
            } else if (botContext.includes("Você consegue gerar no app Meu INSS?")) {
                if (isMedia) responseText = F1_M4
                else if (userT.includes('não') || userT.includes('nao consegue')) responseText = F1_M5
                else responseText = F1_M4 // Assumimos que enviou como PDF/Image
            } else if (botContext.includes("Você está com acesso ao app Meu INSS no seu celular?")) {
                // Última parada do fluxo 1 (precisa de transbordo humano)
                return
            }

            // --- FLUXO 2 ---
            else if (botContext.includes("Banco que recebe o benefício")) {
                responseText = F2_M3
            } else if (botContext.includes("Meu INSS → Extrato de Empréstimos/Consignações → Baixar PDF")) {
                responseText = F2_M4 // Assumimos que tentou enviar
            }

            // --- FLUXO 3 ---
            else if (botContext.includes("Posto/graduação")) {
                responseText = F3_M3
            } else if (botContext.includes("Você consegue me enviar um contracheque/holerite atualizado")) {
                responseText = F3_M4
            }

            // --- FLUXO 4 ---
            else if (botContext.includes("Órgão/Prefeitura/Estado")) {
                responseText = F4_M3
            } else if (botContext.includes("Com ele eu verifico margem e retorno as melhores condições.")) {
                responseText = F4_M4
            }

            // --- FLUXO 5 ---
            else if (botContext.includes("Você tem o app Meu FGTS instalado?")) {
                responseText = F5_M3
            } else if (botContext.includes("Assim eu já consigo estimar o valor que pode liberar.")) {
                // Independente de enviar print, já joga a autorização
                responseText = F5_M4
                // Logo em seguida a gente dispara a M5, então podemos concatenar ou enviar 2 msg
                responseText += "\n\n" + F5_M5
            }

            // --- FLUXO 6 ---
            else if (botContext.includes("Tempo de carteira assinada (aprox.)")) {
                responseText = F6_M3
            } else if (botContext.includes("print da CTPS Digital (dados do contrato).")) {
                responseText = F6_M4
            }

            // Se chegou no final do fluxo (já mandou as opções Fx_M4) e o usuário responde se quer parcelado etc
            else if (
                botContext.includes("Você prefere prazo menor") ||
                botContext.includes("Você quer mais valor ou parcela menor") ||
                botContext.includes("Você prefere: (1) maior valor ou (2) menor parcela") ||
                botContext.includes("Você tem preferência por parcela menor ou liberar mais valor") ||
                botContext.includes("Você prefere parcela menor ou pegar mais valor") ||
                botContext.includes("assim que autorizar, me avise") // M5 do FGTS
            ) {
                // Chegamos no final do afunilamento
                responseText = MSG_ENCERRAMENTO
            }

            else {
                // Se nenhuma branch do bot bater, encerra processamento e deixa com humano.
                return
            }
        }
    }

    if (responseText !== "") {
        console.log(`[BotEngine] Respondendo para ${leadPhone} -> ${responseText.substring(0, 30)}...`)

        // 1. Disparar o Request HTTP para a Meta/Cloud API
        const res = await provider.sendMessage({
            to: leadPhone,
            text: responseText
        })

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
