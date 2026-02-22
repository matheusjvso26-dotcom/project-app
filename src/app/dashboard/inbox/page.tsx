import { InboxBoard } from "./InboxBoard"
import { getConversations } from "./actions"

export default async function InboxPage() {
    const initialConversations = await getConversations()

    return (
        <div className="flex flex-col h-full bg-[#151515]">
            <div className="flex-1 overflow-hidden">
                <InboxBoard initialConversations={initialConversations} />
            </div>
        </div>
    )
}
