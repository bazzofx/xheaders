"use client"

import { usePathname } from "next/navigation"
import FlyingEmailIcon from "./flying-email-icon"
import FlyingBadEmailIcon from "./flying-bad-email-icon"

export default function FlyingEmails() {
  const pathname = usePathname()

  // Only show flying emails on the home page
  if (pathname !== "/") {
    return null
  }

  return (
    <div
      id="flying-emails-container"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {/* Good emails */}
      {[...Array(3)].map((_, index) => (
        <FlyingEmailIcon key={`good-${index}`} index={index} />
      ))}

      {/* Bad email - just one instance */}
      <FlyingBadEmailIcon />
    </div>
  )
}

