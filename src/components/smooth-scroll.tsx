"use client"

import { type ReactNode, useEffect } from "react"
import type Lenis from "@studio-freight/lenis"

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    if (typeof window === "undefined") return

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)")

    // Skip smooth-wheel inertia on touch devices or when reduced motion is preferred
    if (reducedMotionQuery.matches || !finePointerQuery.matches) {
      return
    }

    let cancelled = false
    let rafId = 0
    let lenis: Lenis | null = null

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    const startLoop = () => {
      if (cancelled || document.hidden || !lenis || rafId) return
      const raf = (time: number) => {
        if (cancelled || document.hidden || !lenis) {
          rafId = 0
          return
        }
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop()
      } else {
        startLoop()
      }
    }

    import("@studio-freight/lenis").then(({ default: LenisConstructor }) => {
      if (cancelled) return

      lenis = new LenisConstructor({
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.0,
        wheelMultiplier: 1.0,
      })

      ;(window as unknown as { lenis?: Lenis }).lenis = lenis
      document.addEventListener("visibilitychange", handleVisibilityChange)
      startLoop()
    })

    return () => {
      cancelled = true
      stopLoop()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (lenis) {
        ;(window as unknown as { lenis?: Lenis }).lenis = undefined
        lenis.destroy()
      }
    }
  }, [])

  return <>{children}</>
}
