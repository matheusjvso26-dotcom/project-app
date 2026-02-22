import { TemplateBoard } from "./TemplateBoard"

export default function TemplatesPage() {
    return (
        <div className="flex flex-col h-full bg-[#151515]">
            <div className="flex-1 overflow-auto">
                <TemplateBoard />
            </div>
        </div>
    )
}
