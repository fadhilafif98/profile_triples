"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, Users, Info, Heart, Disc3, Layers, Boxes } from "lucide-react"
import AnimatedLogo from "./animated-logo"
import { ThemeToggle, ThemePillToggle } from "./theme-toggle"
import WavDoodle from "./wav-doodle"

const NAV_LINKS = [
  { name: "Members", href: "/members", icon: Users },
  { name: "Dimensions", href: "/sub-units", icon: Boxes },
  { name: "Objekts", href: "/objekts", icon: Layers },
  { name: "Albums", href: "/albums", icon: Disc3 },
  { name: "About", href: "/about", icon: Info },
  { name: "Credits", href: "/credits", icon: Heart },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const isPast = window.scrollY > 30
      setScrolled((prev) => (prev !== isPast ? isPast : prev))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const isAtHero = pathname === "/" && !scrolled

  // WCAG 2.1.2: Close mobile drawer on Escape key press
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <>
      {/* ── Main Top Navigation Bar (Full-Width Edge-to-Edge with max-w-7xl Grid Alignment) ── */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          isAtHero
            ? "bg-transparent border-b border-transparent shadow-none backdrop-blur-none"
            : scrolled
            ? "bg-white/90 dark:bg-[#0c0c10]/90 border-b border-zinc-200 dark:border-white/10 shadow-sm backdrop-blur-xl"
            : "bg-white/80 dark:bg-[#0c0c10]/80 border-b border-zinc-200/80 dark:border-white/10 backdrop-blur-xl"
        }`}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
        }`}>
          {/* Brand Mark (Left Aligned with Content Grid) */}
          <Link
            href="/"
            aria-label="tripleS COSMOS - Return to home"
            className={`flex items-center gap-2.5 sm:gap-3 transition-colors group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-[#D4FF00] ${
              isAtHero ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" : "text-zinc-900 dark:text-white"
            }`}
          >
            <div className={`transition-all duration-300 group-hover:scale-110 shrink-0 ${
              scrolled ? "w-6 h-6 sm:w-7 sm:h-7" : "w-8 h-8 sm:w-9 sm:h-9"
            }`}>
              <AnimatedLogo
                width="100%"
                height="100%"
                strokeColor="currentColor"
                strokeWidth={180}
                duration={2500}
                loop={false}
              />
            </div>
            <div className="flex items-baseline gap-1.5 transition-all duration-300">
              <span className={`font-extrabold tracking-tight font-pretendard transition-all duration-300 ${
                scrolled ? "text-base sm:text-lg" : "text-lg sm:text-2xl"
              }`}>
                tripleS
              </span>
              <span
                className={`font-mono tracking-widest uppercase transition-all duration-300 ${
                  scrolled ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-xs"
                } ${
                  isAtHero ? "text-zinc-300" : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                COSMOS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Items with WAV Doodle Hover & Active Indicators */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center">
            <ul className="flex items-center gap-6 xl:gap-8" role="list">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))

                const itemStyle = isAtHero
                  ? isActive
                    ? "text-white font-bold drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]"
                    : "text-zinc-200 hover:text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]"
                  : isActive
                  ? "text-zinc-950 dark:text-[#D4FF00] font-bold"
                  : "text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"

                return (
                  <li key={link.name} className="relative">
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`relative inline-flex flex-col items-center tracking-wider uppercase transition-colors duration-200 py-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-[#D4FF00] ${
                        scrolled ? "text-xs" : "text-[13px] font-semibold"
                      } ${itemStyle}`}
                    >
                      <span className="relative z-10">{link.name}</span>

                      {/* ── Active WAV Doodle Indicator (Persistent with smooth layout transition) ── */}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active-wav"
                          className={`absolute -bottom-2 inset-x-[-4px] h-2.5 pointer-events-none ${
                            isAtHero
                              ? "text-[#D4FF00] drop-shadow-[0_0_8px_rgba(212,255,0,0.7)]"
                              : "text-zinc-950 dark:text-[#D4FF00] dark:drop-shadow-[0_0_8px_rgba(212,255,0,0.5)]"
                          }`}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        >
                          <WavDoodle animate={false} strokeWidth={2.2} variant={link.href} />
                        </motion.div>
                      )}

                      {/* ── Hover WAV Doodle (Playful stroke draw-in on hover) ── */}
                      <AnimatePresence>
                        {!isActive && hoveredLink === link.href && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.16 }}
                            className={`absolute -bottom-2 inset-x-[-4px] h-2.5 pointer-events-none ${
                              isAtHero
                                ? "text-white/80 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                                : "text-zinc-500 dark:text-[#D4FF00]/80"
                            }`}
                          >
                            <WavDoodle animate={true} strokeWidth={2.0} variant={link.href} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Right Actions: Appearance Switcher & CTA / Mobile Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Theme Toggle */}
            <div className={isAtHero ? "hidden sm:block" : "block"}>
              <ThemeToggle
                className={
                  isAtHero
                    ? "bg-black/35 border-white/20 text-white hover:bg-black/55 hover:text-white backdrop-blur-md shadow-md"
                    : ""
                }
              />
            </div>

            {/* Desktop Vault CTA Button */}
            <Link
              href="/objekts"
              aria-label="Explore Objekts Vault"
              className={`hidden lg:inline-flex btn-magnetic group items-center gap-1.5 rounded-full font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-[#D4FF00] ${
                scrolled ? "px-4 py-1.5 text-[11px]" : "px-5 py-2 text-xs"
              } ${
                isAtHero
                  ? "bg-white/90 hover:bg-white text-zinc-950 shadow-xl"
                  : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-[#D4FF00] dark:hover:bg-[#E2FF33] dark:text-black dark:shadow-[0_0_20px_rgba(212,255,0,0.25)]"
              }`}
            >
              <span>Vault</span>
              <span className="btn-arrow text-xs font-bold transition-transform" aria-hidden="true">↗</span>
            </Link>

            {/* Mobile / Tablet Menu Trigger (< lg) */}
            <button
              onClick={toggleMenu}
              suppressHydrationWarning
              aria-expanded={isOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              className={`lg:hidden p-2 sm:p-2.5 rounded-full transition-all duration-300 active:scale-95 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-[#D4FF00] ${
                isAtHero
                  ? "bg-black/40 border border-white/20 text-white backdrop-blur-md"
                  : "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white"
              }`}
            >
              {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── 3. Mobile Navigation Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close on tap */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.nav
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 140 }}
              className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-[#07070a]/95 border-l border-zinc-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl lg:hidden"
            >
              <div className="flex flex-col h-full py-8 px-6 justify-between overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between mb-8 pb-5 border-b border-zinc-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="text-zinc-900 dark:text-white">
                        <AnimatedLogo
                          width={34}
                          height={34}
                          strokeColor="currentColor"
                          strokeWidth={180}
                          duration={2500}
                          loop={false}
                        />
                      </div>
                      <div>
                        <p className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white font-pretendard">
                          tripleS
                        </p>
                        <p className="text-[11px] font-mono text-zinc-500">The Idol of All Possibilities</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleMenu}
                      className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                      aria-label="Close navigation menu"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <ul className="space-y-1.5" role="list">
                    <li>
                      <Link
                        href="/"
                        onClick={toggleMenu}
                        aria-current={pathname === "/" ? "page" : undefined}
                        className="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-[#D4FF00]"
                      >
                        <Home className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                        <span>Home</span>
                      </Link>
                    </li>
                    {NAV_LINKS.map((item, index) => {
                      const IconComponent = item.icon
                      const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
                      return (
                        <motion.li
                          key={item.name}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                        >
                          <Link
                            href={item.href}
                            onClick={toggleMenu}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-[#D4FF00] ${
                              isActive
                                ? "bg-zinc-900 text-white dark:bg-white/15 dark:text-white font-semibold"
                                : "text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                            }`}
                          >
                            <IconComponent className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                            <span>{item.name}</span>
                            {isActive && (
                              <div className="ml-auto w-9 h-2.5 text-[#D4FF00] shrink-0">
                                <WavDoodle animate={false} strokeWidth={2.4} variant={item.href} />
                              </div>
                            )}
                          </Link>
                        </motion.li>
                      )
                    })}
                  </ul>
                </div>

                {/* Drawer Footer & Theme Toggle */}
                <div className="pt-6 border-t border-zinc-200 dark:border-white/10 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                      Appearance
                    </span>
                    <ThemePillToggle />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-mono text-zinc-500">
                      &copy; {new Date().getFullYear()} tripleS
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-2 py-0.5 rounded-full">
                      Fan Directory
                    </span>
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}