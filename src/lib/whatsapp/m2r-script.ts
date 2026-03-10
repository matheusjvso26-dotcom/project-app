// ---------------------------------------------------------
// ROTEIRO M2R CRED - V2 (MEGA FUNIL)
// ---------------------------------------------------------

// BLOCO 00 — Boas-vindas + Consentimento (LGPD)
export const BLOCO_00_TEXT = `Olá! 👋 Tudo bem? Eu sou o atendimente da M2R Cred.
Para te ajudar com a simulação, vou precisar de alguns dados e documentos (somente para análise de crédito).
✅ Você autoriza o uso dessas informações para simulação e atendimento?`;

export const BLOCO_00_OPTIONS = {
    type: 'button',
    body: BLOCO_00_TEXT,
    options: [
        { id: "b00_sim", title: "SIM, autorizo" },
        { id: "b00_nao", title: "NÃO" }
    ]
};

// BLOCO 00B — Encerrar
export const BLOCO_00B_TEXT = `Sem problemas! Se mudar de ideia, é só chamar novamente que te ajudo. 😊`;

// BLOCO 01 — Menu de Modalidades
export const BLOCO_01_TEXT = `Perfeito ✅
Hoje a M2R Cred trabalha com as seguintes modalidades:

1️⃣ Aposentados (INSS)
2️⃣ Pensionistas (INSS)
3️⃣ Militares do Exército
4️⃣ Servidores Públicos
5️⃣ Antecipação do FGTS
6️⃣ Crédito CLT`;

export const BLOCO_01_OPTIONS = {
    type: 'list',
    body: BLOCO_01_TEXT,
    buttonText: "Ver Opções",
    options: [
        { id: "b01_1", title: "Aposentados (INSS)" },
        { id: "b01_2", title: "Pensionistas (INSS)" },
        { id: "b01_3", title: "Militares Exército" },
        { id: "b01_4", title: "Servidores Públicos" },
        { id: "b01_5", title: "Antecipação FGTS" },
        { id: "b01_6", title: "Crédito CLT" }
    ]
};

// BLOCO 01F — Fallback (resposta inválida)
export const BLOCO_01F_TEXT = `Não consegui identificar 😅
Por favor, escolha uma das opções abaixo para eu te direcionar certinho:`;

export const BLOCO_01F_OPTIONS = {
    type: 'list',
    body: BLOCO_01F_TEXT,
    buttonText: "Ver Opções",
    options: [
        { id: "b01_1", title: "Aposentados (INSS)" },
        { id: "b01_2", title: "Pensionistas (INSS)" },
        { id: "b01_3", title: "Militares Exército" },
        { id: "b01_4", title: "Servidores Públicos" },
        { id: "b01_5", title: "Antecipação FGTS" },
        { id: "b01_6", title: "Crédito CLT" }
    ]
};

// ==========================================
// OPÇÃO 1 — INSS Aposentados
// ==========================================

// BLOCO 10 — Coleta de dados (INSS Aposentado)
export const BLOCO_10_TEXT = `Perfeito! Para eu simular pra você, me envie por favor:
✅ Nome completo
✅ CPF (somente números)
✅ Data de nascimento
✅ Banco onde recebe o benefício

(Pode mandar tudo em uma mensagem.)`;

// BLOCO 11 — Solicitar Extrato de Consignações (obrigatório)
export const BLOCO_11_TEXT = `Agora preciso do Extrato de Consignações ATUALIZADO do INSS (para verificar margem e ofertas).
Você pode gerar no app Meu INSS:

📌 Caminho: Meu INSS → Extrato de Empréstimos/Consignações → Baixar PDF
✅ Envie aqui o PDF ou foto nítida do extrato.`;

// BLOCO 12 — Confirma recebimento + aguardar
export const BLOCO_12_TEXT = `Perfeito ✅ Assim que você enviar o extrato, vou verificar no sistema e retorno com as melhores opções.
⏳ Pode aguardar um instante.`;

// ==========================================
// OPÇÃO 2 — INSS Pensionistas
// ==========================================

// BLOCO 20 — Coleta de dados (INSS Pensionista)
export const BLOCO_20_TEXT = `Perfeito! Para simular, me envie:
✅ Nome completo
✅ CPF (somente números)
✅ Data de nascimento
✅ Banco onde recebe o benefício

(Pode mandar tudo em uma mensagem.)`;

// BLOCO 21 — Solicitar Extrato de Consignações (obrigatório)
export const BLOCO_21_TEXT = `Agora preciso do Extrato de Consignações ATUALIZADO no Meu INSS:

📌 Meu INSS → Extrato de Empréstimos/Consignações → Baixar PDF
✅ Envie o PDF ou foto nítida do extrato aqui no WhatsApp.`;

// BLOCO 22 — Confirma recebimento + aguardar
export const BLOCO_22_TEXT = `Ótimo ✅ Assim que eu receber o extrato, verifico as ofertas e te retorno com as condições.
⏳ Pode aguardar um instante.`;

// ==========================================
// OPÇÃO 3 — Militares do Exército
// ==========================================

