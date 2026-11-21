"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { ArrowUpRight, Search, Crown, Boxes } from "lucide-react"
import { subUnits } from "@/lib/sub-units"
import { getMemberById, getMemberColor, getMemberImageUrl } from "@/lib/members"
import Breadcrumb from "@/components/breadcrumb"
import WavWordmark from "@/components/wav-wordmark"
import DimensionWordmark from "@/components/dimension-wordmark"
import ThemeImage from "@/components/theme-image"
import { useSafeReducedMotion } from "@/lib/a11y"
import { useIsDarkMode } from "@/lib/theme"

type CategoryFilter = "All" | "Main Dimension" | "msnz Project" | "Special & Genre" | "Introductory" | "Japan"

interface ParsedMember {
  entry: string
  id: number
  isLeader: boolean
  name: string
  slug?: string
  image?: string
  color: string
}

function parseUnitMembers(memberStrings: string[]): ParsedMember[] {
  return memberStrings.map((entry) => {
    const match = entry.match(/^S(\d+)/i)
    const id = match ? parseInt(match[1], 10) : 0
    const isLeader = entry.toLowerCase().includes("(leader)")
    const member = id ? getMemberById(id) : undefined
    const color = id ? getMemberColor(id) : "#D4FF00"
    const cleanName = entry.replace(/^S\d+\s*/i, "").replace(/\s*\(leader\)/i, "").trim()

    return {
      entry,
      id,
      isLeader,
      name: member?.name || cleanName,
      slug: member?.slug,
      image: member?.image,
      color,
    }
  })
}

