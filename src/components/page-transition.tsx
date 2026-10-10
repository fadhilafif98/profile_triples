"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import gsap from "gsap"

// Curated official tripleS colors cycling sequentially on each transition
// Single clean solid color per transition matching LxL simplicity & aesthetics
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

export default function PageTransition() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const overlayRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const pathGlowRef = useRef<SVGPathElement>(null)
  const pathCoreRef = useRef<SVGPathElement>(null)
  const isNavigatingRef = useRef(false)
  const targetPathRef = useRef<string | null>(null)
  const colorIndexRef = useRef(0)
  const [mounted, setMounted] = useState(false)
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 1. Animate Out: Screen reveals new page as route updates
  const animateOut = useCallback(() => {
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = null
    }

    if (!overlayRef.current || !pathCoreRef.current || !pathGlowRef.current) return
    const overlay = overlayRef.current
    const backdrop = backdropRef.current
    const pathCore = pathCoreRef.current
    const pathGlow = pathGlowRef.current

    window.scrollTo(0, 0)

    const totalLength = pathCore.getTotalLength() || 4636

    const tl = gsap.timeline({
      onComplete: () => {
        overlay.style.pointerEvents = "none"
        overlay.style.visibility = "hidden"
        isNavigatingRef.current = false
        targetPathRef.current = null
      },
    })

    // Ribbon stroke sweeps forward and thins out (0 -> -totalLength, 340 -> 30px)
    tl.to(
      [pathCore, pathGlow],
      {
        strokeDashoffset: -totalLength,
        strokeWidth: 30,
        duration: 0.65,
        ease: "power2.inOut",
      },
      0
    )

    // Backdrop veil fades out seamlessly
    if (backdrop) {
      tl.to(
        backdrop,
        {
          opacity: 0,
          duration: 0.4,
          ease: "power1.out",
        },
        0.15
      )
    }
  }, [])

  // 2. Animate In: Signature LxL-Style Simple Ribbon Sweeps & Swells with Single Dynamic Color
  const animateIn = useCallback(
    (href: string) => {
      if (!overlayRef.current || !pathCoreRef.current || !pathGlowRef.current) {
        router.push(href)
        return
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (prefersReducedMotion) {
        router.push(href)
        return
      }

      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current)

      isNavigatingRef.current = true
      targetPathRef.current = href

      const overlay = overlayRef.current
      const backdrop = backdropRef.current
      const pathCore = pathCoreRef.current
      const pathGlow = pathGlowRef.current

      // Advance to next official tripleS color in rotation
      const nextIndex = (colorIndexRef.current + 1) % TRANSITION_PALETTE.length
      colorIndexRef.current = nextIndex
      const activeColor = TRANSITION_PALETTE[nextIndex]

      const isDark = resolvedTheme === "dark" || (!resolvedTheme && theme === "dark")
      const strokeColor = isDark ? activeColor.dark : activeColor.light

      // Apply single solid color directly to SVG paths
      pathCore.setAttribute("stroke", strokeColor)
      pathGlow.setAttribute("stroke", strokeColor)

      overlay.style.pointerEvents = "auto"
      overlay.style.visibility = "visible"

      const totalLength = pathCore.getTotalLength() || 4636

      // Reset initial stroke states
      gsap.set([pathCore, pathGlow], {
        strokeDasharray: `${totalLength} ${totalLength}`,
        strokeDashoffset: totalLength,
        strokeWidth: 40,
      })
      if (backdrop) gsap.set(backdrop, { opacity: 0 })

      // Fallback safety timeout
      safetyTimerRef.current = setTimeout(() => {
        if (isNavigatingRef.current) {
          animateOut()
        }
      }, 1800)

      // GSAP Timeline for Entrance
      const tl = gsap.timeline({
        onComplete: () => {
          router.push(href)
        },
      })

      // Ribbon sweep & swelling stroke (1:1 LxL Creative architecture)
      tl.to(
        [pathCore, pathGlow],
        {
          strokeDashoffset: 0,
          strokeWidth: 340,
          duration: 0.65,
          ease: "power2.inOut",
        },
        0
      )

      // Backdrop fades in for zero-flicker transition
      if (backdrop) {
        tl.to(
          backdrop,
          {
            opacity: 1,
            duration: 0.35,
            ease: "power1.inOut",
          },
          0.18
        )
      }
    },
    [router, resolvedTheme, theme, animateOut]
  )

  // 3. Listen to pathname change: When router completes navigation, animate out
  useEffect(() => {
    if (isNavigatingRef.current) {
      animateOut()
    }
  }, [pathname, animateOut])

  // 4. Intercept clicks on internal navigation links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Ignore modified clicks (cmd, ctrl, shift, right-click)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href) return

      // Ignore external links, downloads, hash links, mailto, tel
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

      // Check if already on the same page
      const currentUrl = new URL(window.location.href)
      const targetUrl = new URL(href, window.location.href)
      if (currentUrl.pathname === targetUrl.pathname && currentUrl.search === targetUrl.search) {
        return
      }

      // Prevent instant navigation and execute transition
      e.preventDefault()
      animateIn(href)
    }

    document.addEventListener("click", handleDocumentClick, { capture: true })
    return () => document.removeEventListener("click", handleDocumentClick, { capture: true })
  }, [animateIn])

  if (!mounted) return null

  // Iconic LxL fluid continuous calligraphy ribbon path (spans all 4 corners)
  const lxlRibbonPath =
    "M20.002 787.914C41.7003 820.073 100.527 881.496 162.246 869.918C239.396 855.447 258.683 763.796 203.232 669.732C147.781 575.669 65.8095 404.425 162.246 361.011C258.683 317.597 292.436 397.189 294.847 553.962C297.258 710.734 444.324 739.677 463.611 640.789C482.898 541.902 249.039 414.072 323.778 283.831C398.516 153.589 675.772 218.71 656.484 464.722C637.197 710.734 579.335 925.392 745.688 922.98C912.042 920.568 928.918 797.562 875.878 686.615C822.838 575.669 731.223 500.9 890.343 430.955C1049.46 361.011 1080.81 262.124 996.424 194.591C912.042 127.058 733.634 346.54 656.484 225.945C579.335 105.351 400.927 35.4064 224.93 180.119"

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{ visibility: "hidden" }}
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Backdrop Glass Scrim: Zero-flicker subtle veil */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[#FAFAFA]/95 dark:bg-[#08080A]/95 backdrop-blur-xl opacity-0"
      />

      {/* 2. Fluid Single-Color SVG Ribbon Canvas (140% oversized matching LxL .transition_shape) */}
      <div className="absolute inset-[-20%] w-[140%] h-[140%] flex items-center justify-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1062 1000"
          preserveAspectRatio="none"
          className="w-full h-full pointer-events-none overflow-hidden"
        >
          <defs>
            {/* Ethereal Optical Edge Softening */}
            <filter id="ribbon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Underlay Subtle Bloom Ribbon */}
          <path
            ref={pathGlowRef}
            d={lxlRibbonPath}
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
            d={lxlRibbonPath}
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
