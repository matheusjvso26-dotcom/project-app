import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronRight, Layers, MessageSquare, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white">

      {/* Soft Ambient Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#ff7b00]/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* Premium Header */}
      <header className="relative z-50 pt-10 pb-6">
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">

          {/* Logo Grande - Canto Esquerdo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="FLY UP CRM"
              className="h-16 md:h-20 lg:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_20px_rgba(255,123,0,0.2)]"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-12 text-sm font-medium text-zinc-400">
            <Link href="#recursos" className="hover:text-white transition-colors">Funcionalidades</Link>
            <Link href="#solucao" className="hover:text-white transition-colors">Plataforma</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Planos e Preços</Link>
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-white hover:text-[#ff7b00] transition-colors">
              Login
            </Link>
            <Link href="/register" className="text-sm font-bold text-black uppercase tracking-wider bg-[#ff7b00] px-8 py-3.5 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(255,123,0,0.2)]">
              Teste Grátis
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* HERO SECTION - Minimalista, Clean e Premium */}
        <section className="pt-24 pb-32 px-8 max-w-[1200px] mx-auto flex flex-col items-center text-center">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-10">
            <span className="w-2 h-2 rounded-full bg-[#ff7b00]"></span> O novo padrão em CRM B2B
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-8 max-w-4xl">
            Controle supremo sobre as <span className="text-[#ff7b00]">suas Vendas.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-14 font-light">
            Esqueça o caos de dezenas de abas abertas. A FLY UP unifica a comunicação da sua equipe, converte conversas em fluxo de caixa visual e automatiza o que importa. Simples, elegante e focado em lucro.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/register" className="w-full sm:w-auto bg-[#ff7b00] text-black font-black uppercase tracking-widest text-sm py-5 px-10 rounded-full hover:bg-white transition-colors duration-300">
              Começar Agora (7 Dias Grátis)
            </Link>
          </div>

          <p className="mt-8 text-xs font-bold tracking-widest uppercase text-zinc-600">
            Sem cartão de crédito &bull; Setup Imediato
          </p>

        </section>

        {/* ELEGANT FEATURES - Espaçamento Generoso */}
        <section id="recursos" className="py-32 bg-[#050505] border-y border-white/5">
          <div className="max-w-[1200px] mx-auto px-8">

            <div className="mb-24 md:w-2/3">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
                Exclusivo, rápido e <br className="hidden md:block" /> projetado para escalar.
              </h2>
              <p className="text-xl text-zinc-500 font-light max-w-lg">
                Módulos primários essenciais. Sem dezenas de abas inúteis, apenas as engrenagens que multiplicam o seu faturamento.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">

              {/* Feature 1 */}
              <div className="group">
                <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#ff7b00]/10 group-hover:border-[#ff7b00]/30 transition-all">
                  <MessageSquare className="w-6 h-6 text-[#ff7b00]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Inbox Único</h3>
                <p className="text-zinc-500 leading-relaxed font-light">
                  Toda sua equipe respondendo os clientes num mesmo número de WhatsApp. Conexão via API Oficial, estável e livre de banimentos surpresas da operadora.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group">
                <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#ff7b00]/10 group-hover:border-[#ff7b00]/30 transition-all">
                  <Layers className="w-6 h-6 text-[#ff7b00]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Pipeline Financeiro</h3>
                <p className="text-zinc-500 leading-relaxed font-light">
                  O Kanban não é só visual, é calculista. Conforme os leads avançam nas tratativas de funil, você lê instantaneamente a estimativa exata de receita gerada.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group">
                <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#ff7b00]/10 group-hover:border-[#ff7b00]/30 transition-all">
                  <Zap className="w-6 h-6 text-[#ff7b00]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Múltiplas Automações</h3>
                <p className="text-zinc-500 leading-relaxed font-light">
                  Robôs lógicos que enviam mensagens automáticas e construtores de fluxogramas (Flow) para criar cadências de abandono de oferta ou boas-vindas.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* IN-DEPTH HIGHLIGHTS - Layout de Respiro */}
        <section id="solucao" className="py-32">
          <div className="max-w-[1200px] mx-auto px-8 space-y-40">

            {/* Block 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="w-full lg:w-1/2">
                <div className="text-[#ff7b00] font-black uppercase tracking-widest text-xs mb-6">Velocidade de Conversão</div>
                <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
                  O melhor do WhatsApp.<br /> Sem a desordem do WhatsApp.
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed font-light mb-8">
                  Separe e defina com cores e prioridades automáticas os leads novos, pendentes de resposta ou em conversão final. Um ambiente projetado para sua equipe de vendas se concentrar nos fechamentos verdadeiramente importantes, um de cada vez.
                </p>
                <Link href="/register" className="inline-flex items-center gap-2 text-white font-bold text-sm tracking-wider uppercase border-b border-[#ff7b00] pb-1 hover:text-[#ff7b00] transition-colors">
                  Ver Inbox Profissional
                </Link>
              </div>
              {/* Imagem ou Abstrato Premium - Placeholder Preto Rico com Linhas Laranja */}
              <div className="w-full lg:w-1/2 aspect-video bg-[#0a0a0a] border border-white/5 rounded-3xl relative overflow-hidden shadow-2xl flex items-center justify-center group">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#ff7b00]/5 to-transparent z-0"></div>
                <div className="w-2/3 h-2/3 border border-white/5 bg-[#111] rounded-xl z-10 flex flex-col p-4 shadow-xl transform group-hover:scale-105 transition-transform duration-700">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
                    <div className="h-3 w-32 bg-zinc-800 rounded"></div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-2 w-3/4 bg-zinc-800 rounded"></div>
                    <div className="h-2 w-1/2 bg-zinc-800 rounded"></div>
                    <div className="h-2 w-5/6 bg-zinc-800 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 2 */}
            <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
              <div className="w-full lg:w-1/2 aspect-[4/3] bg-[#0a0a0a] border border-white/5 rounded-3xl relative overflow-hidden shadow-2xl flex items-center justify-center group">
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#ff7b00]/5 to-transparent z-0"></div>
                <div className="w-3/4 h-2/3 border border-white/5 bg-[#111] rounded-xl z-10 p-6 flex gap-4 shadow-xl transform group-hover:-translate-y-2 transition-transform duration-700">
                  <div className="w-1/2 bg-black/50 rounded-lg p-3">
                    <div className="h-2 w-20 bg-zinc-700 rounded mb-4"></div>
                    <div className="h-10 bg-zinc-800 border border-white/5 rounded-md mb-2"></div>
                    <div className="h-10 bg-zinc-800 border border-white/5 rounded-md"></div>
                  </div>
                  <div className="w-1/2 bg-black/50 rounded-lg p-3 border border-[#ff7b00]/20 relative">
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#ff7b00] rounded-full shadow-[0_0_10px_#ff7b00] animate-bounce"></div>
                    <div className="h-2 w-20 bg-zinc-700 rounded mb-4"></div>
                    <div className="h-10 bg-zinc-800 border border-[#ff7b00]/20 rounded-md mb-2"></div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="text-[#ff7b00] font-black uppercase tracking-widest text-xs mb-6">Pipeline Kanban</div>
                <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
                  Transparência e previsibilidade financeira absoluta.
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed font-light mb-8">
                  Cada oportunidade não é só um nome de cliente; representa uma injeção de capital iminente. Conforme sua equipe movimenta os blocos dentro do sistema de negociação, você mapeia integralmente onde a empresa faturará naquele mês.
                </p>
                <Link href="/register" className="inline-flex items-center gap-2 text-white font-bold text-sm tracking-wider uppercase border-b border-[#ff7b00] pb-1 hover:text-[#ff7b00] transition-colors">
                  Explorar Gestão Financeira
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* PRICING - Premium Elegance */}
        <section id="pricing" className="py-32 bg-[#050505] border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">Licenciamento.</h2>
              <p className="text-xl text-zinc-500 font-light max-w-xl">
                Planos concisos. Todos com acesso imediato às ferramentas Core da FLY UP, formatados pela sua escalabilidade estrutural.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-stretch pt-4">

              {/* Starter */}
              <div className="bg-black border border-white/10 rounded-2xl p-10 flex flex-col hover:border-white/30 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <p className="text-zinc-500 font-light mb-8 h-12">Para gestores independentes.</p>
                <div className="mb-10">
                  <span className="text-5xl font-black text-white">R$ 97</span>
                  <span className="text-zinc-600 font-bold ml-2">/mês</span>
                </div>
                <ul className="space-y-5 mb-12 flex-1">
                  <li className="flex gap-4 text-zinc-400 font-light"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />1 Acesso Master</li>
                  <li className="flex gap-4 text-zinc-400 font-light"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />Inbox do WhatsApp unificado</li>
                  <li className="flex gap-4 text-zinc-400 font-light"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />Pipeline Trello (Kanban)</li>
                </ul>
                <Link href="/register" className="w-full py-4 rounded-xl border border-white/20 text-white font-bold uppercase tracking-wider text-xs text-center hover:bg-white hover:text-black transition-all">
                  Assinar Edição Starter
                </Link>
              </div>

              {/* Pro (Highlighted) */}
              <div className="bg-[#111] border border-[#ff7b00]/50 rounded-2xl p-10 flex flex-col relative shadow-[0_0_50px_rgba(255,123,0,0.05)] scale-100 lg:scale-105 z-10">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#ff7b00] text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Escala de Vendas
                </div>
                <h3 className="text-2xl font-bold text-[#ff7b00] mb-2">Pro</h3>
                <p className="text-zinc-400 font-light mb-8 h-12">Para equipes e demandas massivas.</p>
                <div className="mb-10">
                  <span className="text-5xl font-black text-white">R$ 197</span>
                  <span className="text-zinc-600 font-bold ml-2">/mês</span>
                </div>
                <ul className="space-y-5 mb-12 flex-1">
                  <li className="flex gap-4 text-white font-medium"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Acesso para 5 Colaboradores</li>
                  <li className="flex gap-4 text-zinc-400 font-light"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Módulo de Transmissão Massiva</li>
                  <li className="flex gap-4 text-zinc-400 font-light"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Criador Visual de Robôs</li>
                  <li className="flex gap-4 text-zinc-400 font-light"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Sugestão Contextual de I.A.</li>
                </ul>
                <Link href="/register" className="w-full py-4 rounded-xl bg-[#ff7b00] text-black font-black uppercase tracking-wider text-xs text-center hover:bg-white transition-colors">
                  Assinar Edição Pro
                </Link>
              </div>

              {/* Enterprise */}
              <div className="bg-black border border-white/10 rounded-2xl p-10 flex flex-col hover:border-white/30 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-zinc-500 font-light mb-8 h-12">Monitoria de CFO e Suporte Full.</p>
                <div className="mb-10">
                  <span className="text-5xl font-black text-white">R$ 289</span>
                  <span className="text-zinc-600 font-bold ml-2">/mês</span>
                </div>
                <ul className="space-y-5 mb-12 flex-1">
                  <li className="flex gap-4 text-zinc-400 font-light"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />Membros de Equipe Ilimitados</li>
                  <li className="flex gap-4 text-zinc-400 font-light"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />Relatório C-Level e Fluxo Caixa</li>
                  <li className="flex gap-4 text-zinc-400 font-light"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />Infraestrutura Dedicada</li>
                </ul>
                <Link href="/register" className="w-full py-4 rounded-xl border border-white/20 text-white font-bold uppercase tracking-wider text-xs text-center hover:bg-white hover:text-black transition-all">
                  Consultar Enterprise
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      <footer className="py-16 border-t border-white/5 bg-[#000000] z-10 px-8 text-center sm:text-left">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start opacity-50 hover:opacity-100 transition-opacity">
            <img src="/logo.png" alt="FLY UP CRM" className="h-10 w-auto object-contain mb-4 grayscale hover:grayscale-0 transition-all" />
            <p className="text-xs text-zinc-500 font-light max-w-sm">
              Projetando infraestrutura comercial escalável para operações de alto nível. B2B, B2C e Corporativo focado na nuvem.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-xs text-zinc-600 font-bold uppercase tracking-widest">
            <Link href="#" className="hover:text-[#ff7b00] transition-colors">Documentação</Link>
            <Link href="#" className="hover:text-[#ff7b00] transition-colors">Políticas</Link>
            <Link href="#" className="hover:text-[#ff7b00] transition-colors">Apoio</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
