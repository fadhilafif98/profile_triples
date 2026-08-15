"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900/60 ${className}`} />
    )
  }

  const isDark = resolvedTheme === "dark" || theme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex items-center justify-center p-2 sm:p-2.5 rounded-full transition-all duration-300 
        bg-white/80 dark:bg-zinc-900/80 
        border border-zinc-300/80 dark:border-zinc-800 
        text-zinc-800 dark:text-zinc-200 
        hover:text-black dark:hover:text-white 
        hover:bg-zinc-100 dark:hover:bg-zinc-800 
        hover:scale-105 shadow-md backdrop-blur-md ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 sm:h-[18px] sm:w-[18px] transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 sm:h-[18px] sm:w-[18px] transition-transform duration-300 -rotate-12 hover:rotate-0 text-zinc-700" />
      )}
    </button>
  )
}

export function ThemePillToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`w-full h-11 rounded-full bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 animate-pulse ${className}`} />
    )
  }

  const isDark = resolvedTheme === "dark" || theme === "dark"

  return (
    <div className={`w-full p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/90 flex items-center justify-between shadow-inner ${className}`}>
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-mono transition-all duration-300 ${
          !isDark
            ? "bg-white text-zinc-900 font-bold shadow-md border border-zinc-200/90"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
        }`}
      >
        <Sun className={`h-3.5 w-3.5 ${!isDark ? "text-amber-500" : "text-zinc-400"}`} />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-mono transition-all duration-300 ${
          isDark
            ? "bg-zinc-800 text-white font-bold shadow-md border border-zinc-700"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
        }`}
      >
        <Moon className={`h-3.5 w-3.5 ${isDark ? "text-amber-400" : "text-zinc-400"}`} />
        <span>Dark</span>
      </button>
    </div>
  )
}
