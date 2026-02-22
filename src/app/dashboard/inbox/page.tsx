import { InboxBoard } from "./InboxBoard"

export default function InboxPage() {
    return (
        <div className="flex flex-col h-full bg-[#151515]">
            <div className="flex-1 overflow-hidden">
                <InboxBoard />
            </div>
        </div>
    )
}
