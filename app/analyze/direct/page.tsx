"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { parseEmailHeader } from "@/lib/email-parser"

export default function DirectAnalyzePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Check if we came from the form
      const source = searchParams.get("source")

      if (source !== "form") {
        // If not from form, redirect to home
        router.push("/")
        return
      }

      // Get the header from sessionStorage
      const headerText = sessionStorage.getItem("emailHeader")

      if (!headerText) {
        // If no header is provided, redirect to home
        router.push("/")
        return
      }

      // Process the header directly (no URL encoding/decoding)
      try {
        // Parse the header
        const parsedData = parseEmailHeader(headerText)

        // Store the parsed data in sessionStorage
        sessionStorage.setItem("parsedHeaderData", JSON.stringify(parsedData))

        // Redirect to the results page
        router.push("/analyze/results")
      } catch (parseError) {
        console.error("Error parsing header:", parseError)
        setError("Failed to analyze the email header. Please try again with a different header.")
        setLoading(false)
      }
    } catch (err) {
      console.error("Error in direct analyze page:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50 flex items-center justify-center">
        <div className="text-red-600 text-xl p-4 bg-white rounded-lg shadow-md">
          {error}
          <div className="mt-4">
            <button onClick={() => router.push("/")} className="px-4 py-2 bg-purple-600 text-white rounded-md">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50 flex items-center justify-center">
      <div className="text-purple-700 text-xl">Analyzing email header...</div>
    </div>
  )
}

