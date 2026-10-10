"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "motion/react"
import { ArrowUpRight, Shuffle } from "lucide-react"
import type { Member } from "@/types/member"

gsap.registerPlugin(ScrollTrigger)

interface HowItWorksSectionProps {
  members: Member[]
}

// 24 Official Member Colors (MODHAUS Identity from GEMINI.md)
const OFFICIAL_MEMBER_COLORS: Record<number, string> = {
  1: "#17A7FE",
  2: "#8801FF",
  3: "#FFD800",
  4: "#76C722",
  5: "#D10A70",
  6: "#FF95C8",
  7: "#538FC8",
  8: "#FFECF3",
  9: "#FFA947",
  10: "#FF73B3",
  11: "#FFF554",
  12: "#4243A2",
  13: "#FF9649",
  14: "#082855",
  15: "#D51312",
  16: "#F88059",
  17: "#C7DFF8",
  18: "#C9FF50",
  19: "#85E3B3",
  20: "#FFAFD3",
  21: "#BEE6B5",
  22: "#FD82B8",
  23: "#FFFFFF",
  24: "#C99DF3",
}

function getContrastingInk(hex: string): string {
  const c = hex.replace("#", "")
  const r = parseInt(c.substring(0, 2), 16) || 0
  const g = parseInt(c.substring(2, 4), 16) || 0
  const b = parseInt(c.substring(4, 6), 16) || 0
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 150 ? "#09090B" : "#FFFFFF"
}

const FAN_SLOTS = [
  { rotate: -9, x: -58 },
  { rotate: 0, x: 0 },
  { rotate: 9, x: 58 },
] as const

const STEPS = [
  {
    n: "1",
    title: "Collect",
    body: "Every Objekt you collect in COSMO earns COMO, the token fans vote with.",
    href: "/objekts",
    cta: "Open vault",
    external: false,
  },
  {
    n: "2",
    title: "Vote",
    body: "Spend COMO in Gravity to pick unit line-ups, leaders and concepts.",
    href: "/about",
    cta: "How Gravity works",
    external: false,
  },
  {
    n: "3",
    title: "Watch",
    body: "See the result play out on SIGNAL, the group's daily video log.",
    href: "https://www.youtube.com/@triplescosmos",
    cta: "Watch SIGNAL",
    external: true,
  },
] as const

