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

        <div className="mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/5 border border-zinc-900/10 text-zinc-900 dark:bg-[#D4FF00]/10 dark:border-[#D4FF00]/25 dark:text-[#D4FF00] text-xs font-mono font-semibold mb-3">
            OT24 Official Roster
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-zinc-900 dark:text-white">
            Member <span className="font-accent text-5xl md:text-7xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">Profiles</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-3 max-w-3xl leading-relaxed">
            The complete 24-member roster of tripleS. Filter by S-number, nationality, sub-unit history, and MBTI types.
          </p>
        </div>

        <MemberGrid />
      </div>
    </div>
  )
}

