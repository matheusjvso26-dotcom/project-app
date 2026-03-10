import { getWhatsAppProvider } from "./provider"
import prisma from "@/lib/prisma"

import * as script from './m2r-script'

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

    // --- NOVO MOTOR NATIVO M2R CRED (V2) ---
    // Recarregando Conversa com Lead e Metadados atualizados
    const convData = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { lead: true }
    });

    if (!convData) return;

    // Desempacotando Estado Atual (botState -> State Machine)
    let state = (convData.botState as any) || {};
    if (!state.currentBlock) {
        state = { currentBlock: 'BLOCO_00', vars: {} };
    }
    
    // Tratativa para Novos Leads que ativam o bot do zero sem estado pre-existente
    if (isNewLead) {
        state.currentBlock = 'BLOCO_00';
    }

    const leadId = convData.lead.id;
    let customData = (convData.lead.customData as any) || {};
    
    const userT = incomingText.trim().toLowerCase();
    const isMedia = incomingType === 'document' || incomingType === 'image' || incomingType === 'audio' || incomingType === 'video';

    // ATALHO UNIVERSAL PARA FALAR COM ATENDENTE (0)
    if (userT === '0' || userT === '0️⃣' || userT === 'atendente' || userT.includes('falar com humano') || userT.includes('falar com atendente')) {
        responseText = script.BLOCO_90_TEXT;
        state.currentBlock = 'BLOCO_90';
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { tags: { push: 'LEAD QUALIFICADO' } } // Tag Opcional
        });
    } 
    // REINÍCIO FORÇADO
    else if (userT === 'menu' || userT === 'start' || userT === 'iniciar') {
        responseText = script.BLOCO_00_TEXT;
        interactiveOptions = script.BLOCO_00_OPTIONS;
        state.currentBlock = 'BLOCO_00';
    }
    // MAQUINA DE ESTADOS (V2)
    else {
        switch (state.currentBlock) {
            case 'BLOCO_00': // LGPD
                if (userT.includes('sim') || userT === 'b00_sim') {
                    // Update Consent
                    await prisma.lead.update({ where: { id: leadId }, data: { lgpdConsent: true } });
                    responseText = script.BLOCO_01_TEXT;
                    interactiveOptions = script.BLOCO_01_OPTIONS;
                    state.currentBlock = 'BLOCO_01';
                } else if (userT.includes('não') || userT.includes('nao') || userT === 'b00_nao') {
                    responseText = script.BLOCO_00B_TEXT;
                    state.currentBlock = 'BLOCO_00B';
                } else {
                    // Se digitou qualquer oi, manda consentimento de novo
                    responseText = script.BLOCO_00_TEXT;
                    interactiveOptions = script.BLOCO_00_OPTIONS;
                }
                break;

            case 'BLOCO_01': // MODALIDADES
            case 'BLOCO_01F':
            case 'BLOCO_00B': // Se estava encerrado e chamou de novo
                if (userT === '1' || userT === 'b01_1' || userT.includes('aposentado')) {
                    state.vars.modalidade = "INSS Aposentado";
                    responseText = script.BLOCO_10_TEXT;
                    state.currentBlock = 'BLOCO_10';
                } else if (userT === '2' || userT === 'b01_2' || userT.includes('pensionista')) {
                    state.vars.modalidade = "INSS Pensionista";
                    responseText = script.BLOCO_20_TEXT;
                    state.currentBlock = 'BLOCO_20';
                } else if (userT === '3' || userT === 'b01_3' || userT.includes('militar')) {
                    state.vars.modalidade = "Militar do Exército";
                    responseText = script.BLOCO_30_TEXT;
                    state.currentBlock = 'BLOCO_30';
                } else if (userT === '4' || userT === 'b01_4' || userT.includes('servidor')) {
                    state.vars.modalidade = "Servidor Público";
                    responseText = script.BLOCO_40_TEXT;
                    state.currentBlock = 'BLOCO_40';
                } else if (userT === '5' || userT === 'b01_5' || userT.includes('fgts')) {
                    state.vars.modalidade = "Antecipação FGTS";
                    responseText = script.BLOCO_50_TEXT;
                    interactiveOptions = script.BLOCO_50_OPTIONS;
                    state.currentBlock = 'BLOCO_50';
                } else if (userT === '6' || userT === 'b01_6' || userT.includes('clt') || userT.includes('carteira')) {
                    state.vars.modalidade = "Crédito CLT";
                    responseText = script.BLOCO_60_TEXT;
                    state.currentBlock = 'BLOCO_60';
                } else {
                    if (state.currentBlock === 'BLOCO_00B' && !isMedia) {
                        // Tava encerrado, volta pro Boas Vindas
                        responseText = script.BLOCO_00_TEXT;
                        interactiveOptions = script.BLOCO_00_OPTIONS;
                        state.currentBlock = 'BLOCO_00';
                    } else if (!isMedia) {
                        responseText = script.BLOCO_01F_TEXT;
                        interactiveOptions = script.BLOCO_01F_OPTIONS;
                        state.currentBlock = 'BLOCO_01F';
                    }
                }
                break;

            // --- INSS APOSENTADO ---
            case 'BLOCO_10': // Coletou Dados (Aposentado)
                if (incomingText.length > 5 && !isMedia) {
                    state.vars.dadosIniciais = incomingText; // Guarda tudo que digitou
                    responseText = script.BLOCO_11_TEXT;
                    state.currentBlock = 'BLOCO_11';
                } else {
                    responseText = script.BLOCO_10_TEXT; // Pede dados de novo
                }
                break;
            case 'BLOCO_11': // Aguardando Extrato (Aposentado)
               if (isMedia) {
                    state.vars.docStatus = "recebido";
                    responseText = script.BLOCO_12_TEXT;
                    state.currentBlock = 'BLOCO_12';
               } else {
                    if (userT.includes('difícil') || userT.includes('ajuda')) {
                        responseText = script.BLOCO_91_TEXT;
                    } else {
                        responseText = "Por favor, me envie a foto ou PDF do extrato aqui pelo WhatsApp para continuarmos. 😊";
                    }
               }
               break;

            // --- INSS PENSIONISTA ---
            case 'BLOCO_20':
                if (incomingText.length > 5 && !isMedia) {
                    state.vars.dadosIniciais = incomingText; 
                    responseText = script.BLOCO_21_TEXT;
                    state.currentBlock = 'BLOCO_21';
                } else {
                    responseText = script.BLOCO_20_TEXT; 
                }
                break;
            case 'BLOCO_21':
               if (isMedia) {
                    state.vars.docStatus = "recebido";
                    responseText = script.BLOCO_22_TEXT;
                    state.currentBlock = 'BLOCO_22';
               } else {
                    if (userT.includes('difícil') || userT.includes('ajuda')) {
                        responseText = script.BLOCO_91_TEXT;
                    } else {
                        responseText = "Para calcularmos certinho, preciso mesmo ver a foto ou PDF do extrato, me mande por aqui! 😉";
                    }
               }
               break;

            // --- MILITARES DO EXÉRCITO ---
            case 'BLOCO_30':
                if (incomingText.length > 5 && !isMedia) {
                    state.vars.dadosIniciais = incomingText; 
                    responseText = script.BLOCO_31_TEXT;
                    state.currentBlock = 'BLOCO_31';
                } else {
                    responseText = script.BLOCO_30_TEXT; 
                }
                break;
            case 'BLOCO_31':
               if (isMedia) {
                    state.vars.docStatus = "recebido";
                    responseText = script.BLOCO_32_TEXT;
                    state.currentBlock = 'BLOCO_32';
               } else {
                    responseText = "Preciso do contracheque para validarmos suas taxas exclusivas de Militar. Consegue anexar a foto ou PDF?";
               }
               break;

            // --- SERVIDOR PÚBLICO ---
            case 'BLOCO_40':
                if (incomingText.length > 5 && !isMedia) {
                    state.vars.dadosIniciais = incomingText; 
                    responseText = script.BLOCO_41_TEXT;
                    state.currentBlock = 'BLOCO_41';
                } else {
                    responseText = script.BLOCO_40_TEXT; 
                }
                break;
            case 'BLOCO_41':
               if (isMedia) {
                    state.vars.docStatus = "recebido";
                    responseText = script.BLOCO_42_TEXT;
                    state.currentBlock = 'BLOCO_42';
               } else {
                    responseText = "Para liberar, me envie a foto/PDF do Extrato de Consignações e o Contracheque. 😊";
               }
               break;

            // --- FGTS ---
            case 'BLOCO_50': // Coletou CPF e Pergunta de App
                if (userT === 'b50_sim' || userT.includes('sim')) {
                    responseText = script.BLOCO_51_TEXT;
                    state.currentBlock = 'BLOCO_51';
                } else if (userT === 'b50_nao' || userT.includes('não')) {
                    responseText = "Para prosseguirmos, você precisa baixar o aplicativo 'Meu FGTS' no seu celular. Assim que baixar e acessar, me avise!";
                } else if (incomingText.length >= 10 && incomingText.match(/\d/g)?.length! >= 11) {
                    // Ele apenas enviou o CPF
                    state.vars.dadosIniciais = incomingText;
                    responseText = script.BLOCO_51_TEXT;
                    state.currentBlock = 'BLOCO_51';
                } else {
                    responseText = script.BLOCO_50_TEXT;
                    interactiveOptions = script.BLOCO_50_OPTIONS;
                }
                break;
            case 'BLOCO_51': 
               if (isMedia || userT.includes('pronto') || userT.includes('feito') || userT.includes('autorizei')) {
                    state.vars.docStatus = "recebido";
                    responseText = script.BLOCO_52_TEXT;
                    state.currentBlock = 'BLOCO_52';
               } else {
                    responseText = "Assim que autorizar as instituições no aplicativo do FGTS, escreva 'Pronto' ou envie um Print da tela para eu avançar!";
               }
               break;

            // --- CLT ---
            case 'BLOCO_60':
                if (incomingText.length > 5 && !isMedia) {
                    state.vars.dadosIniciais = incomingText; 
                    responseText = script.BLOCO_62_TEXT;
                    state.currentBlock = 'BLOCO_62';
                } else {
                    responseText = script.BLOCO_60_TEXT; 
                }
                break;

            // --- PÓS-FINALIZAÇÃO ---
            case 'BLOCO_12': case 'BLOCO_22': case 'BLOCO_32': case 'BLOCO_42': case 'BLOCO_52': case 'BLOCO_62':
            case 'BLOCO_90':
                responseText = script.BLOCO_90_TEXT;
                state.currentBlock = 'BLOCO_90';
                await prisma.conversation.update({
                    where: { id: conversationId },
                    data: { tags: { push: 'LEAD QUALIFICADO' } } // Tag Opcional
                });
                break;
                
            default:
                responseText = script.BLOCO_01F_TEXT;
                interactiveOptions = script.BLOCO_01F_OPTIONS;
                state.currentBlock = 'BLOCO_01F';
                break;
        }
    }

    // Encerrando - Atualizar a Memória no Banco
    customData = { ...customData, ...state.vars };

    await prisma.$transaction([
        prisma.conversation.update({
            where: { id: conversationId },
            data: { botState: state }
        }),
        prisma.lead.update({
            where: { id: leadId },
            data: { customData }
        })
    ]);

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
        const terminalBlocks = ['BLOCO_12', 'BLOCO_22', 'BLOCO_32', 'BLOCO_42', 'BLOCO_52', 'BLOCO_62', 'BLOCO_90'];
        const shouldHandOffToHuman = terminalBlocks.includes(state.currentBlock);

        await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                updatedAt: new Date(),
                status: shouldHandOffToHuman ? 'OPEN' : 'BOT_HANDLING'
            }
        })
    }
}
