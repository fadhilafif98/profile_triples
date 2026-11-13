"use client"

import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#08080A] text-zinc-950 dark:text-[#F4F4F6] flex flex-col items-center justify-center px-4 selection:bg-[#D4FF00] selection:text-black transition-colors">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-[#D4FF00]" aria-hidden="true" />
          <span>404 &bull; Dimension Not Found</span>
        </div>

        <h1 className="text-8xl md:text-9xl font-display font-black tracking-tight text-zinc-950 dark:text-white">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            The member profile, Dimension, or release you are looking for could not be found.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-primary btn-magnetic"
          >
            <Home className="h-4 w-4" />
            <span>Home Directory</span>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
        </div>
      </div>
    </div>
  )
}