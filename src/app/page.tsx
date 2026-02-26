import Link from 'next/link'
import { CheckCircle2, Magnet, RefreshCw, Handshake, Heart, ArrowRight, Activity, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white pb-20 overflow-hidden">

      {/* --- HEADER --- */}
      <header className="absolute top-0 left-0 right-0 z-50 border-b border-white/5 bg-transparent">
        <div className="max-w-[1200px] mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="FLY UP CRM"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-[13px] font-bold tracking-widest uppercase text-zinc-400">
            <Link href="#funil" className="hover:text-white transition-colors">Metodologia</Link>
            <Link href="#planos" className="hover:text-white transition-colors">Planos</Link>
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-white hover:text-[#ff7b00] transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="text-sm font-bold text-black bg-[#ff7b00] hover:bg-[#ff8c20] px-6 py-3 rounded-md transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,123,0,0.2)]">
              Saber Mais
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION (UNBOUNCE LAYOUT: 50/50) --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 lg:min-h-[85vh] flex items-center">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ff7b00]/10 blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3"></div>

        <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* Lado Esquerdo: Copy e CTA */}
          <div className="relative z-10 text-left">
            <h1 className="text-5xl md:text-6xl lg:text-[70px] font-black text-white leading-[1.1] mb-6 tracking-tight">
              Converta Mais <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7b00] to-[#ffaa00]">Leads.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-10 font-light">
              Crie fluxos de atendimento com a FLY UP que convertem mais visitantes em clientes do que qualquer outro CRM — e gerencie tudo sem complicação.
            </p>

            <Link href="/register" className="inline-flex bg-[#ff7b00] hover:bg-white text-black font-black uppercase tracking-widest text-sm py-4 px-10 rounded-md transition-colors duration-300 shadow-[0_10px_30px_rgba(255,123,0,0.3)] items-center justify-center gap-2">
              Quero Saber Mais <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="mt-6 text-sm text-zinc-500 font-medium">
              Assine hoje. Nós validaremos seu cadastro e liberaremos seu acesso rapidamente.
            </p>
          </div>

          {/* Lado Direito: Imagem Gráfica Fictícia (Mockup style) */}
          <div className="relative w-full h-[400px] lg:h-[500px] hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#ff7b00]/20 blur-[60px] rounded-full"></div>

              {/* Elementos Flutuantes (Simulando o Hero da Unbounce) */}

              {/* Janela Principal do Software Mockup */}
              <div className="w-[80%] h-[70%] bg-[#050505] rounded-xl border border-white/10 shadow-xl flex flex-col overflow-hidden relative z-10">
                <div className="h-10 bg-[#111] border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="h-6 w-1/3 bg-zinc-800 rounded"></div>
                  <div className="flex gap-4">
                    <div className="flex-1 h-24 bg-zinc-900 rounded-lg border border-white/5"></div>
                    <div className="flex-1 h-24 bg-zinc-900 rounded-lg border border-white/5"></div>
                    <div className="flex-1 h-24 bg-zinc-900 rounded-lg border border-white/5"></div>
                  </div>
                  <div className="h-4 w-1/4 bg-zinc-800 rounded mt-4"></div>
                  <div className="flex-1 bg-zinc-900 rounded-lg border border-white/5"></div>
                </div>
              </div>

              {/* Badge Flutuante 1 (Stats) */}
              <div className="absolute top-[10%] left-[-10%] bg-[#ff7b00] rounded-lg p-5 shadow-[0_15px_30px_rgba(255,123,0,0.3)] animate-[float_6s_ease-in-out_infinite] z-20 flex flex-col items-center border border-[#ffaa00]">
                <TrendingUp className="w-8 h-8 text-black mb-2" />
                <div className="text-3xl font-black text-black">33%<span className="text-lg">↑</span></div>
                <div className="text-xs font-bold text-black/80 uppercase tracking-widest mt-1">Conversões</div>
              </div>

              {/* Badge Flutuante 2 (Stats) */}
              <div className="absolute bottom-[20%] right-[-5%] bg-[#111] rounded-lg p-4 shadow-2xl border border-white/10 animate-[float_8s_ease-in-out_infinite_reverse] z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-md"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                  <div>
                    <div className="text-sm font-bold text-white">Novo Lead Fechado</div>
                    <div className="text-xs text-zinc-500">Há 2 minutos</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* --- FUNIL INBOUND SECTION --- */}
      <section id="funil" className="py-24 bg-[#0a0a0a] border-y border-white/5 relative z-10 px-6">
        <div className="max-w-[1200px] mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">A Máquina Inbound</h2>
            <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto">
              Aplique o funil de marketing e vendas definitivo na sua operação, transformando completos desconhecidos em propagadores fiéis da sua marca.
            </p>
          </div>

          {/* Grid do Funil (Descendo por etapas) */}
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">

            {/* Etapa 1 */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
              <Magnet className="w-10 h-10 text-blue-500 mb-6" />
              <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-2">Fase 1</div>
              <h3 className="text-2xl font-bold text-white uppercase mb-4">Atrair</h3>
              <div className="flex justify-between items-center text-xs font-bold bg-white/5 rounded-full px-4 py-2 mb-6">
                <span className="text-zinc-400 text-[10px] md:text-xs">Desconhecidos</span> <ArrowRight className="w-3 h-3 text-zinc-600" /> <span className="text-blue-400 text-[10px] md:text-xs">Visitantes</span>
              </div>
              <p className="text-zinc-400 font-light text-sm line-clamp-4">
                Trafego orgânico e pago. Use Blogs, Redes Sociais, Otimização (SEO) e Palavras-Chave para chamar a atenção correta.
              </p>
            </div>

            {/* Etapa 2 */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 relative overflow-hidden group hover:border-[#ff7b00]/50 md:mt-6 transition-colors shadow-2xl shadow-[#ff7b00]/5">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#ff7b00]" />
              <RefreshCw className="w-10 h-10 text-[#ff7b00] mb-6" />
              <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-2">Fase 2</div>
              <h3 className="text-2xl font-bold text-white uppercase mb-4">Converter</h3>
              <div className="flex justify-between items-center text-xs font-bold bg-white/5 rounded-full px-4 py-2 mb-6">
                <span className="text-zinc-400 text-[10px] md:text-xs">Visitantes</span> <ArrowRight className="w-3 h-3 text-zinc-600" /> <span className="text-[#ff7b00] text-[10px] md:text-xs">Leads</span>
              </div>
              <p className="text-zinc-400 font-light text-sm line-clamp-4">
                Formulários rápidos, Call-to-actions, Landing Pages magnéticas. Tudo interligado diretamente na sua Caixa de Entrada.
              </p>
            </div>

            {/* Etapa 3 */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 relative overflow-hidden group hover:border-green-500/50 md:mt-12 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
              <Handshake className="w-10 h-10 text-green-500 mb-6" />
              <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-2">Fase 3</div>
              <h3 className="text-2xl font-bold text-white uppercase mb-4">Fechar</h3>
              <div className="flex justify-between items-center text-xs font-bold bg-white/5 rounded-full px-4 py-2 mb-6">
                <span className="text-zinc-400 text-[10px] md:text-xs">Leads</span> <ArrowRight className="w-3 h-3 text-zinc-600" /> <span className="text-green-400 text-[10px] md:text-xs">Clientes</span>
              </div>
              <p className="text-zinc-400 font-light text-sm line-clamp-4">
                E-mail inteligente, Lead Scoring no CRM, Negociações no Kanban e fechamento financeiro sem pontas soltas.
              </p>
            </div>

            {/* Etapa 4 */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8 relative overflow-hidden group hover:border-purple-500/50 md:mt-16 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
              <Heart className="w-10 h-10 text-purple-500 mb-6" />
              <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-2">Fase 4</div>
              <h3 className="text-2xl font-bold text-white uppercase mb-4">Encantar</h3>
              <div className="flex justify-between items-center text-xs font-bold bg-white/5 rounded-full px-4 py-2 mb-6">
                <span className="text-zinc-400 text-[10px] md:text-xs">Clientes</span> <ArrowRight className="w-3 h-3 text-zinc-600" /> <span className="text-purple-400 text-[10px] md:text-xs">Promotores</span>
              </div>
              <p className="text-zinc-400 font-light text-sm line-clamp-4">
                Nutrição após a venda. Mídias Sociais, Eventos, Pesquisas de satisfação e indicação automatizada.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="planos" className="py-24 bg-[#050505] relative z-10 px-6">
        <div className="max-w-[1200px] mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Soluções que Cabem no seu Fluxo de Caixa.</h2>
            <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto">Após realizar o seu Cadastro, nossa equipe de Atendimento chamará você no WhatsApp para configurar e oficializar sua adesão ao software.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">

            {/* PLANO STARTER */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <div className="mb-8">
                  <span className="text-4xl font-black text-white">R$ 97</span>
                  <span className="text-zinc-600 font-medium ml-1">/mês</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> 1 Usuário Comercial</li>
                  <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> Caixa de Entrada Integrada</li>
                  <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> Kanban Financeiro</li>
                </ul>
              </div>
              <Link href="/register" className="block w-full py-4 rounded-md border border-white/10 text-white font-bold text-sm text-center hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                Saber Mais
              </Link>
            </div>

            {/* PLANO PRO (DESTAQUE) */}
            <div className="bg-[#111] border border-[#ff7b00] rounded-2xl p-10 relative flex flex-col justify-between transform md:-translate-y-4 shadow-xl shadow-[#ff7b00]/5">
              <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
                <span className="bg-[#ff7b00] text-black text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Recomendado
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#ff7b00] mb-2">Pro Equipes</h3>
                <div className="mb-8">
                  <span className="text-5xl font-black text-white">R$ 197</span>
                  <span className="text-zinc-500 font-medium ml-1">/mês</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" /> Até 5 Usuários</li>
                  <li className="flex gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" /> Construtor de Robôs Inbound</li>
                  <li className="flex gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" /> Disparos em Massa</li>
                </ul>
              </div>
              <Link href="/register" className="block w-full py-4 rounded-md bg-[#ff7b00] text-black font-black text-sm text-center hover:bg-white transition-all uppercase tracking-widest">
                Saber Mais
              </Link>
            </div>

            {/* PLANO ENTERPRISE */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Enterprise Max</h3>
                <div className="mb-8">
                  <span className="text-4xl font-black text-white">R$ 289</span>
                  <span className="text-zinc-600 font-medium ml-1">/mês</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> Equipe Ilimitada</li>
                  <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> Inteligência Artificial</li>
                  <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> Suporte VIP Priority</li>
                </ul>
              </div>
              <Link href="/register" className="block w-full py-4 rounded-md border border-white/10 text-white font-bold text-sm text-center hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                Saber Mais
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER SIMPLIFICADO --- */}
      <footer className="py-12 border-t border-white/5 bg-[#050505]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <img src="/logo.png" alt="FLY UP CRM" className="h-8 w-auto mx-auto mb-6 grayscale opacity-30" />
          <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
            &copy; {new Date().getFullYear()} FLY UP SOFTWARE TECNOLOGIA. TODOS OS DIREITOS RESERVADOS.
          </p>
        </div>
      </footer>
    </div>
  )
}
