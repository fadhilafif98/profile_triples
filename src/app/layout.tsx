import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import SmoothScroll from "@/components/smooth-scroll"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "tripleS | Fanmade Website",
  description: "The fanmade website of triples, a 24-member girl group “the idol of all possibilities“. ",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <SmoothScroll>
            <div className="flex flex-col min-h-screen overflow-x-hidden">
              <Navigation />
              <main className="flex-grow">{children}</main>
              <Footer />
              <BackToTop />
            </div>
            <Analytics />
            <SpeedInsights />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}