interface HeaderTableProps {
  headers: {
    name: string
    value: string
  }[]
  highlight?: string[]
}

export default function HeaderTable({ headers, highlight = [] }: HeaderTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/20">
      <table className="premium-table mb-0">
        <thead>
          <tr>
            <th className="font-semibold text-slate-400 w-1/4">Header Name</th>
            <th className="font-semibold text-slate-400">Header Value</th>
          </tr>
        </thead>
        <tbody>
          {headers.map((header, index) => {
            const isHighlighted = highlight.includes(header.name.toLowerCase())
            return (
              <tr
                key={index}
                className={`hover:bg-slate-800/30 transition-colors ${
                  isHighlighted ? "bg-purple-950/20 border-y border-purple-500/20" : ""
                }`}
              >
                <td className={`align-top font-semibold text-xs font-mono py-3 ${
                  isHighlighted ? "text-purple-300" : "text-slate-300"
                }`}>
                  {header.name}
                </td>
                <td className="break-all whitespace-pre-wrap font-mono text-xs text-slate-300 py-3">
                  {header.value}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
