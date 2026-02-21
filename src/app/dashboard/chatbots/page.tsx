import { ChatbotBoard } from "./ChatbotBoard"

export default function ChatbotsPage() {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="flex-1 overflow-auto">
                <ChatbotBoard />
            </div>
        </div>
    )
}
