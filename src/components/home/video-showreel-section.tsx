"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import ScrollExpand from "@/components/scroll-expand"
import { useSafeReducedMotion } from "@/lib/a11y"

export default function VideoShowreelSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isMuted, setIsMuted] = useState(true)
  const shouldReduceMotion = useSafeReducedMotion()

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

  // Play video only when section is visible in viewport (~0.15 threshold) and motion is allowed
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    video.defaultMuted = true
    video.muted = true

    if (shouldReduceMotion) {
      video.pause()
      return
    }

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
  }, [shouldReduceMotion])

  return (
    <section
      ref={sectionRef}
      className="video-scroll_wrap relative w-full bg-[#08080A] text-white overflow-x-clip"
    >
      <h2 className="sr-only">
        The Idol Of All Possibilities, tripleS Showreel
      </h2>

      <ScrollExpand
        mediaType="video"
        sources={[
          { src: "/home/andless_showreel.webm", type: "video/webm" },
          { src: "/home/andless_showreel.mp4", type: "video/mp4" },
        ]}
        poster="/home/andless_showreel_poster.jpg"
        width={1920}
        height={1080}
        loading="lazy"
        videoRef={videoRef}
        autoPlayVideo={false}
        preload="none"
        title={
          <span className="flex flex-col items-center text-center select-none">
            <span className="font-display font-medium text-[clamp(1.125rem,2.2vw,2rem)] tracking-[-0.025em] leading-[1.15] text-white/80 mb-[clamp(0.3rem,0.6vw,0.55rem)]">
              The Idol Of
            </span>
            <span className="font-display font-extrabold text-[clamp(2.35rem,6.2vw,5.85rem)] tracking-[-0.04em] leading-[1.02] text-white whitespace-nowrap">
              All Possibilities
            </span>
          </span>
        }
        useWindowScroll
        enabled={!shouldReduceMotion}
      >
        <div className="w-full max-w-2xl mx-auto text-center text-white select-none pointer-events-none flex flex-col items-center">
          <h3 className="font-display font-extrabold tracking-[-0.035em] leading-[1.05] text-white text-[clamp(2rem,4.5vw,4.25rem)] max-w-[16ch] mb-5 [text-shadow:0_4px_24px_rgba(0,0,0,0.85)]">
            We are one, and also twenty-four.
          </h3>
          <p className="font-sans text-sm sm:text-base md:text-lg text-zinc-200/90 max-w-[44ch] leading-relaxed [text-shadow:0_2px_18px_rgba(0,0,0,0.9)]">
            Twenty-four members assemble across fan-voted Dimensions, where WAV shape every unit, title track, and era.
          </p>
        </div>

        {/* Compact Utility Controls */}
        <div className="absolute bottom-5 sm:bottom-8 inset-x-0 z-30 flex items-center justify-center gap-2 sm:gap-2.5 px-3 pointer-events-none">
          <button
            type="button"
            role="switch"
            aria-checked={!isMuted}
            onClick={toggleSound}
            className="group pointer-events-auto inline-flex items-center gap-2 min-h-8 [@media(pointer:coarse)]:min-h-11 px-3.5 [@media(pointer:coarse)]:px-4 py-1.5 rounded-full bg-black/70 hover:bg-black/85 backdrop-blur-md border border-white/20 hover:border-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4FF00] transition-[background-color,border-color,transform] duration-200 text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-wider text-white shadow-xl cursor-pointer active:scale-95"
          >
            <span className="text-zinc-300 group-hover:text-white transition-colors">
              Sound
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
            className="group pointer-events-auto inline-flex items-center gap-1.5 min-h-8 [@media(pointer:coarse)]:min-h-11 px-3.5 [@media(pointer:coarse)]:px-4 py-1.5 rounded-full bg-black/70 hover:bg-black/85 backdrop-blur-md border border-white/20 hover:border-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4FF00] text-zinc-300 hover:text-white font-mono text-[10px] sm:text-[11px] uppercase tracking-wider transition-[background-color,border-color,color,transform] duration-200 shadow-xl active:scale-95"
          >
            <span>Watch MV</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </a>
        </div>
      </ScrollExpand>
    </section>
  )
}
