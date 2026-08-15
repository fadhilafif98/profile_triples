import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Disc3 } from "lucide-react"
import Image from "next/image"
import SpotifyEmbed from "@/components/spotify-embed"
import BirthdayCountdown from "@/components/birthday-countdown"
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

  // Latest featured album (newest release at the top of discography)
  const featuredAlbum = allAlbums[0]
  // Next recent releases
  const recentReleases = allAlbums.slice(1, 5)
  // Featured 3 newest sub-units (reversed chronological)
  const featuredUnits = [...allSubUnits].reverse().slice(0, 3)

  return (
    <div className="relative bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-white selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors">
      {/* Hero Section (Centered Transparent Typography) */}
      <section className="relative min-h-[90vh] sm:min-h-[95vh] flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800/80 overflow-hidden">
        {/* Crisp High-Visibility Photo Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/home/triples_group_3000.jpg"
            alt="tripleS 24 Members Group"
            fill
            priority
            className="object-cover object-center brightness-105 contrast-105"
          />
          {/* Subtle gradient edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] dark:from-[#050505] via-transparent to-black/40 pointer-events-none" />
        </div>

        {/* Centered Transparent Glass Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-20">
          {/* Hollow Transparent Stroke Headline (Shows member faces through text) */}
          <h1
            className="text-7xl sm:text-9xl md:text-[11rem] font-black tracking-tighter mb-2 font-pretendard select-none text-transparent transition-all duration-700 hover:text-white/10"
            style={{
              WebkitTextStroke: "2.5px rgba(255, 255, 255, 0.95)",
              filter: "drop-shadow(0 4px 20px rgba(0, 0, 0, 0.85))",
            }}
          >
            tripleS
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-white tracking-wide font-medium max-w-2xl mx-auto mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            The Idol of All Possibilities
          </p>

          {/* Transparent Outline Ghost Buttons (Zero opacity background, 100% see-through) */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/members"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/20 border border-white/90 text-white px-7 py-3.5 rounded-full font-bold transition-all text-sm tracking-wide shadow-lg hover:border-white hover:scale-105 active:scale-95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
            >
              Explore Members (S1–S24) <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sub-units"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/20 border border-white/70 text-white px-7 py-3.5 rounded-full font-semibold transition-all text-sm tracking-wide shadow-lg hover:border-white hover:scale-105 active:scale-95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
            >
              Dimensions
            </Link>
          </div>
        </div>
      </section>

      {/* Concept Architecture / Highlights */}
      <section className="py-24 px-4 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">[ SYSTEM & CONCEPT ]</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white font-pretendard">
                How tripleS Operates
              </h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-md">
              A dynamic idol structure powered by fan governance, continuous unit creation, and digital collectibles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm dark:shadow-none transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">01 / SYSTEM</span>
                <h3 className="text-xl font-bold mt-4 mb-2 text-zinc-900 dark:text-white font-pretendard">Gravity & Voting</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  Fans participate in decision-making through Gravity events on the Cosmo app, voting for title tracks and member unit rosters.
                </p>
              </div>
              <Link href="/about" className="text-xs uppercase tracking-wider font-semibold text-zinc-900 dark:text-white inline-flex items-center gap-1 hover:text-zinc-600 dark:hover:text-zinc-300">
                Learn concept <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm dark:shadow-none transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">02 / COLLECTIBLES</span>
                <h3 className="text-xl font-bold mt-4 mb-2 text-zinc-900 dark:text-white font-pretendard">Digital Objekts</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  Exclusive photocards minted digitally and physically, granting COMO utility tokens used in official Gravity governance.
                </p>
              </div>
              <Link href="/objekts" className="text-xs uppercase tracking-wider font-semibold text-zinc-900 dark:text-white inline-flex items-center gap-1 hover:text-zinc-600 dark:hover:text-zinc-300">
                Explore Objekts Vault <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm dark:shadow-none transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">03 / DIMENSIONS</span>
                <h3 className="text-xl font-bold mt-4 mb-2 text-zinc-900 dark:text-white font-pretendard">Recreated Units</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  From Acid Angel from Asia and EVOLution to Vision@ry Vision and ∞! (Hatch!), units evolve with unique concepts each season.
                </p>
              </div>
              <Link href="/sub-units" className="text-xs uppercase tracking-wider font-semibold text-zinc-900 dark:text-white inline-flex items-center gap-1 hover:text-zinc-600 dark:hover:text-zinc-300">
                View all units <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Discography Section */}
      <section className="py-24 px-4 border-b border-zinc-200 dark:border-zinc-800/80 relative overflow-hidden bg-zinc-100/60 dark:bg-zinc-950/60">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">[ DISCOGRAPHY &bull; {allAlbums.length} RELEASES ]</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-zinc-900 dark:text-white font-pretendard">Music Archive</h2>
            </div>
            <Link
              href="/albums"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
            >
              All {allAlbums.length} Releases <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center mb-12">
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/40 backdrop-blur-md shadow-lg dark:shadow-2xl">
                {/* Header Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">[ FEATURED RELEASE ]</span>
                  <span className="text-xs font-mono px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
                    {featuredAlbum.type}
                  </span>
                </div>

                {/* Album Cover & Title Block */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-5">
                  <div className="relative aspect-square w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700/80 shadow-md bg-zinc-100 dark:bg-zinc-950">
                    <Image
                      src={featuredAlbum.cover}
                      alt={featuredAlbum.title}
                      fill
                      priority
                      sizes="(max-width: 640px) 96px, 112px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-pretendard truncate">
                      {featuredAlbum.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                      {featuredAlbum.releaseDate} &bull; {featuredAlbum.unit || "tripleS (OT24 Full Group)"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {featuredAlbum.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-3.5">
                  <Link
                    href="/albums"
                    className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md active:scale-95 shrink-0"
                  >
                    View Album Details <Disc3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Link>
                  {featuredAlbum.spotifyLink && (
                    <a
                      href={featuredAlbum.spotifyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.353-.672.464-1.025.249-2.809-1.716-6.345-2.105-10.509-1.153-.404.092-.809-.161-.901-.565-.093-.404.161-.809.565-.901 4.542-1.038 8.448-.598 11.621 1.345.353.215.464.672.249 1.025zm1.467-3.262c-.27.44-.847.579-1.287.31-3.216-1.977-8.118-2.548-11.922-1.393-.497.151-1.028-.133-1.179-.63-.151-.497.133-1.028.63-1.179 4.343-1.318 9.754-.683 13.448 1.605.44.27.579.847.31 1.287zm.127-3.398c-3.855-2.289-10.222-2.501-13.889-1.387-.59.18-1.218-.158-1.398-.748-.18-.59.158-1.218.748-1.398 4.218-1.281 11.252-1.031 15.698 1.608.531.315.706 1.002.391 1.533-.315.531-1.002.706-1.55.392z"/>
                      </svg>
                      Stream on Spotify
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <SpotifyEmbed />
            </div>
          </div>

          {/* Recent Album Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentReleases.map((album) => (
              <Link
                key={album.id}
                href="/albums"
                className="group p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm dark:shadow-none transition-all flex flex-col"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-950">
                  <Image
                    src={album.cover}
                    alt={album.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/10">
                      {album.type}
                    </span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-200 font-pretendard">
                  {album.title}
                </h4>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-500 mt-0.5">
                  {album.releaseDate}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Sub-Units Preview Section */}
      <section className="py-24 px-4 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">[ ACTIVE UNITS &bull; {allSubUnits.length} DIMENSIONS ]</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white font-pretendard">
                Featured Dimensions
              </h2>
            </div>
            <Link
              href="/sub-units"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
            >
              Browse All {allSubUnits.length} Dimensions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredUnits.map((unit) => (
              <Link
                key={unit.id}
                href={`/sub-units/${unit.slug}`}
                className="relative group h-80 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-md dark:shadow-xl transition-all block"
              >
                <Image
                  src={unit.image}
                  alt={`tripleS ${unit.name}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/20">
                    {unit.category}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-900/80 text-zinc-300 border border-white/10">
                    {unit.members.length} Members
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-widest block">
                    {unit.era} &bull; {unit.debutRelease}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-amber-400 font-pretendard transition-colors">
                    {unit.name}
                  </h3>
                  <p className="text-zinc-200 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {unit.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Birthday Countdown Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">[ CALENDAR ]</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white font-pretendard">
              Upcoming Member Birthdays
            </h2>
          </div>
          <BirthdayCountdown members={membersList} />
        </div>
      </section>
    </div>
  )
}