"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, Check, X, AlertTriangle, Info, AlertCircle } from "lucide-react"
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
      // console.log(storedData)
      if (!storedData) {
        // If no data is available, redirect to home
        // router.push("/")
        return
      }

      try {
        // Parse the stored data
        const parsedData = JSON.parse(storedData)

        // Override DKIM pass to false as requested
        // parsedData.dkim.pass = false

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
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50 flex items-center justify-center">
        <div className="text-purple-700 text-xl">Loading analysis results...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-purple-700">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1 text-purple-800">Email Header Analysis</h1>
          </div>

          <Card className="p-6 border-red-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
              <div>
                <h2 className="text-xl font-semibold mb-2 text-red-700">Analysis Error</h2>
                <p className="text-gray-700 mb-4">{error}</p>
                <p className="text-gray-600 mb-6">Please try again with a different header.</p>
                <Link href="/">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">Try Again</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50">
      <ConfettiEffect />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-purple-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1 text-purple-800">Email Header Analysis</h1>
        </div>

        <Card className="mb-8 p-6 border-yellow-200 bg-white/80 backdrop-blur-sm">
          <h1 className="text-2xl font-bold mb-2">Header Analyzed</h1>
          <h2 className="text-lg mb-4">
            <small>
              Email Subject: <span className="text-purple-600">{headerData.subject}</span>
            </small>
          </h2>

          {/* Add IP Abuse Check */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-purple-700">IP Reputation Check</h3>
            <IPAbuseCheck ip={headerData.originalSenderIP} />
          </div>

          <DeliveryInfo
            dmarcCompliant={headerData.dmarc.pass}
            spfAlignment={headerData.alignment.spf}
            spfAuthenticated={headerData.spf.pass}
            dkimAlignment={headerData.alignment.dkim}
            dkimAuthenticated={headerData.dkim.pass}
          />
        </Card>

        <Card className="mb-8 p-6 border-yellow-200 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">DKIM Verification</h2>
          <DkimVerification dkimInfo={headerData.dkim} />
        </Card>

        <Card className="mb-8 p-6 border-yellow-200 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Relay Information</h2>

          <table className="w-full mb-4 text-sm border-collapse">
            <tbody>
              <tr className="bg-yellow-50">
                <th className="border border-yellow-200 px-4 py-2 text-left font-semibold w-1/4">
                  <span className="text-lg">Received Delay:</span>
                </th>
                <th className="border border-yellow-200 px-4 py-2 text-left">
                  <span className="text-lg">{headerData.totalDelay}</span>
                </th>
              </tr>
            </tbody>
          </table>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">Email Path Visualization</h2>
            <EmailPathVisualization path={headerData.path} />
          </div>

          <RelayTable hops={headerData.hops} />
        </Card>

        <Card className="mb-8 p-6 border-yellow-200 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Authentication Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="mr-4">
                {headerData.spf.pass ? (
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">SPF</h3>
                <p className="text-sm text-gray-600">{headerData.spf.pass ? "Pass" : "Fail"}</p>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="mr-4">
                {headerData.dkim.pass ? (
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">DKIM</h3>
                <p className="text-sm text-gray-600">{headerData.dkim.pass ? "Pass" : "Fail"}</p>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="mr-4">
                {headerData.dmarc.pass ? (
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">DMARC</h3>
                <p className="text-sm text-gray-600">{headerData.dmarc.pass ? "Pass" : "Fail"}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Authentication Alignment</h3>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="flex items-center">
                <Badge variant={headerData.alignment.spf ? "success" : "destructive"} className="mr-2">
                  {headerData.alignment.spf ? "SPF Aligned" : "SPF Not Aligned"}
                </Badge>
                <Badge variant={headerData.alignment.dkim ? "success" : "destructive"} className="mr-2">
                  {headerData.alignment.dkim ? "DKIM Aligned" : "DKIM Not Aligned"}
                </Badge>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2">
                        <Info className="h-4 w-4 text-purple-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>Alignment means the domain in the From header matches the domain validated by SPF or DKIM.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-8 p-6 border-yellow-200 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Header Sections</h2>

          <Tabs defaultValue="routing">
            <TabsList className="mb-4 bg-yellow-100">
              <TabsTrigger value="routing">Server & Routing</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="threats">Threat Indicators</TabsTrigger>
              <TabsTrigger value="msantispam">MS Anti-Spam</TabsTrigger>
              <TabsTrigger value="all">All Headers</TabsTrigger>
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
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="font-medium text-red-700">Suspicious Domains Detected</h3>
                  </div>
                  <p className="text-sm text-red-600">{headerData.threats.suspiciousDomains}</p>
                </div>
              )}

              {headerData.threats.mismatchedSender && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="font-medium text-red-700">Mismatched Sender Information</h3>
                  </div>
                  <p className="text-sm text-red-600">
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
        </Card>

        <Card className="p-6 border-yellow-200 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Raw Header</h2>
          <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs whitespace-pre-wrap">{headerData.rawHeader}</pre>
          </div>
        </Card>
      </div>
    </div>
  )
}

