"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import {
  Disc3,
  Search,
  ArrowUpRight,
  LayoutGrid,
  LayoutList,
  ArrowRight,
} from "lucide-react"
import { FaSpotify } from "react-icons/fa"
import Breadcrumb from "@/components/breadcrumb"
import WavWordmark from "@/components/wav-wordmark"
import { albumsList } from "@/lib/albums"
import type { Album } from "@/types/album"

type CategoryFilter = "All" | "Full Group" | "Mini Album" | "Studio Album" | "Single" | "Japan"
type ViewMode = "crate" | "spreads"
type SortOrder = "newest" | "oldest"

interface CategoryOption {
  label: string
  value: CategoryFilter
}

const CATEGORIES: CategoryOption[] = [
  { label: "All Releases", value: "All" },
  { label: "Full Group (OT24)", value: "Full Group" },
  { label: "Mini Albums", value: "Mini Album" },
  { label: "Studio Albums", value: "Studio Album" },
  { label: "Singles", value: "Single" },
  { label: "Japan Dimension", value: "Japan" },
]

function getUnitLink(unit?: string): { href: string; label: string } | null {
  if (!unit) return null
  if (unit.includes("OT24") || unit.includes("S1–S10") || unit === "tripleS") {
    return { href: "/members", label: "OT24 Assembly" }
  }
  if (unit.includes("Acid Angel from Asia")) return { href: "/sub-units/acid-angel-from-asia", label: "Acid Angel from Asia" }
  if (unit.includes("+(KR)ystal Eyes")) return { href: "/sub-units/krystal-eyes", label: "+(KR)ystal Eyes" }
  if (unit.includes("ACID EYES")) return { href: "/sub-units/acid-eyes", label: "ACID EYES" }
  if (unit.includes("LOVElution")) return { href: "/sub-units/lovelution", label: "LOVElution" }
  if (unit.includes("EVOLution")) return { href: "/sub-units/evolution", label: "EVOLution" }
  if (unit.includes("NXT")) return { href: "/sub-units/nxt", label: "NXT" }
  if (unit.includes("Aria")) return { href: "/sub-units/aria", label: "Aria" }
  if (unit.includes("Glow")) return { href: "/sub-units/glow", label: "Glow" }
  if (unit.includes("Vision@ry Vision") || unit.includes("Visionary Vision")) return { href: "/sub-units/visionary-vision", label: "Visionary Vision" }
  if (unit.includes("Hatch")) return { href: "/sub-units/hatchi", label: "∞! (Hatch!)" }
  if (unit.includes("msnz")) return { href: "/sub-units", label: "msnz Project" }
  return null
}

function getSpotifyEmbedUrl(url: string): string {
  if (!url) return ""
  const clean = url.replace("https://open.spotify.com/", "https://open.spotify.com/embed/")
  return clean.includes("?")
    ? `${clean}&utm_source=generator&theme=0`
    : `${clean}?utm_source=generator&theme=0`
}

