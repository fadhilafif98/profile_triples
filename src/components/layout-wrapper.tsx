"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Add a check to ensure pathname is not null
  const isAdminPage = (pathname?.startsWith("/admin") ?? false) || pathname === "/admin-login"

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navigation />}
      <main className={`flex-grow ${isAdminPage ? "" : ""}`}>{children}</main>
      {!isAdminPage && <Footer />}
    </div>
  )
}