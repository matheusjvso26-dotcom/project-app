import { InboxBoard } from "./InboxBoard"
import { getConversations } from "./actions"

import fs from 'fs'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InboxPage() {
    let initialConversations: any[] = []
    try {
        initialConversations = await getConversations()
    } catch (e: any) {
        fs.writeFileSync('inbox_crash.log', String(e.stack || e.message))
    }

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="flex-1 overflow-hidden">
                <InboxBoard initialConversations={initialConversations} />
            </div>
        </div>
    )
}
