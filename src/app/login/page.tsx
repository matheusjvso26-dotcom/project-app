'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Loader2, Chrome } from 'lucide-react'
import { login } from '@/app/auth/actions'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

function LoginForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const initialMessage = searchParams.get('message')

    const [error, setError] = useState<string | null>(initialMessage || null)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    async function handleGoogleLogin() {
        setGoogleLoading(true)
        setError(null)
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        if (error) {
            setError(error.message)
            setGoogleLoading(false)
        }
    }

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
            router.push('/dashboard')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0a0a0a] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-[#333]/50 relative overflow-hidden"
        >
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#ff7b00]/10 blur-[80px] rounded-full pointer-events-none -z-10" />

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 text-center text-sm"
                >
                    {error}
                </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                        E-mail de Acesso
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            disabled={loading || googleLoading}
                            className="bg-[#111] focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-[#333] rounded-lg py-3 text-white outline-none transition-all disabled:opacity-50"
                            placeholder="voce@empresa.com.br"
                        />
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                        Senha Segura
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            disabled={loading || googleLoading}
                            className="bg-[#111] focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-[#333] rounded-lg py-3 text-white outline-none transition-all disabled:opacity-50"
                            placeholder="••••••••"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            disabled={loading || googleLoading}
                            className="h-4 w-4 text-[#ff7b00] bg-[#111] border-[#333] rounded cursor-pointer focus:ring-[#ff7b00]/50 focus:ring-offset-[#0a0a0a]"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400 cursor-pointer">
                            Lembrar-me
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-[#ff7b00] hover:text-[#ff7b00]/80 transition-colors">
                            Esqueceu a senha?
                        </a>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <button
                        type="submit"
                        disabled={loading || googleLoading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-[0_0_15px_rgba(255,123,0,0.15)] text-sm font-black uppercase tracking-wider text-black bg-[#ff7b00] hover:bg-orange-500 hover:shadow-[0_0_20px_rgba(255,123,0,0.3)] focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Acessando...' : 'Entrar no Workflow'}
                    </button>
                </motion.div>
            </form>

            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="mt-6"
            >
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#333]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#0a0a0a] text-zinc-500">Ou continue com</span>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading || googleLoading}
                        className="w-full flex justify-center py-3 px-4 border border-[#333] rounded-lg shadow-sm bg-[#111] hover:bg-[#1a1a1a] text-sm font-medium text-white transition-colors disabled:opacity-50 items-center gap-3"
                    >
                        {googleLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                        ) : (
                            <Chrome className="w-5 h-5 text-zinc-400" />
                        )}
                        <span>Acessar com Google</span>
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
            {/* Ambient Background Detail */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#ff7b00]/10 blur-[150px] rounded-full pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="flex justify-center flex-row items-center gap-3">
                    <img src="/logo.png" alt="FLY UP Logo" className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,123,0,0.3)]" />
                </div>
                <h2 className="mt-8 text-center text-3xl font-black text-white tracking-tight">
                    Acesso Exclusivo
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-400">
                    Novo por aqui?{' '}
                    <Link href="/register" className="font-bold text-[#ff7b00] hover:text-white transition-colors underline-offset-4 hover:underline">
                        Inicie sua operação B2B com 7 dias grátis
                    </Link>
                </p>
            </motion.div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex justify-center items-center">
                <Suspense fallback={
                    <div className="h-[400px] bg-[#0a0a0a] rounded-2xl border border-[#333]/50 flex items-center justify-center shadow-2xl">
                        <Loader2 className="w-8 h-8 text-[#ff7b00] animate-spin" />
                    </div>
                }>
                    {/* Ring Component Wrapping the Login Form */}
                    <div className="login-ring">
                        <i style={{ '--clr': '#ff7b00' } as React.CSSProperties}></i>
                        <i style={{ '--clr': '#ff0057' } as React.CSSProperties}></i>
                        <i style={{ '--clr': '#fffd44' } as React.CSSProperties}></i>

                        <div className="absolute z-10 w-full max-w-md px-4">
                            <LoginForm />
                        </div>
                    </div>
                </Suspense>
            </div>
        </div>
    )
}
