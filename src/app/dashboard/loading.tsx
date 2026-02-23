export default function DashboardLoading() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-background/50 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center gap-4 text-primary">
                <img src="/logo.png" alt="Carregando..." className="h-32 w-auto animate-pulse object-contain" />
                <p className="text-sm text-muted-foreground font-medium animate-pulse mt-2">Carregando painel...</p>
            </div>
        </div>
    )
}
