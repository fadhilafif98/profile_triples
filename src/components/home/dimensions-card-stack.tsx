"use client"

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import type { Member } from "@/types/member"
import type { SubUnit } from "@/types/sub-unit"
import DimensionWordmark from "@/components/dimension-wordmark"
import ThemeImage from "@/components/theme-image"
import {
  OFFICIAL_MEMBER_COLORS,
  getMemberImageUrl,
  getReadableMemberColor,
} from "@/lib/members"
import { useSafeReducedMotion } from "@/lib/a11y"
import { useIsDarkMode } from "@/lib/theme"

interface DimensionsCardStackProps {
  subUnits: SubUnit[]
  members?: Member[]
}

function parseSNumber(raw: string): number | null {
  const match = raw.match(/^S(\d+)\b/i)
  return match ? Number.parseInt(match[1], 10) : null
}

export default function DimensionsCardStack({
  subUnits,
  members = [],
}: DimensionsCardStackProps) {
  const reduceMotion = useSafeReducedMotion()
  const isDark = useIsDarkMode()
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, "")

  const [activeIndex, setActiveIndex] = useState(0)
  const [announcement, setAnnouncement] = useState("")

  const stripRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const dragRef = useRef({
    down: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  })

  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const smoothX = useSpring(pointerX, { stiffness: 200, damping: 28, mass: 0.7 })
  const smoothY = useSpring(pointerY, { stiffness: 200, damping: 28, mass: 0.7 })
  const rotateX = useTransform(smoothY, [0, 1], [2.5, -2.5])
  const rotateY = useTransform(smoothX, [0, 1], [-3, 3])

  const membersById = useMemo(() => {
    const map = new Map<number, Member>()
    for (const member of members) {
      map.set(member.id, member)
    }
    return map
  }, [members])

  const safeIndex =
    subUnits.length > 0 ? Math.max(0, Math.min(activeIndex, subUnits.length - 1)) : 0
  const activeUnit = subUnits[safeIndex]

  const lineupAvatars = useMemo(() => {
    if (!activeUnit) return []
    return activeUnit.members.map((raw, idx) => {
      const sNumber = parseSNumber(raw)
      const member = sNumber ? membersById.get(sNumber) : undefined
      return {
        key: `${raw}-${idx}`,
        sNumber,
        member,
      }
    })
  }, [activeUnit, membersById])

  const selectIndex = useCallback(
    (nextIdx: number) => {
      if (subUnits.length === 0) return
      const wrapped = ((nextIdx % subUnits.length) + subUnits.length) % subUnits.length
      setActiveIndex(wrapped)
      const target = subUnits[wrapped]
      if (target) {
        setAnnouncement(`${target.name}, ${wrapped + 1} of ${subUnits.length}`)
      }
    },
    [subUnits]
  )

  useEffect(() => {
    const container = stripRef.current
    const item = itemRefs.current[safeIndex]
    if (!container || !item) return

    const targetLeft =
      item.offsetLeft - container.clientWidth / 2 + item.clientWidth / 2
    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth)
    const clampedLeft = Math.max(0, Math.min(targetLeft, maxScroll))

    if (Math.abs(container.scrollLeft - clampedLeft) < 2) return

    container.scrollTo({
      left: clampedLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }, [safeIndex, reduceMotion])

  // Fallback scrollability edge-fade detection when scroll-driven animations are unsupported
  useEffect(() => {
    const scroller = stripRef.current
    if (!scroller) return
    if (
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline", "scroll()")
    ) {
      return
    }
    const first = scroller.firstElementChild
    const last = scroller.lastElementChild
    if (!first || !last || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, intersectionRatio } of entries) {
          scroller.classList.toggle(
            target === first ? "more-start" : "more-end",
            intersectionRatio < 1
          )
        }
      },
      { root: scroller, threshold: 1, rootMargin: "1px" }
    )

    observer.observe(first)
    observer.observe(last)
    return () => observer.disconnect()
  }, [subUnits.length])

  const handleStripKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      const next = (safeIndex + 1) % subUnits.length
      selectIndex(next)
      itemRefs.current[next]?.focus({ preventScroll: true })
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      const prev = (safeIndex - 1 + subUnits.length) % subUnits.length
      selectIndex(prev)
      itemRefs.current[prev]?.focus({ preventScroll: true })
    } else if (e.key === "Home") {
      e.preventDefault()
      selectIndex(0)
      itemRefs.current[0]?.focus({ preventScroll: true })
    } else if (e.key === "End") {
      e.preventDefault()
      const last = subUnits.length - 1
      selectIndex(last)
      itemRefs.current[last]?.focus({ preventScroll: true })
    }
  }

  const handleStripPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.pointerType === "touch") return
    const el = stripRef.current
    if (!el) return
    dragRef.current = {
      down: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    }
  }

  const handleStripPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.down) return
    const el = stripRef.current
    if (!el) return
    const delta = e.clientX - dragRef.current.startX
    if (Math.abs(delta) > 5) dragRef.current.moved = true
    if (dragRef.current.moved) {
      el.scrollLeft = dragRef.current.scrollLeft - delta
    }
  }

  const endStripDrag = () => {
    dragRef.current.down = false
    if (dragRef.current.moved) {
      window.setTimeout(() => {
        dragRef.current.moved = false
      }, 0)
    }
  }

  const handlePlatePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return
    const rect = e.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    pointerX.set((e.clientX - rect.left) / rect.width)
    pointerY.set((e.clientY - rect.top) / rect.height)
  }

  const resetPlateTilt = () => {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  if (!subUnits || subUnits.length === 0 || !activeUnit) return null

  const activeTabId = `${baseId}-tab-${activeUnit.slug}`

  return (
    <section
      id="featured-dimensions"
      aria-labelledby="featured-dimensions-heading"
      className="relative border-t border-zinc-200 dark:border-white/10 bg-[#fafafa] dark:bg-[#08080A] overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 space-y-8 sm:space-y-10">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2
            id="featured-dimensions-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05]"
          >
            Featured{" "}
            <span className="font-accent text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
              Dimensions
            </span>
          </h2>

          <Link
            href="/sub-units"
            className="nav-draw-link inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-zinc-950 dark:text-zinc-200 pb-0.5 self-start md:self-auto shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
          >
            All {subUnits.length} Dimensions
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Lookbook Stage (Tabpanel synced with Dimension Tablist) */}
        <div
          role="tabpanel"
          aria-labelledby={activeTabId}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left (7 Cols): Pure Unobstructed Concept Photography */}
          <div
            className="lg:col-span-7"
            onPointerMove={handlePlatePointerMove}
            onPointerLeave={resetPlateTilt}
            style={{ perspective: "1200px" }}
          >
            <motion.div
              style={
                reduceMotion
                  ? undefined
                  : {
                      rotateX,
                      rotateY,
                      transformStyle: "preserve-3d",
                    }
              }
              className="relative rounded-2xl shadow-[0_24px_60px_-24px_rgba(9,9,11,0.4)] dark:shadow-[0_28px_64px_-24px_rgba(0,0,0,0.85)]"
            >
              <Link
                href={`/sub-units/${activeUnit.slug}`}
                aria-label={`Open ${activeUnit.name} Dimension page`}
                className="group relative block w-full aspect-3/2 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
              >
                <span className="relative block w-full h-full rounded-2xl overflow-hidden bg-zinc-900">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={activeUnit.slug}
                      initial={
                        reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.03 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      exit={
                        reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }
                      }
                      transition={{
                        duration: reduceMotion ? 0 : 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute inset-0 block"
                    >
                      <Image
                        src={activeUnit.image}
                        alt={`tripleS ${activeUnit.name} concept photo`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        priority
                        className={`object-cover object-[center_22%] ${
                          reduceMotion
                            ? ""
                            : "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.025]"
                        }`}
                      />
                    </motion.span>
                  </AnimatePresence>
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right (5 Cols): Concise Frontpage Teaser */}
          <motion.div
            key={activeUnit.slug}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-5 flex flex-col items-start gap-6 sm:gap-7"
          >
            <h3 className="w-full text-zinc-950 dark:text-white">
              <DimensionWordmark
                slug={activeUnit.slug}
                name={activeUnit.name}
                size="hero"
                className="w-full"
              />
            </h3>

            {/* Visual Member Portrait Stack */}
            <div className="flex items-center gap-3">
              <div aria-hidden="true" className="flex items-center -space-x-2">
                {lineupAvatars.slice(0, 8).map((entry) => {
                  const rawHex = entry.sNumber
                    ? OFFICIAL_MEMBER_COLORS[entry.sNumber] ?? "#D4FF00"
                    : "#D4FF00"
                  const ringColor = getReadableMemberColor(rawHex, isDark)
                  const imgSrc = entry.member
                    ? getMemberImageUrl(entry.member, isDark)
                    : ""

                  if (entry.member && imgSrc) {
                    return (
                      <span
                        key={entry.key}
                        className="relative block w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 border-2"
                        style={{ borderColor: ringColor }}
                      >
                        <ThemeImage
                          src={imgSrc}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover object-top"
                        />
                      </span>
                    )
                  }

                  return (
                    <span
                      key={entry.key}
                      className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 font-mono text-[10px] font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900"
                      style={{ borderColor: ringColor }}
                    >
                      {entry.sNumber ? `S${entry.sNumber}` : ""}
                    </span>
                  )
                })}
                {lineupAvatars.length > 8 && (
                  <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#fafafa] dark:border-[#08080A] bg-zinc-900 dark:bg-zinc-800 font-mono text-[10px] font-bold text-white tabular-nums">
                    +{lineupAvatars.length - 8}
                  </span>
                )}
              </div>

              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                {activeUnit.members.length} members
              </span>
            </div>

            <Link
              href={`/sub-units/${activeUnit.slug}`}
              className="btn-primary btn-magnetic"
            >
              <span>Explore Dimension</span>
              <ArrowUpRight className="w-3.5 h-3.5 btn-arrow" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* Bottom Row: Minimalist Scrollable Tablist with Edge Fade Hints + Prev/Next */}
        <div className="flex items-center gap-3 pt-2 border-t border-zinc-200 dark:border-white/10">
          <div
            ref={stripRef}
            role="tablist"
            aria-label="Choose a tripleS Dimension"
            onKeyDown={handleStripKeyDown}
            onPointerDown={handleStripPointerDown}
            onPointerMove={handleStripPointerMove}
            onPointerUp={endStripDrag}
            onPointerCancel={endStripDrag}
            onPointerLeave={endStripDrag}
            onClickCapture={(e) => {
              if (dragRef.current.moved) {
                e.preventDefault()
                e.stopPropagation()
                dragRef.current.moved = false
              }
            }}
            style={{ touchAction: "manipulation" }}
            className="horizontal-scroll-fade flex-1 flex items-center gap-1 sm:gap-2 overflow-x-auto snap-x snap-proximity overscroll-x-contain no-scrollbar py-1 cursor-grab active:cursor-grabbing select-none"
          >
            {subUnits.map((unit, idx) => {
              const isSelected = idx === safeIndex
              const tabId = `${baseId}-tab-${unit.slug}`
              return (
                <button
                  key={unit.id}
                  id={tabId}
                  ref={(el) => {
                    itemRefs.current[idx] = el
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectIndex(idx)}
                  style={{ touchAction: "manipulation" }}
                  className={`relative snap-start shrink-0 inline-flex items-baseline gap-2 px-3 py-2.5 text-left transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00] ${
                    isSelected
                      ? `text-zinc-950 dark:text-white ${
                          reduceMotion
                            ? "after:absolute after:inset-x-3 after:bottom-0 after:border-b-2 after:border-zinc-950 dark:after:border-[#D4FF00]"
                            : ""
                        }`
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      isSelected
                        ? "text-zinc-950 dark:text-[#D4FF00]"
                        : "opacity-65"
                    }`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display font-medium text-sm whitespace-nowrap">
                    {unit.name}
                  </span>

                  {isSelected && !reduceMotion && (
                    <motion.span
                      aria-hidden="true"
                      layoutId={`dimension-chapter-line-${baseId}`}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="pointer-events-none absolute inset-x-3 bottom-0 border-b-2 border-zinc-950 dark:border-[#D4FF00]"
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              aria-label="Previous dimension"
              onClick={() => selectIndex(safeIndex - 1)}
              style={{ touchAction: "manipulation" }}
              className="inline-flex items-center justify-center min-w-10 min-h-10 rounded-full border border-zinc-300 dark:border-white/15 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 hover:border-zinc-950 dark:hover:border-[#D4FF00] active:scale-95 motion-reduce:active:scale-100 transition-[background-color,border-color,transform] duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next dimension"
              onClick={() => selectIndex(safeIndex + 1)}
              style={{ touchAction: "manipulation" }}
              className="inline-flex items-center justify-center min-w-10 min-h-10 rounded-full border border-zinc-300 dark:border-white/15 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 hover:border-zinc-950 dark:hover:border-[#D4FF00] active:scale-95 motion-reduce:active:scale-100 transition-[background-color,border-color,transform] duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>
      </div>
    </section>
  )
}
