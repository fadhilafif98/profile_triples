"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, Users, Info, Mail, Heart } from "lucide-react"
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
    { name: "Credits", href: "/credits", icon: <Heart className="h-5 w-5" /> },
  ]

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={toggleMenu}
        className={`fixed top-6 right-6 z-50 p-2 rounded-full ${
          scrolled || isOpen ? "bg-gray-900/80 backdrop-blur-md" : "bg-transparent"
        } transition-all duration-300`}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
      </button>

      {/* Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed top-0 right-0 z-40 h-full w-64 sm:w-80 bg-gray-900/95 backdrop-blur-md border-l border-purple-500/20"
          >
            <div className="flex flex-col h-full py-20 px-6">
              <div className="mb-10">
                <div className="flex flex-row justify-start items-center">
                  <AnimatedLogo
                    width={60}
                    height={60}
                    strokeColor="white"
                    strokeWidth={15}
                    duration={3000}
                    loop={false}
                  />
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent text-white">
                    tripleS
                  </h2>
                </div>
                <p className="text-gray-400 mt-1">the idol of all possibilities</p>
              </div>

              <ul className="space-y-6">
                {menuItems.map((item) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: menuItems.indexOf(item) * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={toggleMenu}
                      className="flex items-center gap-3 text-lg font-medium text-white hover:text-pink-400 transition-colors"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="border-t border-gray-800 pt-6 pb-4">
                  <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} tripleS</p>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}