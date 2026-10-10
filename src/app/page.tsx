import type { Metadata } from "next"
import BirthdayCountdown from "@/components/birthday-countdown"
import HeroSection from "@/components/home/hero-section"
import VideoShowreelSection from "@/components/home/video-showreel-section"
import DimensionsCardStack from "@/components/home/dimensions-card-stack"
import HowItWorksSection from "@/components/home/how-it-works-section"
import MusicArchiveSection from "@/components/home/music-archive-section"
import { getAllMembers } from "@/lib/members"
import { getAllAlbums } from "@/lib/albums"
import { getAllSubUnits } from "@/lib/sub-units"

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
      {/* ── 1. Hero Section (Awwwards GSAP Parallax & Kinetic Editorial) ── */}
      <HeroSection />

      {/* ── 2. Cinematic Video Showreel Section (LxL Creative Section 2 - Girls Never Die MV) ── */}
      <VideoShowreelSection />

      {/* ── 3. How tripleS Works (The Loop: Collect, Vote, Watch) ── */}
      <HowItWorksSection members={membersList} />

      {/* ── 4. Music Archive (Now Playing + Record Crate) ── */}
      <MusicArchiveSection albums={allAlbums} />

      {/* ── 5. Featured Dimensions (LxL Creative Section 3 - 3D Perspective Card Stack) ── */}
      <DimensionsCardStack subUnits={allSubUnits} />

      {/* ── 6. Birthday Countdown ── */}
      <section aria-labelledby="birthday-heading" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <h2
              id="birthday-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-[-0.04em] text-zinc-950 dark:text-white leading-[1.05]"
            >
              Upcoming{" "}
              <span className="font-accent font-normal tracking-normal text-[1.25em] leading-none text-zinc-950 dark:text-[#D4FF00]">
                Birthdays
              </span>
            </h2>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[46ch] mx-auto">
              Count down to the next member birthday and send your wishes.
            </p>
          </div>
          <BirthdayCountdown members={membersList} />
        </div>
      </section>
    </div>
  )
}