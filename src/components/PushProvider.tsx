'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Bell, BellOff } from 'lucide-react'
import { Button } from './ui/button'

const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BEl62iR9vYZc50o5W_Jp9E0x2oG9s5rC_5W1tG5r2-P4gAQAQ_Q'

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function PushProvider() {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isSupported, setIsSupported] = useState(false)

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            navigator.serviceWorker.register('/sw.js').then(reg => {
                reg.pushManager.getSubscription().then(sub => {
                    setIsSubscribed(sub !== null)
                })
            })
        }
    }, [])

    const subscribeUser = async () => {
        if (!('serviceWorker' in navigator)) return;
        try {
            const permission = await Notification.requestPermission()
            if (permission !== 'granted') {
                toast.error("Permissão de notificação negada no navegador.")
                return
            }

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
            });

            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });

            setIsSubscribed(true);
            toast.success("Notificações Push ativadas com sucesso!");
        } catch (e: any) {
            console.error(e)
            toast.error("Ocorreu um erro ao ativar. Seu navegador pode não suportar ou as chaves VAPID não foram validadas.");
        }
    }

    if (!isSupported) return null;

    if (isSubscribed) return (
        <Button variant="ghost" size="sm" className="w-full justify-start text-emerald-500 gap-2 text-xs h-8 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors">
            <Bell className="w-3.5 h-3.5" /> Alertas Ativos
        </Button>
    )

    return (
        <Button variant="ghost" size="sm" className="w-full justify-start text-[#ff7b00] hover:text-[#ff7b00] hover:bg-[#ff7b00]/10 gap-2 text-xs h-8" onClick={subscribeUser}>
            <BellOff className="w-3.5 h-3.5" /> Ativar Alertas Base
        </Button>
    )
}
