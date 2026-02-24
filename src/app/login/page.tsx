import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock } from 'lucide-react'
import { login } from '@/app/auth/actions'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center flex-row items-center gap-3">
                    <img src="/logo.png" alt="FLY UP Logo" className="h-24 w-auto object-contain" />
                </div>
                <h2 className="mt-6 text-center text-2xl font-bold text-foreground">
                    Acesse sua conta
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Ou{' '}
                    <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                        crie um novo Workspace B2B de 14 dias grátis
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                {searchParams?.message && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 text-center text-sm">
                        {searchParams.message}
                    </div>
                )}
                <div className="bg-card py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-border/50">
                    <form className="space-y-6" action={login}>
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
                                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-border/50 rounded-lg py-3 bg-background text-foreground outline-none transition-all"
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
                                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-border/50 rounded-lg py-3 bg-background text-foreground outline-none transition-all"
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
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-card-foreground cursor-pointer">
                                    Lembrar-me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary hover:text-primary/80">
                                    Esqueceu a senha?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                                Entrar no Workspace
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
