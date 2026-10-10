import type { Metadata } from "next"
import MemberGrid from "@/components/member-grid"
import Breadcrumb from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "tripleS Members Profile | The Idol of All Possibilities",
  description: "Browse the profile database for all 24 members of tripleS (트리플에스). Get details on birthdays, zodiac signs, MBTI, nationalities, and roles.",
  openGraph: {
    title: "tripleS Members Profile | The Idol of All Possibilities",
    description: "Browse the profile database for all 24 members of tripleS (트리플에스). Get details on birthdays, zodiac signs, MBTI, nationalities, and roles.",
    url: "https://profile-triples.vercel.app/members",
    siteName: "tripleS Profile DB",
    images: [
      {
        url: "https://i.imgur.com/vHqYhWc.jpeg",
        width: 1200,
        height: 630,
        alt: "tripleS Group Photo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "tripleS Members Profile | The Idol of All Possibilities",
    description: "Browse the profile database for all 24 members of tripleS (트리플에스).",
    images: ["https://i.imgur.com/vHqYhWc.jpeg"],
  },
}

export default function MembersPage() {
  return (
    <div className="bg-[#fafafa] dark:bg-[#08080A] text-zinc-900 dark:text-white pt-20 sm:pt-24 lg:pt-28 pb-24 sm:pb-28 selection:bg-[#D4FF00] selection:text-black transition-colors min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Members" }]} />

        <div className="mb-10 sm:mb-12 pb-6 border-b border-zinc-200 dark:border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] sm:whitespace-nowrap">
              Twenty-four,{" "}
              <span className="font-accent text-4xl xs:text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                in order
              </span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl leading-relaxed pt-1">
              Revealed in sequence through SIGNAL since 2022. Tap any card for quick facts.
            </p>
          </div>

          <div className="hidden md:flex flex-col items-end shrink-0 pb-1">
            <span className="text-3xl lg:text-4xl font-display font-black tracking-tight text-zinc-950 dark:text-white">
              24
            </span>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              members &bull; S1 to S24
            </span>
          </div>
        </div>

        <MemberGrid />
      </div>
    </div>
  )
}

