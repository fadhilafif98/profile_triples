"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ChevronLeft, ChevronRight, X, Play, ExternalLink, Sparkles, ArrowRight } from "lucide-react"
import { members, getMemberBySlug, Member } from "@/utils/members"

// ─── Sub-Unit Data Map for Dimension Section ─────────────────────────────────
const unitInfoMap: Record<string, { title: string; image: string; description: string; href?: string }> = {
  "Acid Angel from Asia": {
    title: "Acid Angel from Asia",
    image: "/sub-units/sub_unit_AAA.jpg",
    description: "Atom01 시즌 최초의 Grand Gravity 유닛. 'Generation'을 통해 아시아와 Z세대의 트렌디하고 반항적인 유스 컬처를 선보였다.",
    href: "/sub-units/acid-angel-from-asia",
  },
  "+(KR)ystal Eyes": {
    title: "+(KR)ystal Eyes",
    image: "/sub-units/sub_unit_KRE.jpg",
    description: "Atom01 시즌 두 번째 유닛. Y2K 시티팝과 하이틴 감성을 재해석한 미니 1집 <AESTHETIC>과 디지털 싱글 <Touch+>를 발매했다.",
    href: "/sub-units/krystal-eyes",
  },
  "ACID EYES": {
    title: "ACID EYES",
    image: "/sub-units/sub_unit_ACID_EYES.jpg",
    description: "Acid Angel from Asia와 +(KR)ystal Eyes 멤버 8인이 결합한 tripleS 최초의 컬래버레이션 싱글 <Cherry Gene> 유닛.",
    href: "/sub-units/acid-eyes",
  },
  "LOVElution": {
    title: "LOVElution",
    image: "/sub-units/sub_unit_Lovelution.jpg",
    description: "Binary01 시즌 8인조 유닛. 당당한 자기 확신과 자본주의 유스 감성을 담은 타이틀곡 'Girls' Capitalism'과 <ↀ> (MUHAN)을 발매했다.",
    href: "/sub-units/lovelution",
  },
  "EVOLution": {
    title: "EVOLution",
    image: "/sub-units/sub_unit_EVOLution.jpg",
    description: "Binary01 시즌 8인조 유닛. 다이내믹한 에너지와 신비로운 세계관을 담은 타이틀곡 'Invincible'과 미니 1집 <⟡> (MUJUK)을 발매했다.",
    href: "/sub-units/evolution",
  },
  "NXT": {
    title: "NXT",
    image: "/sub-units/sub_unit_TripleS_NXT.jpg",
    description: "S17~S20 신규 멤버 공개와 함께 결성된 4인조 댄스 유닛. 파워풀한 데뷔 디지털 싱글 'Just Do It'을 선보였다.",
    href: "/sub-units/nxt",
  },
  "Aria": {
    title: "Aria",
    image: "/sub-units/sub_unit_Aria_Door.jpg",
    description: "Cream01 시즌 결성된 최초의 발라드 디멘션. 헤이즈(Heize)가 작사한 애절한 타이틀곡 'Door'와 싱글 <Structure of Sadness>를 발매했다.",
    href: "/sub-units/aria",
  },
  "Glow": {
    title: "Glow",
    image: "/sub-units/sub_unit_Glow.jpg",
    description: "S21~S24 최종 멤버들의 완전체 합류를 알린 유닛. 상큼하고 청량한 데뷔 디지털 싱글 'Inner Dance'를 발매했다.",
    href: "/sub-units/glow",
  },
  "Visionary Vision": {
    title: "Visionary Vision (VV)",
    image: "/sub-units/sub_unit_Visionary_Vision.jpg",
    description: "tripleS 최초의 12인조 댄스 특화 하이엔드 퍼포먼스 정규 디멘션. 정규 앨범 <Performante>와 타이틀곡 'Hit the Floor'를 선보였다.",
    href: "/sub-units/visionary-vision",
  },
  "∞! (Hatchi!)": {
    title: "∞! (Hatch! / Hatchi)",
    image: "/sub-units/sub_unit_hatchi.jpg",
    description: "8인조 공식 일본 디멘션. 일본 데뷔 싱글 <Untitled>와 일본 미니 1집 <SecretHimitsuBimil>을 발매하며 글로벌 행보를 이어가고 있다.",
    href: "/sub-units/hatchi",
  },
  "Alphie": {
    title: "Alphie",
    image: "/sub-units/sub_unit_Alphie.jpg",
    description: "Grand Gravity를 통해 결성된 8인조 일렉트로 팝 스페셜 디멘션.",
    href: "/sub-units/alphie",
  },
  "moon": {
    title: "Moon (msnz)",
    image: "/sub-units/sub_unit_Moon_v2.jpg",
    description: "msnz 프로젝트의 야상곡 컨셉 유닛. S22 설린이 리더를 맡아 몽환적이고 서정적인 매력을 선보인다.",
    href: "/sub-units/moon",
  },
  "sun": {
    title: "Sun (msnz)",
    image: "/sub-units/sub_unit_Sun.jpg",
    description: "msnz 프로젝트의 태양 컨셉 유닛. S15 신위가 리더를 맡아 찬란하고 에너제틱한 퍼포먼스를 선보인다.",
    href: "/sub-units/sun",
  },
  "neptune": {
    title: "Neptune (msnz)",
    image: "/sub-units/sub_unit_Neptune.jpg",
    description: "msnz 프로젝트의 해왕성 컨셉 유닛. 깊은 바다와 같은 웅장한 보컬과 랩의 조화를 선보인다.",
    href: "/sub-units/neptune",
  },
  "zenith": {
    title: "Zenith (msnz)",
    image: "/sub-units/sub_unit_Zenith.jpg",
    description: "msnz 프로젝트의 천정 컨셉 유닛. 천상의 하모니와 다이내믹한 칼군무를 선보인다.",
    href: "/sub-units/zenith",
  },
}

