import { Activity } from 'lucide-react'

export default function DashboardLoading() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-background/50 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center gap-4 text-primary">
                <Activity className="w-10 h-10 animate-pulse" />
                <p className="text-sm text-muted-foreground animate-pulse font-medium">Carregando painel...</p>
            </div>
        </div>
    )
}
