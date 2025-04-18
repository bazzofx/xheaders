import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface HeaderSectionProps {
  title: string
  content: string
  tooltip: string
  highlight?: boolean
}

export default function HeaderSection({ title, content, tooltip, highlight = false }: HeaderSectionProps) {
  return (
    <div
      className={`p-4 rounded-lg ${highlight ? "bg-yellow-100 border border-yellow-300" : "bg-white border border-gray-200"}`}
    >
      <div className="flex items-center mb-2">
        <h3 className="font-medium acme-regular">{title}</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-2 text-purple-600">
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-sm break-words whitespace-pre-wrap">{content || "Not available"}</div>
    </div>
  )
}

