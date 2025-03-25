"use client"

import { type ReactNode, useEffect } from "react"
import Lenis from "@studio-freight/lenis"

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation : "vertical",
      gestureOrientation : "vertical",
      smoothWheel : true,
      touchMultiplier : 2
    //   direction: "vertical",
    //   gestureDirection: "vertical",
    //   smooth: true,
    //   smoothTouch: false,
    //   touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

