"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCcw, RefreshCwOff, ArrowRight, Cake } from "lucide-react"
import type { Member } from "@/utils/members"

interface BirthdayCountdownProps {
  members: Member[]
}

interface MemberBirthdayMeta extends Member {
  nextBirthday: Date
  daysUntil: number
  isToday: boolean
  isRecent: boolean
  daysSince: number
  turningAge: number
  formattedDate: string
  birthMonth: number
  birthDay: number
  isThisMonth: boolean
  hasPassedThisYear: boolean
}

// 8 lightweight GPU-accelerated Stardust particles (zero CPU overhead for mobile)
const STARDUST_PARTICLES = [
  { left: "12%", top: "75%", size: "text-xs", delay: 0, duration: 4.2 },
  { left: "28%", top: "65%", size: "text-[10px]", delay: 1.4, duration: 4.8 },
  { left: "48%", top: "80%", size: "text-sm", delay: 0.6, duration: 3.9 },
  { left: "68%", top: "70%", size: "text-xs", delay: 2.2, duration: 4.5 },
  { left: "82%", top: "75%", size: "text-sm", delay: 1.1, duration: 4.6 },
  { left: "92%", top: "60%", size: "text-[10px]", delay: 2.7, duration: 3.7 },
  { left: "22%", top: "35%", size: "text-xs", delay: 3.1, duration: 4.1 },
  { left: "78%", top: "30%", size: "text-xs", delay: 1.8, duration: 4.3 },
]

function CosmicStardust() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0" aria-hidden="true">
      {STARDUST_PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          initial={{ y: 0, opacity: 0, scale: 0.6 }}
          animate={{
            y: [-10, -65],
            opacity: [0, 0.85, 0],
            scale: [0.6, 1.1, 0.7],
            rotate: [0, 45, 90],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{ left: p.left, top: p.top }}
          className={`absolute text-amber-400 dark:text-amber-300 select-none ${p.size}`}
        >
          ✦
        </motion.span>
      ))}
    </div>
  )
}

// 24 Official Member Colors (MODHAUS Identity from GEMINI.md)
const MEMBER_ACCENTS: Record<number, { hex: string; name: string; border: string; glow: string }> = {
  1: { hex: "#17A7FE", name: "Azure Blue", border: "rgba(23,167,254,0.45)", glow: "rgba(23,167,254,0.18)" },
  2: { hex: "#8801FF", name: "Electric Violet", border: "rgba(136,1,255,0.45)", glow: "rgba(136,1,255,0.18)" },
  3: { hex: "#FFD800", name: "Warm Yellow", border: "rgba(255,216,0,0.5)", glow: "rgba(255,216,0,0.18)" },
  4: { hex: "#76C722", name: "Leaf Green", border: "rgba(118,199,34,0.45)", glow: "rgba(118,199,34,0.18)" },
  5: { hex: "#D10A70", name: "Vivid Magenta", border: "rgba(209,10,112,0.45)", glow: "rgba(209,10,112,0.18)" },
  6: { hex: "#FF95C8", name: "Soft Pink", border: "rgba(255,149,200,0.45)", glow: "rgba(255,149,200,0.18)" },
  7: { hex: "#538FC8", name: "Cerulean Blue", border: "rgba(83,143,200,0.45)", glow: "rgba(83,143,200,0.18)" },
  8: { hex: "#FF8AB8", name: "Blush Rose", border: "rgba(255,138,184,0.45)", glow: "rgba(255,138,184,0.18)" },
  9: { hex: "#FFA947", name: "Bright Tangerine", border: "rgba(255,169,71,0.45)", glow: "rgba(255,169,71,0.18)" },
  10: { hex: "#FF73B3", name: "Neon Rose", border: "rgba(255,115,179,0.45)", glow: "rgba(255,115,179,0.18)" },
  11: { hex: "#FFF554", name: "Lemon Yellow", border: "rgba(255,245,84,0.5)", glow: "rgba(255,245,84,0.18)" },
  12: { hex: "#4243A2", name: "Deep Indigo", border: "rgba(66,67,162,0.5)", glow: "rgba(66,67,162,0.2)" },
  13: { hex: "#FF9649", name: "Sunset Orange", border: "rgba(255,150,73,0.45)", glow: "rgba(255,150,73,0.18)" },
  14: { hex: "#2255A4", name: "Midnight Navy", border: "rgba(34,85,164,0.5)", glow: "rgba(34,85,164,0.2)" },
  15: { hex: "#D51312", name: "Scarlet Red", border: "rgba(213,19,18,0.45)", glow: "rgba(213,19,18,0.18)" },
  16: { hex: "#F88059", name: "Coral Apricot", border: "rgba(248,128,89,0.45)", glow: "rgba(248,128,89,0.18)" },
  17: { hex: "#7EAEF5", name: "Sky Glaze", border: "rgba(126,174,245,0.45)", glow: "rgba(126,174,245,0.18)" },
  18: { hex: "#C9FF50", name: "Lime Volt", border: "rgba(201,255,80,0.5)", glow: "rgba(201,255,80,0.2)" },
  19: { hex: "#85E3B3", name: "Sea Mint", border: "rgba(133,227,179,0.45)", glow: "rgba(133,227,179,0.18)" },
  20: { hex: "#FFAFD3", name: "Cherry Blossom", border: "rgba(255,175,211,0.45)", glow: "rgba(255,175,211,0.18)" },
  21: { hex: "#BEE6B5", name: "Pale Pistachio", border: "rgba(190,230,181,0.45)", glow: "rgba(190,230,181,0.18)" },
  22: { hex: "#FD82B8", name: "Bubblegum Pink", border: "rgba(253,130,184,0.45)", glow: "rgba(253,130,184,0.18)" },
  23: { hex: "#E2E8F0", name: "Pure Pearl", border: "rgba(226,232,240,0.5)", glow: "rgba(226,232,240,0.2)" },
  24: { hex: "#C99DF3", name: "Cosmic Lilac", border: "rgba(201,157,243,0.45)", glow: "rgba(201,157,243,0.18)" },
}

