"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"

// Curated official tripleS colors cycling sequentially on each transition
// Single clean solid color per transition with minimalist simplicity & aesthetics
const TRANSITION_PALETTE = [
  { dark: "#D4FF00", light: "#09090B", name: "Acid Voltage / Carbon" },
  { dark: "#8801FF", light: "#7C3AED", name: "S2 HyeRin Violet" },
  { dark: "#D10A70", light: "#BE185D", name: "S5 YooYeon Magenta" },
  { dark: "#17A7FE", light: "#0284C7", name: "S1 SeoYeon Azure" },
  { dark: "#FFA947", light: "#D97706", name: "S9 Kaede Amber" },
  { dark: "#C9FF50", light: "#4D7C0F", name: "S18 JooBin Volt" },
  { dark: "#C99DF3", light: "#7E22CE", name: "S24 JiYeon Lilac" },
  { dark: "#538FC8", light: "#1D4ED8", name: "S7 NaKyoung Cerulean" },
  { dark: "#76C722", light: "#15803D", name: "S4 ChaeYeon Leaf" },
  { dark: "#D51312", light: "#DC2626", name: "S15 Xinyu Crimson" },
]

// Fluid continuous calligraphy ribbon path spanning all four corners
const CALLIGRAPHY_RIBBON_PATH =
  "M20.002 787.914C41.7003 820.073 100.527 881.496 162.246 869.918C239.396 855.447 258.683 763.796 203.232 669.732C147.781 575.669 65.8095 404.425 162.246 361.011C258.683 317.597 292.436 397.189 294.847 553.962C297.258 710.734 444.324 739.677 463.611 640.789C482.898 541.902 249.039 414.072 323.778 283.831C398.516 153.589 675.772 218.71 656.484 464.722C637.197 710.734 579.335 925.392 745.688 922.98C912.042 920.568 928.918 797.562 875.878 686.615C822.838 575.669 731.223 500.9 890.343 430.955C1049.46 361.011 1080.81 262.124 996.424 194.591C912.042 127.058 733.634 346.54 656.484 225.945C579.335 105.351 400.927 35.4064 224.93 180.119"

type GsapModule = typeof import("gsap")["default"]

function resetScrollPosition() {
  if (typeof window === "undefined" || window.location.hash) return
  const win = window as unknown as {
    lenis?: { scrollTo: (y: number, opts?: { immediate?: boolean }) => void }
  }
  if (win.lenis) {
    win.lenis.scrollTo(0, { immediate: true })
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })
  }
}

