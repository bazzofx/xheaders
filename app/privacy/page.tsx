"use client"

import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold mb-2 text-slate-100">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert prose-cyber max-w-none space-y-6 text-slate-300 leading-relaxed">
            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">Information We Collect</h2>
            <p>
              Email Header Analyzer is designed with privacy in mind. We do not store your email headers or any personal
              information contained within them. All analysis is performed locally in your browser.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">IP Reputation Checks</h2>
            <p>
              When you analyze an email header, we may send IP addresses found in the header to third-party reputation
              services to check if they are associated with malicious activity. Only the IP addresses are sent, not the
              full header or any personal information.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">Cookies and Analytics</h2>
            <p>
              We use minimal cookies that are necessary for the website to function. We may use anonymous analytics to
              understand how users interact with our service, but this data cannot be used to identify you personally.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">Data Security</h2>
            <p>
              Since we do not store your email headers or personal information, there is no risk of this data being
              compromised. Your data remains on your device and is not transmitted to our servers except as described
              above.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
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
