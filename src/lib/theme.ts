"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"

const emptySubscribe = () => () => {}

/**
 * Hydration-safe dark mode hook aligned with `ThemeToggle`.
 * Returns false on SSR and initial hydration, then mirrors `next-themes`.
 */
export function useIsDarkMode(): boolean {
  const { theme, resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  return mounted && (resolvedTheme === "dark" || theme === "dark")
}
