"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useReducedMotion } from "motion/react"
import WavWordmark from "@/components/wav-wordmark"

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Subtle natural mouse movement for photographic depth (disabled on reduced motion & touch)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion || !imageRef.current || window.innerWidth < 1024) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(imageRef.current, {
      x: x * 12,
      y: y * 12,
      scale: 1.03,
      duration: 1.2,
      ease: "power2.out",
    })
  }

  const handleMouseLeave = () => {
    if (shouldReduceMotion || !imageRef.current) return
    gsap.to(imageRef.current, {
      x: 0,
      y: 0,
      scale: 1.01,
      duration: 1.4,
      ease: "power2.out",
    })
  }

  useEffect(() => {
    if (shouldReduceMotion || !containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.75, delay: 0.1 }
      )
        .fromTo(
          ".hero-main-title",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.95 },
          "-=0.55"
        )
        .fromTo(
          ".hero-bottom-bar",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.75 },
          "-=0.55"
        )
    }, containerRef)

    return () => ctx.revert()
  }, [shouldReduceMotion])

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-labelledby="hero-main-heading"
      className="relative h-[100dvh] min-h-[100dvh] w-full flex flex-col justify-end overflow-hidden select-none bg-zinc-950"
    >
      {/* Full-Viewport 24-Member Group Portrait */}
      <div
        ref={imageRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 will-change-transform scale-[1.01] origin-center"
      >
        <Image
          src="/home/triples_hero.jpg"
          alt="tripleS 24-member full group assemble portrait"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-[center_28%] sm:object-[center_28%] lg:object-[center_25%] brightness-[1.02] contrast-[1.04]"
        />

        {/* Top Vignette: Preserves fixed navbar legibility */}
        <div className="absolute inset-x-0 top-0 h-36 sm:h-44 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />

        {/* Subtle Ambient Scrim */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Optical Contrast Well: Keeps lower-third typography legible without hiding member styling */}
        <div className="absolute inset-x-0 bottom-0 h-[48vh] sm:h-[42vh] bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Screen Reader Group Roster Context */}
      <div className="sr-only">
        <p className="font-bold">tripleS: The Idol of All Possibilities</p>
        <p>
          24-member South Korean girl group under MODHAUS featuring Yoon SeoYeon, Jeong HyeRin, Lee JiWoo, Kim ChaeYeon, Kim YooYeon, Kim SooMin, Kim NaKyoung, Gong YuBin, Kaede, Seo DaHyun, Kotone, Kwak YeonJi, Nien, Park SoHyun, Xinyu, Mayu, Lynn, JooBin, Jeong HaYeon, Park ShiOn, Kim ChaeWon, Sullin, SeoAh, and JiYeon.
        </p>
      </div>

      {/* Lower-Third Pure K-Pop Editorial Typography */}
      <div className="relative z-10 w-full px-5 sm:px-8 md:px-12 lg:px-16 pb-6 sm:pb-12 max-w-7xl mx-auto">
        <div className="hero-eyebrow mb-1.5 sm:mb-2.5">
          <p className="text-[11px] sm:text-sm font-mono tracking-[0.2em] uppercase text-zinc-300/90 font-medium flex items-center gap-2">
            <span>The Idol of All Possibilities</span>
            <span className="text-white/40" aria-hidden="true">&bull;</span>
            <span className="font-sans font-normal tracking-normal text-zinc-300" lang="ko">트리플에스</span>
          </p>
        </div>

        <h1
          id="hero-main-heading"
          className="hero-main-title text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] 2xl:text-[7.5rem] font-black tracking-[-0.04em] leading-[0.9] sm:leading-[0.88] font-display text-white select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
        >
          tripleS
        </h1>

        <nav
          aria-label="Hero Dimension Quick Links"
          className="hero-bottom-bar mt-5 sm:mt-8 pt-3.5 sm:pt-5 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-xs font-mono text-zinc-300"
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] shrink-0"
              aria-hidden="true"
            />
            <span className="tracking-widest uppercase font-semibold text-white text-[11px] sm:text-xs">
              ASSEMBLE24 &bull; 24 MEMBERS
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-300">
            <span className="text-[11px] tracking-wider text-zinc-300/85 hidden md:inline-flex items-center gap-2">
              <span>S1 SeoYeon — S24 JiYeon</span>
              <span className="text-white/35" aria-hidden="true">&bull;</span>
              <span>MODHAUS</span>
            </span>
            <WavWordmark className="h-3.5 text-white/90 hidden sm:inline-block" />
            <Link
              href="/members"
              className="group inline-flex items-center gap-2 text-white hover:text-[#D4FF00] focus-visible:text-[#D4FF00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors font-medium underline underline-offset-4 pointer-events-auto text-xs"
              aria-label="Explore all 24 member profiles directory"
            >
              <span>Explore All 24 Members</span>
              <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </nav>
      </div>
    </section>
  )
}
