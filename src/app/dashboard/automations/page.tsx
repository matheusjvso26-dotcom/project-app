import { AutomationBoard } from "./AutomationBoard"

export default function AutomationsPage() {
    return (
        <div className="flex flex-col h-full bg-background">
            <div className="flex-1 overflow-auto">
                <AutomationBoard />
            </div>
        </div>
    )
}
