import type { Metadata } from "next"
import AnimatedLogo from "@/components/animated-logo";
import { FaApple, FaCode, FaDiscord, FaGithub, FaGooglePlay, FaInstagram, FaLinkedin, FaSpotify, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa";

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
    <div className="bg-[#050505] text-white pt-24 pb-28 selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2 font-mono">[ DIRECTORY & CREDITS ]</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Official Channels & Credits
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto mt-4 leading-relaxed">
            Direct gateways to tripleS official channels, COSMO application, music streaming, and project architecture details.
          </p>
        </div>

        {/* Official Channels Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Official tripleS Links</h2>
            <span className="text-xs font-mono text-zinc-500">[ MODHAUS OFFICIAL ]</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              {
                name: "Instagram",
                handle: "@triplescosmos",
                icon: <FaInstagram className="h-6 w-6" />,
                url: "https://www.instagram.com/triplescosmos/",
              },
              {
                name: "X (Twitter)",
                handle: "@triplescosmos",
                icon: <FaTwitter className="h-6 w-6" />,
                url: "https://twitter.com/triplescosmos",
              },
              {
                name: "YouTube",
                handle: "@triplescosmos",
                icon: <FaYoutube className="h-6 w-6" />,
                url: "https://www.youtube.com/@triplescosmos",
              },
              {
                name: "Official Site",
                handle: "triplescosmos.com",
                icon: (
                  <AnimatedLogo
                    width={32}
                    height={32}
                    strokeColor="#ffffff"
                    strokeWidth={180}
                    duration={2000}
                    loop={false}
                  />
                ),
                url: "https://www.triplescosmos.com/",
              },
              {
                name: "Spotify",
                handle: "tripleS",
                icon: <FaSpotify className="h-6 w-6" />,
                url: "https://open.spotify.com/artist/5Z71xE9prhpHrqL5thVMyK",
              },
              {
                name: "Discord",
                handle: "tripleS Community",
                icon: <FaDiscord className="h-6 w-6" />,
                url: "https://discord.gg/triplescosmos",
              },
              {
                name: "TikTok",
                handle: "@triplescosmos",
                icon: <FaTiktok className="h-6 w-6" />,
                url: "https://www.tiktok.com/@triplescosmos",
              },
              {
                name: "COSMO App",
                handle: "App Store / Play Store",
                icon: (
                  <div className="flex flex-row gap-2 justify-between items-center">
                    <FaGooglePlay className="h-5 w-5" />
                    <span>/</span>
                    <FaApple className="h-5 w-5" />
                  </div>
                ),
                url: "https://bit.ly/4hQegaj",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all flex flex-col justify-between min-h-[130px]"
              >
                <div className="text-zinc-300 group-hover:text-white transition-colors">{social.icon}</div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-200">{social.name}</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">{social.handle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Website Credits */}
        <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <FaCode className="h-5 w-5 text-zinc-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Project Architecture & Credits</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800/80">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">[ STACK ]</span>
              <h3 className="text-lg font-semibold my-2 text-white">Technology Stack</h3>
              <ul className="space-y-1.5 text-zinc-400 text-sm">
                <li>• Next.js App Router (React 19)</li>
                <li>• Tailwind CSS & Custom Design System</li>
                <li>• Framer Motion for Transitions</li>
                <li>• Vercel Edge Analytics & Speed Insights</li>
              </ul>
            </div>

            <div className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800/80">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">[ DATA ]</span>
              <h3 className="text-lg font-semibold my-2 text-white">Information Sources</h3>
              <ul className="space-y-1.5 text-zinc-400 text-sm">
                <li>• MODHAUS official releases and Cosmo logs</li>
                <li>• tripleS Fandom Wiki & KpopProfiles references</li>
                <li>• Official Spotify and YouTube metadata</li>
                <li>• Community WAV archives</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <p>Fan-made tribute project dedicated to tripleS & WAV.</p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/fadhilafif98"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/fadhil-afif-al-qadri/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}