"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { SubUnit } from "@/types/sub-unit"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"

interface DimensionsCardStackProps {
  subUnits: SubUnit[]
}

export default function DimensionsCardStack({ subUnits }: DimensionsCardStackProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isPeelingRef = useRef(false)

  // Curate iconic top dimensions for the showcase stack
  const curatedSlugs = useMemo(
    () => [
      "visionary-vision",
      "acid-angel-from-asia",
      "krystal-eyes",
      "lovelution",
      "evolution",
      "glow",
      "hatchi",
    ],
    []
  )

  const showcaseUnits = useMemo(() => {
    const list = curatedSlugs
      .map((slug) => subUnits.find((u) => u.slug === slug))
      .filter((u): u is SubUnit => Boolean(u))

    // Fallback if not all found
    return list.length >= 4 ? list : subUnits.slice(0, 7)
  }, [subUnits, curatedSlugs])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [peelingIndex, setPeelingIndex] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isInView, setIsInView] = useState(false)

  const currentIndexRef = useRef(currentIndex)
  currentIndexRef.current = currentIndex

  const handleNext = useCallback(() => {
    if (isPeelingRef.current) return
    isPeelingRef.current = true
    const activeIdx = currentIndexRef.current
    setPeelingIndex(activeIdx)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseUnits.length)
      setPeelingIndex(null)
      isPeelingRef.current = false
    }, 380)
  }, [showcaseUnits.length])

  const handlePrev = useCallback(() => {
    if (isPeelingRef.current) return
    setCurrentIndex((prev) => (prev - 1 + showcaseUnits.length) % showcaseUnits.length)
  }, [showcaseUnits.length])

  // 1. Intersection Observer: Only auto-advance when section is visible in viewport
  useEffect(() => {
    const target = sectionRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.25 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  // 2. Tab Visibility: Pause when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsInView(false)
      } else if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const inView = rect.top < window.innerHeight && rect.bottom > 0
        setIsInView(inView)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  // 3. Autoplay Loop (4000ms duration per card, paused on hover/touch)
  useEffect(() => {
    if (isHovered || !isInView) return

    const timer = setInterval(() => {
      handleNext()
    }, 4200)

    return () => clearInterval(timer)
  }, [isHovered, isInView, handleNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInView) return
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isInView, handleNext, handlePrev])

  const currentUnit = showcaseUnits[currentIndex]

  return (
    <section
      ref={sectionRef}
      aria-label="Featured tripleS Dimensions"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-white/10 bg-[#fafafa] dark:bg-[#08080A] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* ── Left Column: Editorial Info & Clean Unified Controls ── */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8 relative z-10">
            {/* Editorial Heading */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-[-0.04em] text-zinc-950 dark:text-white leading-[1.05]">
                Featured{" "}
                <span className="font-accent font-normal tracking-normal text-[1.25em] leading-none text-zinc-950 dark:text-[#D4FF00]">
                  Dimensions
                </span>
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md">
                From 4-member debut Acid Angel from Asia to 12-member dance unit Visionary Vision, tripleS dimensions assemble, evolve, and redefine K-pop through Grand Gravity.
              </p>
            </div>

            {/* Streamlined Editorial Pagination & Controls */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-5">
                {/* Counter */}
                <div className="font-mono text-xs tracking-widest font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <span className="text-zinc-950 dark:text-[#D4FF00]">
                    {String(currentIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-zinc-500">
                    {String(showcaseUnits.length).padStart(2, "0")}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 max-w-[140px] h-1 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-950 dark:bg-[#D4FF00] transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / showcaseUnits.length) * 100}%` }}
                  />
                </div>

                {/* Prev / Next Directional Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous dimension"
                    className="w-10 h-10 rounded-full border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#14141B] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-[#D4FF00] hover:border-zinc-400 dark:hover:border-[#D4FF00]/50 transition-all shadow-sm active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next dimension"
                    className="w-10 h-10 rounded-full border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#14141B] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-[#D4FF00] hover:border-zinc-400 dark:hover:border-[#D4FF00]/50 transition-all shadow-sm active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Unit Live Note */}
              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-[#D4FF00] animate-pulse" />
                <span className="truncate">
                  Active Unit: <strong className="text-zinc-900 dark:text-white font-semibold">{currentUnit.name}</strong> &bull; {currentUnit.concept}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <Link
                href="/sub-units"
                className="btn-magnetic inline-flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-[#D4FF00] dark:hover:bg-[#E2FF33] dark:text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <span>Browse All 15 Dimensions</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ── Right Column: Pinned 3D Perspective Card Stack with Member Roster ── */}
          <div
            className="lg:col-span-7 flex items-center justify-center relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <div
              className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] [perspective:1200px]"
              aria-live="polite"
            >
              {showcaseUnits.map((unit, index) => {
                // Calculate position relative to currentIndex
                const offset = (index - currentIndex + showcaseUnits.length) % showcaseUnits.length
                const isPeeling = peelingIndex === index
                const isTop = offset === 0

                // Render only top 4 visible cards to maintain lightweight performance
                if (offset > 3 && !isPeeling) return null

                // Compute exact 3D stack transforms
                let transformStyle = ""
                let zIndex = 30 - offset * 10
                let opacity = 1 - offset * 0.2

                if (isPeeling) {
                  transformStyle = "translate3d(0, -115%, 0) rotate(-14deg) scale(0.95)"
                  opacity = 0
                  zIndex = 40
                } else if (offset === 0) {
                  transformStyle = "translate3d(0, 0, 0) rotate(-1.5deg) scale(1)"
                  zIndex = 30
                  opacity = 1
                } else if (offset === 1) {
                  transformStyle = "translate3d(0, 16px, -40px) rotate(2.5deg) scale(0.96)"
                  zIndex = 20
                  opacity = 0.88
                } else if (offset === 2) {
                  transformStyle = "translate3d(0, 32px, -80px) rotate(-2deg) scale(0.92)"
                  zIndex = 10
                  opacity = 0.75
                } else if (offset === 3) {
                  transformStyle = "translate3d(0, 48px, -120px) rotate(1deg) scale(0.88)"
                  zIndex = 5
                  opacity = 0.45
                }

                return (
                  <div
                    key={unit.id}
                    style={{
                      transform: transformStyle,
                      zIndex,
                      opacity,
                    }}
                    className="absolute inset-0 rounded-[2rem] overflow-hidden border border-zinc-200/80 dark:border-white/15 bg-white dark:bg-[#0D0D12] shadow-2xl transition-all duration-500 ease-out origin-bottom select-none"
                  >
                    <Link
                      href={`/sub-units/${unit.slug}`}
                      className="block w-full h-full relative group cursor-pointer"
                      tabIndex={isTop ? 0 : -1}
                      aria-label={`View ${unit.name} details`}
                    >
                      {/* Sub-Unit Image */}
                      <Image
                        src={unit.image}
                        alt={`tripleS ${unit.name}`}
                        fill
                        sizes="(max-width: 768px) 90vw, 450px"
                        priority={offset === 0}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Tactical Gradient Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                        <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/20">
                          {unit.category}
                        </span>
                        <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#D4FF00] border border-[#D4FF00]/30">
                          {unit.members.length} Members
                        </span>
                      </div>

                      {/* Bottom Info & Member Lineup Content */}
                      <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 text-white space-y-2">
                        <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-widest block">
                          {unit.era} &bull; {unit.debutRelease}
                        </span>

                        <div className="flex items-end justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-tight group-hover:text-[#D4FF00] transition-colors truncate">
                              {unit.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed max-w-sm">
                              {unit.description}
                            </p>
                          </div>

                          {/* Hover Arrow Badge */}
                          <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-[#D4FF00] backdrop-blur-md flex items-center justify-center text-white group-hover:text-black transition-all shrink-0 shadow-lg">
                            <span className="text-base font-bold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                              ↗
                            </span>
                          </div>
                        </div>

                        {/* Member Lineup Roster Chips */}
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {unit.members.slice(0, 5).map((member) => (
                            <span
                              key={member}
                              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-zinc-200 border border-white/10"
                            >
                              {member}
                            </span>
                          ))}
                          {unit.members.length > 5 && (
                            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[#D4FF00] border border-[#D4FF00]/30">
                              +{unit.members.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
