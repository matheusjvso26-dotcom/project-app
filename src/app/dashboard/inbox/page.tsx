import { InboxBoard } from "./InboxBoard"
import { getConversations } from "./actions"

import fs from 'fs'

export default async function InboxPage() {
    let initialConversations: any[] = []
    try {
        initialConversations = await getConversations()
    } catch (e: any) {
        fs.writeFileSync('inbox_crash.log', String(e.stack || e.message))
    }

    return (
        <div className="flex flex-col h-full bg-[#151515]">
            <div className="flex-1 overflow-hidden">
                <InboxBoard initialConversations={initialConversations} />
            </div>
        </div>
    )
}
