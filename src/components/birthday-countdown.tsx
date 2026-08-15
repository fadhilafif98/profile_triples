"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCcw, RefreshCwOff, ArrowRight, Cake, Sparkles } from "lucide-react"
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

  if (!activeMember) return null

  const countdownUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ]

  const isTodayCelebrating = activeMember.isToday
  const isThisMonthPassed = activeMember.isThisMonth && activeMember.hasPassedThisYear && !activeMember.isToday
  const isCountdownActive = activeMember.daysUntil > 0 && activeMember.daysUntil <= 30 && !isThisMonthPassed

  return (
    <div className="relative overflow-hidden w-full">
      <div className="max-w-5xl mx-auto">
        <div className={`relative rounded-3xl border transition-all duration-500 overflow-hidden ${
          isTodayCelebrating
            ? "border-amber-300/70 dark:border-amber-500/30 bg-gradient-to-b from-amber-50/40 via-white/80 to-white/90 dark:from-amber-950/10 dark:via-zinc-900/60 dark:to-zinc-900/40 shadow-xl dark:shadow-2xl"
            : "border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/40 shadow-lg dark:shadow-2xl"
        } backdrop-blur-md p-6 sm:p-10`}>
          
          {isTodayCelebrating && <CosmicStardust />}

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* ── Left Column: Member Portrait Card ── */}
            <div className="md:col-span-5 flex justify-center">
              <motion.div
                key={`photo-${activeMember.id}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[3/4] w-full max-w-[280px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shadow-md dark:shadow-2xl group"
              >
                <Link
                  href={`/members/${activeMember.slug}`}
                  className="absolute inset-0 z-20"
                  aria-label={`View ${activeMember.name}'s profile`}
                />
                <Image
                  src={`https://i.imgur.com/${activeMember.image}`}
                  alt={activeMember.name}
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

                {/* Top Outline S# Badge & Emoji Pill */}
                <div className="absolute top-3 left-3.5 flex items-center gap-2.5 z-10">
                  <span
                    className="text-2xl sm:text-3xl font-black tracking-tighter text-transparent select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                    style={{ WebkitTextStroke: "1.8px rgba(255, 255, 255, 0.95)" }}
                  >
                    S{activeMember.id}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-zinc-700/80 text-zinc-200 shadow-md">
                    {activeMember.representativeEmoji}
                  </span>
                </div>

                {/* Bottom Role & CTA */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-zinc-300 z-10">
                  <span className="truncate max-w-[150px]">{activeMember.role}</span>
                  <span className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1 font-semibold">
                    Dossier <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ── Right Column: Info & Adaptive Display ── */}
            <div className="md:col-span-7 flex flex-col justify-between text-center md:text-left space-y-6">
              
              {/* Static Anchor Header with Smooth Internal Text Morphing */}
              <div>
                {/* Top Status Badge & Controls */}
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-3 mb-3">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider shadow-sm border transition-all ${
                    isTodayCelebrating
                      ? "bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-600/60 text-amber-800 dark:text-amber-300 font-bold"
                      : isCountdownActive
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-bold"
                        : "bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}>
                    {isTodayCelebrating ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
                        <span>TODAY&apos;S BIRTHDAY CELEBRATION</span>
                      </>
                    ) : isCountdownActive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>COUNTDOWN ACTIVE &bull; D-{activeMember.daysUntil}</span>
                      </>
                    ) : isThisMonthPassed ? (
                      <>
                        <span className="text-amber-500">🌟</span>
                        <span>{currentMonthName.toUpperCase()} CELEBRANT</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                        <span>UPCOMING &bull; D-{activeMember.daysUntil}</span>
                      </>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    {todayMembers.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedMemberId(todayMembers[0].id)
                          setViewCelebration(true)
                        }}
                        className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors shadow-sm"
                      >
                        Today&apos;s Star
                      </button>
                    )}

                    <button
                      onClick={() => setAutoRotate(!autoRotate)}
                      title={autoRotate ? "Pause auto-rotate" : "Resume auto-rotate"}
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

                {/* Animated Member Title & Info Reveal */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`header-${activeMember.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-pretendard flex flex-wrap items-baseline justify-center md:justify-start gap-2.5">
                      <span>{activeMember.name}</span>
                      {activeMember.hangul && (
                        <span className="text-lg sm:text-2xl font-normal text-zinc-500 dark:text-zinc-500 font-mono">
                          ({activeMember.hangul})
                        </span>
                      )}
                    </h3>

                    <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 mt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span>{activeMember.formattedDate}</span>
                      <span className="text-zinc-400 dark:text-zinc-600">&bull;</span>
                      <span>{isThisMonthPassed ? "Turned" : activeMember.isToday ? "Turning" : "Turns"} {activeMember.turningAge} y.o</span>
                      <span className="text-zinc-400 dark:text-zinc-600">&bull;</span>
                      <span className="text-zinc-800 dark:text-zinc-300 font-medium">{activeMember.nationality}</span>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Fixed Identical-Height Switcher with Smooth Slide/Fade (h-94px) ── */}
              <div className="h-[88px] sm:h-[94px]">
                <AnimatePresence mode="wait" initial={false}>
                  {isTodayCelebrating ? (
                    <motion.div
                      key={`today-${activeMember.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-2xl bg-white/90 dark:bg-zinc-950/90 border border-amber-200/80 dark:border-amber-900/40 px-4 sm:px-5 py-3 shadow-sm dark:shadow-inner text-left flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                          <Cake className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">HAPPY {activeMember.name.toUpperCase()} DAY!</span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 leading-tight font-pretendard line-clamp-2">
                          &ldquo;{getBirthdayMessage(activeMember)}&rdquo;
                        </p>
                      </div>
                      <Link
                        href={`/members/${activeMember.slug}`}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md"
                      >
                        <span>Dossier</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </motion.div>
                  ) : isCountdownActive ? (
                    <motion.div
                      key={`countdown-${activeMember.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full w-full"
                    >
                      <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 h-full max-w-md mx-auto md:mx-0">
                        {countdownUnits.map((unit) => (
                          <div
                            key={unit.label}
                            className="h-full rounded-2xl bg-zinc-100/90 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 text-center shadow-sm dark:shadow-md hover:-translate-y-0.5 transition-transform flex flex-col items-center justify-center py-1.5"
                          >
                            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-mono tracking-tight leading-none">
                              {unit.value}
                            </div>
                            <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">
                              {unit.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`star-${activeMember.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-2xl bg-zinc-100/80 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 px-4 sm:px-5 py-3 shadow-sm text-left flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span>{currentMonthName.toUpperCase()} BIRTHDAY STAR</span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 leading-tight font-pretendard line-clamp-2">
                          Celebrated on {activeMember.formattedDate} &bull; Turned {activeMember.turningAge} years old.
                        </p>
                      </div>
                      <Link
                        href={`/members/${activeMember.slug}`}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md"
                      >
                        <span>Dossier</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Active Pipeline Queue with Spring Sliding Active Pill Indicator ── */}
              <div className="pt-3.5 sm:pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-[10px] sm:text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                    [ {currentMonthName.toUpperCase()} STARS &bull; H-30 RADAR ]
                  </p>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 flex-nowrap justify-start">
                  {pipelineQueue.map((m) => {
                    const isSelected = m.id === activeMember.id
                    const isPassedStar = m.isThisMonth && m.hasPassedThisYear && !m.isToday
                    const isImminent = m.daysUntil > 0 && m.daysUntil <= 30 && !isPassedStar
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMemberId(m.id)
                          setViewCelebration(false)
                        }}
                        className={`shrink-0 relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full border text-[11px] sm:text-xs font-mono transition-colors ${
                          isSelected
                            ? "border-transparent"
                            : "bg-zinc-100 dark:bg-zinc-950/70 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600"
                        }`}
                      >
                        {/* Smooth Spring Gliding Capsule Pill */}
                        {isSelected && (
                          <motion.div
                            layoutId="active-birthday-pill-indicator"
                            className="absolute inset-0 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black shadow-md z-0"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        )}

                        <span className={`relative z-10 text-[10px] ${isSelected ? "text-zinc-300 dark:text-zinc-600 font-bold" : "opacity-75"}`}>
                          S{m.id}
                        </span>
                        <span className={`relative z-10 font-semibold ${isSelected ? "text-white dark:text-black" : ""}`}>
                          {m.name}
                        </span>
                        <span className={`relative z-10 text-[10px] ${
                          isSelected
                            ? "text-zinc-300 dark:text-zinc-700 font-medium"
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