import { ChatbotBoard } from "./ChatbotBoard"

export default function ChatbotsPage() {
    return (
        <div className="flex flex-col h-full bg-[#151515]">
            <div className="flex-1 overflow-auto">
                <ChatbotBoard />
            </div>
        </div>
    )
}
