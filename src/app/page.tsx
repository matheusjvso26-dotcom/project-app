import Link from 'next/link'
import { CheckCircle2, Bot, Layers, Zap, MessageSquare, BarChart3, Users, ArrowRight, Activity, Terminal, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white overflow-x-hidden">

      {/* Grid Pattern Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff7b00]/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Header / Navbar */}
      <header className="relative z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="FLY UP CRM" className="h-12 w-auto object-contain" />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#inicio" className="text-white hover:text-[#ff7b00] transition-colors">Início</Link>
            <Link href="#recursos" className="hover:text-white transition-colors">Recursos</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Preços</Link>
            <Link href="#contato" className="hover:text-white transition-colors">Contato</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-white uppercase tracking-wider border border-white/10 hover:border-[#ff7b00] hover:text-[#ff7b00] px-5 py-2.5 rounded-full transition-all flex items-center gap-2 bg-white/5">
              <ShieldCheck className="w-4 h-4" /> Acessar Sistema
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* Centralized Hero Section */}
        <section id="inicio" className="pt-24 pb-16 px-6 relative flex flex-col items-center text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ff7b00]/30 bg-[#ff7b00]/10 text-[#ff7b00] text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(255,123,0,0.1)]">
            <Zap className="w-3.5 h-3.5" /> O Upgrade que sua operação merece
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter max-w-4xl mx-auto mb-6">
            TRANSFORME A <span className="text-[#ff7b00] drop-shadow-[0_0_30px_rgba(255,123,0,0.4)]">OPERAÇÃO DE VENDAS</span> DA SUA EQUIPE
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Elimine o caos no WhatsApp com automação inteligente B2B. <br className="hidden md:block" /> Um CRM que integra fluxos dinâmicos para você faturar de verdade.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
            <Link href="/register" className="bg-[#ff7b00] hover:bg-[#e66a00] text-black font-black uppercase tracking-wider py-4 px-8 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,123,0,0.3)]">
              Iniciar Avaliação (7 Dias)
            </Link>
            <Link href="#pricing" className="bg-transparent border border-white/20 text-white font-bold uppercase tracking-wider py-4 px-8 rounded-full transition-all hover:bg-white/5">
              Ver Planos
            </Link>
          </div>

          {/* Pulsing/Animated Logo Showcase */}
          <div className="relative w-full max-w-4xl mx-auto mt-12 mb-20 flex justify-center items-center group">
            {/* Behind Glowing Effect */}
            <div className="absolute inset-0 bg-[#ff7b00]/20 blur-[100px] rounded-full animate-pulse z-0 scale-75 group-hover:bg-[#ff7b00]/30 transition-all duration-700" />
            {/* The Logo itself */}
            <img
              src="/logo.png"
              alt="FLY UP CRM Sistema"
              className="w-full max-w-md md:max-w-xl object-contain relative z-10 drop-shadow-[0_10px_50px_rgba(255,123,0,0.5)] transform hover:scale-110 transition-transform duration-700 ease-in-out animate-[pulse_4s_ease-in-out_infinite]"
            />

            {/* UI Mock Elements surrounding the logo to look like a tool */}
            <div className="absolute -left-10 top-1/4 bg-[#111] border border-white/5 p-4 rounded-xl shadow-2xl z-20 hidden md:flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-10 h-10 bg-[#ff7b00]/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-[#ff7b00] w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white font-bold">Automação Ativa</p>
                <p className="text-[10px] text-zinc-500">Há 2 minutos</p>
              </div>
            </div>

            <div className="absolute -right-5 bottom-1/4 bg-[#111] border border-white/5 p-4 rounded-xl shadow-2xl z-20 hidden md:flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Zap className="text-green-500 w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white font-bold">Venda Fechada!</p>
                <p className="text-[10px] text-zinc-500">R$ 15.000,00</p>
              </div>
            </div>
          </div>

        </section>

        {/* Logo Carousel (Trust symbols) */}
        <section className="py-10 border-y border-white/5 bg-black/40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-zinc-500 uppercase font-bold tracking-widest mb-8">Ferramentas que integramos ou emulamos</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
              <div className="flex items-center gap-2 font-black text-xl"><MessageSquare className="w-8 h-8" /> Whatsapp API</div>
              <div className="flex items-center gap-2 font-black text-xl"><Terminal className="w-8 h-8" /> Meta Cloud</div>
              <div className="flex items-center gap-2 font-black text-xl"><Layers className="w-8 h-8" /> Kanban Trello</div>
              <div className="flex items-center gap-2 font-black text-xl"><Bot className="w-8 h-8" /> OpenAI GPT-4</div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="recursos" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">

            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">O FUTURO DO SEU ATENDIMENTO</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Experimente o poder da gestão visual fluida, robôs que vendem por você e relatórios que guiam a empresa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto]">

              {/* Box 1 (Big Highlight) */}
              <div className="md:col-span-2 bg-gradient-to-br from-[#ff7b00] to-[#b35600] rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 mb-20 text-black">
                  <div className="bg-black/10 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-6">
                    <Layers className="w-4 h-4" /> Escopo Ilimitado
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter max-w-lg leading-tight">
                    KANBAN DE VENDAS COM CÁLCULO AO VIVO
                  </h3>
                  <p className="mt-4 text-black/80 font-medium max-w-md text-lg">
                    Saiba exatamente quanto dinheiro está na mesa. Mova as propostas de coluna em coluna com segurança.
                  </p>
                </div>
                <div className="relative z-10 flex items-center gap-4 text-black/90 font-bold">
                  <span>Ver Funcionalidade</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>

              {/* Box 2 (Image/Abstract) */}
              <div className="bg-[#111] rounded-3xl overflow-hidden relative group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                {/* Stock image replacement / abstract geometric */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center bg-no-repeat opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="relative z-20 h-full p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Inbox Omnichannel</h3>
                  <p className="text-sm text-zinc-400 mt-2">Uma equipe, uma tela. Sem mais confusão no WhatsApp Web de ninguém.</p>
                </div>
              </div>

              {/* Box 3 (Small Indicator) */}
              <div className="bg-[#111] rounded-3xl p-8 border border-white/5 flex flex-col justify-between hover:border-[#ff7b00]/30 transition-colors">
                <div className="mb-8">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-green-500 w-6 h-6" />
                  </div>
                  <div className="text-white font-bold mb-1">Integrações Resolvidas</div>
                  <div className="text-xs text-zinc-500">Zero dores de cabeça com setup</div>
                </div>
                <div className="bg-white/5 rounded-xl h-2 flex overflow-hidden">
                  <div className="bg-green-500 w-[100%]"></div>
                </div>
              </div>

              {/* Box 4 (Charts / Graphs) */}
              <div className="bg-[#111] rounded-3xl p-8 border border-white/5 flex flex-col justify-center items-center relative overflow-hidden group hover:border-[#ff7b00]/30 transition-colors">
                <div className="flex items-end gap-2 h-20 mb-6">
                  <div className="w-3 bg-zinc-800 rounded-t h-[30%] group-hover:bg-[#ff7b00] transition-colors duration-300"></div>
                  <div className="w-3 bg-zinc-800 rounded-t h-[60%] group-hover:bg-[#ff7b00] transition-colors duration-500 delay-75"></div>
                  <div className="w-3 bg-zinc-800 rounded-t h-[45%] group-hover:bg-[#ff7b00] transition-colors duration-300 delay-100"></div>
                  <div className="w-3 bg-[#ff7b00] rounded-t h-[90%] shadow-[0_0_15px_#ff7b00]"></div>
                  <div className="w-3 bg-zinc-800 rounded-t h-[50%] group-hover:bg-[#ff7b00] transition-colors duration-300 delay-150"></div>
                  <div className="w-3 bg-zinc-800 rounded-t h-[75%] group-hover:bg-[#ff7b00] transition-colors duration-500 delay-200"></div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-white tracking-tighter">Robôs Visuais</div>
                  <div className="text-sm text-zinc-400 mt-2">Cadeias lógicas tipo Drag & Drop</div>
                </div>
              </div>

              {/* Box 5 (Analytics Info Text) */}
              <div className="bg-[#111] rounded-3xl p-8 border border-white/5 flex flex-col justify-between hover:border-[#ff7b00]/30 transition-colors">
                <div>
                  <Activity className="w-8 h-8 text-[#ff7b00] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Relatórios Precisos CFO</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Tome decisões com base no MRR, clientes ativos, e fluxo de caixa contábil sem sair do app.
                  </p>
                </div>
                <div className="flex -space-x-3 mt-8">
                  <img className="w-10 h-10 rounded-full border-2 border-[#111]" src="https://i.pravatar.cc/100?img=11" alt="" />
                  <img className="w-10 h-10 rounded-full border-2 border-[#111]" src="https://i.pravatar.cc/100?img=12" alt="" />
                  <img className="w-10 h-10 rounded-full border-2 border-[#111]" src="https://i.pravatar.cc/100?img=13" alt="" />
                  <div className="w-10 h-10 rounded-full border-2 border-[#111] bg-white/10 flex items-center justify-center text-xs text-white font-bold">+99</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Pricing Options - Minimal SaaS Style */}
        <section id="pricing" className="py-24 px-6 border-t border-white/5 bg-[#050505]">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">ESCALA SEM FRONTEIRAS</h2>
              <p className="text-lg text-zinc-400 max-w-xl mx-auto">Valores adaptados para rotinas de quem fecha vendas todos os dias.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">

              {/* Starter */}
              <div className="bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors rounded-3xl p-10 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                  <p className="text-zinc-500 text-sm mb-6 h-10">Controle do funil seguro e imediato.</p>
                  <div className="mb-8 font-black text-4xl text-white">
                    R$ 97 <span className="text-lg text-zinc-500 font-medium">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-zinc-400 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-white/30 shrink-0" />
                      <span>Licença para 1 Usuário Mestre</span>
                    </li>
                    <li className="flex gap-3 text-zinc-400 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-white/30 shrink-0" />
                      <span>Caixa de Entrada Unificada</span>
                    </li>
                    <li className="flex gap-3 text-zinc-400 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-white/30 shrink-0" />
                      <span>Kanban de Vendas Ilimitado</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded-full border border-white/10 text-white font-bold text-sm text-center hover:bg-white/5 transition-all">
                  Assinar Starter
                </Link>
              </div>

              {/* Pro (Highlighted) */}
              <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-[#ff7b00]/30 rounded-3xl p-10 flex flex-col justify-between relative shadow-[0_0_50px_rgba(255,123,0,0.05)] transform lg:-translate-y-4">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ff7b00] text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Mais Popular
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#ff7b00] mb-2">Pro</h3>
                  <p className="text-zinc-400 text-sm mb-6 h-10">Equipes de prospecção com autonomia total.</p>
                  <div className="mb-8 font-black text-4xl text-white">
                    R$ 197 <span className="text-lg text-zinc-500 font-medium">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-white font-medium items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />
                      <span>Até 5 colaboradores logados</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />
                      <span>Sugestão de Respostas IA</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />
                      <span>Robôs Flow & Disparos</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded-full bg-[#ff7b00] text-black font-black uppercase tracking-wider text-sm text-center hover:bg-[#e66a00] transition-colors shadow-lg">
                  Assinar Pro
                </Link>
              </div>

              {/* Enterprise */}
              <div className="bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors rounded-3xl p-10 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                  <p className="text-zinc-500 text-sm mb-6 h-10">Painel CFO para múltiplos gestores.</p>
                  <div className="mb-8 font-black text-4xl text-white">
                    R$ 289 <span className="text-lg text-zinc-500 font-medium">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-zinc-400 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-white/30 shrink-0" />
                      <span>Equipe ilimitada</span>
                    </li>
                    <li className="flex gap-3 text-zinc-400 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-white/30 shrink-0" />
                      <span>Métricas de Receita / CFO</span>
                    </li>
                    <li className="flex gap-3 text-zinc-400 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-white/30 shrink-0" />
                      <span>Suporte Head 24hrs</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded-full border border-white/10 text-white font-bold text-sm text-center hover:bg-white/5 transition-all">
                  Assinar Enterprise
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-[#0a0a0a] text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <img src="/logo.png" alt="FLY UP CRM" className="h-8 w-auto object-contain opacity-40 grayscale hover:grayscale-0 transition-all" />

          <div className="flex gap-6 text-sm text-zinc-500 font-semibold uppercase tracking-wider">
            <Link href="#" className="hover:text-white transition-colors">Termos</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="#contato" className="hover:text-white transition-colors">Suporte</Link>
          </div>
        </div>
        <div className="mt-12 text-xs text-zinc-600 font-medium tracking-wide uppercase">
          &copy; {new Date().getFullYear()} FLY UP Tech LTDA. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
