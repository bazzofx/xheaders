export function parseEmailHeader(rawHeader: string) {
  try {
    // Sanitize and normalize the input
    // First, check if the header starts with text that isn't part of the header
    // (like "Attachment" or other text that might be included when copying from email clients)
    const headerStartIndex = rawHeader.indexOf("Received:")
    if (headerStartIndex > 0) {
      rawHeader = rawHeader.substring(headerStartIndex)
    }

    // Normalize line endings and remove null characters
    const sanitizedHeader = rawHeader.replace(/\r\n/g, "\n").replace(/\u0000/g, "")

    // Handle line continuations (lines that start with spaces or tabs are continuations of the previous line)
    // Modify the line continuation handling to better handle Outlook's format
    const normalizedHeader = sanitizedHeader.replace(/\n[ \t]+/g, " ").replace(/$$\s*::\d+\s*$$/g, "")

    // Extract received headers
    const receivedRegex = /Received: (.*?)(?=\n\S|$)/gs
    const receivedMatches = [...normalizedHeader.matchAll(receivedRegex)]
    const receivedHeaders = receivedMatches.map((match) => match[1]?.trim() || "")

    // Extract message ID
    const messageIdMatch = normalizedHeader.match(/Message-I[dD]: <?(.+?)>?(?=\n\S|$)/i)
    const messageId = messageIdMatch ? messageIdMatch[1].trim() : "Not available"

    // Extract return path
    const returnPathMatch = normalizedHeader.match(/Return-Path: <?(.+?)>?(?=\n\S|$)/i)
    const returnPath = returnPathMatch ? returnPathMatch[1].trim() : "Not available"

    // Extract originating IP - look for IPs in various formats
    // Update the originating IP extraction to use our new function
    let originatingIp = "Not available"
    const ipMatches = extractIPs(normalizedHeader)
    if (ipMatches && ipMatches.length > 0) {
      // Use the first IP that's not a private IP
      for (const ip of ipMatches) {
        if (!isPrivateIP(ip) && !ip.startsWith("::")) {
          originatingIp = ip
          break
        }
      }
    }

    // Extract from
    const fromMatch = normalizedHeader.match(/From: (.+?)(?=\n\S|$)/i)
    const from = fromMatch ? fromMatch[1].trim() : "Not available"

    // Extract to
    const toMatch = normalizedHeader.match(/To: (.+?)(?=\n\S|$)/i)
    const to = toMatch ? toMatch[1].trim() : "Not available"

    // Extract subject - handle different formats
    // Update the subject extraction to handle Outlook's encoded subjects
    // Replace the existing subject extraction code with this:
    let subject = "Not available"
    const subjectMatch = normalizedHeader.match(/Subject: (.+?)(?=\n\S|$)/i)
    if (subjectMatch) {
      let encodedSubject = subjectMatch[1].trim()

      // Handle Outlook's =?Cp1252?Q? encoding
      if (encodedSubject.includes("=?")) {
        try {
          // Remove the encoding markers and join the parts
          encodedSubject = encodedSubject.replace(/=\?Cp1252\?Q\?/gi, "").replace(/\?=/gi, "")
          // Replace =XX with the corresponding character
          encodedSubject = encodedSubject.replace(/=([0-9A-F]{2})/gi, (match, p1) => {
            return String.fromCharCode(Number.parseInt(p1, 16))
          })
        } catch (error) {
          console.error("Error decoding subject:", error)
        }
      }

      subject = encodedSubject
    }

    // Extract date
    const dateMatch = normalizedHeader.match(/Date: (.+?)(?=\n\S|$)/i)
    const date = dateMatch ? dateMatch[1].trim() : "Not available"

    // Extract content type
    const contentTypeMatch = normalizedHeader.match(/Content-Type: (.+?)(?=\n\S|$)/i)
    const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : "Not available"

    // Extract user agent or X-Mailer
    const userAgentMatch = normalizedHeader.match(/(?:User-Agent|X-Mailer): (.+?)(?=\n\S|$)/i)
    const userAgent = userAgentMatch ? userAgentMatch[1].trim() : null

    // Extract spam score
    const spamScoreMatch = normalizedHeader.match(/X-Spam-Status: (.+?)(?=\n\S|$)/i)
    const spamScore = spamScoreMatch ? spamScoreMatch[1].trim() : null

    // Check SPF - look for different formats
    let spfPass = false
    let spfDetails = "Not available"

    // Look for SPF in Authentication-Results
    const authResultsSpfMatch = normalizedHeader.match(/Authentication-Results:.*?spf=(\w+)/i)
    if (authResultsSpfMatch && authResultsSpfMatch[1].toLowerCase() === "pass") {
      spfPass = true

      // Try to extract more details
      const spfDetailsMatch = normalizedHeader.match(/spf=\w+[^;]+/i)
      if (spfDetailsMatch) {
        spfDetails = spfDetailsMatch[0]
      }
    }
    // Also look for standalone SPF header
    else {
      const spfMatch = normalizedHeader.match(/SPF: (\w+)/i)
      if (spfMatch && spfMatch[1].toLowerCase() === "pass") {
        spfPass = true

        // Try to extract more details
        const spfLineMatch = normalizedHeader.match(/SPF:.*?(?=\n\S|$)/i)
        if (spfLineMatch) {
          spfDetails = spfLineMatch[0]
        }
      }
    }

    // Check DKIM - look for different formats
    let dkimPass = false
    let dkimSignature = "Not available"

    // Look for DKIM in Authentication-Results
    const authResultsDkimMatch = normalizedHeader.match(/Authentication-Results:.*?dkim=(\w+)/i)
    if (authResultsDkimMatch) {
      if (authResultsDkimMatch[1].toLowerCase() === "pass") {
        // Check if the Authentication-Results explicitly states "signature was verified"
        if (normalizedHeader.includes("dkim=pass (signature was verified)")) {
          dkimPass = true
        }
        // Additional checks for spoofed emails
        else {
          const originalFromMatch = normalizedHeader.match(/X-Google-Original-From:.*?<([^>]+)>/i)
          const fromMatch = normalizedHeader.match(/From:.*?<([^>]+)>/i)

          // Check if X-Google-Original-From exists and differs from From
          if (originalFromMatch && fromMatch && originalFromMatch[1].toLowerCase() !== fromMatch[1].toLowerCase()) {
            dkimPass = false // Email has been forwarded or spoofed
          } else if (normalizedHeader.toLowerCase().includes("x-mailer: gophish")) {
            dkimPass = false // Known phishing tool
          } else {
            dkimPass = true
          }
        }
      } else {
        // If dkim=none or any other value, set to false
        dkimPass = false
      }
    } else {
      // No DKIM authentication results found
      dkimPass = false
    }

    // Extract DKIM signature
    const dkimSignatureMatch = normalizedHeader.match(/DKIM-Signature: (.+?)(?=\n\S|$)/is)
    if (dkimSignatureMatch) {
      dkimSignature = dkimSignatureMatch[1].trim()
    } else {
      // If no DKIM signature is found, explicitly set dkimPass to false
      dkimPass = false
    }

    // Parse DKIM signature for verification
    const dkimParsed = parseDkimSignature(dkimSignature)

    // Check DMARC - look for different formats
    let dmarcPass = false
    let dmarcDetails = "Not available"

    // Look for DMARC in Authentication-Results
    const authResultsDmarcMatch = normalizedHeader.match(/Authentication-Results:.*?dmarc=(\w+)([^;]+)/i)
    if (authResultsDmarcMatch) {
      if (authResultsDmarcMatch[1].toLowerCase() === "pass") {
        dmarcPass = true
      }

      // Extract DMARC details
      if (authResultsDmarcMatch[2]) {
        dmarcDetails = `dmarc=${authResultsDmarcMatch[1]}${authResultsDmarcMatch[2]}`
      }
    }

    // Extract authentication results
    const authResultsMatch = normalizedHeader.match(/Authentication-Results: (.+?)(?=\n\S|$)/is)
    const authResults = authResultsMatch ? authResultsMatch[1].trim() : "Not available"

    // Extract domains from From and Return-Path headers for alignment checks
    const fromDomain = extractEmailDomain(from)
    const returnPathDomain = extractEmailDomain(returnPath)

    // Check for SPF alignment (From domain matches Return-Path domain)
    const spfAligned = fromDomain && returnPathDomain && fromDomain === returnPathDomain

    // Check for DKIM alignment (From domain matches DKIM signature domain)
    const dkimAligned = fromDomain && dkimParsed && fromDomain === dkimParsed.domain

    // Check for threats
    const mismatchedSender = fromDomain && returnPathDomain && fromDomain !== returnPathDomain
    const highSpamScore =
      spamScore &&
      spamScore.includes("score=") &&
      Number.parseFloat(spamScore.match(/score=([0-9.-]+)/i)?.[1] || "0") > 5

    // Check for suspicious mailer or forwarded/spoofed email
    const suspiciousMailer =
      userAgent &&
      (userAgent.toLowerCase().includes("gophish") || normalizedHeader.toLowerCase().includes("x-google-original-from"))

    // Extract all headers for table display
    const headerRegex = /^([^:\s]+):\s*(.+?)(?=\n[^:\s]+:|$)/gms
    const headerMatches = [...normalizedHeader.matchAll(headerRegex)]
    const allHeaders = headerMatches.map((match) => ({
      name: match[1]?.trim() || "",
      value: match[2]?.trim() || "",
    }))

    // Extract path information for visualization
    const path = {
      servers: [],
      ips: [],
      timestamps: [],
    }

    // Parse received headers to extract hops
    const hops = receivedHeaders
      .map((header, index) => {
        try {
          // Extract server names - look for "from" and "by" patterns
          const fromMatch = header.match(/from\s+([^\s[]+)/i)

          // Extract IPs - look for IPs in brackets or standalone
          const fromIpMatch = header.match(/\[?(\d+\.\d+\.\d+\.\d+)\]?/i)

          const byMatch = header.match(/by\s+([^\s[]+)/i)
          const withMatch = header.match(/with\s+([^;]+)/i)

          // Extract timestamp - usually at the end after a semicolon
          const timeMatch = header.match(/;\s*([^;]+)$/i)

          // Calculate delay between hops
          let delay = "0 seconds"
          if (index > 0 && timeMatch && receivedHeaders[index - 1].match(/;\s*([^;]+)$/)) {
            try {
              const currentTime = new Date(timeMatch[1].trim())
              const prevTime = new Date(receivedHeaders[index - 1].match(/;\s*([^;]+)$/)[1].trim())
              const diffSeconds = Math.abs(Math.floor((currentTime.getTime() - prevTime.getTime()) / 1000))

              if (diffSeconds < 60) {
                delay = `${diffSeconds} Second${diffSeconds !== 1 ? "s" : ""}`
              } else if (diffSeconds < 3600) {
                const minutes = Math.floor(diffSeconds / 60)
                delay = `${minutes} Minute${minutes !== 1 ? "s" : ""}`
              } else {
                const hours = Math.floor(diffSeconds / 3600)
                delay = `${hours} Hour${hours !== 1 ? "s" : ""}`
              }
            } catch (timeError) {
              console.error("Error calculating time delay:", timeError)
              delay = "Unknown"
            }
          } else if (index === 0) {
            delay = "*"
          }

          const from = fromMatch ? fromMatch[1] : ""
          const fromIp = fromIpMatch ? fromIpMatch[1] : ""

          if (from) path.servers.push(from)
          if (fromIp) path.ips.push(fromIp)
          if (timeMatch) path.timestamps.push(timeMatch[1].trim())

          return {
            hop: receivedHeaders.length - index,
            delay,
            from: fromMatch ? `${fromMatch[1]} ${fromIpMatch ? fromIpMatch[1] : ""}` : "",
            fromIp: fromIpMatch ? fromIpMatch[1] : "",
            by: byMatch ? byMatch[1] : "",
            with: withMatch ? withMatch[1] : "",
            time: timeMatch ? timeMatch[1].trim() : "",
            blacklisted: false, // In a real implementation, we would check blacklists
          }
        } catch (hopError) {
          console.error("Error parsing hop:", hopError)
          return {
            hop: receivedHeaders.length - index,
            delay: "Unknown",
            from: "Error parsing",
            fromIp: "",
            by: "",
            with: "",
            time: "",
            blacklisted: false,
          }
        }
      })
      .reverse() // Reverse to show first hop first

    // Reverse the path to show sender first
    path.servers.reverse()
    path.ips.reverse()
    path.timestamps.reverse()

    // Calculate total delay
    let totalDelay = "Unknown"
    if (hops.length >= 2) {
      try {
        const firstHop = hops[0]
        const lastHop = hops[hops.length - 1]

        if (firstHop.time && lastHop.time) {
          const firstTime = new Date(firstHop.time)
          const lastTime = new Date(lastHop.time)
          const diffSeconds = Math.abs(Math.floor((lastTime.getTime() - firstTime.getTime()) / 1000))

          if (diffSeconds < 60) {
            totalDelay = `${diffSeconds} seconds`
          } else if (diffSeconds < 3600) {
            const minutes = Math.floor(diffSeconds / 60)
            totalDelay = `${minutes} minute${minutes !== 1 ? "s" : ""}`
          } else {
            const hours = Math.floor(diffSeconds / 3600)
            totalDelay = `${hours} hour${hours !== 1 ? "s" : ""}`
          }
        }
      } catch (delayError) {
        console.error("Error calculating total delay:", delayError)
        totalDelay = "Unknown"
      }
    }

    // Add a function to extract the original sender IP
    // Update the original sender IP extraction function
    function extractOriginalSenderIP(receivedHeaders) {
      try {
        // Look for the last received header (first in the email path)
        if (receivedHeaders.length > 0) {
          const lastHeader = receivedHeaders[receivedHeaders.length - 1]

          // Try to find IP addresses in the last received header
          const ips = extractIPs(lastHeader)

          // Filter out private IPs and return the first public IP
          for (const ip of ips) {
            if (!isPrivateIP(ip) && !ip.startsWith("::")) {
              return ip
            }
          }

          // If no public IP found, return the first IP
          return ips.length > 0 ? ips[0] : null
        }
        return null
      } catch (ipError) {
        console.error("Error extracting original sender IP:", ipError)
        return null
      }
    }

    // Add the original sender IP to the returned object
    const originalSenderIP = extractOriginalSenderIP(receivedHeaders)

    // Extract X-Sender-IP
    const xSenderIPMatch = normalizedHeader.match(/X-Sender-IP:\s*(.+?)(?=\n\S|$)/i)
    const xSenderIP = xSenderIPMatch ? xSenderIPMatch[1].trim() : null

    const parsedData = {
      rawHeader: normalizedHeader,
      subject,
      received: receivedHeaders.join("\n\n"),
      messageId,
      returnPath,
      originatingIp,
      originalSenderIP,
      xSenderIP, // Add this line
      from,
      to,
      date,
      contentType,
      userAgent,
      spamScore,
      spf: {
        pass: spfPass,
        details: spfDetails,
      },
      dkim: {
        pass: dkimPass,
        signature: dkimSignature,
        parsed: dkimParsed,
      },
      dmarc: {
        pass: dmarcPass,
        details: dmarcDetails,
      },
      authResults,
      alignment: {
        spf: spfAligned,
        dkim: dkimAligned,
      },
      threats: {
        mismatchedSender,
        highSpamScore,
        suspiciousMailer,
        suspiciousDomains: suspiciousMailer ? "Potential phishing email detected (gophish mailer)" : null,
      },
      path,
      allHeaders,
      hops,
      totalDelay,
      msAntispamHeaders: extractMicrosoftAntispamHeaders(normalizedHeader),
    }

    // IMPORTANT: We're no longer overriding DKIM pass to false
    // This allows the actual DKIM authentication status to be used

    return parsedData
  } catch (error) {
    console.error("Error parsing email header:", error)

    // Return a minimal fallback object with error information
    return {
      rawHeader: "Error parsing header",
      subject: "Error parsing header",
      received: "",
      messageId: "Not available",
      returnPath: "Not available",
      originatingIp: "Not available",
      originalSenderIP: null,
      xSenderIP: null,
      from: "Not available",
      to: "Not available",
      date: "Not available",
      contentType: "Not available",
      userAgent: null,
      spamScore: null,
      spf: {
        pass: false,
        details: "Not available",
      },
      dkim: {
        pass: false,
        signature: "Not available",
        parsed: null,
      },
      dmarc: {
        pass: false,
      },
      authResults: "Not available",
      alignment: {
        spf: false,
        dkim: false,
      },
      threats: {
        mismatchedSender: false,
        highSpamScore: false,
        suspiciousMailer: false,
        suspiciousDomains: null,
      },
      path: {
        servers: [],
        ips: [],
        timestamps: [],
      },
      allHeaders: [
        {
          name: "Error",
          value: "Failed to parse email header: " + (error instanceof Error ? error.message : String(error)),
        },
      ],
      hops: [],
      totalDelay: "Unknown",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// Helper function to extract domain from email address in a header
function extractEmailDomain(headerValue: string): string | null {
  try {
    const match = headerValue.match(/[\w.-]+@([\w.-]+)/)
    return match ? match[1].toLowerCase() : null
  } catch (error) {
    console.error("Error extracting email domain:", error)
    return null
  }
}

// Helper function to check if an IP is private
// Update the isPrivateIP function to handle IPv6
function isPrivateIP(ip: string): boolean {
  try {
    // Handle IPv6 addresses
    if (ip.includes(":")) {
      // Simple check for IPv6 private ranges
      return ip.startsWith("fc") || ip.startsWith("fd") || ip === "::1"
    }

    // Handle IPv4 addresses
    const parts = ip.split(".").map((part) => Number.parseInt(part, 10))
    return (
      parts[0] === 10 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      parts[0] === 127
    )
  } catch (error) {
    console.error("Error checking private IP:", error)
    return false
  }
}

// Helper function to parse DKIM signature
function parseDkimSignature(dkimSignature: string) {
  try {
    if (!dkimSignature || dkimSignature === "Not available") return null

    const domain = dkimSignature.match(/d=([^;]+)/i)?.[1]?.trim()
    const selector = dkimSignature.match(/s=([^;]+)/i)?.[1]?.trim()
    const algorithm = dkimSignature.match(/a=([^;]+)/i)?.[1]?.trim()
    const headerFieldsMatch = dkimSignature.match(/h=([^;]+)/i)
    const headerFields = headerFieldsMatch ? headerFieldsMatch[1].split(":").map((h) => h.trim()) : []
    const bodyHash = dkimSignature.match(/bh=([^;]+)/i)?.[1]?.trim()
    const signature = dkimSignature.match(/b=([^;]+)/i)?.[1]?.trim()
    const timestamp = dkimSignature.match(/t=([^;]+)/i)?.[1]?.trim()
    const expiration = dkimSignature.match(/x=([^;]+)/i)?.[1]?.trim()

    if (!domain || !selector) return null

    return {
      version: dkimSignature.match(/v=([^;]+)/i)?.[1]?.trim() || "1",
      algorithm: algorithm || "rsa-sha256",
      domain,
      selector,
      headerFields,
      bodyHash: bodyHash || "",
      signature: signature || "",
      timestamp,
      expiration,
      raw: dkimSignature,
    }
  } catch (error) {
    console.error("Error parsing DKIM signature:", error)
    return null
  }
}

// Add this function after the parseEmailHeader function
function extractIPs(text) {
  const results = []

  // Extract IPv4 addresses
  const ipv4Regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
  const ipv4Matches = text.match(ipv4Regex) || []

  // Extract IPv6 addresses
  const ipv6Regex =
    /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))/g
  const ipv6Matches = text.match(ipv6Regex) || []

  return [...ipv4Matches, ...ipv6Matches]
}

// Add this function after the extractIPs function
// Update the extractMicrosoftAntispamHeaders function to include X-Forefront-Antispam-Report-Untrusted
function extractMicrosoftAntispamHeaders(normalizedHeader: string) {
  const antispamHeaders: Record<string, string> = {}

  // Extract X-Microsoft-Antispam-Mailbox-Delivery header
  const msAntispamMailboxDeliveryMatch = normalizedHeader.match(
    /X-Microsoft-Antispam-Mailbox-Delivery:?\s*(.+?)(?=\n\S|$)/i,
  )

  if (msAntispamMailboxDeliveryMatch && msAntispamMailboxDeliveryMatch[1]) {
    const headerValue = msAntispamMailboxDeliveryMatch[1].trim()

    // Split by semicolons and process each key-value pair
    const pairs = headerValue.split(";").filter((pair) => pair.trim() !== "")

    pairs.forEach((pair) => {
      // Handle pairs with colon (key:value format)
      if (pair.includes(":")) {
        const [key, value] = pair.split(":").map((part) => part.trim())
        if (key && value !== undefined) {
          antispamHeaders[key] = value
        }
      }
      // Handle special cases like ENG with parentheses
      else if (pair.includes("(")) {
        const keyMatch = pair.match(/([A-Z]+):\(/)
        if (keyMatch && keyMatch[1]) {
          const key = keyMatch[1]
          const valueMatch = pair.match(/$$(.+)$$/)
          const value = valueMatch ? valueMatch[1] : pair.substring(key.length + 1)
          antispamHeaders[key] = value
        }
      }
      // Handle keys without values
      else if (pair.trim()) {
        antispamHeaders[pair.trim()] = "true"
      }
    })
  }

  // Look for other Microsoft anti-spam headers
  const otherMsHeaders = [
    "X-MS-Exchange-Organization-SCL",
    "X-MS-Exchange-Organization-PCL",
    "X-Forefront-Antispam-Report",
    "X-Forefront-Antispam-Report-Untrusted",
    "X-Microsoft-Antispam",
    "X-Microsoft-Antispam-Message-Info",
  ]

  otherMsHeaders.forEach((header) => {
    const headerRegex = new RegExp(`${header}:\\s*(.+?)(?=\\n\\S|$)`, "i")
    const headerMatch = normalizedHeader.match(headerRegex)

    if (headerMatch && headerMatch[1]) {
      const headerValue = headerMatch[1].trim()

      // For headers with semicolon-separated values
      if (headerValue.includes(";")) {
        const pairs = headerValue.split(";").filter((pair) => pair.trim() !== "")

        pairs.forEach((pair) => {
          if (pair.includes(":")) {
            const [key, value] = pair.split(":").map((part) => part.trim())
            if (key && value !== undefined) {
              antispamHeaders[key] = value
            }
          } else if (pair.trim()) {
            // For values without explicit keys, use the header name as a prefix
            const shortHeader = header.replace(/^X-(?:MS-Exchange-Organization-|Microsoft-|Forefront-)?/i, "")
            antispamHeaders[`${shortHeader}_${pair.trim()}`] = "true"
          }
        })
      } else {
        // For simple headers, store the whole value
        const shortHeader = header.replace(/^X-(?:MS-Exchange-Organization-|Microsoft-|Forefront-)?/i, "")
        antispamHeaders[shortHeader] = headerValue
      }
    }
  })

  // Extract specific values that might be in different formats
  const specificFields = [
    { regex: /BCL=([^;]+)/i, key: "BCL" },
    { regex: /SCL=([^;]+)/i, key: "SCL" },
    { regex: /PCL=([^;]+)/i, key: "PCL" },
    { regex: /SFTY=([^;]+)/i, key: "SFTY" },
    { regex: /SFV:([^;]+)/i, key: "SFV" },
    { regex: /CAT:([^;]+)/i, key: "CAT" },
    { regex: /DIR:([^;]+)/i, key: "DIR" },
    { regex: /CIP:([^;]+)/i, key: "CIP" },
    { regex: /CTRY:([^;]+)/i, key: "CTRY" },
    { regex: /LANG:([^;]+)/i, key: "LANG" },
    { regex: /PTR:([^;]+)/i, key: "PTR" },
  ]

  specificFields.forEach((field) => {
    const match = normalizedHeader.match(field.regex)
    if (match && match[1] && !antispamHeaders[field.key]) {
      antispamHeaders[field.key] = match[1].trim()
    }
  })

  return antispamHeaders
}

