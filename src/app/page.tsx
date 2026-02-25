import Link from 'next/link'
import { CheckCircle2, MessageSquare, Layers, Bot, Activity, ArrowRight, ShieldCheck, Zap, Users, BarChart3, ChevronRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white overflow-x-hidden">

      {/* Subtle Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="FLY UP CRM" className="h-10 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</Link>
            <Link href="#solucao" className="hover:text-white transition-colors">A Solução</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Planos</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-white uppercase tracking-wider hidden sm:block hover:text-[#ff7b00] transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="text-sm font-bold text-black uppercase tracking-wider bg-[#ff7b00] hover:bg-[#e66a00] px-6 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,123,0,0.3)]">
              Teste Grátis
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-20">

        {/* HERO SECTION - Claro, Informativo e Focado na Marca */}
        <section className="relative px-6 pt-24 pb-32 flex flex-col items-center text-center overflow-hidden">
          {/* Efeitos de Luz */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff7b00]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">

            {/* Logo em Destaque Gigante */}
            <div className="mb-12 relative group w-64 md:w-80 lg:w-96">
              <div className="absolute inset-0 bg-[#ff7b00] opacity-20 blur-[60px] rounded-full group-hover:opacity-40 transition-opacity duration-700"></div>
              <img
                src="/logo.png"
                alt="FLY UP CRM Oficial"
                className="w-full h-auto object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(255,123,0,0.3)] animate-[pulse_4s_ease-in-out_infinite]"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              O CRM definitivo para times de vendas de alta performance
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter mb-8">
              Organize seu WhatsApp, <br className="hidden md:block" />
              Automatize suas <span className="text-[#ff7b00]">Vendas.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-12">
              Pare de perder negócios na bagunça do WhatsApp Web. A FLY UP consolida o atendimento de toda a sua equipe em um único número, qualifica os leads com inteligência artificial e os organiza em um funil de vendas financeiro poderoso.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto bg-[#ff7b00] hover:bg-[#e66a00] text-black font-black uppercase tracking-wider py-4 px-10 rounded-full transition-transform hover:scale-105 shadow-[0_10px_30px_rgba(255,123,0,0.3)] flex items-center justify-center gap-2">
                Criar Conta (7 Dias Grátis) <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#funcionalidades" className="w-full sm:w-auto bg-transparent border border-white/20 text-white font-bold uppercase tracking-wider py-4 px-10 rounded-full transition-all hover:bg-white/10 flex items-center justify-center gap-2">
                Ver Sistema por Dentro
              </Link>
            </div>

            <p className="mt-8 text-sm text-zinc-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Sem necessidade de cartão de crédito. Aprovação rápida.
            </p>
          </div>
        </section>

        {/* DETAILED FEATURES MATRIX */}
        <section id="funcionalidades" className="py-24 bg-[#0a0a0a] border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">

            <div className="mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6">
                Tudo que sua operação precisa <br /> <span className="text-zinc-500">em uma única ferramenta.</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl">
                Desenhado para o mercado B2B, nosso sistema substitui a necessidade de ter 4 softwares diferentes rodando ao mesmo tempo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Feature 1 */}
              <div className="bg-[#111] border border-white/5 hover:border-[#ff7b00]/50 p-8 rounded-2xl transition-colors group">
                <div className="w-14 h-14 bg-[#ff7b00]/10 rounded-xl flex items-center justify-center mb-6 text-[#ff7b00] group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Inbox Omnichannel</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Conecte o seu número da Meta (API Oficial). Múltiplos vendedores respondendo simultaneamente na mesma aba, sem QR Codes caindo e sem perder o histórico do cliente.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#111] border border-white/5 hover:border-[#ff7b00]/50 p-8 rounded-2xl transition-colors group">
                <div className="w-14 h-14 bg-[#ff7b00]/10 rounded-xl flex items-center justify-center mb-6 text-[#ff7b00] group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Kanban de Negociações</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Transforme conversas em oportunidades. Arraste os clientes por etapas (Triagem, Reunião, Proposta) e veja o dinheiro potencial somado no painel ao vivo.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#111] border border-white/5 hover:border-[#ff7b00]/50 p-8 rounded-2xl transition-colors group">
                <div className="w-14 h-14 bg-[#ff7b00]/10 rounded-xl flex items-center justify-center mb-6 text-[#ff7b00] group-hover:scale-110 transition-transform">
                  <Bot className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Robôs Drag & Drop</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Construa bots de autoatendimento arrastando blocos. Capture nome, e-mail e intenção de compra antes mesmo do lead chegar ao atendimento humano.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#111] border border-white/5 hover:border-[#ff7b00]/50 p-8 rounded-2xl transition-colors group">
                <div className="w-14 h-14 bg-[#ff7b00]/10 rounded-xl flex items-center justify-center mb-6 text-[#ff7b00] group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Gestão de Equipes (RBAC)</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Cargos bem definidos. O "Closer" só enxerga seus clientes, o "SDR" prospecta em volume, e o "Admin" tem controle total sobre os dados da empresa.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-[#111] border border-white/5 hover:border-[#ff7b00]/50 p-8 rounded-2xl transition-colors group">
                <div className="w-14 h-14 bg-[#ff7b00]/10 rounded-xl flex items-center justify-center mb-6 text-[#ff7b00] group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Disparos em Massa Automáticos</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Programe envios de mensagens pesadas (remarketing, boletos) conectando listas ao nosso Flow builder. O robô dispara no fundo sem travar sua máquina.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-[#111] border border-white/5 hover:border-[#ff7b00]/50 p-8 rounded-2xl transition-colors group">
                <div className="w-14 h-14 bg-[#ff7b00]/10 rounded-xl flex items-center justify-center mb-6 text-[#ff7b00] group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Métricas Avançadas (CFO)</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Painel financeiro real. Acompanhe clientes ativos, ticket médio, faturamento bruto diário e descubra se o mês vai fechar no lucro.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* DEEP DIVE / IMPACT SECTION */}
        <section id="solucao" className="py-32 px-6">
          <div className="max-w-7xl mx-auto space-y-32">

            {/* Block 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="text-[#ff7b00] font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> ATENDIMENTO EFICIENTE
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">Chega de perder conversas <br /> rolando o celular.</h2>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  A interface do Inbox FLY UP separa quem é cliente novo, quem está aguardando retorno e quem já fechou. Os vendedores ganham tempo e os gestores conseguem monitorar a qualidade do atendimento da equipe em tempo real.
                </p>
                <ul className="space-y-4 pt-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-green-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
                    <span className="text-zinc-300">Respostas Sugeridas por IA lendo o contexto</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-green-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
                    <span className="text-zinc-300">Etiquetas coloridas para filtrar Urgências</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-green-500/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
                    <span className="text-zinc-300">Atribuir cliente para um fechador específico</span>
                  </li>
                </ul>
              </div>
              {/* Visual Abstract MOCK */}
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff7b00]/20 to-transparent blur-3xl opacity-50 rounded-full"></div>
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl relative z-10 w-full transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                  {/* Fake Inbox View */}
                  <div className="flex gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 w-40 bg-white/5 rounded"></div>
                    </div>
                    <div className="w-16 h-6 bg-[#ff7b00]/20 text-[#ff7b00] text-[10px] font-bold rounded-full flex items-center justify-center">Novo</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-end gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
                      <div className="bg-[#1a1a1a] rounded-2xl rounded-bl-none p-3 text-sm text-zinc-400 border border-white/5 w-3/4">Olá! Quero saber o preço.</div>
                    </div>
                    <div className="flex items-end justify-end gap-2">
                      <div className="bg-[#ff7b00]/10 text-[#ff7b00] rounded-2xl rounded-br-none p-3 text-sm border border-[#ff7b00]/20 w-3/4">Olá, João! Nosso sistema custa R$197. Posso te enviar o link?</div>
                      <div className="w-8 h-8 rounded-full bg-[#ff7b00]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 2 (Inverted) */}
            <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
              {/* Visual Abstract MOCK */}
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-l from-blue-500/20 to-transparent blur-3xl opacity-50 rounded-full"></div>
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl relative z-10 w-full transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
                  {/* Fake Kanban View */}
                  <div className="flex gap-4 overflow-hidden mask-image-right">
                    {/* Column 1 */}
                    <div className="w-1/2 bg-[#1a1a1a] rounded-xl p-4 flex-shrink-0">
                      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                        <div className="font-bold text-sm text-zinc-300">Demonstração</div>
                        <div className="text-xs text-zinc-500 font-mono">R$ 5k</div>
                      </div>
                      <div className="bg-[#222] p-3 rounded-lg border border-white/5 mb-3 shadow">
                        <div className="text-xs font-bold text-white mb-1">Empresa XYZ</div>
                        <div className="text-[10px] text-green-400">R$ 2.500,00</div>
                      </div>
                      <div className="bg-[#222] p-3 rounded-lg border border-white/5 shadow">
                        <div className="text-xs font-bold text-white mb-1">Lucas MEI</div>
                        <div className="text-[10px] text-green-400">R$ 2.500,00</div>
                      </div>
                    </div>
                    {/* Column 2 */}
                    <div className="w-1/2 bg-[#1a1a1a] rounded-xl p-4 flex-shrink-0 opacity-50">
                      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                        <div className="font-bold text-sm text-zinc-300">Negociação</div>
                      </div>
                      <div className="h-16 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] text-zinc-600">Arraste aqui</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 space-y-6 lg:pl-10">
                <div className="text-[#ff7b00] font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" /> PREVISIBILIDADE
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">Mova propostas e veja a <br /> receita acontecer.</h2>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  O Kanban do FLY UP CRM não é apenas visual, ele é matemático. Cada oportunidade de venda (Lead) na sua tela possui um valor. Conforme a negociação avança para as colunas finais, você tem clareza exata de quanto dinheiro está na mesa para fechar a meta do mês.
                </p>
                <Link href="/register" className="inline-flex items-center gap-2 text-[#ff7b00] font-bold uppercase tracking-wider text-sm mt-4 hover:pl-2 transition-all">
                  Experimentar Kanban de Vendas <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-24 bg-[#0a0a0a] border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">Escolha o plano ideal para a sua operação escalar</h2>
              <p className="text-lg text-zinc-400">Sem taxas escondidas. Cancele quando quiser. Acesse todos os recursos core independente do seu volume.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start pt-8">

              {/* Starter */}
              <div className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full hover:border-white/20 transition-colors">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Starter</h3>
                  <p className="text-zinc-500 text-sm mb-6 h-12">O funil poderoso para operações individuais e pequenos autônomos.</p>
                  <div className="mb-6 pb-6 border-b border-white/5">
                    <span className="text-5xl font-black text-white">R$ 97</span>
                    <span className="text-zinc-500 font-medium ml-1">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-zinc-300 items-start text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" />1 Usuário Admin</li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" />Caixa de Entrada Oficializada</li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" />Kanban e Negócios</li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded-xl border border-white/20 text-white font-bold uppercase tracking-wider text-sm text-center hover:bg-white/5 mt-auto transition-colors">
                  Assinar Starter
                </Link>
              </div>

              {/* Pro */}
              <div className="bg-gradient-to-b from-[#1a1005] to-[#0a0a0a] border-2 border-[#ff7b00] rounded-3xl p-8 flex flex-col justify-between h-full relative transform scale-100 lg:scale-105 shadow-[0_0_40px_rgba(255,123,0,0.1)] z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ff7b00] text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Recomendado
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#ff7b00] mb-2">Pro</h3>
                  <p className="text-zinc-400 text-sm mb-6 h-12">Para empresas que precisam de automação, equipe e inteligência juntas.</p>
                  <div className="mb-6 pb-6 border-b border-white/5">
                    <span className="text-5xl font-black text-white">R$ 197</span>
                    <span className="text-zinc-500 font-medium ml-1">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-white font-bold items-start text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Até 5 Usuários Livres</li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Criador de Robôs Flow (Visuais)</li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Disparos em Massa Controlados</li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Sugestões de IA no Inbox</li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded-xl bg-[#ff7b00] hover:bg-[#e66a00] text-black font-black uppercase tracking-wider text-sm text-center mt-auto transition-colors shadow-lg">
                  Assinar Pro
                </Link>
              </div>

              {/* Enterprise */}
              <div className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full hover:border-white/20 transition-colors">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Enterprise</h3>
                  <p className="text-zinc-500 text-sm mb-6 h-12">Escala massiva de faturamento, filiais e necessidades exclusivas.</p>
                  <div className="mb-6 pb-6 border-b border-white/5">
                    <span className="text-5xl font-black text-white">R$ 289</span>
                    <span className="text-zinc-500 font-medium ml-1">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-zinc-300 items-start text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" />Equipe Comercial Ilimitada</li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" />Métricas Financeiras CFO (Painel Master)</li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm"><CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0" />Suporte e Consultoria Head</li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded-xl border border-white/20 text-white font-bold uppercase tracking-wider text-sm text-center hover:bg-white/5 mt-auto transition-colors">
                  Assinar Enterprise
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#050505] relative z-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <img src="/logo.png" alt="FLY UP CRM" className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
            <p className="text-xs text-zinc-600 font-medium max-w-xs text-center md:text-left leading-relaxed">
              Sistema Profissional de Gerenciamento de Relacionamento e Fluxo de Clientes via WhatsApp.
            </p>
          </div>

          <div className="flex gap-8 text-sm text-zinc-500 font-semibold uppercase tracking-wider">
            <Link href="#" className="hover:text-white transition-colors">Suporte Ticket</Link>
            <Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-white transition-colors">Políticas</Link>
          </div>
        </div>
        <div className="mt-12 text-center text-xs text-zinc-700 font-bold tracking-widest uppercase">
          &copy; {new Date().getFullYear()} FLY UP SOFTWARE TECNOLOGIA. TODOS OS DIREITOS RESERVADOS.
        </div>
      </footer>
    </div>
  )
}