// ─── Career Activities Timeline Generator ───────────────────────────────────
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
function getAge(dateStr: string) {
  const birth = new Date(dateStr + "T00:00:00")
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function getZodiac(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  const month = d.getMonth() + 1
  const day = d.getDate()
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "물병자리 (Aquarius ♒)"
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "물고기자리 (Pisces ♓)"
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "양자리 (Aries ♈)"
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "황소자리 (Taurus ♉)"
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "쌍둥이자리 (Gemini ♊)"
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "게자리 (Cancer ♋)"
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "사자자리 (Leo ♌)"
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "처녀자리 (Virgo ♍)"
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "천칭자리 (Libra ♎)"
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "전갈자리 (Scorpio ♏)"
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "사수자리 (Sagittarius ♐)"
  return "염소자리 (Capricorn ♑)"
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

  // Keep window at the top on member change
  useEffect(() => {
    if (mounted) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    }
  }, [mounted, member?.id])

  // Auto-center active member in slider horizontally without moving window
  useEffect(() => {
    if (memberSliderRef.current && mounted) {
      const slider = memberSliderRef.current
      const activeEl = slider.querySelector<HTMLElement>('[data-active="true"]')
      if (activeEl) {
        const targetScroll = activeEl.offsetLeft - (slider.clientWidth / 2) + (activeEl.clientWidth / 2)
        slider.scrollTo({ left: Math.max(0, targetScroll), behavior: "smooth" })
      }
    }
  }, [mounted, member?.id])

  if (!member) return null

  const allMembersList: Member[] = Object.values(members).sort((a, b) => a.id - b.id)
  const currentIdx = allMembersList.findIndex((m) => m.id === member.id)
  const prevMember = currentIdx > 0 ? allMembersList[currentIdx - 1] : allMembersList[allMembersList.length - 1]
  const nextMember = currentIdx < allMembersList.length - 1 ? allMembersList[currentIdx + 1] : allMembersList[0]

  const careerList = careerMap[member.id] || []

  // Resolve matching dimension unit details
  const matchedUnits = (member.subUnits || [])
    .map((unitName) => {
      if (unitInfoMap[unitName]) return unitInfoMap[unitName]
      if (unitName.includes("Hatchi") || unitName.includes("∞!")) return unitInfoMap["∞! (Hatchi!)"]
      if (unitName.includes("Visionary") || unitName.includes("VV")) return unitInfoMap["Visionary Vision"]
      if (unitName.toLowerCase().includes("moon")) return unitInfoMap["moon"]
      if (unitName.toLowerCase().includes("sun")) return unitInfoMap["sun"]
      if (unitName.toLowerCase().includes("neptune")) return unitInfoMap["neptune"]
      if (unitName.toLowerCase().includes("zenith")) return unitInfoMap["zenith"]
      if (unitName.toLowerCase().includes("alphie")) return unitInfoMap["Alphie"]
      return null
    })
    .filter((u, index, self): u is typeof unitInfoMap[string] => Boolean(u) && self.findIndex(t => t?.title === u?.title) === index)

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
    return <div className="min-h-screen bg-[#000000]" />
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-zinc-900 dark:text-white selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors">
      {/* ── 1. Top Navigation Bar & Member Switcher ── */}
      <div className="sticky top-0 z-30 bg-white/85 dark:bg-black/85 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between pr-16 sm:pr-20">
          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">[ Members Directory ]</span>
            <span className="sm:hidden font-semibold">Members</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href={`/members/${prevMember.slug}`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all shrink-0 shadow-sm"
              title={`Prev: S${prevMember.id} ${prevMember.name}`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>S{prevMember.id}</span>
            </Link>

            <span className="text-[11px] sm:text-xs font-mono text-zinc-500 dark:text-zinc-500 font-bold px-1 whitespace-nowrap">
              S{member.id} / 24
            </span>

            <Link
              href={`/members/${nextMember.slug}`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all shrink-0 shadow-sm"
              title={`Next: S${nextMember.id} ${nextMember.name}`}
            >
              <span>S{nextMember.id}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Integrated Member Profile & Dossier (Zero-Scroll Above the Fold) ── */}
      <section className="pt-6 sm:pt-8 md:pt-10 pb-16 md:pb-24 border-b border-zinc-200 dark:border-zinc-900 bg-gradient-to-b from-zinc-50 via-zinc-100/40 to-[#fafafa] dark:from-[#070707] dark:via-[#020202] dark:to-[#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-14 items-start">
            
            {/* Left Column: Official Portrait Photo & Bio Statement */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="md:col-span-5 space-y-6 md:sticky md:top-20"
            >
              {/* Official Photo Card */}
              <div 
                onClick={() => setActivePhoto(`https://i.imgur.com/${member.image}`)}
                className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-lg dark:shadow-2xl border border-zinc-300 dark:border-zinc-800/90 bg-zinc-100 dark:bg-zinc-950 group cursor-zoom-in"
              >
                <Image
                  src={`https://i.imgur.com/${member.image}`}
                  alt={member.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                
                {member.gif && (
                  <img
                    src={`https://i.giphy.com/media/v1.${member.gif}`}
                    alt={`${member.name} animation`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                {/* S-number outline typography */}
                <div className="absolute top-3.5 left-4 z-10 pointer-events-none">
                  <span
                    className="text-3xl sm:text-4xl font-black tracking-tighter text-transparent select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                    style={{
                      WebkitTextStroke: "1.8px rgba(255, 255, 255, 0.95)",
                    }}
                  >
                    S{member.id}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-zinc-300">
                  <span className="font-semibold">{member.role}</span>
                  <span className="text-zinc-500 group-hover:text-white transition-colors text-[10px] sm:text-xs">Click to zoom</span>
                </div>
              </div>

              {/* Bio Summary Quote / Statement */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 shadow-md dark:shadow-lg">
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-pretendard">
                  <span className="text-zinc-900 dark:text-white font-bold mr-1">S{member.id}</span>
                  {member.funFacts && member.funFacts[0] 
                    ? member.funFacts[0] 
                    : `tripleS의 S${member.id} 멤버로서 다채로운 매력과 퍼포먼스를 선보이고 있다.`}
                </p>
              </div>
            </motion.div>

            {/* Right Column: Member Title, Bento Stats & Specification Table */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="md:col-span-7 space-y-8"
            >
              {/* Member Headline Header */}
              <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 dark:bg-black/85 border border-zinc-200 dark:border-zinc-700/80 text-xs font-mono font-bold text-zinc-900 dark:text-white shadow-sm dark:shadow-md">
                    tripleS &bull; S{member.id}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-300">
                    {member.representativeEmoji}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex flex-wrap items-baseline gap-2.5 sm:gap-3.5 font-pretendard">
                  <span>{member.name}</span>
                  {member.hangul && (
                    <span className="text-xl sm:text-2xl md:text-3xl font-normal text-zinc-500 dark:text-zinc-500 font-mono">
                      ({member.hangul})
                    </span>
                  )}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                  <p className="text-xs sm:text-sm font-mono text-zinc-500 dark:text-zinc-400">
                    {member.role} &bull; {member.nationality}
                  </p>
                  <Link
                    href={`/objekts?member=${encodeURIComponent(member.name)}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-200 transition-all hover:scale-105 shadow-sm w-fit"
                  >
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span>View {member.name}&apos;s Objekts</span>
                    <ArrowRight className="h-3 w-3 opacity-60" />
                  </Link>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between pb-3 mb-5">
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight font-pretendard">
                    Official Profile
                  </h2>
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">[ SPECIFICATIONS ]</span>
                </div>

                {/* ── Quick Stats Bento Grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 mb-8">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-md flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">MBTI</span>
                    <p className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white font-mono mt-1">{member.mbti}</p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-md flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">HEIGHT</span>
                    <p className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white font-mono mt-1">{member.height || "N/A"}</p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-md flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">BLOOD TYPE</span>
                    <p className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white font-mono mt-1">Type {member.bloodType || "N/A"}</p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-md flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">ZODIAC</span>
                    <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white font-pretendard mt-1 truncate">
                      {getZodiac(member.birthday)}
                    </p>
                  </div>
                </div>

                {/* ── Airy Profile Grid Table ── */}
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800/70 text-sm md:text-base">
                  
                  {/* Stage Name */}
                  <div className="py-4 grid grid-cols-3 sm:grid-cols-12 gap-3 items-baseline">
                    <span className="sm:col-span-4 font-bold text-zinc-900 dark:text-white font-pretendard">Stage Name (예명 / 활동명)</span>
                    <span className="col-span-2 sm:col-span-8 text-zinc-800 dark:text-zinc-300 font-mono font-bold">
                      {member.name} ({member.hangul})
                    </span>
                  </div>

                  {/* Birth Name */}
                  <div className="py-4 grid grid-cols-3 sm:grid-cols-12 gap-3 items-baseline">
                    <span className="sm:col-span-4 font-bold text-zinc-900 dark:text-white font-pretendard">Birth Name (본명)</span>
                    <span className="col-span-2 sm:col-span-8 text-zinc-800 dark:text-zinc-300 font-mono">
                      {member.birthName || member.name} ({member.birthNameHangul || member.hangul}{member.nativeName ? ` / ${member.nativeName}` : ""})
                    </span>
                  </div>

                  {/* Birthday & Age */}
                  <div className="py-4 grid grid-cols-3 sm:grid-cols-12 gap-3 items-baseline">
                    <span className="sm:col-span-4 font-bold text-zinc-900 dark:text-white font-pretendard">Birthday (생년월일)</span>
                    <span className="col-span-2 sm:col-span-8 text-zinc-800 dark:text-zinc-300">
                      {member.birthday} <span className="text-zinc-500 text-xs font-mono">({getAge(member.birthday)}세)</span>
                    </span>
                  </div>

                  {/* Origin / Nationality */}
                  <div className="py-4 grid grid-cols-3 sm:grid-cols-12 gap-3 items-baseline">
                    <span className="sm:col-span-4 font-bold text-zinc-900 dark:text-white font-pretendard">Origin (출생 / 국적)</span>
                    <span className="col-span-2 sm:col-span-8 text-zinc-800 dark:text-zinc-300">
                      {member.birthplace || member.nationality} <span className="text-zinc-500 text-xs font-mono">({member.nationality})</span>
                    </span>
                  </div>

                  {/* Reveal Date */}
                  <div className="py-4 grid grid-cols-3 sm:grid-cols-12 gap-3 items-baseline">
                    <span className="sm:col-span-4 font-bold text-zinc-900 dark:text-white font-pretendard">Reveal Date (공개일)</span>
                    <span className="col-span-2 sm:col-span-8 text-zinc-800 dark:text-zinc-300 font-mono">
                      {member.revealDate || "N/A"}
                    </span>
                  </div>

                  {/* Representative Symbol */}
                  <div className="py-4 grid grid-cols-3 sm:grid-cols-12 gap-3 items-baseline">
                    <span className="sm:col-span-4 font-bold text-zinc-900 dark:text-white font-pretendard">Symbol (상징)</span>
                    <span className="col-span-2 sm:col-span-8 text-zinc-800 dark:text-zinc-300">
                      {member.representativeEmoji}
                    </span>
                  </div>

                  {/* Career Activities */}
                  <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-start">
                    <span className="sm:col-span-4 font-bold text-zinc-900 dark:text-white font-pretendard">Career (활동 경력)</span>
                    <div className="sm:col-span-8 space-y-1.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-300 font-mono">
                      {careerList.map((item, i) => (
                        <div key={i} className="leading-relaxed">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* History & Bio Dossier */}
                  {member.funFacts && member.funFacts.length > 0 && (
                    <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-start">
                      <span className="sm:col-span-4 font-bold text-zinc-900 dark:text-white font-pretendard">History & Bio (이력)</span>
                      <ul className="sm:col-span-8 space-y-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                        {member.funFacts.map((fact, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-zinc-400 dark:text-zinc-500 font-mono shrink-0 mt-0.5">•</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. Gallery & Media Grid (triplescosmos.com grid-3) ── */}
      <section className="py-14 md:py-20 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-100/60 dark:bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-pretendard">
              Gallery & Teasers
            </h2>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">[ VISUAL ARCHIVE ]</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {/* Primary Portrait */}
            <div 
              onClick={() => setActivePhoto(`https://i.imgur.com/${member.image}`)}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 cursor-pointer group shadow-md dark:shadow-lg"
            >
              <Image
                src={`https://i.imgur.com/${member.image}`}
                alt={`${member.name} Photo 1`}
                fill
                loading="lazy"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-black/80 border border-white/20 text-white">
                  View Full
                </span>
              </div>
            </div>

            {/* Highlight Moment GIF */}
            {member.gif && (
              <div 
                onClick={() => setActivePhoto(`https://i.giphy.com/media/v1.${member.gif}`)}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 cursor-pointer group shadow-md dark:shadow-lg"
              >
                <img
                  src={`https://i.giphy.com/media/v1.${member.gif}`}
                  alt={`${member.name} Moment`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 border border-white/10 text-emerald-400 flex items-center gap-1">
                    <Play className="h-2.5 w-2.5 fill-current" /> MOMENT
                  </span>
                </div>
              </div>
            )}

            {/* Sub-Unit Context Card / Teaser Placeholder */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-950 p-6 flex flex-col justify-between shadow-sm dark:shadow-lg">
              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block">
                  tripleS Cosmos
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-pretendard">
                  S{member.id} {member.name}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-4 leading-relaxed font-mono">
                  {member.role} &bull; {member.nationality} &bull; {member.mbti}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
                <Link
                  href="/sub-units"
                  className="inline-flex items-center gap-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors"
                >
                  Explore Dimensions <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Dimension Section (section-dimension - triplescosmos style) ── */}
      {matchedUnits.length > 0 && (
        <section className="py-14 md:py-24 border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#000000]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-pretendard">
                  Dimension
                </h2>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-500 mt-1 uppercase tracking-widest">
                  [ {matchedUnits.length} OFFICIAL FORMATIONS ]
                </p>
              </div>

              {/* Swiper Controls (Rendered if > 3 units) */}
              {totalDimensionPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mr-1.5 hidden sm:inline">
                    {dimensionPage + 1} / {totalDimensionPages}
                  </span>
                  <button
                    onClick={() => setDimensionPage((prev) => (prev > 0 ? prev - 1 : totalDimensionPages - 1))}
                    className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm active:scale-95"
                    aria-label="Previous Dimension slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDimensionPage((prev) => (prev < totalDimensionPages - 1 ? prev + 1 : 0))}
                    className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm active:scale-95"
                    aria-label="Next Dimension slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Dimension Cards (Max 3 visible per slide with smooth animation) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={dimensionPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {currentDimensionUnits.map((unit, idx) => (
                  <div
                    key={idx}
                    className="group rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/70 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between shadow-md dark:shadow-2xl"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <Image
                        src={unit.image}
                        alt={unit.title}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    </div>

                    <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors font-pretendard">
                          {unit.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed line-clamp-4">
                          {unit.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
                        <Link
                          href={unit.href || "/albums"}
                          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                        >
                          Discography & Tracks &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            {totalDimensionPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: totalDimensionPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setDimensionPage(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      dimensionPage === i ? "w-8 bg-zinc-900 dark:bg-white" : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-500"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 6. More tripleS Member Slider (team-slider-max - triplescosmos style) ── */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-zinc-100 via-zinc-50 to-[#fafafa] dark:from-[#000000] dark:via-zinc-950 dark:to-[#000000] border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-pretendard">
                More tripleS
              </h2>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-500 mt-1 uppercase tracking-widest">
                [ ALL 24 MEMBERS &bull; OT24 ROSTER ]
              </p>
            </div>

            {/* Slider Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollMemberSlider("left")}
                className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-md active:scale-95"
                aria-label="Previous members"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollMemberSlider("right")}
                className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-md active:scale-95"
                aria-label="Next members"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Smooth Horizontal Swiper / Slider Track */}
          <div
            ref={memberSliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 snap-x select-none cursor-grab active:cursor-grabbing overscroll-x-contain"
          >
            {allMembersList.map((m) => {
              const isCurrent = m.id === member.id
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
                  className={`group shrink-0 w-36 sm:w-44 md:w-48 rounded-2xl overflow-hidden border transition-all snap-start shadow-md ${
                    isCurrent
                      ? "border-zinc-900 dark:border-white ring-2 ring-zinc-900/20 dark:ring-white/30 bg-zinc-100 dark:bg-zinc-900 scale-[1.02]"
                      : "border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-500 bg-white dark:bg-zinc-950/80"
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <Image
                      src={`https://i.imgur.com/${m.image}`}
                      alt={m.name}
                      fill
                      sizes="(max-width: 640px) 150px, 200px"
                      loading="lazy"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* S-number outline typography */}
                    <div className="absolute top-2 left-2.5 z-10 pointer-events-none">
                      <span
                        className="text-base sm:text-lg font-black tracking-tighter text-transparent select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                        style={{
                          WebkitTextStroke: isCurrent ? "1.4px #ffffff" : "1.2px rgba(255, 255, 255, 0.85)",
                        }}
                      >
                        S{m.id}
                      </span>
                    </div>

                    {isCurrent && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black">
                          ACTIVE
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center">
                      <p className="text-xs sm:text-sm font-bold text-white truncate font-pretendard group-hover:text-zinc-200">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setActivePhoto(null)}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 transition-colors z-10"
              aria-label="Close image"
            >
              <X className="h-5 w-5" />
            </button>

            <div 
              className="relative max-w-2xl max-h-[85vh] w-full h-full rounded-2xl overflow-hidden border border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePhoto}
                alt="Member preview full"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
