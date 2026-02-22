'use client'

import React, { useState, useRef } from 'react'
import { Loader2, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner' // Or any custom alert you prefer, we will trigger the server action after
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
    currentAvatarUrl: string | null
    userName: string
    onUploadSuccess: (newUrl: string) => void
}

export function AvatarUpload({ currentAvatarUrl, userName, onUploadSuccess }: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0]
            if (!file) return

            // Basic validation
            if (!file.type.includes('image')) {
                alert('Por favor, selecione apenas arquivos de imagem.')
                return
            }

            if (file.size > 2 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 2MB.')
                return
            }

            setIsUploading(true)

            // Create a unique file name
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            // Upload to Supabase Storage
            const { error: uploadError, data } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                throw uploadError
            }

            // Get the Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // Trigger the success callback (which will call Server Action)
            onUploadSuccess(publicUrl)

        } catch (error: any) {
            console.error('Erro no upload:', error)
            alert(`Falha no upload do Supabase: ${error?.message || 'Erro desconhecido.'}\nVerifique se o bucket "avatars" é Público e se as permissões (RLS) permitem inserção.`)
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
                <div className="relative group shrink-0">
                    {currentAvatarUrl ? (
                        <img
                            src={currentAvatarUrl}
                            alt="Avatar"
                            className="w-20 h-20 rounded-full object-cover border border-white/10 shadow-lg"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-[#252525] border border-white/10 shadow-lg flex items-center justify-center text-white text-3xl font-bold uppercase">
                            {userName.charAt(0)}
                        </div>
                    )}

                    {/* Overlay with Spinner or Camera Icon */}
                    {isUploading ? (
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Loader2 className="w-6 h-6 text-[#ff7b00] animate-spin" />
                        </div>
                    ) : (
                        <div
                            className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    )}
                </div>

                <div>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                    <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 border border-white/10 bg-[#151515] text-white font-semibold text-sm rounded-lg hover:bg-white/5 transition-colors mb-2 block disabled:opacity-50 shadow-sm"
                    >
                        {isUploading ? 'Enviando foto...' : 'Fazer Upload de Foto'}
                    </button>
                    <p className="text-xs text-zinc-500 font-medium">Recomendado: 500x500px. Máximo 2MB (GPG, GIF, PNG)</p>
                </div>
            </div>

            {/* Quick Select Avatars */}
            <div className="pt-2">
                <p className="text-sm font-semibold text-zinc-300 mb-3">Ou escolha um avatar pronto:</p>
                <div className="flex flex-wrap gap-3">
                    {[
                        'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e2e8f0',
                        'https://api.dicebear.com/7.x/notionists/svg?seed=Jocelyn&backgroundColor=e2e8f0',
                        'https://api.dicebear.com/7.x/notionists/svg?seed=Aidan&backgroundColor=e2e8f0',
                        'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=e2e8f0',
                        'https://api.dicebear.com/7.x/notionists/svg?seed=Robert&backgroundColor=e2e8f0',
                        'https://api.dicebear.com/7.x/notionists/svg?seed=Maria&backgroundColor=e2e8f0',
                    ].map((presetUrl, i) => (
                        <button
                            key={i}
                            type="button"
                            disabled={isUploading}
                            onClick={() => onUploadSuccess(presetUrl)}
                            className={cn(
                                "w-12 h-12 rounded-full border-2 overflow-hidden transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ff7b00] disabled:opacity-50",
                                currentAvatarUrl === presetUrl ? "border-[#ff7b00] scale-110 shadow-[0_0_15px_rgba(255,123,0,0.3)]" : "border-transparent hover:border-white/20"
                            )}
                        >
                            <img src={presetUrl} alt="Preset Avatar" className="w-full h-full object-cover bg-white" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
