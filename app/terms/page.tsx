"use client"

import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col justify-between">
      <div className="bg-overlay" />

      {/* Sticky Navbar */}
      <header className="sticky-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Shield className="h-6 w-6 text-cyan-400 stroke-[2px]" />
            <span className="font-bold text-lg text-slate-100 tracking-tight">Email Header Analyzer</span>
          </div>
          <div className="nav-cta">
            <Link href="/" className="nav-cta-btn">Back to Home</Link>
          </div>
        </div>
      </header>

      <main className="content-container flex-grow py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>

        <div className="max-w-3xl mx-auto cyber-card h-auto box-glow border-slate-800">
          <h1 className="text-3xl font-bold mb-2 text-slate-100">Terms of Service</h1>
          <p className="text-sm text-slate-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert prose-cyber max-w-none space-y-6 text-slate-300 leading-relaxed">
            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Email Header Analyzer service, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the service.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">2. Description of Service</h2>
            <p>
              Email Header Analyzer provides tools to analyze email headers for authentication status, routing
              information, and potential security issues. The service is provided "as is" without warranties of any
              kind.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">3. Use of the Service</h2>
            <p>
              You agree to use the service only for lawful purposes and in accordance with these Terms. You are
              responsible for ensuring that you have the right to analyze any email headers you submit.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">4. Privacy</h2>
            <p>
              Your use of the service is also governed by our Privacy Policy, which is incorporated into these Terms by
              reference.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">5. Limitations of Liability</h2>
            <p>
              The Email Header Analyzer service is provided for informational purposes only. We make no guarantees about
              the accuracy or completeness of the analysis. We are not responsible for any decisions or actions taken
              based on the information provided by the service.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by
              posting the new Terms on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">7. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:support@emailheaderanalyzer.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                support@emailheaderanalyzer.com
              </a>.
            </p>
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
