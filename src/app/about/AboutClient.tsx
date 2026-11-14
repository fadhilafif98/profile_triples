"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { useSafeReducedMotion } from "@/lib/a11y"
import gsap from "gsap"
import {
  ArrowUpRight,
  Radio,
  Layers,
  Boxes,
} from "lucide-react"
import { FaSpotify, FaYoutube, FaInstagram } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import Breadcrumb from "@/components/breadcrumb"
import WavWordmark from "@/components/wav-wordmark"
import { getAllMembers, getMemberColor } from "@/lib/members"


interface TimelineEra {
  year: string
  title: string
  subtitle: string
  description: string
  tag: string
  keyReleases: string[]
  achievements: string[]
}

const TIMELINE_ERAS: TimelineEra[] = [
  {
    year: "2022",
    title: "The Genesis & Acid Angel from Asia",
    subtitle: "From Instagram DM recruit to the first viral Dimension",
    description:
      "tripleS initiated public member reveals on May 1, 2022 with S1 Yoon SeoYeon. In October, the group launched its first subunit, Acid Angel from Asia (AAA), releasing 'Generation'. The Y2K pop anthem went viral globally, charting on the Billboard World Digital Song Sales and Spotify Viral charts.",
    tag: "Genesis Era",
    keyReleases: ["Generation (AAA)", "ACCESS (Mini Album)"],
    achievements: ["First Gravity subunit vote held on COSMO", "Global viral Y2K phenomenon"],
  },
  {
    year: "2023",
    title: "ASSEMBLE Rising & Parallel Worlds",
    subtitle: "10-Member debut and MAMA Best New Female Artist",
    description:
      "On February 13, 2023, the initial 10-member formation officially debuted with the mini-album ASSEMBLE and title track 'Rising', selected by fans through Grand Gravity. Later in the year, MODHAUS introduced parallel sister Dimensions: LOVElution ('ↀ') and EVOLution ('⟡'), showcasing unprecedented dual promotional structures.",
    tag: "Rising Era",
    keyReleases: ["Rising (ASSEMBLE)", "Girls' Capitalism (LOVElution)", "Invincible (EVOLution)"],
    achievements: [
      "Winner: Best New Female Artist at 2023 MAMA Awards",
      "LOVElution USA First Showcase Tour across 10 cities",
    ],
  },
  {
    year: "2024",
    title: "The Complete OT24 & Music Show #1",
    subtitle: "Historic 24-member assembly with 'Girls Never Die'",
    description:
      "With the reveals of S21 ChaeWon, S22 Sullin, S23 SeoAh, and S24 JiYeon in April 2024, the full 24-member roster assembled. On May 8, 2024, tripleS released ASSEMBLE24 fronted by 'Girls Never Die'. The track won #1 on SBS MTV The Show, achieving tripleS's first terrestrial music program win in K-pop history.",
    tag: "OT24 Landmark",
    keyReleases: ["Girls Never Die (ASSEMBLE24)", "Performante (Visionary Vision)", "Door (Aria)"],
    achievements: [
      "First Music Show #1 Win (The Show)",
      "ASSEMBLE24 sold 150,000+ copies in first week",
      "Visionary Vision 12-member dance project debut",
    ],
  },
  {
    year: "2025–2026",
    title: "Global Expansions & ASSEMBLE26",
    subtitle: "Japan Dimension ∞! (Hatch!), ANDLESS World Tour, and the comeback trilogy",
    description:
      "tripleS expanded into the global market with the Japan Dimension ∞! (Hatch!) releasing 'Untitled' and 1st mini album 'SecretHimitsuBimil', alongside the msnz project (Moon, Sun, Neptune, Zenith). In 2026, the group kicked off its ASSEMBLE26 comeback trilogy led by LOVE&POP pt. 1 ('Baby Flower') and commenced their 4th world tour 'ANDLESS' at Seoul's Jangchung Arena.",
    tag: "Global Era",
    keyReleases: ["Untitled & SecretHimitsuBimil (∞! Hatch!)", "LOVE&POP pt. 1 (ASSEMBLE26)", "Beyond Beauty (msnz)"],
    achievements: [
      "ANDLESS 4th World Tour kickoff (October 2026 at Jangchung Arena)",
      "Japan major debut under SMEJ & first Asia Tour (My Secret New Zone)",
      "15 Distinct Dimensions active across the COSMO ecosystem",
      "Active ecosystem with 11,400+ digital Objekts collected across 24 members",
    ],
  },
]

