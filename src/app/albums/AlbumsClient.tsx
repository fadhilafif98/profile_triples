"use client"

import { albums } from "@/utils/albums"
import Image from "next/image"
import { FaSpotify } from "react-icons/fa"
import { ArrowUp } from "lucide-react"

export default function AlbumsClient() {
  return (
    <div className="bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-white pt-24 pb-28 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">[ CHRONOLOGICAL ARCHIVE ]</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-pretendard">
            Official Discography
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-4 max-w-3xl leading-relaxed">
            The complete release history of tripleS and its Dimensions, featuring all full-length albums, mini albums, and unit singles in chronological order.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline center line (desktop only) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-zinc-200 dark:bg-zinc-800"></div>

          {/* Albums */}
          <div className="space-y-8 md:space-y-16">
            {albums.map((album, index) => (
              <div key={album.id} className="relative">
                {/* Timeline dot (desktop only) */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-[32px] w-3 h-3 rounded-full bg-zinc-900 dark:bg-white border-2 border-white dark:border-black z-10"></div>

                {/* Album content */}
                <div
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-3 md:gap-8 items-start md:items-center`}
                >
                  {/* Date */}
                  <div
                    className={`w-full md:w-1/2 ${
                      index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"
                    }`}
                  >
                    <div className="inline-block px-3 py-1 md:p-0 rounded-full bg-zinc-100 dark:bg-zinc-900 md:bg-transparent md:dark:bg-transparent border border-zinc-200 dark:border-zinc-800 md:border-none text-xs md:text-lg font-mono font-semibold text-zinc-800 dark:text-zinc-300 md:text-zinc-500 md:dark:text-zinc-400">
                      {album.releaseDate}
                    </div>
                  </div>

                  {/* Album details */}
                  <div
                    className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}
                  >
                    <div className="bg-white dark:bg-zinc-900/40 p-6 md:p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm dark:shadow-none transition-all">
                      <div className="flex flex-col sm:flex-row gap-5 md:gap-6 items-start">
                        {/* Album cover */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shadow-sm">
                          <Image
                            src={album.cover || "/placeholder.svg"}
                            alt={album.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {album.type && (
                              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                                [ {album.type} ]
                              </span>
                            )}
                            {album.unit && (
                              <span className="inline-block px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono text-zinc-800 dark:text-zinc-300 uppercase tracking-wider">
                                {album.unit}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2 truncate font-pretendard">
                            {album.title}
                          </h3>
                          <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3 leading-relaxed">
                            {album.description}
                          </p>
                          <a
                            href={album.spotifyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-semibold"
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
            className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 rounded-full text-zinc-700 dark:text-zinc-300 text-xs font-mono uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white shadow-sm transition-all"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
