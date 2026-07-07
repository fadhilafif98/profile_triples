"use client"

import { notFound } from "next/navigation"
import { use, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Globe, Star, Sparkles } from "lucide-react"
import { members, getMemberBySlug } from "@/utils/members"

// ─── helpers ────────────────────────────────────────────────────────────────

function formatBirthday(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function getAge(dateStr: string) {
  const birth = new Date(dateStr + "T00:00:00")
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function getDaysUntilBirthday(dateStr: string) {
  const now = new Date()
  const birth = new Date(dateStr + "T00:00:00")
  const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
  if (next < now) next.setFullYear(now.getFullYear() + 1)
  const diff = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

function getZodiac(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  const m = d.getMonth() + 1
  const day = d.getDate()
  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return "♈ Aries"
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return "♉ Taurus"
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return "♊ Gemini"
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return "♋ Cancer"
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return "♌ Leo"
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return "♍ Virgo"
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return "♎ Libra"
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return "♏ Scorpio"
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return "♐ Sagittarius"
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return "♑ Capricorn"
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return "♒ Aquarius"
  return "♓ Pisces"
}

const mbtiDescriptions: Record<string, { title: string; traits: string[] }> = {
  ISFP: { title: "The Adventurer", traits: ["Curious", "Artistic", "Gentle", "Sensitive"] },
  ESTP: { title: "The Entrepreneur", traits: ["Bold", "Energetic", "Direct", "Perceptive"] },
  INTP: { title: "The Logician", traits: ["Analytical", "Inventive", "Reserved", "Flexible"] },
  "ESFP-A": { title: "The Entertainer", traits: ["Playful", "Sociable", "Spontaneous", "Vivacious"] },
  ESFP: { title: "The Entertainer", traits: ["Playful", "Sociable", "Spontaneous", "Vivacious"] },
  ENTP: { title: "The Debater", traits: ["Creative", "Clever", "Assertive", "Curious"] },
  INFP: { title: "The Mediator", traits: ["Idealistic", "Empathetic", "Creative", "Gentle"] },
  ISTP: { title: "The Virtuoso", traits: ["Practical", "Observant", "Direct", "Private"] },
  ENFP: { title: "The Campaigner", traits: ["Enthusiastic", "Creative", "Sociable", "Optimistic"] },
  ISFJ: { title: "The Defender", traits: ["Supportive", "Reliable", "Patient", "Imaginative"] },
  INTJ: { title: "The Architect", traits: ["Strategic", "Independent", "Decisive", "Curious"] },
  ENFJ: { title: "The Protagonist", traits: ["Charismatic", "Empathetic", "Inspiring", "Natural Leader"] },
  INFJ: { title: "The Advocate", traits: ["Insightful", "Principled", "Passionate", "Private"] },
}

// ─── stat pill ───────────────────────────────────────────────────────────────
function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:border-purple-500/40 transition-all group cursor-default"
    >
      <span className="text-purple-400 group-hover:text-pink-400 transition-colors">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-white font-semibold">{value}</p>
      </div>
    </motion.div>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────
export default function MemberProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const member = getMemberBySlug(slug)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!member) notFound()

  const allMembers = Object.values(members)
  const related = allMembers.filter((m) => m.id !== member.id).sort(() => 0.5 - Math.random()).slice(0, 6)
  const daysUntil = getDaysUntilBirthday(member.birthday)
  const mbtiInfo = mbtiDescriptions[member.mbti] ?? { title: "Unique", traits: [] }

  // prev / next navigation
  const sorted = allMembers.sort((a, b) => a.id - b.id)
  const idx = sorted.findIndex((m) => m.id === member.id)
  const prev = idx > 0 ? sorted[idx - 1] : null
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null

  if (!mounted) {
    return <div className="min-h-screen bg-black" />
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:py-16">
      {/* Back button */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-full px-4 py-2 transition-all hover:border-purple-500/50"
        >
          <ArrowLeft className="h-4 w-4" /> All Members
        </Link>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column: Image & Basic Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-5 lg:col-span-4 space-y-6 md:sticky md:top-8 h-fit"
        >
          {/* Main Photo with GIF overlay */}
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-white/5">
            <Image
              src={`https://i.imgur.com/${member.image}`}
              alt={member.name}
              fill
              priority
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            {member.gif && (
              <img
                src={`https://i.giphy.com/media/v1.${member.gif}`}
                alt="GIF"
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase tracking-widest text-pink-400 font-medium">
                tripleS Member #{member.id}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
                {member.name}
                <span className="text-xl">{member.representativeEmoji}</span>
              </h1>
              <p className="text-pink-300 font-medium mt-1">{member.role}</p>
            </div>
          </div>

          {/* Prev/Next Navigation */}
          <div className="flex gap-4">
            {prev ? (
              <Link
                href={`/members/${prev.slug}`}
                className="flex-1 flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-2xl p-4 transition-all group"
              >
                <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Prev</p>
                  <p className="font-semibold text-sm truncate">{prev.name}</p>
                </div>
              </Link>
            ) : <div className="flex-1" />}
            {next ? (
              <Link
                href={`/members/${next.slug}`}
                className="flex-1 flex items-center justify-end gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-2xl p-4 transition-all group text-right"
              >
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Next</p>
                  <p className="font-semibold text-sm truncate">{next.name}</p>
                </div>
                <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors rotate-180" />
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </motion.div>

        {/* Right Column: Detailed Info & Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-7 lg:col-span-8 space-y-8"
        >
          {/* Stat Pills Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatPill icon={<Calendar className="h-5 w-5" />} label="Birthday" value={formatBirthday(member.birthday)} />
            <StatPill icon={<Star className="h-5 w-5" />} label="Age" value={`${getAge(member.birthday)} years old`} />
            <StatPill icon={<Globe className="h-5 w-5" />} label="Nationality" value={member.nationality} />
            <StatPill icon={<Sparkles className="h-5 w-5" />} label="MBTI" value={member.mbti} />
          </div>

          {/* Birthday Countdown */}
          <motion.div
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-purple-900/10 to-transparent p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
            <div className="text-center sm:text-left">
              <p className="text-xs uppercase tracking-widest text-purple-300 mb-1">Next Birthday</p>
              <p className="text-gray-400 text-sm">
                Zodiac: <span className="font-semibold text-purple-200">{getZodiac(member.birthday)}</span>
              </p>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                {daysUntil}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {daysUntil === 1 ? "day to go! 🎂" : daysUntil === 0 ? "Today is the day! 🎉🎂" : "days to go 🎂"}
              </p>
            </div>
          </motion.div>

          {/* Personality / MBTI */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-purple-400">✦</span> Personality
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="shrink-0">
                <span className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                  {member.mbti}
                </span>
                <p className="text-pink-300 font-semibold text-sm mt-1">{mbtiInfo.title}</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs mb-2">Key traits</p>
                <div className="flex flex-wrap gap-2">
                  {mbtiInfo.traits.map((t) => (
                    <motion.span
                      key={t}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-200"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GIF Showcase */}
          {member.gif && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-pink-400">✦</span> Moments
              </h2>
              <div className="rounded-3xl overflow-hidden border border-pink-500/20 shadow-xl bg-white/5 aspect-video relative max-h-[360px]">
                <img
                  src={`https://i.giphy.com/media/v1.${member.gif}`}
                  alt={`${member.name} gif`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Related / Also check out */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-pink-400">✦</span> Also check out
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {related.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/members/${m.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all bg-white/5"
                  >
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={`https://i.imgur.com/${m.image}`}
                        alt={m.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                        <p className="text-[10px] font-semibold text-white truncate">{m.name}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