interface GlossaryItem {
  term: string
  korean: string
  index: string
  subtitle: string
  definition: string
}

const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: "HAUS",
    korean: "하우스",
    index: "01",
    subtitle: "Member Dormitory",
    definition:
      "The communal residences in Seoul and Tokyo where tripleS members live, practice, and bond together from pre-debut through promotions.",
  },
  {
    term: "SIGNAL",
    korean: "시그널",
    index: "02",
    subtitle: "Daily Reality Series",
    definition:
      "The signature daily YouTube series uploaded at 10:00 PM KST documenting member reveals (S1–S24), behind-the-scenes production, and everyday life.",
  },
  {
    term: "GRAVITY",
    korean: "그래비티",
    index: "03",
    subtitle: "Fan Voting on COSMO",
    definition:
      "Official Event Gravity and Grand Gravity voting events on the COSMO app where WAV use COMO to decide Dimension lineups, title tracks, and leaders.",
  },
  {
    term: "COMO",
    korean: "코모",
    index: "04",
    subtitle: "Voting Token",
    definition:
      "Voting tokens earned by collecting physical and digital Objekts on COSMO, used by WAV to cast votes in every Gravity event.",
  },
  {
    term: "DIMENSION",
    korean: "디멘션",
    index: "05",
    subtitle: "Rotating Sub-Units",
    definition:
      "Official term for tripleS sub-units. Recreated every season with new concepts and member combinations voted by WAV through Gravity.",
  },
  {
    term: "WAV",
    korean: "웨이브",
    index: "06",
    subtitle: "Official Fandom",
    definition:
      "The official fandom name of tripleS, representing the waves that come together with the 24 members across every Dimension and era.",
  },
]

interface VerifiedPortal {
  name: string
  handle: string
  category: string
  description: string
  url: string
  isCustomIcon: boolean
  icon?: React.ComponentType<{ className?: string }>
  colorClass?: string
  action: string
}

const VERIFIED_PORTALS: VerifiedPortal[] = [
  {
    name: "COSMO",
    handle: "triples.cosmos.art",
    category: "Cosmo : the Gate",
    description: "Official mobile and web app to collect digital Objekts, earn COMO, and vote in Grand Gravity.",
    url: "https://triples.cosmos.art",
    isCustomIcon: true,
    action: "Open COSMO",
  },
  {
    name: "YouTube",
    handle: "@triplescosmos",
    category: "Daily SIGNAL & MVs",
    description: "Daily SIGNAL episodes, official music videos, performance stages, and behind-the-scenes vlogs.",
    url: "https://www.youtube.com/@triplescosmos",
    isCustomIcon: false,
    icon: FaYoutube,
    colorClass: "text-red-600 dark:text-red-500",
    action: "Watch SIGNAL",
  },
  {
    name: "Spotify",
    handle: "tripleS Official",
    category: "Official Discography",
    description: "Stream all full-group albums, Dimension releases, and Japanese singles on Spotify.",
    url: "https://open.spotify.com/artist/5Z71xE9prhpHrqL5thVMyK",
    isCustomIcon: false,
    icon: FaSpotify,
    colorClass: "text-[#1DB954]",
    action: "Listen on Spotify",
  },
  {
    name: "X / Twitter",
    handle: "@triplescosmos",
    category: "Official News & Teasers",
    description: "Official comeback teasers, S-member announcements, Gravity results, and tour schedules.",
    url: "https://x.com/triplescosmos",
    isCustomIcon: false,
    icon: FaXTwitter,
    colorClass: "text-zinc-950 dark:text-white",
    action: "Follow on X",
  },
  {
    name: "Instagram",
    handle: "@triplescosmos",
    category: "Concept Photos & Reels",
    description: "Official concept photography, stage behind-the-scenes, and daily member reels.",
    url: "https://www.instagram.com/triplescosmos",
    isCustomIcon: false,
    icon: FaInstagram,
    colorClass: "text-pink-600 dark:text-pink-400",
    action: "Follow on Instagram",
  },
]

