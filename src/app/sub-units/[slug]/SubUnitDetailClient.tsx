"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Crown,
  Disc3,
  ExternalLink,
} from "lucide-react"
import { FaSpotify } from "react-icons/fa"
import { getSubUnitBySlug, getAllSubUnits } from "@/lib/sub-units"
import { getMemberById, getMemberColor } from "@/lib/members"
import { getAllAlbums } from "@/lib/albums"
import { Member } from "@/types/member"
import Breadcrumb from "@/components/breadcrumb"
import WavWordmark from "@/components/wav-wordmark"

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
      "In September 2022, MODHAUS introduced the Grand Gravity governance system. Fans holding COMO tokens on the COSMO application voted to divide the first eight revealed members into two debut dimensions. Acid Angel from Asia (AAA) emerged as the rebellious, trendsetting unit representing Generation Z youth culture across Asia.",
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
  const unit = getSubUnitBySlug(slug)
  const allUnits = getAllSubUnits()
  const allAlbums = getAllAlbums()

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

  // Other sub-units for discovery
  const otherUnits = useMemo(() => {
    return allUnits.filter((u) => u.slug !== unit.slug)
  }, [allUnits, unit.slug])

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#08080A] text-zinc-900 dark:text-[#F4F4F6] pt-20 sm:pt-24 lg:pt-28 pb-28 sm:pb-36 selection:bg-[#D4FF00] selection:text-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. Clean Navigation Bar with Prev/Next Switcher ── */}
        <Breadcrumb
          items={[
            { label: "Dimensions", href: "/sub-units" },
            { label: unit.name },
          ]}
          action={
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
              <Link
                href={`/sub-units/${prevUnit.slug}`}
                className="hover:text-zinc-950 dark:hover:text-[#D4FF00] transition-colors inline-flex items-center gap-1"
                title={`Previous: ${prevUnit.name}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev Dimension</span>
              </Link>
              <span>/</span>
              <Link
                href={`/sub-units/${nextUnit.slug}`}
                className="hover:text-zinc-950 dark:hover:text-[#D4FF00] transition-colors inline-flex items-center gap-1"
                title={`Next: ${nextUnit.name}`}
              >
                <span className="hidden sm:inline">Next Dimension</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          }
        />

        {/* ── 2. Editorial Hero Feature (Clean, Focused, Unboxed) ── */}
        <section className="pt-4 pb-16 sm:pb-24 border-b border-zinc-200/70 dark:border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
            
            {/* Left: Pure Concept Photography (No Overlaid Badges or Widgets) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl border border-zinc-200/80 dark:border-white/10 group"
            >
              <Image
                src={unit.image || "/placeholder.svg"}
                alt={`${unit.name} concept photo`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
              />
            </motion.div>

            {/* Right: Typography & Editorial Specification */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Context Tag */}
              <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-500">
                <span className="font-bold text-zinc-950 dark:text-[#D4FF00] uppercase tracking-wider">
                  {unit.era}
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  Voted by{" "}
                  <WavWordmark className="h-[0.8em] inline-block align-baseline text-zinc-950 dark:text-[#D4FF00]" />
                </span>
              </div>

              {/* Title & Hangul */}
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05]">
                  {unit.name}
                </h1>
                <p className="text-base sm:text-lg font-mono text-zinc-400 dark:text-zinc-500 mt-1">
                  {unit.hangul}
                </p>
              </div>

              {/* Narrative Summary */}
              <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
                {unit.description}
              </p>

              {/* Editorial Specification (Clean Definition List, No Card Chrome) */}
              <dl className="grid grid-cols-2 gap-y-3.5 gap-x-6 pt-5 border-t border-zinc-200/70 dark:border-white/10 text-xs font-mono">
                <div>
                  <dt className="text-zinc-400 dark:text-zinc-500">Formation</dt>
                  <dd className="font-medium text-zinc-950 dark:text-white mt-0.5">
                    {taggedMembers.length} Members {leaderName ? `(Leader: ${leaderName})` : ""}
                  </dd>
                </div>

                <div>
                  <dt className="text-zinc-400 dark:text-zinc-500">Debut Release</dt>
                  <dd className="font-medium text-zinc-950 dark:text-white mt-0.5">
                    {unit.debutRelease}
                  </dd>
                </div>

                <div>
                  <dt className="text-zinc-400 dark:text-zinc-500">Signature Track</dt>
                  <dd className="font-medium text-zinc-950 dark:text-white mt-0.5">
                    &ldquo;{story.leadSingle}&rdquo;
                  </dd>
                </div>

                <div>
                  <dt className="text-zinc-400 dark:text-zinc-500">Sound Concept</dt>
                  <dd className="font-medium text-zinc-950 dark:text-white mt-0.5">
                    {unit.concept}
                  </dd>
                </div>
              </dl>

              {/* Direct Spotify Action */}
              {relatedReleases[0]?.spotifyLink && (
                <div className="pt-2">
                  <a
                    href={relatedReleases[0].spotifyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-950 dark:text-[#D4FF00] hover:underline"
                  >
                    <FaSpotify className="w-4 h-4 text-[#1DB954]" />
                    <span>Listen to &ldquo;{story.leadSingle}&rdquo; on Spotify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── 3. Editorial Story Feature (Immersive Journalistic Narrative) ── */}
        <section className="py-14 sm:py-20 border-b border-zinc-200/70 dark:border-white/10">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-zinc-950 dark:text-white">
              The Genesis of {unit.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-[#D4FF00] font-bold mb-2.5">
                Grand Gravity Formation
              </h3>
              <p>{story.formationStory}</p>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-[#D4FF00] font-bold mb-2.5">
                Sound &amp; Impact
              </h3>
              <p>{story.legacyStory}</p>
            </div>
          </div>
        </section>

        {/* ── 4. Collectible Member Lineup (Clean Photocards) ── */}
        <section className="py-14 sm:py-20 border-b border-zinc-200/70 dark:border-white/10">
          <div className="flex items-baseline justify-between mb-8 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-zinc-950 dark:text-white">
                Lineup ({taggedMembers.length})
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-400">
              Official formation members
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {taggedMembers.map(({ member, isLeader, color }, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <Link
                  href={`/members/${member.slug}`}
                  className="group block relative aspect-[3/4.25] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-zinc-200/50 dark:border-white/5"
                >
                  {/* Portrait Photograph */}
                  <Image
                    src={`https://i.imgur.com/${member.image}`}
                    alt={`${member.name} (${member.birthName || member.name}) photocard`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-104"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* S-Number Badge */}
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span
                      className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded text-black shadow-xs"
                      style={{ backgroundColor: color }}
                    >
                      S{String(member.id).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Member Identity */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white z-10 pointer-events-none">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base sm:text-lg font-display font-black tracking-tight text-white leading-tight">
                        {member.name}
                      </h3>
                      {isLeader && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>

                    <p className="text-[11px] font-mono text-zinc-300 truncate mt-0.5">
                      {member.birthName || member.name} &bull; {member.role}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 5. Discography Feature ── */}
        {relatedReleases.length > 0 && (
          <section className="py-14 sm:py-20 border-b border-zinc-200/70 dark:border-white/10">
            <div className="mb-8 sm:mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-1.5">
                <Disc3 className="w-3.5 h-3.5" />
                <span>Discography</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-zinc-950 dark:text-white">
                Release ({relatedReleases.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              {relatedReleases.map((album) => (
                <div
                  key={album.id}
                  className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center"
                >
                  {/* Vinyl Jacket */}
                  <div className="relative aspect-square w-full sm:w-44 shrink-0 rounded-2xl overflow-hidden shadow-xl bg-zinc-900 group">
                    <Image
                      src={album.cover || "/placeholder.svg"}
                      alt={`${album.title} album cover`}
                      fill
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Album Info */}
                  <div className="space-y-2.5 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                      <span className="uppercase tracking-wider text-zinc-950 dark:text-[#D4FF00] font-bold">
                        {album.type}
                      </span>
                      <span>&bull;</span>
                      <span>{album.releaseDate}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-black text-zinc-950 dark:text-white leading-tight">
                      {album.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {album.description}
                    </p>

                    {album.spotifyLink && (
                      <div className="pt-2">
                        <a
                          href={album.spotifyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-950 dark:text-[#D4FF00] hover:underline"
                        >
                          <FaSpotify className="h-4 w-4 text-[#1DB954]" />
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

        {/* ── 6. Other Dimensions ── */}
        <section className="pt-14 sm:pt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-zinc-950 dark:text-white">
                Other Dimensions
              </h2>
            </div>
            <Link
              href="/sub-units"
              className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-950 dark:text-[#D4FF00] hover:underline inline-flex items-center gap-1"
            >
              <span>All 15 Units</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {otherUnits.slice(0, 4).map((other) => (
              <Link
                key={other.id}
                href={`/sub-units/${other.slug}`}
                className="group block relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-zinc-200/50 dark:border-white/5"
              >
                <Image
                  src={other.image || "/placeholder.svg"}
                  alt={`${other.name} concept photo`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 z-10 text-white font-mono text-xs font-bold">
                  #{String(other.id).padStart(2, "0")}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white z-10 space-y-0.5">
                  <span className="text-[10px] font-mono text-zinc-300 uppercase block">
                    {other.category}
                  </span>
                  <h3 className="text-sm font-display font-black truncate">
                    {other.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
