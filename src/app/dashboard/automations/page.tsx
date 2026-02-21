import { AutomationBoard } from "./AutomationBoard"

export default function AutomationsPage() {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="flex-1 overflow-auto">
                <AutomationBoard />
            </div>
        </div>
    )
}
