"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  ArrowUpRight,
  Maximize2,
} from "lucide-react"
import TriplesLogo from "@/components/triples-logo"
import { Member } from "@/types/member"
import { members, getMemberBySlug, getMemberColor } from "@/lib/members"
import { getAllSubUnits } from "@/lib/sub-units"
import Breadcrumb from "@/components/breadcrumb"

// ─── Career Activities Timeline Data ─────────────────────────────────────────
const careerMap: Record<number, string[]> = {
  1: [
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.05 +(KR)ystal Eyes ‘Cherry Talk’ (AESTHETIC)",
    "2023.07 ACID EYES ‘Cherry Gene’",
    "2023.08 LOVElution ‘Girls' Capitalism’ (MUHAN)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24 Leader)",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25 Leader)",
    "2025.11 msnz ‘Beyond Beauty’ (neptune)",
  ],
  2: [
    "2022.11 Acid Angel from Asia ‘Generation’ (ACCESS)",
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.07 ACID EYES ‘Cherry Gene’",
    "2023.08 LOVElution ‘Girls' Capitalism’ (MUHAN)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’ (Performante)",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  3: [
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.05 +(KR)ystal Eyes ‘Cherry Talk’ (AESTHETIC)",
    "2023.07 ACID EYES ‘Cherry Gene’",
    "2023.10 EVOLution ‘Invincible’ (MUJUK)",
    "2024.01 Aria ‘Door’ (Structure of Sadness)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.11 ∞! (Hatchi!) ‘Untitled’ (Japan Debut)",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  4: [
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.05 +(KR)ystal Eyes ‘Cherry Talk’ (AESTHETIC)",
    "2023.07 ACID EYES ‘Cherry Gene’",
    "2023.10 EVOLution ‘Invincible’ (MUJUK)",
    "2024.01 Aria ‘Door’ (Structure of Sadness)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.11 ∞! (Hatchi!) ‘Untitled’ (Japan Debut)",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  5: [
    "2022.11 Acid Angel from Asia ‘Generation’ (Leader)",
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.07 ACID EYES ‘Cherry Gene’",
    "2023.10 EVOLution ‘Invincible’ (Leader)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2024.11 ∞! (Hatchi!) ‘Untitled’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  6: [
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.05 +(KR)ystal Eyes ‘Cherry Talk’",
    "2023.07 ACID EYES ‘Cherry Gene’",
    "2023.10 EVOLution ‘Invincible’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.11 ∞! (Hatchi!) ‘Untitled’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  7: [
    "2022.11 Acid Angel from Asia ‘Generation’",
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.07 ACID EYES ‘Cherry Gene’",
    "2023.10 EVOLution ‘Invincible’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2024.12 Kim NaKyoung Solo Digital Single ‘Closer’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  8: [
    "2022.11 Acid Angel from Asia ‘Generation’",
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.07 ACID EYES ‘Cherry Gene’",
    "2023.08 LOVElution ‘Girls' Capitalism’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  9: [
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.08 LOVElution ‘Girls' Capitalism’",
    "2024.01 Aria ‘Door’ (Structure of Sadness)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  10: [
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.08 LOVElution ‘Girls' Capitalism’ (Leader)",
    "2024.01 Aria ‘Door’ (Leader)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  11: [
    "2023.10 EVOLution ‘Invincible’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2024.11 ∞! (Hatchi!) ‘Untitled’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.10 ∞! (Hatchi!) ‘SecretHimitsuBimil’",
  ],
  12: [
    "2023.10 EVOLution ‘Invincible’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  13: [
    "2023.08 LOVElution ‘Girls' Capitalism’",
    "2024.01 Aria ‘Door’ (Structure of Sadness)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  14: [
    "2023.06 +(KR)ystal Eyes ‘Touch+’ (Featuring/Producer)",
    "2023.08 LOVElution ‘Girls' Capitalism’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  15: [
    "2023.08 LOVElution ‘Girls' Capitalism’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.11 msnz ‘Beyond Beauty’ (Leader)",
  ],
  16: [
    "2023.10 EVOLution ‘Invincible’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.11 ∞! (Hatchi!) ‘Untitled’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.10 ∞! (Hatchi!) ‘SecretHimitsuBimil’",
  ],
  17: [
    "2023.12 tripleS NXT ‘Just Do It’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  18: [
    "2023.12 tripleS NXT ‘Just Do It’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  19: [
    "2023.12 tripleS NXT ‘Just Do It’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
  ],
  20: [
    "2023.12 tripleS NXT ‘Just Do It’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.11 ∞! (Hatchi!) ‘Untitled’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.10 ∞! (Hatchi!) ‘SecretHimitsuBimil’",
  ],
  21: [
    "2024.06 tripleS Glow ‘Inner Dance’",
    "2024.11 ∞! (Hatchi!) ‘Untitled’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.10 ∞! (Hatchi!) ‘SecretHimitsuBimil’",
  ],
  22: [
    "2024.06 tripleS Glow ‘Inner Dance’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.11 msnz ‘Beyond Beauty’ (moon Leader)",
  ],
  23: [
    "2024.06 tripleS Glow ‘Inner Dance’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.11 msnz ‘Beyond Beauty’ (neptune)",
  ],
  24: [
    "2024.06 tripleS Glow ‘Inner Dance’",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.11 msnz ‘Beyond Beauty’ (moon)",
  ],
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getAge(dateStr: string): number {
  const birth = new Date(dateStr + "T00:00:00")
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function getZodiac(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  const month = d.getMonth() + 1
  const day = d.getDate()
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius ♒"
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces ♓"
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries ♈"
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus ♉"
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini ♊"
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer ♋"
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo ♌"
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo ♍"
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra ♎"
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio ♏"
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius ♐"
  return "Capricorn ♑"
}

function parseCareerEntry(entry: string): { date: string; content: string } {
  const match = entry.match(/^(\d{4}\.\d{2})\s+(.+)$/)
  if (match) {
    return { date: match[1], content: match[2] }
  }
  return { date: "", content: entry }
}

interface MemberProfileClientProps {
  slug: string
}

export default function MemberProfileClient({ slug }: MemberProfileClientProps) {
  const member = getMemberBySlug(slug)
  const [mounted, setMounted] = useState(false)
  const [activePhoto, setActivePhoto] = useState<string | null>(null)
  const [dimensionPage, setDimensionPage] = useState(0)
  const [hasMoved, setHasMoved] = useState(false)

  // More tripleS Slider Drag State & Auto-Center
  const memberSliderRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keep window at top on member change
  useEffect(() => {
    if (mounted) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    }
  }, [mounted, member?.id])

  // Auto-center active member in slider horizontally without window jump
  useEffect(() => {
    if (memberSliderRef.current && mounted) {
      const slider = memberSliderRef.current
      const activeEl = slider.querySelector<HTMLElement>('[data-active="true"]')
      if (activeEl) {
        const targetScroll =
          activeEl.offsetLeft - slider.clientWidth / 2 + activeEl.clientWidth / 2
        slider.scrollTo({ left: Math.max(0, targetScroll), behavior: "smooth" })
      }
    }
  }, [mounted, member?.id])

  // Close lightbox on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && activePhoto) {
        setActivePhoto(null)
      }
    },
    [activePhoto]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Matched sub-units resolved from single source of truth
  const matchedUnits = useMemo(() => {
    if (!member) return []
    const allUnits = getAllSubUnits()
    return allUnits.filter((su) => {
      const inUnitMembers = su.members.some(
        (m) =>
          m.toLowerCase().includes(member.name.toLowerCase()) ||
          m.startsWith(`S${member.id} `)
      )
      const inMemberSubUnits = (member.subUnits || []).some((u) => {
        const cU = u.toLowerCase()
        const cName = su.name.toLowerCase()
        const cSlug = su.slug.toLowerCase()
        return cName.includes(cU) || cU.includes(cSlug) || cSlug.includes(cU)
      })
      return inUnitMembers || inMemberSubUnits
    })
  }, [member])

  if (!member) return null

  const allMembersList: Member[] = Object.values(members).sort((a, b) => a.id - b.id)
  const currentIdx = allMembersList.findIndex((m) => m.id === member.id)
  const prevMember =
    currentIdx > 0 ? allMembersList[currentIdx - 1] : allMembersList[allMembersList.length - 1]
  const nextMember =
    currentIdx < allMembersList.length - 1 ? allMembersList[currentIdx + 1] : allMembersList[0]
  const memberColor = getMemberColor(member.id)
  const careerList = careerMap[member.id] || []

  const dimensionPageSize = 3
  const totalDimensionPages = Math.max(1, Math.ceil(matchedUnits.length / dimensionPageSize))
  const currentDimensionUnits = matchedUnits.slice(
    dimensionPage * dimensionPageSize,
    (dimensionPage + 1) * dimensionPageSize
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!memberSliderRef.current) return
    isDraggingRef.current = true
    setHasMoved(false)
    startXRef.current = e.pageX - memberSliderRef.current.offsetLeft
    scrollLeftRef.current = memberSliderRef.current.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !memberSliderRef.current) return
    e.preventDefault()
    const x = e.pageX - memberSliderRef.current.offsetLeft
    const walk = (x - startXRef.current) * 1.5
    if (Math.abs(walk) > 5) setHasMoved(true)
    memberSliderRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false
    setTimeout(() => setHasMoved(false), 80)
  }

  const scrollMemberSlider = (direction: "left" | "right") => {
    if (memberSliderRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420
      memberSliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-[#fafafa] dark:bg-[#08080A]" />
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#08080A] text-zinc-950 dark:text-zinc-100 selection:bg-[#D4FF00] selection:text-black transition-colors pt-20 sm:pt-24 lg:pt-28 pb-24 sm:pb-32">
      {/* ── 1. Top Breadcrumb & Prev/Next Switcher ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Members", href: "/members" },
            { label: member.name },
          ]}
          action={
            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
              <Link
                href={`/members/${prevMember.slug}`}
                className="btn-magnetic flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all shadow-sm"
                title={`Previous: S${prevMember.id} ${prevMember.name}`}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>S{prevMember.id < 10 ? `0${prevMember.id}` : prevMember.id}</span>
              </Link>

              <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-800 dark:text-zinc-200 font-bold px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 whitespace-nowrap">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: memberColor }}
                  aria-hidden="true"
                />
                <span>S{member.id < 10 ? `0${member.id}` : member.id}</span>
                <span className="text-zinc-400 dark:text-zinc-500 font-normal">/ 24</span>
              </span>

              <Link
                href={`/members/${nextMember.slug}`}
                className="btn-magnetic flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all shadow-sm"
                title={`Next: S${nextMember.id} ${nextMember.name}`}
              >
                <span>S{nextMember.id < 10 ? `0${nextMember.id}` : nextMember.id}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          }
        />
      </div>

      {/* ── 2. Member Core Identity & Dossier (Act 1: Balanced Above The Fold) ── */}
      <section className="pb-16 md:pb-20 border-b border-zinc-200/80 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Column: First Class Objekt Photocard */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-5"
            >
              <div
                onClick={() => setActivePhoto(`https://i.imgur.com/${member.image}`)}
                className="spotlight-card group relative aspect-[3/4] w-full max-w-[480px] mx-auto rounded-2xl overflow-hidden shadow-md border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#0D0D12] cursor-zoom-in"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActivePhoto(`https://i.imgur.com/${member.image}`)
                  }
                }}
                aria-label={`Enlarge official portrait photo of ${member.name}`}
              >
                {/* Signature Member Color Strip */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 z-30 transition-all duration-300 group-hover:w-2"
                  style={{ backgroundColor: memberColor }}
                  aria-hidden="true"
                />

                {/* Top S-Number Tag */}
                <div className="absolute top-3.5 right-3.5 z-20 pointer-events-none">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-tight px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white shadow-sm">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: memberColor }}
                      aria-hidden="true"
                    />
                    <span>S{member.id < 10 ? `0${member.id}` : member.id}</span>
                  </span>
                </div>

                {/* Portrait Image */}
                <Image
                  src={`https://i.imgur.com/${member.image}`}
                  alt={`${member.name} (${member.birthName || member.name}) official profile portrait`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Silky Crossfade GIF on Hover */}
                {member.gif && (
                  <img
                    src={`https://i.giphy.com/media/v1.${member.gif}`}
                    alt={`${member.name} highlight motion`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                  />
                )}

                {/* Bottom Contrast Scrim */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none z-10" />

                {/* Bottom Card Caption */}
                <div className="absolute bottom-3.5 inset-x-4 flex items-center justify-between text-xs font-mono text-zinc-300 z-20 pointer-events-none">
                  <span className="truncate font-medium">{member.role}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 group-hover:text-white transition-colors shrink-0 ml-2">
                    <Maximize2 className="h-3 w-3" />
                    <span>Zoom</span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Identity Masthead & Structured Bento Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Masthead Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: memberColor }}
                      aria-hidden="true"
                    />
                    <span>S{member.id < 10 ? `0${member.id}` : member.id}</span>
                  </span>

                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                    {member.mbti}
                  </span>

                  {member.revealDate && (
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      Revealed {member.revealDate}
                    </span>
                  )}
                </div>

                <div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-zinc-950 dark:text-white flex flex-wrap items-baseline gap-3 leading-[1.05]">
                    <span>{member.name}</span>
                    {member.hangul && (
                      <span className="text-2xl sm:text-3xl font-normal text-zinc-500 dark:text-zinc-400 font-mono">
                        ({member.hangul})
                      </span>
                    )}
                  </h1>

                  <p className="text-sm sm:text-base font-mono text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
                    {member.role}
                  </p>
                </div>

                <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-200/60 dark:border-white/5 pt-3">
                  <span className="text-zinc-950 dark:text-white font-medium">
                    {member.birthName || member.name}
                  </span>
                  {member.birthNameHangul && ` (${member.birthNameHangul})`}
                  {member.nativeName && ` · ${member.nativeName}`}
                  <span className="text-zinc-400 dark:text-zinc-500 mx-1.5">&bull;</span>
                  <span>{member.nationality}</span>
                </p>
              </div>

              {/* Editorial Specification Dossier (Unboxed, Airy & High Contrast) */}
              <div className="border-y border-zinc-200/80 dark:border-white/10 py-5 my-1">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {/* 1. Birthday & Age */}
                  <div className="space-y-1">
                    <dt className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                      Birthday &amp; Age
                    </dt>
                    <dd className="text-sm sm:text-base font-bold font-mono text-zinc-950 dark:text-white flex items-baseline gap-2">
                      <span>{member.birthday}</span>
                      <span className="text-xs font-normal font-sans text-zinc-500 dark:text-zinc-400">
                        ({getAge(member.birthday)} yrs &bull; {getZodiac(member.birthday)})
                      </span>
                    </dd>
                  </div>

                  {/* 2. Homeland & Origin */}
                  <div className="space-y-1">
                    <dt className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                      Homeland &amp; Origin
                    </dt>
                    <dd className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white flex items-baseline gap-2">
                      <span className="truncate">{member.birthplace || member.nationality}</span>
                      <span className="text-xs font-normal font-mono text-zinc-500 dark:text-zinc-400 shrink-0">
                        ({member.nationality})
                      </span>
                    </dd>
                  </div>

                  {/* 3. Physical & Blood Type */}
                  <div className="space-y-1">
                    <dt className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                      Height &amp; Blood Type
                    </dt>
                    <dd className="text-sm sm:text-base font-bold font-mono text-zinc-950 dark:text-white flex items-baseline gap-2">
                      <span>{member.height || "N/A"}</span>
                      <span className="text-zinc-400">&bull;</span>
                      <span className="font-sans font-medium text-zinc-700 dark:text-zinc-300">
                        {member.bloodType ? `Type ${member.bloodType}` : "Blood Type N/A"}
                      </span>
                    </dd>
                  </div>

                  {/* 4. Official Symbol */}
                  <div className="space-y-1">
                    <dt className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                      Representative Symbol
                    </dt>
                    <dd className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                      {member.representativeEmoji}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Active Dimensions Strip */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                    Active Formations &bull; {matchedUnits.length} Units
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {matchedUnits.length > 0 ? (
                    matchedUnits.map((u) => (
                      <Link
                        key={u.slug}
                        href={`/sub-units/${u.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0D0D12] hover:bg-zinc-100 dark:hover:bg-white/10 border border-zinc-200/80 dark:border-white/10 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 transition-colors shadow-sm"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: memberColor }}
                          aria-hidden="true"
                        />
                        <span>{u.name.replace(/\s*\([^)]*\)/, "")}</span>
                      </Link>
                    ))
                  ) : (
                    <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                      tripleS (OT24)
                    </span>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2">
                <Link
                  href={`/objekts?member=${encodeURIComponent(member.name)}`}
                  className="btn-magnetic inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-zinc-950 text-white hover:bg-black dark:bg-[#D4FF00] dark:text-black dark:hover:bg-[#E2FF33] font-mono font-bold text-xs shadow-sm transition-transform active:scale-95"
                >
                  <TriplesLogo width={16} height={16} strokeWidth={200} className="shrink-0" />
                  <span>Explore {member.name} Objekts Vault</span>
                  <ArrowUpRight className="btn-arrow h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. Career Trajectory & Archival Lore (Act 2: 2-Column Balanced Section) ── */}
      <section className="py-14 md:py-20 border-b border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#08080A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight flex items-baseline gap-2.5">
              <span>Trajectory &amp; Lore</span>
              <span className="font-accent text-xl sm:text-2xl font-normal text-zinc-500 dark:text-zinc-400">
                chronicles
              </span>
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
              Discography Milestones &bull; Unit Formations &bull; Archival Field Notes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Career Chronology (Timeline) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h3 className="text-lg font-bold font-display text-zinc-950 dark:text-white tracking-tight">
                  Career Chronology
                </h3>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Chronological release trajectory and unit activations
                </p>
              </div>

              {careerList.length > 0 ? (
                <div className="relative pl-6 space-y-4 border-l-2 border-zinc-200 dark:border-white/10 ml-2 py-1">
                  {careerList.map((entry, idx) => {
                    const { date, content } = parseCareerEntry(entry)
                    return (
                      <div key={idx} className="relative group">
                        {/* Timeline pip */}
                        <span
                          className="absolute -left-[31px] top-1.5 w-2 h-2 rounded-full border-2 border-white dark:border-[#08080A] shadow-sm transition-transform group-hover:scale-125"
                          style={{ backgroundColor: memberColor }}
                          aria-hidden="true"
                        />

                        <div className="flex flex-wrap items-baseline gap-2">
                          {date && (
                            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-white/10 px-2.5 py-0.5 rounded border border-zinc-200/60 dark:border-white/10 shrink-0">
                              {date}
                            </span>
                          )}
                          <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans font-medium">
                            {content}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs font-mono text-zinc-500">No career milestones recorded.</p>
              )}
            </div>

            {/* Right: Curated Lore & Field Notes */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h3 className="text-lg font-bold font-display text-zinc-950 dark:text-white tracking-tight">
                  Archival Lore &amp; Notes
                </h3>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Official MODHAUS trivia and Signal memories
                </p>
              </div>

              {/* Signal Reveal Dispatch Card */}
              {member.funFacts && member.funFacts[0] && (
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#0D0D12] border border-zinc-200/80 dark:border-white/10 shadow-sm relative overflow-hidden">
                  <div
                    className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-200/40 dark:from-white/5 to-transparent rounded-bl-full pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: memberColor }}
                      aria-hidden="true"
                    />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">
                      Signal Reveal Dispatch
                    </span>
                  </div>
                  <blockquote className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans italic">
                    &ldquo;{member.funFacts[0]}&rdquo;
                  </blockquote>
                </div>
              )}

              {/* Field Notes Cards */}
              {member.funFacts && member.funFacts.length > 1 && (
                <div className="space-y-3">
                  {member.funFacts.slice(1).map((fact, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white dark:bg-[#0D0D12] border border-zinc-200/80 dark:border-white/10 shadow-sm flex items-start gap-3.5 transition-all hover:border-zinc-300 dark:hover:border-white/20"
                    >
                      <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0">
                        0{idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                        {fact}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Visual & Motion Archive (Act 3) ── */}
      <section className="py-14 md:py-20 border-b border-zinc-200/80 dark:border-white/10 bg-zinc-50/70 dark:bg-[#07070a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight">
              Visual Archive
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
              Concept Photography &bull; Live Motion Capture &bull; Digital Collectibles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Official Concept Portrait */}
            <div
              onClick={() => setActivePhoto(`https://i.imgur.com/${member.image}`)}
              className="spotlight-card relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 cursor-zoom-in group shadow-sm"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActivePhoto(`https://i.imgur.com/${member.image}`)
                }
              }}
              aria-label={`Enlarge official concept photo of ${member.name}`}
            >
              <Image
                src={`https://i.imgur.com/${member.image}`}
                alt={`${member.name} official concept portrait`}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3.5 py-1.5 rounded-full bg-black/80 border border-white/20 text-white">
                  <Maximize2 className="h-3 w-3" />
                  <span>Inspect View</span>
                </span>
              </div>
              <div className="absolute bottom-3.5 left-4 text-[11px] font-mono text-white drop-shadow-md">
                Official Concept Photo
              </div>
            </div>

            {/* 2. Live SIGNAL Moment (GIF) */}
            {member.gif ? (
              <div
                onClick={() => setActivePhoto(`https://i.giphy.com/media/v1.${member.gif}`)}
                className="spotlight-card relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 cursor-zoom-in group shadow-sm"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActivePhoto(`https://i.giphy.com/media/v1.${member.gif}`)
                  }
                }}
                aria-label={`Enlarge signal moment animation for ${member.name}`}
              >
                <img
                  src={`https://i.giphy.com/media/v1.${member.gif}`}
                  alt={`${member.name} daily live motion clip`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-sm border border-white/20 text-white flex items-center gap-1.5 shadow-sm">
                    <Play className="h-2.5 w-2.5 fill-current text-[#D4FF00]" />
                    <span>SIGNAL MOMENT</span>
                  </span>
                </div>
                <div className="absolute bottom-3.5 left-4 text-[11px] font-mono text-white drop-shadow-md">
                  Daily Live Motion Capture
                </div>
              </div>
            ) : null}

            {/* 3. Authentic First Class Digital Objekt Collectible Card */}
            <Link
              href={`/objekts?member=${encodeURIComponent(member.name)}`}
              className="spotlight-card group relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0D0D12] p-6 flex flex-col justify-between shadow-sm hover:border-zinc-400 dark:hover:border-white/30 transition-all"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5 z-20"
                style={{ backgroundColor: memberColor }}
                aria-hidden="true"
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TriplesLogo width={16} height={16} strokeWidth={200} className="text-zinc-900 dark:text-white" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">
                      COSMO Objekts
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    S{member.id < 10 ? `0${member.id}` : member.id}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-display text-zinc-950 dark:text-white">
                  {member.name} Digital Vault
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  Browse official First Class Objekts, Special Class editions, and seasonal photocards registered in the MODHAUS ecosystem.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-950 dark:text-white group-hover:underline flex items-center gap-1.5">
                  <TriplesLogo width={13} height={13} strokeWidth={220} className="text-zinc-900 dark:text-white" />
                  <span>Open Member Vault</span>
                </span>
                <ArrowUpRight className="btn-arrow h-4 w-4 text-zinc-950 dark:text-white" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Dimensions Formations Section (Act 4) ── */}
      {matchedUnits.length > 0 && (
        <section className="py-14 md:py-20 border-b border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#08080A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight flex items-baseline gap-2">
                  <span>Dimensions</span>
                  <span className="font-accent text-xl sm:text-2xl font-normal text-zinc-500 dark:text-zinc-400">
                    formations
                  </span>
                </h2>
                <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                  {matchedUnits.length} Official Formations
                </p>
              </div>

              {/* Slider Controls (if > 3 units) */}
              {totalDimensionPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mr-1.5 hidden sm:inline">
                    {dimensionPage + 1} / {totalDimensionPages}
                  </span>
                  <button
                    onClick={() =>
                      setDimensionPage((prev) => (prev > 0 ? prev - 1 : totalDimensionPages - 1))
                    }
                    className="p-2.5 rounded-full bg-zinc-100 dark:bg-[#14141B] border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all shadow-sm active:scale-95"
                    aria-label="Previous Dimension page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDimensionPage((prev) => (prev < totalDimensionPages - 1 ? prev + 1 : 0))
                    }
                    className="p-2.5 rounded-full bg-zinc-100 dark:bg-[#14141B] border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all shadow-sm active:scale-95"
                    aria-label="Next Dimension page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Dimension Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={dimensionPage}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentDimensionUnits.map((unit) => (
                  <div
                    key={unit.slug}
                    className="spotlight-card group rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-[#0D0D12] transition-all flex flex-col justify-between shadow-sm"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <Image
                        src={unit.image}
                        alt={unit.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
                          {unit.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white">
                          {unit.era}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold font-display text-zinc-950 dark:text-white">
                          {unit.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed line-clamp-3 font-sans">
                          {unit.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between">
                        <Link
                          href={`/sub-units/${unit.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors"
                        >
                          <span>Explore Dimension</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Indicator Dots */}
            {totalDimensionPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: totalDimensionPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setDimensionPage(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      dimensionPage === i
                        ? "w-8 bg-zinc-950 dark:bg-white"
                        : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-500"
                    }`}
                    aria-label={`Go to Dimension page ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 6. More tripleS Member Slider (Act 5: OT24 Ribbon) ── */}
      <section className="py-14 md:py-20 border-b border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-[#08080A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight">
                More tripleS
              </h2>
              <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                OT24 Full Roster &bull; S1 to S24
              </p>
            </div>

            {/* Slider Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollMemberSlider("left")}
                className="p-2.5 rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all shadow-sm active:scale-95"
                aria-label="Previous members"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollMemberSlider("right")}
                className="p-2.5 rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all shadow-sm active:scale-95"
                aria-label="Next members"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Smooth Horizontal Swiper / Drag Track */}
          <div
            ref={memberSliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-1 snap-x select-none cursor-grab active:cursor-grabbing overscroll-x-contain"
          >
            {allMembersList.map((m) => {
              const isCurrent = m.id === member.id
              const mColor = getMemberColor(m.id)
              return (
                <Link
                  key={m.id}
                  href={`/members/${m.slug}`}
                  data-active={isCurrent ? "true" : undefined}
                  onClickCapture={(e) => {
                    if (hasMoved) {
                      e.preventDefault()
                      e.stopPropagation()
                    }
                  }}
                  draggable={false}
                  className={`spotlight-card group shrink-0 w-32 sm:w-40 md:w-44 rounded-xl overflow-hidden border transition-all snap-start shadow-sm ${
                    isCurrent
                      ? "border-zinc-950 dark:border-white ring-2 ring-zinc-950/20 dark:ring-white/30 scale-[1.02]"
                      : "border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30"
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    {/* Side strip in official member color */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 z-20"
                      style={{ backgroundColor: mColor }}
                      aria-hidden="true"
                    />
                    <Image
                      src={`https://i.imgur.com/${m.image}`}
                      alt={`${m.name} (S${m.id}) profile photo`}
                      fill
                      sizes="(max-width: 640px) 130px, 180px"
                      loading="lazy"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Top S-number tag */}
                    <div className="absolute top-2 left-2.5 z-10 flex items-center gap-1 pointer-events-none">
                      <span
                        className="text-[11px] font-mono font-bold"
                        style={{ color: mColor === "#FFFFFF" ? "#F4F4F6" : mColor }}
                      >
                        S{m.id < 10 ? `0${m.id}` : m.id}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 text-center z-10 pointer-events-none">
                      <p className="text-xs sm:text-sm font-bold text-white truncate font-display group-hover:text-zinc-200">
                        {m.name}
                      </p>
                      {m.hangul && (
                        <p className="text-[10px] font-mono text-zinc-300 truncate">
                          ({m.hangul})
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Photo Lightbox Modal ── */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setActivePhoto(null)}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 transition-colors z-10 focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
              aria-label="Close image lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="relative max-w-2xl max-h-[85vh] w-full h-full rounded-2xl overflow-hidden border border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePhoto}
                alt={`${member.name} full high-resolution portrait view`}
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
