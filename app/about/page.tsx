"use client"

import Link from "next/link"
import { ArrowLeft, Mail, Shield, Search } from "lucide-react"

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold mb-6 text-slate-100">About Email Header Analyzer</h1>

          <div className="prose prose-invert prose-cyber max-w-none space-y-6">
            <p className="text-lg text-slate-300">
              Email Header Analyzer was created to help individuals and organizations verify the authenticity of emails
              and identify potential security threats.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              In an era where phishing and email-based attacks are increasingly sophisticated, we believe that everyone
              should have access to tools that can help them identify suspicious emails. Our mission is to make email
              header analysis accessible and understandable to all users, regardless of their technical expertise.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-purple-400 mb-2">Header Analysis</h3>
                <p className="text-xs text-slate-400">
                  We parse and analyze email headers to extract authentication information, routing details, and
                  metadata.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-cyan-400 mb-2">Security Verification</h3>
                <p className="text-xs text-slate-400">
                  We check SPF, DKIM, and DMARC authentication to verify the email's legitimacy.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-blue-400 mb-2">Threat Detection</h3>
                <p className="text-xs text-slate-400">
                  We identify potential threats by checking IP reputation and analyzing email routing patterns.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">Privacy First</h2>
            <p className="text-slate-300 leading-relaxed">
              We built Email Header Analyzer with privacy as a core principle. We do not store your email headers or any
              personal information. All analysis is performed locally in your browser, ensuring your data remains
              private.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">Open Source</h2>
            <p className="text-slate-300 leading-relaxed">
              We believe in transparency and community collaboration. Our tool is open source, allowing security
              researchers and developers to review our code, suggest improvements, and contribute to making email safer
              for everyone.
            </p>

            <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-800 pb-2">Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              We welcome your feedback, questions, and suggestions. Please reach out to us at{" "}
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
