"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { ArrowRight, Shield, Mail, AlertTriangle, Search, ChevronDown, ExternalLink } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [headerText, setHeaderText] = useState<string>("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!headerText || headerText.trim() === "") {
        setError("Please paste an email header to analyze")
        setIsSubmitting(false)
        return
      }

      // Clean up the header text - remove any leading text before "Received:"
      let cleanHeader = headerText
      const receivedIndex = headerText.indexOf("Received:")
      if (receivedIndex > 0) {
        cleanHeader = headerText.substring(receivedIndex)
      }

      // Instead of using URL parameters, use a POST request to the API
      router.push("/analyze/direct?source=form")

      // Store the header in sessionStorage for retrieval on the analyze page
      sessionStorage.setItem("emailHeader", cleanHeader)
    } catch (err) {
      console.error("Error submitting header:", err)
      setError("An error occurred while processing your request. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-8 text-purple-800">Email Header Analyzer</h1>
          <p className="text-xl mb-8 text-purple-600 max-w-3xl mx-auto">
            Analyze email headers to verify authenticity, trace origins, and identify potential security threats
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#analyze"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
            >
              Analyze Header <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how-it-works"
              className="bg-white hover:bg-gray-100 text-purple-700 border border-purple-300 px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
            >
              Learn More <ChevronDown className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-800">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 border-yellow-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-700">Authentication Verification</h3>
                <p className="text-gray-600">
                  Verify SPF, DKIM, and DMARC authentication to confirm email legitimacy and detect spoofing attempts.
                </p>
              </div>
            </Card>

            <Card className="p-6 border-yellow-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-700">IP Reputation Check</h3>
                <p className="text-gray-600">
                  Analyze sender IP addresses against known blacklists to identify potentially malicious sources.
                </p>
              </div>
            </Card>

            <Card className="p-6 border-yellow-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-700">Email Path Visualization</h3>
                <p className="text-gray-600">
                  Trace the complete journey of an email through servers to identify unusual routing patterns.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mb-16 scroll-mt-8">
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-800">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-700">Paste Email Header</h3>
                <p className="text-gray-600">
                  Copy the complete email header from your email client and paste it into the analyzer.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-700">Analyze</h3>
                <p className="text-gray-600">
                  Our system processes the header, checking authentication, IP reputation, and routing information.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-700">Review Results</h3>
                <p className="text-gray-600">
                  Get a detailed breakdown of authentication status, potential threats, and email journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Client Instructions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-800">Finding Email Headers</h2>
          <Tabs defaultValue="gmail" className="max-w-3xl mx-auto">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="gmail">Gmail</TabsTrigger>
              <TabsTrigger value="outlook">Outlook</TabsTrigger>
              <TabsTrigger value="apple">Apple Mail</TabsTrigger>
              <TabsTrigger value="yahoo">Yahoo Mail</TabsTrigger>
            </TabsList>
            <TabsContent value="gmail" className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-yellow-200">
              <h3 className="text-xl font-semibold mb-4 text-purple-700">Gmail</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Open the email message</li>
                <li>Click the three dots (More options) in the top-right corner</li>
                <li>Select "Show original"</li>
                <li>Copy all the text from the "Original Message" section</li>
                <li>Paste into the analyzer below</li>
              </ol>
              <div className="mt-4">
                <a
                  href="https://support.google.com/mail/answer/29436?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 inline-flex items-center"
                >
                  Gmail Help <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </TabsContent>
            <TabsContent
              value="outlook"
              className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-yellow-200"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-700">Outlook</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Open the email message</li>
                <li>Click on "File" in the top menu</li>
                <li>Select "Properties"</li>
                <li>The headers will be in the "Internet headers" box</li>
                <li>Copy all the text and paste into the analyzer below</li>
              </ol>
              <div className="mt-4">
                <a
                  href="https://support.microsoft.com/en-us/office/view-internet-message-headers-in-outlook-cd039382-dc6e-4264-ac74-c048563d212c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 inline-flex items-center"
                >
                  Outlook Help <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </TabsContent>
            <TabsContent value="apple" className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-yellow-200">
              <h3 className="text-xl font-semibold mb-4 text-purple-700">Apple Mail</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Open the email message</li>
                <li>Click on "View" in the top menu</li>
                <li>Select "Message" and then "All Headers"</li>
                <li>Copy all the header information</li>
                <li>Paste into the analyzer below</li>
              </ol>
              <div className="mt-4">
                <a
                  href="https://support.apple.com/guide/mail/view-message-headers-mlhlp1065/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 inline-flex items-center"
                >
                  Apple Mail Help <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </TabsContent>
            <TabsContent value="yahoo" className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-yellow-200">
              <h3 className="text-xl font-semibold mb-4 text-purple-700">Yahoo Mail</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Open the email message</li>
                <li>Click the three dots (More) in the top-right</li>
                <li>Select "View raw message"</li>
                <li>Copy all the text</li>
                <li>Paste into the analyzer below</li>
              </ol>
              <div className="mt-4">
                <a
                  href="https://help.yahoo.com/kb/SLN5060.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 inline-flex items-center"
                >
                  Yahoo Mail Help <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Analyzer Section */}
        <Card
          id="analyze"
          className="max-w-3xl mx-auto p-6 shadow-lg border-yellow-200 bg-white/80 backdrop-blur-sm mb-16 scroll-mt-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">Analyze Email Header</h2>
          <p className="text-gray-600 mb-6">
            Paste the complete email header text below to get a detailed breakdown of routing information,
            authentication status, and potential security issues.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <textarea
                name="header"
                className="w-full h-64 p-4 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 bg-white/90"
                placeholder="Paste your email header here..."
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg flex items-center gap-2 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Analyze Header
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-purple-600">
            <p>Your email headers are analyzed securely and are not stored on our servers.</p>
            <div className="mt-2">
              <Link href="/sample" className="text-purple-700 hover:text-purple-900 underline">
                View a sample analysis
              </Link>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <div className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-800">Frequently Asked Questions</h2>
          <Accordion
            type="single"
            collapsible
            className="bg-white/80 backdrop-blur-sm rounded-lg border border-yellow-200"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6 py-4 hover:bg-purple-50 text-purple-700">
                What is an email header?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Email headers contain metadata about the email, including the sender, recipient, path the email took to
                get to you, and authentication results. This information is typically hidden from view but contains
                valuable data for verifying the legitimacy of an email.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-6 py-4 hover:bg-purple-50 text-purple-700">
                Why should I analyze email headers?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Analyzing email headers helps you verify if an email is legitimate or potentially fraudulent. It can
                reveal if an email was spoofed, if it came from a suspicious source, or if it failed authentication
                checks. This is particularly useful for identifying phishing attempts.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="px-6 py-4 hover:bg-purple-50 text-purple-700">
                What is SPF, DKIM, and DMARC?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                <p>
                  <strong>SPF (Sender Policy Framework)</strong>: Verifies that the sending server is authorized to send
                  emails for the domain.
                </p>
                <p className="mt-2">
                  <strong>DKIM (DomainKeys Identified Mail)</strong>: Adds a digital signature to verify the email
                  wasn't altered in transit.
                </p>
                <p className="mt-2">
                  <strong>DMARC (Domain-based Message Authentication, Reporting, and Conformance)</strong>: Combines SPF
                  and DKIM to provide instructions on how to handle emails that fail authentication.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="px-6 py-4 hover:bg-purple-50 text-purple-700">
                Is my email header data secure?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Yes. Your email headers are processed locally in your browser and are not stored on our servers. The
                only external API call made is to check IP reputation, which only sends the IP address, not the full
                header or any personal information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="px-6 py-4 hover:bg-purple-50 text-purple-700">
                What should I do if I find a suspicious email?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Do not click on any links or download any attachments</li>
                  <li>Do not reply to the email or provide any personal information</li>
                  <li>Report the email as spam or phishing in your email client</li>
                  <li>If it's a work email, notify your IT department</li>
                  <li>
                    If it appears to be from a company you do business with, contact them directly through their
                    official website or phone number (not from the email)
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Email Security Tips */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-800">Email Security Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 border-yellow-200 bg-white/80 backdrop-blur-sm">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-700">Warning Signs</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>Sender email doesn't match the company they claim to be from</li>
                    <li>Urgent requests for personal information or payment</li>
                    <li>Unexpected attachments or requests to enable macros</li>
                    <li>Poor grammar or spelling errors</li>
                    <li>Hovering over links shows suspicious URLs</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-yellow-200 bg-white/80 backdrop-blur-sm">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-700">Best Practices</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>Use strong, unique passwords for email accounts</li>
                    <li>Enable two-factor authentication</li>
                    <li>Be cautious with unexpected emails, even from known contacts</li>
                    <li>Verify requests for sensitive information through other channels</li>
                    <li>Keep your email client and security software updated</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-purple-600 pt-8 border-t border-purple-100">
          <p>Email Header Analyzer © {new Date().getFullYear()}</p>
          <p className="mt-2">Your email headers are analyzed securely and are not stored on our servers.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link href="/privacy" className="hover:text-purple-800">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-purple-800">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-purple-800">
              About
            </Link>
            <a href="mailto:support@emailheaderanalyzer.com" className="hover:text-purple-800">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

