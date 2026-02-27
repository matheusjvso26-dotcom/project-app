import Link from 'next/link'
import {
  CheckCircle2, Target, Zap, Server, PhoneCall, ChevronDown, Store,
  MessageSquare, LayoutDashboard, TrendingUp, Users, Target as TargetIcon, SearchX, DollarSign, Frown, XCircle, ChevronRight, Stethoscope, Wrench, Building2
} from 'lucide-react'

const FAQS = [
  { p: "Preciso ter domínio para usar?", r: "Não. Você pode usar por IP na VPS e depois migrar para domínio com SSL." },
  { p: "O WhatsApp é oficial?", r: "A integração é preparada para a API oficial. No MVP, pode iniciar com modo 'mock' e plugar quando tiver as credenciais." },
  { p: "Funciona no celular?", r: "Sim, design responsivo e dashboard adaptado." },
  { p: "Dá para importar leads?", r: "Sim (CSV/planilha) e também via formulário." }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white pb-0 overflow-hidden scroll-smooth">
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/70 backdrop-blur-md pt-4 pb-4">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="FLY UP Web" className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,123,0,0.1)]" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#dor" className="hover:text-white transition-colors">Problema</a>
            <a href="#solucao" className="hover:text-white transition-colors">Solução</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-white hover:text-[#ff7b00] transition-colors">Entrar</Link>
            <a href="#demo" className="text-sm font-bold text-black bg-[#ff7b00] hover:bg-white transition-all px-4 py-2 rounded-md shadow-[0_0_15px_rgba(255,123,0,0.2)]">
              Fale com um Especialista
            </a>
          </div>
        </div>
      </header>

      <main className="pt-28">
        {/* 1) HERO SECTION - LAYOUT DUAS COLUNAS */}
        <section className="relative pt-20 pb-24 px-6 z-10 overflow-hidden border-b border-white/5">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Esquerda: Texto Enxuto e CTAs */}
            <div className="text-left relative z-20">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                Vendas previsíveis no <span className="text-[#ff7b00]">WhatsApp</span>.
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-8 font-light max-w-lg">
                Do primeiro contato ao fechamento: capture leads, automatize conversas e controle lucros num único painel ágil.
              </p>

              <ul className="text-zinc-300 text-sm md:text-base space-y-4 mb-10 font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" /> Captura e qualificação automática via IA</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" /> Kanban interativo com tarefas diárias</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" /> Dashboards analíticos em tempo real</li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <a href="#demo" className="w-full sm:w-auto bg-[#ff7b00] hover:bg-orange-500 text-black font-black uppercase tracking-wider text-sm py-4 px-8 rounded-md transition-all shadow-[0_0_20px_rgba(255,123,0,0.3)] text-center">
                  Garantir Acesso
                </a>
                <Link href="/register" className="w-full sm:w-auto text-white font-medium text-sm py-4 px-8 rounded-md border border-white/20 hover:bg-white/5 transition-colors text-center">
                  Testar Grátis 7 Dias
                </Link>
              </div>
              <p className="text-xs text-zinc-500">Sem cartão. Cancelamento rápido. Suporte humano.</p>
            </div>

            {/* Direita: Imagem Premium do Sistema */}
            <div className="relative w-full flex justify-center lg:justify-end z-20 mt-10 lg:mt-0">
              {/* Glow ambient background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ff7b00]/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

              {/* Window Frame */}
              <div className="w-full max-w-[650px] relative rounded-2xl border border-[#333] bg-[#0c0c0c] shadow-[0_0_50px_rgba(255,123,0,0.15)] overflow-hidden transform hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(255,123,0,0.3)] transition-all duration-500">
                <div className="h-8 border-b border-[#333] bg-[#1a1a1a] flex items-center px-4 gap-2 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="relative w-full aspect-[4/3] bg-black">
                  <img src="/mockup-hero.png" alt="Amostra Premium FLY UP" className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2) PROVA DE DOR */}
        <section id="dor" className="py-24 px-6 bg-[#050505] border-t border-white/5">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Seus leads estão chegando… <br className="hidden md:block" /> <span className="text-[#ff7b00]">mas estão escapando.</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
                A maioria das empresas perde vendas porque o atendimento fica espalhado: WhatsApp, planilha, anotações, “vou responder depois”. Resultado: demora no retorno, falta de follow-up e zero visibilidade do funil.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-8 flex flex-col gap-4 text-center items-center hover:border-red-500/30 transition-colors">
                <XCircle className="w-10 h-10 text-red-500" />
                <h4 className="text-white font-bold text-lg">Leads sem dono e sem status</h4>
              </div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-8 flex flex-col gap-4 text-center items-center hover:border-red-500/30 transition-colors">
                <Frown className="w-10 h-10 text-red-500" />
                <h4 className="text-white font-bold text-lg">Atendimento lento</h4>
                <p className="text-sm text-zinc-500">Perde imediatamente o "timing" de venda.</p>
              </div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-8 flex flex-col gap-4 text-center items-center hover:border-red-500/30 transition-colors">
                <SearchX className="w-10 h-10 text-red-500" />
                <h4 className="text-white font-bold text-lg">Propostas sem rastreio</h4>
              </div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-8 flex flex-col gap-4 text-center items-center hover:border-red-500/30 transition-colors lg:col-span-1">
                <DollarSign className="w-10 h-10 text-red-500" />
                <h4 className="text-white font-bold text-lg">Lucro cego</h4>
                <p className="text-sm text-zinc-500">Separado do funil: vende muito no Zap, mas não sabe o Lucro Real.</p>
              </div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-8 flex flex-col gap-4 text-center items-center hover:border-red-500/30 transition-colors lg:col-span-2">
                <TargetIcon className="w-10 h-10 text-red-500" />
                <h4 className="text-white font-bold text-lg">Cegueira Estratégica Completa</h4>
                <p className="text-sm text-zinc-500">Você não controla seus custos fixos operacionais, não acompanha o lucro líquido e nem faz ideia do que gera resultado previsível na equipe.</p>
              </div>
            </div>
          </div>
        </section >

        {/* 3) SOLUÇÃO & 4) BENEFÍCIOS */}
        < section id="solucao" className="py-24 px-6 relative" >
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-20 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Um sistema único para organizar leads, automatizar conversas e <span className="text-[#ff7b00]">lucrar com previsibilidade.</span>
              </h2>
              <p className="text-lg text-zinc-400">
                FLY UP conecta seu funil de vendas ao WhatsApp Oficial e ao financeiro — com um dashboard premium que mostra, em tempo real, os negócios fechados, seus gastos fixos e sua real Receita de Caixa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-2xl hover:border-[#ff7b00]/30 transition-all group shadow-xl">
                <Users className="w-12 h-12 text-[#ff7b00] mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-4">Leads em um lugar só</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Capture, cadastre e classifique com campos padronizados (CPF/CNPJ/telefone) e histórico completo sem perder rastro do cliente.
                </p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-2xl hover:border-[#ff7b00]/30 transition-all group shadow-xl">
                <MessageSquare className="w-12 h-12 text-[#ff7b00] mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-4">WhatsApp Oficial + Chatbot</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Automação que qualifica e agenda. Chatbot com fluxos prontos: qualificação, agendamento e reengajamento — com camada pronta para a API oficial.
                </p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-2xl hover:border-[#ff7b00]/30 transition-all group shadow-xl">
                <LayoutDashboard className="w-12 h-12 text-[#ff7b00] mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-4">Kanban (Pipeline)</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Funil visual que todo time usa. Arraste e solte negócios, defina etapas e regras, gere tarefas e follow-up automático direto do tabuleiro de gestão.
                </p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-2xl hover:border-[#ff7b00]/30 transition-all group shadow-xl">
                <TrendingUp className="w-12 h-12 text-[#ff7b00] mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-4">Financeiro & Lucro Líquido</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Receita Gerada de Negócios Fechados menos Custos Fixos Operacionais. Acompanhe seus números absolutos e faturamento projetado sem planilhas arcaicas.
                </p>
              </div>
            </div>
          </div>
        </section >

        {/* 5) COMO FUNCIONA (Passo a Passo) */}
        < section className="py-24 px-6 bg-[#111] border-y border-white/5" >
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-16">
              Em 3 passos você sai da bagunça e <span className="text-[#ff7b00]">entra no controle.</span>
            </h2>

            <div className="flex flex-col md:flex-row items-stretch justify-between gap-8 mb-16 relative">
              {/* Linha conectora no fundo */}
              <div className="hidden md:block absolute top-[40px] left-[10%] w-[80%] h-0.5 bg-gradient-to-r from-[#ff7b00]/20 via-[#ff7b00]/80 to-[#ff7b00]/20 -z-0"></div>

              <div className="flex flex-col items-center bg-[#0a0a0a] border border-[#333] p-10 rounded-2xl flex-1 relative z-10 hover:-translate-y-2 transition-transform shadow-xl">
                <div className="w-16 h-16 bg-[#ff7b00] text-black font-black text-2xl flex items-center justify-center rounded-full mb-6 shadow-[0_0_20px_rgba(255,123,0,0.4)]">1</div>
                <h4 className="text-white font-bold text-xl mb-3">Capture o lead</h4>
                <p className="text-zinc-400">Pelo formulário exclusivo, WhatsApp ativo ou importação massiva.</p>
              </div>
              <div className="flex flex-col items-center bg-[#0a0a0a] border border-[#333] p-10 rounded-2xl flex-1 relative z-10 hover:-translate-y-2 transition-transform shadow-xl">
                <div className="w-16 h-16 bg-[#ff7b00] text-black font-black text-2xl flex items-center justify-center rounded-full mb-6 shadow-[0_0_20px_rgba(255,123,0,0.4)]">2</div>
                <h4 className="text-white font-bold text-xl mb-3">Qualifique automaticamente</h4>
                <p className="text-zinc-400">Use nosso Chatbot para colocar tags, pontuar o score e nutrir o lead.</p>
              </div>
              <div className="flex flex-col items-center bg-[#0a0a0a] border border-[#333] p-10 rounded-2xl flex-1 relative z-10 hover:-translate-y-2 transition-transform shadow-xl">
                <div className="w-16 h-16 bg-[#ff7b00] text-black font-black text-2xl flex items-center justify-center rounded-full mb-6 shadow-[0_0_20px_rgba(255,123,0,0.4)]">3</div>
                <h4 className="text-white font-bold text-xl mb-3">Feche e acompanhe</h4>
                <p className="text-zinc-400">Viaje os leads no Kanban + Financeiro + Métricas de fechamento rápido.</p>
              </div>
            </div>

            <a href="#demo" className="inline-block bg-[#ff7b00] text-black font-black uppercase tracking-widest text-sm py-4 px-12 rounded-md hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(255,123,0,0.4)] mt-4">
              Quero configurar em 15 minutos
            </a>
          </div>
        </section >

        {/* 6) DASHBOARD PREMIUM */}
        < section className="py-24 px-6 relative" >
          <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
                Dashboard que “vende” por você: <br /><span className="text-[#ff7b00]">KPIs animados</span> e decisões rápidas.
              </h2>
              <ul className="space-y-6 mb-10">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-[#ff7b00]/20 p-2 rounded-full"><TrendingUp className="w-5 h-5 text-[#ff7b00]" /></div>
                  <div>
                    <strong className="text-white block text-lg mb-1">Indicadores Financeiros Chave</strong>
                    <span className="text-zinc-400">Receita Realizada, Lucro Líquido e Volume de Negócios fechados alimentados diretamente pelo CRM.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-[#ff7b00]/20 p-2 rounded-full"><Target className="w-5 h-5 text-[#ff7b00]" /></div>
                  <div>
                    <strong className="text-white block text-lg mb-1">Gráficos Sincronizados</strong>
                    <span className="text-zinc-400">Gráficos que acompanham perfeitamente as variações diárias dos números.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-[#ff7b00]/20 p-2 rounded-full"><Server className="w-5 h-5 text-[#ff7b00]" /></div>
                  <div>
                    <strong className="text-white block text-lg mb-1">Filtros Avançados e Modo Dark</strong>
                    <span className="text-zinc-400">Filtre por período, origem, vendedor. Tema Light/Dark adaptativo com contraste perfeito.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="w-full aspect-[4/3] sm:aspect-video bg-[#0a0a0f] border border-[#222] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,123,0,0.15)] relative transform hover:-translate-y-2 transition-transform duration-500">
                <img src="/mockup-hero.png" alt="Dashboard Premium" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section >

        {/* 7) PARA QUEM É */}
        < section className="py-24 px-6 bg-[#050505] border-y border-[#111]" >
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
              Feito para quem vende no WhatsApp e <span className="text-[#ff7b00]">precisa de previsibilidade.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl px-8 py-5 flex items-center gap-4 text-white hover:border-[#ff7b00] transition-colors">
                <Stethoscope className="text-[#ff7b00] w-6 h-6" /> <span className="font-bold">Clínicas e Estética</span>
              </div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl px-8 py-5 flex items-center gap-4 text-white hover:border-[#ff7b00] transition-colors">
                <Wrench className="text-[#ff7b00] w-6 h-6" /> <span className="font-bold">Assistência & Serviços Recorrentes</span>
              </div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl px-8 py-5 flex items-center gap-4 text-white hover:border-[#ff7b00] transition-colors">
                <Building2 className="text-[#ff7b00] w-6 h-6" /> <span className="font-bold">Imobiliárias e Consórcios</span>
              </div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl px-8 py-5 flex items-center gap-4 text-white hover:border-[#ff7b00] transition-colors">
                <PhoneCall className="text-[#ff7b00] w-6 h-6" /> <span className="font-bold">Telecom / VoIP (Planos)</span>
              </div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-xl px-8 py-5 flex items-center gap-4 text-white hover:border-[#ff7b00] transition-colors">
                <Store className="text-[#ff7b00] w-6 h-6" /> <span className="font-bold">Empresas locais c/ alto volume</span>
              </div>
            </div>
          </div>
        </section >

        {/* 8) PROVA SOCIAL / RESULTADOS */}
        < section className="py-24 px-6 relative bg-[#ff7b00] text-black" >
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-20 max-w-4xl mx-auto">
              Resultados típicos após organizar WhatsApp + Funil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-black/10">
              <div className="flex flex-col items-center">
                <span className="text-6xl lg:text-7xl font-black mb-6">+30%</span>
                <span className="font-bold text-base uppercase tracking-widest text-[#552e00] max-w-[250px]">de conversão com follow-up consistente</span>
              </div>
              <div className="flex flex-col items-center pt-12 md:pt-0">
                <span className="text-6xl lg:text-7xl font-black mb-6">-40%</span>
                <span className="font-bold text-base uppercase tracking-widest text-[#552e00] max-w-[250px]">de leads perdidos por demora no atendimento</span>
              </div>
              <div className="flex flex-col items-center pt-12 md:pt-0">
                <span className="text-6xl lg:text-7xl font-black mb-6">100%</span>
                <span className="font-bold text-base uppercase tracking-widest text-[#552e00] max-w-[250px]">Visibilidade real do pipeline e metas por vendedor</span>
              </div>
            </div>
          </div>
        </section >

        {/* 9) PLANOS */}
        < section id="planos" className="py-24 px-6 relative" >
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Planos para o seu momento</h2>
              <p className="text-xl text-zinc-400">Do MVP à escala estruturada.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter */}
              <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-2xl flex flex-col hover:border-white/20 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <p className="text-zinc-500 mb-8 pb-8 border-b border-white/10">1 empresa, até X usuários.</p>
                <ul className="space-y-5 mb-10 flex-1">
                  <li className="flex gap-4 text-zinc-300 font-medium"><CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" /> Leads + Kanban</li>
                  <li className="flex gap-4 text-zinc-300 font-medium"><CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" /> Dashboard essencial</li>
                  <li className="flex gap-4 text-zinc-300 font-medium"><CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" /> Suporte padrão</li>
                </ul>
                <a href="#demo" className="w-full block text-center py-4 rounded-md border-2 border-white/10 text-white hover:bg-white hover:text-black font-bold uppercase tracking-wider transition-colors">
                  Começar
                </a>
              </div>

              {/* Pro */}
              <div className="bg-[#111] border-2 border-[#ff7b00] p-10 rounded-2xl flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(255,123,0,0.15)] z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ff7b00] text-black text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full">
                  Mais Vendido
                </div>
                <h3 className="text-2xl font-bold text-[#ff7b00] mb-2">Pro</h3>
                <p className="text-zinc-400 mb-8 pb-8 border-b border-[#ff7b00]/20">A gestão madura com automação I.A.</p>
                <ul className="space-y-5 mb-10 flex-1">
                  <li className="flex gap-4 text-white font-medium"><Zap className="w-5 h-5 text-[#ff7b00] shrink-0" /> WhatsApp Oficial (integração)</li>
                  <li className="flex gap-4 text-white font-medium"><Zap className="w-5 h-5 text-[#ff7b00] shrink-0" /> Chatbot com fluxos ativos</li>
                  <li className="flex gap-4 text-white font-medium"><Zap className="w-5 h-5 text-[#ff7b00] shrink-0" /> Financeiro + métricas (MRR/CAC/LTV)</li>
                  <li className="flex gap-4 text-white font-medium"><Zap className="w-5 h-5 text-[#ff7b00] shrink-0" /> Automações e tags de prioridade</li>
                </ul>
                <a href="#demo" className="w-full block text-center py-4 rounded-md bg-[#ff7b00] text-black hover:bg-white font-black uppercase tracking-wider transition-colors shadow-lg">
                  Começar Agora
                </a>
              </div>

              {/* Scale */}
              <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-2xl flex flex-col hover:border-white/20 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-2">Scale</h3>
                <p className="text-zinc-500 mb-8 pb-8 border-b border-white/10">A operação ilimitada e Enterprise.</p>
                <ul className="space-y-5 mb-10 flex-1">
                  <li className="flex gap-4 text-zinc-300 font-medium"><Server className="w-5 h-5 text-zinc-500 shrink-0" /> Multiempresa + RBAC completo</li>
                  <li className="flex gap-4 text-zinc-300 font-medium"><Server className="w-5 h-5 text-zinc-500 shrink-0" /> Webhooks, integrações avançadas</li>
                  <li className="flex gap-4 text-zinc-300 font-medium"><Server className="w-5 h-5 text-zinc-500 shrink-0" /> Observabilidade e SLA customizado</li>
                  <li className="flex gap-4 text-zinc-300 font-medium"><Server className="w-5 h-5 text-zinc-500 shrink-0" /> Consultoria de setup dedicada</li>
                </ul>
                <a href="#demo" className="w-full block text-center py-4 rounded-md border-2 border-white/10 text-white hover:bg-white hover:text-black font-bold uppercase tracking-wider transition-colors">
                  Falar c/ Especialista
                </a>
              </div>
            </div>
          </div>
        </section >

        {/* 10) FAQ */}
        < section id="faq" className="py-24 px-6 bg-[#050505] border-y border-white/5" >
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-16">Perguntas frequentes</h2>
            <div className="space-y-6">
              {FAQS.map((faq, i) => (
                <details key={i} className="group bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="cursor-pointer p-6 flex items-center justify-between font-bold text-lg text-white hover:text-[#ff7b00] outline-none">
                    <span>{faq.p}</span>
                    <ChevronDown className="w-6 h-6 text-zinc-500 group-open:text-[#ff7b00] group-open:rotate-180 transition-all duration-300" />
                  </summary>
                  <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                    <p>{faq.r}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section >

        {/* 11 & BLOCO FINAL DE CONVERSÃO ) CTA FINAL E FORMULÁRIO */}
        < section id="demo" className="py-24 px-6 relative bg-gradient-to-b from-[#0a0a0a] to-[#000000]" >
          <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-16 items-center">

            <div className="lg:w-1/2 text-left">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1]">
                Pronto para transformar atendimento em <span className="text-[#ff7b00]">receita previsível?</span>
              </h2>
              <p className="text-xl text-zinc-400 mb-10 font-light leading-relaxed">
                Teste e veja seus números em tempo real: conversão, pipeline, MRR, churn, CAC e LTV num só painel inteligente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-[#ff7b00] hover:bg-orange-500 text-black font-black uppercase tracking-wider py-5 px-10 rounded-md transition-colors text-center shadow-[0_0_20px_rgba(255,123,0,0.3)]">
                  Testar grátis
                </Link>
                <a href="#demo" className="border border-white/20 text-white font-bold py-5 px-10 rounded-md hover:bg-white/5 transition-colors text-center uppercase tracking-wider">
                  Agendar demo no WhatsApp
                </a>
              </div>
              <p className="text-sm text-zinc-500 mt-6 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#27c93f]" /> Resposta em até 10 minutos no horário comercial.
              </p>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="bg-[#050505] border-2 border-[#222] p-8 md:p-12 rounded-2xl shadow-2xl relative">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#ff7b00]/10 blur-[150px] rounded-full pointer-events-none"></div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">Receba uma Demonstração</h3>
                <form className="space-y-5">
                  <div>
                    <input type="text" placeholder="Nome completo" className="w-full bg-[#111] border border-[#333] rounded-lg px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff7b00] transition-colors" required />
                  </div>
                  <div>
                    <input type="text" placeholder="Empresa" className="w-full bg-[#111] border border-[#333] rounded-lg px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff7b00] transition-colors" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input type="tel" placeholder="Telefone (com DDD)" className="w-full bg-[#111] border border-[#333] rounded-lg px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff7b00] transition-colors" required />
                    <input type="text" placeholder="CPF ou CNPJ" className="w-full bg-[#111] border border-[#333] rounded-lg px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff7b00] transition-colors" required />
                  </div>
                  <div>
                    <input type="email" placeholder="E-mail" className="w-full bg-[#111] border border-[#333] rounded-lg px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff7b00] transition-colors" required />
                  </div>
                  <div>
                    <select className="w-full bg-[#111] border border-[#333] rounded-lg px-5 py-4 text-zinc-400 focus:outline-none focus:border-[#ff7b00] transition-colors appearance-none cursor-pointer" defaultValue="">
                      <option value="" disabled>Faixa de faturamento (opcional)</option>
                      <option value="1">Até R$ 50k / mês</option>
                      <option value="2">R$ 50k a 200k / mês</option>
                      <option value="3">Acima de R$ 200k / mês</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-[#ff7b00] text-black font-black uppercase tracking-wider py-5 mt-4 rounded-lg hover:bg-orange-500 transition-colors flex justify-center items-center gap-2">
                    Quero a Demo <ChevronRight className="w-5 h-5" />
                  </button>
                </form>
                <p className="text-xs text-zinc-600 mt-6 text-center leading-relaxed font-medium">
                  Ao enviar, você concorda com nossa Política de Privacidade e uso dos dados para contato pela Equipe [NOME DO SAAS].
                </p>
              </div>
            </div>

          </div>
        </section >

        {/* 12) RODAPÉ / COMPLIANCE */}
        < footer className="py-12 bg-[#000000] border-t border-[#111]" >
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="FLY UP Web" className="h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all drop-shadow-md" />
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-zinc-600">
              <a href="#" className="hover:text-[#ff7b00] transition-colors">Termos</a>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-800"></span>
              <a href="#" className="hover:text-[#ff7b00] transition-colors">Privacidade</a>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-800"></span>
              <a href="#" className="hover:text-[#ff7b00] transition-colors">LGPD</a>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-800"></span>
              <a href="#" className="hover:text-[#ff7b00] transition-colors">Contato / Suporte</a>
            </div>

            <div className="text-xs text-zinc-700 font-bold tracking-widest uppercase">
              &copy; {new Date().getFullYear()} [NOME DO SAAS]. TODOS OS DIREITOS RESERVADOS.
            </div>
          </div>
        </footer >

      </main >
    </div >
  )
}
