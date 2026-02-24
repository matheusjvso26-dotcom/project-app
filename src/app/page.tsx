import Link from 'next/link'
import { ArrowRight, CheckCircle2, Bot, Layers, Zap, MessageSquare, BarChart3, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white">
      {/* Header / Navbar */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff7b00] to-[#e65a00] flex items-center justify-center shadow-lg shadow-[#ff7b00]/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            FLY UP CRM
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-white transition-colors">Recursos</a>
            <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors hidden sm:block">
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-36 pb-20 px-6 relative overflow-hidden flex flex-col items-center">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#ff7b00]/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto text-center relative z-10 w-full flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#ff7b00] mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#ff7b00] animate-pulse"></span>
              Versão 2.0 Disponível
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1] mb-8 max-w-5xl">
              Automatize o WhatsApp e <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7b00] to-[#ffaa00]">escale as vendas.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
              O CRM construído para operações de alta velocidade. Caixa de Entrada com IA, Automação Visual e CRM Kanban engatados. Tudo num só lugar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-[#ff7b00] hover:bg-[#e66a00] text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-[#ff7b00]/25">
                Começar Grátis agora <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-full flex items-center justify-center transition-colors">
                Conhecer Plataforma
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 px-6 border-t border-white/5 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">A central do seu faturamento</h2>
              <p className="text-lg text-zinc-400">Não pague por ferramentas separadas de chat, e-mail e Kanban. Unificamos tudo em uma experiência relâmpago.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#151515] border border-white/5 p-8 rounded-3xl hover:border-white/10 hover:bg-[#1a1a1a] transition-colors">
                <div className="w-14 h-14 bg-[#ff7b00]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#ff7b00]/20">
                  <MessageSquare className="w-7 h-7 text-[#ff7b00]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Caixa de Entrada com IA</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Converse com todos os clientes numa única tela e acione nosso agente integrado OpenAI para sugerir mensagens altamente conversivas.
                </p>
              </div>

              <div className="bg-[#151515] border border-white/5 p-8 rounded-3xl hover:border-white/10 hover:bg-[#1a1a1a] transition-colors">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                  <Bot className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Flow Builder de Chatbots</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Crie árvores de respostas automáticas sem código usando um canvas drag and drop idêntico ao flowbuilder de automações das gigantes.
                </p>
              </div>

              <div className="bg-[#151515] border border-white/5 p-8 rounded-3xl hover:border-white/10 hover:bg-[#1a1a1a] transition-colors">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                  <Layers className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Kanban Real-Time</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Leads novos no WhatsApp geram "Business Deals" imediatos. Arraste cards num board responsivo que já calcula seus lucros no topo.
                </p>
              </div>

              <div className="bg-[#151515] border border-white/5 p-8 rounded-3xl hover:border-white/10 hover:bg-[#1a1a1a] transition-colors">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                  <Zap className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Campanhas em Massa</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Faça upload da sua base .xlsx de "leads frios" ou clientes antigos e reinicie milhares de conversas com um painel de processamento unificado.
                </p>
              </div>

              <div className="bg-[#151515] border border-white/5 p-8 rounded-3xl hover:border-white/10 hover:bg-[#1a1a1a] transition-colors">
                <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 border border-yellow-500/20">
                  <BarChart3 className="w-7 h-7 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Dashboards Preditos CFO</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Não seja cego com seu dinheiro. O Fly UP detecta suas conversões prévias para projetar a Receita Recorrente e seu Retorno Sobre o Investimento.
                </p>
              </div>

              <div className="bg-[#151515] border border-white/5 p-8 rounded-3xl hover:border-white/10 hover:bg-[#1a1a1a] transition-colors">
                <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 border border-pink-500/20">
                  <Users className="w-7 h-7 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Gestão de Privilégios (Equipe)</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Dê cargos diferentes para sua operação. Permita que Closers fechem oportunidades e restringe SDRs de apagar históricos essenciais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Options */}
        <section id="pricing" className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Mude o patamar da sua rotina</h2>
              <p className="text-lg text-zinc-400 max-w-xl mx-auto">Valores desenhados parar escalar perfeitamente com sua operação sem te cobrar absurdos por cada linha de banco.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
              {/* Starter */}
              <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-10 flex flex-col justify-between">
                <div>
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-white inline flex-col">Starter</h3>
                  </div>
                  <p className="text-zinc-400 mb-8 mt-2 line-clamp-2 h-10">Perfeito para quem trabalha sozinho vendendo ou prestando serviços.</p>
                  <div className="mb-8 flex items-end gap-1">
                    <span className="text-5xl font-extrabold text-white">R$ 0</span>
                    <span className="text-zinc-500 font-medium pb-1.5">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-zinc-300 items-start">
                      <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                      <span>Licença para 1 Usuário Mestre</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start">
                      <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                      <span>Quadro Kanban Ilimitado</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start">
                      <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                      <span>1 Número/Sessão de WhatsApp</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded-full border border-white/10 bg-white/5 text-white font-semibold text-center hover:bg-white/10 transition-colors">
                  Começar Grátis
                </Link>
              </div>

              {/* Pro */}
              <div className="bg-[#161616] border border-[#ff7b00]/30 rounded-3xl p-10 flex flex-col justify-between relative shadow-2xl shadow-[#ff7b00]/10 transform scale-100 lg:scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ff7b00] to-[#e65a00] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  MAIS ESCOLHIDO
                </div>
                <div>
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-[#ff7b00]">Pro</h3>
                  </div>
                  <p className="text-zinc-400 mb-8 mt-2 line-clamp-2 h-10">Para equipes de prospecção pesada que precisam de ferramentas completas.</p>
                  <div className="mb-8 flex items-end gap-1">
                    <span className="text-5xl font-extrabold text-white">R$ 197</span>
                    <span className="text-zinc-500 font-medium pb-1.5">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-white font-medium items-start">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Até 5 colaboradores logados</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Módulo IA: Whisper e ChatGPT Inbox</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Flow Builder Visual de Chatbots</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Disparos em massa ilimitados</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded-full bg-[#ff7b00] text-white font-semibold text-center hover:bg-[#e66a00] transition-colors shadow-lg shadow-[#ff7b00]/25">
                  Criar Conta Pro
                </Link>
              </div>

              {/* Enterprise */}
              <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-10 flex flex-col justify-between">
                <div>
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-white">Enterprise</h3>
                  </div>
                  <p className="text-zinc-400 mb-8 mt-2 line-clamp-2 h-10">O pacote da liderança para faturamentos múltiplos com suporte irrestrito.</p>
                  <div className="mb-8 flex items-end gap-1">
                    <span className="text-5xl font-extrabold text-white">R$ 500+</span>
                    <span className="text-zinc-500 font-medium pb-1.5">/projeto</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-zinc-300 items-start">
                      <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                      <span>Equipe ilimitada</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start">
                      <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                      <span>Domínios / White Label</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start">
                      <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                      <span>Suporte Especializado 24h</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded-full border border-white/10 bg-white/5 text-white font-semibold text-center hover:bg-white/10 transition-colors">
                  Falar com Vendas
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative border border-[#ff7b00]/20 bg-[#ff7b00]/5">
            <div className="relative p-12 md:p-20 text-center flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Pare de perder dinheiro e controle os leads.</h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-2xl">Mais de R$2 milhões já foram recuperados por clientes utilizando gatilhos e chat imediato. Teste nosso CRM 100% grátis.</p>
              <Link href="/register" className="px-10 py-5 bg-[#ff7b00] text-white font-bold rounded-full hover:scale-105 hover:bg-[#e66a00] transition-all inline-flex items-center gap-2 shadow-xl shadow-[#ff7b00]/20 text-lg">
                Entrar na Plataforma Agora <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold tracking-tight opacity-80">
            <Bot className="w-5 h-5" />
            FLY UP CRM
          </div>
          <div className="text-sm text-zinc-600 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} FLY UP Tech LTDA. CNPJ Protegido.
          </div>
          <div className="flex gap-6 text-sm text-zinc-600 font-medium">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade e LGPD</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