// Generate consistent celebration message
const getBirthdayMessage = (member: Member): string => {
  const messages = [
    `Happy Birthday to our incredible ${member.role || "member"}, ${member.name}! 🎉 Wishing you boundless joy, good health, and memorable moments!`,
    `Today we celebrate ${member.name}'s special day! 🎂 Thank you for illuminating tripleS with your talent and charm!`,
    `It's ${member.name}'s birthday! 🎈 May your new year be as radiant and inspiring as your stage performances!`,
    `Happy Birthday, ${member.name}! 💖 Your hard work and dedication continue to inspire WAV all around the world!`,
    `Celebrating the birth of our wonderful ${member.name}! 🌟 Here's to another unforgettable year in the cosmos!`,
  ]
  return messages[member.id % messages.length]
}

// Compute deterministic birthday metadata for a member
const computeBirthdayMeta = (member: Member, now: Date): MemberBirthdayMeta | null => {
  if (!member.birthday) return null
  const [bYear, bMonth, bDay] = member.birthday.split("-").map(Number)
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const todayMidnight = new Date(currentYear, now.getMonth(), now.getDate())

  const thisYearBirthday = new Date(currentYear, bMonth - 1, bDay)
  const isToday = thisYearBirthday.getTime() === todayMidnight.getTime()
  const hasPassedThisYear = thisYearBirthday < todayMidnight && !isToday
  const isThisMonth = bMonth === currentMonth

  let nextBirthday = thisYearBirthday
  if (hasPassedThisYear) {
    nextBirthday = new Date(currentYear + 1, bMonth - 1, bDay)
  }

  const daysUntil = isToday ? 0 : Math.round((nextBirthday.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24))
  
  const lastBirthday = new Date(nextBirthday)
  if (!isToday) {
    lastBirthday.setFullYear(lastBirthday.getFullYear() - 1)
  }
  const daysSince = Math.floor((todayMidnight.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24))
  const isRecent = daysSince >= 0 && daysSince <= 7

  const displayDate = (isThisMonth && hasPassedThisYear) ? thisYearBirthday : nextBirthday
  const turningAge = displayDate.getFullYear() - bYear
  const formattedDate = displayDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return {
    ...member,
    nextBirthday,
    daysUntil,
    isToday,
    isRecent,
    daysSince,
    turningAge,
    formattedDate,
    birthMonth: bMonth,
    birthDay: bDay,
    isThisMonth,
    hasPassedThisYear,
  }
}

