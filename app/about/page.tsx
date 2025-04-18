import Link from "next/link"
import { ArrowLeft, Mail, Shield, Search } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-purple-700 hover:text-purple-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>

        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-lg border border-yellow-200">
          <h1 className="text-3xl font-bold mb-6 text-purple-800 acme-regular">About Email Header Analyzer</h1>

          <div className="prose prose-purple max-w-none">
            <p className="text-lg text-gray-700">
              Email Header Analyzer was created to help individuals and organizations verify the authenticity of emails
              and identify potential security threats.
            </p>

            <h2 className="font-semibold text-purple-700 acme-regular">Our Mission</h2>
            <p>
              In an era where phishing and email-based attacks are increasingly sophisticated, we believe that everyone
              should have access to tools that can help them identify suspicious emails. Our mission is to make email
              header analysis accessible and understandable to all users, regardless of their technical expertise.
            </p>

            <h2 className="font-semibold text-purple-700 acme-regular">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-700 acme-regular">Header Analysis</h3>
                <p className="text-sm text-gray-600">
                  We parse and analyze email headers to extract authentication information, routing details, and
                  metadata.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-700 acme-regular">Security Verification</h3>
                <p className="text-sm text-gray-600">
                  We check SPF, DKIM, and DMARC authentication to verify the email's legitimacy.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-700 acme-regular">Threat Detection</h3>
                <p className="text-sm text-gray-600">
                  We identify potential threats by checking IP reputation and analyzing email routing patterns.
                </p>
              </div>
            </div>

            <h2 className="font-semibold text-purple-700 acme-regular">Privacy First</h2>
            <p>
              We built Email Header Analyzer with privacy as a core principle. We do not store your email headers or any
              personal information. All analysis is performed locally in your browser, ensuring your data remains
              private.
            </p>

            <h2 className="font-semibold text-purple-700 acme-regular">Open Source</h2>
            <p>
              We believe in transparency and community collaboration. Our tool is open source, allowing security
              researchers and developers to review our code, suggest improvements, and contribute to making email safer
              for everyone.
            </p>

            <h2 className="font-semibold text-purple-700 acme-regular">Contact Us</h2>
            <p>
              We welcome your feedback, questions, and suggestions. Please reach out to us at
              support@emailheaderanalyzer.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

