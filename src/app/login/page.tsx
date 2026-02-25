'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { login } from '@/app/auth/actions'

function LoginForm() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // Pega a mensagem de searchParams caso venha de um logout ou tentativa sem permissão
    const initialMessage = searchParams.get('message')

    const [error, setError] = useState<string | null>(initialMessage || null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            // Em caso de sucesso, login faz redirect para /dashboard pelo server,
            // mas se voltar sem erro, também forçamos o push.
            router.push('/dashboard')
        }
    }

    return (
        <div className="bg-card py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-border/50">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 text-center text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    {error}
                </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-card-foreground">
                        Endereço de E-mail
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            disabled={loading}
                            className="focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-border/50 rounded-lg py-3 bg-background text-foreground outline-none transition-all disabled:opacity-50"
                            placeholder="voce@empresa.com.br"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-card-foreground">
                        Senha
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            disabled={loading}
                            className="focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-border/50 rounded-lg py-3 bg-background text-foreground outline-none transition-all disabled:opacity-50"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            disabled={loading}
                            className="h-4 w-4 text-[#ff7b00] focus:ring-[#ff7b00] border-border rounded cursor-pointer"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-card-foreground cursor-pointer">
                            Lembrar-me
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-[#ff7b00] hover:text-[#ff7b00]/80 transition-colors">
                            Esqueceu a senha?
                        </a>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-black bg-[#ff7b00] hover:bg-white focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Acessando...' : 'Entrar no Workspace'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Detail */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#ff7b00]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center flex-row items-center gap-3">
                    <img src="/logo.png" alt="FLY UP Logo" className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,123,0,0.3)]" />
                </div>
                <h2 className="mt-8 text-center text-3xl font-black text-foreground tracking-tight">
                    Acesso Exclusivo
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Novo por aqui?{' '}
                    <Link href="/register" className="font-bold text-[#ff7b00] hover:text-white transition-colors underline-offset-4 hover:underline">
                        Inicie sua operação B2B com 7 dias grátis
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Suspense fallback={<div className="h-[400px] bg-card rounded-2xl border border-border/50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#ff7b00] animate-spin" /></div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    )
}
