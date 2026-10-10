"use client"

import { motion } from "framer-motion"

export type WavDoodleVariant =
  | "members"
  | "dimensions"
  | "objekts"
  | "albums"
  | "about"
  | "credits"
  | string

interface WavDoodleProps {
  className?: string
  strokeWidth?: number
  animate?: boolean
  variant?: WavDoodleVariant
}

/**
 * 6 Bespoke Organic Calligraphic Underline Doodles Inspired by the tripleS WAV Fandom Universe
 * Each navbar menu item possesses its own distinct personality, micro-rhythm, and flourish:
 * 1. Members (/members): Iconic WAV wave with signature cursive loop on the left
 * 2. Dimensions (/sub-units): Dimensional dual-crest wave representing sub-unit modularity
 * 3. Objekts (/objekts): Vault ribbon wave with center-right loop knot
 * 4. Albums (/albums): Vinyl groove waveform with centered calligraphic loop
 * 5. About (/about): Compact, energetic manifesto scribble
 * 6. Credits (/credits): Sweeping heartfelt flourish hugging the text
 */
const DOODLE_PATHS: Record<string, string> = {
  // 1. Members: Iconic WAV Wave with signature cursive loop flourish
  members:
    "M 3 8.5 C 16 12.5, 28 13, 38 8.5 C 43 5.5, 47 1, 42.5 0.8 C 38.5 0.6, 36.5 5, 40 8.5 C 46 14, 68 14.5, 82 9.5 C 90 7, 95 6, 98 4.5",
  "/members":
    "M 3 8.5 C 16 12.5, 28 13, 38 8.5 C 43 5.5, 47 1, 42.5 0.8 C 38.5 0.6, 36.5 5, 40 8.5 C 46 14, 68 14.5, 82 9.5 C 90 7, 95 6, 98 4.5",

  // 2. Dimensions: Dimensional Dual-Crest Flow
  dimensions:
    "M 2 7.5 C 14 12.5, 25 13.5, 36 9 C 45 4.5, 52 4.5, 59 9 C 67 14, 78 14.5, 88 9 C 93 6.5, 96 5.5, 98 4",
  "/sub-units":
    "M 2 7.5 C 14 12.5, 25 13.5, 36 9 C 45 4.5, 52 4.5, 59 9 C 67 14, 78 14.5, 88 9 C 93 6.5, 96 5.5, 98 4",

  // 3. Objekts: Vault Ribbon with center-right loop knot
  objekts:
    "M 3 6.5 C 18 10.5, 38 12.5, 54 10.5 C 60 9.5, 63 5.5, 59 2.5 C 55 0, 52 4.5, 55 9 C 61 14.5, 78 14.5, 88 10 C 93 7.5, 96 5.5, 98 4",
  "/objekts":
    "M 3 6.5 C 18 10.5, 38 12.5, 54 10.5 C 60 9.5, 63 5.5, 59 2.5 C 55 0, 52 4.5, 55 9 C 61 14.5, 78 14.5, 88 10 C 93 7.5, 96 5.5, 98 4",

  // 4. Albums: Vinyl Groove Wave with centered calligraphic loop
  albums:
    "M 3 7 C 15 12, 26 13, 36 9 C 45 5, 51 2, 47.5 1.2 C 44 0.5, 42 4.5, 46 8.5 C 52 14, 68 14, 80 9.5 C 89 6, 94 6.5, 98 4.5",
  "/albums":
    "M 3 7 C 15 12, 26 13, 36 9 C 45 5, 51 2, 47.5 1.2 C 44 0.5, 42 4.5, 46 8.5 C 52 14, 68 14, 80 9.5 C 89 6, 94 6.5, 98 4.5",

  // 5. About: Compact, Energetic Manifesto Scribble
  about:
    "M 4 8 C 15 12.5, 26 13, 36 8.5 C 41 5.5, 45 1.5, 41 0.8 C 37 0.2, 35 4, 38 7.8 C 45 13.5, 66 14, 80 9.5 C 89 6.8, 95 5.5, 98 4",
  "/about":
    "M 4 8 C 15 12.5, 26 13, 36 8.5 C 41 5.5, 45 1.5, 41 0.8 C 37 0.2, 35 4, 38 7.8 C 45 13.5, 66 14, 80 9.5 C 89 6.8, 95 5.5, 98 4",

  // 6. Credits: Sweeping Heartfelt Flourish
  credits:
    "M 3 6 C 16 11, 28 13.5, 40 10.5 C 50 7, 56 3, 52 1 C 48 -0.5, 44 3.5, 48 8 C 54 13.5, 70 14, 84 9 C 91 6.5, 95 6, 98 4",
  "/credits":
    "M 3 6 C 16 11, 28 13.5, 40 10.5 C 50 7, 56 3, 52 1 C 48 -0.5, 44 3.5, 48 8 C 54 13.5, 70 14, 84 9 C 91 6.5, 95 6, 98 4",
}

export default function WavDoodle({
  className = "",
  strokeWidth = 2.2,
  animate = true,
  variant = "members",
}: WavDoodleProps) {
  const doodlePath = DOODLE_PATHS[variant] || DOODLE_PATHS.members

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 14"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`w-full h-full pointer-events-none select-none ${className}`}
    >
      <motion.path
        d={doodlePath}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={{ pathLength: 1, opacity: 1 }}
        exit={{ pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.16 },
        }}
      />
    </svg>
  )
}
