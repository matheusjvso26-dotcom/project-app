import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, Mail, Lock, User as UserIcon, Zap } from 'lucide-react'
import { register } from '@/app/auth/actions'

export default async function RegisterPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center flex-row items-center gap-2">
                    <Zap className="w-8 h-8 text-indigo-600" />
                    <h2 className="text-center text-3xl font-extrabold text-slate-900">
                        Flow
                    </h2>
                </div>
                <h2 className="mt-6 text-center text-2xl font-bold text-slate-800">
                    Crie seu Workspace B2B
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Ou{' '}
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        faça login em uma conta existente
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                    <form className="space-y-6" action={register}>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                    Seu Nome Completo
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 border bg-slate-50 outline-none transition-all"
                                        placeholder="João Silva"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-slate-700">
                                    Nome da Empresa
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        required
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 border bg-slate-50 outline-none transition-all"
                                        placeholder="Acme Inc."
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                E-mail Corporativo
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 border bg-slate-50 outline-none transition-all"
                                    placeholder="joao@acme.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Senha Segura
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 border bg-slate-50 outline-none transition-all"
                                    placeholder="Mínimo de 8 caracteres"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md hover:shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                            >
                                Começar Teste de 14 Dias Grátis
                            </button>
                        </div>

                        <p className="text-xs text-center text-slate-500 mt-4">
                            Ao se cadastrar, você concorda com nossos <br /> Termos de Serviço e Política de Privacidade.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
