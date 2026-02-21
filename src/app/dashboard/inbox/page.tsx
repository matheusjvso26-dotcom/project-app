import { InboxBoard } from "./InboxBoard"

export default function InboxPage() {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="flex-1 overflow-hidden">
                <InboxBoard />
            </div>
        </div>
    )
}
