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
    <div className="min-h-screen relative text-slate-100 flex flex-col justify-between">
      {/* Background radial gradient overlays and faint grids */}
      <div className="bg-overlay" />

      {/* Decorative Circuit Traces */}
      {/* Left trace SVG (cyan) */}
      <svg className="absolute left-0 top-[200px] w-[300px] h-[600px] pointer-events-none opacity-20 hidden lg:block" viewBox="0 0 300 600" fill="none" stroke="#22D3EE" strokeWidth="1.5" aria-hidden="true">
        <path d="M 0,100 L 100,100 L 150,150 L 150,300 L 200,350 L 200,500 L 250,550 L 300,550" />
        <circle cx="100" cy="100" r="3" fill="#22D3EE" />
        <circle cx="150" cy="150" r="3" fill="#22D3EE" />
        <circle cx="200" cy="350" r="3" fill="#22D3EE" />
        <circle cx="300" cy="550" r="3" fill="#22D3EE" />
        <path d="M 0,200 L 80,200 L 120,240 L 120,400 L 70,450" />
        <circle cx="120" cy="240" r="3" fill="#22D3EE" />
      </svg>

      {/* Right trace SVG (purple) */}
      <svg className="absolute right-0 top-[350px] w-[300px] h-[600px] pointer-events-none opacity-20 hidden lg:block" viewBox="0 0 300 600" fill="none" stroke="#A855F7" strokeWidth="1.5" aria-hidden="true">
        <path d="M 300,100 L 200,100 L 150,150 L 150,300 L 100,350 L 100,500 L 50,550 L 0,550" />
        <circle cx="200" cy="100" r="3" fill="#A855F7" />
        <circle cx="150" cy="150" r="3" fill="#A855F7" />
        <circle cx="100" cy="350" r="3" fill="#A855F7" />
        <circle cx="0" cy="550" r="3" fill="#A855F7" />
        <path d="M 300,250 L 220,250 L 180,290 L 180,450 L 230,500" />
        <circle cx="180" cy="290" r="3" fill="#A855F7" />
      </svg>

      {/* Background blurred glow spots */}
      <div className="absolute top-[12%] left-[15%] w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none"></div>
      <div className="absolute top-[55%] right-[10%] w-[450px] h-[450px] rounded-full bg-cyan-500/4 blur-[160px] pointer-events-none"></div>

      {/* Sticky Navbar */}
      <header className="sticky-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Shield className="h-6 w-6 text-cyan-400 stroke-[2px]" />
            <span className="font-bold text-lg text-slate-100 tracking-tight">Email Header Analyzer</span>
          </div>
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#docs" className="nav-link">Docs</a>
          </nav>
          <div className="nav-cta">
            <a href="#analyze" className="nav-cta-btn">Analyze Now</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content-container flex-grow">
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="badge-pill">
            <span>ANALYZE • VERIFY • PROTECT</span>
          </div>
          <h1 className="hero-title text-gradient">Email Header Analyzer</h1>
          <p className="hero-subtitle">
            Analyze email headers to verify authenticity, trace origins, and identify potential security threats.
          </p>
          <div className="hero-buttons">
            <a href="#analyze" className="btn-gradient flex items-center gap-2">
              Analyze Email Header <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#how-it-works" className="btn-outline-cyber flex items-center gap-2">
              Learn More
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="scroll-mt-24">
          <div className="section-label">KEY FEATURES</div>
          <h2 className="section-title">Forensic Email Verification</h2>
          <div className="features-grid">
            {/* Authentication Verification Card */}
            <div className="cyber-card">
              <div className="feature-icon-wrapper">
                <Shield className="h-8 w-8 text-purple-500 stroke-[1.5]" />
              </div>
              <h3 className="card-title">Authentication Verification</h3>
              <p className="card-description">
                Verify SPF, DKIM and DMARC authentication to confirm email legitimacy and detect spoofing attempts.
              </p>
              <div className="card-arrow">
                <ArrowRight className="h-4 w-4 text-purple-500" />
              </div>
            </div>

            {/* IP Reputation Check Card */}
            <div className="cyber-card">
              <div className="feature-icon-wrapper">
                <Search className="h-8 w-8 text-cyan-400 stroke-[1.5]" />
              </div>
              <h3 className="card-title">IP Reputation Check</h3>
              <p className="card-description">
                Analyze sender IP addresses against known threat intelligence sources to identify malicious origins.
              </p>
              <div className="card-arrow">
                <ArrowRight className="h-4 w-4 text-cyan-400" />
              </div>
            </div>

            {/* Email Path Visualization Card */}
            <div className="cyber-card">
              <div className="feature-icon-wrapper">
                <Mail className="h-8 w-8 text-blue-400 stroke-[1.5]" />
              </div>
              <h3 className="card-title">Email Path Visualization</h3>
              <p className="card-description">
                Visualize the complete email route through servers and identify suspicious routing anomalies.
              </p>
              <div className="card-arrow">
                <ArrowRight className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="scroll-mt-24">
          <div className="section-label">HOW IT WORKS</div>
          <h2 className="section-title">Three Step Verification</h2>
          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-header">
                <div className="step-hexagon-container">
                  <svg className="absolute inset-0 w-full h-full text-purple-500/20 fill-none stroke-purple-500 stroke-[1.5]" viewBox="0 0 100 100" aria-hidden="true">
                    <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
                  </svg>
                  <span className="step-number">1</span>
                </div>
                <h3 className="step-title">Paste Email Header</h3>
              </div>
              <p className="step-description">
                Copy and paste the complete email header.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-header">
                <div className="step-hexagon-container">
                  <svg className="absolute inset-0 w-full h-full text-cyan-500/20 fill-none stroke-cyan-500 stroke-[1.5]" viewBox="0 0 100 100" aria-hidden="true">
                    <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
                  </svg>
                  <span className="step-number">2</span>
                </div>
                <h3 className="step-title">Analyze</h3>
              </div>
              <p className="step-description">
                The analyzer verifies authentication, reputation, and routing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-header">
                <div className="step-hexagon-container">
                  <svg className="absolute inset-0 w-full h-full text-blue-500/20 fill-none stroke-blue-500 stroke-[1.5]" viewBox="0 0 100 100" aria-hidden="true">
                    <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
                  </svg>
                  <span className="step-number">3</span>
                </div>
                <h3 className="step-title">Review Results</h3>
              </div>
              <p className="step-description">
                Inspect findings, risk score, authentication status, and recommendations.
              </p>
            </div>
          </div>
        </section>

        {/* Find Email Headers Documentation Section */}
        <section id="docs" className="scroll-mt-24">
          <div className="section-label">DOCUMENTATION</div>
          <h2 className="section-title">Finding Email Headers</h2>
          <Tabs defaultValue="gmail" className="max-w-3xl mx-auto">
            <TabsList className="premium-tabs-list">
              <TabsTrigger value="gmail" className="premium-tabs-trigger">Gmail</TabsTrigger>
              <TabsTrigger value="outlook" className="premium-tabs-trigger">Outlook</TabsTrigger>
              <TabsTrigger value="apple" className="premium-tabs-trigger">Apple Mail</TabsTrigger>
              <TabsTrigger value="yahoo" className="premium-tabs-trigger">Yahoo Mail</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gmail" className="premium-tabs-content">
              <div className="cyber-card h-auto">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Gmail</h3>
                <ol className="list-decimal pl-5 space-y-3 text-slate-300 text-[15px]">
                  <li>Open the email message.</li>
                  <li>Click the three dots (More options) in the top-right corner.</li>
                  <li>Select <strong className="text-white">"Show original"</strong>.</li>
                  <li>Copy all the text from the "Original Message" section.</li>
                  <li>Paste into the analyzer below.</li>
                </ol>
                <div className="mt-6 border-t border-slate-800 pt-4">
                  <a
                    href="https://support.google.com/mail/answer/29436?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 inline-flex items-center text-sm font-semibold transition-colors"
                  >
                    Gmail Help <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="outlook" className="premium-tabs-content">
              <div className="cyber-card h-auto">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Outlook</h3>
                <ol className="list-decimal pl-5 space-y-3 text-slate-300 text-[15px]">
                  <li>Open the email message.</li>
                  <li>Click on <strong className="text-white">"File"</strong> in the top menu.</li>
                  <li>Select <strong className="text-white">"Properties"</strong>.</li>
                  <li>The headers will be in the <strong className="text-white">"Internet headers"</strong> box.</li>
                  <li>Copy all the text and paste into the analyzer below.</li>
                </ol>
                <div className="mt-6 border-t border-slate-800 pt-4">
                  <a
                    href="https://support.microsoft.com/en-us/office/view-internet-message-headers-in-outlook-cd039382-dc6e-4264-ac74-c048563d212c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 inline-flex items-center text-sm font-semibold transition-colors"
                  >
                    Outlook Help <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="apple" className="premium-tabs-content">
              <div className="cyber-card h-auto">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Apple Mail</h3>
                <ol className="list-decimal pl-5 space-y-3 text-slate-300 text-[15px]">
                  <li>Open the email message.</li>
                  <li>Click on <strong className="text-white">"View"</strong> in the top menu.</li>
                  <li>Select <strong className="text-white">"Message"</strong> and then <strong className="text-white">"All Headers"</strong>.</li>
                  <li>Copy all the header information.</li>
                  <li>Paste into the analyzer below.</li>
                </ol>
                <div className="mt-6 border-t border-slate-800 pt-4">
                  <a
                    href="https://support.apple.com/guide/mail/view-message-headers-mlhlp1065/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 inline-flex items-center text-sm font-semibold transition-colors"
                  >
                    Apple Mail Help <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="yahoo" className="premium-tabs-content">
              <div className="cyber-card h-auto">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Yahoo Mail</h3>
                <ol className="list-decimal pl-5 space-y-3 text-slate-300 text-[15px]">
                  <li>Open the email message.</li>
                  <li>Click the three dots (More) in the top-right.</li>
                  <li>Select <strong className="text-white">"View raw message"</strong>.</li>
                  <li>Copy all the text.</li>
                  <li>Paste into the analyzer below.</li>
                </ol>
                <div className="mt-6 border-t border-slate-800 pt-4">
                  <a
                    href="https://help.yahoo.com/kb/SLN5060.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 inline-flex items-center text-sm font-semibold transition-colors"
                  >
                    Yahoo Mail Help <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Analyzer Form Section */}
        <section id="analyze" className="scroll-mt-24">
          <div className="cyber-card h-auto max-w-3xl mx-auto box-glow border-purple-500/20">
            <h2 className="text-2xl font-semibold mb-2 text-slate-100">Analyze Email Header</h2>
            <p className="text-slate-400 mb-6 text-[15px]">
              Paste the complete email header text below to get a detailed breakdown of routing information,
              authentication status, and potential security issues.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <textarea
                  name="header"
                  className="analyzer-textarea w-full h-64 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="Paste your email header here..."
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="btn-gradient flex items-center gap-2 px-8 py-3"
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

            <div className="mt-8 text-center text-sm text-slate-400 border-t border-slate-800/80 pt-6">
              <p>Your email headers are analyzed securely and are not stored on our servers.</p>
              <div className="mt-3">
                <Link href="/sample" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors underline decoration-cyan-400/30 underline-offset-4">
                  View a sample analysis
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="scroll-mt-24 max-w-3xl mx-auto">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <Accordion
            type="single"
            collapsible
            className="faq-accordion"
          >
            <AccordionItem value="item-1" className="faq-item">
              <AccordionTrigger className="faq-trigger-btn">
                What is an email header?
              </AccordionTrigger>
              <AccordionContent className="faq-content-container">
                Email headers contain metadata about the email, including the sender, recipient, path the email took to
                get to you, and authentication results. This information is typically hidden from view but contains
                valuable data for verifying the legitimacy of an email.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="faq-item">
              <AccordionTrigger className="faq-trigger-btn">
                Why should I analyze email headers?
              </AccordionTrigger>
              <AccordionContent className="faq-content-container">
                Analyzing email headers helps you verify if an email is legitimate or potentially fraudulent. It can
                reveal if an email was spoofed, if it came from a suspicious source, or if it failed authentication
                checks. This is particularly useful for identifying phishing attempts.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="faq-item">
              <AccordionTrigger className="faq-trigger-btn">
                What is SPF, DKIM, and DMARC?
              </AccordionTrigger>
              <AccordionContent className="faq-content-container">
                <p className="mb-2">
                  <strong className="text-white">SPF (Sender Policy Framework)</strong>: Verifies that the sending server is authorized to send
                  emails for the domain.
                </p>
                <p className="mb-2">
                  <strong className="text-white">DKIM (DomainKeys Identified Mail)</strong>: Adds a digital signature to verify the email
                  wasn't altered in transit.
                </p>
                <p>
                  <strong className="text-white">DMARC (Domain-based Message Authentication, Reporting, and Conformance)</strong>: Combines SPF
                  and DKIM to provide instructions on how to handle emails that fail authentication.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="faq-item">
              <AccordionTrigger className="faq-trigger-btn">
                Is my email header data secure?
              </AccordionTrigger>
              <AccordionContent className="faq-content-container">
                Yes. Your email headers are processed locally in your browser and are not stored on our servers. The
                only external API call made is to check IP reputation, which only sends the IP address, not the full
                header or any personal information.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="faq-item">
              <AccordionTrigger className="faq-trigger-btn">
                What should I do if I find a suspicious email?
              </AccordionTrigger>
              <AccordionContent className="faq-content-container">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Do not click on any links or download any attachments.</li>
                  <li>Do not reply to the email or provide any personal information.</li>
                  <li>Report the email as spam or phishing in your email client.</li>
                  <li>If it's a work email, notify your IT department.</li>
                  <li>
                    If it appears to be from a company you do business with, contact them directly through their
                    official website or phone number (not from the email).
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Email Security Tips Section */}
        <section className="scroll-mt-24 max-w-4xl mx-auto">
          <div className="section-label">RECOMMENDATIONS</div>
          <h2 className="section-title">Email Security Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="cyber-card h-auto">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-100">Warning Signs</h3>
                  <ul className="space-y-2 text-slate-300 text-sm list-disc pl-4">
                    <li>Sender email doesn't match the company they claim to be from.</li>
                    <li>Urgent requests for personal information or payment.</li>
                    <li>Unexpected attachments or requests to enable macros.</li>
                    <li>Poor grammar or spelling errors.</li>
                    <li>Hovering over links shows suspicious URLs.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="cyber-card h-auto">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <Shield className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-100">Best Practices</h3>
                  <ul className="space-y-2 text-slate-300 text-sm list-disc pl-4">
                    <li>Use strong, unique passwords for email accounts.</li>
                    <li>Enable two-factor authentication.</li>
                    <li>Be cautious with unexpected emails, even from known contacts.</li>
                    <li>Verify requests for sensitive information through other channels.</li>
                    <li>Keep your email client and security software updated.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

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
