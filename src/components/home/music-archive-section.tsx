"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import SpotifyEmbed from "@/components/spotify-embed"
import type { Album } from "@/types/album"

interface MusicArchiveSectionProps {
  albums: Album[]
}

const yearOf = (releaseDate: string) => releaseDate.slice(-4)

export default function MusicArchiveSection({ albums }: MusicArchiveSectionProps) {
  const [featured, ...rest] = albums
  const crateRef = useRef<HTMLDivElement>(null)
  // Drag state lives in a ref: no re-render per pointer move.
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 })

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !crateRef.current) return
    drag.current = { active: true, moved: false, startX: e.clientX, startScroll: crateRef.current.scrollLeft }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = crateRef.current
    if (!drag.current.active || !el) return
    const dx = e.clientX - drag.current.startX
    if (!drag.current.moved && Math.abs(dx) > 5) {
      drag.current.moved = true
      el.classList.remove("snap-x", "scroll-smooth")
    }
    if (drag.current.moved) el.scrollLeft = drag.current.startScroll - dx
  }

  const endDrag = () => {
    if (!drag.current.active) return
    drag.current.active = false
    crateRef.current?.classList.add("snap-x", "scroll-smooth")
  }

  // Swallow the click that ends a drag so it doesn't navigate.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  if (!featured) return null

  return (
    <section
      aria-labelledby="music-archive-heading"
      className="py-24 sm:py-32 px-5 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-white/10 relative overflow-hidden bg-zinc-100/60 dark:bg-[#08080A]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header: Standardized H2 scale matching Sections 3, 5, 6 */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2
            id="music-archive-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-[-0.04em] text-zinc-950 dark:text-white leading-[1.05]"
          >
            Music{" "}
            <span className="font-accent font-normal tracking-normal text-[1.25em] leading-none text-zinc-950 dark:text-[#D4FF00]">
              Archive
            </span>
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[46ch]">
            Official discography from debut to the latest Gravity comebacks.
          </p>
        </div>

        {/* Now playing: the record is the hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center mb-20 sm:mb-28">
          <Link
            href={`/albums#${featured.id}`}
            aria-label={`View ${featured.title}`}
            className="group relative lg:col-span-6 w-full max-w-[280px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[540px] mx-auto lg:mx-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] focus-visible:ring-offset-4"
          >
            {/* Ambient light taken from the artwork itself, not a generic glow */}
            <div className="absolute -inset-10 pointer-events-none" aria-hidden="true">
              <Image
                src={featured.cover}
                alt=""
                fill
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 460px, 540px"
                className="object-cover blur-3xl scale-110 opacity-40 dark:opacity-35 saturate-150"
              />
            </div>

            {/* Vinyl slides out of the sleeve */}
            <div
              aria-hidden="true"
              className="absolute top-[4%] bottom-[4%] right-0 aspect-square rounded-full translate-x-[8%] group-hover:translate-x-[26%] group-focus-visible:translate-x-[26%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
              style={{
                background: "repeating-radial-gradient(circle, #09090B 0 2px, #1C1C21 2px 3px)",
              }}
            >
              <div className="absolute inset-[33%] rounded-full overflow-hidden">
                <Image src={featured.cover} alt="" fill sizes="120px" className="object-cover" />
              </div>
              <div className="absolute inset-[48.5%] rounded-full bg-zinc-100 dark:bg-[#08080A]" />
            </div>

            <div className="relative w-[88%] aspect-square rounded-md overflow-hidden bg-zinc-200 dark:bg-[#14141B] shadow-[0_30px_60px_-24px_rgba(9,9,11,0.45)]">
              <Image
                src={featured.cover}
                alt={`${featured.title} album cover`}
                fill
                sizes="(max-width: 640px) 250px, (max-width: 1024px) 400px, 480px"
                className="object-cover"
              />
            </div>
          </Link>

          <div className="lg:col-span-6 min-w-0">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
              Latest release
            </p>
            <h3 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-[-0.04em] leading-[1] text-zinc-950 dark:text-white break-words">
              {featured.title}
            </h3>
            <p className="mt-5 text-base text-zinc-700 dark:text-zinc-300">
              {featured.unit ?? "tripleS"}
              <span className="font-mono text-sm text-zinc-500 dark:text-zinc-400 ml-3">
                {featured.type ? `${featured.type}, ` : ""}
                {featured.releaseDate}
              </span>
            </p>
            <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[52ch] line-clamp-3">
              {featured.description}
            </p>
            <Link
              href={`/albums#${featured.id}`}
              className="btn-magnetic mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-950 text-white dark:bg-[#D4FF00] dark:text-black px-6 py-3 text-sm font-bold hover:bg-zinc-800 dark:hover:bg-[#E2FF33] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] focus-visible:ring-offset-2"
            >
              View album
              <ArrowUpRight className="btn-arrow w-4 h-4" aria-hidden="true" />
            </Link>
            <div className="mt-10">
              <SpotifyEmbed />
            </div>
          </div>
        </div>

        {/* Record crate: full catalog, drag or swipe */}
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-zinc-950 dark:text-white">
            Discography
          </h3>
          <Link
            href="/albums"
            className="btn-magnetic nav-draw-link gap-1.5 text-sm font-semibold text-zinc-950 dark:text-[#D4FF00]"
          >
            All {albums.length} releases
            <ArrowUpRight className="btn-arrow w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div
          ref={crateRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
          className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth overscroll-x-contain select-none cursor-grab active:cursor-grabbing pb-4"
          role="list"
          aria-label="tripleS discography"
        >
          {rest.map((album) => (
            <Link
              key={album.id}
              href={`/albums#${album.id}`}
              role="listitem"
              className="group shrink-0 snap-start w-[190px] xs:w-[200px] sm:w-[210px] lg:w-[220px] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] focus-visible:ring-offset-4"
            >
              <div className="relative aspect-square rounded-md overflow-hidden bg-zinc-200 dark:bg-[#14141B] shadow-[0_14px_34px_-16px_rgba(9,9,11,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 motion-reduce:transition-none">
                <Image
                  src={album.cover}
                  alt={`${album.title} album cover`}
                  fill
                  draggable={false}
                  sizes="(max-width: 640px) 200px, 220px"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-zinc-950 dark:text-white truncate">
                {album.title}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                <span className="font-mono">{yearOf(album.releaseDate)}</span>
                {album.unit ? `, ${album.unit}` : ""}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