export default function PageTransition() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const overlayRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const pathGlowRef = useRef<SVGPathElement>(null)
  const pathCoreRef = useRef<SVGPathElement>(null)
  const gsapRef = useRef<GsapModule | null>(null)
  const timelineRef = useRef<ReturnType<GsapModule["timeline"]> | null>(null)
  const isNavigatingRef = useRef(false)
  const prevPathnameRef = useRef(pathname)
  const colorIndexRef = useRef(0)
  const [mounted, setMounted] = useState(false)
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadGsap = useCallback(async (): Promise<GsapModule> => {
    if (gsapRef.current) return gsapRef.current
    const mod = await import("gsap")
    gsapRef.current = mod.default
    return mod.default
  }, [])

  useEffect(() => {
    setMounted(true)
    return () => {
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current)
        safetyTimerRef.current = null
      }
      timelineRef.current?.kill()
      timelineRef.current = null
    }
  }, [])

  // 1. Animate Out: Reveal newly arrived route while sweeping the ribbon offscreen
  const animateOut = useCallback(async () => {
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = null
    }

    resetScrollPosition()

    const overlay = overlayRef.current
    const backdrop = backdropRef.current
    const pathCore = pathCoreRef.current
    const pathGlow = pathGlowRef.current

    if (!overlay || !pathCore || !pathGlow) {
      isNavigatingRef.current = false
      return
    }

    const gsap = await loadGsap()
    timelineRef.current?.kill()

    const totalLength = pathCore.getTotalLength() || 4636

    const tl = gsap.timeline({
      onComplete: () => {
        overlay.style.pointerEvents = "none"
        overlay.style.visibility = "hidden"
        isNavigatingRef.current = false
        timelineRef.current = null
      },
    })
    timelineRef.current = tl

    // Ribbon stroke sweeps forward and thins out (0 -> -totalLength, 340 -> 30px)
    tl.to(
      [pathCore, pathGlow],
      {
        strokeDashoffset: -totalLength,
        strokeWidth: 30,
        duration: 0.6,
        ease: "power2.inOut",
      },
      0
    )

    // Backdrop veil fades out smoothly
    if (backdrop) {
      tl.to(
        backdrop,
        {
          opacity: 0,
          duration: 0.35,
          ease: "power1.out",
        },
        0.15
      )
    }
  }, [loadGsap])

  // 2. Animate In: Signature Calligraphic Ribbon Sweeps & Swells with Single Dynamic Member Color
  const animateIn = useCallback(
    async (href: string) => {
      if (isNavigatingRef.current) return

      const overlay = overlayRef.current
      const backdrop = backdropRef.current
      const pathCore = pathCoreRef.current
      const pathGlow = pathGlowRef.current

      if (!overlay || !pathCore || !pathGlow) {
        router.push(href)
        return
      }

      isNavigatingRef.current = true
      router.prefetch(href)

      const gsap = await loadGsap()
      timelineRef.current?.kill()

      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current)

      // Advance to next official tripleS color in rotation
      const nextIndex = (colorIndexRef.current + 1) % TRANSITION_PALETTE.length
      colorIndexRef.current = nextIndex
      const activeColor = TRANSITION_PALETTE[nextIndex]

      const isDark = resolvedTheme === "dark" || (!resolvedTheme && theme === "dark")
      const strokeColor = isDark ? activeColor.dark : activeColor.light

      pathCore.setAttribute("stroke", strokeColor)
      pathGlow.setAttribute("stroke", strokeColor)

      overlay.style.pointerEvents = "auto"
      overlay.style.visibility = "visible"

      const totalLength = pathCore.getTotalLength() || 4636

      gsap.set([pathCore, pathGlow], {
        strokeDasharray: `${totalLength} ${totalLength}`,
        strokeDashoffset: totalLength,
        strokeWidth: 40,
      })
      if (backdrop) gsap.set(backdrop, { opacity: 0 })

      // Fallback safety timeout if route navigation stalls or aborts
      safetyTimerRef.current = setTimeout(() => {
        if (isNavigatingRef.current) {
          void animateOut()
        }
      }, 1800)

      const tl = gsap.timeline({
        onComplete: () => {
          router.push(href)
        },
      })
      timelineRef.current = tl

      // Ribbon sweep & swelling stroke architecture
      tl.to(
        [pathCore, pathGlow],
        {
          strokeDashoffset: 0,
          strokeWidth: 340,
          duration: 0.55,
          ease: "power2.inOut",
        },
        0
      )

      // Backdrop fades in behind the sweeping ribbon
      if (backdrop) {
        tl.to(
          backdrop,
          {
            opacity: 1,
            duration: 0.32,
            ease: "power1.inOut",
          },
          0.16
        )
      }
    },
    [router, resolvedTheme, theme, animateOut, loadGsap]
  )

  // 3. Respond to pathname changes: play exit sweep if triggered, or reset scroll cleanly
  useEffect(() => {
    if (prevPathnameRef.current === pathname) return
    prevPathnameRef.current = pathname

    if (isNavigatingRef.current) {
      void animateOut()
    } else {
      resetScrollPosition()
    }
  }, [pathname, animateOut])

  // 4. Intercept internal route link clicks (preserving reduced motion, external links, and query/hash updates)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return
      }

      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href) return

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return
      }

      const currentUrl = new URL(window.location.href)
      const targetUrl = new URL(href, window.location.href)
      if (currentUrl.origin !== targetUrl.origin || currentUrl.pathname === targetUrl.pathname) {
        return
      }

      e.preventDefault()
      void animateIn(href)
    }

    document.addEventListener("click", handleDocumentClick, { capture: true })
    return () => document.removeEventListener("click", handleDocumentClick, { capture: true })
  }, [animateIn])

  if (!mounted) return null

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{ visibility: "hidden" }}
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Backdrop Glass Scrim */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[#FAFAFA]/95 dark:bg-[#08080A]/95 backdrop-blur-xl opacity-0"
      />

      {/* 2. Fluid Single-Color SVG Ribbon Canvas (140% oversized shape) */}
      <div className="absolute inset-[-20%] w-[140%] h-[140%] flex items-center justify-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1062 1000"
          preserveAspectRatio="none"
          className="w-full h-full pointer-events-none overflow-hidden"
        >
          <defs>
            <filter id="ribbon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Underlay Subtle Bloom Ribbon */}
          <path
            ref={pathGlowRef}
            d={CALLIGRAPHY_RIBBON_PATH}
            fill="none"
            stroke="#D4FF00"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ribbon-glow)"
            strokeDasharray="4636 4636"
            strokeDashoffset="4636"
            strokeWidth="30"
            className="opacity-40"
          />

          {/* Foreground Pure Vector Ribbon (Solid Color Cycling on Every Route Change) */}
          <path
            ref={pathCoreRef}
            d={CALLIGRAPHY_RIBBON_PATH}
            fill="none"
            stroke="#D4FF00"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4636 4636"
            strokeDashoffset="4636"
            strokeWidth="30"
          />
        </svg>
      </div>
    </div>
  )
}
