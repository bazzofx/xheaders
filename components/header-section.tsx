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
      className={`p-4 rounded-xl border transition-all ${
        highlight
          ? "bg-purple-950/30 border-purple-500/30 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
          : "bg-slate-900/40 border-slate-800/80 text-slate-300"
      }`}
    >
      <div className="flex items-center mb-2">
        <h3 className="font-semibold text-slate-100 text-sm">{title}</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors p-0.5 rounded">
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm bg-slate-900 border border-slate-800 text-slate-200">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-xs font-mono break-all whitespace-pre-wrap bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/60 text-slate-300 mt-2">
        {content || "Not available"}
      </div>
    </div>
  )
}
