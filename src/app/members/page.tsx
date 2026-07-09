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
    <div className="bg-black text-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Meet <span className="text-white">tripleS</span> Members
        </h1>

        <p className="text-lg text-gray-300 mb-12 max-w-3xl">
          tripleS brings together a dynamic group of talented girls from Seoul, each contributing their own unique style, skills, and personality to create a collective sound and powerful performances. 
          Click on a member to learn more about their story and artistry.
        </p>

        <MemberGrid />
      </div>
    </div>
  )
}

