"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, Users, Info, Heart, Disc3 } from "lucide-react"
import AnimatedLogo from "./animated-logo"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
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
    { name: "Albums", href: "/albums", icon: <Disc3 className="h-5 w-5" /> },
    { name: "Credits", href: "/credits", icon: <Heart className="h-5 w-5" /> },
  ]

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={toggleMenu}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full ${
          scrolled || isOpen ? "bg-zinc-900/90 border border-zinc-800 backdrop-blur-md text-white" : "bg-black/50 border border-white/10 text-white backdrop-blur-sm"
        } transition-all duration-300 hover:scale-105`}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 22, stiffness: 120 }}
            className="fixed top-0 right-0 z-40 h-full w-72 sm:w-80 bg-zinc-950/98 backdrop-blur-xl border-l border-zinc-800/80 shadow-2xl"
          >
            <div className="flex flex-col h-full py-20 px-8">
              <div className="mb-10">
                <div className="flex flex-row justify-start items-center gap-3">
                  <AnimatedLogo
                    width={48}
                    height={48}
                    strokeColor="#ffffff"
                    strokeWidth={180}
                    duration={2500}
                    loop={false}
                  />
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-white font-pretendard">
                      tripleS
                    </h2>
                    <p className="text-xs font-mono text-zinc-400">the idol of all possibilities</p>
                  </div>
                </div>
              </div>

              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: menuItems.indexOf(item) * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      onClick={toggleMenu}
                      className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900/80 transition-all"
                    >
                      <span className="text-zinc-400 group-hover:text-white">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="border-t border-zinc-800/80 pt-6">
                  <p className="text-zinc-500 text-xs font-mono">&copy; {new Date().getFullYear()} tripleS fan archive</p>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}