export default function HowItWorksSection({ members }: HowItWorksSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  // Deterministic SSR fallback (S9, S1, S15)
  const [selectedMembers, setSelectedMembers] = useState<Member[]>(() => {
    const defaultIds = [9, 1, 15]
    const found = defaultIds.map((id) => members.find((m) => m.id === id)).filter(Boolean) as Member[]
    return found.length === 3 ? found : members.slice(0, 3)
  })

  // Pick 3 random distinct members
  const pickRandomTrio = useCallback(
    (currentIds: number[] = []) => {
      if (members.length < 3) return
      const pool = members.filter((m) => !currentIds.includes(m.id))
      const source = pool.length >= 3 ? pool : members
      const shuffled = [...source].sort(() => Math.random() - 0.5)
      setSelectedMembers(shuffled.slice(0, 3))
    },
    [members]
  )

  // Randomize on client mount
  useEffect(() => {
    pickRandomTrio()
  }, [pickRandomTrio])

  const fan = selectedMembers.map((member, i) => {
    const slot = FAN_SLOTS[i] || FAN_SLOTS[1]
    const color = OFFICIAL_MEMBER_COLORS[member.id] || "#17A7FE"
    const ink = getContrastingInk(color)
    return {
      member,
      color,
      ink,
      rotate: slot.rotate,
      x: slot.x,
    }
  })

  useEffect(() => {
    if (reduceMotion || !sectionRef.current) return
    const ctx = gsap.context(() => {
      // One orchestrated moment: the photo wipes open, then the Objekts fan out of a single stack.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".loop-media", start: "top 75%", once: true },
      })
      tl.from(".loop-photo", {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.1,
        ease: "expo.out",
      })
      gsap.utils.toArray<HTMLElement>(".loop-objekt").forEach((el, i) => {
        const xp = Number(el.dataset.x ?? 0)
        const rot = Number(el.dataset.rotate ?? 0)
        tl.fromTo(
          el,
          { x: 0, xPercent: 0, rotation: 0, y: 40, opacity: 0 },
          { x: 0, xPercent: xp, rotation: rot, y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.4)" },
          i === 0 ? "-=0.6" : "<0.08"
        )
      })
      tl.from(
        ".loop-step",
        { y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 },
        "-=0.5"
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [reduceMotion])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="how-it-works-heading"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-white/10 bg-[#fafafa] dark:bg-[#08080A]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header: single focused message, stacked (no eyebrow, no split header) */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-[-0.04em] text-zinc-950 dark:text-white leading-[1.05]"
          >
            You decide what tripleS does{" "}
            <span className="font-accent font-normal tracking-normal text-[1.25em] leading-none text-zinc-950 dark:text-[#D4FF00]">
              next.
            </span>
          </h2>
          <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[46ch]">
            Unit line-ups and leaders are decided by fans, through Gravity votes in the COSMO app.
          </p>
        </div>

        {/* Media: asymmetric 7/5 with the Objekt fan dropped lower for rhythm */}
        <div className="loop-media grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-16 sm:mb-20">
          <div className="loop-photo relative lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:h-[540px] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-[#14141B]">
            <Image
              src="/home/triples_hatchi.jpg"
              alt="tripleS members together on stage"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center"
            />
          </div>

          <div
            className="relative lg:col-span-5 h-[380px] sm:h-[440px] lg:h-[480px] lg:mt-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-[#14141B] shadow-[inset_0_1px_0_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
            aria-label="Example Objekt photocards"
            role="img"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {fan.map(({ member, color, ink, rotate, x }, i) => (
                <div
                  key={member.id}
                  className="loop-objekt absolute w-[38%] max-w-[180px]"
                  data-x={x}
                  data-rotate={rotate}
                  style={{ transform: `translateX(${x}%) rotate(${rotate}deg)`, zIndex: i === 1 ? 3 : 1 }}
                >
                  <Link
                    href={`/members/${member.slug}`}
                    className="group block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-4 focus-visible:-translate-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] focus-visible:ring-offset-4 rounded-xl"
                  >
                    <div className="relative aspect-[5.5/8.5] rounded-xl overflow-hidden bg-white shadow-[0_24px_48px_-16px_rgba(9,9,11,0.35)]">
                      <Image
                        src={`https://i.imgur.com/${member.image}`}
                        alt={`${member.name} Objekt`}
                        fill
                        sizes="180px"
                        className="object-cover object-top"
                      />
                      {/* Objekt side band: member color + S-number, like the physical card */}
                      <div
                        className="absolute inset-y-0 right-0 w-[16%] flex items-center justify-center"
                        style={{ backgroundColor: color, color: ink }}
                      >
                        <span className="font-mono text-[10px] font-bold whitespace-nowrap [writing-mode:vertical-rl]">
                          {member.name} S{member.id}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Interactive Shuffle Trigger */}
            <div className="absolute bottom-3 right-3 z-20">
              <button
                type="button"
                onClick={() => pickRandomTrio(selectedMembers.map((m) => m.id))}
                aria-label="Shuffle random member Objekts"
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#0D0D12]/90 hover:bg-white dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-[11px] font-mono font-medium backdrop-blur-md border border-zinc-200 dark:border-white/15 transition-all shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
              >
                <Shuffle className="w-3 h-3 text-zinc-950 dark:text-[#D4FF00] transition-transform duration-300 group-hover:rotate-180" />
                <span>Shuffle S#</span>
              </button>
            </div>
          </div>
        </div>

        {/* The loop: a real sequence, so numerals are meaningful */}
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 lg:gap-12 border-t border-zinc-200 dark:border-white/10">
          {STEPS.map((step) => (
            <li key={step.n} className="loop-step pt-8">
              <span className="block font-display font-bold text-6xl sm:text-7xl leading-none tracking-[-0.05em] text-zinc-300 dark:text-white/15 mb-6" aria-hidden="true">
                {step.n}
              </span>
              <h3 className="font-display font-bold text-2xl tracking-tight text-zinc-950 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[32ch] mb-5">
                {step.body}
              </p>
              {step.external ? (
                <a
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-magnetic nav-draw-link gap-1.5 text-sm font-semibold text-zinc-950 dark:text-[#D4FF00]"
                >
                  {step.cta}
                  <ArrowUpRight className="btn-arrow w-4 h-4" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  href={step.href}
                  className="btn-magnetic nav-draw-link gap-1.5 text-sm font-semibold text-zinc-950 dark:text-[#D4FF00]"
                >
                  {step.cta}
                  <ArrowUpRight className="btn-arrow w-4 h-4" aria-hidden="true" />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
