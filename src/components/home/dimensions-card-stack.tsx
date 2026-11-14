"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSafeReducedMotion } from "@/lib/a11y"
import type { SubUnit } from "@/types/sub-unit"
import { ArrowUpRight } from "lucide-react"
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
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const touchSwipedRef = useRef(false)
  const reduceMotion = useSafeReducedMotion()

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

            {/* Active Dimension Editorial Index (Desktop Grid + Mobile Swipeable Pills) */}
            <div className="space-y-3 pt-1">
              <div
                className="flex lg:hidden items-center gap-2 overflow-x-auto snap-x snap-mandatory overscroll-x-contain no-scrollbar -mx-4 sm:-mx-6 px-4 sm:px-6 py-1"
                role="tablist"
                aria-label="Featured Dimensions"
              >
                {showcaseUnits.map((unit, idx) => {
                  const isActive = idx === currentIndex
                  return (
                    <button
                      key={unit.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        goToIndex(idx)
                        setIsAutoplayPaused(true)
                      }}
                      className={`snap-start shrink-0 min-h-10 px-3.5 py-2 rounded-full text-xs font-mono inline-flex items-center gap-2 border transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] ${
                        isActive
                          ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 font-semibold"
                          : "border-zinc-200 dark:border-white/15 bg-white dark:bg-[#14141B] text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/30"
                      }`}
                    >
                      <span
                        className={`tabular-nums ${
                          isActive
                            ? "text-[#D4FF00] dark:text-zinc-950"
                            : "text-zinc-400 dark:text-zinc-500"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>{unit.name}</span>
                    </button>
                  )
                })}
              </div>

              <div
                className="hidden lg:grid lg:grid-cols-2 gap-x-6 gap-y-2 pt-3 border-t border-zinc-200/80 dark:border-white/10"
                role="tablist"
                aria-label="Featured Dimensions index"
              >
                {showcaseUnits.map((unit, idx) => {
                  const isActive = idx === currentIndex
                  return (
                    <button
                      key={unit.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        goToIndex(idx)
                        setIsAutoplayPaused(true)
                      }}
                      className="group/idx flex items-center gap-2.5 py-1.5 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] rounded-md"
                    >
                      <span
                        aria-hidden="true"
                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                          isActive
                            ? "bg-zinc-950 dark:bg-[#D4FF00]"
                            : "bg-zinc-300 dark:bg-zinc-700 group-hover/idx:bg-zinc-500 dark:group-hover/idx:bg-zinc-400"
                        }`}
                      />
                      <span
                        className={`font-mono text-[11px] tabular-nums shrink-0 ${
                          isActive
                            ? "text-zinc-950 dark:text-[#D4FF00] font-bold"
                            : "text-zinc-400 dark:text-zinc-500"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-xs xl:text-[13px] truncate transition-colors ${
                          isActive
                            ? "text-zinc-950 dark:text-white font-semibold"
                            : "text-zinc-600 dark:text-zinc-400 group-hover/idx:text-zinc-950 dark:group-hover/idx:text-white"
                        }`}
                      >
                        {unit.name}
                      </span>
                    </button>
                  )
                })}
              </div>

              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-2 pt-1">
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
            className="lg:col-span-7 flex items-center justify-center relative touch-pan-y"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={(e) => {
              setIsHovered(true)
              const touch = e.touches[0]
              if (!touch) return
              touchStartXRef.current = touch.clientX
              touchStartYRef.current = touch.clientY
              touchSwipedRef.current = false
            }}
            onTouchMove={(e) => {
              const startX = touchStartXRef.current
              const startY = touchStartYRef.current
              const touch = e.touches[0]
              if (startX === null || startY === null || !touch) return
              const dx = touch.clientX - startX
              const dy = touch.clientY - startY
              if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
                touchSwipedRef.current = true
              }
            }}
            onTouchEnd={(e) => {
              const startX = touchStartXRef.current
              const startY = touchStartYRef.current
              const touch = e.changedTouches[0]
              if (startX !== null && touch) {
                const dx = touch.clientX - startX
                const dy = touch.clientY - (startY ?? touch.clientY)
                if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                  if (dx < 0) handleNext()
                  else handlePrev()
                  setIsAutoplayPaused(true)
                  touchSwipedRef.current = true
                  window.setTimeout(() => {
                    touchSwipedRef.current = false
                  }, 150)
                }
              }
              touchStartXRef.current = null
              touchStartYRef.current = null
              setIsHovered(false)
            }}
            onTouchCancel={() => {
              touchStartXRef.current = null
              touchStartYRef.current = null
              touchSwipedRef.current = false
              setIsHovered(false)
            }}
            onClickCapture={(e) => {
              if (touchSwipedRef.current) {
                e.preventDefault()
                e.stopPropagation()
                touchSwipedRef.current = false
              }
            }}
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
