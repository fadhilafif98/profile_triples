"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "motion/react"
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Crown,
  Disc3,
  ExternalLink,
} from "lucide-react"
import { FaSpotify } from "react-icons/fa"
import { getSubUnitBySlug, getAllSubUnits, getAlbumsForSubUnit } from "@/lib/sub-units"
import { getMemberById, getMemberColor, getContrastingInk } from "@/lib/members"
import { getSubUnitMemberImageUrl } from "@/lib/sub-unit-member-images"
import { Member } from "@/types/member"
import Breadcrumb from "@/components/breadcrumb"
import WavWordmark from "@/components/wav-wordmark"
import DimensionWordmark from "@/components/dimension-wordmark"
import ThemeImage from "@/components/theme-image"
import { useSafeReducedMotion } from "@/lib/a11y"
import { useIsDarkMode } from "@/lib/theme"

interface SubUnitDetailClientProps {
  slug: string
}

interface UnitStory {
  leadSingle: string
  formationStory: string
  legacyStory: string
}

const UNIT_STORIES: Record<string, UnitStory> = {
  "acid-angel-from-asia": {
    leadSingle: "Generation",
    formationStory:
      "In September 2022, MODHAUS introduced the Grand Gravity fan voting system on COSMO. Fans holding COMO tokens on the COSMO application voted to divide the first eight revealed members into two debut dimensions. Acid Angel from Asia (AAA) emerged as the rebellious, trendsetting unit representing Generation Z youth culture across Asia.",
    legacyStory:
      "Fronted by the viral Y2K smash 'Generation', AAA captured worldwide attention with its anti-drop chorus and playful choreography. Under the initial MODHAUS rule, the unit needed to reach 100,000 physical album sales to maintain continuous activity. While completing its cycle after ~20,000 sales, 'Generation' solidified tripleS' sonic signature and remains a landmark rookie release in modern K-pop.",
  },
  "krystal-eyes": {
    leadSingle: "Cherry Talk",
    formationStory:
      "Formed alongside AAA during the Atom01 Grand Gravity in autumn 2022, +(KR)ystal Eyes was envisioned as the luminous, nostalgic counterpart. Bringing together SeoYeon, JiWoo, ChaeYeon, and SooMin, the unit set out to re-imagine the refreshing aesthetic of 90s girl groups and classic city-pop.",
    legacyStory:
      "Debuting with the mini album <AESTHETIC> and lead track 'Cherry Talk', KRE delivered bright melodies and high-teen optimism produced by MonoTree. The group later released the digital single 'Touch+' featuring SoHyun, showcasing versatile harmonies and enduring charm across the tripleS cosmos.",
  },
  "acid-eyes": {
    leadSingle: "Cherry Gene",
    formationStory:
      "Following the debut cycles of AAA and +(KR)ystal Eyes, MODHAUS united all eight members into a special combined dimension in July 2023. This marked the first time two separate sub-units merged into a single collective.",
    legacyStory:
      "The unit released 'Cherry Gene', an innovative hybrid track that blended the cyber-bass rhythm of 'Generation' with the sparkling city-pop hooks of 'Cherry Talk'. Released with limited physical packaging and custom art books, ACID EYES proved the modular versatility of the tripleS dimension concept.",
  },
  lovelution: {
    leadSingle: "Girls' Capitalism",
    formationStory:
      "During the Grand Gravity of April 2023, fans distributed 16 members into two distinct sister dimensions across seven days of COSMO voting. LOVElution united eight members under leader Park SoHyun to pioneer a fresh pop-rock identity.",
    legacyStory:
      "Their debut mini album ↀ (MUHAN) was fronted by 'Girls' Capitalism', an empowering anthem celebrating self-worth and financial independence. LOVElution became the first tripleS unit to embark on a full concert tour across the United States, selling out theaters from Atlanta to Los Angeles and establishing the group's global touring presence.",
  },
  evolution: {
    leadSingle: "Invincible",
    formationStory:
      "The diamond-hard sister dimension to LOVElution, EVOLution was formed in the April 2023 Grand Gravity to represent futuristic resilience and high-octane stage performance. The eight-member lineup brought together experienced performers with newly revealed talents.",
    legacyStory:
      "Led by title track 'Invincible' from the mini album ⟡ (MUJUK), EVOLution delivered driving electro-house production and synchronized choreography. The unit performed internationally on the 'Authentic: EVOLution in Australia' tour, demonstrating tripleS' capability with darker electronic concepts.",
  },
  nxt: {
    leadSingle: "Just Do It",
    formationStory:
      "In late December 2023, MODHAUS created tripleS' first introductory sub-unit. NXT was formed specifically to reveal newly joined members S17 Lynn, S18 JooBin, S19 HaYeon, and S20 ShiOn directly through musical release rather than pre-debut video teasers.",
    legacyStory:
      "Debuting with the digital single 'Just Do It', NXT delivered an energetic club-ready dance track with punchy basslines. The release gave fans an immediate introduction to the members' vocal and performance capabilities, building momentum toward the full 24-member assemble.",
  },
  aria: {
    leadSingle: "Door",
    formationStory:
      "In winter 2023, the Cream01 Grand Gravity invited WAV to vote for members across the group to form tripleS' first vocal-focused ballad dimension. Fans selected five standout vocalists: DaHyun (Leader), SeoYeon, ChaeYeon, Kaede, and Nien.",
    legacyStory:
      "Aria debuted with the single album 'Structure of Sadness', featuring the emotive title track 'Door' written and composed by acclaimed singer-songwriter Heize. The release highlighted the members' vocal control, emotional delivery, and acoustic subtlety.",
  },
  glow: {
    leadSingle: "Inner Dance",
    formationStory:
      "Revealed in June 2024 following the historic ASSEMBLE24 comeback, Glow served as the final developmental unit of tripleS, introducing the quartet of S21 ChaeWon, S22 Sullin, S23 SeoAh, and S24 JiYeon to complete the 24-member roster.",
    legacyStory:
      "Their debut single 'Inner Dance' was a bright, breezy dream-pop track celebrating youth and new beginnings. Glow performed across domestic broadcast stages, completing the pre-debut discovery era of tripleS with refreshing charm.",
  },
  "visionary-vision": {
    leadSingle: "Hit the Floor",
    formationStory:
      "In June 2024, tripleS launched the Dance Dimension Grand Gravity. WAV voted to select 12 members specifically suited for high-intensity choreography. Under the leadership of Jeong Hye-rin, Visionary Vision (VV) became the largest sub-unit in the group's history.",
    legacyStory:
      "VV released tripleS' first sub-unit full-length studio album, 'Performante', on October 23, 2024. Title track 'Hit the Floor' featured authentic boom-bap, breakdance, and hip-hop execution, winning widespread acclaim from professional dance crews and music critics.",
  },
  hatchi: {
    leadSingle: "Untitled",
    formationStory:
      "Formed to spearhead tripleS' localized expansion into Japan, ∞! (pronounced Hatchi, meaning eight and infinity) united eight members: Japanese native Mayu (Leader), Kotone, and Kaede, alongside JiWoo, ChaeYeon, YooYeon, SooMin, and ShiOn.",
    legacyStory:
      "Debuting with the pre-release single 'Untitled' in November 2024 and following up with the mini album 'SecretHimitsuBimil', Hatchi combined upbeat J-pop sensibilities with tripleS' signature dance-pop energy, performing across major Japanese showcases.",
  },
  alphie: {
    leadSingle: "Alpha Pulse",
    formationStory:
      "Formed through a specialized COSMO Grand Gravity voting event, Alphie brought together eight members across different reveal generations to explore experimental electronic textures and live theatrical staging.",
    legacyStory:
      "Led by Kim YooYeon, Alphie showcased a sharp electro-pop identity with synthesizer-driven basslines and layered vocal arrangements, demonstrating the flexibility of fan-selected formations.",
  },
  moon: {
    leadSingle: "Beyond Beauty (Moon)",
    formationStory:
      "Part of the 2025 msnz (misonyeojeu) Grand Gravity quad-project, Moon was conceived as the nocturnal, mystical quadrant of the planetary constellation under leader S22 Sullin.",
    legacyStory:
      "Featuring Kaede, SoHyun, Lynn, ShiOn, Sullin, and JiYeon, Moon's sound centered on lush ambient synths and poetic lyrics, contributing to the unified 'Beyond Beauty' planetary compilation.",
  },
  sun: {
    leadSingle: "Beyond Beauty (Sun)",
    formationStory:
      "The daytime solar counterpart of the msnz project, Sun was created to channel daylight warmth, high-tempo grooves, and radiant stage energy under leader Xinyu.",
    legacyStory:
      "Featuring HyeRin, ChaeYeon, YooYeon, Xinyu, Mayu, and ChaeWon, Sun brought upbeat brass flourishes and infectious summer melodies to the 'Beyond Beauty' album era.",
  },
  neptune: {
    leadSingle: "Beyond Beauty (Neptune)",
    formationStory:
      "Representing the deep oceanic planetary quadrant in the msnz project, Neptune brought together vocalists Yoon Seo-yeon (Leader), NaKyoung, DaHyun, Kotone, Nien, and SeoAh.",
    legacyStory:
      "Neptune explored spacious production, rhythmic rap-vocal interplay, and atmospheric synth textures, showcasing the depth and range of the members.",
  },
  zenith: {
    leadSingle: "Beyond Beauty (Zenith)",
    formationStory:
      "Named after the highest celestial point above the horizon, Zenith was formed under leader S19 HaYeon to deliver soaring vocal climaxes and power choreography alongside JiWoo, SooMin, YuBin, YeonJi, and JooBin.",
    legacyStory:
      "Zenith served as the peak of the msnz planetary quad, featuring dramatic orchestral sweeps and multi-part choral harmonies that highlighted tripleS' vocal line at full power.",
  },
}

