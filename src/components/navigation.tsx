"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, Users, Info, Heart, Disc3, Sparkles } from "lucide-react"
import AnimatedLogo from "./animated-logo"
import { ThemePillToggle } from "./theme-toggle"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "About", href: "/about", icon: <Info className="h-5 w-5" /> },
    { name: "Members", href: "/members", icon: <Users className="h-5 w-5" /> },
    { name: "Sub-Units", href: "/sub-units", icon: <Users className="h-5 w-5 opacity-70" /> },
    { name: "Objekts", href: "/objekts", icon: <Sparkles className="h-5 w-5" /> },
    { name: "Albums", href: "/albums", icon: <Disc3 className="h-5 w-5" /> },
    { name: "Credits", href: "/credits", icon: <Heart className="h-5 w-5" /> },
  ]

  return (
    <>
      {/* Top Floating Menu Toggle */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
        <button
          onClick={toggleMenu}
          suppressHydrationWarning
          className={`p-2.5 sm:p-3 rounded-full ${
            (mounted && scrolled) || isOpen
              ? "bg-white/80 dark:bg-zinc-900/90 border border-zinc-300/80 dark:border-zinc-800 text-zinc-900 dark:text-white backdrop-blur-md shadow-md"
              : "bg-white/70 dark:bg-black/50 border border-zinc-200/60 dark:border-white/10 text-zinc-900 dark:text-white backdrop-blur-md shadow-md"
          } transition-all duration-300 hover:scale-105`}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 22, stiffness: 120 }}
            className="fixed top-0 right-0 z-40 h-full w-80 sm:w-88 max-w-[85vw] bg-white/95 dark:bg-[#070707] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex flex-col h-full py-12 px-6 sm:px-8 justify-between overflow-y-auto">
              <div>
                <div className="mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800/80">
                  <div className="flex flex-row justify-start items-center gap-3">
                    <div className="text-zinc-900 dark:text-white">
                      <AnimatedLogo
                        width={42}
                        height={42}
                        strokeColor="currentColor"
                        strokeWidth={180}
                        duration={2500}
                        loop={false}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-pretendard">
                        tripleS
                      </h2>
                      <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">the idol of all possibilities</p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: menuItems.indexOf(item) * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={toggleMenu}
                        className="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all"
                      >
                        <span className="text-zinc-400 dark:text-zinc-500">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Bottom Section: Theme Pill Selector + Footer */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/90 mt-8 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                    Theme / Appearance
                  </span>
                  <ThemePillToggle />
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 font-medium">
                    &copy; {new Date().getFullYear()} tripleS
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded">
                    FAN ARCHIVE
                  </span>
                </div>
                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                  All media assets &copy; MODHAUS
                </p>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}