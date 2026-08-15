"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  Crown,
  Disc3,
  ExternalLink,
  Users,
  Radio,
  Music2,
} from "lucide-react"
import { getSubUnitBySlug, getAllSubUnits } from "@/lib/sub-units"
import { getMemberById } from "@/lib/members"
import { getAllAlbums } from "@/lib/albums"
import { Member } from "@/types/member"

interface SubUnitDetailClientProps {
  slug: string
}

export default function SubUnitDetailClient({ slug }: SubUnitDetailClientProps) {
  const unit = getSubUnitBySlug(slug)
  const allUnits = getAllSubUnits()
  const allAlbums = getAllAlbums()

  if (!unit) {
    notFound()
  }

  // Resolve full Member data for each tagged member
  const taggedMembers = useMemo(() => {
    if (!unit) return []
    return unit.members
      .map((entry) => {
        const match = entry.match(/^S(\d+)/i)
        const memberId = match ? parseInt(match[1], 10) : 0
        const isLeader = entry.toLowerCase().includes("(leader)")
        const member = getMemberById(memberId)
        return {
          entry,
          id: memberId,
          isLeader,
          member,
        }
      })
      .filter((item): item is { entry: string; id: number; isLeader: boolean; member: Member } => !!item.member)
  }, [unit])

  // Resolve related album releases for this sub-unit
  const relatedReleases = useMemo(() => {
    if (!unit) return []
    const unitNameClean = unit.name.toLowerCase().split(" (")[0]
    return allAlbums.filter((album) => {
      const aUnit = (album.unit || "").toLowerCase()
      if (unit.slug === "acid-angel-from-asia") return aUnit.includes("acid angel") || album.id === "01-access"
      if (unit.slug === "krystal-eyes") return aUnit.includes("krystal") || album.id === "03-aesthetic" || album.id === "04-touch"
      if (unit.slug === "acid-eyes") return aUnit.includes("acid eyes") || album.id === "05-cherry-gene"
      if (unit.slug === "lovelution") return aUnit.includes("lovelution") || album.id === "06-muhan"
      if (unit.slug === "evolution") return aUnit.includes("evolution") || album.id === "07-mujuk"
      if (unit.slug === "nxt") return aUnit.includes("nxt") || album.id === "08-just-do-it"
      if (unit.slug === "aria") return aUnit.includes("aria") || album.id === "09-structure-of-sadness"
      if (unit.slug === "glow") return aUnit.includes("glow") || album.id === "11-inner-dance"
      if (unit.slug === "visionary-vision") return aUnit.includes("visionary") || aUnit.includes("vv") || album.id === "13-performante"
      if (unit.slug === "hatchi") return aUnit.includes("hatchi") || aUnit.includes("∞!") || album.id === "14-untitled" || album.id === "16-secrethimitsubimil"
      if (unit.category === "msnz Project") return aUnit.includes("msnz") || album.id === "17-beyond-beauty"
      return aUnit.includes(unitNameClean) || aUnit.includes(unit.slug)
    })
  }, [unit, allAlbums])

  // Other sub-units for quick navigation
  const otherUnits = useMemo(() => {
    return allUnits.filter((u) => u.slug !== unit.slug)
  }, [allUnits, unit.slug])

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-white pt-24 pb-28 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. Navigation Breadcrumb ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link
            href="/sub-units"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Sub-Units & Dimensions</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              Dimension #{String(unit.id).padStart(2, "0")}
            </span>
          </div>
        </motion.div>

        {/* ── 2. Hero Bento Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-16">
          
          {/* Left Column: Unit Concept Photo (16:10 / 4:3 Aspect) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shadow-lg dark:shadow-2xl group"
          >
            <Image
              src={unit.image || "/placeholder.svg"}
              alt={unit.name}
              fill
              priority
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Top Transparent Outline S# / Dimension Number */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-3 z-10">
              <span
                className="text-4xl sm:text-5xl font-black tracking-tighter text-transparent select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                style={{ WebkitTextStroke: "2px rgba(255, 255, 255, 0.95)" }}
              >
                #{String(unit.id).padStart(2, "0")}
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white shadow-md">
                {unit.category}
              </span>
            </div>

            {/* Bottom Debut & Era Info */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between text-xs font-mono text-zinc-300 z-10">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                <span>{unit.debutRelease}</span>
              </div>
              <span className="text-zinc-400 px-2.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-zinc-700">
                {unit.era}
              </span>
            </div>
          </motion.div>

          {/* Right Column: Dimension Dossier Details */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                <Sparkles className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                {unit.concept}
              </span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                {unit.members.length} Members Active
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-pretendard text-zinc-900 dark:text-white">
                {unit.name}
              </h1>
              <p className="text-base sm:text-lg font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                {unit.hangul}
              </p>
            </div>

            {/* Narrative Lore / Description */}
            <p className="text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
              {unit.description}
            </p>

            {/* Quick Specs Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Dimension Type</div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white font-mono mt-1 truncate">
                  {unit.category}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Formation Era</div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white font-mono mt-1 truncate">
                  {unit.era}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Lineup Count</div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white font-mono mt-1">
                  {unit.members.length} Members
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── 3. Tagged Members Dossier Grid ── */}
        <section className="mb-20 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  [ LINEUP DOSSIER &bull; {taggedMembers.length} MEMBERS ]
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-pretendard text-zinc-900 dark:text-white">
                Tagged Members
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Click any member card to view their individual dossier
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {taggedMembers.map(({ member, isLeader }, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Link
                  href={`/members/${member.slug}`}
                  className="group block relative rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 backdrop-blur-md overflow-hidden shadow-md dark:shadow-xl hover:border-zinc-400 dark:hover:border-zinc-600 transition-all hover:-translate-y-1"
                >
                  {/* Member Portrait Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                    <Image
                      src={`https://i.imgur.com/${member.image}`}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

                    {/* Top Hollow Stroke S# & Leader Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span
                        className="text-2xl sm:text-3xl font-black tracking-tighter text-transparent select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                        style={{ WebkitTextStroke: "1.8px rgba(255, 255, 255, 0.95)" }}
                      >
                        S{member.id}
                      </span>

                      {isLeader && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/90 text-black text-[10px] font-mono font-bold shadow-md">
                          <Crown className="h-3 w-3" />
                          <span>LEADER</span>
                        </span>
                      )}
                    </div>

                    {/* Emoji Tag */}
                    <div className="absolute top-3 right-3 z-10">
                      {!isLeader && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-zinc-700/80 text-zinc-200">
                          {member.representativeEmoji.split(" ")[0]}
                        </span>
                      )}
                    </div>

                    {/* Bottom Floating Identity */}
                    <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                      <div className="flex items-baseline gap-1.5">
                        <h3 className="text-lg sm:text-xl font-extrabold font-pretendard tracking-tight">
                          {member.name}
                        </h3>
                        <span className="text-xs font-mono text-zinc-300">
                          ({member.hangul})
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-300 truncate mt-0.5">
                        {member.birthName}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="p-3 sm:p-4 space-y-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-500 dark:text-zinc-400 truncate max-w-[110px] sm:max-w-[140px]">
                        {member.role}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                        {member.mbti}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors pt-1">
                      <span>View Dossier</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 4. Unit Releases & Discography ── */}
        {relatedReleases.length > 0 && (
          <section className="mb-20 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
            <div className="flex items-center gap-2 mb-1">
              <Disc3 className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                [ DISCOGRAPHY &bull; {relatedReleases.length} {relatedReleases.length === 1 ? "RELEASE" : "RELEASES"} ]
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-pretendard text-zinc-900 dark:text-white mb-8">
              Dimension Releases
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedReleases.map((album) => (
                <div
                  key={album.id}
                  className="flex flex-col sm:flex-row gap-5 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 backdrop-blur-md shadow-md"
                >
                  <div className="relative aspect-square w-full sm:w-36 shrink-0 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-100 dark:bg-zinc-950">
                    <Image
                      src={album.cover || "/placeholder.svg"}
                      alt={album.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 144px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                          {album.type}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {album.releaseDate}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-pretendard text-zinc-900 dark:text-white">
                        {album.title}
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {album.description}
                      </p>
                    </div>

                    {album.spotifyLink && (
                      <div className="pt-2">
                        <a
                          href={album.spotifyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold transition-colors shadow-sm"
                        >
                          <Music2 className="h-3.5 w-3.5" />
                          <span>Stream on Spotify</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 5. Explore Other Dimensions Slider / Grid ── */}
        <section className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  [ NEXT DIMENSION ]
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-pretendard text-zinc-900 dark:text-white">
                Explore Other Sub-Units
              </h2>
            </div>
            <Link
              href="/sub-units"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <span>View All 15 Units</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {otherUnits.slice(0, 4).map((other) => (
              <Link
                key={other.id}
                href={`/sub-units/${other.slug}`}
                className="group block p-4 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 backdrop-blur-md hover:border-zinc-400 dark:hover:border-zinc-600 transition-all hover:-translate-y-1 shadow-md"
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 mb-3 border border-zinc-200 dark:border-zinc-800">
                  <Image
                    src={other.image || "/placeholder.svg"}
                    alt={other.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 text-white font-mono text-[10px] font-bold">
                    #{String(other.id).padStart(2, "0")}
                  </div>
                </div>

                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                  {other.category}
                </div>
                <h4 className="text-sm font-bold font-pretendard text-zinc-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {other.name}
                </h4>
                <p className="text-[11px] font-mono text-zinc-500 mt-1">
                  {other.members.length} Members &bull; {other.era}
                </p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