export default function SubUnitDetailClient({ slug }: SubUnitDetailClientProps) {
  const shouldReduceMotion = useSafeReducedMotion()
  const isDark = useIsDarkMode()
  const unit = getSubUnitBySlug(slug)
  const allUnits = getAllSubUnits()

  if (!unit) {
    notFound()
  }

  // Editorial Story
  const story = useMemo<UnitStory>(() => {
    return (
      UNIT_STORIES[unit.slug] || {
        leadSingle: unit.debutRelease.split(" (")[0] || unit.name,
        formationStory: unit.description,
        legacyStory: `Formed during the ${unit.era} era with sound concept: ${unit.concept}.`,
      }
    )
  }, [unit])

  // Contextual Prev / Next Navigation
  const currentIndex = useMemo(() => {
    return allUnits.findIndex((u) => u.slug === unit.slug)
  }, [allUnits, unit.slug])

  const prevUnit = useMemo(() => {
    return currentIndex > 0 ? allUnits[currentIndex - 1] : allUnits[allUnits.length - 1]
  }, [allUnits, currentIndex])

  const nextUnit = useMemo(() => {
    return currentIndex < allUnits.length - 1 ? allUnits[currentIndex + 1] : allUnits[0]
  }, [allUnits, currentIndex])

  // Resolve full Member data
  const taggedMembers = useMemo(() => {
    if (!unit) return []
    return unit.members
      .map((entry) => {
        const match = entry.match(/^S(\d+)/i)
        const memberId = match ? parseInt(match[1], 10) : 0
        const isLeader = entry.toLowerCase().includes("(leader)")
        const member = getMemberById(memberId)
        const color = memberId ? getMemberColor(memberId) : "#D4FF00"
        return {
          entry,
          id: memberId,
          isLeader,
          member,
          color,
        }
      })
      .filter((item): item is { entry: string; id: number; isLeader: boolean; member: Member; color: string } => !!item.member)
  }, [unit])

  // Unit Leader name
  const leaderName = useMemo(() => {
    const leader = taggedMembers.find((m) => m.isLeader)
    return leader?.member?.name
  }, [taggedMembers])

  // Resolve related album releases
  const relatedReleases = useMemo(() => {
    if (!unit) return []
    return getAlbumsForSubUnit(unit)
  }, [unit])

  // Other sub-units for discovery
  const otherUnits = useMemo(() => {
    return allUnits.filter((u) => u.slug !== unit.slug)
  }, [allUnits, unit.slug])

  return (
    <div className="min-h-dvh bg-[#FAFAFA] dark:bg-[#08080A] text-zinc-900 dark:text-[#F4F4F6] pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-20 selection:bg-[#D4FF00] selection:text-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. Clean Navigation Bar with Prev/Next Switcher ── */}
        <Breadcrumb
          items={[
            { label: "Dimensions", href: "/sub-units" },
            { label: unit.name },
          ]}
          action={
            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
              <Link
                href={`/sub-units/${prevUnit.slug}`}
                className="btn-magnetic flex items-center gap-1.5 px-3 py-1.5 min-h-8 [@media(pointer:coarse)]:min-h-10 rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
                aria-label={`Prev Dimension: ${prevUnit.name}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Prev</span>
                <span className="hidden sm:inline">Dimension</span>
              </Link>

              <span className="sm:hidden inline-flex items-center gap-1 min-h-8 text-xs font-mono text-zinc-800 dark:text-zinc-200 font-bold px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 tabular-nums whitespace-nowrap">
                <span>{String(currentIndex + 1).padStart(2, "0")}</span>
                <span className="text-zinc-400 dark:text-zinc-500 font-normal">/ {allUnits.length}</span>
              </span>

              <Link
                href={`/sub-units/${nextUnit.slug}`}
                className="btn-magnetic flex items-center gap-1.5 px-3 py-1.5 min-h-8 [@media(pointer:coarse)]:min-h-10 rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
                aria-label={`Next Dimension: ${nextUnit.name}`}
              >
                <span>Next</span>
                <span className="hidden sm:inline">Dimension</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          }
        />

        {/* ── 2. Editorial Hero Feature (Clean, Focused, Unboxed) ── */}
        <section className="pt-2 sm:pt-4 pb-10 sm:pb-16 lg:pb-24 border-b border-zinc-200/70 dark:border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 lg:gap-16 items-start">
            
            {/* Left: Pure 3:2 Concept Photography Plate */}
            <div className="lg:col-span-7 relative aspect-3/2 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-200/70 dark:bg-zinc-900 group">
              <Image
                src={unit.image || "/placeholder.svg"}
                alt={`${unit.name} concept photo`}
                fill
                preload
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none"
              />
            </div>

            {/* Right: Official Logo Hero & Editorial Specification */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, transform: "translate3d(0, 14px, 0)" }
              }
              animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.35,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="lg:col-span-5 space-y-4 sm:space-y-6 min-w-0"
            >
              {/* Context Tag */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                <span className="font-bold text-zinc-950 dark:text-[#D4FF00] uppercase tracking-[0.14em]">
                  {unit.era}
                </span>
                <span aria-hidden="true">/</span>
                <span className="inline-flex items-center gap-1">
                  Voted by{" "}
                  <WavWordmark className="h-[0.8em] inline-block align-baseline text-zinc-950 dark:text-[#D4FF00]" />
                </span>
              </div>

              {/* Official Dimension Logo, Name & Hangul */}
              <div className="space-y-2 sm:space-y-3 pt-0.5">
                <h1 className="text-zinc-950 dark:text-white">
                  <DimensionWordmark
                    slug={unit.slug}
                    name={unit.name}
                    size="hero"
                  />
                </h1>
                <p className="text-sm sm:text-base font-mono text-zinc-600 dark:text-zinc-400 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <span className="font-semibold text-zinc-950 dark:text-zinc-200">
                    {unit.name}
                  </span>
                  {unit.hangul && (
                    <>
                      <span aria-hidden="true">/</span>
                      <span lang="ko">{unit.hangul}</span>
                    </>
                  )}
                </p>
              </div>

              {/* Narrative Summary */}
              <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed text-pretty max-w-[65ch]">
                {unit.description}
              </p>

              {/* Editorial Specification (Clean Definition List, No Card Chrome) */}
              <dl className="grid grid-cols-2 gap-y-3 gap-x-4 sm:gap-y-3.5 sm:gap-x-6 pt-4 sm:pt-5 border-t border-zinc-200/70 dark:border-white/10 text-xs font-mono">
                <div className="min-w-0">
                  <dt className="text-zinc-500 dark:text-zinc-400">Formation</dt>
                  <dd className="font-medium text-zinc-950 dark:text-white mt-0.5 break-words">
                    {taggedMembers.length} Members {leaderName ? `(Leader: ${leaderName})` : ""}
                  </dd>
                </div>

                <div className="min-w-0">
                  <dt className="text-zinc-500 dark:text-zinc-400">Debut Release</dt>
                  <dd className="font-medium text-zinc-950 dark:text-white mt-0.5 break-words">
                    {unit.debutRelease}
                  </dd>
                </div>

                <div className="min-w-0">
                  <dt className="text-zinc-500 dark:text-zinc-400">Signature Track</dt>
                  <dd className="font-medium text-zinc-950 dark:text-white mt-0.5 break-words">
                    &ldquo;{story.leadSingle}&rdquo;
                  </dd>
                </div>

                <div className="min-w-0">
                  <dt className="text-zinc-500 dark:text-zinc-400">Sound Concept</dt>
                  <dd className="font-medium text-zinc-950 dark:text-white mt-0.5 break-words">
                    {unit.concept}
                  </dd>
                </div>
              </dl>

              {/* Direct Spotify Action */}
              {relatedReleases[0]?.spotifyLink && (
                <div className="pt-1 sm:pt-2">
                  <a
                    href={relatedReleases[0].spotifyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-8 [@media(pointer:coarse)]:min-h-11 text-xs font-mono font-bold text-zinc-950 dark:text-[#D4FF00] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00] rounded-sm"
                  >
                    <FaSpotify className="w-4 h-4 text-[#1DB954] shrink-0" aria-hidden="true" />
                    <span>Listen to &ldquo;{story.leadSingle}&rdquo; on Spotify</span>
                    <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── 3. Editorial Story Feature (Immersive Journalistic Narrative) ── */}
        <section className="py-10 sm:py-16 lg:py-20 border-b border-zinc-200/70 dark:border-white/10">
          <div className="max-w-3xl mb-5 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-zinc-950 dark:text-white text-balance">
              The Genesis of {unit.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-[#D4FF00] font-bold mb-2">
                Grand Gravity Formation
              </h3>
              <p className="text-pretty max-w-[65ch]">{story.formationStory}</p>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-[#D4FF00] font-bold mb-2">
                Sound &amp; Impact
              </h3>
              <p className="text-pretty max-w-[65ch]">{story.legacyStory}</p>
            </div>
          </div>
        </section>

        {/* ── 4. Collectible Member Lineup (Clean Photocards) ── */}
        <section className="py-10 sm:py-16 lg:py-20 border-b border-zinc-200/70 dark:border-white/10">
          <div className="mb-5 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-zinc-950 dark:text-white text-balance">
              Lineup ({taggedMembers.length})
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
              Official formation members
            </p>
          </div>

          <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {taggedMembers.map(({ member, isLeader, color }, index) => (
              <motion.li
                key={member.id}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, transform: "translate3d(0, 14px, 0)" }
                }
                animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  delay: shouldReduceMotion ? 0 : index * 0.03,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <Link
                  href={`/members/${member.slug}`}
                  className="group block relative aspect-3/4.25 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-950 active:scale-[0.98] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
                >
                  <article className="relative w-full h-full">
                    {/* Portrait Photograph */}
                    <ThemeImage
                      src={getSubUnitMemberImageUrl(unit.slug, member, isDark)}
                      alt={`${member.name} (${member.birthName || member.name}) photocard`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-top transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                    {/* S-Number Badge */}
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 pointer-events-none">
                      <span
                        className="text-[10px] sm:text-[11px] font-mono font-bold px-2 sm:px-2.5 py-0.5 rounded shadow-xs"
                        style={{ backgroundColor: color, color: getContrastingInk(color) }}
                      >
                        S{String(member.id).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Member Identity */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 text-white z-10 pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm sm:text-base lg:text-lg font-display font-black tracking-tight text-white leading-tight">
                          {member.name}
                        </h3>
                        {isLeader && (
                          <>
                            <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                            <span className="sr-only"> (Leader)</span>
                          </>
                        )}
                      </div>

                      <p className="text-[10px] sm:text-[11px] font-mono text-zinc-300 truncate mt-0.5">
                        {member.birthName || member.name} &bull; {member.role}
                      </p>
                    </div>
                  </article>
                </Link>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* ── 5. Discography Feature ── */}
        {relatedReleases.length > 0 && (
          <section className="py-10 sm:py-16 lg:py-20 border-b border-zinc-200/70 dark:border-white/10">
            <div className="mb-5 sm:mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-zinc-950 dark:text-white flex items-center gap-2.5 text-balance">
                <Disc3 className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 dark:text-zinc-500 shrink-0" aria-hidden="true" />
                <span>Discography ({relatedReleases.length})</span>
              </h2>
            </div>

            <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 lg:gap-12">
              {relatedReleases.map((album) => (
                <li key={album.id}>
                  <article className="flex flex-row gap-4 sm:gap-6 lg:gap-8 items-start sm:items-center">
                    {/* Vinyl Jacket */}
                    <div className="relative aspect-square w-24 sm:w-40 lg:w-44 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-xl bg-zinc-900 group">
                      <Image
                        src={album.cover || "/placeholder.svg"}
                        alt={`${album.title} album cover`}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 96px, 176px"
                        className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
                      />
                    </div>

                    {/* Album Info */}
                    <div className="space-y-1.5 sm:space-y-2.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] sm:text-[11px] font-mono text-zinc-500">
                        <span className="uppercase tracking-wider text-zinc-950 dark:text-[#D4FF00] font-bold">
                          {album.type}
                        </span>
                        <span aria-hidden="true">&bull;</span>
                        <span>{album.releaseDate}</span>
                      </div>

                      <h3 className="text-base sm:text-xl lg:text-2xl font-display font-black text-zinc-950 dark:text-white leading-snug text-balance">
                        {album.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty line-clamp-2">
                        {album.description}
                      </p>

                      {album.spotifyLink && (
                        <div className="pt-1 sm:pt-2">
                          <a
                            href={album.spotifyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 sm:gap-2 min-h-8 [@media(pointer:coarse)]:min-h-10 text-xs font-mono font-bold text-zinc-950 dark:text-[#D4FF00] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00] rounded-sm"
                          >
                            <FaSpotify className="h-4 w-4 text-[#1DB954] shrink-0" aria-hidden="true" />
                            <span>Stream on Spotify</span>
                            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── 6. Other Dimensions ── */}
        <section className="pt-10 sm:pt-16 lg:pt-20">
          <div className="flex items-end justify-between gap-4 mb-5 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-zinc-950 dark:text-white text-balance">
              Other Dimensions
            </h2>
            <Link
              href="/sub-units"
              className="nav-draw-link group/all text-xs font-mono uppercase tracking-[0.16em] font-bold text-zinc-950 dark:text-[#D4FF00] pb-0.5 inline-flex items-center gap-1.5 min-h-8 [@media(pointer:coarse)]:min-h-11 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00] rounded-sm"
            >
              <span>All {allUnits.length}</span>
              <span className="hidden sm:inline">Dimensions</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover/all:translate-x-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover/all:-translate-y-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </div>

          <ul role="list" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
            {otherUnits.slice(0, 4).map((other) => (
              <li key={other.id}>
                <Link
                  href={`/sub-units/${other.slug}`}
                  className="group block rounded-xl sm:rounded-2xl active:scale-[0.99] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
                >
                  <article>
                    <div className="relative aspect-3/2 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-200/70 dark:bg-zinc-900">
                      <Image
                        src={other.image || "/placeholder.svg"}
                        alt={`${other.name} concept photo`}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                      />
                    </div>

                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-zinc-200/80 dark:border-white/10 space-y-1 sm:space-y-1.5">
                      <h3 className="font-display font-bold text-sm sm:text-base lg:text-lg tracking-tight leading-snug text-balance text-zinc-950 dark:text-white transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-zinc-600 dark:[@media(hover:hover)_and_(pointer:fine)]:group-hover:text-[#D4FF00]">
                        {other.name}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] font-mono text-zinc-600 dark:text-zinc-400 flex items-center justify-between gap-1.5 sm:gap-2">
                        <span className="truncate">{other.era}</span>
                        <span className="tabular-nums shrink-0">{other.members.length}M</span>
                      </p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  )
}
