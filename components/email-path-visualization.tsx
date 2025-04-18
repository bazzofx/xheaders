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
      // Display a message if no path data is available
      const container = containerRef.current
      container.innerHTML = ""

      const errorMessage = document.createElement("div")
      errorMessage.className = "flex items-center justify-center h-[150px] text-purple-600"
      errorMessage.textContent = "No email path data available"

      container.appendChild(errorMessage)
      return
    }

    // In a real implementation, we would use a library like D3.js or mermaid
    // to create a proper visualization. For this demo, we'll create a simple
    // representation with HTML and CSS.

    const container = containerRef.current
    container.innerHTML = ""

    const wrapper = document.createElement("div")
    wrapper.className = "flex flex-col items-center w-full overflow-x-auto py-4"

    const flowchart = document.createElement("div")
    flowchart.className = "flex items-center -mx-3 min-w-max" // Using negative margin to reduce space further

    // Add sender
    const sender = document.createElement("div")
    sender.className = "flex flex-col items-center mx-1" // Added mx-1 for minimal spacing

    const senderIcon = document.createElement("div")
    senderIcon.className = "w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2"
    senderIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-purple-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`

    const senderLabel = document.createElement("div")
    senderLabel.className = "text-xs text-center font-medium"
    senderLabel.textContent = "Sender"

    sender.appendChild(senderIcon)
    sender.appendChild(senderLabel)
    flowchart.appendChild(sender)

    // Add servers in the path
    path.servers.forEach((server, index) => {
      // Add arrow
      const arrow = document.createElement("div")
      arrow.className = "flex-shrink-0 text-yellow-500 mx-0" // Reduced margin
      arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`
      flowchart.appendChild(arrow)

      // Add server
      const serverEl = document.createElement("div")
      serverEl.className = "flex flex-col items-center max-w-[120px] relative mx-1" // Reduced max-width and added mx-1

      const serverIcon = document.createElement("div")
      serverIcon.className = "w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2 cursor-pointer" // Reduced size
      serverIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-yellow-600"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>`

      // Create tooltip for server name and from location
      const tooltip = document.createElement("div")
      tooltip.className =
        "absolute bg-white text-gray-700 text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 pointer-events-none z-10 shadow-md border border-gray-200 left-1/2 transform -translate-x-1/2 top-0 whitespace-nowrap"

      // Create tooltip content with from location
      const fromLocation = server || "Unknown"
      const ipInfo = path.ips[index] ? `(${path.ips[index]})` : ""
      tooltip.innerHTML = `
        <div class="font-semibold">From: ${fromLocation}</div>
        <div class="text-xs text-gray-500">${ipInfo}</div>
      `

      // Show tooltip on hover
      serverIcon.addEventListener("mouseenter", () => {
        tooltip.classList.remove("opacity-0")
        tooltip.classList.add("opacity-100")

        // Dynamically adjust width based on content
        const tooltipWidth = tooltip.scrollWidth + 10 // Add a small buffer
        tooltip.style.width = `${tooltipWidth}px`
      })

      serverIcon.addEventListener("mouseleave", () => {
        tooltip.classList.remove("opacity-100")
        tooltip.classList.add("opacity-0")
      })

      // Add IP and timestamp below
      const serverIp = document.createElement("div")
      serverIp.className = "text-[8px] text-center text-gray-500 break-words" // Reduced font size
      serverIp.textContent = path.ips[index] || ""

      const timestamp = document.createElement("div")
      timestamp.className = "text-[8px] text-center text-gray-500" // Reduced font size
      timestamp.textContent = path.timestamps[index] || ""

      serverEl.appendChild(serverIcon)
      serverEl.appendChild(tooltip)
      serverEl.appendChild(serverIp)
      serverEl.appendChild(timestamp)
      flowchart.appendChild(serverEl)
    })

    // Add arrow to recipient
    const finalArrow = document.createElement("div")
    finalArrow.className = "flex-shrink-0 text-purple-500 mx-0" // Reduced margin
    finalArrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`
    flowchart.appendChild(finalArrow)

    // Add recipient
    const recipient = document.createElement("div")
    recipient.className = "flex flex-col items-center mx-1" // Added mx-1 for minimal spacing

    const recipientIcon = document.createElement("div")
    recipientIcon.className = "w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2"
    recipientIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-purple-600"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`

    const recipientLabel = document.createElement("div")
    recipientLabel.className = "text-xs text-center font-medium"
    recipientLabel.textContent = "Recipient"

    recipient.appendChild(recipientIcon)
    recipient.appendChild(recipientLabel)
    flowchart.appendChild(recipient)

    wrapper.appendChild(flowchart)
    container.appendChild(wrapper)
  }, [path])

  return (
    <div className="border border-yellow-200 rounded-lg bg-white p-4 overflow-hidden">
      <div ref={containerRef} className="min-h-[150px] flex items-center justify-center">
        <div className="text-purple-600">Loading visualization...</div>
      </div>
    </div>
  )
}

