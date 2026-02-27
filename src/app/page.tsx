import Link from 'next/link'
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Layers, HeadphonesIcon, Globe, Lock, LayoutDashboard, MessageSquare } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white pb-0 overflow-hidden">

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md pt-4 pb-4">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            {/* Logo do Usuário Inserida */}
            <img
              src="/logo.png"
              alt="FLY UP Web"
              className="h-12 md:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,123,0,0.1)]"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#vantagens" className="hover:text-white transition-colors tracking-wide">Vantagens</Link>
            <Link href="#solucoes" className="hover:text-white transition-colors tracking-wide">Soluções</Link>
            <Link href="#planos" className="hover:text-white transition-colors tracking-wide">Planos</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-white hover:text-[#ff7b00] transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="text-sm font-bold text-black bg-[#ff7b00] hover:bg-white transition-all px-6 py-2.5 rounded-md shadow-[0_0_15px_rgba(255,123,0,0.3)]">
              Fale com um Especialista
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-28">
        {/* --- HERO SECTION --- (Estilo Elicitacao - Direto e Centralizado) */}
        <section className="relative pt-20 pb-24 px-6 flex flex-col items-center text-center z-10">
          {/* Ambient Glow sutil para quebrar o preto absoluto no topo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#ff7b00]/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.2] mb-6 tracking-tight max-w-4xl mx-auto">
            A plataforma certa para <br className="hidden md:block" />
            <span className="text-[#ff7b00]">alavancar suas vendas</span> com tecnologia
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-10 font-light">
            Tecnologia moderna e de alto desempenho que automatiza e simplifica as etapas do seu atendimento, qualificação e fechamento comercial por meio de gestão ágil. <br className="hidden md:block" />Tudo dentro de um único sistema confiável e tecnológico.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 z-20">
            <Link href="/register" className="w-full sm:w-auto bg-[#ff7b00] hover:bg-orange-500 text-black font-black uppercase tracking-wider text-sm py-4 px-10 rounded-md transition-all duration-300">
              Quero Alavancar Minhas Vendas
            </Link>
            <Link href="#solucoes" className="w-full sm:w-auto text-white font-medium text-sm py-4 px-10 rounded-md border border-white/20 hover:bg-white/5 transition-colors duration-300">
              Conhecer Soluções
            </Link>
          </div>

          {/* Painel Ilustrativo Estilo Dashboard */}
          <div className="w-full max-w-[1000px] h-[300px] sm:h-[450px] relative rounded-t-xl border-t border-x border-[#333] bg-[#0c0c0c] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col mx-auto">
            <div className="h-10 border-b border-[#333] bg-[#1a1a1a] flex items-center px-4 gap-2 shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="flex-1 w-full bg-black relative">
              <img src="/mockup-hero.png" alt="Amostra do Sistema FLY UP Web" className="absolute top-0 left-0 w-full h-auto object-cover opacity-90 transition-opacity hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
            </div>
          </div>
        </section>

        {/* --- 6 VANTAGENS (Inspirado no Grid da Elicitação) --- */}
        <section id="vantagens" className="py-24 px-6 bg-[#050505] border-t border-white/5">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Por que a <span className="text-[#ff7b00]">FLY UP</span> é a plataforma certa?
              </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto">
                Desenvolvida com foco em alta performance para times que não têm tempo a perder.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {/* Item 1 */}
              <div>
                <Layers className="w-10 h-10 text-[#ff7b00] mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">TUDO EM UM SÓ LUGAR</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                  Administre todas as etapas da sua operação comercial, desde o primeiro 'Oi' no WhatsApp até o fechamento do contrato em um mesmo ambiente.
                </p>
              </div>

              {/* Item 2 */}
              <div>
                <ShieldCheck className="w-10 h-10 text-[#ff7b00] mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">100% LEGAL E OFICIAL</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                  Todos os módulos respeitam as regras de APIs Oficiais. Trabalhe sem medo de banimentos indesejados no WhatsApp.
                </p>
              </div>

              {/* Item 3 */}
              <div>
                <Lock className="w-10 h-10 text-[#ff7b00] mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">PRÁTICO E 100% SEGURO</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                  Seus dados comerciais são criptografados de ponta a ponta. Apenas os usuários autorizados do seu time têm acesso aos leads.
                </p>
              </div>

              {/* Item 4 */}
              <div>
                <Globe className="w-10 h-10 text-[#ff7b00] mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">CONECTIVIDADE TOTAL</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                  Acesse pelo computador ou celular, de qualquer lugar. Sua operação nunca para, não importa de onde a equipe trabalha.
                </p>
              </div>

              {/* Item 5 */}
              <div>
                <Zap className="w-10 h-10 text-[#ff7b00] mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">FOCO NO QUE IMPORTA</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                  Auxiliamos na triagem, nas automações e na distribuição. Você foca estritamente na estratégia para vencer a negociação.
                </p>
              </div>

              {/* Item 6 */}
              <div>
                <HeadphonesIcon className="w-10 h-10 text-[#ff7b00] mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">SUPORTE ESPECIALIZADO</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                  Equipe de especialistas à sua disposição para todas as etapas da implantação comercial, garantindo extrair o máximo do CRM.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- MÓDULOS / SOLUÇÕES (Estilo "Uma solução para cada fase") --- */}
        <section id="solucoes" className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-[#000000] -z-20"></div>
          {/* Subtle glow behind the modules */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#111111] rounded-full pointer-events-none -z-10"></div>

          <div className="max-w-[1000px] mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              A solução ideal para todas <br /> as fases do seu Ciclo de Venda.
            </h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Isso porque é uma plataforma completa. Um módulo para cada fase, todos integrados e automatizados para facilitar as negociações e aumentar sua receita.
            </p>
          </div>

          <div className="max-w-[1200px] mx-auto flex flex-col gap-10">

            {/* Módulo 1 */}
            <div className="flex flex-col md:flex-row items-center gap-10 bg-[#0a0a0a] border border-[#222] p-8 md:p-12 rounded-2xl hover:border-[#ff7b00]/30 transition-colors">
              <div className="md:w-1/2 text-left">
                <div className="text-[#ff7b00] font-bold tracking-widest text-xs uppercase mb-3">Fase 1: Captação</div>
                <h3 className="text-3xl font-bold text-white mb-4">Inbox Compartilhada</h3>
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                  Centralize e controle dezenas de clientes pelo WhatsApp Oficial. Atenda seus leads com uma equipe de forma simultânea. Para essa fase inicial, conte com nossa automação inteligente e evite gargalos no primeiro contato.
                </p>
                <Link href="/register" className="inline-flex items-center gap-2 text-[#ff7b00] hover:text-white font-bold text-sm transition-colors">
                  Saber mais <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="md:w-1/2 w-full flex justify-center">
                <div className="w-full aspect-video bg-[#151515] border border-[#333] rounded-xl flex items-center justify-center p-6 shadow-2xl relative overflow-hidden">
                  <MessageSquare className="w-16 h-16 text-[#333] absolute" />
                  {/* Decorative UI elements */}
                  <div className="w-[80%] h-12 bg-[#222] rounded-lg mb-4 absolute top-6 left-6"></div>
                  <div className="w-[60%] h-12 bg-[#2a2a2a] rounded-lg mb-4 absolute top-24 left-6"></div>
                </div>
              </div>
            </div>

            {/* Módulo 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10 bg-[#0a0a0a] border border-[#222] p-8 md:p-12 rounded-2xl hover:border-[#ff7b00]/30 transition-colors">
              <div className="md:w-1/2 text-left">
                <div className="text-[#ff7b00] font-bold tracking-widest text-xs uppercase mb-3">Fase 2: Gestão</div>
                <h3 className="text-3xl font-bold text-white mb-4">Kanban & CRM Estendido</h3>
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                  Visão clara de suas propostas. Após o atendimento, este módulo preenche e posiciona os valores exatos de todas as negociações pendentes de maneira simples. Monitore cada card para garantir o fechamento.
                </p>
                <Link href="/register" className="inline-flex items-center gap-2 text-[#ff7b00] hover:text-white font-bold text-sm transition-colors">
                  Saber mais <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="md:w-1/2 w-full flex justify-center">
                <div className="w-full aspect-video bg-[#151515] border border-[#333] rounded-xl flex items-center justify-center p-6 shadow-2xl relative overflow-hidden">
                  <LayoutDashboard className="w-16 h-16 text-[#333] absolute" />
                  <div className="flex gap-4 absolute inset-6">
                    <div className="w-1/3 h-full bg-[#222] rounded-lg"></div>
                    <div className="w-1/3 h-[70%] bg-[#222] rounded-lg"></div>
                    <div className="w-1/3 h-[40%] bg-[#222] rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- CATCH / ESTATISTICAS --- */}
        <section className="py-20 px-6 bg-[#ff7b00] text-black">
          <div className="max-w-[1000px] mx-auto text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 divide-y md:divide-y-0 md:divide-x divide-black/10">
              <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
                <span className="text-4xl md:text-5xl font-black mb-2">+ de 1.000</span>
                <span className="font-bold text-black/70 text-sm uppercase tracking-widest">Empresas Atendidas</span>
              </div>
              <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
                <span className="text-4xl md:text-5xl font-black mb-2">+ de 2M</span>
                <span className="font-bold text-black/70 text-sm uppercase tracking-widest">Leads Gerados</span>
              </div>
              <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
                <span className="text-4xl md:text-5xl font-black mb-2">99.9%</span>
                <span className="font-bold text-black/70 text-sm uppercase tracking-widest">Uptime Garantido</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-8 max-w-2xl mx-auto">
              A plataforma pioneira e mais abrangente, projetada especificamente para oferecer recursos avançados de controle.
            </h2>
            <Link href="/register" className="inline-block bg-black text-white font-black uppercase text-sm py-4 px-10 rounded-md shadow-2xl hover:bg-[#333] transition-colors">
              Teste Grátis Agora
            </Link>
          </div>
        </section>

        {/* --- RODAPÉ PRETO --- */}
        <footer className="py-16 bg-[#000000] border-t border-[#111]">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img src="/logo.png" alt="FLY UP Web" className="h-10 w-auto mb-6 grayscale opacity-80" />
              <p className="text-zinc-500 text-sm w-3/4">
                A solução que une tecnologia, praticidade e segurança para alavancar os resultados da sua operação de forma inteligente.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm">Plataforma</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="#" className="hover:text-[#ff7b00]">Funcionalidades</Link></li>
                <li><Link href="#" className="hover:text-[#ff7b00]">Planos</Link></li>
                <li><Link href="#vantagens" className="hover:text-[#ff7b00]">Vantagens</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm">Contato</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>comercial@flyup.com.br</li>
                <li>WhatsApp Comercial</li>
                <li>Suporte Especializado</li>
              </ul>
            </div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 mt-16 text-center text-xs text-zinc-600 font-medium tracking-widest uppercase">
            &copy; {new Date().getFullYear()} FLY UP. TODOS OS DIREITOS RESERVADOS.
          </div>
        </footer>

      </main>
    </div>
  )
}
