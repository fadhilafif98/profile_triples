import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About tripleS | The Idol of All Possibilities",
  description: "Learn about the concept of tripleS (트리플에스), the world's first decentralized girl group with 24 members. Explore their unique sub-units and milestones.",
  openGraph: {
    title: "About tripleS | The Idol of All Possibilities",
    description: "Learn about the concept of tripleS (트리플에스), the world's first decentralized girl group with 24 members. Explore their unique sub-units and milestones.",
    url: "https://profile-triples.vercel.app/about",
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
    title: "About tripleS | Decentralized K-Pop Idol Group",
    description: "Learn about the concept of tripleS (트리플에스), the world's first decentralized girl group with 24 members.",
    images: ["https://i.imgur.com/vHqYhWc.jpeg"],
  },
}

export default function AboutPage() {
  return (
    <div className="bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-white pt-24 pb-28 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black min-h-screen transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">[ ARCHIVE & DOSSIER ]</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-pretendard">
            About tripleS
          </h1>
        </div>

        {/* Profile Overview (Side-by-Side 2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6 text-zinc-700 dark:text-zinc-300 text-base md:text-lg leading-relaxed">
            <p>
              <strong className="text-zinc-900 dark:text-white">tripleS</strong> (트리플에스 / トリプルS; also known as Social Sonyo Seoul) is a 24-member South Korean girl group founded under MODHAUS.
            </p>
            <p>
              The 24-member roster spans S1 to S24: Yoon SeoYeon, Jeong HyeRin, Lee JiWoo, Kim ChaeYeon, Kim YooYeon, Kim SooMin, Kim NaKyoung, Gong YuBin, Kaede, Seo DaHyun, Kotone, Kwak YeonJi, Nien, Park SoHyun, Xinyu, Mayu, Lynn, JooBin, Jeong HaYeon, Park ShiOn, Kim ChaeWon, Sullin, SeoAh, and JiYeon.
            </p>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 border-l-2 border-zinc-300 dark:border-zinc-700 pl-4 py-1">
              tripleS began member reveals on May 1, 2022. The initial 10-member unit debuted on February 13, 2023 with <em className="text-zinc-800 dark:text-zinc-200">ASSEMBLE</em>, followed by the landmark OT24 full-group assemble on May 8, 2024 with <em className="text-zinc-800 dark:text-zinc-200">ASSEMBLE24</em>.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-black/60 shadow-md dark:shadow-xl">
            <div className="relative w-full aspect-[3/2]">
              <Image
                src="/about/triples_about.jpg"
                alt="tripleS 24 Members Group Photo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-center">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">OT24 ASSEMBLE24 Live Stage</span>
            </div>
          </div>
        </div>

        {/* Concept Architecture */}
        <div className="mb-20">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">[ CORE MECHANICS ]</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white font-pretendard">The Decentralized Model</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">01 / GRAVITY</span>
              <h3 className="text-xl font-bold mt-4 mb-2 text-zinc-900 dark:text-white font-pretendard">Decentralized Voting</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Fans actively determine subunit combinations, title tracks, and main concepts through official Gravity voting rounds hosted on the Cosmo application.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">02 / OBJEKTS</span>
              <h3 className="text-xl font-bold mt-4 mb-2 text-zinc-900 dark:text-white font-pretendard">Digital Collectibles</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Digital & physical photocards (Objekts) grant utility tokens (COMO), which serve as voting power for participants during each Gravity event.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">03 / DIMENSIONS</span>
              <h3 className="text-xl font-bold mt-4 mb-2 text-zinc-900 dark:text-white font-pretendard">Seasonal Dimensions</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Each season, members form new specialized sub-units (Dimensions) to explore diverse musical directions, dance performances, and global releases.
              </p>
            </div>
          </div>
        </div>

        {/* Milestones & Metrics */}
        <div>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-mono">[ METRICS & IMPACT ]</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white font-pretendard">Global Footprint</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Album Sales</span>
              <h3 className="text-3xl md:text-4xl font-extrabold my-2 text-zinc-900 dark:text-white tracking-tight font-pretendard">740K+</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">Albums distributed worldwide</p>
            </div>
            <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Community</span>
              <h3 className="text-3xl md:text-4xl font-extrabold my-2 text-zinc-900 dark:text-white tracking-tight font-pretendard">680K+</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">Instagram followers</p>
            </div>
            <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Video Platform</span>
              <h3 className="text-3xl md:text-4xl font-extrabold my-2 text-zinc-900 dark:text-white tracking-tight font-pretendard">2.78M+</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">YouTube subscribers</p>
            </div>
            <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Recognition</span>
              <h3 className="text-3xl md:text-4xl font-extrabold my-2 text-zinc-900 dark:text-white tracking-tight font-pretendard">9</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">Major music awards won</p>
            </div>
            <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Global Reach</span>
              <h3 className="text-3xl md:text-4xl font-extrabold my-2 text-zinc-900 dark:text-white tracking-tight font-pretendard">20+</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">Countries toured / visited</p>
            </div>
            <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Streaming</span>
              <h3 className="text-3xl md:text-4xl font-extrabold my-2 text-zinc-900 dark:text-white tracking-tight font-pretendard">520M+</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">Total YouTube impressions & views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}