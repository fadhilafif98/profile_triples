"use client"

import { albums } from "@/utils/albums"
import Image from "next/image"
import { FaSpotify } from "react-icons/fa"
import { ArrowUp } from "lucide-react"

export default function AlbumsClient() {
  return (
    <div className="bg-[#050505] text-white pt-24 pb-28 selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2 font-mono">[ CHRONOLOGICAL ARCHIVE ]</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Official Discography
          </h1>
          <p className="text-sm md:text-base text-zinc-400 mt-4 max-w-3xl leading-relaxed">
            The complete release history of tripleS and its Dimensions, featuring all full-length albums, mini albums, and unit singles in chronological order.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline center line */}
          <div className="hidden sm:block absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-zinc-800"></div>

          {/* Albums */}
          <div className="space-y-12 md:space-y-20">
            {albums.map((album, index) => (
              <div key={album.id} className="relative">
                {/* Timeline dot */}
                <div className="hidden sm:block absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-[32px] w-3 h-3 rounded-full bg-white border-2 border-black z-10"></div>

                {/* Album content */}
                <div
                  className={`flex flex-col sm:flex-row ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-4 md:gap-8 items-start sm:items-center`}
                >
                  {/* Date */}
                  <div
                    className={`w-full sm:w-[80px] md:w-1/2 ${
                      index % 2 === 0 ? "sm:text-right sm:pr-8 md:pr-12" : "sm:text-left sm:pl-8 md:pl-12"
                    } mb-2 sm:mb-0`}
                  >
                    <div className="inline-block sm:block px-3 py-1 sm:p-0 rounded bg-zinc-900 sm:bg-transparent text-xs sm:text-base md:text-lg font-mono font-medium text-zinc-400">
                      {album.releaseDate}
                    </div>
                  </div>

                  {/* Album details */}
                  <div
                    className={`w-full sm:flex-1 md:w-1/2 ${index % 2 === 0 ? "sm:pl-8 md:pl-12" : "sm:pr-8 md:pr-12"}`}
                  >
                    <div className="bg-zinc-900/40 p-6 md:p-7 rounded-3xl border border-zinc-800 hover:border-zinc-600 transition-all">
                      <div className="flex flex-col sm:flex-row gap-5 md:gap-6 items-start">
                        {/* Album cover */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
                          <Image
                            src={album.cover || "/placeholder.svg"}
                            alt={album.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                            RELEASE #{String(album.id).padStart(2, "0")}
                          </span>
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 truncate">
                            {album.title}
                          </h3>
                          <p className="text-xs md:text-sm text-zinc-400 mb-4 line-clamp-3 leading-relaxed">
                            {album.description}
                          </p>
                          <a
                            href={album.spotifyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <FaSpotify className="h-4 w-4" />
                            Stream on Spotify
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to top button */}
        <div className="text-center mt-20">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 px-5 py-2.5 rounded-full text-zinc-300 text-xs font-mono uppercase tracking-wider hover:bg-zinc-800 hover:text-white transition-all"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
