'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { globalSearchAction, SearchResult } from "@/app/dashboard/search-actions"

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    React.useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length === 0) {
                setResults([])
                return
            }
            setIsLoading(true)
            const res = await globalSearchAction(query)
            setResults(res)
            setIsLoading(false)
        }

        const debounceId = setTimeout(() => {
            fetchResults()
        }, 300)

        return () => clearTimeout(debounceId)
    }, [query])

    const onSelect = (url: string) => {
        setOpen(false)
        router.push(url)
    }

    // Grupos por tipo
    const groups = {
        LEAD: results.filter(r => r.type === 'LEAD'),
        CONTACT: results.filter(r => r.type === 'CONTACT'),
        COMPANY: results.filter(r => r.type === 'COMPANY'),
        DEAL: results.filter(r => r.type === 'DEAL'),
    }

    return (
        <>
            <Button
                variant="outline"
                className="w-full justify-start text-sm text-muted-foreground bg-transparent border-primary/40 rounded-full hover:border-primary hover:bg-transparent shadow-none px-4 md:w-64 lg:w-80 h-10 transition-colors"
                onClick={() => setOpen(true)}
            >
                <Search className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="font-normal text-muted-foreground">Search here</span>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Digite para buscar..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {isLoading && (
                        <div className="py-6 flex items-center justify-center text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Buscando dados no servidor...
                        </div>
                    )}
                    {!isLoading && query.length > 0 && results.length === 0 && (
                        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                    )}

                    {!isLoading && results.length > 0 && (
                        <>
                            {groups.DEAL.length > 0 && (
                                <CommandGroup heading="Negócios (Deals)">
                                    {groups.DEAL.map(item => (
                                        <CommandItem key={item.id} onSelect={() => onSelect(item.url)}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.title}</span>
                                                <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                            {groups.COMPANY.length > 0 && (
                                <CommandGroup heading="Empresas">
                                    {groups.COMPANY.map(item => (
                                        <CommandItem key={item.id} onSelect={() => onSelect(item.url)}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.title}</span>
                                                <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                            {groups.LEAD.length > 0 && (
                                <CommandGroup heading="Leads Indefinidos">
                                    {groups.LEAD.map(item => (
                                        <CommandItem key={item.id} onSelect={() => onSelect(item.url)}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.title}</span>
                                                <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                            {groups.CONTACT.length > 0 && (
                                <CommandGroup heading="Contatos Físicos">
                                    {groups.CONTACT.map(item => (
                                        <CommandItem key={item.id} onSelect={() => onSelect(item.url)}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.title}</span>
                                                <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}
