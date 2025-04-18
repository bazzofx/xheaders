import { Check } from "lucide-react"
import { X } from "lucide-react"

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
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-yellow-50">
            <th className="border border-yellow-200 px-4 py-2 text-left font-semibold">Hop</th>
            <th className="border border-yellow-200 px-4 py-2 text-left font-semibold">Delay</th>
            <th className="border border-yellow-200 px-4 py-2 text-left font-semibold">From</th>
            <th className="border border-yellow-200 px-4 py-2 text-left font-semibold">By</th>
            <th className="border border-yellow-200 px-4 py-2 text-left font-semibold">With</th>
            <th className="border border-yellow-200 px-4 py-2 text-left font-semibold">Time (UTC)</th>
            <th className="border border-yellow-200 px-4 py-2 text-left font-semibold">Blacklist</th>
          </tr>
        </thead>
        <tbody>
          {hops.map((hop, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-purple-50"}>
              <td className="border border-yellow-200 px-4 py-2">{hop.hop}</td>
              <td className="border border-yellow-200 px-4 py-2">{hop.delay}</td>
              <td className="border border-yellow-200 px-4 py-2 break-words">{hop.from}</td>
              <td className="border border-yellow-200 px-4 py-2 break-words">{hop.by}</td>
              <td className="border border-yellow-200 px-4 py-2 break-words">{hop.with}</td>
              <td className="border border-yellow-200 px-4 py-2">{hop.time}</td>
              <td className="border border-yellow-200 px-4 py-2 text-center">
                {hop.blacklisted ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                    <X className="h-4 w-4 text-red-600" />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                    <Check className="h-4 w-4 text-green-600" />
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

