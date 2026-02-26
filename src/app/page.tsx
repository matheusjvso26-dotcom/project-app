import Link from 'next/link'
import { CheckCircle2, ArrowRight, Users, Handshake, Network, Lock, Smartphone, LayoutDashboard, MessageSquare } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030305] text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white pb-20 overflow-hidden">

      {/* --- HEADER --- */}
      <header className="relative z-50 border-b border-white/5 bg-transparent pt-6 pb-4">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            {/* Logo ampliada conforme solicitado */}
            <img
              src="/logo.png"
              alt="FLY UP CRM"
              className="h-16 md:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,123,0,0.2)]"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors tracking-wide">Recursos</Link>
            <Link href="#plataforma" className="hover:text-white transition-colors tracking-wide">Plataforma</Link>
            <Link href="#planos" className="hover:text-white transition-colors tracking-wide">Soluções</Link>
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-white hover:text-[#ff7b00] transition-colors">
              Acesso Restrito
            </Link>
            <Link href="/register" className="text-sm font-bold text-black bg-[#ff7b00] hover:bg-white transition-all px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(255,123,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              Falar com Consultor
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* --- HERO SECTION --- (Center aligned with Mockup below) */}
        <section className="relative pt-24 pb-32 px-6 flex flex-col items-center text-center z-10">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#ff7b00]/15 blur-[150px] rounded-[100%] pointer-events-none -z-10"></div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight max-w-4xl mx-auto drop-shadow-2xl">
            Uma estrutura comercial <br className="hidden md:block" />
            para times de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7b00] to-[#ffaa00]">alta performance.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
            Domine todas as etapas da sua esteira de vendas. Organize leads, automatize o WhatsApp e gerencie seu time com a plataforma B2B mais robusta do mercado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 z-20">
            <Link href="/register" className="w-full sm:w-auto bg-[#ff7b00] hover:bg-white text-black font-black uppercase tracking-widest text-sm py-4 px-10 rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(255,123,0,0.3)] active:scale-95">
              Solicitar Demonstração
            </Link>
            <Link href="#planos" className="w-full sm:w-auto text-white font-medium text-sm py-4 px-10 rounded-full border border-white/20 hover:bg-white/5 transition-colors duration-300">
              Ver Soluções
            </Link>
          </div>

          {/* LARGE DASHBOARD MOCKUP */}
          <div className="w-full max-w-[1000px] h-[300px] sm:h-[400px] lg:h-[600px] relative rounded-t-2xl lg:rounded-t-[40px] border-t border-x border-white/10 bg-[#0a0a0f] shadow-[0_-20px_80px_rgba(255,123,0,0.15)] overflow-hidden flex flex-col">
            {/* Top Bar do Mockup */}
            <div className="h-12 border-b border-white/5 bg-[#111115] flex items-center px-6 gap-3 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <div className="mx-auto w-40 h-4 bg-white/5 rounded-full"></div>
            </div>

            {/* Corpo do Mockup Simulando a Interface Real */}
            <div className="flex-1 flex p-6 gap-6 relative overflow-hidden">
              {/* Sidebar Mock */}
              <div className="hidden md:flex w-48 flex-col gap-4">
                <div className="h-8 w-full bg-white/5 rounded-lg mb-4"></div>
                <div className="h-4 w-3/4 bg-white/5 rounded"></div>
                <div className="h-4 w-full bg-white/5 rounded"></div>
                <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                <div className="h-4 w-full bg-white/5 rounded"></div>
              </div>

              {/* Main Content Mock */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Top Stats */}
                <div className="flex gap-4">
                  <div className="flex-1 h-24 bg-gradient-to-br from-[#1a1a24] to-[#111115] rounded-xl border border-white/5 shadow-lg p-5 flex flex-col justify-end">
                    <div className="h-3 w-16 bg-[#ff7b00]/50 rounded mb-2"></div>
                    <div className="h-6 w-24 bg-white/80 rounded"></div>
                  </div>
                  <div className="flex-1 h-24 bg-gradient-to-br from-[#1a1a24] to-[#111115] rounded-xl border border-white/5 shadow-lg p-5 flex flex-col justify-end">
                    <div className="h-3 w-20 bg-green-500/50 rounded mb-2"></div>
                    <div className="h-6 w-16 bg-white/80 rounded"></div>
                  </div>
                  <div className="flex-1 h-24 bg-gradient-to-br from-[#1a1a24] to-[#111115] rounded-xl border border-white/5 shadow-lg hidden sm:flex p-5 flex-col justify-end">
                    <div className="h-3 w-12 bg-blue-500/50 rounded mb-2"></div>
                    <div className="h-6 w-20 bg-white/80 rounded"></div>
                  </div>
                </div>

                {/* Kanban/Chart area */}
                <div className="flex-1 bg-gradient-to-b from-[#15151a] to-[#0a0a0f] rounded-xl border border-white/5 shadow-inner relative overflow-hidden p-6">
                  {/* Fake Line Chart */}
                  <svg className="absolute bottom-0 left-0 w-full h-[60%] opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,100 L0,60 Q10,50 20,70 T40,40 T60,60 T80,30 T100,50 L100,100 Z" fill="url(#gradient-orange)" />
                    <path d="M0,60 Q10,50 20,70 T40,40 T60,60 T80,30 T100,50" fill="none" stroke="#ff7b00" strokeWidth="2" />
                    <defs>
                      <linearGradient id="gradient-orange" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff7b00" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ff7b00" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
            {/* Fade Out Base */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#030305] to-transparent z-20"></div>
          </div>
        </section>

        {/* --- 3 COLUMN FEATURES --- */}
        <section id="features" className="py-20 px-6 max-w-[1200px] mx-auto border-t border-white/5 relative z-10">
          <div className="flex flex-col md:flex-row gap-10 md:gap-20">
            {/* Left Title */}
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Recursos focados em organizar os seus leads.
              </h2>
            </div>

            {/* Right 3 Feats Grid */}
            <div className="md:w-2/3 grid sm:grid-cols-3 gap-8">
              <div>
                <div className="w-12 h-12 bg-[#ff7b00]/10 rounded-xl flex items-center justify-center text-[#ff7b00] mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3">CRM Completo</h4>
                <p className="text-zinc-500 font-light text-sm leading-relaxed">
                  Ficha técnica de cada cliente, anotações e histórico de conversas centralizados.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[#ff7b00]/10 rounded-xl flex items-center justify-center text-[#ff7b00] mb-6">
                  <Handshake className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3">Rastreio Rápido</h4>
                <p className="text-zinc-500 font-light text-sm leading-relaxed">
                  Saiba quando o lead chegou, quem o atendeu e quanto tempo demorou o contato.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[#ff7b00]/10 rounded-xl flex items-center justify-center text-[#ff7b00] mb-6">
                  <Network className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3">Gestão de Funil</h4>
                <p className="text-zinc-500 font-light text-sm leading-relaxed">
                  Mova os cards no Kanban e deixe o sistema prever seu fluxo de caixa mensal automaticamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- BENTO BOX ASYMMETRIC GRID --- */}
        <section id="plataforma" className="py-24 px-6 max-w-[1200px] mx-auto z-10 relative">

          <div className="text-center mb-16">
            <h3 className="text-2xl font-light text-zinc-400 mb-2">Softwares essenciais que unificam o seu</h3>
            <h2 className="text-3xl md:text-4xl font-black text-white flex justify-center items-center gap-4 flex-wrap">
              <span className="flex items-center gap-2"><MessageSquare className="w-7 h-7 text-[#ff7b00]" /> WhatsApp,</span>
              <span className="flex items-center gap-2"><LayoutDashboard className="w-7 h-7 text-[#ff7b00]" /> Operação,</span>
              <span className="flex items-center gap-2"><Lock className="w-7 h-7 text-[#ff7b00]" /> e Fechamentos</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Box Grande (2 Colunas) */}
            <div className="lg:col-span-2 bg-[#0a0a0f] border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-10 hover:border-[#ff7b00]/20 transition-colors group">
              <div className="flex-1 flex flex-col justify-center">
                <h4 className="text-2xl font-bold text-white mb-4">Inbox única conectada de ponta a ponta</h4>
                <p className="text-zinc-400 font-light leading-relaxed mb-8 text-sm">
                  Todos os seus vendedores e atendentes logados no mesmo número Oficial do WhatsApp. Sem queda de conexão, sem precisar do celular por perto.
                </p>
                <Link href="/register" className="inline-block text-[#ff7b00] font-bold text-sm tracking-wide uppercase border-b border-transparent hover:border-[#ff7b00] transition-colors w-max">
                  Saber Mais
                </Link>
              </div>
              <div className="flex-1 bg-[#111115] rounded-2xl border border-white/5 p-4 flex flex-col gap-3 group-hover:shadow-[0_0_30px_rgba(255,123,0,0.1)] transition-all">
                {/* Chat Mock */}
                <div className="bg-white/5 p-3 rounded-lg flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shrink-0"></div>
                  <div>
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-white text-xs font-bold">João Silva</span>
                      <span className="text-zinc-600 text-[10px]">10:42 AM</span>
                    </div>
                    <div className="text-zinc-400 text-[11px] line-clamp-2">Gostaria de solicitar uma análise para minha empresa.</div>
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg flex items-start gap-3 border border-[#ff7b00]/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff7b00] to-orange-600 shrink-0"></div>
                  <div className="w-full">
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[#ff7b00] text-xs font-bold">Vendedor Rodrigo</span>
                      <span className="text-zinc-600 text-[10px]">Agora</span>
                    </div>
                    <div className="text-zinc-300 text-[11px]">Olá João! Perfeito, me mande o CNPJ...</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box Menor (1 Coluna) */}
            <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-8 md:p-12 hover:border-[#ff7b00]/20 transition-colors flex flex-col items-center text-center">
              <div className="w-20 h-40 bg-[#111115] border border-white/5 rounded-xl shadow-2xl mb-8 flex flex-col overflow-hidden relative">
                <div className="h-4 bg-[#050505] flex justify-center items-center"><div className="w-6 h-1 bg-white/10 rounded-full"></div></div>
                <div className="flex-1 p-2 flex flex-col gap-2">
                  <div className="h-6 bg-[#ff7b00]/20 rounded-md"></div>
                  <div className="h-10 bg-white/5 rounded-md"></div>
                  <div className="h-6 bg-white/5 rounded-md"></div>
                  <div className="h-6 bg-[#ff7b00]/80 mt-auto rounded-md"></div>
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Mobilidade</h4>
              <p className="text-zinc-400 font-light text-sm">
                Acesse seu CRM, Dashboard e Caixa de Entrada diretamente de qualquer navegador no celular ou computador.
              </p>
            </div>

            {/* Box Longo Horizontal (3 Colunas) */}
            <div className="lg:col-span-3 bg-[#0a0a0f] border border-white/5 rounded-3xl p-8 md:p-12 hover:border-[#ff7b00]/20 transition-colors">
              <div className="max-w-3xl mb-10">
                <h4 className="text-2xl font-bold text-white mb-4">Transmissões Ativas com Construtor de Robôs</h4>
                <p className="text-zinc-400 font-light text-sm">
                  Despeje milhares de contatos numa planilha e deixe o sistema enviar mensagens personalizadas em fila, conectando apenas os interessados aos seus atendentes humanos.
                </p>
              </div>
              <div className="w-full h-32 bg-[#111115] rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]"></div>

                {/* Fluxo Node Mock */}
                <div className="relative z-10 flex items-center gap-4">
                  <div className="bg-[#1a1a24] border border-white/10 px-4 py-3 rounded-lg text-xs font-bold text-white">Início</div>
                  <ArrowRight className="text-[#ff7b00] w-4 h-4" />
                  <div className="bg-gradient-to-r from-[#ff7b00] to-orange-500 text-black px-4 py-3 rounded-lg text-xs font-bold">Enviar Áudio (Gravado)</div>
                  <ArrowRight className="text-[#ff7b00] w-4 h-4" />
                  <div className="bg-[#1a1a24] border border-green-500/30 px-4 py-3 rounded-lg text-xs font-bold text-green-400">Atribuir à Maria</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- PRICING (CONSULTIVO) --- */}
        <section id="planos" className="py-24 px-6 relative z-10">
          <div className="max-w-[1200px] mx-auto border-t border-white/5 pt-24">

            <div className="text-center mb-20 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Múltiplos Planos para Múltiplas Necessidades.</h2>
              <p className="text-lg text-zinc-400 font-light">
                Nosso modelo é focado em entregar exatamente o que a sua operação exige.
                Consulte com nossos especialistas a infraestrutura ideal.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

              {/* STARTER */}
              <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-10 flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-3">Starter</h3>
                <p className="text-zinc-500 text-sm mb-10 h-10">Para profissionais autônomos iniciando profissionalização B2B.</p>

                <ul className="space-y-5 mb-12 flex-1 relative">
                  <div className="absolute top-0 left-[9px] bottom-0 w-[1px] bg-white/5 -z-10"></div>
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[10px] text-white">1</span>
                    <span className="text-zinc-300 text-sm">Usuário Comercial</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[10px] text-white">2</span>
                    <span className="text-zinc-300 text-sm">Caixa de Entrada Oficial</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[10px] text-white">3</span>
                    <span className="text-zinc-300 text-sm">Kanban Integrado</span>
                  </li>
                </ul>

                <Link href="/register" className="block w-full py-4 rounded-xl border border-[#ff7b00]/30 text-[#ff7b00] font-bold text-sm text-center hover:bg-[#ff7b00] hover:text-black transition-all uppercase tracking-widest bg-[#ff7b00]/5">
                  Falar com Consultor
                </Link>
              </div>

              {/* PRO EQUIPES */}
              <div className="bg-[#111115] border border-[#ff7b00]/50 rounded-3xl p-10 flex flex-col relative shadow-[0_0_50px_rgba(255,123,0,0.1)] transform md:-translate-y-4">
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-[#ff7b00] text-black text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    Padrão de Indústria
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#ff7b00] mb-3">Pro Equipes</h3>
                <p className="text-zinc-400 text-sm mb-10 h-10">O motor completo para operações de Inside Sales escaláveis.</p>

                <ul className="space-y-5 mb-12 flex-1 relative">
                  <div className="absolute top-0 left-[9px] bottom-0 w-[1px] bg-[#ff7b00]/20 -z-10"></div>
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 rounded-full bg-[#ff7b00] text-black flex items-center justify-center shrink-0 text-[10px] font-bold">1</span>
                    <span className="text-white text-sm">Gestão de 5 até 15 Usuários</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 rounded-full bg-[#ff7b00] text-black flex items-center justify-center shrink-0 text-[10px] font-bold">2</span>
                    <span className="text-white text-sm">Robôs de Atendimento 24/7</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 rounded-full bg-[#ff7b00] text-black flex items-center justify-center shrink-0 text-[10px] font-bold">3</span>
                    <span className="text-white text-sm">Integração de Disparos em Massa</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 rounded-full bg-[#ff7b00] text-black flex items-center justify-center shrink-0 text-[10px] font-bold">4</span>
                    <span className="text-white text-sm">Modo Supervisor e CFO (Métricas)</span>
                  </li>
                </ul>

                <Link href="/register" className="block w-full py-4 rounded-xl bg-[#ff7b00] text-black font-black text-sm text-center hover:bg-white transition-all uppercase tracking-widest shadow-lg">
                  Solicitar Acesso
                </Link>
              </div>

              {/* ENTERPRISE MAX */}
              <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-10 flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-3">Enterprise Max</h3>
                <p className="text-zinc-500 text-sm mb-10 h-10">Estrutura isolada para Call Centers e Players gigantes.</p>

                <ul className="space-y-5 mb-12 flex-1 relative">
                  <div className="absolute top-0 left-[9px] bottom-0 w-[1px] bg-white/5 -z-10"></div>
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[10px] text-white">1</span>
                    <span className="text-zinc-300 text-sm">Assentos Ilimitados Customizados</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[10px] text-white">2</span>
                    <span className="text-zinc-300 text-sm">Whisper AI e Transcrição Nativa</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[10px] text-white">3</span>
                    <span className="text-zinc-300 text-sm">Servidor Físico/Virtual Dedicado</span>
                  </li>
                </ul>

                <Link href="/register" className="block w-full py-4 rounded-xl border border-[#ff7b00]/30 text-[#ff7b00] font-bold text-sm text-center hover:bg-[#ff7b00] hover:text-black transition-all uppercase tracking-widest bg-[#ff7b00]/5">
                  Consultar Viabilidade
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER SIMPLIFICADO --- */}
      <footer className="py-12 border-t border-white/5 mt-20 relative z-10 bg-[#020202]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <img src="/logo.png" alt="FLY UP CRM" className="h-10 md:h-12 w-auto mx-auto mb-6 grayscale opacity-20" />
          <p className="text-xs text-zinc-600 font-medium uppercase tracking-widest">
            &copy; {new Date().getFullYear()} FLY UP SOFTWARE TECNOLOGIA. TODOS OS DIREITOS RESERVADOS.
          </p>
        </div>
      </footer>
    </div>
  )
}
