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
    const ipv6Regex =
      /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/
    const ipv6Match = cleanedText.match(ipv6Regex)

    return ipv6Match ? ipv6Match[0] : null
  }

  useEffect(() => {
    if (!ip || ip.trim() === "") {
      return
    }

    const ipToCheck = extractFirstIp(ip)
    setExtractedIp(ipToCheck)

    if (!ipToCheck) {
      setError(`Could not extract a valid IP address from: ${ip}`)
      return
    }

    async function checkIP() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/check-ip?ip=${encodeURIComponent(ipToCheck)}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Error checking IP: ${response.statusText}`)
        }

        const responseData = await response.json()

        if (responseData && responseData.data) {
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
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex items-center gap-3 text-slate-400">
        <AlertCircle className="h-5 w-5 text-slate-500 flex-shrink-0" />
        <span className="text-sm">No originating IP address found in the email header.</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex items-center gap-3 text-cyan-400">
        <div className="animate-spin h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full flex-shrink-0"></div>
        <span className="text-sm">
          Checking reputation for IP address {extractedIp && <span className="font-semibold text-slate-200">({extractedIp})</span>}...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 text-sm">
          <p className="text-amber-200 font-semibold mb-1">{error}</p>
          <p className="text-amber-300/80">
            IP format may be invalid or check service is offline.
            {extractedIp && (
              <a
                href={`https://www.abuseipdb.com/check/${encodeURIComponent(extractedIp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-0.5"
              >
                Check manually <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </p>
        </div>
      </div>
    )
  }

  if (!abuseData || abuseData.totalReports === 0) {
    return (
      <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-3 text-emerald-200">
        <Shield className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm flex-grow">
          <p className="font-semibold text-emerald-300">
            IP address <span className="font-mono text-white px-1.5 py-0.5 bg-emerald-950/60 rounded border border-emerald-500/20">{extractedIp}</span> is clean.
          </p>
          <p className="text-emerald-400/85 mt-1 text-xs">
            Not listed in malicious activity logs. 
            {extractedIp && (
              <a
                href={`https://www.abuseipdb.com/check/${encodeURIComponent(extractedIp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-0.5 font-semibold"
              >
                View reports <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 box-glow border-red-500/20">
      <div className="flex items-center justify-between mb-4 border-b border-red-500/10 pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <h3 className="font-semibold text-red-300">Potential Malicious IP Detected</h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={`https://www.abuseipdb.com/check/${encodeURIComponent(abuseData.ipAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 border border-slate-800 text-slate-200">
              <p>View full report on AbuseIPDB</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-3 leading-relaxed">
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 space-y-1">
          <p className="text-red-300/90">
            <span className="font-semibold text-red-400 mr-1.5">IP Address:</span> {abuseData.ipAddress}
          </p>
          <p className="text-red-300/90">
            <span className="font-semibold text-red-400 mr-1.5">Confidence Score:</span> {abuseData.abuseConfidenceScore}%
          </p>
          <p className="text-red-300/90">
            <span className="font-semibold text-red-400 mr-1.5">Total Reports:</span> {abuseData.totalReports}
          </p>
          {abuseData.numDistinctUsers && (
            <p className="text-red-300/90">
              <span className="font-semibold text-red-400 mr-1.5">Distinct Reporters:</span> {abuseData.numDistinctUsers}
            </p>
          )}
        </div>
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 space-y-1">
          <p className="text-red-300/90">
            <span className="font-semibold text-red-400 mr-1.5">Country:</span> {abuseData.countryName} ({abuseData.countryCode})
          </p>
          {abuseData.isp && (
            <p className="text-red-300/90">
              <span className="font-semibold text-red-400 mr-1.5">ISP:</span> {abuseData.isp}
            </p>
          )}
          {abuseData.usageType && (
            <p className="text-red-300/90">
              <span className="font-semibold text-red-400 mr-1.5">Usage Type:</span> {abuseData.usageType}
            </p>
          )}
          {abuseData.lastReportedAt && (
            <p className="text-red-300/90">
              <span className="font-semibold text-red-400 mr-1.5">Last Reported:</span>{" "}
              {new Date(abuseData.lastReportedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-red-500/10">
        <a
          href={`https://www.abuseipdb.com/check/${encodeURIComponent(abuseData.ipAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
        >
          View detailed stats on AbuseIPDB <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
