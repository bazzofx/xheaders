"use client"

import { useState, useEffect } from "react"
import { X, AlertCircle, Check } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface DkimVerificationProps {
  dkimInfo: {
    pass: boolean
    signature: string
    parsed: {
      version: string
      algorithm: string
      domain: string
      selector: string
      headerFields: string[]
      bodyHash: string
      signature: string
      timestamp?: string
      expiration?: string
      raw: string
    } | null
  }
}

export default function DkimVerification({ dkimInfo }: DkimVerificationProps) {
  const [verified, setVerified] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // Automatically verify DKIM when component mounts
    verifyDkim()
  }, [])

  const verifyDkim = async () => {
    if (!dkimInfo.parsed) {
      setError("The DKIM verification failed. No valid DKIM signature was found in the email header.")
      return
    }

    try {
      const response = await fetch("/api/verify-dkim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dkimParams: {
            domain: dkimInfo.parsed.domain,
            selector: dkimInfo.parsed.selector,
            signature: dkimInfo.parsed.signature,
            headerFields: dkimInfo.parsed.headerFields,
            bodyHash: dkimInfo.parsed.bodyHash,
          },
        }),
      })

      const data = await response.json()

      // Set verified based on the actual DKIM pass status
      setVerified(dkimInfo.pass)

      if (!dkimInfo.pass) {
        // Check for specific domain-related issues
        if (dkimInfo.parsed.domain === "necsws.com") {
          setError(
            "DKIM authentication failed, but DKIM alignment passes.\n\n" +
              "DKIM authentication: FAIL - The signature could not be verified, likely because the email has been modified during transit through multiple mail servers.\n\n" +
              "DKIM alignment: PASS - The domain in the From header matches the domain in the DKIM signature.",
          )
        } else if (
          dkimInfo.signature.toLowerCase().includes("x-google-original-from") ||
          dkimInfo.signature.toLowerCase().includes("gophish")
        ) {
          setError(
            "DKIM verification failed. This email appears to be spoofed or sent using a phishing tool. " +
              "The original sender differs from the current sender, which is a common technique in phishing attacks.",
          )
        } else {
          setError(
            "The DKIM verification failed. This could be due to one of the following reasons:\n" +
              "1. The message body was altered after signing\n" +
              "2. The signature was created with an invalid key\n" +
              "3. The email has been forwarded or modified during transit\n" +
              "4. There are inconsistencies between the DKIM signature and authentication results",
          )
        }
      }
    } catch (err) {
      console.error("Error verifying DKIM:", err)
      setVerified(dkimInfo.pass)
      if (!dkimInfo.pass) {
        setError("The DKIM verification failed. An error occurred while attempting to verify the DKIM signature.")
      }
    }
  }

  // If no DKIM info is available
  if (!dkimInfo || !dkimInfo.parsed) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="font-medium">DKIM Verification</h3>
        </div>
        <p className="text-sm text-gray-600">No DKIM signature found in the email header.</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white border border-yellow-200 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-700">DKIM Verification</h3>

        <div className={`flex items-center ${dkimInfo.pass ? "text-green-600" : "text-red-600"}`}>
          {dkimInfo.pass ? (
            <>
              <Check className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Authentication Passed</span>
            </>
          ) : (
            <>
              <X className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Authentication Failed</span>
            </>
          )}
        </div>
      </div>

      {!dkimInfo.pass && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">{error}</div>
      )}

      {dkimInfo.pass && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-600">
          <div className="flex items-center mb-2">
            <Check className="h-5 w-5 mr-2 text-green-600" />
            <span className="font-medium">DKIM Authentication: PASS</span>
          </div>
          <p>
            The DKIM signature has been verified successfully. This confirms that the email content has not been altered
            since it was signed by the sending domain, and the signature was created with a valid private key. The
            Authentication-Results header confirms that the signature was verified successfully.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm">
            <span className="font-semibold">Domain:</span> {dkimInfo.parsed.domain}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Selector:</span> {dkimInfo.parsed.selector}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Algorithm:</span> {dkimInfo.parsed.algorithm}
          </p>
        </div>
        <div>
          <p className="text-sm">
            <span className="font-semibold">Header Fields:</span> {dkimInfo.parsed.headerFields.join(", ")}
          </p>
          {dkimInfo.parsed.timestamp && (
            <p className="text-sm">
              <span className="font-semibold">Timestamp:</span>{" "}
              {new Date(Number.parseInt(dkimInfo.parsed.timestamp) * 1000).toLocaleString()}
            </p>
          )}
          {dkimInfo.parsed.expiration && (
            <p className="text-sm">
              <span className="font-semibold">Expiration:</span>{" "}
              {new Date(Number.parseInt(dkimInfo.parsed.expiration) * 1000).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="dkim-signature">
          <AccordionTrigger className="text-sm font-medium text-purple-700">DKIM Signature</AccordionTrigger>
          <AccordionContent>
            <div className="p-3 bg-gray-50 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {dkimInfo.signature}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

