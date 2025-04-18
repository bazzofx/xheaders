interface HeaderTableProps {
  headers: {
    name: string
    value: string
  }[]
  highlight?: string[]
}

export default function HeaderTable({ headers, highlight = [] }: HeaderTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-yellow-50">
            <th className="border border-yellow-200 px-4 py-2 text-left font-semibold w-1/4">Header Name</th>
            <th className="border border-yellow-200 px-4 py-2 text-left font-semibold">Header Value</th>
          </tr>
        </thead>
        <tbody>
          {headers.map((header, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? "bg-white" : "bg-purple-50"} ${
                highlight.includes(header.name.toLowerCase()) ? "bg-yellow-100" : ""
              }`}
            >
              <td className="border border-yellow-200 px-4 py-2 align-top font-medium">{header.name}</td>
              <td className="border border-yellow-200 px-4 py-2 break-words whitespace-pre-wrap">{header.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

