import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, AlertTriangle, Check, Network } from "lucide-react"

interface MSAntispamInfoProps {
  antispamHeaders: Record<string, string>
}

export default function MSAntispamInfo({ antispamHeaders }: MSAntispamInfoProps) {
  // Helper function to get a description for a specific header
  const getHeaderDescription = (header: string, value: string) => {
    // CAT descriptions
    if (header === "CAT") {
      const catValues: Record<string, string> = {
        AMP: "Anti-malware",
        BIMP: "Brand impersonation",
        BULK: "Bulk email",
        DIMP: "Domain impersonation",
        FTBP: "Anti-malware common attachments filter",
        GIMP: "Mailbox intelligence impersonation",
        HPHSH: "High confidence phishing",
        HPHISH: "High confidence phishing",
        HSPM: "High confidence spam",
        INTOS: "Intra-Organization phishing",
        MALW: "Malware",
        NONE: "No specific category detected",
        OSPM: "Outbound spam",
        PHSH: "Phishing",
        SAP: "Safe Attachments",
        SPM: "Spam",
        SPOOF: "Spoofing",
        UIMP: "User impersonation",
      }
      return catValues[value] || "Unknown category"
    }

    // DIR descriptions
    if (header === "DIR") {
      const dirValues: Record<string, string> = {
        INB: "Inbound message",
        OUT: "Outbound message",
        INT: "Internal message",
      }
      return dirValues[value] || "Unknown direction"
    }

    // SCL descriptions
    if (header === "SCL") {
      const sclValue = Number.parseInt(value)
      if (sclValue === -1) return "Message skipped spam filtering"
      if (sclValue === 0) return "Message is not likely to be spam"
      if (sclValue >= 1 && sclValue <= 4) return "Message may be spam"
      if (sclValue >= 5 && sclValue <= 9) return "Message is likely to be spam"
      return "Unknown spam confidence level"
    }

    // SFV descriptions
    if (header === "SFV") {
      const sfvValues: Record<string, string> = {
        BLK: "Message was blocked (sender in Blocked Senders list)",
        NSPM: "Message marked as non-spam",
        SFE: "Message allowed (sender in Safe Senders list)",
        SKA: "Message skipped spam filtering (sender allowed)",
        SKB: "Message marked as spam (blocked sender/domain)",
        SKI: "Message skipped filtering",
        SKN: "Message marked as non-spam before processing",
        SKQ: "Message released from quarantine",
        SKS: "Message marked as spam before processing",
        SPM: "Message marked as spam by spam filtering",
      }
      return sfvValues[value] || "Unknown spam filtering verdict"
    }

    // SFTY descriptions
    if (header === "SFTY") {
      const sftyValues: Record<string, string> = {
        "9.19": "Domain impersonation - sending domain is trying to impersonate a protected domain",
        "9.20": "User impersonation - sending user is trying to impersonate a recipient or protected user",
        "9.25": "First contact safety tip - may indicate a suspicious or phishing message",
      }
      return sftyValues[value] || "Unknown safety tip"
    }

    // BCL descriptions
    if (header === "BCL") {
      const bclValue = Number.parseInt(value)
      if (bclValue === 0) return "Message is not bulk email"
      if (bclValue >= 1 && bclValue <= 3) return "Message is from a legitimate bulk sender"
      if (bclValue >= 4 && bclValue <= 7) return "Message is from a bulk sender with mixed reputation"
      if (bclValue >= 8) return "Message is from a bulk sender with poor reputation"
      return "Unknown bulk complaint level"
    }

    // PCL descriptions
    if (header === "PCL") {
      const pclValue = Number.parseInt(value)
      if (pclValue === 0) return "Message is not phishing"
      if (pclValue >= 1 && pclValue <= 3) return "Message is neutral - not likely to be phishing"
      if (pclValue >= 4 && pclValue <= 8) return "Message is suspicious - likely to be phishing"
      return "Unknown phishing confidence level"
    }

    // CIP descriptions
    if (header === "CIP") {
      return "Connecting IP address: " + value
    }

    // CTRY descriptions
    if (header === "CTRY") {
      return "Source country/region: " + value
    }

    // PTR descriptions
    if (header === "PTR") {
      return "PTR record (reverse DNS lookup) of the source IP address: " + value
    }

    // LANG descriptions
    if (header === "LANG") {
      return "Message language: " + value
    }

    // IPV descriptions
    if (header === "IPV") {
      const ipvValues: Record<string, string> = {
        CAL: "IP on customer allow list",
        NLI: "IP not on any list",
        RLI: "IP on real-time block list",
      }
      return ipvValues[value] || "IP validation status: " + value
    }

    // SRV descriptions
    if (header === "SRV") {
      return "Service or feature that processed the message: " + value
    }

    // Default description
    return "Microsoft anti-spam header"
  }

  // Get severity level for a header
  const getHeaderSeverity = (header: string, value: string): "low" | "medium" | "high" | "none" => {
    if (header === "SCL") {
      const sclValue = Number.parseInt(value)
      if (sclValue >= 5) return "high"
      if (sclValue >= 1) return "medium"
      return "low"
    }

    if (header === "PCL") {
      const pclValue = Number.parseInt(value)
      if (pclValue >= 4) return "high"
      if (pclValue >= 1) return "medium"
      return "low"
    }

    if (header === "BCL") {
      const bclValue = Number.parseInt(value)
      if (bclValue >= 8) return "high"
      if (bclValue >= 4) return "medium"
      if (bclValue >= 1) return "low"
      return "none"
    }

    if (header === "CAT") {
      if (value === "NONE") return "low"
      const highSeverityCategories = ["PHSH", "HPHSH", "HPHISH", "MALW", "SPOOF", "DIMP", "UIMP", "BIMP"]
      const mediumSeverityCategories = ["SPM", "HSPM", "BULK"]

      if (highSeverityCategories.includes(value)) return "high"
      if (mediumSeverityCategories.includes(value)) return "medium"
      return "low"
    }

    if (header === "SFTY") {
      return "high" // All safety tips are high severity
    }

    if (header === "SFV") {
      const highSeverityValues = ["SPM", "SKS", "SKB", "BLK"]
      if (highSeverityValues.includes(value)) return "high"
      return "low"
    }

    return "none"
  }

  // Get icon for a header based on severity
  const getHeaderIcon = (severity: "low" | "medium" | "high" | "none") => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "low":
        return <Check className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  // Get background color for a header based on severity
  const getHeaderBackground = (severity: "low" | "medium" | "high" | "none") => {
    switch (severity) {
      case "high":
        return "bg-red-50 border-red-200"
      case "medium":
        return "bg-yellow-50 border-yellow-200"
      case "low":
        return "bg-green-50 border-green-200"
      default:
        return "bg-white border-gray-200"
    }
  }

  // Check if we have any Microsoft anti-spam headers
  const hasAntispamHeaders = Object.keys(antispamHeaders).length > 0

  // Get important headers to highlight at the top
  const priorityHeaders = ["SCL", "PCL", "BCL", "CAT", "SFV", "SFTY"]
  const priorityHeadersData = priorityHeaders
    .filter((header) => antispamHeaders[header])
    .map((header) => ({
      header,
      value: antispamHeaders[header],
      description: getHeaderDescription(header, antispamHeaders[header]),
      severity: getHeaderSeverity(header, antispamHeaders[header]),
    }))

  // Get secondary important headers (connection info)
  const connectionHeaders = ["CIP", "CTRY", "PTR", "IPV", "DIR"]
  const connectionHeadersData = connectionHeaders
    .filter((header) => antispamHeaders[header])
    .map((header) => ({
      header,
      value: antispamHeaders[header],
      description: getHeaderDescription(header, antispamHeaders[header]),
      severity: "none",
    }))

  if (!hasAntispamHeaders) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600 text-sm">No Microsoft anti-spam headers found in this email.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Priority headers summary - display in a grid */}
      {priorityHeadersData.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Key Anti-Spam Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {priorityHeadersData.map(({ header, value, description, severity }) => (
              <div key={header} className={`p-3 rounded-lg border ${getHeaderBackground(severity)}`}>
                <div className="flex items-center mb-1">
                  {getHeaderIcon(severity)}
                  <h3 className="font-medium ml-2">{header}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-2 text-purple-600">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>{description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="font-mono text-sm">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connection information */}
      {connectionHeadersData.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Connection Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {connectionHeadersData.map(({ header, value, description }) => (
              <div key={header} className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                <div className="flex items-center mb-1">
                  <Network className="h-4 w-4 text-blue-500" />
                  <h3 className="font-medium ml-2">{header}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-2 text-purple-600">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>{description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="font-mono text-sm">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All headers details */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-medium mb-2">Microsoft Anti-Spam Headers</h3>
        <p className="text-sm text-gray-600 mb-4">
          These headers provide information about how Microsoft's email protection services evaluated this message.
        </p>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="antispam-details">
            <AccordionTrigger className="text-sm font-medium">View All Header Details</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {Object.entries(antispamHeaders).map(([header, value]) => (
                  <div key={header} className="flex items-start p-2 bg-white rounded border border-gray-200">
                    <div className="font-mono text-xs text-purple-700 font-semibold min-w-[80px] mr-2">{header}</div>
                    <div className="flex-1">
                      <div className="font-mono text-xs">{value}</div>
                      <div className="text-xs text-gray-500 mt-1">{getHeaderDescription(header, value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Reference information */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center mb-2">
          <h3 className="font-medium">Understanding Microsoft Anti-Spam Headers</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-2 text-purple-600">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>
                  Microsoft adds these headers to emails processed by Exchange Online Protection and Microsoft Defender
                  for Office 365.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">CAT:</span> The category of protection policy applied to the message (e.g.,
            SPAM, PHISH, BULK).
          </p>
          <p>
            <span className="font-semibold">SCL:</span> Spam Confidence Level (0-9). Higher values indicate higher
            likelihood of spam.
          </p>
          <p>
            <span className="font-semibold">PCL:</span> Phishing Confidence Level. Indicates likelihood the message is a
            phishing attempt.
          </p>
          <p>
            <span className="font-semibold">BCL:</span> Bulk Complaint Level. Indicates likelihood the message is
            unwanted bulk email.
          </p>
          <p>
            <span className="font-semibold">SFTY:</span> Safety tips that may be displayed to warn users about
            suspicious messages.
          </p>
          <p>
            <span className="font-semibold">SFV:</span> Spam Filtering Verdict. Indicates how the message was processed
            by spam filters.
          </p>
          <p>
            <span className="font-semibold">DIR:</span> The directionality of the message (INB: Inbound, OUT: Outbound,
            INT: Internal).
          </p>
          <p>
            <span className="font-semibold">CIP:</span> Connecting IP address of the sender's mail server.
          </p>
        </div>
      </div>

      {/* Authentication-Results explanation */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="auth-results">
          <AccordionTrigger className="text-sm font-medium">Authentication-Results Reference</AccordionTrigger>
          <AccordionContent>
            <div className="p-4 bg-white rounded border border-gray-200 text-sm">
              <h4 className="font-medium mb-2">Authentication-Results Fields</h4>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold">compauth</p>
                  <p className="text-gray-600">
                    Composite authentication result combining SPF, DKIM, DMARC, and other factors.
                  </p>
                  <ul className="list-disc pl-5 text-xs mt-1">
                    <li>
                      <span className="font-mono">pass</span> - Authentication passed
                    </li>
                    <li>
                      <span className="font-mono">fail</span> - Authentication failed
                    </li>
                    <li>
                      <span className="font-mono">softfail</span> - Authentication had a soft failure
                    </li>
                    <li>
                      <span className="font-mono">none</span> - No authentication was performed
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">reason</p>
                  <p className="text-gray-600">
                    A three-digit code explaining why the composite authentication passed or failed.
                  </p>
                  <ul className="list-disc pl-5 text-xs mt-1">
                    <li>
                      <span className="font-mono">000</span> - Explicit authentication failure
                    </li>
                    <li>
                      <span className="font-mono">001</span> - Implicit authentication failure
                    </li>
                    <li>
                      <span className="font-mono">1xx/7xx</span> - Authentication passed
                    </li>
                    <li>
                      <span className="font-mono">2xx</span> - Soft pass for implicit authentication
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">action</p>
                  <p className="text-gray-600">Indicates the action taken based on DMARC check results.</p>
                  <ul className="list-disc pl-5 text-xs mt-1">
                    <li>
                      <span className="font-mono">pct.quarantine</span> - Message failed DMARC; policy set to quarantine
                    </li>
                    <li>
                      <span className="font-mono">pct.reject</span> - Message failed DMARC; policy set to reject
                    </li>
                    <li>
                      <span className="font-mono">permerror</span> - A permanent error occurred during DMARC evaluation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

