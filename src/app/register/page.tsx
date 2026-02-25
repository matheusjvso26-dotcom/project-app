'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Building2, Mail, Lock, User as UserIcon, Loader2, CheckCircle2 } from 'lucide-react'
import { register } from '@/app/auth/actions'

function RegisterForm() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // Mesma lógica do login para pegar msg inicial de redirect não-autorizado, etc
    const initialMessage = searchParams.get('message')

    const [error, setError] = useState<string | null>(initialMessage || null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await register(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else if (result?.success) {
            setSuccess(result.success)
            setLoading(false)
            // Aguarda uns segundos e envia o usuário para a tela de login
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        }
    }

    if (success) {
        return (
            <div className="bg-card py-12 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-green-500/30 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Conta Criada!</h3>
                <p className="text-muted-foreground text-sm">
                    {success} <br /><br />
                    Redirecionando para o login...
                </p>
            </div>
        )
    }

    return (
        <div className="bg-card py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-border/50">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 text-center text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    {error}
                </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-card-foreground">
                            Seu Nome Completo
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                disabled={loading}
                                className="focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-border/50 rounded-lg py-3 bg-background text-foreground outline-none transition-all disabled:opacity-50"
                                placeholder="João Silva"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-card-foreground">
                            Nome da Empresa
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <input
                                id="company"
                                name="company"
                                type="text"
                                required
                                disabled={loading}
                                className="focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-border/50 rounded-lg py-3 bg-background text-foreground outline-none transition-all disabled:opacity-50"
                                placeholder="Sua Software House"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-card-foreground">
                        E-mail Gestor
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            disabled={loading}
                            className="focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-border/50 rounded-lg py-3 bg-background text-foreground outline-none transition-all disabled:opacity-50"
                            placeholder="admin@empresa.com.br"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-card-foreground">
                        WhatsApp (Aprovação Rápida)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-muted-foreground text-sm font-bold ml-1 border-r border-border pr-2 py-1 flex items-center">BR</span>
                        </div>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            disabled={loading}
                            className="focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-[52px] sm:text-sm border-border/50 rounded-lg py-3 bg-background text-foreground outline-none transition-all disabled:opacity-50"
                            placeholder="(11) 99999-9999"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-card-foreground">
                        Senha Mestra
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={loading}
                            className="focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-border/50 rounded-lg py-3 bg-background text-foreground outline-none transition-all disabled:opacity-50"
                            placeholder="Mín. 8 char. (+1 Maiúsc., +1 Num, +1 Esp.)"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-4 px-4 rounded-xl shadow-[0_0_15px_rgba(255,123,0,0.3)] text-sm font-black text-black bg-[#ff7b00] hover:bg-white focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2 uppercase tracking-wide cursor-pointer"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Preparando Workspace...' : 'Iniciar Avaliação Gratuita'}
                    </button>
                </div>

                <p className="text-xs text-center text-muted-foreground/60 mt-4 font-light">
                    Reservado apenas para operações corporativas.<br /> Sujeito à análise de segurança.
                </p>
            </form>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Detail */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff7b00]/5 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center flex-row items-center gap-3">
                    <img src="/logo.png" alt="FLY UP Logo" className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,123,0,0.3)]" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-black text-foreground tracking-tight">
                    Infraestrutura B2B
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground font-light mb-8">
                    Já é nosso parceiro?{' '}
                    <Link href="/login" className="font-bold text-[#ff7b00] hover:text-white transition-colors underline-offset-4 hover:underline">
                        Acesse seu Painel
                    </Link>
                </p>
            </div>

            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
                <Suspense fallback={<div className="h-[500px] bg-card rounded-2xl border border-border/50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#ff7b00] animate-spin" /></div>}>
                    <RegisterForm />
                </Suspense>
            </div>
        </div>
    )
}
