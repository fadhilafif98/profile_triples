"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useReducedMotion } from "motion/react"
import type { SubUnit } from "@/types/sub-unit"
import { ChevronLeft, ChevronRight, ArrowUpRight, Pause, Play } from "lucide-react"
import WavWordmark from "@/components/wav-wordmark"

interface DimensionsCardStackProps {
  subUnits: SubUnit[]
}

const CURATED_SLUGS = [
  "visionary-vision",
  "acid-angel-from-asia",
  "krystal-eyes",
  "lovelution",
  "evolution",
  "glow",
  "hatchi",
]

export default function DimensionsCardStack({ subUnits }: DimensionsCardStackProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const showcaseUnits = useMemo(() => {
    const list = CURATED_SLUGS
      .map((slug) => subUnits.find((u) => u.slug === slug))
      .filter((u): u is SubUnit => Boolean(u))

    return list.length >= 4 ? list : subUnits.slice(0, 7)
  }, [subUnits])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
  const [isInView, setIsInView] = useState(false)

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % showcaseUnits.length)
  }, [showcaseUnits.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + showcaseUnits.length) % showcaseUnits.length)
  }, [showcaseUnits.length])

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Only autoplay while section is in viewport
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

  // Pause when browser tab is inactive
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

  // Autoplay loop
  useEffect(() => {
    if (reduceMotion || isHovered || isAutoplayPaused || !isInView) return

    const timer = setInterval(() => {
      handleNext()
    }, 4800)

    return () => clearInterval(timer)
  }, [reduceMotion, isHovered, isAutoplayPaused, isInView, handleNext])

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
  if (!currentUnit) return null

  return (
    <section
      ref={sectionRef}
      aria-labelledby="featured-dimensions-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/80 dark:border-white/10 bg-[#fafafa] dark:bg-[#08080A] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Editorial Info & Streamlined Controls */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8 relative z-10">
            <div className="space-y-3">
              <h2
                id="featured-dimensions-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05]"
              >
                Featured{" "}
                <span className="font-accent text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                  Dimensions
                </span>
              </h2>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md">
                From 4-member debut Acid Angel from Asia to 12-member dance unit Visionary Vision, tripleS dimensions assemble and evolve through{" "}
                <WavWordmark className="h-[0.82em] mx-1 text-zinc-950 dark:text-[#D4FF00] align-baseline" />{" "}
                Grand Gravity votes.
              </p>
            </div>

            {/* Active Dimension Metadata + Controls */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-5">
                <div className="font-mono text-xs tracking-widest font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 tabular-nums">
                  <span className="text-zinc-950 dark:text-[#D4FF00]">
                    {String(currentIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-zinc-500">
                    {String(showcaseUnits.length).padStart(2, "0")}
                  </span>
                </div>

                {/* GPU scaleX progress bar */}
                <div className="flex-1 max-w-[140px] h-1 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full w-full bg-zinc-950 dark:bg-[#D4FF00] origin-left transition-transform duration-300 ease-out"
                    style={{
                      transform: `scaleX(${(currentIndex + 1) / showcaseUnits.length})`,
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAutoplayPaused((p) => !p)}
                    aria-label={isAutoplayPaused ? "Resume autoplay" : "Pause autoplay"}
                    title={isAutoplayPaused ? "Resume autoplay" : "Pause autoplay"}
                    className="w-10 h-10 rounded-full border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#14141B] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-[#D4FF00] hover:border-zinc-400 dark:hover:border-[#D4FF00]/50 transition-[border-color,color,transform] duration-200 ease-out shadow-sm active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
                  >
                    {isAutoplayPaused ? (
                      <Play className="w-3.5 h-3.5 translate-x-0.5" aria-hidden="true" />
                    ) : (
                      <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous dimension"
                    className="w-10 h-10 rounded-full border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#14141B] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-[#D4FF00] hover:border-zinc-400 dark:hover:border-[#D4FF00]/50 transition-[border-color,color,transform] duration-200 ease-out shadow-sm active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next dimension"
                    className="w-10 h-10 rounded-full border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#14141B] flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-[#D4FF00] hover:border-zinc-400 dark:hover:border-[#D4FF00]/50 transition-[border-color,color,transform] duration-200 ease-out shadow-sm active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                <span className="kinetic-dot" aria-hidden="true" />
                <span className="truncate">
                  <strong className="text-zinc-950 dark:text-white font-semibold">
                    {currentUnit.name}
                  </strong>{" "}
                  &bull; {currentUnit.era} &bull; {currentUnit.members.length} Members
                </span>
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/sub-units"
                className="btn-primary btn-magnetic group"
              >
                <span>Browse All {subUnits.length} Dimensions</span>
                <ArrowUpRight className="btn-arrow w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive 3D Perspective Card Stack */}
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
                const offset = (index - currentIndex + showcaseUnits.length) % showcaseUnits.length
                const isTop = offset === 0
                const isExited = offset === showcaseUnits.length - 1

                let transformStyle = ""
                let zIndex = 0
                let opacity = 0
                let pointerEvents: "auto" | "none" = "none"

                if (reduceMotion) {
                  transformStyle = isTop ? "translate3d(0, 0, 0)" : "translate3d(0, 10px, 0)"
                  opacity = isTop ? 1 : 0
                  zIndex = isTop ? 30 : 0
                  pointerEvents = isTop ? "auto" : "none"
                } else if (isTop) {
                  transformStyle = "translate3d(0, 0, 0) scale(1) rotate(0deg)"
                  zIndex = 30
                  opacity = 1
                  pointerEvents = "auto"
                } else if (offset === 1) {
                  transformStyle = "translate3d(0, 16px, -36px) scale(0.96) rotate(1.5deg)"
                  zIndex = 20
                  opacity = 0.88
                  pointerEvents = "auto"
                } else if (offset === 2) {
                  transformStyle = "translate3d(0, 32px, -72px) scale(0.92) rotate(-1.5deg)"
                  zIndex = 10
                  opacity = 0.72
                  pointerEvents = "auto"
                } else if (offset === 3) {
                  transformStyle = "translate3d(0, 48px, -108px) scale(0.88) rotate(1deg)"
                  zIndex = 5
                  opacity = 0.45
                  pointerEvents = "auto"
                } else if (isExited) {
                  transformStyle = "translate3d(-48px, 16px, 0) scale(0.94) rotate(-3deg)"
                  zIndex = 35
                  opacity = 0
                  pointerEvents = "none"
                } else {
                  transformStyle = "translate3d(0, 60px, -140px) scale(0.84) rotate(0deg)"
                  zIndex = 0
                  opacity = 0
                  pointerEvents = "none"
                }

                return (
                  <div
                    key={unit.id}
                    style={{
                      transform: transformStyle,
                      zIndex,
                      opacity,
                      pointerEvents,
                    }}
                    className={`absolute inset-0 rounded-[2rem] overflow-hidden border border-zinc-200/80 dark:border-white/15 bg-white dark:bg-[#0D0D12] shadow-2xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-bottom select-none transform-gpu ${
                      isTop ? "cursor-pointer" : "cursor-pointer hover:-translate-y-1"
                    }`}
                  >
                    {isTop ? (
                      <Link
                        href={`/sub-units/${unit.slug}`}
                        className="block w-full h-full relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] active:scale-[0.98] transition-transform duration-200 ease-out"
                        aria-label={`View full details of ${unit.name}`}
                      >
                        <Image
                          src={unit.image}
                          alt={`tripleS ${unit.name} concept photo`}
                          fill
                          sizes="(max-width: 768px) 90vw, 450px"
                          priority={offset === 0}
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

                        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 text-white">
                          <div className="flex items-end justify-between gap-3">
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white tracking-tight leading-[1.15] break-words group-hover:text-[#D4FF00] transition-colors">
                                {unit.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed max-w-sm">
                                {unit.description}
                              </p>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-[#D4FF00] backdrop-blur-md flex items-center justify-center text-white group-hover:text-black transition-[background-color,color] duration-200 shrink-0 shadow-lg">
                              <ArrowUpRight
                                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => goToIndex(index)}
                        className="w-full h-full relative text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
                        aria-label={`Bring ${unit.name} to front`}
                      >
                        <Image
                          src={unit.image}
                          alt={`tripleS ${unit.name}`}
                          fill
                          sizes="(max-width: 768px) 90vw, 450px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                      </button>
                    )}
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
