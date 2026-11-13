"use client"

import React from "react"

interface WavWordmarkProps {
  className?: string
  style?: React.CSSProperties
  alt?: string
}

/**
 * Official tripleS WAV (웨이브) Fandom Logo Wordmark
 * Rendered using mask-image so it automatically inherits currentColor
 * (Monochromatic Carbon Ink in Light Mode, Acid Voltage in Dark Mode)
 */
export default function WavWordmark({
  className = "h-[0.9em] text-current",
  style,
  alt = "WAV",
}: WavWordmarkProps) {
  return (
    <span
      role="img"
      aria-label={alt}
      title={alt}
      className={`inline-block aspect-[705/177] bg-current align-baseline select-none transition-colors ${className}`}
      style={{
        maskImage: "url(/icons/wav-logo-transparent.png)",
        WebkitMaskImage: "url(/icons/wav-logo-transparent.png)",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        ...style,
      }}
    />
  )
}