export default function SubUnitsClient() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const shouldReduceMotion = useSafeReducedMotion()
  const isDark = useIsDarkMode()

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: "All Dimensions", value: "All" },
    { label: "Main Dimensions", value: "Main Dimension" },
    { label: "msnz Project", value: "msnz Project" },
    { label: "Special & Genre", value: "Special & Genre" },
    { label: "Introductory", value: "Introductory" },
    { label: "Japan Dimension", value: "Japan" },
  ]

  const filteredUnits = useMemo(() => {
    return subUnits.filter((unit) => {
      const matchCategory = selectedCategory === "All" || unit.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchQuery =
        !query ||
        unit.name.toLowerCase().includes(query) ||
        unit.hangul.toLowerCase().includes(query) ||
        unit.concept.toLowerCase().includes(query) ||
        unit.members.some((m) => m.toLowerCase().includes(query))
      return matchCategory && matchQuery
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#08080A] text-zinc-900 dark:text-[#F4F4F6] pt-20 sm:pt-24 lg:pt-28 pb-28 sm:pb-36 selection:bg-[#D4FF00] selection:text-black min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Dimensions" }]} />

        {/* ── 1. Clean Editorial Header (Zero Vanity Stats / Zero Fluff) ── */}
        <header className="pt-4 pb-10 sm:pb-14 border-b border-zinc-200/70 dark:border-white/10">
          <div className="space-y-3">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] sm:whitespace-nowrap">
              Sub-Units &amp;{" "}
              <span className="font-accent text-4xl xs:text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                Dimensions
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed pt-1">
              Official tripleS modular units voted into existence by{" "}
              <span className="inline-flex items-baseline align-baseline text-zinc-950 dark:text-[#D4FF00]">
                <WavWordmark className="h-[0.85em] inline-block align-baseline -mb-px" />
              </span>{" "}
              through Grand Gravity events across each era.
            </p>
          </div>
        </header>

        {/* ── 2. Focused Filter & Search Bar ── */}
        <div className="py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/70 dark:border-white/10 mb-8 sm:mb-12">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1" role="group" aria-label="Filter dimensions by category">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value
              return (
                <button
                  key={cat.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-zinc-950 text-white dark:bg-[#D4FF00] dark:text-black font-bold"
                      : "text-zinc-600 dark:text-zinc-400 [@media(hover:hover)_and_(pointer:fine)]:hover:text-zinc-950 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:text-white [@media(hover:hover)_and_(pointer:fine)]:hover:bg-zinc-100 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <label htmlFor="sub-units-search" className="sr-only">
              Search dimensions or members
            </label>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" aria-hidden="true" />
            <input
              id="sub-units-search"
              type="search"
              placeholder="Search unit or member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-full bg-zinc-100 dark:bg-white/5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00] font-mono transition-[box-shadow,background-color]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 min-w-6 min-h-6 flex items-center justify-center rounded-full text-xs font-mono text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            )}
          </div>
        </div>

        {/* ── 3. Fluid Lookbook Spreads (Pure Photography & Editorial Lore) ── */}
        <AnimatePresence mode="popLayout">
          {filteredUnits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className="text-center py-24"
            >
              <Boxes className="w-8 h-8 text-zinc-400 mx-auto mb-3 opacity-60" aria-hidden="true" />
              <p className="text-zinc-500 font-mono text-sm">
                No dimensions found matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All")
                  setSearchQuery("")
                }}
                className="mt-4 text-xs font-mono font-bold text-zinc-950 dark:text-[#D4FF00] underline cursor-pointer"
              >
                Reset filters
              </button>
            </motion.div>
          ) : (
            <div className="divide-y divide-zinc-200/80 dark:divide-white/10">
              {filteredUnits.map((unit, index) => {
                const parsedMembers = parseUnitMembers(unit.members)
                const isEven = index % 2 === 0

                return (
                  <article
                    key={unit.id}
                    className="py-14 sm:py-20 lg:py-24 first:pt-2 last:pb-12"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
                      {/* Column 1: Unboxed 3:2 Concept Photography Plate */}
                      <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                        <Link
                          href={`/sub-units/${unit.slug}`}
                          className="group block relative aspect-3/2 rounded-2xl overflow-hidden bg-zinc-200/70 dark:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00] active:scale-[0.99] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none motion-reduce:active:scale-100"
                          aria-label={`View ${unit.name} dimension`}
                        >
                          <Image
                            src={unit.image || "/placeholder.svg"}
                            alt={`${unit.name} concept photo`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            preload={index === 0}
                            fetchPriority={index === 0 ? "high" : undefined}
                            className="object-cover object-center transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                          />
                        </Link>
                      </div>

                      {/* Column 2: Logo-Led Editorial Dossier */}
                      <div className={`lg:col-span-6 space-y-5 min-w-0 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                        {/* Quiet Era + Member Count Context */}
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                          <span className="uppercase tracking-[0.14em] font-semibold text-zinc-950 dark:text-[#D4FF00]">
                            {unit.era}
                          </span>
                          <span aria-hidden="true">/</span>
                          <span className="tabular-nums">{parsedMembers.length} Members</span>
                        </div>

                        {/* Official Dimension Logo & Plaque Subtitle */}
                        <div className="space-y-3">
                          <Link
                            href={`/sub-units/${unit.slug}`}
                            className="block max-w-full group/title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] rounded-sm"
                          >
                            <h2 className="text-zinc-950 dark:text-white transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover/title:text-zinc-600 dark:[@media(hover:hover)_and_(pointer:fine)]:group-hover/title:text-[#D4FF00]">
                              <DimensionWordmark
                                slug={unit.slug}
                                name={unit.name}
                                size="list"
                              />
                            </h2>
                          </Link>

                          <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                              {unit.name}
                            </span>
                            {unit.hangul && (
                              <>
                                <span aria-hidden="true">/</span>
                                <span lang="ko">{unit.hangul}</span>
                              </>
                            )}
                          </p>
                        </div>

                        {/* Narrative Storytelling */}
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-[58ch]">
                          {unit.description}
                        </p>

                        {/* Debut Release & Lineup */}
                        <div className="pt-4 border-t border-zinc-200/80 dark:border-white/10 space-y-3.5">
                          <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span>
                              Debut:{" "}
                              <strong className="text-zinc-950 dark:text-white font-semibold">
                                {unit.debutRelease}
                              </strong>
                            </span>
                            <span aria-hidden="true">/</span>
                            <span>{unit.concept}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                            {parsedMembers.map((m, i) => (
                              <Link
                                key={i}
                                href={m.slug ? `/members/${m.slug}` : `/sub-units/${unit.slug}`}
                                className="group/member flex items-center gap-2 pr-3 py-1 rounded-full transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-zinc-200/60 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/10 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
                              >
                                <div
                                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover/member:scale-105 motion-reduce:transition-none"
                                  style={{
                                    boxShadow: `0 0 0 2px ${m.color}`,
                                  }}
                                >
                                  {m.image ? (
                                    <ThemeImage
                                      src={getMemberImageUrl(m, isDark)}
                                      alt=""
                                      fill
                                      sizes="32px"
                                      className="object-cover object-top"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800" />
                                  )}
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="text-xs font-semibold text-zinc-900 dark:text-white [@media(hover:hover)_and_(pointer:fine)]:group-hover/member:text-zinc-950 dark:[@media(hover:hover)_and_(pointer:fine)]:group-hover/member:text-[#D4FF00] flex items-center gap-1">
                                    {m.name}
                                    {m.isLeader && (
                                      <>
                                        <Crown className="w-2.5 h-2.5 text-amber-500 shrink-0" aria-hidden="true" />
                                        <span className="sr-only"> (Leader)</span>
                                      </>
                                    )}
                                  </span>
                                  <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 tabular-nums">
                                    S{m.id}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Action Link */}
                        <div className="pt-1">
                          <Link
                            href={`/sub-units/${unit.slug}`}
                            className="nav-draw-link group/cta inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] font-bold text-zinc-950 dark:text-[#D4FF00] pb-0.5"
                          >
                            <span>
                              View Dimension
                              <span className="sr-only"> {unit.name}</span>
                            </span>
                            <ArrowUpRight
                              className="h-3.5 w-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover/cta:translate-x-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover/cta:-translate-y-0.5 motion-reduce:transition-none"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