// BLOCO 30 — Coleta de dados (Militar)
export const BLOCO_30_TEXT = `Perfeito! Para eu verificar as condições, me envie:
✅ Nome completo
✅ CPF (somente números)
✅ Data de nascimento
✅ Posto/Graduação
✅ Banco onde recebe

(Pode mandar tudo em uma mensagem.)`;

// BLOCO 31 — Documentos (Militar)
export const BLOCO_31_TEXT = `Agora preciso dos documentos para confirmar margem e simular corretamente:
📄 Contracheque/holerite ATUALIZADO (foto ou PDF)
📄 Se você tiver, envie também o extrato de consignações (quando disponível)

✅ Pode enviar por aqui mesmo (imagem nítida ou PDF).`;

// BLOCO 32 — Confirmar + aguardar
export const BLOCO_32_TEXT = `Recebido ✅ Vou analisar e retorno com as melhores opções liberadas.
⏳ Aguarde um instante, por favor.`;

// ==========================================
// OPÇÃO 4 — Servidores Públicos
// ==========================================

// BLOCO 40 — Coleta de dados (Servidor)
export const BLOCO_40_TEXT = `Perfeito! Para simular certinho, me envie:
✅ Nome completo
✅ CPF (somente números)
✅ Órgão/Prefeitura/Estado (seu vínculo)
✅ UF e Cidade
✅ Banco onde recebe

(Pode mandar tudo em uma mensagem.)`;

// BLOCO 41 — Documentos (Servidor)
export const BLOCO_41_TEXT = `Para validar margem e liberar as melhores ofertas, preciso de:
📄 Extrato de consignações (do seu órgão/sistema)
📄 Contracheque/holerite ATUALIZADO

✅ Envie foto nítida ou PDF aqui no WhatsApp.`;

// BLOCO 42 — Confirmar + aguardar
export const BLOCO_42_TEXT = `Perfeito ✅ Vou verificar no sistema e retorno com as condições disponíveis.
⏳ Pode aguardar um instante.`;

// ==========================================
// OPÇÃO 5 — Antecipação do FGTS
// ==========================================

// BLOCO 50 — Coleta inicial (FGTS)
export const BLOCO_50_TEXT = `Ótimo! Para antecipação do FGTS, me envie:
✅ Nome completo
✅ CPF (somente números)

E me diga:
Você tem o app Meu FGTS instalado?`;

export const BLOCO_50_OPTIONS = {
    type: 'button',
    body: BLOCO_50_TEXT,
    options: [
        { id: "b50_sim", title: "Sim, tenho" },
        { id: "b50_nao", title: "Não tenho" }
    ]
};

// BLOCO 51 — Solicitar saldo + autorização
export const BLOCO_51_TEXT = `Para eu consultar e simular, envie por favor:
📌 Print do saldo do FGTS (tela que aparece o saldo/contas)

E também é necessário autorizar a consulta no app Meu FGTS:
📍 Meu FGTS → Autorizar Bancos/Instituições → Autorizar

✅ Assim que finalizar, me avise por aqui. (Ou envie a foto/print).`;

// BLOCO 52 — Confirmar + aguardar
export const BLOCO_52_TEXT = `Perfeito ✅ Vou verificar as opções de antecipação e retorno com valores e condições.
⏳ Aguarde um instante.`;

// ==========================================
// OPÇÃO 6 — Crédito CLT
// ==========================================

// BLOCO 60 — Coleta de dados (CLT)
export const BLOCO_60_TEXT = `Perfeito! Para eu verificar o Crédito CLT, me envie:
✅ Nome completo
✅ CPF (somente números)
✅ Empresa onde trabalha
✅ Tempo de carteira assinada (aprox.)
✅ Salário líquido (média)

(Pode mandar tudo em uma mensagem.)`;

// (BLOCO_61 removido pelo usuário - pular direto para BLOCO_62)

// BLOCO 62 — Confirmar + aguardar
export const BLOCO_62_TEXT = `Perfeito ✅ Vou analisar e te retorno com as opções disponíveis.
⏳ Aguarde um instante, por favor.`;

// ==========================================
// BLOCOS GENÉRICOS DE APOIO
// ==========================================

// BLOCO 90 — Triagem (passar para humano / atendimento)
export const BLOCO_90_TEXT = `Obrigado! ✅ Já recebi as informações.
Agora vou verificar no sistema e retorno com a proposta mais vantajosa para você.
⏳ Pode aguardar um instante.`;

// BLOCO 91 — Se o cliente travar no “Meu INSS” (atalho de ajuda)
export const BLOCO_91_TEXT = `Se tiver dificuldade no Meu INSS, me diga o que aparece aí (ou mande print).
📌 Geralmente é: Meu INSS → Extrato de Empréstimos/Consignações → Baixar PDF.
Se quiser, te guio passo a passo.`;

// BLOCO 92 — Retomada automática (follow-up)
export const BLOCO_92_TEXT = `Só confirmando 😊 você conseguiu enviar os documentos para eu finalizar sua simulação?`;
