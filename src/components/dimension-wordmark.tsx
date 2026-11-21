interface DimensionLogoConfig {
  src: string
  aspectRatio: number
  tier: "ultra-wide" | "wide-serif" | "wide" | "standard" | "emblem" | "script-stacked"
}

export type DimensionWordmarkSize = "mini" | "card" | "list" | "hero"

const DIMENSION_LOGOS: Record<string, DimensionLogoConfig> = {
  "acid-angel-from-asia": {
    src: "/sub-units/logos/acid-angel-from-asia.svg",
    aspectRatio: 600.14 / 502.57,
    tier: "script-stacked",
  },
  "krystal-eyes": {
    src: "/sub-units/logos/krystal-eyes.svg",
    aspectRatio: 2511.86 / 429.45,
    tier: "wide-serif",
  },
  "acid-eyes": {
    src: "/sub-units/logos/acid-eyes.svg",
    aspectRatio: 1566 / 140,
    tier: "ultra-wide",
  },
  lovelution: {
    src: "/sub-units/logos/lovelution.svg",
    aspectRatio: 1665 / 380,
    tier: "wide",
  },
  evolution: {
    src: "/sub-units/logos/evolution.svg",
    aspectRatio: 2103 / 386,
    tier: "wide",
  },
  nxt: {
    src: "/sub-units/logos/nxt.svg",
    aspectRatio: 967.95 / 327.95,
    tier: "standard",
  },
  aria: {
    src: "/sub-units/logos/aria.svg",
    aspectRatio: 701.52 / 233,
    tier: "standard",
  },
  glow: {
    src: "/sub-units/logos/glow.svg",
    aspectRatio: 978.27 / 387.31,
    tier: "standard",
  },
  "visionary-vision": {
    src: "/sub-units/logos/visionary-vision.svg",
    aspectRatio: 2666.94 / 247.03,
    tier: "ultra-wide",
  },
  hatchi: {
    src: "/sub-units/logos/hatchi.svg",
    aspectRatio: 840.97 / 177.76,
    tier: "wide",
  },
  alphie: {
    src: "/sub-units/logos/alphie.svg",
    aspectRatio: 585.68 / 155.46,
    tier: "standard",
  },
  moon: {
    src: "/sub-units/logos/moon.svg",
    aspectRatio: 1999.99 / 583.7,
    tier: "standard",
  },
  sun: {
    src: "/sub-units/logos/sun.svg",
    aspectRatio: 330.68 / 160.85,
    tier: "emblem",
  },
  neptune: {
    src: "/sub-units/logos/neptune.svg",
    aspectRatio: 3786.23 / 2595.36,
    tier: "emblem",
  },
  zenith: {
    src: "/sub-units/logos/zenith.svg",
    aspectRatio: 1012 / 532,
    tier: "emblem",
  },
}

// Optically area-normalized heights so ultra-wide, wide, standard, and stacked
// logos carry balanced visual mass side-by-side without overflowing mobile widths.
const SIZE_CLASSES: Record<
  DimensionWordmarkSize,
  Record<DimensionLogoConfig["tier"], string>
> = {
  mini: {
    "ultra-wide": "h-3.5 sm:h-4 max-w-full",
    "wide-serif": "h-5 sm:h-5.5 max-w-full",
    wide: "h-5 sm:h-5.5 max-w-full",
    standard: "h-6 sm:h-6.5 max-w-full",
    emblem: "h-7 sm:h-8 max-w-full",
    "script-stacked": "h-9 sm:h-10 max-w-full",
  },
  card: {
    "ultra-wide": "h-5 sm:h-6 max-w-full",
    "wide-serif": "h-7 sm:h-8.5 max-w-full",
    wide: "h-7 sm:h-8.5 max-w-full",
    standard: "h-8 sm:h-9.5 max-w-full",
    emblem: "h-10 sm:h-11 max-w-full",
    "script-stacked": "h-12 sm:h-14 max-w-full",
  },
  list: {
    "ultra-wide": "h-6 sm:h-7 md:h-8 max-w-full",
    "wide-serif": "h-9 sm:h-11 md:h-12 max-w-full",
    wide: "h-9 sm:h-11 md:h-12 max-w-full",
    standard: "h-10 sm:h-12 md:h-14 max-w-full",
    emblem: "h-13 sm:h-15 md:h-17 max-w-full",
    "script-stacked": "h-18 sm:h-21 md:h-24 max-w-full",
  },
  hero: {
    "ultra-wide": "h-7 sm:h-8 md:h-9 max-w-full",
    "wide-serif": "h-10 sm:h-12 md:h-14 max-w-full",
    wide: "h-10 sm:h-12 md:h-14 max-w-full",
    standard: "h-12 sm:h-14 md:h-16 max-w-full",
    emblem: "h-15 sm:h-18 md:h-20 max-w-full",
    "script-stacked": "h-20 sm:h-24 md:h-28 max-w-full",
  },
}

const FALLBACK_TEXT_CLASSES: Record<DimensionWordmarkSize, string> = {
  mini: "text-sm font-display font-black tracking-tight leading-tight",
  card: "text-lg sm:text-xl font-display font-black tracking-tight leading-snug",
  list: "text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight leading-[1.05]",
  hero: "text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-[1.05]",
}

interface DimensionWordmarkProps {
  slug: string
  name: string
  size?: DimensionWordmarkSize
  className?: string
}

/**
 * Official tripleS Dimension logo rendered via CSS alpha mask (`bg-current`),
 * adapting automatically to Light Mode Carbon Ink, Dark Mode White, and hover Accent.
 */
export default function DimensionWordmark({
  slug,
  name,
  size = "card",
  className = "",
}: DimensionWordmarkProps) {
  const logo = DIMENSION_LOGOS[slug]

  if (!logo) {
    return (
      <span className={`${FALLBACK_TEXT_CLASSES[size]} ${className}`}>
        {name}
      </span>
    )
  }

  const maskUrl = `url(${logo.src})`

  return (
    <span className={`block max-w-full ${className}`}>
      <span className="sr-only">{name}</span>
      <span
        aria-hidden="true"
        className={`block bg-current select-none transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${SIZE_CLASSES[size][logo.tier]}`}
        style={{
          aspectRatio: `${logo.aspectRatio}`,
          maskImage: maskUrl,
          WebkitMaskImage: maskUrl,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "left center",
          WebkitMaskPosition: "left center",
        }}
      />
    </span>
  )
}
