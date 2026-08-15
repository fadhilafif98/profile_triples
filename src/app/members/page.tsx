import type { Metadata } from "next"
import MemberGrid from "@/components/member-grid"

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
    <div className="bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-white pt-24 pb-28 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-14">
          <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">[ DIRECTORY S1–S24 ]</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-pretendard">
            Member Profiles
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-4 max-w-3xl leading-relaxed">
            The complete 24-member roster of tripleS. Filter by S-number, nationality, sub-unit history, and MBTI types.
          </p>
        </div>

        <MemberGrid />
      </div>
    </div>
  )
}

