import type { Metadata } from "next"
import TriplesLogo from "@/components/triples-logo";
import Breadcrumb from "@/components/breadcrumb";
import { FaApple, FaCode, FaDiscord, FaGithub, FaGooglePlay, FaInstagram, FaLinkedin, FaSpotify, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Credits & Links | tripleS Fan Directory",
  description: "Connect with tripleS (트리플에스) on social media, streaming platforms, and app stores. View credits for this fan-made website project.",
  openGraph: {
    title: "Credits & Links | tripleS Fan Directory",
    description: "Connect with tripleS (트리플에스) on social media, streaming platforms, and app stores. View credits for this fan-made website project.",
    url: "https://profile-triples.vercel.app/credits",
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
    title: "Credits & Links | tripleS Fan Directory",
    description: "Connect with tripleS (트리플에스) on social media, streaming platforms, and app stores.",
    images: ["https://i.imgur.com/vHqYhWc.jpeg"],
  },
}

export default function ThankYouPage() {
  return (
    <div className="bg-[#fafafa] dark:bg-[#08080A] text-zinc-900 dark:text-white pt-20 sm:pt-24 lg:pt-28 pb-24 sm:pb-28 selection:bg-[#D4FF00] selection:text-black min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Credits & Sources" }]} />

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] sm:whitespace-nowrap">
            Official{" "}
            <span className="font-accent text-4xl xs:text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
              Credits
            </span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mt-3 leading-relaxed">
            Direct links to official tripleS channels, COSMO : the Gate, music streaming, and fan project credits.
          </p>
        </div>

        {/* Official Channels Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight">Official tripleS Links</h2>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">MODHAUS OFFICIAL</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              {
                name: "Instagram",
                handle: "@triplescosmos",
                icon: <FaInstagram className="h-5 w-5 text-pink-600 dark:text-pink-400" aria-hidden="true" />,
                url: "https://www.instagram.com/triplescosmos/",
              },
              {
                name: "X / Twitter",
                handle: "@triplescosmos",
                icon: <FaXTwitter className="h-5 w-5 text-zinc-950 dark:text-white" aria-hidden="true" />,
                url: "https://x.com/triplescosmos",
              },
              {
                name: "YouTube",
                handle: "@triplescosmos",
                icon: <FaYoutube className="h-5 w-5 text-red-600 dark:text-red-500" aria-hidden="true" />,
                url: "https://www.youtube.com/@triplescosmos",
              },
              {
                name: "Official Site",
                handle: "triplescosmos.com",
                icon: (
                  <span aria-hidden="true" className="text-zinc-950 dark:text-white">
                    <TriplesLogo
                      width={24}
                      height={24}
                      strokeWidth={180}
                    />
                  </span>
                ),
                url: "https://www.triplescosmos.com/",
              },
              {
                name: "Spotify",
                handle: "tripleS",
                icon: <FaSpotify className="h-5 w-5 text-[#1DB954]" aria-hidden="true" />,
                url: "https://open.spotify.com/artist/5Z71xE9prhpHrqL5thVMyK",
              },
              {
                name: "Discord",
                handle: "tripleS Community",
                icon: <FaDiscord className="h-5 w-5 text-[#5865F2] dark:text-[#7984F5]" aria-hidden="true" />,
                url: "https://discord.gg/triplescosmos",
              },
              {
                name: "TikTok",
                handle: "@triplescosmos",
                icon: <FaTiktok className="h-5 w-5 text-zinc-950 dark:text-white" aria-hidden="true" />,
                url: "https://www.tiktok.com/@triplescosmos",
              },
              {
                name: "COSMO App",
                handle: "iOS & Android",
                icons: [
                  <FaApple key="apple" className="h-5 w-5 text-zinc-950 dark:text-white" aria-hidden="true" />,
                  <FaGooglePlay key="play" className="h-4 w-4 text-zinc-700 dark:text-zinc-200" aria-hidden="true" />,
                ],
                url: "https://bit.ly/4hQegaj",
              },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/25 hover:bg-zinc-50 dark:hover:bg-[#14141B] shadow-sm dark:shadow-none transition-[background-color,border-color] flex flex-col justify-between min-h-32.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
              >
                <div className="flex items-center gap-2">
                  {"icons" in social && social.icons ? (
                    social.icons.map((icon, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-xl bg-zinc-100/90 dark:bg-[#14141B] border border-zinc-200/80 dark:border-white/12 flex items-center justify-center shrink-0"
                      >
                        {icon}
                      </div>
                    ))
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-zinc-100/90 dark:bg-[#14141B] border border-zinc-200/80 dark:border-white/12 flex items-center justify-center shrink-0">
                      {social.icon}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-zinc-950 dark:group-hover:text-[#D4FF00] transition-colors font-display">{social.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">{social.handle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Website Credits */}
        <div className="bg-zinc-100/70 dark:bg-zinc-900/30 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <FaCode className="h-5 w-5 text-zinc-600 dark:text-zinc-400" aria-hidden="true" />
            <h2 className="text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight">Fan Project &amp; Data Sources</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
            <div className="bg-white dark:bg-zinc-950/60 p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-none">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">STACK</span>
              <h3 className="text-base sm:text-lg font-display font-bold my-2 text-zinc-950 dark:text-white tracking-tight">Technology Stack</h3>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                <li>• Next.js App Router (React 19)</li>
                <li>• Tailwind CSS & Custom Design System</li>
                <li>• Framer Motion for Transitions</li>
                <li>• Vercel Edge Analytics & Speed Insights</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-zinc-950/60 p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-none">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">DATA SOURCES</span>
              <h3 className="text-base sm:text-lg font-display font-bold my-2 text-zinc-950 dark:text-white tracking-tight">Information Sources</h3>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                <li>• MODHAUS official releases and Cosmo logs</li>
                <li>• tripleS Fandom Wiki & KpopProfiles references</li>
                <li>• Official Spotify and YouTube metadata</li>
                <li>• Community WAV archives</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <p>Fan-made tribute project dedicated to tripleS & WAV.</p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/fadhilafif98"
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-9 min-h-9 inline-flex items-center justify-center rounded-lg text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-white/10 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com/in/fadhil-afif-al-qadri/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-9 min-h-9 inline-flex items-center justify-center rounded-lg text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-white/10 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}