export default function AlbumsClient() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("crate")
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")

  // Featured Hero Record (defaults to newest: LOVE&POP pt. 1)
  const [featuredAlbum, setFeaturedAlbum] = useState<Album>(
    albumsList[albumsList.length - 1]
  )

  // GSAP Kinetic Header Reveal
  const headerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!headerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-title-word",
        { y: 35, opacity: 0, rotateX: -15 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.05, ease: "power4.out" }
      )
      gsap.fromTo(
        ".gsap-subtext",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" }
      )
    }, headerRef)

    return () => ctx.revert()
  }, [])

  // Catalog number lookup (1..18 based on chronological debut order)
  const getCatalogNo = (id: string) => albumsList.findIndex((a) => a.id === id) + 1

  // Smoothly inspect album on the featured deck
  const inspectOnDeck = (album: Album) => {
    setFeaturedAlbum(album)
    const el = document.getElementById("featured-record-section")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Handle URL hash on mount or change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) {
        const found = albumsList.find((a) => a.id === hash)
        if (found) {
          setFeaturedAlbum(found)
          const el = document.getElementById(hash)
          if (el) {
            el.scrollIntoView({ behavior: "smooth" })
          }
        }
      }
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  // Filter & Sort
  const filteredAlbums = useMemo(() => {
    const list = [...albumsList]
    if (sortOrder === "newest") {
      list.reverse()
    }

    return list.filter((album) => {
      // Category filter
      let matchCat = true
      if (selectedCategory === "Full Group") {
        matchCat = Boolean(
          album.unit?.includes("OT24") ||
          album.unit?.includes("S1–S10") ||
          album.unit === "tripleS"
        )
      } else if (selectedCategory === "Studio Album") {
        matchCat = album.type === "Studio Album"
      } else if (selectedCategory === "Mini Album") {
        matchCat = album.type === "Mini Album"
      } else if (selectedCategory === "Single") {
        matchCat = album.type === "Digital Single" || album.type === "Single Album"
      } else if (selectedCategory === "Japan") {
        matchCat = Boolean(album.type?.includes("Japanese") || album.unit?.includes("Hatch"))
      }

      // Live search filter
      const q = searchQuery.toLowerCase().trim()
      const matchQuery =
        !q ||
        album.title.toLowerCase().includes(q) ||
        (album.unit && album.unit.toLowerCase().includes(q)) ||
        (album.type && album.type.toLowerCase().includes(q)) ||
        album.description.toLowerCase().includes(q) ||
        album.releaseDate.toLowerCase().includes(q)

      return matchCat && matchQuery
    })
  }, [selectedCategory, searchQuery, sortOrder])

  const featuredUnitLink = getUnitLink(featuredAlbum.unit)
  const featuredEmbedUrl = getSpotifyEmbedUrl(featuredAlbum.spotifyLink)

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#08080A] text-zinc-900 dark:text-[#F4F4F6] pt-20 sm:pt-24 lg:pt-28 pb-28 sm:pb-36 selection:bg-[#D4FF00] selection:text-black min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Discography" }]} />

        {/* ── 1. Unboxed Editorial Header (Pure Typography & Breathing Room) ── */}
        <header ref={headerRef} className="pt-2 pb-8 sm:pb-12 border-b border-zinc-200/70 dark:border-white/10">
          <div className="space-y-3">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] sm:whitespace-nowrap">
              <span className="gsap-title-word inline-block mr-2 sm:mr-3">Official</span>
              <span className="gsap-title-word font-accent text-4xl xs:text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                Discography
              </span>
            </h1>

            <p className="gsap-subtext text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed pt-1">
              The complete sonic journey of tripleS and its Dimensions, voted into existence by{" "}
              <span className="inline-flex items-baseline align-baseline text-zinc-950 dark:text-[#D4FF00]">
                <WavWordmark className="h-[0.85em] inline-block align-baseline -mb-[1px]" />
              </span>{" "}
              through Grand Gravity events across each era.
            </p>
          </div>
        </header>

        {/* ── 2. Featured Comeback (Unboxed: The Record is the Hero) ── */}
        <section
          id="featured-record-section"
          aria-labelledby="featured-record-title"
          className="py-12 sm:py-16 lg:py-20 border-b border-zinc-200/70 dark:border-white/10 relative scroll-mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left: The Physical Vinyl Record (Unboxed, Floating with Ambient Glow) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-start">
              <div
                className="group relative w-full max-w-[280px] sm:max-w-[380px] md:max-w-[440px] aspect-square select-none cursor-pointer"
                onClick={() => {
                  const el = document.getElementById(featuredAlbum.id)
                  if (el) el.scrollIntoView({ behavior: "smooth" })
                }}
                title="Click to view release in catalog"
              >
                {/* Ambient artwork light blur */}
                <div className="absolute -inset-10 pointer-events-none" aria-hidden="true">
                  <Image
                    src={featuredAlbum.cover}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 380px, 440px"
                    className="object-cover blur-3xl scale-110 opacity-40 dark:opacity-35 saturate-150 transition-all duration-700"
                  />
                </div>

                {/* Tactile Vinyl Disc sliding out */}
                <div
                  aria-hidden="true"
                  className="absolute top-[3%] h-[78%] aspect-square rounded-full left-[8%] group-hover:translate-x-[16%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] z-0"
                  style={{
                    background: "repeating-radial-gradient(circle, #09090B 0 2px, #1C1C21 2px 3px)",
                  }}
                >
                  <div className="absolute inset-[33%] rounded-full overflow-hidden border border-white/20">
                    <Image src={featuredAlbum.cover} alt="" fill sizes="120px" className="object-cover" />
                  </div>
                  <div className="absolute inset-[48.5%] rounded-full bg-zinc-100 dark:bg-[#08080A] border border-white/20" />
                </div>

                {/* Jacket Sleeve (84% width & height, z-10) */}
                <div className="relative z-10 w-[84%] aspect-square rounded-2xl overflow-hidden bg-zinc-200 dark:bg-[#14141B] border border-zinc-200/80 dark:border-white/10 shadow-[0_30px_60px_-24px_rgba(9,9,11,0.45)] transition-transform duration-500 group-hover:scale-102">
                  <Image
                    src={featuredAlbum.cover}
                    alt={`${featuredAlbum.title} album cover`}
                    fill
                    sizes="(max-width: 640px) 250px, (max-width: 1024px) 350px, 400px"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right: Unboxed Editorial Typography & Controls */}
            <div className="lg:col-span-6 min-w-0 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                <span className="uppercase tracking-wider font-semibold text-zinc-950 dark:text-[#D4FF00]">
                  Featured Release
                </span>
                <span>&bull;</span>
                <span>#{String(getCatalogNo(featuredAlbum.id)).padStart(2, "0")}</span>
                <span>&bull;</span>
                <span className="uppercase">{featuredAlbum.type}</span>
              </div>

              <h2
                id="featured-record-title"
                className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-[-0.04em] leading-[1.02] text-zinc-950 dark:text-white"
              >
                {featuredAlbum.title}
              </h2>

              <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                {featuredUnitLink ? (
                  <Link
                    href={featuredUnitLink.href}
                    className="font-semibold text-zinc-950 dark:text-[#D4FF00] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{featuredAlbum.unit}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="font-semibold">{featuredAlbum.unit ?? "tripleS"}</span>
                )}
                <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {featuredAlbum.releaseDate}
                </span>
              </div>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[52ch]">
                {featuredAlbum.description}
              </p>

              <div className="pt-2">
                <a
                  href={featuredAlbum.spotifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-magnetic inline-flex items-center gap-2 rounded-full bg-zinc-950 text-white dark:bg-[#D4FF00] dark:text-black px-6 py-3 text-sm font-bold hover:bg-zinc-800 dark:hover:bg-[#E2FF33] active:scale-[0.98] transition-all shadow-sm"
                >
                  <FaSpotify className="w-4 h-4 text-[#1DB954] dark:text-black" />
                  <span>Stream on Spotify</span>
                  <ArrowUpRight className="btn-arrow w-4 h-4" />
                </a>
              </div>

              {/* Embedded Player */}
              {featuredEmbedUrl && (
                <div className="pt-4 max-w-xl">
                  <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-black shadow-md">
                    <iframe
                      src={featuredEmbedUrl}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title={`${featuredAlbum.title} Spotify player`}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 3. Focused Filter & Search Bar (1:1 with Dimensions) ── */}
        <div className="py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/70 dark:border-white/10 mb-8 sm:mb-12">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-zinc-950 text-white dark:bg-[#D4FF00] dark:text-black font-bold shadow-xs"
                      : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Right Controls: Search, Sort, View Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Live Search */}
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search album or song..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-full bg-zinc-100 dark:bg-white/5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-[#D4FF00] font-mono transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
              className="px-3.5 py-2 rounded-full bg-zinc-100 dark:bg-white/5 text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Toggle release sort order"
            >
              {sortOrder === "newest" ? "Newest" : "Oldest"}
            </button>

            {/* View Mode Toggle: Desktop & Tablet Only (Hidden on Mobile) */}
            <div className="hidden sm:inline-flex items-center p-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200/60 dark:border-white/10 shrink-0">
              <button
                onClick={() => setViewMode("crate")}
                aria-label="Vinyl crate grid view"
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === "crate"
                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
                title="Vinyl crate view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("spreads")}
                aria-label="Editorial spreads view"
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === "spreads"
                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
                title="Editorial spreads view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 4. The Complete Unboxed Discography (No Boxes, Pure Music) ── */}
        <AnimatePresence mode="popLayout">
          {filteredAlbums.length === 0 ? (
            /* Clean Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <Disc3 className="w-8 h-8 text-zinc-400 mx-auto mb-3 opacity-60" />
              <p className="text-zinc-500 font-mono text-sm">
                No releases found matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All")
                  setSearchQuery("")
                  setSortOrder("newest")
                }}
                className="mt-4 text-xs font-mono font-bold text-zinc-950 dark:text-[#D4FF00] underline cursor-pointer"
              >
                Reset filters
              </button>
            </motion.div>
          ) : viewMode === "crate" ? (
            /* ── A. Pure Vinyl Crate Archive (Unboxed 3-Column Luxury Grid) ── */
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 sm:gap-x-14 lg:gap-x-16 xl:gap-x-20 gap-y-14 sm:gap-y-18 lg:gap-y-20"
            >
              {filteredAlbums.map((album, index) => {
                const catNo = getCatalogNo(album.id)
                const unitLink = getUnitLink(album.unit)
                const isSelected = featuredAlbum.id === album.id

                return (
                  <motion.article
                    layout
                    key={album.id}
                    id={album.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                    className="group scroll-mt-28 max-w-[320px] xs:max-w-[360px] sm:max-w-none mx-auto sm:mx-0 w-full"
                  >
                    {/* The Vinyl Sleeve (No Card Box, Floating Pure Physical Record) */}
                    <div
                      onClick={() => inspectOnDeck(album)}
                      className="group/vinyl relative aspect-square w-full mb-5 select-none cursor-pointer"
                      title={`Inspect ${album.title} on deck`}
                    >
                      {/* Vinyl disc (78% diameter, tucked inside 84% sleeve at rest, slides out on hover) */}
                      <div
                        aria-hidden="true"
                        className="absolute top-[3%] h-[78%] aspect-square rounded-full left-[4%] group-hover/vinyl:translate-x-[16%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_16px_36px_-12px_rgba(0,0,0,0.55)] z-0"
                        style={{
                          background:
                            "repeating-radial-gradient(circle, #09090B 0 2px, #1C1C21 2px 3px)",
                        }}
                      >
                        <div className="absolute inset-[33%] rounded-full overflow-hidden border border-white/20">
                          <Image
                            src={album.cover}
                            alt=""
                            fill
                            sizes="100px"
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute inset-[48.5%] rounded-full bg-[#FAFAFA] dark:bg-[#08080A] border border-white/20" />
                      </div>

                      {/* Front Sleeve Jacket (84% width & height, z-10) */}
                      <div
                        className={`relative z-10 w-[84%] aspect-square rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 border ${
                          isSelected
                            ? "border-zinc-950 dark:border-[#D4FF00] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.6)]"
                            : "border-zinc-200/80 dark:border-white/10 shadow-xl"
                        } transition-transform duration-500 group-hover/vinyl:scale-102`}
                      >
                        <Image
                          src={album.cover}
                          alt={`${album.title} album cover`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Unboxed Editorial Typography Beneath */}
                    <div className="space-y-2">
                      {/* Kicker: Catalog Index + Release Date + Type + Active On Deck Pill */}
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-zinc-950 dark:text-[#D4FF00]">
                            #{String(catNo).padStart(2, "0")}
                          </span>
                          <span>&bull;</span>
                          <span>{album.releaseDate.slice(-4)}</span>
                          <span>&bull;</span>
                          <span className="uppercase text-[11px] tracking-wider truncate">{album.type}</span>
                        </div>

                        {isSelected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-950 text-white dark:bg-[#D4FF00] dark:text-black font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] dark:bg-black animate-pulse" />
                            On Deck
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => inspectOnDeck(album)}
                        className="font-display font-black text-xl sm:text-2xl text-zinc-950 dark:text-white tracking-tight cursor-pointer hover:opacity-80 transition-opacity truncate"
                      >
                        {album.title}
                      </h3>

                      {/* Unit */}
                      <div className="text-xs font-mono truncate">
                        {unitLink ? (
                          <Link
                            href={unitLink.href}
                            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-[#D4FF00] hover:underline"
                          >
                            {album.unit}
                          </Link>
                        ) : (
                          <span className="text-zinc-500">{album.unit ?? "tripleS"}</span>
                        )}
                      </div>

                      {/* Description (Consistent height for aligned action buttons) */}
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed min-h-[2.5rem] sm:min-h-[2.75rem]">
                        {album.description}
                      </p>

                      {/* Direct Actions: Unified buttons */}
                      <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-zinc-200/50 dark:border-white/5">
                        <button
                          onClick={() => inspectOnDeck(album)}
                          className="inline-flex items-center gap-1.5 text-zinc-950 dark:text-[#D4FF00] font-bold hover:underline cursor-pointer"
                        >
                          <Disc3 className="w-3.5 h-3.5" />
                          <span>Inspect on Deck</span>
                        </button>

                        <a
                          href={album.spotifyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <FaSpotify className="w-3.5 h-3.5" />
                          <span>Spotify</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          ) : (
            /* ── B. Unboxed Lookbook Spreads (1:1 with Dimensions) ── */
            <motion.div layout className="divide-y divide-zinc-200/70 dark:divide-white/10">
              {filteredAlbums.map((album, index) => {
                const catNo = getCatalogNo(album.id)
                const unitLink = getUnitLink(album.unit)
                const isEven = index % 2 === 0
                const isSelected = featuredAlbum.id === album.id

                return (
                  <motion.article
                    layout
                    key={album.id}
                    id={album.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                    className="py-12 sm:py-16 lg:py-20 first:pt-4 last:pb-12 scroll-mt-28"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
                      {/* Column 1: Unboxed Vinyl Jacket Sleeve */}
                      <div className={`lg:col-span-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                        <div
                          onClick={() => inspectOnDeck(album)}
                          className="group/vinyl relative aspect-square w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] mx-auto select-none cursor-pointer"
                        >
                          {/* Vinyl disc (78% diameter, tucked inside 84% sleeve at rest, slides out on hover) */}
                          <div
                            aria-hidden="true"
                            className="absolute top-[3%] h-[78%] aspect-square rounded-full left-[4%] group-hover/vinyl:translate-x-[16%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] z-0"
                            style={{
                              background:
                                "repeating-radial-gradient(circle, #09090B 0 2px, #1C1C21 2px 3px)",
                            }}
                          >
                            <div className="absolute inset-[33%] rounded-full overflow-hidden border border-white/20">
                              <Image
                                src={album.cover}
                                alt=""
                                fill
                                sizes="120px"
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute inset-[48.5%] rounded-full bg-[#FAFAFA] dark:bg-[#08080A] border border-white/20" />
                          </div>

                          {/* Front Sleeve Jacket (84% width & height) */}
                          <div
                            className={`relative z-10 w-[84%] aspect-square rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 border ${
                              isSelected
                                ? "border-zinc-950 dark:border-[#D4FF00] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.6)]"
                                : "border-zinc-200/80 dark:border-white/10 shadow-2xl"
                            } transition-transform duration-500 group-hover/vinyl:scale-102`}
                          >
                            <Image
                              src={album.cover}
                              alt={`${album.title} album cover`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Unboxed Typography & Lore */}
                      <div className={`lg:col-span-7 space-y-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                        {/* Kicker */}
                        <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-500">
                          <span className="font-display font-black text-sm text-zinc-950 dark:text-[#D4FF00]">
                            #{String(catNo).padStart(2, "0")}
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                          <span className="uppercase tracking-wider font-semibold text-zinc-700 dark:text-zinc-300">
                            {album.releaseDate}
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                          <span className="text-zinc-500 uppercase tracking-wider">{album.type}</span>

                          {isSelected && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-950 text-white dark:bg-[#D4FF00] dark:text-black font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 ml-auto">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] dark:bg-black animate-pulse" />
                              On Deck
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <div>
                          <h2
                            onClick={() => inspectOnDeck(album)}
                            className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            {album.title}
                          </h2>
                          <div className="flex items-center gap-2 text-xs font-mono mt-2">
                            <span className="text-zinc-400">Unit:</span>
                            {unitLink ? (
                              <Link
                                href={unitLink.href}
                                className="font-semibold text-zinc-950 dark:text-[#D4FF00] hover:underline underline-offset-2 inline-flex items-center gap-1"
                              >
                                <span>{album.unit}</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            ) : (
                              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                {album.unit ?? "tripleS"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description Lore */}
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
                          {album.description}
                        </p>

                        {/* Actions */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <a
                            href={album.spotifyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-magnetic inline-flex items-center gap-2 rounded-full bg-zinc-950 text-white dark:bg-[#D4FF00] dark:text-black px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-[#E2FF33] transition-colors shadow-xs"
                          >
                            <FaSpotify className="w-4 h-4 text-[#1DB954] dark:text-black" />
                            <span>Stream on Spotify</span>
                            <ArrowUpRight className="btn-arrow w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => inspectOnDeck(album)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                          >
                            <Disc3 className="w-3.5 h-3.5" />
                            <span>Inspect on Deck</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
