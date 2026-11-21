import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Manrope, Pinyon_Script, JetBrains_Mono } from "next/font/google"
import SmoothScroll from "@/components/smooth-scroll"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import PageTransition from "@/components/page-transition"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: "400",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const viewport: Viewport = {
  colorScheme: "light dark",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://profile-triples.vercel.app"),
  title: "tripleS | Fanmade Website",
  description: "The fanmade website of triples, a 24-member girl group “the idol of all possibilities“. ",
  referrer: "strict-origin-when-cross-origin",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
          integrity="sha384-uR1wgObmx89ZQ4VVXHdzjbDJZ1PvBK01K+E3GebmaBKdZ87qRJvBWPoPbzWeEd5T"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${manrope.variable} ${pinyonScript.variable} ${jetbrainsMono.variable} font-sans antialiased selection:bg-[#D4FF00] selection:text-black`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {/* Skip to Main Content Link for Keyboard / Screen Reader Accessibility (WCAG 2.4.1) */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-zinc-900 focus:text-white dark:focus:bg-white dark:focus:text-black focus:rounded-full focus:shadow-xl focus:font-mono focus:text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-[#D4FF00]"
          >
            Skip to main content
          </a>
          <SmoothScroll>
            <PageTransition />
            <div className="flex flex-col min-h-screen overflow-x-clip">
              <Navigation />
              <main id="main-content" tabIndex={-1} className="grow outline-none">{children}</main>
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