import Link from 'next/link'
import { CheckCircle2, Bot, Layers, Zap, MessageSquare, BarChart3, Users, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-[#ff7b00]/30 selection:text-white">
      {/* Header / Navbar */}
      <header className="absolute top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-32 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="FLY UP CRM" className="h-20 w-auto object-contain drop-shadow-lg" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-white/70 hover:text-white transition-colors uppercase tracking-wider">
              Acessar
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-0 px-6 relative overflow-hidden flex items-center border-b-[8px] border-[#ff7b00]">
          {/* Background glow & lines for tech feel */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(255,123,0,0.15)_0%,transparent_50%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-end relative z-10 w-full min-h-[600px]">
            {/* Left Column (Text & Form) */}
            <div className="flex flex-col gap-6 pb-20 justify-center h-full">
              <div className="inline-flex items-center gap-2 text-[#ff7b00] font-bold tracking-widest uppercase text-sm">
                <Layers className="w-5 h-5" /> Simplificando suas Vendas
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1] uppercase tracking-tighter">
                TRANSFORME A <br />
                <span className="text-[#ff7b00]">OPERAÇÃO DE VENDAS</span> DA SUA EQUIPE
              </h1>

              <p className="text-lg md:text-xl text-zinc-400 max-w-lg leading-snug mt-2">
                Elimine o caos no WhatsApp, automatize o funil e conquiste resultados incríveis controlando seus leads. Descubra o método FLY UP.
              </p>

              {/* Formulário Falso / Captação Visual */}
              <form action="/register" className="flex flex-col gap-3 mt-6 w-full max-w-md bg-transparent">
                <input
                  type="text"
                  placeholder="Nome Completo"
                  className="w-full bg-[#111] border border-white/10 rounded px-5 py-4 text-white focus:border-[#ff7b00] outline-none transition-colors"
                  required
                />
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="w-full bg-[#111] border border-white/10 rounded px-5 py-4 text-white focus:border-[#ff7b00] outline-none transition-colors"
                  required
                />
                <input
                  type="tel"
                  placeholder="Seu WhatsApp"
                  className="w-full bg-[#111] border border-white/10 rounded px-5 py-4 text-white focus:border-[#ff7b00] outline-none transition-colors"
                  required
                />

                <button type="submit" className="w-full bg-[#ff7b00] hover:bg-[#e66a00] text-black font-black uppercase tracking-wide py-4 px-6 rounded mt-2 transition-transform hover:scale-[1.02] shadow-2xl shadow-[#ff7b00]/20">
                  Quero escalar minhas vendas
                </button>
              </form>
            </div>

            {/* Right Column (User Photo / Hero Layout Match) */}
            <div className="relative h-full flex items-end justify-center lg:justify-end hidden md:flex">
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
              {/* Instrução: Colocar a foto recortada de fundo transparente do usuário em public/perfil-hero.png */}
              <img
                src="/perfil-hero.png"
                alt="Especialista"
                className="w-full max-w-lg object-contain relative z-0 drop-shadow-[0_0_50px_rgba(255,123,0,0.3)] filter contrast-125"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80&fm=png&bg=transparent' }}
              />
            </div>
          </div>
        </section>

        {/* Features - Formato de Faixa Chamativa */}
        <section className="py-24 px-6 bg-[#ff7b00]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tight">O QUE TEM NO SISTEMA</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#050505] p-10 rounded-xl flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform shadow-2xl border border-white/5">
                <MessageSquare className="w-16 h-16 text-[#ff7b00] mb-6" />
                <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter">INBOX OMNICHANNEL</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Converse em uma única tela. Peça para a Inteligência Artificial formular respostas rápidas focadas em conversão total.
                </p>
              </div>

              <div className="bg-[#050505] p-10 rounded-xl flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform shadow-2xl border border-white/5">
                <Layers className="w-16 h-16 text-[#ff7b00] mb-6" />
                <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter">KANBAN DE VENDAS</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Saiba onde está cada proposta. Cards automáticos calculam instantaneamente os valores na mesa.
                </p>
              </div>

              <div className="bg-[#050505] p-10 rounded-xl flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform shadow-2xl border border-white/5">
                <Bot className="w-16 h-16 text-[#ff7b00] mb-6" />
                <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter">ROBÔS DRAG & DROP</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Crie automações complexas soltando blocos na tela. Capture dados do cliente antes dele chegar ao atendimento humano.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Options - Planos Ajustados (Enterprise a 289) */}
        <section id="pricing" className="py-24 px-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">MUDE O PATAMAR DA ROTINA</h2>
              <p className="text-lg text-zinc-400 max-w-xl mx-auto">Acesso integral aos módulos mais fortes de vendas por valores escaláveis e sem entrelinhas.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
              {/* Starter */}
              <div className="bg-[#111] border border-white/5 rounded-2xl p-10 flex flex-col justify-between">
                <div>
                  <div className="mb-2">
                    <h3 className="text-2xl font-black text-white inline flex-col uppercase tracking-tighter">Starter</h3>
                  </div>
                  <p className="text-zinc-400 mb-8 mt-2 line-clamp-2 h-10 text-sm">Controle sua carteira e funil de clientes de forma segura e imediata.</p>
                  <div className="mb-8 flex items-end gap-1">
                    <span className="text-5xl font-black text-white">R$ 97</span>
                    <span className="text-zinc-500 font-medium pb-1.5 uppercase text-xs tracking-wider">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-zinc-300 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Licença para 1 Usuário Mestre</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Caixa de Entrada Unificada</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Kanban de Vendas Ilimitado</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded border border-white/10 bg-transparent text-white font-bold uppercase tracking-wider text-sm text-center hover:bg-white/5 transition-colors">
                  Assinar Starter
                </Link>
              </div>

              {/* Pro */}
              <div className="bg-black border-2 border-[#ff7b00] rounded-2xl p-10 flex flex-col justify-between relative shadow-2xl shadow-[#ff7b00]/20 transform scale-100 lg:scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ff7b00] text-black text-xs font-black px-6 py-1.5 rounded uppercase tracking-widest shadow-lg">
                  MAIS ESCOLHIDO
                </div>
                <div>
                  <div className="mb-2">
                    <h3 className="text-2xl font-black text-[#ff7b00] uppercase tracking-tighter">Pro</h3>
                  </div>
                  <p className="text-zinc-400 mb-8 mt-2 line-clamp-2 h-10 text-sm">Para equipes de prospecção pesada que precisam de autonomia.</p>
                  <div className="mb-8 flex items-end gap-1">
                    <span className="text-5xl font-black text-white">R$ 197</span>
                    <span className="text-zinc-500 font-medium pb-1.5 uppercase text-xs tracking-wider">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-white font-medium items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Até 5 colaboradores logados</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Sugestão de Respostas via IA</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Atendimento Automático Flow</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Ferramenta de Disparos Massa</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded bg-[#ff7b00] text-black font-black uppercase tracking-wider text-sm text-center hover:bg-[#e66a00] transition-colors shadow-lg">
                  Assinar Pro
                </Link>
              </div>

              {/* Enterprise */}
              <div className="bg-[#111] border border-white/5 rounded-2xl p-10 flex flex-col justify-between">
                <div>
                  <div className="mb-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Enterprise</h3>
                  </div>
                  <p className="text-zinc-400 mb-8 mt-2 line-clamp-2 h-10 text-sm">O pacote de performance para faturamentos múltiplos em escala.</p>
                  <div className="mb-8 flex items-end gap-1">
                    <span className="text-5xl font-black text-white">R$ 289</span>
                    <span className="text-zinc-500 font-medium pb-1.5 uppercase text-xs tracking-wider">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-zinc-300 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Equipe ilimitada</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Painel Avançado (CFO / ROI)</span>
                    </li>
                    <li className="flex gap-3 text-zinc-300 items-start text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                      <span>Suporte Especializado 24h</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="w-full py-4 rounded border border-white/10 bg-transparent text-white font-bold uppercase tracking-wider text-sm text-center hover:bg-white/5 transition-colors">
                  Assinar Enterprise
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <img src="/logo.png" alt="FLY UP CRM" className="h-10 w-auto object-contain opacity-50 grayscale hover:grayscale-0 transition-all" />
          <div className="text-xs text-zinc-600 font-medium tracking-wide uppercase">
            &copy; {new Date().getFullYear()} FLY UP Tech LTDA. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
