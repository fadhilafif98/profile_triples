import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import SpotifyEmbed from "@/components/spotify-embed"
import BirthdayCountdown from "@/components/birthday-countdown"
import { members } from "@/utils/members"

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
  return (
    <div className="relative bg-[#050505] text-white selection:bg-white selection:text-black">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center border-b border-zinc-800/80">
        <div className="absolute inset-0 z-0">
          <Image
            src="/home/triples_home_2.jpg"
            alt="tripleS Group"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 backdrop-blur-md mb-6 text-xs uppercase tracking-widest text-zinc-300">
            <span>MODHAUS</span>
            <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
            <span>24 Members</span>
            <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
            <span>Decentralized Idol</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-4 font-pretendard">
            tripleS
          </h1>
          <p className="text-lg md:text-2xl text-zinc-300 tracking-wide font-light max-w-2xl mx-auto mb-10">
            The Idol of All Possibilities
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/members"
              className="inline-flex items-center gap-2 bg-white text-black px-7 py-3.5 rounded-full font-semibold hover:bg-zinc-200 transition-all text-sm tracking-wide"
            >
              Explore Members (S1–S24) <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sub-units"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 px-7 py-3.5 rounded-full text-white font-medium transition-all text-sm tracking-wide backdrop-blur-sm"
            >
              Dimensions
            </Link>
          </div>
        </div>
      </section>

      {/* Concept Architecture / Highlights */}
      <section className="py-24 px-4 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2 font-mono">[ SYSTEM & CONCEPT ]</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                How tripleS Operates
              </h2>
            </div>
            <p className="text-zinc-400 text-sm max-w-md">
              A dynamic idol structure powered by fan governance, continuous unit creation, and digital collectibles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800 text-zinc-300">01 / SYSTEM</span>
                <h3 className="text-xl font-bold mt-4 mb-2 text-white">Gravity & Voting</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Fans participate in decision-making through Gravity events on the Cosmo app, voting for title tracks and member unit rosters.
                </p>
              </div>
              <Link href="/about" className="text-xs uppercase tracking-wider font-semibold text-white inline-flex items-center gap-1 hover:text-zinc-300">
                Learn concept <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800 text-zinc-300">02 / COLLECTIBLES</span>
                <h3 className="text-xl font-bold mt-4 mb-2 text-white">Digital Objekts</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Exclusive photocards minted digitally and physically, granting COMO utility tokens used in official Gravity governance.
                </p>
              </div>
              <Link href="/about" className="text-xs uppercase tracking-wider font-semibold text-white inline-flex items-center gap-1 hover:text-zinc-300">
                Objekt details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800 text-zinc-300">03 / DIMENSIONS</span>
                <h3 className="text-xl font-bold mt-4 mb-2 text-white">Recreated Units</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  From Acid Angel from Asia and EVOLution to Vision@ry Vision and ∞! (Hatch!), units evolve with unique concepts each season.
                </p>
              </div>
              <Link href="/sub-units" className="text-xs uppercase tracking-wider font-semibold text-white inline-flex items-center gap-1 hover:text-zinc-300">
                View all units <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Album / Discography Section */}
      <section className="py-24 px-4 border-b border-zinc-800/80 relative overflow-hidden bg-zinc-950/60">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2 font-mono">[ DISCOGRAPHY ]</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">Music Archive</h2>
            </div>
            <Link
              href="/albums"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
            >
              All Releases <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Featured Release</span>
                <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-3 text-white">ASSEMBLE24</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  The historic first full-length album featuring all 24 members together, led by the title track &quot;Girls Never Die&quot;.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/albums"
                    className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-all"
                  >
                    View Tracklist
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <SpotifyEmbed />
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Units Preview Section */}
      <section className="py-24 px-4 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2 font-mono">[ ACTIVE UNITS ]</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                Featured Dimensions
              </h2>
            </div>
            <Link
              href="/sub-units"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
            >
              Browse All Dimensions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative group h-80 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <Image
                src="/sub-units/sub_unit_hatchi.jpg"
                alt="tripleS ∞! (Hatch!)"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Japan Dimension</span>
                <h3 className="text-2xl font-bold text-white mt-1">∞! (Hatch!)</h3>
                <p className="text-zinc-300 text-xs mt-1">First Japanese debut unit</p>
              </div>
            </div>

            <div className="relative group h-80 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <Image
                src="/sub-units/sub_unit_Visionary_Vision.jpg"
                alt="tripleS Vision@ry Vision"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Dance Dimension</span>
                <h3 className="text-2xl font-bold text-white mt-1">Vision@ry Vision</h3>
                <p className="text-zinc-300 text-xs mt-1">High-performance 12-member unit</p>
              </div>
            </div>

            <div className="relative group h-80 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <Image
                src="/sub-units/sub_unit_Glow.jpg"
                alt="tripleS Glow"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">S21–S24 Dimension</span>
                <h3 className="text-2xl font-bold text-white mt-1">Glow</h3>
                <p className="text-zinc-300 text-xs mt-1">Debut unit of the final 4 members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Birthday Countdown Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2 font-mono">[ CALENDAR ]</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Upcoming Member Birthdays
            </h2>
          </div>
          <BirthdayCountdown members={Object.values(members)} />
        </div>
      </section>
    </div>
  )
}