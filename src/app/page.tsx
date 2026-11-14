import type { Metadata } from "next"
import dynamic from "next/dynamic"
import HeroSection from "@/components/home/hero-section"
import { getAllMembers } from "@/lib/members"
import { getAllAlbums } from "@/lib/albums"
import { getAllSubUnits } from "@/lib/sub-units"

const VideoShowreelSection = dynamic(() => import("@/components/home/video-showreel-section"), { ssr: true })
const HowItWorksSection = dynamic(() => import("@/components/home/how-it-works-section"), { ssr: true })
const MusicArchiveSection = dynamic(() => import("@/components/home/music-archive-section"), { ssr: true })
const DimensionsCardStack = dynamic(() => import("@/components/home/dimensions-card-stack"), { ssr: true })
const BirthdayCountdown = dynamic(() => import("@/components/birthday-countdown"), { ssr: true })

export const metadata: Metadata = {
  title: "tripleS | Fanmade Website",
  description: "Explore tripleS (트리플에스), the 24-member decentralized K-pop girl group. View member profiles, sub-units, discography, and upcoming events.",
  openGraph: {
    title: "tripleS | Fanmade Website",
    description: "Explore tripleS (트리플에스), the 24-member decentralized K-pop girl group. View member profiles, sub-units, discography, and upcoming events.",
    url: "https://profile-triples.vercel.app",
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
    title: "tripleS | Official Fan Directory & Profile Database",
    description: "Explore tripleS (트리플에스), the 24-member decentralized K-pop girl group.",
    images: ["https://i.imgur.com/vHqYhWc.jpeg"],
  },
}

export default function Home() {
  const membersList = getAllMembers()
  const allAlbums = getAllAlbums()
  const allSubUnits = getAllSubUnits()

  return (
    <div className="relative bg-[#fafafa] dark:bg-[#08080A] text-zinc-900 dark:text-white selection:bg-[#D4FF00] selection:text-black transition-colors">
      {/* 1. Full-Viewport K-Pop Editorial Hero */}
      <HeroSection />

      {/* 2. Pinned MV Showreel & Editorial Statement */}
      <VideoShowreelSection />

      {/* 3. How tripleS Works (Unboxed Objekt Fan + 3-Step Flow) */}
      <HowItWorksSection members={membersList} />

      {/* 4. Music Archive (Unboxed Vinyl Sleeve + Spotify + Record Crate) */}
      <MusicArchiveSection albums={allAlbums} />

      {/* 5. Featured Dimensions (Interactive 3D Perspective Card Stack) */}
      <DimensionsCardStack subUnits={allSubUnits} />

      {/* 6. Upcoming Birthdays */}
      <BirthdayCountdown members={membersList} />
    </div>
  )
}
