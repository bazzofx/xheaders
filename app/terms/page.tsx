import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-purple-700 hover:text-purple-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>

        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-lg border border-yellow-200">
          <h1 className="text-3xl font-bold mb-6 text-purple-800">Terms of Service</h1>

          <div className="prose prose-purple">
            <p className="text-gray-700">Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Email Header Analyzer service, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Email Header Analyzer provides tools to analyze email headers for authentication status, routing
              information, and potential security issues. The service is provided "as is" without warranties of any
              kind.
            </p>

            <h2>3. Use of the Service</h2>
            <p>
              You agree to use the service only for lawful purposes and in accordance with these Terms. You are
              responsible for ensuring that you have the right to analyze any email headers you submit.
            </p>

            <h2>4. Privacy</h2>
            <p>
              Your use of the service is also governed by our Privacy Policy, which is incorporated into these Terms by
              reference.
            </p>

            <h2>5. Limitations of Liability</h2>
            <p>
              The Email Header Analyzer service is provided for informational purposes only. We make no guarantees about
              the accuracy or completeness of the analysis. We are not responsible for any decisions or actions taken
              based on the information provided by the service.
            </p>

            <h2>6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by
              posting the new Terms on this page and updating the "Last updated" date.
            </p>

            <h2>7. Contact</h2>
            <p>If you have any questions about these Terms, please contact us at support@emailheaderanalyzer.com.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

