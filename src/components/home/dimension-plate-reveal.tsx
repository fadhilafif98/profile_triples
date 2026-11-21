"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"
import { useSafeReducedMotion } from "@/lib/a11y"

interface DimensionPlateRevealProps {
  children: ReactNode
  index: number
  className?: string
}

/**
 * Isolated client leaf for one-shot scroll reveal on Dimension plates.
 * Uses hardware-accelerated transform string + opacity only, with instant
 * static fallback under prefers-reduced-motion.
 */
export default function DimensionPlateReveal({
  children,
  index,
  className,
}: DimensionPlateRevealProps) {
  const reduceMotion = useSafeReducedMotion()

  if (reduceMotion) {
    return <article className={className}>{children}</article>
  }

  return (
    <motion.article
      className={className}
      initial={{ opacity: 0, transform: "translate3d(0, 18px, 0)" }}
      whileInView={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.article>
  )
}
