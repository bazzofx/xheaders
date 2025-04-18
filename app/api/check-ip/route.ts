import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ip = searchParams.get("ip")

  if (!ip) {
    return NextResponse.json({ error: "IP parameter is required" }, { status: 400 })
  }

  // Log the IP for debugging
  console.log("Checking IP in API route:", ip)

  // Validate IP format (both IPv4 and IPv6)
  if (!isValidIpAddress(ip)) {
    return NextResponse.json(
      {
        error: `Invalid IP address format: ${ip}`,
      },
      { status: 400 },
    )
  }

  // Check if API key is available
  if (!process.env.ABUSEIPDB_API_KEY) {
    return NextResponse.json(
      {
        error: "AbuseIPDB API key is not configured",
      },
      { status: 500 },
    )
  }

  try {
    // Using the v2 API format - works with both IPv4 and IPv6
    const response = await fetch(
      `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90&verbose`,
      {
        headers: {
          Key: process.env.ABUSEIPDB_API_KEY || "",
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      // Return the actual error from the API
      const errorText = await response.text()
      console.error("AbuseIPDB API error response:", errorText)

      return NextResponse.json(
        {
          error: `AbuseIPDB API error: ${response.status} ${response.statusText}`,
          details: errorText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error checking IP:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}

// Updated function to validate both IPv4 and IPv6 addresses
function isValidIpAddress(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false

  // Remove any brackets or parentheses that might be present
  const cleanedIp = ip.replace(/[[\]()]/g, "").trim()

  // Check if it's a valid IPv4 address
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  const ipv4Match = cleanedIp.match(ipv4Regex)

  if (ipv4Match) {
    // Validate each octet is between 0-255
    try {
      for (let i = 1; i <= 4; i++) {
        const octet = Number.parseInt(ipv4Match[i], 10)
        if (isNaN(octet) || octet < 0 || octet > 255) return false
      }
      return true
    } catch (e) {
      console.error("IPv4 validation error:", e)
      return false
    }
  }

  // If not IPv4, check if it's a valid IPv6 address
  // This is a simplified check - in production you might want a more robust validation
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/

  return ipv6Regex.test(cleanedIp)
}

