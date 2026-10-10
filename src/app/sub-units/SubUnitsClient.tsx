"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Search, Crown, Boxes } from "lucide-react"
import { subUnits } from "@/lib/sub-units"
import { getMemberById, getMemberColor } from "@/lib/members"
import Breadcrumb from "@/components/breadcrumb"
import WavWordmark from "@/components/wav-wordmark"

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
                <WavWordmark className="h-[0.85em] inline-block align-baseline -mb-[1px]" />
              </span>{" "}
              through Grand Gravity events across each era.
            </p>
          </div>
        </header>

        {/* ── 2. Focused Filter & Search Bar ── */}
        <div className="py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/70 dark:border-white/10 mb-8 sm:mb-12">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
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

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search unit or member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-full bg-zinc-100 dark:bg-white/5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-[#D4FF00] font-mono transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                &times;
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
              className="text-center py-24"
            >
              <Boxes className="w-8 h-8 text-zinc-400 mx-auto mb-3 opacity-60" />
              <p className="text-zinc-500 font-mono text-sm">
                No dimensions found matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
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
            <motion.div layout className="divide-y divide-zinc-200/70 dark:divide-white/10">
              {filteredUnits.map((unit, index) => {
                const parsedMembers = parseUnitMembers(unit.members)
                const isEven = index % 2 === 0

                return (
                  <motion.article
                    layout
                    key={unit.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                    className="py-14 sm:py-20 lg:py-24 first:pt-2 last:pb-12"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
                      
                      {/* Column 1: Cinematic Photography (Clean Editorial, Zero Overlay Clutter) */}
                      <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                        <Link
                          href={`/sub-units/${unit.slug}`}
                          className="group block relative aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-zinc-900 border border-zinc-200/50 dark:border-white/5"
                          aria-label={`View ${unit.name} dimension`}
                        >
                          <Image
                            src={unit.image || "/placeholder.svg"}
                            alt={`${unit.name} concept photo`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            loading="lazy"
                            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
                          />
                        </Link>
                      </div>

                      {/* Column 2: Unboxed Editorial Typography */}
                      <div className={`lg:col-span-6 space-y-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                        {/* Kicker: Index + Era + Concept */}
                        <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-500">
                          <span className="font-display font-black text-sm text-zinc-950 dark:text-[#D4FF00]">
                            #{String(unit.id).padStart(2, "0")}
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                          <span className="uppercase tracking-wider font-semibold text-zinc-700 dark:text-zinc-300">
                            {unit.era}
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                          <span className="text-zinc-500">{unit.concept}</span>
                        </div>

                        {/* Title */}
                        <div>
                          <Link href={`/sub-units/${unit.slug}`} className="inline-block group/title">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] group-hover/title:opacity-75 transition-opacity">
                              {unit.name}
                            </h2>
                          </Link>
                          <p className="text-sm font-mono text-zinc-400 dark:text-zinc-500 mt-1">
                            {unit.hangul}
                          </p>
                        </div>

                        {/* Narrative Storytelling */}
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
                          {unit.description}
                        </p>

                        {/* Lineup & Debut Release */}
                        <div className="pt-1">
                          <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                            <span>Debut: <strong className="text-zinc-950 dark:text-white font-medium">{unit.debutRelease}</strong></span>
                            <span>&bull;</span>
                            <span>Lineup ({parsedMembers.length})</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                            {parsedMembers.map((m, i) => (
                              <Link
                                key={i}
                                href={m.slug ? `/members/${m.slug}` : `/sub-units/${unit.slug}`}
                                className="group/member flex items-center gap-2 pr-3 py-1 rounded-full transition-all hover:bg-zinc-200/50 dark:hover:bg-white/10"
                                title={`View ${m.name}`}
                              >
                                <div
                                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 transition-transform duration-300 group-hover/member:scale-110 shadow-xs"
                                  style={{
                                    boxShadow: `0 0 0 2px ${m.color}`,
                                  }}
                                >
                                  {m.image ? (
                                    <Image
                                      src={`https://i.imgur.com/${m.image}`}
                                      alt={`${m.name} (S${m.id}) avatar`}
                                      fill
                                      sizes="32px"
                                      className="object-cover object-top"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800" />
                                  )}
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="text-xs font-semibold text-zinc-900 dark:text-white group-hover/member:text-black dark:group-hover/member:text-[#D4FF00] flex items-center gap-1">
                                    {m.name}
                                    {m.isLeader && <Crown className="w-2.5 h-2.5 text-amber-500 shrink-0" />}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-400">
                                    S{m.id}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Action Link */}
                        <div className="pt-2">
                          <Link
                            href={`/sub-units/${unit.slug}`}
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-zinc-950 dark:text-[#D4FF00] hover:underline"
                          >
                            <span>View Dimension</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
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
