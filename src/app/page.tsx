import Link from 'next/link'
import { ArrowRight, CheckCircle2, Layers, MessageSquare, Zap, Activity, Users, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white overflow-x-hidden relative">

      {/* --- BACKGROUND ONDAS LARANJAS (3D WAVE EFFECT SIMULATION) --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
        {/* Main glowing wave layer 1 */}
        <div className="absolute top-[30%] left-[-10%] w-[120%] h-[400px] bg-gradient-to-r from-transparent via-[#ff3b00]/15 to-transparent blur-[80px] transform -rotate-12 animate-[pulse_10s_ease-in-out_infinite_alternate]"></div>
        {/* Main glowing layer 2 (Depth) */}
        <div className="absolute top-[50%] left-[10%] w-[100%] h-[300px] bg-gradient-to-r from-transparent via-[#ff7b00]/20 to-transparent blur-[100px] transform rotate-6 animate-[pulse_15s_ease-in-out_infinite_alternate-reverse]"></div>
        {/* Soft core glow */}
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[500px] bg-[#ff5500]/10 blur-[150px] rounded-[100%] animate-[spin_30s_linear_infinite_reverse]"></div>
        {/* Subtle grid pattern overlay for texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGwtMTItMTJMMiAxMCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wMiIvPjwvZz48L3N2Zz4=')] opacity-50 mix-blend-overlay"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-50 pt-8 pb-4 border-b border-white/5 bg-[#020202]/30 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Logo - Top Left */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="FLY UP CRM"
              className="h-16 md:h-[72px] lg:h-20 w-auto object-contain transition-all duration-700 group-hover:drop-shadow-[0_0_20px_rgba(255,123,0,0.4)]"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-10 text-[13px] font-bold tracking-widest uppercase text-zinc-500">
            <Link href="#solucao" className="hover:text-white transition-colors">Plataforma</Link>
            <Link href="#beneficios" className="hover:text-white transition-colors">Benefícios</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Preços</Link>
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-white hover:text-[#ff7b00] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#ff7b00] hover:after:w-full after:transition-all">
              Acessar
            </Link>
            <Link href="/register" className="text-[13px] font-bold text-black uppercase tracking-widest bg-gradient-to-r from-[#ff7b00] to-[#ff9900] px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,123,0,0.3)] hover:shadow-[0_0_35px_rgba(255,123,0,0.5)]">
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full overflow-hidden">

        {/* --- HERO SECTION - PREMIUM PROBLEM RESOLUTION --- */}
        <section className="pt-28 pb-40 px-6 max-w-[1200px] mx-auto flex flex-col items-center text-center relative">

          {/* Animated Floating Badges */}
          <div className="absolute top-[10%] left-[5%] md:left-[10%] hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full animate-[float_6s_ease-in-out_infinite_reverse]">
            <ShieldCheck className="w-4 h-4 text-green-400" /> <span className="text-xs font-bold text-white">Segurança B2B</span>
          </div>
          <div className="absolute top-[20%] right-[5%] md:right-[10%] hidden md:flex items-center gap-2 bg-[#ff7b00]/10 backdrop-blur-md border border-[#ff7b00]/20 px-4 py-2 rounded-full animate-[float_8s_ease-in-out_infinite]">
            <Activity className="w-4 h-4 text-[#ff7b00]" /> <span className="text-xs font-bold text-[#ff7b00]">+250% Conversão</span>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#ff7b00]/30 bg-[#ff7b00]/5 text-xs font-black uppercase tracking-[0.2em] text-[#ff7b00] mb-12 shadow-[0_0_20px_rgba(255,123,0,0.1)]">
            A evolução da operação comercial
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[76px] font-black text-white leading-tight tracking-normal mb-10 max-w-5xl drop-shadow-xl">
            Do caos invisível ao <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7b00] via-[#ffaa00] to-[#ff5500]">controle financeiro absoluto.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed mb-16 font-light">
            Perder vendas no labirinto do WhatsApp é o erro mais caro da sua empresa. A FLY UP transforma mensagens dispersas em um fluxo de caixa previsível, organizado e totalmente automatizado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto relative z-20">
            <Link href="/register" className="w-full sm:w-auto bg-white text-black font-black uppercase tracking-widest text-sm py-5 px-12 rounded-full hover:bg-zinc-200 transition-colors duration-300 shadow-[0_15px_30px_rgba(255,255,255,0.1)] transform hover:-translate-y-1">
              Resolver Agora (Teste Grátis)
            </Link>
            <Link href="#solucao" className="w-full sm:w-auto text-white font-bold uppercase tracking-widest text-sm py-5 px-10 rounded-full border border-white/20 hover:bg-white/5 transition-colors duration-300">
              Entender a Plataforma
            </Link>
          </div>

          <p className="mt-10 text-xs font-medium tracking-widest uppercase text-zinc-600">
            Nenhum dado é perdido &bull; Integração API Oficial
          </p>

        </section>

        {/* --- PLATFORM HIGHLIGHTS (ANIMATED/FLOATING) --- */}
        <section id="solucao" className="py-32 relative">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-40">

            {/* Block 1: O Caos do Inbox Resolvido */}
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="w-full lg:w-1/2">
                <div className="text-[#ff7b00] font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-[#ff7b00]"></span> Centralização
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
                  A cura para o <br /> WhatsApp caótico.
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed font-light mb-10">
                  Ter dez abas do WhatsApp Web abertas e depender do "celular do vendedor" acabou. Toda a sua equipe conectada no mesmo número oficial. Classificações por cor (urgente, pago, prospecção) ajudam sua equipe a focar apenas no que coloca dinheiro no caixa.
                </p>

                <ul className="space-y-6 mb-10">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-white/5 p-2 rounded-lg border border-white/10"><MessageSquare className="w-5 h-5 text-[#ff7b00]" /></div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Múltiplos Atendentes</h4>
                      <p className="text-sm font-light text-zinc-500">Repasse leads de suporte para SDR num único clique.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-white/5 p-2 rounded-lg border border-white/10"><CheckCircle2 className="w-5 h-5 text-[#ff7b00]" /></div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">IA de Resposta (Whisper)</h4>
                      <p className="text-sm font-light text-zinc-500">Transcreva áudios instantaneamente e receba textos sugeridos.</p>
                    </div>
                  </li>
                </ul>
              </div>
              {/* Floating Abstract Element */}
              <div className="w-full lg:w-1/2 h-[500px] relative">
                <div className="absolute inset-0 bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden">
                  {/* Fundo interno brilhante */}
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ff7b00]/10 blur-[80px] rounded-full"></div>

                  {/* Elementos flutuantes simulando UI do Inbox */}
                  <div className="relative w-full max-w-sm">
                    <div className="bg-[#111] p-5 rounded-2xl border border-white/10 shadow-2xl animate-[float_8s_ease-in-out_infinite] z-20 absolute -top-24 left-10 w-64 backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800"></div>
                        <div>
                          <div className="h-3 w-20 bg-zinc-700/50 rounded mb-1"></div>
                          <div className="text-[10px] text-[#ff7b00] font-bold">Aguardando</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-zinc-800/50 h-6 w-4/5 rounded-md"></div>
                        <div className="bg-zinc-800/50 h-6 w-full rounded-md"></div>
                      </div>
                    </div>

                    <div className="bg-[#151515] p-6 rounded-2xl border border-[#ff7b00]/30 shadow-[0_20px_50px_rgba(255,123,0,0.15)] animate-[float_10s_ease-in-out_infinite_reverse] z-30 absolute top-10 right-0 w-80">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="h-2 w-10 text-white text-xs font-bold mb-4">SDR Atuando</div>
                          <div className="w-full p-3 bg-zinc-900 rounded-lg text-xs text-zinc-400 border border-white/5">Olá João, a proposta...</div>
                          <div className="w-full p-3 bg-[#ff7b00]/10 text-[#ff7b00] rounded-lg text-xs border border-[#ff7b00]/20 ml-6">Pode transbordar a venda!</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 2: O Caos do Pipeline Resolvido */}
            <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
              <div className="w-full lg:w-1/2 h-[500px] relative">
                <div className="absolute inset-0 bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ff7b00]/10 blur-[80px] rounded-full"></div>

                  <div className="relative w-full px-8 h-full flex flex-col justify-center gap-6">
                    {/* Floating Kanban Columns */}
                    <div className="flex items-start gap-4 h-64 overflow-hidden transform rotate-2 animate-[float_12s_ease-in-out_infinite]">
                      <div className="w-48 bg-[#111] rounded-2xl border border-white/10 p-4 h-full">
                        <div className="flex justify-between items-center mb-6">
                          <div className="h-2 w-16 bg-zinc-700/50 rounded"></div>
                          <div className="text-[#ff7b00] font-bold text-xs">R$ 5k</div>
                        </div>
                        <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5 mb-3">
                          <div className="h-2 w-20 bg-zinc-600 rounded mb-2"></div>
                          <div className="h-1.5 w-12 bg-green-500/50 rounded"></div>
                        </div>
                      </div>

                      <div className="w-48 bg-gradient-to-b from-[#ff7b00]/20 to-[#111] rounded-2xl border border-[#ff7b00]/30 p-4 transform -translate-y-4">
                        <div className="flex justify-between items-center mb-6">
                          <div className="text-white font-bold text-sm">Fechamento</div>
                          <div className="text-[#ff7b00] font-black text-sm">R$ 12k</div>
                        </div>
                        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#ff7b00]/20 shadow-[0_10px_30px_rgba(255,123,0,0.2)]">
                          <div className="h-2.5 w-24 bg-white rounded mb-3"></div>
                          <div className="h-2 w-16 bg-green-400 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="text-[#ff7b00] font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-[#ff7b00]"></span> Previsão Genial
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
                  Pipeline Financeiro. <br /> Enxergue o seu lucro.
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed font-light mb-10">
                  A FLY UP abandonou listas infinitas de nomes. Seu cliente agora habita um Kanban Financeiro. O simples ato de arrastar um lead para a direita na tela calcula automaticamente a injeção prevista de capital na sua empresa neste mês.
                </p>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <h4 className="text-3xl font-black text-white mb-2">90%</h4>
                    <p className="text-sm text-zinc-500 font-light">Mais assertividade na sua meta de fim de mês.</p>
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-[#ff7b00] mb-2">+ 2h</h4>
                    <p className="text-sm text-zinc-500 font-light">Economizadas por gestor na leitura de métricas diárias.</p>
                  </div>
                </div>

                <Link href="/register" className="text-white font-bold text-sm tracking-wider uppercase border-b border-[#ff7b00] pb-1 hover:text-[#ff7b00] transition-colors">
                  Conhecer Ferramenta Grátis
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* --- PREMIUM FEATURES BENTO BOX --- */}
        <section id="beneficios" className="py-32 bg-[#000] border-y border-white/5 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff7b00]/5 blur-[200px] rounded-full pointer-events-none -translate-y-1/2"></div>

          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-20 text-balance">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">Pense grande. Entregamos a infraestrutura nativa.</h2>
              <p className="text-zinc-400 text-lg font-light">Esqueça o Zappier. Chega de remendos técnicos para o seu celular funcionar. Entregamos arquitetura na nuvem.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

              {/* Bento 1: Robôs */}
              <div className="md:col-span-2 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 hover:border-[#ff7b00]/30 rounded-[32px] p-10 md:p-14 group transition-all duration-500 overflow-hidden relative">
                <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                  <div className="w-16 h-16 bg-[#ff7b00]/10 rounded-2xl flex items-center justify-center text-[#ff7b00]">
                    <Layers className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-4">Construtor de Robôs <br />(Drag & Drop)</h3>
                    <p className="text-zinc-500 font-light text-lg max-w-lg leading-relaxed">Sua recepcionista 24h não dorme. Arraste blocos lógicos nativamente no sistema, capture e-mails, envie áudios prontos e mande o cliente mastigado para o corretor.</p>
                  </div>
                </div>
                {/* Arte abstrata fundo */}
                <div className="absolute right-0 bottom-0 text-[200px] text-[#ff7b00]/5 select-none transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                  <Layers />
                </div>
              </div>

              {/* Bento 2: Massivo */}
              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 hover:border-[#ff7b00]/30 rounded-[32px] p-10 md:p-14 group transition-all duration-500">
                <div className="w-16 h-16 bg-[#ff7b00]/10 rounded-2xl flex items-center justify-center text-[#ff7b00] mb-12">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Envios<br />Massivos.</h3>
                <p className="text-zinc-500 font-light text-lg leading-relaxed">Dispare mensagens de remarketing e boletos em filas assíncronas no fundo do servidor. Sem travar sua máquina.</p>
              </div>

              {/* Bento 3: CFO */}
              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 hover:border-[#ff7b00]/30 rounded-[32px] p-10 md:p-14 group transition-all duration-500">
                <div className="w-16 h-16 bg-[#ff7b00]/10 rounded-2xl flex items-center justify-center text-[#ff7b00] mb-12">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Visão <br />C-Level.</h3>
                <p className="text-zinc-500 font-light text-lg leading-relaxed">Gráficos de fluxo autênticos. Acompanhe a média de fechamento por analista e o CAC da empresa em tempo real.</p>
              </div>

              {/* Bento 4: Equipe */}
              <div className="md:col-span-2 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 hover:border-[#ff7b00]/30 rounded-[32px] p-10 md:p-14 group transition-all duration-500 overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row h-full items-center justify-between gap-12">
                  <div className="flex-1">
                    <div className="w-16 h-16 bg-[#ff7b00]/10 rounded-2xl flex items-center justify-center text-[#ff7b00] mb-12">
                      <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Hierarquia Militar de Equipe</h3>
                    <p className="text-zinc-500 font-light text-lg max-w-lg leading-relaxed">O vendedor vê somente seus próprios leads. O gerente acompanha as conversas na tela dele, ao vivo. Privilégios definidos com 1 clique.</p>
                  </div>
                  <div className="w-full md:w-1/3 flex justify-end">
                    {/* Mock Avatares */}
                    <div className="flex flex-col -space-y-4">
                      <div className="w-16 h-16 rounded-full border-4 border-[#111] bg-gradient-to-br from-zinc-700 to-zinc-800 z-30"></div>
                      <div className="w-16 h-16 rounded-full border-4 border-[#111] bg-gradient-to-br from-zinc-600 to-zinc-700 z-20 translate-x-4"></div>
                      <div className="w-16 h-16 rounded-full border-4 border-[#111] bg-[#ff7b00] flex items-center justify-center text-black font-black text-sm z-10 translate-x-8">Admin</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- LUXURY PRICING --- */}
        <section id="pricing" className="py-40 bg-[#020202] relative">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">

            <div className="text-center mb-24 max-w-2xl mx-auto">
              <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">O poder de escala no seu bolso.</h2>
              <p className="text-xl text-zinc-400 font-light leading-relaxed">A ferramenta certa custa os lucros extras que ela obrigatoriamente gera na primeira semana.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">

              {/* Starter */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-12 transition-colors hover:bg-[#111]">
                <h3 className="text-2xl font-bold text-white mb-3">Starter</h3>
                <p className="text-zinc-500 font-light mb-10 text-sm">Organização comercial base B2B e Solopreneurs.</p>
                <div className="mb-12">
                  <span className="text-5xl font-black text-white">R$ 97</span>
                  <span className="text-zinc-600 font-bold ml-2">/mês</span>
                </div>
                <ul className="space-y-6 mb-12">
                  <li className="flex gap-4 text-zinc-400 font-light text-sm"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />1 Acesso Comercial Único</li>
                  <li className="flex gap-4 text-zinc-400 font-light text-sm"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />Inbox do WhatsApp unificado</li>
                  <li className="flex gap-4 text-zinc-400 font-light text-sm"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />Gestão por Kanban Trello-like</li>
                </ul>
                <Link href="/register" className="block w-full py-5 rounded-full border border-white/20 text-white font-black uppercase tracking-widest text-[13px] text-center hover:bg-white hover:text-black transition-all">
                  Licença Starter
                </Link>
              </div>

              {/* Pro (Highlighted) */}
              <div className="bg-[#0f0f0f] border border-[#ff7b00]/40 rounded-[40px] p-12 relative shadow-[0_0_60px_rgba(255,123,0,0.15)] transform scale-100 lg:scale-105 z-10 backdrop-blur-xl">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-gradient-to-r from-[#ff7b00] to-[#ffaa00] text-black text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl shadow-[#ff7b00]/30 animate-pulse">
                  Essencial para Escalar
                </div>
                <h3 className="text-2xl font-bold text-[#ff7b00] mb-3">Pro Equipes</h3>
                <p className="text-zinc-400 font-light mb-10 text-sm">Operações intensas, Múltiplos Vendedores e Robôs.</p>
                <div className="mb-12">
                  <span className="text-6xl font-black text-white">R$ 197</span>
                  <span className="text-zinc-600 font-bold ml-2">/mês</span>
                </div>
                <ul className="space-y-6 mb-12">
                  <li className="flex gap-4 text-white font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Acesso para 5 Colaboradores Admin</li>
                  <li className="flex gap-4 text-zinc-300 font-light text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Módulo de Transmissões Ocultas</li>
                  <li className="flex gap-4 text-zinc-300 font-light text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Automação de Robôs Drag & Drop</li>
                  <li className="flex gap-4 text-zinc-300 font-light text-sm"><CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0" />Inteligência Artificial Ativa</li>
                </ul>
                <Link href="/register" className="block w-full py-5 rounded-full bg-gradient-to-r from-[#ff7b00] to-[#ff9900] text-black font-black uppercase tracking-widest text-[13px] text-center hover:scale-105 transition-all shadow-[0_10px_20px_rgba(255,123,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,123,0,0.4)]">
                  Licença Profissional
                </Link>
              </div>

              {/* Enterprise */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-12 transition-colors hover:bg-[#111]">
                <h3 className="text-2xl font-bold text-white mb-3">Enterprise Max</h3>
                <p className="text-zinc-500 font-light mb-10 text-sm">Escala global, infraestrutura dedicada ou Call Centers.</p>
                <div className="mb-12">
                  <span className="text-5xl font-black text-white">R$ 289</span>
                  <span className="text-zinc-600 font-bold ml-2">/mês</span>
                </div>
                <ul className="space-y-6 mb-12">
                  <li className="flex gap-4 text-zinc-400 font-light text-sm"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />Membros de Equipe Ilimitados</li>
                  <li className="flex gap-4 text-zinc-400 font-light text-sm"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />Infraestrutura Dedicada Pessoal</li>
                  <li className="flex gap-4 text-zinc-400 font-light text-sm"><CheckCircle2 className="w-5 h-5 text-white/20 shrink-0" />Canal de Consultoria de Vendas Direto</li>
                </ul>
                <Link href="/register" className="block w-full py-5 rounded-full border border-white/20 text-white font-black uppercase tracking-widest text-[13px] text-center hover:bg-white hover:text-black transition-all">
                  Licença Max (Ilimitada)
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* --- PREMIUM FOOTER --- */}
      <footer className="py-16 border-t border-white/5 bg-[#000] z-10 relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start opacity-70 hover:opacity-100 transition-opacity">
            <img src="/logo.png" alt="FLY UP CRM" className="h-12 w-auto object-contain mb-6 grayscale hover:grayscale-0 transition-all duration-500" />
            <p className="text-sm text-zinc-500 font-light max-w-sm text-center md:text-left leading-relaxed">
              Sistema Profissional de Gerenciamento de Relacionamentos B2B e Fluxos de Caixa na Nuvem. O controle supremo de Vendas que opera em background.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6 text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
            <div className="flex gap-8">
              <Link href="#" className="hover:text-[#ff7b00] transition-colors">Infraestrutura</Link>
              <Link href="#" className="hover:text-[#ff7b00] transition-colors">Políticas de Uso</Link>
              <Link href="#" className="hover:text-[#ff7b00] transition-colors">Ajuda</Link>
            </div>
            <div className="mt-4 text-zinc-700">
              &copy; {new Date().getFullYear()} FLY UP SOFTWARE TECNOLOGIA. TODOS OS DIREITOS RESERVADOS.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
