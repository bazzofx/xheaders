export interface DkimSignature {
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
}

export function parseDkimSignature(dkimHeader: string): DkimSignature | null {
  if (!dkimHeader) return null

  try {
    // Remove "DKIM-Signature:" prefix if present
    const dkimContent = dkimHeader.replace(/^DKIM-Signature:\s*/i, "")

    // Split the signature into parts
    const parts = dkimContent.split(";").map((part) => part.trim())

    const signature: Partial<DkimSignature> = {
      raw: dkimHeader,
    }

    // Parse each part
    for (const part of parts) {
      const [key, value] = part.split("=").map((s) => s.trim())

      if (!key || !value) continue

      switch (key.toLowerCase()) {
        case "v":
          signature.version = value
          break
        case "a":
          signature.algorithm = value
          break
        case "d":
          signature.domain = value
          break
        case "s":
          signature.selector = value
          break
        case "h":
          signature.headerFields = value.split(":").map((h) => h.trim())
          break
        case "bh":
          signature.bodyHash = value
          break
        case "b":
          signature.signature = value
          break
        case "t":
          signature.timestamp = value
          break
        case "x":
          signature.expiration = value
          break
      }
    }

    // Check if we have the minimum required fields
    if (signature.domain && signature.selector && signature.signature) {
      return signature as DkimSignature
    }

    return null
  } catch (error) {
    console.error("Error parsing DKIM signature:", error)
    return null
  }
}

export function extractDkimSignature(rawHeader: string): string | null {
  const dkimMatch = rawHeader.match(/DKIM-Signature:\s*(.*?)(?=\n\S|$)/is)
  return dkimMatch ? dkimMatch[1].trim() : null
}

