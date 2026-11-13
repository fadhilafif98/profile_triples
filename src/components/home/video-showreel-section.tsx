"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "motion/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function VideoShowreelSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoCardRef = useRef<HTMLDivElement>(null)
  const borderCardRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isMuted, setIsMuted] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  const toggleSound = () => {
    if (!videoRef.current) return
    const nextMuted = !videoRef.current.muted
    videoRef.current.muted = nextMuted
    if (!nextMuted) {
      videoRef.current.volume = 1
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {})
      }
    }
    setIsMuted(nextMuted)
  }

  // Play video only when section is visible in viewport (~0.15 threshold)
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    video.defaultMuted = true
    video.muted = true

    if (typeof IntersectionObserver === "undefined") {
      video.play().catch(() => {})
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          const playPromise = video.play()
          if (playPromise !== undefined) {
            playPromise.catch(() => {})
          }
        } else {
          video.pause()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  // GPU-accelerated clip-path expansion (zero DOM reflow)
  useEffect(() => {
    if (shouldReduceMotion || !sectionRef.current || !videoCardRef.current) {
      return
    }

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768

      const initialInset = isMobile
        ? "inset(24vh 6vw 24vh 6vw round 1.5rem)"
        : "inset(16vh 25vw 16vh 25vw round 2.5rem)"

      const finalInset = "inset(0vh 0vw 0vh 0vw round 0rem)"

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100vh",
          scrub: 0.3,
        },
      })

      tl.fromTo(
        videoCardRef.current,
        { clipPath: initialInset },
        {
          clipPath: finalInset,
          ease: "power2.inOut",
          duration: 1,
        },
        0
      )

      if (borderCardRef.current) {
        tl.fromTo(
          borderCardRef.current,
          { clipPath: initialInset, opacity: 1 },
          {
            clipPath: finalInset,
            opacity: 0,
            ease: "power2.inOut",
            duration: 0.9,
          },
          0
        )
      }

      if (overlayRef.current) {
        tl.fromTo(
          overlayRef.current,
          { opacity: 0.2 },
          { opacity: 0.65, ease: "power1.inOut", duration: 0.8 },
          0.2
        )
      }

      if (controlsRef.current) {
        tl.fromTo(
          controlsRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, ease: "power2.out", duration: 0.6 },
          0.3
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [shouldReduceMotion])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="showreel-heading"
      className="video-scroll_wrap relative w-full bg-[#08080A] text-white overflow-x-clip"
    >
      <h2 id="showreel-heading" className="sr-only">
        tripleS &apos;Andless&apos; Music Video Showcase
      </h2>

      {/* Sticky Viewport: Expanding Video Showreel */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center z-0">
        <div
          ref={videoCardRef}
          className="absolute inset-0 w-full h-full overflow-hidden bg-[#08080A] will-change-[clip-path]"
        >
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            poster="/home/andless_showreel_poster.jpg"
            aria-hidden="true"
            className="w-full h-full object-cover brightness-[0.9] contrast-[1.05]"
          >
            <source src="/home/andless_showreel.webm" type="video/webm" />
            <source src="/home/andless_showreel.mp4" type="video/mp4" />
          </video>

          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/60 pointer-events-none z-10"
          />

          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#08080A] via-[#08080A]/60 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08080A] via-[#08080A]/60 to-transparent pointer-events-none z-10" />
        </div>

        <div
          ref={borderCardRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none border border-white/20 shadow-2xl will-change-[clip-path,opacity]"
        />

        {/* Compact Utility Controls */}
        <div
          ref={controlsRef}
          className="absolute bottom-5 sm:bottom-8 inset-x-0 z-30 flex items-center justify-center gap-2 sm:gap-2.5 px-3 pointer-events-none"
        >
          <button
            type="button"
            role="switch"
            aria-checked={!isMuted}
            onClick={toggleSound}
            className="group pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/85 backdrop-blur-md border border-white/20 hover:border-white/40 transition-[background-color,border-color,transform] duration-200 text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-wider text-white shadow-xl cursor-pointer active:scale-95"
          >
            <span className="text-zinc-300 group-hover:text-white transition-colors">
              Sound {isMuted ? "Off" : "On"}
            </span>
            <span
              aria-hidden="true"
              className="w-7 h-3.5 rounded-full bg-zinc-800 border border-white/20 p-0.5 flex items-center transition-colors relative"
              style={{
                backgroundColor: isMuted ? "rgba(39, 39, 42, 0.8)" : "#D4FF00",
              }}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full transition-transform duration-300 ${
                  isMuted
                    ? "bg-zinc-400 translate-x-0"
                    : "bg-black translate-x-3.5"
                }`}
              />
            </span>
          </button>

          <a
            href="https://www.youtube.com/watch?v=uqJ6GDJSyfY"
            target="_blank"
            rel="noopener noreferrer"
            className="group pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/85 backdrop-blur-md border border-white/20 hover:border-white/40 text-zinc-300 hover:text-white font-mono text-[10px] sm:text-[11px] uppercase tracking-wider transition-[background-color,border-color,color,transform] duration-200 shadow-xl active:scale-95"
          >
            <span>Watch MV</span>
            <span className="text-[11px] text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* Scrolling Editorial Statement Over Pinned Video */}
      <div className="relative z-20 min-h-[220vh] flex flex-col items-center justify-start px-4 sm:px-6 pointer-events-none -mt-[100dvh] pt-[105vh] sm:pt-[110vh] pb-[50vh]">
        <div className="w-full max-w-4xl mx-auto text-center text-white select-none">
          <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-[2.35rem] xl:text-[2.55rem] font-display font-extrabold uppercase tracking-tight leading-[1.12] sm:leading-[1.08] lg:leading-[1.06] text-[#F8F8FA] [text-shadow:0_4px_24px_rgba(0,0,0,0.95)]">
            tripleS is the K-pop girl group of{" "}
            <span className="font-accent lowercase font-normal text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] text-[#D4FF00] inline-block px-1 align-baseline">
              all
            </span>{" "}
            possibilities. With 24 members assembling across dynamic{" "}
            <span className="font-accent lowercase font-normal text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] text-[#D4FF00] inline-block px-1 align-baseline">
              dimensions,
            </span>{" "}
            WAV shape every unit, title track, and era.
          </p>
        </div>
      </div>
    </section>
  )
}
