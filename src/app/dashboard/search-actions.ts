'use server'

import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/auth-utils'

export type SearchResult = {
    id: string
    type: 'LEAD' | 'CONTACT' | 'COMPANY' | 'DEAL'
    title: string
    subtitle?: string
    url: string
}

export async function globalSearchAction(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) return []

    const user = await requireUser()
    const orgId = user.organizationId
    const searchTerms = query.trim()

    // We can search across Lead, Contact, Company, Deal by name/title
    const [leads, contacts, companies, deals] = await Promise.all([
        prisma.lead.findMany({
            where: {
                organizationId: orgId,
                name: { contains: searchTerms, mode: 'insensitive' }
            },
            take: 5
        }),
        prisma.contact.findMany({
            where: {
                organizationId: orgId,
                name: { contains: searchTerms, mode: 'insensitive' }
            },
            take: 5
        }),
        prisma.company.findMany({
            where: {
                organizationId: orgId,
                name: { contains: searchTerms, mode: 'insensitive' }
            },
            take: 5
        }),
        prisma.deal.findMany({
            where: {
                organizationId: orgId,
                title: { contains: searchTerms, mode: 'insensitive' }
            },
            take: 5
        }),
    ])

    const results: SearchResult[] = []

    leads.forEach(l => {
        results.push({
            id: l.id,
            type: 'LEAD',
            title: l.name || l.phone,
            subtitle: l.email || l.phone,
            url: `/dashboard/contacts` // Map to closest matching view
        })
    })

    contacts.forEach(c => {
        results.push({
            id: c.id,
            type: 'CONTACT',
            title: c.name,
            subtitle: c.companyId ? 'Associated to a Company' : c.email || c.phone || '',
            url: `/dashboard/contacts`
        })
    })

    companies.forEach(c => {
        results.push({
            id: c.id,
            type: 'COMPANY',
            title: c.name,
            subtitle: c.domain || 'Company',
            url: `/dashboard/contacts`
        })
    })

    deals.forEach(d => {
        results.push({
            id: d.id,
            type: 'DEAL',
            title: d.title,
            subtitle: `$${(d.value / 100).toFixed(2)} - ${d.status}`,
            url: `/dashboard/kanban?dealId=${d.id}`
        })
    })

    return results
}
