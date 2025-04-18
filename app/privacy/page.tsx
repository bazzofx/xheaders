import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-purple-700 hover:text-purple-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>

        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-lg border border-yellow-200">
          <h1 className="text-3xl font-bold mb-6 text-purple-800 acme-regular">Privacy Policy</h1>

          <div className="prose prose-purple">
            <p className="text-gray-700">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="acme-regular">Information We Collect</h2>
            <p>
              Email Header Analyzer is designed with privacy in mind. We do not store your email headers or any personal
              information contained within them. All analysis is performed locally in your browser.
            </p>

            <h2 className="acme-regular">IP Reputation Checks</h2>
            <p>
              When you analyze an email header, we may send IP addresses found in the header to third-party reputation
              services to check if they are associated with malicious activity. Only the IP addresses are sent, not the
              full header or any personal information.
            </p>

            <h2 className="acme-regular">Cookies and Analytics</h2>
            <p>
              We use minimal cookies that are necessary for the website to function. We may use anonymous analytics to
              understand how users interact with our service, but this data cannot be used to identify you personally.
            </p>

            <h2 className="acme-regular">Data Security</h2>
            <p>
              Since we do not store your email headers or personal information, there is no risk of this data being
              compromised. Your data remains on your device and is not transmitted to our servers except as described
              above.
            </p>

            <h2 className="acme-regular">Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="acme-regular">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@emailheaderanalyzer.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

