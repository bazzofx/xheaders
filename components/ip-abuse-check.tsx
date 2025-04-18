"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, ExternalLink, Shield, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface IPAbuseCheckProps {
  ip: string | null
}

interface AbuseReport {
  ipAddress: string
  abuseConfidenceScore: number
  totalReports: number
  numDistinctUsers?: number
  isWhitelisted: boolean
  countryCode: string
  countryName: string
  domain?: string
  isp?: string
  usageType?: string
  isTor?: boolean
  lastReportedAt?: string
}

export default function IPAbuseCheck({ ip }: IPAbuseCheckProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [abuseData, setAbuseData] = useState<AbuseReport | null>(null)
  const [extractedIp, setExtractedIp] = useState<string | null>(null)

  // Function to extract the first valid IP address (IPv4 or IPv6) from a string
  function extractFirstIp(text: string): string | null {
    if (!text) return null

    // Clean the input by removing brackets and parentheses
    const cleanedText = text.replace(/[[\]()]/g, "").trim()

    // First try to extract IPv4 addresses
    const ipv4Regex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/
    const ipv4Match = cleanedText.match(ipv4Regex)

    if (ipv4Match) return ipv4Match[0]

    // If no IPv4 address found, try to extract IPv6 addresses
    // This regex handles various IPv6 formats including compressed forms
    const ipv6Regex =
      /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/
    const ipv6Match = cleanedText.match(ipv6Regex)

    // Return IPv6 address if found
    return ipv6Match ? ipv6Match[0] : null
  }

  useEffect(() => {
    // If IP is null, undefined, or empty string, don't proceed
    if (!ip || ip.trim() === "") {
      console.log("No IP provided to check")
      return
    }

    // Extract IP address (IPv4 or IPv6)
    const ipToCheck = extractFirstIp(ip)
    setExtractedIp(ipToCheck)

    // Log the IP for debugging
    console.log("Checking IP in component:", ip)
    console.log("Extracted IP:", ipToCheck)

    if (!ipToCheck) {
      setError(`Could not extract a valid IP address from: ${ip}`)
      return
    }

    async function checkIP() {
      setLoading(true)
      setError(null)

      try {
        console.log("Using extracted IP:", ipToCheck)

        // Use our server-side API route
        const response = await fetch(`/api/check-ip?ip=${encodeURIComponent(ipToCheck)}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Error checking IP: ${response.statusText}`)
        }

        const responseData = await response.json()

        // Check if the response has the expected structure
        if (responseData && responseData.data) {
          // Extract the data from the v2 API response format
          setAbuseData({
            ipAddress: responseData.data.ipAddress,
            abuseConfidenceScore: responseData.data.abuseConfidenceScore,
            totalReports: responseData.data.totalReports || 0,
            numDistinctUsers: responseData.data.numDistinctUsers,
            isWhitelisted: responseData.data.isWhitelisted,
            countryCode: responseData.data.countryCode,
            countryName: responseData.data.countryName,
            domain: responseData.data.domain,
            isp: responseData.data.isp,
            usageType: responseData.data.usageType,
            isTor: responseData.data.isTor,
            lastReportedAt: responseData.data.lastReportedAt,
          })
        } else {
          // IP not found in abuse database or unexpected response format
          setAbuseData(null)
        }
      } catch (err) {
        console.error("Error checking IP:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    checkIP()
  }, [ip])

  if (!ip) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-gray-600">No originating IP address found in the email header.</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
        <span className="text-blue-600">
          Checking IP address {extractedIp && <span className="font-medium">({extractedIp})</span>} for abuse reports...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
        <div className="flex-1">
          <p className="text-orange-600 mb-1">{error}</p>
          <p className="text-sm text-orange-500">
            IP format may be invalid or the API service may be unavailable.
            {extractedIp && (
              <a
                href={`https://www.abuseipdb.com/check/${encodeURIComponent(extractedIp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 underline inline-flex items-center"
              >
                Check manually <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            )}
          </p>
        </div>
      </div>
    )
  }

  if (!abuseData || abuseData.totalReports === 0) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
        <Shield className="h-5 w-5 text-green-500 mr-2" />
        <div>
          <p className="text-green-600">
            IP address <span className="font-medium">{extractedIp}</span> not found in AbuseIPDB.
          </p>
          {extractedIp && (
            <p className="text-sm text-green-600 mt-1">
              <a
                href={`https://www.abuseipdb.com/check/${encodeURIComponent(extractedIp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline inline-flex items-center"
              >
                View details <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
          )}
        </div>
      </div>
    )
  }

  // IP found in abuse database
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center mb-2">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
        <h3 className="font-medium text-red-700">Potential Malicious IP Detected</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={`https://www.abuseipdb.com/check/${encodeURIComponent(abuseData.ipAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-red-600 hover:text-red-800"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>View full report on AbuseIPDB</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div>
          <p className="text-sm text-red-600">
            <span className="font-semibold">IP Address:</span> {abuseData.ipAddress}
          </p>
          <p className="text-sm text-red-600">
            <span className="font-semibold">Abuse Confidence Score:</span> {abuseData.abuseConfidenceScore}%
          </p>
          <p className="text-sm text-red-600">
            <span className="font-semibold">Total Reports:</span> {abuseData.totalReports}
          </p>
          {abuseData.numDistinctUsers && (
            <p className="text-sm text-red-600">
              <span className="font-semibold">Distinct Reporters:</span> {abuseData.numDistinctUsers}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-red-600">
            <span className="font-semibold">Country:</span> {abuseData.countryName} ({abuseData.countryCode})
          </p>
          {abuseData.isp && (
            <p className="text-sm text-red-600">
              <span className="font-semibold">ISP:</span> {abuseData.isp}
            </p>
          )}
          {abuseData.usageType && (
            <p className="text-sm text-red-600">
              <span className="font-semibold">Usage Type:</span> {abuseData.usageType}
            </p>
          )}
          {abuseData.lastReportedAt && (
            <p className="text-sm text-red-600">
              <span className="font-semibold">Last Reported:</span>{" "}
              {new Date(abuseData.lastReportedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <a
          href={`https://www.abuseipdb.com/check/${encodeURIComponent(abuseData.ipAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-red-700 hover:text-red-900 font-medium underline inline-flex items-center"
        >
          View full report on AbuseIPDB <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  )
}

