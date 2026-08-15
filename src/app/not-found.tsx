"use client"

import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4 selection:bg-white selection:text-black">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">
          [ 404 &bull; DIMENSION NOT FOUND ]
        </span>
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-white">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Dimension Out of Reach</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The requested trajectory or profile page is unavailable or has been relocated within the Cosmo system.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-all"
          >
            <Home className="h-4 w-4" /> Home Directory
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-zinc-600 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>
        </div>
      </div>
    </div>
  )
}