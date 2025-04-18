import type React from "react"
import "@/app/globals.css"
import { Inter, Acme } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import FlyingEmails from "@/components/flying-emails"

const inter = Inter({ subsets: ["latin"] })
const acme = Acme({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-acme",
})

export const metadata = {
  title: "Email Header Analyzer",
  description: "Analyze email headers for authentication status and security issues",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${acme.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* Flying emails at the root level */}
          <FlyingEmails />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

