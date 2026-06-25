"use client"

import { useEffect, useRef } from "react"

interface EmailPathVisualizationProps {
  path: {
    servers: string[]
    ips: string[]
    timestamps: string[]
  }
}

export default function EmailPathVisualization({ path }: EmailPathVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    // Check if path data is valid
    if (!path || !path.servers || !Array.isArray(path.servers) || path.servers.length === 0) {
      const container = containerRef.current
      container.innerHTML = ""

      const errorMessage = document.createElement("div")
      errorMessage.className = "flex items-center justify-center h-[150px] text-cyan-400 font-medium"
      errorMessage.textContent = "No email path data available"

      container.appendChild(errorMessage)
      return
    }

    const container = containerRef.current
    container.innerHTML = ""

    const wrapper = document.createElement("div")
    wrapper.className = "flex flex-col items-center w-full overflow-x-auto py-6"

    const flowchart = document.createElement("div")
    flowchart.className = "flex items-center -mx-2 min-w-max"

    // Add sender
    const sender = document.createElement("div")
    sender.className = "flex flex-col items-center mx-1"

    const senderIcon = document.createElement("div")
    senderIcon.className = "w-12 h-12 rounded-full bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
    senderIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`

    const senderLabel = document.createElement("div")
    senderLabel.className = "text-[11px] text-slate-400 text-center font-semibold uppercase tracking-wider"
    senderLabel.textContent = "Sender"

    sender.appendChild(senderIcon)
    sender.appendChild(senderLabel)
    flowchart.appendChild(sender)

    // Add servers in the path
    path.servers.forEach((server, index) => {
      // Add arrow
      const arrow = document.createElement("div")
      arrow.className = "flex-shrink-0 text-cyan-500/50 mx-1"
      arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`
      flowchart.appendChild(arrow)

      // Add server
      const serverEl = document.createElement("div")
      serverEl.className = "flex flex-col items-center max-w-[120px] relative mx-1"

      const serverIcon = document.createElement("div")
      serverIcon.className = "w-10 h-10 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mb-2 cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.1)] transition-transform hover:scale-105"
      serverIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-400"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>`

      // Create tooltip for server name and from location
      const tooltip = document.createElement("div")
      tooltip.className =
        "absolute bg-slate-900 text-slate-100 text-xs rounded-xl py-2.5 px-3.5 opacity-0 transition-opacity duration-200 pointer-events-none z-30 shadow-xl border border-slate-800/80 left-1/2 transform -translate-x-1/2 top-0 whitespace-nowrap"

      const fromLocation = server || "Unknown"
      const ipInfo = path.ips[index] ? `(${path.ips[index]})` : ""
      tooltip.innerHTML = `
        <div class="font-semibold text-slate-100">From: ${fromLocation}</div>
        <div class="text-[10px] text-cyan-400 font-semibold mt-1 font-mono">${ipInfo}</div>
      `

      // Show tooltip on hover
      serverIcon.addEventListener("mouseenter", () => {
        tooltip.classList.remove("opacity-0")
        tooltip.classList.add("opacity-100")

        const tooltipWidth = tooltip.scrollWidth + 12
        tooltip.style.width = `${tooltipWidth}px`
      })

      serverIcon.addEventListener("mouseleave", () => {
        tooltip.classList.remove("opacity-100")
        tooltip.classList.add("opacity-0")
      })

      // Add IP and timestamp below
      const serverIp = document.createElement("div")
      serverIp.className = "text-[9px] font-mono text-center text-slate-400 break-all font-semibold"
      serverIp.textContent = path.ips[index] || ""

      const timestamp = document.createElement("div")
      timestamp.className = "text-[8px] text-center text-slate-500 mt-0.5"
      timestamp.textContent = path.timestamps[index] || ""

      serverEl.appendChild(serverIcon)
      serverEl.appendChild(tooltip)
      serverEl.appendChild(serverIp)
      serverEl.appendChild(timestamp)
      flowchart.appendChild(serverEl)
    })

    // Add arrow to recipient
    const finalArrow = document.createElement("div")
    finalArrow.className = "flex-shrink-0 text-purple-500/50 mx-1"
    finalArrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`
    flowchart.appendChild(finalArrow)

    // Add recipient
    const recipient = document.createElement("div")
    recipient.className = "flex flex-col items-center mx-1"

    const recipientIcon = document.createElement("div")
    recipientIcon.className = "w-12 h-12 rounded-full bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
    recipientIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-400"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`

    const recipientLabel = document.createElement("div")
    recipientLabel.className = "text-[11px] text-slate-400 text-center font-semibold uppercase tracking-wider"
    recipientLabel.textContent = "Recipient"

    recipient.appendChild(recipientIcon)
    recipient.appendChild(recipientLabel)
    flowchart.appendChild(recipient)

    wrapper.appendChild(flowchart)
    container.appendChild(wrapper)
  }, [path])

  return (
    <div className="border border-slate-800/80 rounded-xl bg-slate-950/40 p-4 overflow-hidden">
      <div ref={containerRef} className="min-h-[150px] flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse font-medium">Loading visualization...</div>
      </div>
    </div>
  )
}