export default function AboutClient() {
  const allMembers = useMemo(() => getAllMembers(), [])
  const shouldReduceMotion = useSafeReducedMotion()
  const [activeEraIndex, setActiveEraIndex] = useState(2) // Default to 2024 OT24

  // Subtle GPU-safe title settle without hiding hero LCP photo
  const mastheadRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (shouldReduceMotion || !mastheadRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(".gsap-reveal-title", {
        y: 12,
        duration: 0.65,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "transform",
      })
    }, mastheadRef)

    return () => ctx.revert()
  }, [shouldReduceMotion])

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#08080A] text-zinc-900 dark:text-[#F4F4F6] pt-20 sm:pt-24 lg:pt-28 pb-32 sm:pb-40 selection:bg-[#D4FF00] selection:text-black min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "About tripleS" }]} />

        {/* ── 1. Editorial Opening & Panoramic Stage Showcase ── */}
        <section
          ref={mastheadRef}
          aria-labelledby="about-main-heading"
          className="pt-2 pb-16 sm:pb-24 border-b border-zinc-200/80 dark:border-white/10"
        >
          {/* Monumental Single-Line Headline Spread */}
          <div className="space-y-4 mb-8 sm:mb-12">
            <h1
              id="about-main-heading"
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] sm:whitespace-nowrap"
            >
              <span className="gsap-reveal-title inline-block mr-2 sm:mr-3">About</span>
              <span className="gsap-reveal-title font-accent text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                tripleS
              </span>
            </h1>

            <p className="gsap-reveal-title max-w-[68ch] text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed pt-1">
              The Idol of All Possibilities &mdash; &lsquo;We are one and also twenty-four.&rsquo; Revealed from S1 SeoYeon to S24 JiYeon under MODHAUS, tripleS brings together 24 girls with special abilities (&lsquo;s&rsquo;) who unite as one group and form seasonal Dimensions shaped with{" "}
              <span className="inline-flex items-baseline align-baseline text-zinc-950 dark:text-[#D4FF00]">
                <WavWordmark className="h-[0.85em] inline-block align-baseline -mb-[1px]" />
              </span>.
            </p>
          </div>

          {/* Full-Bleed Concert Stage Showcase (Unchanged Original Photograph) */}
          <figure className="space-y-3 mb-12 sm:mb-16">
            <div className="relative w-full aspect-[3/2] rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-white/10 bg-zinc-950 group">
              <Image
                src="/about/triples_about_2.jpg"
                alt="tripleS 24 Members OT24 World Tour ANDLESS in Seoul Stage Concert"
                fill
                sizes="(max-width: 1280px) 100vw, 1216px"
                priority
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
              />
            </div>

            <figcaption className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 px-1 pt-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-[#D4FF00] shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    2026 tripleS WORLD TOUR &apos;ANDLESS&apos; IN SEOUL
                  </span>
                </span>
                <span className="hidden sm:inline" aria-hidden="true">&bull;</span>
                <span className="inline-flex items-center gap-2">
                  <span className="text-zinc-700 dark:text-zinc-300">Jangchung Arena</span>
                  <span aria-hidden="true">&bull;</span>
                  <span>2026.10</span>
                </span>
              </div>
              <span className="text-zinc-500 dark:text-zinc-400">
                OT24 Commemorative Archival Stage &bull; S01 through S24
              </span>
            </figcaption>
          </figure>

          {/* Unboxed 2-Column Editorial Broadsheet: Origin Story & Foundational Milestones */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-8 border-t border-zinc-200/80 dark:border-white/10">
            {/* Block 01: From small 's' to big 'S' */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                <span className="font-bold text-zinc-950 dark:text-[#D4FF00]">01</span>
                <span aria-hidden="true">&bull;</span>
                <span>FROM SMALL &apos;s&apos; TO BIG &apos;S&apos;</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight leading-[1.1]">
                We Are One and Also Twenty-Four
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans max-w-[65ch]">
                <p>
                  <strong className="text-zinc-950 dark:text-white font-semibold">tripleS</strong> (트리플에스 &bull; トリプルS &mdash; Social Sonyo Seoul) is built on the official MODHAUS lore: girls with special abilities (&lsquo;s&rsquo;) living across the world who were once unaware of one another are brought together into one team as big &lsquo;S&rsquo;.
                </p>
                <p>
                  Founded by Jaden Jeong under <strong className="text-zinc-950 dark:text-white font-semibold">MODHAUS</strong>, all 24 members (S1 through S24) live and practice together in the HAUS, sharing their everyday rehearsals, recordings, and friendships through daily 10:00 PM KST <em className="text-zinc-950 dark:text-white font-medium not-italic">SIGNAL</em> episodes on YouTube.
                </p>
                <p>
                  Through COSMO : the Gate, WAV collect physical and digital Objekts to earn <em className="text-zinc-950 dark:text-white font-medium not-italic">COMO</em> and vote in Gravity &mdash; deciding Dimension lineups, title tracks, and official leaders.
                </p>
              </div>
            </div>

            {/* Block 02: Key Milestones */}
            <div className="lg:col-span-6 space-y-4 lg:border-l lg:border-zinc-200/80 dark:lg:border-white/10 lg:pl-10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                <span className="font-bold text-zinc-950 dark:text-[#D4FF00]">02</span>
                <span aria-hidden="true">&bull;</span>
                <span>KEY MILESTONES</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight leading-[1.1]">
                From S1 Reveal to OT24
              </h2>

              <dl className="divide-y divide-zinc-200/80 dark:divide-white/10 text-sm">
                <div className="py-3.5 first:pt-1 space-y-1">
                  <dt className="flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-950 dark:text-[#D4FF00] font-bold">2022.05.01</span>
                    <span className="text-zinc-500 dark:text-zinc-400">GENESIS REVEAL</span>
                  </dt>
                  <dd className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    S1 Yoon SeoYeon revealed as first member without trainee background, commencing the public 24-member journey.
                  </dd>
                </div>

                <div className="py-3.5 space-y-1">
                  <dt className="flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-950 dark:text-[#D4FF00] font-bold">2023.02.13</span>
                    <span className="text-zinc-500 dark:text-zinc-400">ASSEMBLE DEBUT</span>
                  </dt>
                  <dd className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Initial 10-member formation debuts with <em>Rising</em>, winning <strong>Best New Female Artist</strong> at the 2023 MAMA Awards.
                  </dd>
                </div>

                <div className="py-3.5 space-y-1">
                  <dt className="flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-950 dark:text-[#D4FF00] font-bold">2024.05.08</span>
                    <span className="text-zinc-500 dark:text-zinc-400">OT24 LANDMARK</span>
                  </dt>
                  <dd className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    All 24 members officially unite for <em>ASSEMBLE24</em> (&apos;Girls Never Die&apos;), capturing their historic first terrestrial music show #1 trophy.
                  </dd>
                </div>

                <div className="py-3.5 last:pb-0 space-y-1">
                  <dt className="flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-950 dark:text-[#D4FF00] font-bold">2026.10</span>
                    <span className="text-zinc-500 dark:text-zinc-400">4TH WORLD TOUR</span>
                  </dt>
                  <dd className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    All 24 members kick off the <em>ANDLESS</em> World Tour at Jangchung Arena in Seoul, showcasing full group mastery.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ── 2. Cosmo : the Gate (Unboxed Architectural Triptych) ── */}
        <section aria-labelledby="inventions-heading" className="py-16 sm:py-20 lg:py-24 border-b border-zinc-200/80 dark:border-white/10">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <h2
              id="inventions-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.1]"
            >
              Cosmo : the{" "}
              <span className="font-accent text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                Gate.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans max-w-[65ch]">
              Where everything of tripleS begins. Through SIGNAL, Objekt, and Gravity on COSMO, WAV and tripleS create every new Dimension together.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200/80 dark:divide-white/10 border-y border-zinc-200/80 dark:border-white/10">
            {/* Pillar 01 */}
            <article className="py-8 lg:py-10 lg:pr-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-3xl sm:text-4xl text-zinc-300 dark:text-white/20 tabular-nums">
                    01
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    <Radio className="w-4 h-4 text-zinc-950 dark:text-[#D4FF00]" aria-hidden="true" />
                    <span>DAILY REALITY</span>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black text-zinc-950 dark:text-white tracking-tight">
                  HAUS &amp; SIGNAL
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Members live, rehearse, and bond together in the HAUS in Seoul and Tokyo. Every evening at 10:00 PM KST, daily <strong className="text-zinc-950 dark:text-white font-semibold">SIGNAL</strong> episodes on YouTube share member reveals (S1 to S24), recording sessions, choreography practices, and everyday friendships.
                </p>
              </div>
              <div className="pt-4 text-xs font-mono text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/60 dark:border-white/10">
                Daily 10:00 PM KST &bull; HAUS Seoul &amp; Tokyo
              </div>
            </article>

            {/* Pillar 02 */}
            <article className="py-8 lg:py-10 lg:px-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-3xl sm:text-4xl text-zinc-300 dark:text-white/20 tabular-nums">
                    02
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-zinc-950 dark:text-[#D4FF00]" aria-hidden="true" />
                    <span>COLLECTIBLE PHOTOCARDS</span>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black text-zinc-950 dark:text-white tracking-tight">
                  Objekt &amp; COMO
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  WAV collect physical and digital photocard <strong className="text-zinc-950 dark:text-white font-semibold">Objekts</strong> on COSMO across seasonal editions (Atom, Binary, Cream, Divine, Ever) and classes (First, Special, Double). Collecting Objekts grants <strong className="text-zinc-950 dark:text-white font-semibold">COMO</strong> voting tokens for Gravity.
                </p>
              </div>
              <div className="pt-4 text-xs font-mono text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/60 dark:border-white/10">
                COSMO : the Gate &bull; 1 Objekt = COMO
              </div>
            </article>

            {/* Pillar 03 */}
            <article className="py-8 lg:py-10 lg:pl-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-3xl sm:text-4xl text-zinc-300 dark:text-white/20 tabular-nums">
                    03
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    <Boxes className="w-4 h-4 text-zinc-950 dark:text-[#D4FF00]" aria-hidden="true" />
                    <span>ROTATING SUB-UNITS</span>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black text-zinc-950 dark:text-white tracking-tight">
                  Dimension &amp; Gravity
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Through <strong className="text-zinc-950 dark:text-white font-semibold">DIMENSION</strong>, the girls of tripleS join forces and demonstrate each of their abilities. Recreated every season through Grand Gravity fan votes, Dimensions form new concepts and unit combinations while remaining one 24-member group.
                </p>
              </div>
              <div className="pt-4 text-xs font-mono text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/60 dark:border-white/10">
                15 Official Dimensions &bull; Voted by WAV
              </div>
            </article>
          </div>
        </section>

        {/* ── 3. One and Also Twenty-Four (Unboxed MODHAUS Color Matrix) ── */}
        <section aria-labelledby="constellation-heading" className="py-16 sm:py-20 lg:py-24 border-b border-zinc-200/80 dark:border-white/10">
          <div className="max-w-3xl mb-8 sm:mb-12">
            <h2
              id="constellation-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.15]"
            >
              One and Also{" "}
              <span className="font-accent text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                Twenty-Four.
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-[65ch]">
              All 24 members in official S1&ndash;S24 reveal order with their signature MODHAUS colors. Select any member to view their profile:
            </p>
          </div>

          {/* Unboxed Architectural 24-Artist Roster Grid with Official MODHAUS Color Bands */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-zinc-200/80 dark:bg-white/10 border-y border-zinc-200/80 dark:border-white/10">
            {allMembers.map((member) => {
              const color = getMemberColor(member.id)
              const formattedId = member.id < 10 ? `S0${member.id}` : `S${member.id}`
              const isWhiteColor = color.toUpperCase() === "#FFFFFF"

              return (
                <Link
                  key={member.id}
                  href={`/members/${member.slug}`}
                  className="group relative flex items-center justify-between gap-2 px-3.5 py-4 bg-[#FAFAFA] dark:bg-[#08080A] hover:bg-zinc-100/80 dark:hover:bg-[#111116] transition-colors"
                >
                  {/* Signature MODHAUS color top bar */}
                  <span
                    className={`absolute inset-x-0 top-0 h-0.5 opacity-80 group-hover:opacity-100 transition-opacity ${
                      isWhiteColor ? "border-b border-zinc-300/80 dark:border-transparent" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />

                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15 dark:border-white/20"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <span className="block font-mono text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-[#D4FF00] font-bold transition-colors leading-tight">
                        {formattedId}
                      </span>
                      <span className="block font-display font-bold text-sm text-zinc-950 dark:text-white truncate">
                        {member.name}
                      </span>
                    </div>
                  </div>

                  <ArrowUpRight
                    className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-[#D4FF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-[#D4FF00]" aria-hidden="true" />
              <span>All 24 artists in official reveal order (S1&ndash;S24)</span>
            </div>
            <Link
              href="/members"
              className="nav-draw-link inline-flex items-center gap-1.5 text-zinc-950 dark:text-[#D4FF00] font-bold self-start sm:self-auto"
            >
              <span>Explore full 24-member profiles directory</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* ── 4. The tripleS Eras (Unboxed Hairline Chronology) ── */}
        <section aria-labelledby="timeline-heading" className="py-16 sm:py-20 lg:py-24 border-b border-zinc-200/80 dark:border-white/10">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <h2
              id="timeline-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.1]"
            >
              The tripleS{" "}
              <span className="font-accent text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                Eras.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans max-w-[65ch]">
              From an initial Instagram recruit to a world-first 24-member terrestrial music show #1 milestone and the global comeback trilogy.
            </p>
          </div>

          {/* Hairline Underline Era Tabs (Zero Rounded Pill Cards) */}
          <div
            role="tablist"
            aria-label="tripleS Eras"
            className="grid grid-cols-2 sm:grid-cols-4 mb-10 sm:mb-12"
          >
            {TIMELINE_ERAS.map((era, idx) => {
              const isActive = activeEraIndex === idx
              return (
                <button
                  key={era.year}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveEraIndex(idx)}
                  className={`relative pb-4 pt-3 px-2 sm:px-3 text-left border-b border-zinc-200/80 dark:border-white/10 transition-colors cursor-pointer ${
                    isActive
                      ? "text-zinc-950 dark:text-[#D4FF00]"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono mb-1">
                    <span className="font-bold tabular-nums">{era.year}</span>
                    <span className="uppercase tracking-wider opacity-80">{era.tag}</span>
                  </div>
                  <div className="font-display font-bold text-sm sm:text-base truncate">
                    {era.title}
                  </div>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-zinc-950 dark:bg-[#D4FF00]"
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* 50/50 Active Era Narrative Broadsheet */}
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeEraIndex}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
            >
              <div
                className="absolute top-0 right-0 font-display font-black text-7xl sm:text-9xl text-zinc-950/[0.03] dark:text-white/[0.03] select-none pointer-events-none hidden md:block leading-none"
                aria-hidden="true"
              >
                {TIMELINE_ERAS[activeEraIndex].year}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <span className="font-bold text-zinc-950 dark:text-[#D4FF00]">
                    ERA 0{activeEraIndex + 1}
                  </span>
                  <span aria-hidden="true">&bull;</span>
                  <span>{TIMELINE_ERAS[activeEraIndex].tag}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
                  {TIMELINE_ERAS[activeEraIndex].title}
                </h3>

                <p className="text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans max-w-[65ch]">
                  {TIMELINE_ERAS[activeEraIndex].subtitle}
                </p>

                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1 max-w-[65ch]">
                  {TIMELINE_ERAS[activeEraIndex].description}
                </p>
              </div>

              <div className="space-y-6 lg:border-l border-zinc-200/80 dark:border-white/10 lg:pl-10">
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
                    KEY RELEASES
                  </div>
                  <div className="divide-y divide-zinc-200/70 dark:divide-white/10">
                    {TIMELINE_ERAS[activeEraIndex].keyReleases.map((release, i) => (
                      <div key={i} className="py-2.5 first:pt-0 flex items-center gap-2.5 text-sm font-mono text-zinc-800 dark:text-zinc-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-[#D4FF00] shrink-0" aria-hidden="true" />
                        <span>{release}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-200/80 dark:border-white/10">
                  <div className="text-xs font-mono uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
                    HISTORIC MILESTONES
                  </div>
                  <div className="divide-y divide-zinc-200/70 dark:divide-white/10">
                    {TIMELINE_ERAS[activeEraIndex].achievements.map((achieve, i) => (
                      <div key={i} className="py-2.5 first:pt-0 flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0 mt-2" aria-hidden="true" />
                        <span>{achieve}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── 5. The Fandom Lexicon (Unboxed 2-Column Editorial Dictionary) ── */}
        <section aria-labelledby="glossary-heading" className="py-16 sm:py-20 lg:py-24 border-b border-zinc-200/80 dark:border-white/10">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <h2
              id="glossary-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.15]"
            >
              The Fandom{" "}
              <span className="font-accent text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                Lexicon.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans max-w-[65ch]">
              Official terms from MODHAUS and COSMO : the Gate used by tripleS and WAV.
            </p>
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 border-b border-zinc-200/80 dark:border-white/10">
            {GLOSSARY_ITEMS.map((item) => (
              <div
                key={item.term}
                className="border-t border-zinc-200/80 dark:border-white/10 py-6 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  <span className="font-bold text-zinc-950 dark:text-[#D4FF00] tabular-nums">
                    {item.index}
                  </span>
                  <span className="uppercase tracking-wider">
                    {item.subtitle}
                  </span>
                </div>
                <dt className="flex items-baseline gap-2.5">
                  <span className="font-display font-black text-xl sm:text-2xl text-zinc-950 dark:text-white tracking-tight">
                    {item.term}
                  </span>
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {item.korean}
                  </span>
                </dt>
                <dd className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[60ch]">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── 6. Official Channels (Unboxed Hairline Directory) ── */}
        <section aria-labelledby="portals-heading" className="pt-16 sm:pt-20 lg:pt-24">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <h2
              id="portals-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.1]"
            >
              Official{" "}
              <span className="font-accent text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                Channels.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans max-w-[65ch]">
              Official platforms operated by MODHAUS for COSMO : the Gate, daily SIGNAL episodes, music streaming, and group updates.
            </p>
          </div>

          <div className="divide-y divide-zinc-200/80 dark:divide-white/10 border-y border-zinc-200/80 dark:border-white/10">
            {VERIFIED_PORTALS.map((portal) => {
              const IconComponent = portal.icon
              return (
                <a
                  key={portal.name}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-1 md:grid-cols-12 items-center gap-4 py-5 px-2 transition-colors hover:bg-zinc-950/[0.02] dark:hover:bg-white/[0.03]"
                >
                  {/* Col 1: Icon + Title + Handle (4 cols) */}
                  <div className="md:col-span-4 flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/80 dark:border-white/15 flex items-center justify-center shrink-0">
                      {portal.isCustomIcon ? (
                        <Image
                          src="/icons/cosmo-logo.png"
                          alt="COSMO"
                          width={22}
                          height={22}
                          loading="eager"
                          unoptimized
                          className="w-[22px] h-[22px] object-contain"
                        />
                      ) : IconComponent ? (
                        <IconComponent className={`w-5 h-5 ${portal.colorClass || "text-zinc-950"}`} />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-base sm:text-lg text-zinc-950 dark:text-white group-hover:text-zinc-950 dark:group-hover:text-[#D4FF00] transition-colors truncate">
                          {portal.name}
                        </h3>
                        <span className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 shrink-0">
                          Verified
                        </span>
                      </div>
                      <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
                        {portal.handle}
                      </div>
                    </div>
                  </div>

                  {/* Col 2: Description (5 cols) */}
                  <div className="md:col-span-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {portal.description}
                  </div>

                  {/* Col 3: CTA & Arrow (3 cols, right-aligned) */}
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-2 text-xs font-mono font-bold text-zinc-950 dark:text-white group-hover:text-zinc-950 dark:group-hover:text-[#D4FF00] transition-colors">
                    <span>{portal.action}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
