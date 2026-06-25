import { Check, X } from "lucide-react"

interface RelayTableProps {
  hops: {
    hop: number
    delay: string
    from: string
    fromIp: string
    by: string
    with: string
    time: string
    blacklisted: boolean
  }[]
}

export default function RelayTable({ hops }: RelayTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/20">
      <table className="premium-table mb-0">
        <thead>
          <tr>
            <th className="font-semibold text-slate-400">Hop</th>
            <th className="font-semibold text-slate-400">Delay</th>
            <th className="font-semibold text-slate-400">From</th>
            <th className="font-semibold text-slate-400">By</th>
            <th className="font-semibold text-slate-400">With</th>
            <th className="font-semibold text-slate-400">Time (UTC)</th>
            <th className="font-semibold text-slate-400 text-center">Blacklist</th>
          </tr>
        </thead>
        <tbody>
          {hops.map((hop, index) => (
            <tr key={index} className="hover:bg-slate-800/30 transition-colors">
              <td className="font-mono text-xs text-slate-400">{hop.hop}</td>
              <td className="text-slate-200 font-semibold text-sm">{hop.delay}</td>
              <td className="break-all font-mono text-xs text-slate-300">{hop.from}</td>
              <td className="break-all font-mono text-xs text-slate-300">{hop.by}</td>
              <td className="break-all font-mono text-xs text-slate-300">{hop.with}</td>
              <td className="text-slate-300 text-xs">{hop.time}</td>
              <td className="text-center">
                {hop.blacklisted ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-950/50 border border-red-500/30">
                    <X className="h-3.5 w-3.5 text-red-400" />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-950/50 border border-emerald-500/30">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
