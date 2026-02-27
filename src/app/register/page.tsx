'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Building2, Mail, Lock, User as UserIcon, Loader2, CheckCircle2, Chrome, Check } from 'lucide-react'
import { register } from '@/app/auth/actions'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

function PasswordMeter({ password }: { password: string }) {
    const rules = [
        { label: 'Pelo menos 8 caracteres', test: (p: string) => p.length >= 8 },
        { label: 'Uma letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
        { label: 'Pelo menos um número', test: (p: string) => /[0-9]/.test(p) },
        { label: 'Um caractere especial', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
    ]

    return (
        <div className="mt-4 space-y-2 bg-[#111] border border-[#333] p-4 rounded-lg">
            <p className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Requisitos da Senha Mestra</p>
            {rules.map((rule, idx) => {
                const passed = rule.test(password)
                return (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${passed ? 'bg-[#ff7b00] text-black' : 'bg-[#222] text-transparent'}`}>
                            <Check className="w-3 h-3" />
                        </div>
                        <span className={`transition-colors ${passed ? 'text-zinc-200 font-medium' : 'text-zinc-500'}`}>
                            {rule.label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

function RegisterForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const initialMessage = searchParams.get('message')

    const [error, setError] = useState<string | null>(initialMessage || null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    // Controlled inputs for password check
    const [password, setPassword] = useState('')

    const isValidPassword = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)

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
        setSuccess(null)

        if (!isValidPassword) {
            setError('A senha não atende aos requisitos mínimos de segurança.')
            return
        }

        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await register(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else if (result?.success) {
            setSuccess(result.success)
            setLoading(false)
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        }
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0a0a0a] py-12 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-green-500/30 text-center flex flex-col items-center"
            >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Conta Criada!</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                    {success} <br /><br />
                    Redirecionando de forma segura para o login...
                </p>
                <Loader2 className="w-5 h-5 text-green-500 animate-spin mt-6" />
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-[#0a0a0a] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-[#333]/50 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#ff7b00]/10 blur-[80px] rounded-full pointer-events-none -z-10" />

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 text-center text-sm"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
                            Seu Nome Completo
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-zinc-500" />
                            </div>
                            <input
                                id="name" name="name" type="text" required disabled={loading || googleLoading}
                                className="bg-[#111] focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-[#333] rounded-lg py-3 text-white outline-none transition-all disabled:opacity-50"
                                placeholder="João Silva"
                            />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                        <label htmlFor="company" className="block text-sm font-medium text-zinc-300">
                            Nome da Empresa
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building2 className="h-5 w-5 text-zinc-500" />
                            </div>
                            <input
                                id="company" name="company" type="text" required disabled={loading || googleLoading}
                                className="bg-[#111] focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-[#333] rounded-lg py-3 text-white outline-none transition-all disabled:opacity-50"
                                placeholder="Sua Software House"
                            />
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                            E-mail Gestor
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-zinc-500" />
                            </div>
                            <input
                                id="email" name="email" type="email" required disabled={loading || googleLoading}
                                className="bg-[#111] focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-[#333] rounded-lg py-3 text-white outline-none transition-all disabled:opacity-50"
                                placeholder="admin@empresa.com.br"
                            />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                        <label htmlFor="phone" className="block text-sm font-medium text-zinc-300">
                            WhatsApp Oficial
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-zinc-500 text-sm font-bold ml-1 border-r border-[#333] pr-2 py-1 flex items-center">BR</span>
                            </div>
                            <input
                                id="phone" name="phone" type="tel" required disabled={loading || googleLoading}
                                className="bg-[#111] focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-[52px] sm:text-sm border-[#333] rounded-lg py-3 text-white outline-none transition-all disabled:opacity-50"
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                        Senha Mestra
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                            id="password" name="password" type="password" required disabled={loading || googleLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-[#111] focus:ring-[#ff7b00] focus:border-[#ff7b00] block w-full pl-10 sm:text-sm border-[#333] rounded-lg py-3 text-white outline-none transition-all disabled:opacity-50"
                            placeholder="Mín. 8 caracteres..."
                        />
                    </div>
                </motion.div>

                {password.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <PasswordMeter password={password} />
                    </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || googleLoading || !isValidPassword}
                        className="w-full flex justify-center py-4 px-4 rounded-xl shadow-[0_0_15px_rgba(255,123,0,0.15)] text-sm font-black text-black bg-[#ff7b00] hover:bg-orange-500 hover:shadow-[0_0_20px_rgba(255,123,0,0.3)] focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2 uppercase tracking-wide cursor-pointer"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Preparando Workspace...' : 'Iniciar Avaliação Gratuita'}
                    </button>
                </motion.div>
            </form>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6">
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

            <p className="text-xs text-center text-zinc-600 mt-8 font-medium">
                Reservado para Operações B2B Corporativas.<br /> Sujeito à análise antifraude.
            </p>
        </motion.div>
    )
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff7b00]/10 blur-[150px] rounded-full pointer-events-none -z-10" />

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center flex-row items-center gap-3">
                    <img src="/logo.png" alt="FLY UP Logo" className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,123,0,0.3)]" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-black text-white tracking-tight">
                    Infraestrutura B2B
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-400 font-medium mb-8">
                    Já possui acesso VIP?{' '}
                    <Link href="/login" className="font-bold text-[#ff7b00] hover:text-white transition-colors underline-offset-4 hover:underline">
                        Acesse seu Painel
                    </Link>
                </p>
            </motion.div>

            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
                <Suspense fallback={
                    <div className="h-[500px] bg-[#0a0a0a] rounded-2xl border border-[#333]/50 flex items-center justify-center shadow-2xl">
                        <Loader2 className="w-8 h-8 text-[#ff7b00] animate-spin" />
                    </div>
                }>
                    <RegisterForm />
                </Suspense>
            </div>
        </div>
    )
}