export default function BirthdayCountdown({ members }: BirthdayCountdownProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null)
  const [viewCelebration, setViewCelebration] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const now = useMemo(() => new Date(), [])
  const currentMonthName = useMemo(() => {
    return now.toLocaleDateString("en-US", { month: "long" })
  }, [now])

  // Process all members sorted by closest upcoming birthday
  const processedMembers = useMemo(() => {
    const nowDate = new Date()
    return members
      .map((m) => computeBirthdayMeta(m, nowDate))
      .filter((m): m is MemberBirthdayMeta => m !== null)
      .sort((a, b) => a.daysUntil - b.daysUntil)
  }, [members])

  // Active birthday members (today)
  const todayMembers = useMemo(() => {
    return processedMembers.filter((m) => m.isToday)
  }, [processedMembers])

  // This current month's celebrants
  const currentMonthCelebrants = useMemo(() => {
    return processedMembers
      .filter((m) => m.isThisMonth)
      .sort((a, b) => a.birthDay - b.birthDay)
  }, [processedMembers])

  // Imminent upcoming birthdays (<= 30 days ahead and not passed this month)
  const imminentUpcoming = useMemo(() => {
    return processedMembers
      .filter((m) => m.daysUntil > 0 && m.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil)
  }, [processedMembers])

  // Combined Active Pipeline Queue
  const pipelineQueue = useMemo(() => {
    const list = [...currentMonthCelebrants]
    imminentUpcoming.forEach((imm) => {
      if (!list.some((item) => item.id === imm.id)) {
        list.push(imm)
      }
    })
    if (list.length === 0) return processedMembers.slice(0, 4)
    return list
  }, [currentMonthCelebrants, imminentUpcoming, processedMembers])

  // Determine active member
  const activeMember = useMemo(() => {
    if (selectedMemberId !== null) {
      const found = processedMembers.find((m) => m.id === selectedMemberId)
      if (found) return found
    }
    if (todayMembers.length > 0 && viewCelebration) return todayMembers[0]
    if (imminentUpcoming.length > 0) return imminentUpcoming[0]
    if (currentMonthCelebrants.length > 0) return currentMonthCelebrants[0]
    return processedMembers[0]
  }, [selectedMemberId, todayMembers, viewCelebration, imminentUpcoming, currentMonthCelebrants, processedMembers])

  // Timer countdown updater
  const updateCountdown = useCallback(() => {
    if (!activeMember) return
    const nowDate = new Date()
    const target = new Date(activeMember.nextBirthday)
    const diff = target.getTime() - nowDate.getTime()

    if (diff <= 0 || activeMember.isToday) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      return
    }

    setTimeLeft({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    })
  }, [activeMember])

  useEffect(() => {
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [updateCountdown])

  // Auto-rotate within active pipeline queue
  useEffect(() => {
    if (!autoRotate || pipelineQueue.length <= 1) return
    const timer = setInterval(() => {
      setSelectedMemberId((prev) => {
        const currentIdx = pipelineQueue.findIndex((m) => m.id === (prev ?? activeMember?.id))
        const nextIdx = (currentIdx + 1) % pipelineQueue.length
        return pipelineQueue[nextIdx].id
      })
    }, 8000)
    return () => clearInterval(timer)
  }, [autoRotate, pipelineQueue, activeMember])

  // 24 Member dynamic accent & live interactive wish state
  const memberAccent = activeMember
    ? (MEMBER_ACCENTS[activeMember.id] || { hex: "#D4FF00", name: "Acid Voltage", border: "rgba(212,255,0,0.45)", glow: "rgba(212,255,0,0.18)" })
    : { hex: "#D4FF00", name: "Acid Voltage", border: "rgba(212,255,0,0.45)", glow: "rgba(212,255,0,0.18)" }

  const [wished, setWished] = useState(false)
  const [wishCount, setWishCount] = useState(128 + (activeMember?.id || 1) * 7)

  // Reset wish state on active member switch
  useEffect(() => {
    setWished(false)
    if (activeMember) {
      setWishCount(128 + activeMember.id * 7)
    }
  }, [activeMember])

  const handleWish = () => {
    if (!wished) {
      setWished(true)
      setWishCount((prev) => prev + 1)
    }
  }

  if (!activeMember) return null

  const isTodayCelebrating = activeMember.isToday
  const isThisMonthPassed = activeMember.isThisMonth && activeMember.hasPassedThisYear && !activeMember.isToday
  const isCountdownActive = activeMember.daysUntil > 0 && activeMember.daysUntil <= 30 && !isThisMonthPassed

  return (
    <div className="relative w-full py-4 sm:py-6">
      <div className="max-w-5xl mx-auto">
        {/* Borderless Floating Editorial Layout (No Outer Box, No Nested Card) */}
        <div className="relative">
          {/* Ambient Cosmic Member Glow Bleed (No Box Stroke) */}
          <div
            className="absolute -top-24 left-1/4 w-[480px] h-[480px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 opacity-20 dark:opacity-25"
            style={{ backgroundColor: memberAccent.hex }}
            aria-hidden="true"
          />

          {isTodayCelebrating && <CosmicStardust />}

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* ── Left Column: Standalone Physical Objekt Collectible Card ── */}
            <div className="md:col-span-5 flex justify-center">
              <motion.div
                key={`photo-${activeMember.id}`}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[3/4.25] w-full max-w-[300px] rounded-2xl overflow-hidden p-1.5 transition-all duration-500 group"
                style={{
                  background: `linear-gradient(135deg, ${memberAccent.hex} 0%, rgba(255,255,255,0.18) 45%, rgba(0,0,0,0.7) 100%)`,
                  boxShadow: `0 24px 50px -12px rgba(0,0,0,0.55), 0 0 35px -5px ${memberAccent.glow}`,
                }}
              >
                {/* Physical Card Inner Core */}
                <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-zinc-950 border border-black/40">
                  <Link
                    href={`/members/${activeMember.slug}`}
                    className="absolute inset-0 z-30"
                    aria-label={`View ${activeMember.name}'s profile`}
                  />
                  
                  {/* Photo with Smooth Zoom */}
                  <Image
                    src={`https://i.imgur.com/${activeMember.image}`}
                    alt={`${activeMember.name} (${activeMember.birthName || activeMember.name}) birthday portrait`}
                    fill
                    sizes="(max-width: 768px) 300px, 340px"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Iridescent Foil Sheen Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/35 pointer-events-none" />

                  {/* Top Objekt Header Foil Sheet */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-black tracking-widest text-black shadow-sm"
                        style={{ backgroundColor: memberAccent.hex }}
                      >
                        S{activeMember.id.toString().padStart(2, "0")}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-white/85 bg-black/55 backdrop-blur-md px-2 py-0.5 rounded border border-white/15">
                        FIRST CLASS
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-white/90 shadow-sm">
                      {activeMember.representativeEmoji}
                    </span>
                  </div>

                  {/* Bottom Objekt Spec Foil Label */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
                    <div className="flex items-end justify-between border-t border-white/20 pt-2 text-white">
                      <div>
                        <p className="text-[10px] font-mono tracking-widest uppercase text-white/70">
                          {activeMember.hangul} &bull; {memberAccent.name}
                        </p>
                        <p className="text-lg font-display font-black tracking-tight leading-none text-white drop-shadow-md">
                          {activeMember.name}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-white/90 group-hover:text-white transition-colors flex items-center gap-1 font-semibold bg-white/15 px-2.5 py-1 rounded backdrop-blur-sm">
                        Dossier <ArrowRight className="h-2.5 w-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── Right Column: Info & Typographic Floating Display ── */}
            <div className="md:col-span-7 flex flex-col justify-center text-center md:text-left space-y-5">
              
              {/* Static Anchor Header */}
              <div>
                {/* Top Status Pill & Auto-rotate Toggle */}
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-3 mb-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider shadow-sm border transition-all ${
                      isTodayCelebrating
                        ? "bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-500/50 text-amber-900 dark:text-amber-200 font-bold"
                        : isCountdownActive
                          ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-600/50 text-emerald-800 dark:text-emerald-300 font-bold"
                          : "bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {isTodayCelebrating ? (
                      <>
                        <Cake className="w-3.5 h-3.5 text-amber-500" />
                        <span>TODAY&apos;S SOLAR RETURN</span>
                      </>
                    ) : isCountdownActive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>COUNTDOWN ACTIVE &bull; D-{activeMember.daysUntil}</span>
                      </>
                    ) : isThisMonthPassed ? (
                      <>
                        <span className="text-amber-500">✦</span>
                        <span>{currentMonthName.toUpperCase()} CELEBRANT</span>
                      </>
                    ) : (
                      <>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: memberAccent.hex }}
                        />
                        <span>ORBIT PIPELINE &bull; D-{activeMember.daysUntil}</span>
                      </>
                    )}
                  </div>

                  {/* Top Controls: Today star button & Auto rotate */}
                  <div className="flex items-center gap-2">
                    {todayMembers.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedMemberId(todayMembers[0].id)
                          setViewCelebration(true)
                        }}
                        className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-800 dark:text-zinc-200 transition-colors shadow-sm"
                      >
                        Today&apos;s Star
                      </button>
                    )}

                    <button
                      onClick={() => setAutoRotate(!autoRotate)}
                      title={autoRotate ? "Pause radar rotation" : "Resume radar rotation"}
                      className={`p-1.5 rounded-full border transition-all shadow-sm ${
                        autoRotate
                          ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                          : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500"
                      }`}
                      aria-label="Toggle auto-rotate"
                    >
                      {autoRotate ? <RefreshCcw className="h-3.5 w-3.5" /> : <RefreshCwOff className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Animated Member Title & Info Reveal (Fixed Height Container) */}
                <div className="min-h-[82px] sm:min-h-[90px] flex flex-col justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`header-${activeMember.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-baseline justify-center md:justify-start gap-3">
                        <h3 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-zinc-950 dark:text-white tracking-tight">
                          {activeMember.name}
                        </h3>
                        {activeMember.hangul && (
                          <span className="text-2xl sm:text-3xl font-mono text-zinc-400 dark:text-zinc-500 font-normal">
                            {activeMember.hangul}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 mt-1.5 flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className="font-semibold text-zinc-950 dark:text-white">{activeMember.formattedDate}</span>
                        <span className="text-zinc-400 dark:text-zinc-600">&bull;</span>
                        <span>{isThisMonthPassed ? "Turned" : activeMember.isToday ? "Turning" : "Turns"} {activeMember.turningAge} years old</span>
                        <span className="text-zinc-400 dark:text-zinc-600">&bull;</span>
                        <span>{activeMember.birthplace || activeMember.nationality}</span>
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Typographic Floating Time / Announcement (Strict Fixed Height - Zero Height Jump) ── */}
              <div className="h-[64px] sm:h-[68px] flex flex-col justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  {isTodayCelebrating ? (
                    <motion.div
                      key={`today-${activeMember.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="border-l-2 pl-4 text-left"
                      style={{ borderColor: memberAccent.hex }}
                    >
                      <p className="text-[11px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold mb-0.5">
                        Solar Return Announcement
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-snug font-pretendard line-clamp-2">
                        &ldquo;{getBirthdayMessage(activeMember)}&rdquo;
                      </p>
                    </motion.div>
                  ) : isCountdownActive ? (
                    <motion.div
                      key={`countdown-${activeMember.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-baseline justify-center md:justify-start gap-4 sm:gap-6 font-mono"
                    >
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
                          {timeLeft.days.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-wider">d</span>
                      </div>
                      <span className="text-xl sm:text-2xl text-zinc-300 dark:text-zinc-700">&bull;</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
                          {timeLeft.hours.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-wider">h</span>
                      </div>
                      <span className="text-xl sm:text-2xl text-zinc-300 dark:text-zinc-700">&bull;</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
                          {timeLeft.minutes.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-wider">m</span>
                      </div>
                      <span className="text-xl sm:text-2xl text-zinc-300 dark:text-zinc-700">&bull;</span>
                      <div className="flex items-baseline gap-1">
                        <span
                          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
                          style={{ color: memberAccent.hex }}
                        >
                          {timeLeft.seconds.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-wider">s</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`star-${activeMember.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="border-l-2 pl-4 text-left border-zinc-300 dark:border-zinc-700"
                    >
                      <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold mb-0.5">
                        {currentMonthName.toUpperCase()} CELEBRATION COMPLETED
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                        Celebrated on {activeMember.formattedDate} &bull; Turned {activeMember.turningAge} years old.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shared Persistent Action Bar (Never shifts, responsive layout) */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 pt-1">
                <button
                  onClick={handleWish}
                  className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-mono font-bold transition-all shrink-0 whitespace-nowrap ${
                    wished
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                      : "bg-zinc-950 dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 shadow-md"
                  }`}
                >
                  <span>{wished ? "Wished! 💖" : isTodayCelebrating ? "Send Wish ✦" : "Cheer Early ✦"}</span>
                  <span className="text-[10px] opacity-80 font-normal">({wishCount})</span>
                </button>
                <Link
                  href={`/members/${activeMember.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shrink-0 whitespace-nowrap"
                >
                  <span>View Dossier</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* ── Active Pipeline Queue with Crisp Mini Avatars ── */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <p className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                    {currentMonthName.toUpperCase()} STARS &bull; H-30 RADAR PIPELINE
                  </p>
                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
                    {pipelineQueue.length} Active
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-0.5 -mx-1 sm:mx-0 flex-nowrap justify-start">
                  {pipelineQueue.map((m) => {
                    const isSelected = m.id === activeMember.id
                    const isPassedStar = m.isThisMonth && m.hasPassedThisYear && !m.isToday
                    const isImminent = m.daysUntil > 0 && m.daysUntil <= 30 && !isPassedStar
                    const itemAccent = MEMBER_ACCENTS[m.id] || { hex: "#D4FF00" }

                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMemberId(m.id)
                          setViewCelebration(false)
                        }}
                        className={`shrink-0 relative flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-mono transition-all whitespace-nowrap ${
                          isSelected
                            ? "border-transparent"
                            : "bg-white/70 dark:bg-zinc-900/70 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 shadow-2xs"
                        }`}
                      >
                        {/* Smooth Spring Gliding Capsule Pill */}
                        {isSelected && (
                          <motion.div
                            layoutId="active-birthday-pill-indicator"
                            className="absolute inset-0 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-black shadow-md z-0"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        )}

                        {/* Mini Circular Photo Avatar with Member Color Rim */}
                        <div
                          className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 z-10 border bg-zinc-800"
                          style={{ borderColor: itemAccent.hex }}
                        >
                          <Image
                            src={`https://i.imgur.com/${m.image}`}
                            alt={`${m.name} (S${m.id}) avatar`}
                            fill
                            sizes="24px"
                            unoptimized
                            className="object-cover object-top"
                          />
                        </div>

                        <span className={`relative z-10 font-semibold ${isSelected ? "text-white dark:text-black" : ""}`}>
                          {m.name}
                        </span>

                        <span className={`relative z-10 text-[10px] ${
                          isSelected
                            ? "text-zinc-300 dark:text-zinc-600 font-medium"
                            : isImminent
                              ? "text-emerald-600 dark:text-emerald-400 font-bold"
                              : "text-zinc-500"
                        }`}>
                          {m.isToday ? "🎂 Today!" : isPassedStar ? `${currentMonthName.slice(0, 3)} ${m.birthDay} 🌟` : `D-${m.daysUntil}`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}