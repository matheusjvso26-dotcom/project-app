import Link from 'next/link'
import { CheckCircle2, Zap, ShieldCheck, Activity, ArrowRight, Layers } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white">

      {/* --- HEADER SIMPLIFICADO --- */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="FLY UP CRM"
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</Link>
            <Link href="#planos" className="hover:text-white transition-colors">Planos</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-white hover:text-[#ff7b00] transition-colors">
              Entrar
            </Link>
            <Link href="#planos" className="text-sm font-bold text-black bg-[#ff7b00] hover:bg-[#ff8c20] px-6 py-2.5 rounded-full transition-all flex items-center gap-2">
              Assinar Agora <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">

        {/* --- HERO SECTION DIRETO AO PONTO --- */}
        <section className="px-6 max-w-[1000px] mx-auto text-center relative z-10 pt-10 md:pt-20">
          {/* Glow Subtle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#ff7b00]/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-zinc-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#ff7b00] animate-pulse"></span> CRM B2B de Alta Conversão
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
            Transforme seu WhatsApp em uma <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7b00] to-[#ffaa00]">Máquina de Vendas.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            Pare de perder clientes no meio das conversas. Organize, automatize e escale suas vendas com o CRM profissional mais rápido do mercado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#planos" className="w-full sm:w-auto bg-[#ff7b00] hover:bg-white text-black font-black uppercase tracking-widest text-sm py-4 px-10 rounded-full transition-colors duration-300 shadow-[0_0_30px_rgba(255,123,0,0.3)] flex items-center justify-center gap-2">
              Ver Planos e Assinar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="mt-6 text-xs text-zinc-500 uppercase tracking-widest">
            Configuração rápida em 5 minutos.
          </p>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="como-funciona" className="py-32 px-6 max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Tudo que você precisa para vender mais.</h2>
            <p className="text-zinc-400 text-lg">Sem complexidade. Feito por e para quem fecha negócios todos os dias.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[24px] hover:border-[#ff7b00]/30 transition-colors">
              <div className="w-14 h-14 bg-[#ff7b00]/10 rounded-2xl flex items-center justify-center text-[#ff7b00] mb-8">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Kanban Financeiro</h3>
              <p className="text-zinc-500 font-light leading-relaxed">Arraste os cards de clientes pelas etapas de venda e saiba exatamente quanto dinheiro está previsto para entrar no mês.</p>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[24px] hover:border-[#ff7b00]/30 transition-colors">
              <div className="w-14 h-14 bg-[#ff7b00]/10 rounded-2xl flex items-center justify-center text-[#ff7b00] mb-8">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Automação Simples</h3>
              <p className="text-zinc-500 font-light leading-relaxed">Responda seus clientes 24h por dia. Crie menus interativos e capture o contato antes de passar para um atendente humano.</p>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[24px] hover:border-[#ff7b00]/30 transition-colors">
              <div className="w-14 h-14 bg-[#ff7b00]/10 rounded-2xl flex items-center justify-center text-[#ff7b00] mb-8">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Caixa de Entrada Única</h3>
              <p className="text-zinc-500 font-light leading-relaxed">Coloque todos os seus vendedores no mesmo número de WhatsApp. Mantenha o histórico salvo e o controle total do seu comercial.</p>
            </div>

          </div>
        </section>

        {/* --- PRICING SECTION --- */}
        <section id="planos" className="py-24 bg-[#020202] border-y border-white/5 relative z-10 px-6">
          <div className="max-w-[1200px] mx-auto">

            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Escolha o seu plano.</h2>
              <p className="text-lg text-zinc-400 font-light">Evolua sua estrutura com planos sem pegadinhas. Ao se cadastrar, nossa equipe entrará em contato para liberar seu acesso.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">

              {/* PLANO STARTER */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                  <p className="text-zinc-500 text-sm mb-8 line-clamp-2">Para quem está dando o primeiro passo na profissionalização.</p>
                  <div className="mb-8">
                    <span className="text-4xl font-black text-white">R$ 97</span>
                    <span className="text-zinc-600 font-medium ml-1">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> 1 Usuário Comercial</li>
                    <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> Caixa de Entrada Integrada</li>
                    <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> Kanban de Oportunidades</li>
                  </ul>
                </div>
                <Link href="/register" className="block w-full py-4 rounded-xl border border-white/10 text-white font-bold text-sm text-center hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                  Assinar Starter
                </Link>
              </div>

              {/* PLANO PRO (DESTAQUE) */}
              <div className="bg-[#111] border-2 border-[#ff7b00] rounded-3xl p-10 relative flex flex-col justify-between transform md:-translate-y-4 shadow-2xl shadow-[#ff7b00]/10">
                <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
                  <span className="bg-[#ff7b00] text-black text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    Mais Popular
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#ff7b00] mb-2">Pro Equipes</h3>
                  <p className="text-zinc-400 text-sm mb-8 line-clamp-2">Ideal para operações ativas e equipes de vendas em crescimento.</p>
                  <div className="mb-8">
                    <span className="text-5xl font-black text-white">R$ 197</span>
                    <span className="text-zinc-500 font-medium ml-1">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    <li className="flex gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" /> Até 5 Usuários</li>
                    <li className="flex gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" /> Robôs Drag & Drop (Ilimitados)</li>
                    <li className="flex gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" /> Envios Massivos de Campanhas</li>
                    <li className="flex gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" /> Módulo Financeiro CFO</li>
                  </ul>
                </div>
                <Link href="/register" className="block w-full py-4 rounded-xl bg-[#ff7b00] text-black font-black text-sm text-center hover:bg-white transition-all uppercase tracking-widest">
                  Assinar Pro
                </Link>
              </div>

              {/* PLANO ENTERPRISE */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Enterprise Max</h3>
                  <p className="text-zinc-500 text-sm mb-8 line-clamp-2">Para call centers e megaoperações que exigem poder ilimitado.</p>
                  <div className="mb-8">
                    <span className="text-4xl font-black text-white">R$ 289</span>
                    <span className="text-zinc-600 font-medium ml-1">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> Usuários Ilimitados</li>
                    <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> Inteligência Artificial (Whisper)</li>
                    <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" /> Suporte Dedicado Prioritário</li>
                  </ul>
                </div>
                <Link href="/register" className="block w-full py-4 rounded-xl border border-white/10 text-white font-bold text-sm text-center hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                  Assinar Enterprise
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER SIMPLIFICADO --- */}
      <footer className="py-12 border-t border-white/5 bg-[#050505]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <img src="/logo.png" alt="FLY UP CRM" className="h-10 w-auto mx-auto mb-6 grayscale opacity-50" />
          <p className="text-xs text-zinc-600 font-medium uppercase tracking-widest">
            &copy; {new Date().getFullYear()} FLY UP SOFTWARE TECNOLOGIA. TODOS OS DIREITOS RESERVADOS.
          </p>
        </div>
      </footer>
    </div>
  )
}
