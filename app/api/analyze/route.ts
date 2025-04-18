import { type NextRequest, NextResponse } from "next/server"
import { parseEmailHeader } from "@/lib/email-parser"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const emailHeader = formData.get("emailHeader") as string

    if (!emailHeader) {
      return NextResponse.json({ error: "Email header is required" }, { status: 400 })
    }

    try {
      const parsedHeader = parseEmailHeader(emailHeader)
      return NextResponse.json({ data: parsedHeader })
    } catch (parseError) {
      console.error("Error parsing email header:", parseError)
      return NextResponse.json(
        {
          error: "Failed to parse email header",
          details: parseError instanceof Error ? parseError.message : String(parseError),
        },
        { status: 422 },
      )
    }
  } catch (error) {
    console.error("Error analyzing email header:", error)
    return NextResponse.json(
      { error: "Failed to analyze email header", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

