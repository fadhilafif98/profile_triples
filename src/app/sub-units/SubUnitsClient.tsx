"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Search, Sparkles, Layers, LayoutGrid, List } from "lucide-react"
import { subUnits } from "@/utils/sub-units"

type CategoryFilter = "All" | "Main Dimension" | "msnz Project" | "Special & Genre" | "Introductory" | "Japan"

export default function SubUnitsClient() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "detailed">("detailed")

  const categories: { label: string; value: CategoryFilter; count: number }[] = [
    { label: "All Units", value: "All", count: subUnits.length },
    { label: "Main Dimensions", value: "Main Dimension", count: subUnits.filter(u => u.category === "Main Dimension").length },
    { label: "msnz Project", value: "msnz Project", count: subUnits.filter(u => u.category === "msnz Project").length },
    { label: "Special & Genre", value: "Special & Genre", count: subUnits.filter(u => u.category === "Special & Genre").length },
    { label: "Introductory", value: "Introductory", count: subUnits.filter(u => u.category === "Introductory").length },
    { label: "Japan", value: "Japan", count: subUnits.filter(u => u.category === "Japan").length },
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
    <div className="bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-white pt-24 pb-28 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. Page Header ── */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-mono">[ GRAVITY & DIMENSIONS ]</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-pretendard text-zinc-900 dark:text-white">
            Sub-Units & Dimensions
          </h1>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 mt-4 max-w-3xl leading-relaxed">
            tripleS operates through dynamic subunit formations called <span className="text-zinc-900 dark:text-white font-medium">Dimensions</span> created through fan-participatory Grand Gravity events. Explore all 15 official sub-units categorized by Fandom Wiki.
          </p>
        </div>

        {/* ── 2. Interactive Control Bar (Category Filter Tabs + Search + View Switcher) ── */}
        <div className="mb-12 space-y-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-4 overflow-x-auto no-scrollbar sm:flex-wrap">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono transition-all shrink-0 ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-bold shadow-md"
                      : "bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 dark:bg-black/20 text-white dark:text-black font-mono" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 font-mono"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search & Layout Toggle Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search unit or member (e.g. YooYeon, S5, Aria)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 shadow-sm transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 hover:text-black dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results count & View Mode Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span>Showing {filteredUnits.length} of {subUnits.length} units</span>
              
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl shadow-sm">
                <button
                  onClick={() => setViewMode("detailed")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "detailed" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-black dark:hover:text-white"
                  }`}
                  title="Detailed Banner View"
                  aria-label="Detailed View"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-black dark:hover:text-white"
                  }`}
                  title="Compact Grid View"
                  aria-label="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Sub-Units Content ── */}
        <AnimatePresence mode="popLayout">
          {filteredUnits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-8"
            >
              <p className="text-zinc-600 dark:text-zinc-400 font-mono text-sm">No sub-units matched &quot;{searchQuery}&quot;.</p>
              <button
                onClick={() => { setSelectedCategory("All"); setSearchQuery("") }}
                className="mt-4 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-mono text-zinc-800 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 shadow-sm"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : viewMode === "detailed" ? (
            /* Detailed Banner Layout */
            <motion.div layout className="space-y-12 sm:space-y-16">
              {filteredUnits.map((unit, index) => (
                <motion.div
                  layout
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className={`grid grid-cols-1 ${
                    index % 2 === 0 ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-[1.2fr_1fr]"
                  } gap-8 lg:gap-12 items-center p-6 sm:p-8 md:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/60 shadow-md dark:shadow-xl`}
                >
                  <div className={`${index % 2 !== 0 && "lg:order-2"}`}>
                    <Link
                      href={`/sub-units/${unit.slug}`}
                      className="block relative group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shadow-md aspect-[16/10] sm:aspect-video w-full"
                    >
                      <Image
                        src={unit.image || "/placeholder.svg"}
                        alt={unit.name}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white">
                          #{String(unit.id).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700 text-zinc-300">
                          {unit.era}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-zinc-300">
                        {unit.debutRelease}
                      </div>
                    </Link>
                  </div>

                  <div className={`${index % 2 !== 0 && "lg:order-1"} space-y-4`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                        <Sparkles className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                        {unit.concept}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                        [ {unit.category} ]
                      </span>
                    </div>

                    <div>
                      <Link href={`/sub-units/${unit.slug}`} className="group/title">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-pretendard group-hover/title:text-amber-600 dark:group-hover/title:text-amber-400 transition-colors">
                          {unit.name}
                        </h2>
                      </Link>
                      <p className="text-xs font-mono text-zinc-500 mt-1">{unit.hangul}</p>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed">
                      {unit.description}
                    </p>

                    <div className="pt-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-2.5">
                        Lineup ({unit.members.length} Members)
                      </span>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {unit.members.map((member, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-wider">
                      <Link
                        href={`/sub-units/${unit.slug}`}
                        className="inline-flex items-center gap-1.5 text-zinc-900 dark:text-white font-bold hover:underline transition-all"
                      >
                        Dimension Dossier <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                      <Link
                        href="/albums"
                        className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                      >
                        Discography <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Compact 3-Column Grid Layout */
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUnits.map((unit, index) => (
                <motion.div
                  layout
                  key={unit.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm dark:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <Link href={`/sub-units/${unit.slug}`} className="block">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <Image
                        src={unit.image || "/placeholder.svg"}
                        alt={unit.name}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-white">
                          #{String(unit.id).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-900/90 text-zinc-300 border border-zinc-700">
                          {unit.era}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">
                        [ {unit.category} ]
                      </span>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-pretendard group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {unit.name}
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                        {unit.description}
                      </p>

                      <div className="pt-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">
                          Members ({unit.members.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {unit.members.map((m, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 truncate max-w-[150px]">{unit.debutRelease}</span>
                      <Link
                        href={`/sub-units/${unit.slug}`}
                        className="text-zinc-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 uppercase tracking-wider font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        Dossier <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 4. Footer Participation Callout ── */}
        <div className="mt-24 p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/40 text-center max-w-4xl mx-auto shadow-sm">
          <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">[ GRAND GRAVITY ]</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-zinc-900 dark:text-white font-pretendard">
            Participate in Future Dimensions
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            New Dimensions are continually voted on by WAVs across the world via COMO voting on Cosmo. Connect to the cosmos and cast your vote for upcoming unit lineups.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all tracking-wide shadow-md"
          >
            Learn How Gravity Works <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
