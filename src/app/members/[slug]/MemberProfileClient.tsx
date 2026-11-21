"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  ArrowUpRight,
  Maximize2,
  Crown,
} from "lucide-react"
import TriplesLogo from "@/components/triples-logo"
import ObjektImage from "@/components/objekt-image"
import { Member } from "@/types/member"
import { Objekt } from "@/types/objekt"
import { members, getMemberBySlug, getMemberColor, getReadableMemberColor, getMemberImageUrl } from "@/lib/members"
import { fetchLatestObjektForMember } from "@/lib/objekts"
import { getSubUnitsForMember } from "@/lib/sub-units"
import Breadcrumb from "@/components/breadcrumb"
import ThemeImage from "@/components/theme-image"
import { useDialogA11y, useSafeReducedMotion } from "@/lib/a11y"
import { useIsDarkMode } from "@/lib/theme"

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
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26 Leader)",
    "2026.10 msnz Neptune ‘Welcome to Heaven’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  2: [
    "2022.11 Acid Angel from Asia ‘Generation’ (ACCESS)",
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.07 ACID EYES ‘Cherry Gene’",
    "2023.08 LOVElution ‘Girls' Capitalism’ (MUHAN)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’ (Performante)",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.09 msnz Sun ‘DNA’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
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
    "2026.02 ∞! (Hatchi!) ‘Tokimetick’",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
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
    "2026.02 ∞! (Hatchi!) ‘Tokimetick’",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.09 msnz Sun ‘DNA’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
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
    "2026.02 ∞! (Hatchi!) ‘Tokimetick’",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.09 msnz Sun ‘DNA’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  6: [
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.05 +(KR)ystal Eyes ‘Cherry Talk’",
    "2023.07 ACID EYES ‘Cherry Gene’",
    "2023.10 EVOLution ‘Invincible’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.11 ∞! (Hatchi!) ‘Untitled’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2026.02 ∞! (Hatchi!) ‘Tokimetick’",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
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
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.10 msnz Neptune ‘Welcome to Heaven’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  8: [
    "2022.11 Acid Angel from Asia ‘Generation’",
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.07 ACID EYES ‘Cherry Gene’",
    "2023.08 LOVElution ‘Girls' Capitalism’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  9: [
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.08 LOVElution ‘Girls' Capitalism’",
    "2024.01 Aria ‘Door’ (Structure of Sadness)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.08 msnz Moon ‘Dream Dress’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  10: [
    "2023.02 tripleS ‘Rising’ (ASSEMBLE)",
    "2023.08 LOVElution ‘Girls' Capitalism’ (Leader)",
    "2024.01 Aria ‘Door’ (Leader)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.10 msnz Neptune ‘Welcome to Heaven’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  11: [
    "2023.10 EVOLution ‘Invincible’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2024.11 ∞! (Hatchi!) ‘Untitled’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.10 ∞! (Hatchi!) ‘SecretHimitsuBimil’",
    "2026.02 ∞! (Hatchi!) ‘Tokimetick’",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.10 msnz Neptune ‘Welcome to Heaven’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  12: [
    "2023.10 EVOLution ‘Invincible’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  13: [
    "2023.08 LOVElution ‘Girls' Capitalism’",
    "2024.01 Aria ‘Door’ (Structure of Sadness)",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.10 msnz Neptune ‘Welcome to Heaven’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  14: [
    "2023.06 +(KR)ystal Eyes ‘Touch+’ (Featuring/Producer)",
    "2023.08 LOVElution ‘Girls' Capitalism’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.08 msnz Moon ‘Dream Dress’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  15: [
    "2023.08 LOVElution ‘Girls' Capitalism’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.11 msnz ‘Beyond Beauty’ (Leader)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.09 msnz Sun ‘DNA’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  16: [
    "2023.10 EVOLution ‘Invincible’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.11 ∞! (Hatchi!) ‘Untitled’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.10 ∞! (Hatchi!) ‘SecretHimitsuBimil’",
    "2026.02 ∞! (Hatchi!) ‘Tokimetick’",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.09 msnz Sun ‘DNA’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  17: [
    "2023.12 tripleS NXT ‘Just Do It’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.08 msnz Moon ‘Dream Dress’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  18: [
    "2023.12 tripleS NXT ‘Just Do It’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  19: [
    "2023.12 tripleS NXT ‘Just Do It’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  20: [
    "2023.12 tripleS NXT ‘Just Do It’",
    "2024.05 tripleS ‘Girls Never Die’ (ASSEMBLE24)",
    "2024.11 ∞! (Hatchi!) ‘Untitled’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.10 ∞! (Hatchi!) ‘SecretHimitsuBimil’",
    "2026.02 ∞! (Hatchi!) ‘Tokimetick’",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.08 msnz Moon ‘Dream Dress’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  21: [
    "2024.06 tripleS Glow ‘Inner Dance’",
    "2024.11 ∞! (Hatchi!) ‘Untitled’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.10 ∞! (Hatchi!) ‘SecretHimitsuBimil’",
    "2026.02 ∞! (Hatchi!) ‘Tokimetick’",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.09 msnz Sun ‘DNA’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  22: [
    "2024.06 tripleS Glow ‘Inner Dance’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.11 msnz ‘Beyond Beauty’ (moon Leader)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.08 msnz Moon ‘Dream Dress’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  23: [
    "2024.06 tripleS Glow ‘Inner Dance’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.11 msnz ‘Beyond Beauty’ (neptune)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.10 msnz Neptune ‘Welcome to Heaven’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
  ],
  24: [
    "2024.06 tripleS Glow ‘Inner Dance’",
    "2024.10 Visionary Vision ‘Hit the Floor’",
    "2025.05 tripleS ‘Are You Alive’ (ASSEMBLE25)",
    "2025.11 msnz ‘Beyond Beauty’ (moon)",
    "2026.06 tripleS ‘Baby Flower’ (ASSEMBLE26)",
    "2026.08 msnz Moon ‘Dream Dress’",
    "2026.10 tripleS ‘ANDLESS’ 4th World Tour",
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
  initialLatestObjekt?: Objekt | null
}

export default function MemberProfileClient({
  slug,
  initialLatestObjekt = null,
}: MemberProfileClientProps) {
  const member = getMemberBySlug(slug)
  const [gifActivated, setGifActivated] = useState(false)
  const [latestObjekt, setLatestObjekt] = useState<Objekt | null>(initialLatestObjekt)
  const [isLoadingObjekt, setIsLoadingObjekt] = useState<boolean>(!initialLatestObjekt)
  const [prevMemberId, setPrevMemberId] = useState(member?.id)
  if (member?.id !== prevMemberId) {
    setPrevMemberId(member?.id)
    setGifActivated(false)
    setLatestObjekt(initialLatestObjekt)
    setIsLoadingObjekt(!initialLatestObjekt)
  }
  const [activePhoto, setActivePhoto] = useState<string | null>(null)
  const shouldReduceMotion = useSafeReducedMotion()
  const isDark = useIsDarkMode()

  // More tripleS Slider Drag State & Auto-Center
  const memberSliderRef = useRef<HTMLDivElement>(null)
  const lightboxRef = useRef<HTMLDialogElement>(null)
  const isDraggingRef = useRef(false)
  const hasMovedRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  // Scroll top on member change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [member?.id])

  // Client fallback when SSR snapshot timed out
  useEffect(() => {
    if (!member || initialLatestObjekt) return
    let active = true
    fetchLatestObjektForMember(member.name)
      .then((objekt) => {
        if (!active) return
        setLatestObjekt(objekt)
        setIsLoadingObjekt(false)
      })
      .catch(() => {
        if (active) setIsLoadingObjekt(false)
      })
    return () => {
      active = false
    }
  }, [member, initialLatestObjekt])

  // Auto-center active member in slider horizontally without window jump
  useEffect(() => {
    if (memberSliderRef.current) {
      const slider = memberSliderRef.current
      const activeEl = slider.querySelector<HTMLElement>('[data-active="true"]')
      if (activeEl) {
        const targetScroll =
          activeEl.offsetLeft - slider.clientWidth / 2 + activeEl.clientWidth / 2
        slider.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: shouldReduceMotion ? "auto" : "smooth",
        })
      }
    }
  }, [member?.id, shouldReduceMotion])

  const closeLightbox = useCallback(() => setActivePhoto(null), [])
  useDialogA11y(Boolean(activePhoto), lightboxRef, closeLightbox)

  // Matched sub-units resolved from single source of truth
  const memberDimensions = useMemo(() => {
    if (!member) return []
    return getSubUnitsForMember(member.id)
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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || !memberSliderRef.current) return
    isDraggingRef.current = true
    hasMovedRef.current = false
    startXRef.current = e.pageX - memberSliderRef.current.offsetLeft
    scrollLeftRef.current = memberSliderRef.current.scrollLeft
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || !isDraggingRef.current || !memberSliderRef.current) return
    e.preventDefault()
    const x = e.pageX - memberSliderRef.current.offsetLeft
    const walk = (x - startXRef.current) * 1.5
    if (Math.abs(walk) > 5) hasMovedRef.current = true
    memberSliderRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return
    isDraggingRef.current = false
    setTimeout(() => {
      hasMovedRef.current = false
    }, 80)
  }

  const scrollMemberSlider = (direction: "left" | "right") => {
    if (memberSliderRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420
      memberSliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      })
    }
  }

  return (
    <div className="min-h-dvh bg-[#FAFAFA] dark:bg-[#08080A] text-zinc-950 dark:text-zinc-100 selection:bg-[#D4FF00] selection:text-black transition-colors pt-20 sm:pt-24 lg:pt-28">
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
                className="btn-magnetic flex items-center gap-1.5 min-h-8 px-3 py-1.5 rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#08080A]"
                title={`Previous: S${prevMember.id} ${prevMember.name}`}
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>S{prevMember.id < 10 ? `0${prevMember.id}` : prevMember.id}</span>
              </Link>

              <span className="flex items-center gap-1.5 min-h-8 text-xs font-mono text-zinc-800 dark:text-zinc-200 font-bold px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 whitespace-nowrap">
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
                className="btn-magnetic flex items-center gap-1.5 min-h-8 px-3 py-1.5 rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#08080A]"
                title={`Next: S${nextMember.id} ${nextMember.name}`}
              >
                <span>S{nextMember.id < 10 ? `0${nextMember.id}` : nextMember.id}</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
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
            <div className="lg:col-span-5">
              <button
                type="button"
                onClick={() => setActivePhoto(getMemberImageUrl(member, isDark))}
                onPointerEnter={(e) => {
                  if (
                    e.pointerType === "mouse" &&
                    member.gif &&
                    !gifActivated &&
                    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ) {
                    setGifActivated(true)
                  }
                }}
                onFocus={() => {
                  if (
                    member.gif &&
                    !gifActivated &&
                    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ) {
                    setGifActivated(true)
                  }
                }}
                className="spotlight-card group relative block text-left aspect-3/4 w-full max-w-120 mx-auto rounded-2xl overflow-hidden shadow-md border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#0D0D12] cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
                aria-label={`Enlarge official portrait photo of ${member.name}`}
              >
                {/* Signature Member Color Strip */}
                <span
                  className="block absolute left-0 top-0 bottom-0 w-1.5 z-30 transition-[width] duration-300 group-hover:w-2"
                  style={{ backgroundColor: memberColor }}
                  aria-hidden="true"
                />

                {/* Top S-Number Tag */}
                <span className="block absolute top-3.5 right-3.5 z-20 pointer-events-none">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-tight px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white shadow-sm">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getReadableMemberColor(memberColor, true) }}
                      aria-hidden="true"
                    />
                    <span>S{member.id < 10 ? `0${member.id}` : member.id}</span>
                  </span>
                </span>

                {/* Portrait Image */}
                <ThemeImage
                  src={getMemberImageUrl(member, isDark)}
                  alt={`${member.name} (${member.birthName || member.name}) official profile portrait`}
                  variant="curtain"
                  fill
                  preload
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-top transition-transform duration-700 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
                />

                {/* Silky Crossfade GIF on Hover */}
                {gifActivated && member.gif && (
                  <img
                    src={`https://i.giphy.com/media/v1.${member.gif}`}
                    alt={`${member.name} highlight motion`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                  />
                )}

                {/* Bottom Contrast Scrim */}
                <span className="block absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/85 via-black/30 to-transparent pointer-events-none z-10" />

                {/* Bottom Card Caption */}
                <span className="flex absolute bottom-3.5 inset-x-4 items-center justify-between text-xs font-mono text-zinc-300 z-20 pointer-events-none">
                  <span className="truncate font-medium">{member.role}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 group-hover:text-white transition-colors shrink-0 ml-2">
                    <Maximize2 className="h-3 w-3" />
                    <span>Zoom</span>
                  </span>
                </span>
              </button>
            </div>

            {/* Right Column: Identity Masthead & Structured Bento Specifications */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.45,
                delay: shouldReduceMotion ? 0 : 0.08,
              }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Masthead Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 ring-1 ring-black/15 dark:ring-white/25"
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
                      <span
                        suppressHydrationWarning
                        className="text-xs font-normal font-sans text-zinc-500 dark:text-zinc-400"
                      >
                        ({getAge(member.birthday)} yrs &bull; {getZodiac(member.birthday)})
                      </span>
                    </dd>
                  </div>

                  {/* 2. Birthplace & Nationality */}
                  <div className="space-y-1">
                    <dt className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
                      Birthplace &amp; Nationality
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
                    Dimensions &bull; {memberDimensions.length} {memberDimensions.length === 1 ? "Unit" : "Units"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {memberDimensions.length > 0 ? (
                    memberDimensions.map(({ unit: u, isLeader }) => (
                      <Link
                        key={u.slug}
                        href={`/sub-units/${u.slug}`}
                        className="inline-flex items-center gap-1.5 min-h-8 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0D0D12] hover:bg-zinc-100 dark:hover:bg-white/10 border border-zinc-200/80 dark:border-white/10 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#08080A]"
                        title={isLeader ? `${u.name} (Official Leader)` : u.name}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: memberColor }}
                          aria-hidden="true"
                        />
                        <span>{u.name.replace(/\s*\([^)]*\)/, "")}</span>
                        {isLeader && (
                          <Crown
                            className="w-3 h-3 text-amber-500 dark:text-[#D4FF00] shrink-0"
                            aria-hidden="true"
                          />
                        )}
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
              <span>Career &amp;</span>
              <span className="font-accent text-xl sm:text-2xl font-normal text-zinc-500 dark:text-zinc-400">
                Facts
              </span>
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
              Releases &bull; Dimensions &bull; SIGNAL Trivia
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Career Timeline */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h3 className="text-lg font-bold font-display text-zinc-950 dark:text-white tracking-tight">
                  Career Timeline
                </h3>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Album releases, Dimension debuts, and world tours
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
                          className="absolute -left-7.75 top-1.5 w-2 h-2 rounded-full border-2 border-white dark:border-[#08080A] shadow-sm transition-transform group-hover:scale-125"
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

            {/* Right: Member Trivia & Facts */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h3 className="text-lg font-bold font-display text-zinc-950 dark:text-white tracking-tight">
                  Member Trivia &amp; Facts
                </h3>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Official profile facts and SIGNAL highlights
                </p>
              </div>

              {/* SIGNAL Reveal Highlight Card */}
              {member.funFacts && member.funFacts[0] && (
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#0D0D12] border border-zinc-200/80 dark:border-white/10 shadow-sm relative overflow-hidden">
                  <div
                    className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-zinc-200/40 dark:from-white/5 to-transparent rounded-bl-full pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: memberColor }}
                      aria-hidden="true"
                    />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">
                      SIGNAL Reveal Highlight
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
                      className="p-4 rounded-xl bg-white dark:bg-[#0D0D12] border border-zinc-200/80 dark:border-white/10 shadow-sm flex items-start gap-3.5 transition-colors hover:border-zinc-300 dark:hover:border-white/20"
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
      <section className="py-10 sm:py-14 md:py-20 border-b border-zinc-200/80 dark:border-white/10 bg-zinc-50/70 dark:bg-[#07070a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-5 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight">
              Visual Archive
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
              Concept Photography &bull; SIGNAL Moments &bull; Digital Objekts
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {/* 1. Official Concept Portrait */}
            <button
              type="button"
              onClick={() => setActivePhoto(getMemberImageUrl(member, isDark))}
              className="spotlight-card relative block w-full text-left aspect-3/4 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 cursor-zoom-in group shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
              aria-label={`Enlarge official concept photo of ${member.name}`}
            >
              <ThemeImage
                src={getMemberImageUrl(member, isDark)}
                alt={`${member.name} official concept portrait`}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-500 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
              />
              <span className="block absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />
              <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-center justify-center motion-reduce:transition-none">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3.5 py-1.5 rounded-full bg-black/80 border border-white/20 text-white">
                  <Maximize2 className="h-3 w-3" aria-hidden="true" />
                  <span>Inspect View</span>
                </span>
              </span>
              <span className="block absolute bottom-2.5 left-3 right-3 sm:bottom-3.5 sm:left-4 text-[10px] sm:text-[11px] font-mono text-white drop-shadow-md truncate">
                Official Concept Photo
              </span>
            </button>

            {/* 2. Live SIGNAL Moment (GIF) */}
            {member.gif ? (
              <button
                type="button"
                onClick={() => setActivePhoto(`https://i.giphy.com/media/v1.${member.gif}`)}
                className="spotlight-card relative block w-full text-left aspect-3/4 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 cursor-zoom-in group shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
                aria-label={`Enlarge signal moment animation for ${member.name}`}
              >
                <img
                  src={`https://i.giphy.com/media/v1.${member.gif}`}
                  alt={`${member.name} daily SIGNAL clip`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
                />
                <span className="block absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />
                <span className="block absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/75 backdrop-blur-sm border border-white/20 text-white inline-flex items-center gap-1 sm:gap-1.5 shadow-sm">
                    <Play className="h-2.5 w-2.5 fill-current text-[#D4FF00]" aria-hidden="true" />
                    <span>SIGNAL</span>
                    <span className="hidden sm:inline">MOMENT</span>
                  </span>
                </span>
                <span className="block absolute bottom-2.5 left-3 right-3 sm:bottom-3.5 sm:left-4 text-[10px] sm:text-[11px] font-mono text-white drop-shadow-md truncate">
                  Daily SIGNAL Moment
                </span>
              </button>
            ) : null}

            {/* 3. Latest COSMO Objekt Showcase & Member Vault Link */}
            <Link
              href={`/objekts?member=${encodeURIComponent(member.name)}`}
              className={`spotlight-card group relative block rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0D0D12] shadow-sm hover:border-zinc-400 dark:hover:border-white/30 transition-[border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00] ${
                member.gif ? "col-span-2 lg:col-span-1 lg:aspect-3/4" : "aspect-3/4"
              }`}
            >
              <article className="relative h-full p-4 sm:p-5 flex flex-col justify-between gap-3.5">
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 z-20"
                  style={{ backgroundColor: memberColor }}
                  aria-hidden="true"
                />

                {/* Top Meta Header */}
                <div className="flex items-center justify-between gap-2 pl-1.5 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <TriplesLogo
                      width={15}
                      height={15}
                      strokeWidth={200}
                      decorative
                      className="text-zinc-900 dark:text-white shrink-0"
                    />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold truncate">
                      Latest Objekt
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 shrink-0">
                    {latestObjekt
                      ? `${latestObjekt.season} · ${latestObjekt.collectionNo}`
                      : `S${member.id < 10 ? `0${member.id}` : member.id}`}
                  </span>
                </div>

                {/* Center Showcase: Horizontal on Mobile/Tablet, Full Photocard Stage on Desktop */}
                <div className="flex lg:flex-col items-center lg:justify-center gap-4 lg:gap-2.5 pl-1.5 flex-1 min-h-0">
                  {latestObjekt ? (
                    <div className="relative shrink-0 w-24 sm:w-28 lg:w-auto lg:h-full lg:max-h-[290px] aspect-[1/1.55] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 shadow-md transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none">
                      <ObjektImage
                        season={latestObjekt.season}
                        member={latestObjekt.member}
                        slug={latestObjekt.slug}
                        side="front"
                        fallbackSrc={latestObjekt.frontImage || latestObjekt.thumbnailImage}
                        alt={`${member.name} latest Objekt ${latestObjekt.season} ${latestObjekt.collectionNo}`}
                        sizes="(max-width: 1024px) 120px, 240px"
                        className="w-full h-full object-cover"
                      />
                      {latestObjekt.collectionNo && (
                        <div
                          className="absolute right-0 top-0 bottom-0 w-[11.2%] flex items-center justify-center pointer-events-none select-none z-10"
                          aria-hidden="true"
                        >
                          <span
                            className="font-bold text-[7px] sm:text-[8px] lg:text-[9.5px] tracking-wider whitespace-nowrap rotate-90 leading-none uppercase font-display"
                            style={{ color: latestObjekt.textColor || "#000000" }}
                          >
                            {latestObjekt.collectionNo}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : isLoadingObjekt ? (
                    <div className="shrink-0 w-24 sm:w-28 lg:w-auto lg:h-full lg:max-h-[290px] aspect-[1/1.55] rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 animate-pulse" />
                  ) : null}

                  {/* Compact details beside Objekt on mobile/tablet (hidden on desktop where photocard fills the stage) */}
                  <div className={`min-w-0 space-y-1.5 ${latestObjekt ? "lg:hidden" : ""}`}>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-zinc-950 dark:text-white tracking-tight text-balance leading-snug">
                      {latestObjekt
                        ? `${latestObjekt.season} ${latestObjekt.class}`
                        : `${member.name} Digital Vault`}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans text-pretty line-clamp-3">
                      {latestObjekt?.description
                        ? latestObjekt.description
                        : `Browse ${member.name}'s official First Class, Special Class, and Double Class Objekts across all COSMO seasons.`}
                    </p>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="pt-3 pl-1.5 border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between shrink-0">
                  <span className="text-xs font-mono font-bold text-zinc-950 dark:text-white group-hover:underline flex items-center gap-1.5">
                    <TriplesLogo
                      width={13}
                      height={13}
                      strokeWidth={220}
                      decorative
                      className="text-zinc-900 dark:text-white"
                    />
                    <span>Open {member.name} Vault</span>
                  </span>
                  <ArrowUpRight className="btn-arrow h-4 w-4 text-zinc-950 dark:text-white" aria-hidden="true" />
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Dimensions Formations Section (Act 4) ── */}
      {memberDimensions.length > 0 && (
        <section className="py-10 sm:py-14 md:py-20 border-b border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#08080A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-5 sm:mb-8 md:mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight text-balance">
                  Dimensions
                </h2>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
                  {memberDimensions.length} Official {memberDimensions.length === 1 ? "Formation" : "Formations"}
                </p>
              </div>

              <Link
                href="/sub-units"
                className="nav-draw-link group/all text-xs font-mono uppercase tracking-[0.16em] font-bold text-zinc-950 dark:text-[#D4FF00] pb-0.5 inline-flex items-center gap-1.5 shrink-0 min-h-8 [@media(pointer:coarse)]:min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00] rounded-sm"
              >
                <span>All Dimensions</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover/all:translate-x-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover/all:-translate-y-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <ul role="list" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
              {memberDimensions.map(({ unit, isLeader }) => (
                <li key={unit.slug}>
                  <Link
                    href={`/sub-units/${unit.slug}`}
                    className="group block rounded-xl sm:rounded-2xl active:scale-[0.99] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
                  >
                    <article>
                      <div className="relative aspect-3/2 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-200/70 dark:bg-zinc-900">
                        <Image
                          src={unit.image || "/placeholder.svg"}
                          alt={`${unit.name} concept photo`}
                          fill
                          loading="lazy"
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-center transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                        />
                      </div>

                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-zinc-200/80 dark:border-white/10 space-y-1 sm:space-y-1.5">
                        <h3 className="flex items-start gap-1 sm:gap-1.5 font-display font-bold text-sm sm:text-base lg:text-lg tracking-tight leading-snug text-balance text-zinc-950 dark:text-white transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-zinc-600 dark:[@media(hover:hover)_and_(pointer:fine)]:group-hover:text-[#D4FF00]">
                          <span>{unit.name}</span>
                          {isLeader && (
                            <>
                              <Crown
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1 text-amber-500 dark:text-amber-400 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="sr-only">(Leader)</span>
                            </>
                          )}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] font-mono text-zinc-600 dark:text-zinc-400 flex items-center justify-between gap-1.5 sm:gap-2">
                          <span className="truncate">{unit.era}</span>
                          <span className="tabular-nums shrink-0">{unit.members.length}M</span>
                        </p>
                      </div>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 6. More tripleS Member Slider (Act 5: OT24 Ribbon) ── */}
      <section className="pt-14 pb-12 md:pt-16 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight">
                More tripleS
              </h2>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
                OT24 Full Roster &bull; S1 to S24
              </p>
            </div>

            {/* Slider Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollMemberSlider("left")}
                className="p-2.5 min-w-9 min-h-9 inline-flex items-center justify-center rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-[color,border-color,transform] shadow-sm active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
                aria-label="Previous members"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollMemberSlider("right")}
                className="p-2.5 min-w-9 min-h-9 inline-flex items-center justify-center rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-[color,border-color,transform] shadow-sm active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
                aria-label="Next members"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Smooth Horizontal Swiper / Drag Track */}
          <div
            ref={memberSliderRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrCancel}
            onPointerCancel={handlePointerUpOrCancel}
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
                    if (hasMovedRef.current) {
                      e.preventDefault()
                      e.stopPropagation()
                    }
                  }}
                  draggable={false}
                  className={`spotlight-card group shrink-0 w-32 sm:w-40 md:w-44 rounded-xl overflow-hidden border transition-[border-color,box-shadow,transform] snap-start shadow-sm ${
                    isCurrent
                      ? "border-zinc-950 dark:border-white ring-2 ring-zinc-950/20 dark:ring-white/30 scale-[1.02]"
                      : "border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30"
                  }`}
                >
                  <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    {/* Side strip in official member color */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 z-20"
                      style={{ backgroundColor: mColor }}
                      aria-hidden="true"
                    />
                    <ThemeImage
                      src={getMemberImageUrl(m, isDark)}
                      alt={`${m.name} (S${m.id}) profile photo`}
                      fill
                      sizes="(max-width: 640px) 130px, 180px"
                      preload={isCurrent}
                      loading={isCurrent ? undefined : "lazy"}
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Top S-number tag */}
                    <div className="absolute top-2 left-2.5 z-10 flex items-center gap-1 pointer-events-none">
                      <span
                        className="text-[11px] font-mono font-bold"
                        style={{ color: getReadableMemberColor(mColor, true) }}
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
          <dialog
            ref={lightboxRef}
            closedby="any"
            aria-label={`${member.name} photo viewer`}
            className="open:m-auto open:p-0 open:max-w-none open:max-h-none open:bg-transparent open:border-0 open:flex open:items-center open:justify-center open:overflow-visible open:overscroll-contain backdrop:bg-[#08080A]/95 backdrop:backdrop-blur-md backdrop:overflow-hidden backdrop:overscroll-contain focus:outline-none"
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="fixed top-6 right-6 p-3 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 transition-colors z-10 focus-visible:ring-2 focus-visible:ring-[#D4FF00]"
              aria-label="Close image lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
              className="relative w-[min(42rem,calc(100vw-2rem))] h-[85dvh] rounded-2xl overflow-hidden border border-zinc-800"
            >
              <img
                src={activePhoto}
                alt={`${member.name} full high-resolution portrait view`}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
