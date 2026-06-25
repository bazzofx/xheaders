"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, Check, X, AlertTriangle, Info, AlertCircle, Shield } from "lucide-react"
import Link from "next/link"
import EmailPathVisualization from "@/components/email-path-visualization"
import HeaderSection from "@/components/header-section"
import HeaderTable from "@/components/header-table"
import RelayTable from "@/components/relay-table"
import DeliveryInfo from "@/components/delivery-info"
import IPAbuseCheck from "@/components/ip-abuse-check"
import DkimVerification from "@/components/dkim-verification"
import MSAntispamInfo from "@/components/ms-antispam-info"
import ConfettiEffect from "@/components/confetti-effect"

export default function ResultsPage() {
  const router = useRouter()
  const [headerData, setHeaderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Get the parsed data from sessionStorage
      const storedData = typeof window !== "undefined" ? sessionStorage.getItem("parsedHeaderData") : null
      if (!storedData) {
        return
      }

      try {
        // Parse the stored data
        const parsedData = JSON.parse(storedData)

        // Update state
        setHeaderData(parsedData)
        setLoading(false)

        // Clear the stored data to prevent it from being used again
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("parsedHeaderData")
        }
      } catch (parseError) {
        console.error("Error parsing stored data:", parseError)
        setError("Failed to load analysis results. Please try again.")
        setLoading(false)
      }
    } catch (err) {
      console.error("Error in results page:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen relative text-slate-100 flex items-center justify-center">
        <div className="bg-overlay" />
        <div className="text-cyan-400 text-xl font-semibold animate-pulse">Loading analysis results...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative text-slate-100">
        <div className="bg-overlay" />
        
        {/* Sticky Navbar */}
        <header className="sticky-nav">
          <div className="nav-container">
            <div className="nav-logo">
              <Shield className="h-6 w-6 text-cyan-400 stroke-[2px]" />
              <span className="font-bold text-lg text-slate-100 tracking-tight">Email Header Analyzer</span>
            </div>
            <div className="nav-cta">
              <Link href="/" className="nav-cta-btn">Analyze Another</Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/40">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Analyzer
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1 text-slate-100">Analysis Error</h1>
          </div>

          <div className="cyber-card h-auto border-red-500/30 box-glow">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-red-500 mr-4 mt-0.5" />
              <div>
                <h2 className="text-xl font-semibold mb-2 text-red-400">Analysis Error</h2>
                <p className="text-slate-300 mb-4">{error}</p>
                <p className="text-slate-400 mb-6">
                  Please check the header text and try again.
                </p>
                <Link href="/">
                  <Button className="btn-gradient px-6 py-2">Try Again</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col justify-between">
      <div className="bg-overlay" />
      <ConfettiEffect />

      {/* Sticky Navbar */}
      <header className="sticky-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Shield className="h-6 w-6 text-cyan-400 stroke-[2px]" />
            <span className="font-bold text-lg text-slate-100 tracking-tight">Email Header Analyzer</span>
          </div>
          <div className="nav-cta">
            <Link href="/" className="nav-cta-btn">Analyze New Header</Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="content-container flex-grow py-12">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/40">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1 text-slate-100">Email Header Analysis</h1>
        </div>

        {/* Overview Card */}
        <div className="cyber-card h-auto mb-8 border-slate-800/80">
          <h2 className="text-2xl font-bold mb-1 text-slate-100">Analysis Overview</h2>
          <p className="text-slate-400 mb-6 text-sm">
            Email Subject: <span className="text-purple-400 font-semibold">{headerData.subject || "(No Subject)"}</span>
          </p>

          {/* IP Abuse Check */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3 text-cyan-400 uppercase tracking-wider text-xs">IP Reputation Details</h3>
            <IPAbuseCheck ip={headerData.originalSenderIP} />
          </div>

          <DeliveryInfo
            dmarcCompliant={headerData.dmarc.pass}
            spfAlignment={headerData.alignment.spf}
            spfAuthenticated={headerData.spf.pass}
            dkimAlignment={headerData.alignment.dkim}
            dkimAuthenticated={headerData.dkim.pass}
          />
        </div>

        {/* DKIM Verification Card */}
        <div className="cyber-card h-auto mb-8 border-slate-800/80">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">DKIM Verification</h2>
          <DkimVerification dkimInfo={headerData.dkim} />
        </div>

        {/* Routing/Relay Table Card */}
        <div className="cyber-card h-auto mb-8 border-slate-800/80">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Relay & Routing Details</h2>

          <table className="premium-table mb-6">
            <tbody>
              <tr>
                <th className="w-1/4 font-semibold text-slate-400">
                  Received Delay
                </th>
                <td className="text-slate-100 font-medium">
                  {headerData.totalDelay}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mb-8 border-t border-slate-800/60 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-100">Email Path Visualization</h3>
            <EmailPathVisualization path={headerData.path} />
          </div>

          <div className="border-t border-slate-800/60 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-100">Relay Server Logs</h3>
            <RelayTable hops={headerData.hops} />
          </div>
        </div>

        {/* Authentication Status Card */}
        <div className="cyber-card h-auto mb-8 border-slate-800/80">
          <h2 className="text-xl font-semibold mb-6 text-slate-100">Authentication Protocols</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* SPF */}
            <div className="flex items-center p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="mr-4">
                {headerData.spf.pass ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="h-5 w-5 text-emerald-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">SPF</h3>
                <p className="text-sm text-slate-400">{headerData.spf.pass ? "Pass" : "Fail"}</p>
              </div>
            </div>

            {/* DKIM */}
            <div className="flex items-center p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="mr-4">
                {headerData.dkim.pass ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="h-5 w-5 text-emerald-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">DKIM</h3>
                <p className="text-sm text-slate-400">{headerData.dkim.pass ? "Pass" : "Fail"}</p>
              </div>
            </div>

            {/* DMARC */}
            <div className="flex items-center p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="mr-4">
                {headerData.dmarc.pass ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="h-5 w-5 text-emerald-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">DMARC</h3>
                <p className="text-sm text-slate-400">{headerData.dmarc.pass ? "Pass" : "Fail"}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-6">
            <h3 className="font-semibold text-slate-300 mb-3">Authentication Alignment</h3>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center flex-wrap gap-2">
              <Badge variant={headerData.alignment.spf ? "success" : "destructive"} className="px-3 py-1 text-xs">
                {headerData.alignment.spf ? "SPF Aligned" : "SPF Not Aligned"}
              </Badge>
              <Badge variant={headerData.alignment.dkim ? "success" : "destructive"} className="px-3 py-1 text-xs">
                {headerData.alignment.dkim ? "DKIM Aligned" : "DKIM Not Aligned"}
              </Badge>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/50">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm bg-slate-900 border border-slate-800 text-slate-200">
                    <p>Alignment means the domain in the From header matches the domain validated by SPF or DKIM.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Detailed Sections Tabs */}
        <div className="cyber-card h-auto mb-8 border-slate-800/80">
          <h2 className="text-xl font-semibold mb-4 text-slate-100">Detailed Header Sections</h2>

          <Tabs defaultValue="routing">
            <TabsList className="premium-tabs-list mb-6">
              <TabsTrigger value="routing" className="premium-tabs-trigger">Server & Routing</TabsTrigger>
              <TabsTrigger value="authentication" className="premium-tabs-trigger">Authentication</TabsTrigger>
              <TabsTrigger value="metadata" className="premium-tabs-trigger">Metadata</TabsTrigger>
              <TabsTrigger value="threats" className="premium-tabs-trigger">Threat Indicators</TabsTrigger>
              <TabsTrigger value="msantispam" className="premium-tabs-trigger">MS Anti-Spam</TabsTrigger>
              <TabsTrigger value="all" className="premium-tabs-trigger">All Headers</TabsTrigger>
            </TabsList>

            <TabsContent value="routing" className="space-y-4">
              <HeaderSection
                title="Received Headers"
                content={headerData.received}
                tooltip="Shows the path the email took through mail servers. Useful for tracking spoofing and delays."
                highlight={true}
              />

              <HeaderSection
                title="Message-ID"
                content={headerData.messageId}
                tooltip="Unique identifier for the email, useful for tracking duplicates or forensics."
              />

              <HeaderSection
                title="Return-Path"
                content={headerData.returnPath}
                tooltip="The actual return address. Can reveal spoofing attempts if different from the From address."
                highlight={headerData.threats.mismatchedSender}
              />

              <HeaderSection
                title="X-Originating-IP"
                content={headerData.originatingIp}
                tooltip="IP address of the sender's device. Can help track phishing attempts."
              />
            </TabsContent>

            <TabsContent value="authentication" className="space-y-4">
              <HeaderSection
                title="SPF Details"
                content={headerData.spf.details}
                tooltip="Sender Policy Framework verifies if the sending server is authorized to send emails for the domain."
                highlight={!headerData.spf.pass}
              />

              <HeaderSection
                title="DKIM Signature"
                content={headerData.dkim.signature}
                tooltip="DomainKeys Identified Mail adds a digital signature to verify the email wasn't altered in transit."
                highlight={!headerData.dkim.pass}
              />

              <HeaderSection
                title="DMARC"
                content={headerData.dmarc.details || "Not available"}
                tooltip="Domain-based Message Authentication, Reporting, and Conformance helps protect email domains from unauthorized use."
                highlight={!headerData.dmarc.pass}
              />

              <HeaderSection
                title="Authentication Results"
                content={headerData.authResults}
                tooltip="Summary of authentication checks performed by the receiving mail server."
              />
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              <HeaderSection
                title="Return-Path"
                content={headerData.returnPath}
                tooltip="The actual return address. Can reveal spoofing attempts if different from the From address."
                highlight={headerData.threats.mismatchedSender}
              />

              {headerData.xSenderIP && (
                <HeaderSection
                  title="X-Sender-IP"
                  content={headerData.xSenderIP}
                  tooltip="The IP address of the sender's mail server as reported by the email system."
                  highlight={true}
                />
              )}

              <HeaderSection
                title="From"
                content={headerData.from}
                tooltip="The sender's display name and email address."
              />

              <HeaderSection title="To" content={headerData.to} tooltip="The recipient's email address." />

              <HeaderSection title="Subject" content={headerData.subject} tooltip="The email subject line." />

              <HeaderSection title="Date" content={headerData.date} tooltip="When the email was sent." />

              <HeaderSection
                title="Content Type"
                content={headerData.contentType}
                tooltip="The format of the email content."
              />
            </TabsContent>

            <TabsContent value="threats" className="space-y-4">
              {headerData.threats.suspiciousDomains && (
                <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                    <h3 className="font-semibold text-red-400">Suspicious Domains Detected</h3>
                  </div>
                  <p className="text-sm text-red-300">{headerData.threats.suspiciousDomains}</p>
                </div>
              )}

              {headerData.threats.mismatchedSender && (
                <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                    <h3 className="font-semibold text-red-400">Mismatched Sender Information</h3>
                  </div>
                  <p className="text-sm text-red-300">
                    The From address doesn't match the Return-Path, which could indicate spoofing.
                  </p>
                </div>
              )}

              <HeaderSection
                title="X-Mailer / User-Agent"
                content={headerData.userAgent || "Not present"}
                tooltip="Identifies the email client used. Some phishing tools have distinctive signatures."
                highlight={headerData.userAgent && headerData.userAgent.toLowerCase().includes("gophish")}
              />

              <HeaderSection
                title="Spam Score"
                content={headerData.spamScore || "Not available"}
                tooltip="Uses header and content cues to predict spam likelihood."
                highlight={headerData.threats.highSpamScore}
              />
            </TabsContent>

            <TabsContent value="msantispam" className="space-y-4">
              <MSAntispamInfo antispamHeaders={headerData.msAntispamHeaders} />
            </TabsContent>

            <TabsContent value="all">
              <HeaderTable
                headers={headerData.allHeaders}
                highlight={["dkim-signature", "authentication-results", "x-mailer", "return-path", "from"]}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Raw Header Display */}
        <div className="cyber-card h-auto border-slate-800/80">
          <h2 className="text-xl font-semibold mb-4 text-slate-100">Raw Header</h2>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 overflow-x-auto">
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">{headerData.rawHeader}</pre>
          </div>
        </div>

      </main>

      {/* Footer Section */}
      <footer className="premium-footer">
        <div className="content-container">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-cyan-400" />
              <span className="font-bold text-slate-200">Email Header Analyzer</span>
            </div>
            
            <div className="footer-nav">
              <Link href="/privacy" className="footer-nav-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-nav-link">Terms of Service</Link>
              <Link href="/about" className="footer-nav-link">About</Link>
              <a href="mailto:support@emailheaderanalyzer.com" className="footer-nav-link">Contact</a>
            </div>

            <p className="text-[13px] text-slate-500 mt-2">
              Email Header Analyzer &copy; {new Date().getFullYear()}. Your headers are processed securely in your browser.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
