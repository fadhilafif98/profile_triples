import React from "react"

const TICKER_ITEMS = [
  { text: "OT24 ASSEMBLE", highlight: true },
  { text: "S1 SEOYEON", highlight: false },
  { text: "S2 HYERIN", highlight: false },
  { text: "S3 JIWOO", highlight: false },
  { text: "S4 CHAEYEON", highlight: false },
  { text: "S5 YOOYEON", highlight: false },
  { text: "S6 SOOHYUN", highlight: false },
  { text: "S7 NAKYOUNG", highlight: false },
  { text: "S8 YUHYEON", highlight: false },
  { text: "S9 KAEDE", highlight: false },
  { text: "S10 DAHYUN", highlight: false },
  { text: "S11 KOTONE", highlight: false },
  { text: "S12 YEONJI", highlight: false },
  { text: "S13 NIENTIE", highlight: false },
  { text: "S14 SOHYUN", highlight: false },
  { text: "S15 XINYU", highlight: false },
  { text: "S16 MAYU", highlight: false },
  { text: "S17 LINN", highlight: false },
  { text: "S18 JOOBIN", highlight: false },
  { text: "S19 HAYEON", highlight: false },
  { text: "S20 SHION", highlight: false },
  { text: "S21 CHAEWON", highlight: false },
  { text: "S22 SULLI", highlight: false },
  { text: "S23 SEOAH", highlight: false },
  { text: "S24 JIYEON", highlight: false },
  { text: "15 DIMENSIONS", highlight: true },
  { text: "COSMO GOVERNANCE", highlight: true },
]

export default function EditorialTicker() {
  return (
    <div className="relative w-full overflow-hidden border-y border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#08080A] py-3.5 select-none">
      {/* Subtle edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-zinc-100 dark:from-[#08080A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-zinc-100 dark:from-[#08080A] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee items-center gap-8">
        {/* Double the array for seamless infinite looping */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 shrink-0">
            <span
              className={`text-xs sm:text-sm font-mono tracking-widest uppercase transition-colors ${
                item.highlight
                  ? "text-violet-600 dark:text-[#D4FF00] font-bold"
                  : "text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {item.text}
            </span>
            <span className="text-violet-600 dark:text-[#D4FF00] text-xs">✦</span>
          </div>
        ))}
      </div>
    </div>
  )
}
