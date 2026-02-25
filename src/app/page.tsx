import Link from 'next/link'
import { CheckCircle2, Bot, Layers, Zap, MessageSquare, BarChart3, Users, ArrowRight, ArrowUpRight, ShieldCheck, Activity, Star } from 'lucide-react'

// Utilizando Laranja da Marca (Primary)
const primaryColor = "text-[#ff7b00]"
const bgPrimary = "bg-[#ff7b00]"
const borderPrimary = "border-[#ff7b00]"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070707] text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white overflow-hidden relative">

      {/* Background Matrix/Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />

      {/* Header */}
      <header className="relative z-50 py-6 px-8 max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* A logo no topo - Discreta */}
          <img src="/logo.png" alt="FLY UP CRM" className="h-8 w-auto object-contain brightness-0 invert opacity-90" />
        </div>

        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-zinc-400">
          <Link href="#inicio" className="text-white transition-colors">Início</Link>
          <Link href="#recursos" className="hover:text-white transition-colors">Serviços</Link>
          <Link href="#sobre" className="hover:text-white transition-colors">Sobre</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Preços</Link>
        </nav>

        <div className="flex items-center flex-shrink-0">
          <Link href="/login" className="text-sm font-bold text-black bg-[#ff7b00] uppercase tracking-wider px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-all">
            Acessar Sistema
          </Link>
        </div>
      </header>

      <main className="relative z-10">

        {/* HERO SECTION */}
        <section id="inicio" className="pt-16 pb-32 px-8 max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Esquerda - Textos */}
          <div className="flex flex-col gap-8 relative z-10">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ff7b00]" /> GARANTA O CONTROLE DO SEU FUNIL !
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                A plataforma de <br />
                <span className={`text-[#ff7b00]`}>CRM B2B</span> <br />
                para o seu futuro.
              </h1>
            </div>

            <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
              O SaaS que centraliza seu WhatsApp, organiza suas propostas e aumenta as conversões através de fluxos inteligentes.
            </p>

            <div className="flex items-center gap-6 mt-4">
              <div className="flex -space-x-3">
                <img className="w-12 h-12 rounded-full border-2 border-[#070707]" src="https://i.pravatar.cc/100?img=33" alt="User" />
                <img className="w-12 h-12 rounded-full border-2 border-[#070707]" src="https://i.pravatar.cc/100?img=47" alt="User" />
                <img className="w-12 h-12 rounded-full border-2 border-[#070707]" src="https://i.pravatar.cc/100?img=12" alt="User" />
                <img className="w-12 h-12 rounded-full border-2 border-[#070707]" src="https://i.pravatar.cc/100?img=28" alt="User" />
                <div className="w-12 h-12 rounded-full border-2 border-[#070707] bg-[#ff7b00] flex items-center justify-center text-xs text-black font-black">
                  +3k
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-xl">168K+</p>
                <p className="text-zinc-500 text-xs uppercase tracking-wider">Leads Gerados</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <Link href="/register" className="w-14 h-14 rounded-full border border-[#ff7b00] text-[#ff7b00] flex items-center justify-center hover:bg-[#ff7b00] hover:text-black transition-colors group">
                <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
              </Link>
              <p className="text-zinc-500 text-sm max-w-[250px]">
                A FLY UP une e protege seu ecossistema comercial. Atendimentos simultâneos em um só Whatsapp.
              </p>
            </div>
          </div>

          {/* Direita - Arte / Elementos Visuais Livres */}
          <div className="relative h-[600px] w-full flex items-center justify-center lg:justify-end perspective-1000">
            {/* Linhas guias simulando gráficos orbitais */}
            <svg className="absolute inset-0 w-full h-full text-[#ff7b00] opacity-40 mix-blend-screen pointer-events-none" viewBox="0 0 600 600">
              <path d="M 50,300 C 150,500 450,100 550,300" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="animate-[dash_20s_linear_infinite]" />
              <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-20" />
              <path d="M 100,100 C 300,0 500,600 200,500" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-50 blur-[1px]" />
            </svg>

            {/* LOGO GIGANTE flutuando (Requisito do usuário) */}
            <div className="relative z-20 w-full max-w-lg lg:max-w-xl xl:max-w-2xl transform rotate-[-5deg] animate-[float_6s_ease-in-out_infinite]">
              {/* Brilho de fundo intenso */}
              <div className="absolute inset-0 bg-[#ff7b00] opacity-30 blur-[100px] rounded-full mix-blend-screen scale-125"></div>
              <img
                src="/logo.png"
                alt="FLY UP CRM Grand"
                className="w-full h-auto object-contain relative z-30 drop-shadow-[0_20px_50px_rgba(255,123,0,0.4)]"
              />
            </div>

            {/* Badge Orbitando 1 */}
            <div className="absolute top-1/4 left-0 hidden md:flex flex-col gap-1 bg-[#121212]/80 backdrop-blur-md border border-white/5 px-6 py-4 rounded-2xl shadow-2xl z-40 transform -rotate-6 animate-[float_5s_ease-in-out_infinite_reverse]">
              <div className="text-[#ff7b00] font-black text-xs uppercase flex justify-between gap-6 mb-2"><span>Novos Leads</span> <Activity className="w-4 h-4" /></div>
              <div className="text-3xl text-white font-bold">4.892</div>
              <div className="text-green-400 text-xs">+15% essa semana</div>
            </div>

            {/* Badge Orbitando 2 */}
            <div className="absolute bottom-1/4 right-0 hidden md:flex flex-col gap-1 bg-[#121212]/80 backdrop-blur-md border border-[#ff7b00]/20 px-6 py-4 rounded-2xl shadow-2xl z-40 transform rotate-3 animate-[float_7s_ease-in-out_infinite]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
                <span className="text-white text-sm font-bold">Venda Concluída</span>
              </div>
              <div className="text-2xl text-white font-bold tracking-tight">R$ 15.000,00</div>
              <div className="text-zinc-500 text-xs">Pago via Pix hoje</div>
            </div>
          </div>
        </section>

        {/* MID SECTION - OS 3 CARDS */}
        <section id="recursos" className="py-20 px-8 max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-end mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              O parceiro de vendas <br /> mais <span className="text-[#ff7b00]">confiável</span> do Brasil.
            </h2>
            <p className="text-zinc-400 text-sm max-w-sm">
              A FLY UP consolida e protege seu fluxo B2B através de pipelines de vendas especializados. Automação desenhada ponta-a-ponta para conversão.
            </p>
          </div>

          {/* Os 3 Blocos de Funcionalidades */}
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-x-0 relative z-10 w-full mb-32 group/cards">

            {/* Bloco 1 */}
            <div className="w-full md:w-1/3 bg-[#111111] border border-white/5 rounded-3xl md:rounded-r-none md:border-r-0 p-10 flex flex-col justify-center min-h-[300px] hover:bg-[#161616] transition-colors">
              <div className="text-[#ff7b00] font-black text-2xl mb-6">01.</div>
              <h3 className="text-white font-bold text-xl mb-4">Inbox Omnichannel</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Múltiplos usuários no mesmo WhatsApp. Organize conversas, filtre mensagens e responda 10x mais rápido.</p>
            </div>

            {/* Bloco 2 - DESTAQUE */}
            <div className="w-full md:w-1/3 bg-[#ff7b00] rounded-3xl p-10 flex flex-col justify-center min-h-[350px] transform md:-translate-y-4 shadow-[0_30px_60px_rgba(255,123,0,0.2)] md:scale-105 z-20 relative">
              <div className="text-black font-black text-2xl mb-6">02.</div>
              <h3 className="text-black font-black text-3xl mb-4 tracking-tight leading-none">Robôs visuais & <br />Automação.</h3>
              <p className="text-black/80 font-medium text-sm leading-relaxed mb-8">
                Crie cadências de atendimento sem precisar de código. Arraste blocos, envie áudios prontos e filtre os clientes automaticamente.
              </p>
              <Link href="/register" className="flex items-center gap-2 text-black font-black uppercase text-sm tracking-widest hover:pl-2 transition-all">
                SAIBA MAIS <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Bloco 3 */}
            <div className="w-full md:w-1/3 bg-[#111111] border border-white/5 rounded-3xl md:rounded-l-none md:border-l-0 p-10 flex flex-col justify-center min-h-[300px] hover:bg-[#161616] transition-colors">
              <div className="text-[#ff7b00] font-black text-2xl mb-6">03.</div>
              <h3 className="text-white font-bold text-xl mb-4">Kanban Financeiro</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Acompanhe cards com valores somados ao vivo. Saiba o momento exato em que a receita é gerada pela equipe.</p>
            </div>

          </div>
        </section>

        {/* BOTTOM SECTION - GRÁFICOS E CONFIANÇA */}
        <section className="py-20 px-8 max-w-[1400px] mx-auto border-t border-white/5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

            {/* Esquerda - Gráfico Abstrato */}
            <div className="w-full lg:w-1/2 relative h-[450px] flex items-center justify-center">

              {/* Linha do gráfico subindo */}
              <svg className="absolute w-full h-[70%] top-[30%] text-[#ff7b00] overflow-visible" viewBox="0 0 500 200" fill="none">
                <path d="M 0,150 Q 80,100 150,180 T 300,50 T 500,0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

                {/* Pontos de Intersecção Orbitando */}
                <circle cx="115" cy="140" r="12" fill="#070707" stroke="#ff7b00" strokeWidth="4" className="animate-pulse" />
                <circle cx="225" cy="120" r="12" fill="#070707" stroke="#ff7b00" strokeWidth="4" className="animate-pulse" />
                <circle cx="400" cy="25" r="12" fill="#070707" stroke="#ff7b00" strokeWidth="4" className="animate-pulse" />
              </svg>

              {/* Widgets do Gráfico */}
              <div className="absolute top-0 left-0 bg-[#121212]/90 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-2xl z-10 w-56">
                <div className="text-[#ff7b00] text-sm font-bold mb-1">R$ 15.000 (MÉDIA)</div>
                <div className="text-xs text-zinc-500 mb-4 leading-tight">Ticket médio atualizado após fechamentos rápidos de hoje.</div>
                <div className="h-12 w-full flex items-end gap-1 opacity-50">
                  {[40, 60, 45, 80, 50, 90, 70, 100, 60].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="w-full bg-[#ff7b00] rounded-sm"></div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-10 right-0 lg:-right-10 bg-[#121212]/90 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-2xl z-10 w-64 backdrop-saturate-150">
                <div className="text-white text-2xl font-bold tracking-tight mb-1">45.000 Lds</div>
                <div className="text-xs text-zinc-400 mb-4 leading-relaxed">Fluxo capturado de automações integradas na nuvem.</div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#ff7b00] w-[80%] h-full"></div>
                  </div>
                  <span className="text-[#ff7b00] text-xs font-bold">80%</span>
                </div>
              </div>
            </div>

            {/* Direita - Textos Finais */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Plataforma escaladora <br />
                <span className="text-zinc-500">agora & em qualquer lugar.</span>
              </h2>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-white fill-current" />
                ))}
              </div>

              <p className="text-zinc-400 text-sm max-w-lg leading-relaxed mt-4">
                A FLY UP integra o que há de mais eficiente em captação ativa. Com pipelines fluidos, respostas velozes e um Kanban inteligente, o futuro do seu negócio começa no primeiro clique.
              </p>

              <p className="text-zinc-400 text-sm max-w-lg leading-relaxed">
                Experimente nosso pacote Starter ou garanta a velocidade e automação que sua equipe exige no plano Pro.
              </p>

              <div className="flex items-center gap-8 mt-6">
                <Link href="/register" className="bg-[#ff7b00] text-black font-bold uppercase text-sm tracking-wider px-8 py-4 rounded-full hover:bg-white transition-colors duration-300">
                  Iniciar Avaliação Grátis <ArrowRight className="inline ml-2 w-4 h-4" />
                </Link>
                <Link href="#pricing" className="text-zinc-400 font-medium text-sm hover:text-white transition-colors">
                  Conhecer os Planos ?
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Pricing Rápido Opcional (apenas para não perder a navegação) */}
        <section id="pricing" className="py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-10">Planos escaláveis para o seu cenário.</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto opacity-80 hover:opacity-100 transition-opacity">
              {/* Starter */}
              <div className="p-8 border border-white/10 rounded-3xl bg-[#0a0a0a]">
                <h3 className="text-xl font-bold text-white">Starter</h3>
                <div className="text-3xl font-black text-white mt-4 mb-6">R$ 97 <span className="text-sm font-normal text-zinc-500">/mês</span></div>
                <Link href="/register" className="block w-full text-center border tracking-wider border-[#ff7b00] text-[#ff7b00] py-3 rounded-full text-sm font-bold hover:bg-[#ff7b00] hover:text-black transition-colors">Assinar</Link>
              </div>
              {/* Pro */}
              <div className="p-8 border-2 border-[#ff7b00] rounded-3xl bg-[#111111] transform md:-translate-y-4">
                <h3 className="text-xl font-bold text-[#ff7b00]">Pro</h3>
                <div className="text-3xl font-black text-white mt-4 mb-6">R$ 197 <span className="text-sm font-normal text-zinc-500">/mês</span></div>
                <Link href="/register" className="block w-full text-center bg-[#ff7b00] text-black tracking-wider py-3 rounded-full text-sm font-bold hover:bg-white transition-colors">Assinar Agora</Link>
              </div>
              {/* Enterprise */}
              <div className="p-8 border border-white/10 rounded-3xl bg-[#0a0a0a]">
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
                <div className="text-3xl font-black text-white mt-4 mb-6">R$ 289 <span className="text-sm font-normal text-zinc-500">/mês</span></div>
                <Link href="/register" className="block w-full text-center border tracking-wider border-white/20 text-white py-3 rounded-full text-sm font-bold hover:bg-white/10 transition-colors">Falar com Consultor</Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-10 border-t border-white/5 text-center px-6">
        <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider">&copy; {new Date().getFullYear()} FLY UP SOFTWARE B2B. TODOS OS DIREITOS RESERVADOS.</p>
      </footer>

    </div>
  )
}
