// import { Instagram, Twitter, Youtube, Facebook, Twitch, Music, Github, Linkedin, Heart, Code, Star } from "lucide-react"

import AnimatedLogo from "@/components/animated-logo";
import { FaApple, FaCode, FaDiscord, FaGithub, FaGooglePlay, FaHeart, FaInstagram, FaLinkedin, FaSpotify, FaStar, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa";


export default function ThankYouPage() {
  return (
    <div className="bg-black text-white pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Thank You For Visiting
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We appreciate your support and interest in <span className="font-bold">tripleS</span>. Connect with tripleS on social media to stay updated with
            tripleS latest news, releases, and events.
          </p>
        </div>

        {/* Social Media Grid */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-pink-400">Connect With tripleS</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                name: "Instagram",
                icon: <FaInstagram className="h-8 w-8" />,
                url: "https://www.instagram.com/triplescosmos/",
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "Twitter",
                icon: <FaTwitter className="h-8 w-8" />,
                url: "https://twitter.com/triplescosmos",
                color: "from-blue-400 to-blue-600",
              },
              {
                name: "YouTube",
                icon: <FaYoutube className="h-8 w-8" />,
                url: "https://www.youtube.com/@triplescosmos",
                color: "from-red-500 to-red-700",
              },
              {
                name: "Official Website",
                icon: <AnimatedLogo
                        width={40}
                        height={40}
                        strokeColor="white"
                        strokeWidth={15}
                        duration={2000}
                        loop={false}
                      />,
                url: "https://www.triplescosmos.com/",
                color: "from-blue-600 to-blue-800",
              },
              {
                name: "Spotify",
                icon: <FaSpotify className="h-8 w-8" />,
                url: "https://open.spotify.com/artist/5Z71xE9prhpHrqL5thVMyK",
                color: "from-green-500 to-green-700",
              },
              {
                name: "Discord",
                icon: <FaDiscord className="h-8 w-8" />,
                url: "https://discord.gg/triplescosmos",
                color: "from-purple-600 to-purple-800",
              },
              {
                name: "TikTok",
                icon: <FaTiktok className="h-8 w-8" />,
                url: "https://www.tiktok.com/@triplescosmos",
                color: "from-gray-700 to-gray-900",
              },
              {
                name: "cosmo",
                icon: (<div className="flex flex-row gap-2 justify-between items-center">
                <FaGooglePlay className="h-7 w-7" />
                <span>/</span>
                <FaApple className="h-8 w-8" />
                </div>),
                url: "https://bit.ly/4hQegaj",
                color: "from-black to-orange-500",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${social.color} p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20`}
              >
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="relative z-10 text-white">{social.icon}</div>
                <span className="relative z-10 text-white font-medium">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Website Credits */}
        <div className="bg-gray-900/60 rounded-xl border border-purple-500/20 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-pink-400 flex items-center justify-center gap-2">
            <FaCode className="h-6 w-6" />
            Website Credits
          </h2>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
                  <FaStar className="h-5 w-5 text-yellow-400" />
                  Design Inspiration
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Modern K-pop group websites</li>
                  <li>• Spotify&apos;s dark UI aesthetic</li>
                  <li>• Neon cyberpunk visual elements</li>
                  <li>• Motion design principles by Framer</li>
                </ul>
              </div>

              <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
                  <FaStar className="h-5 w-5 text-yellow-400" />
                  Technologies Used
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Next.js 14 with App Router</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Framer Motion for animations</li>
                  <li>• Lucide & React for icons</li>
                  <li>• Vercel for deployment</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
                <FaStar className="h-5 w-5 text-yellow-400" />
                Special Thanks
              </h3>
              <p className="text-gray-300 mb-4">
                This website was created as a demonstration project showcasing modern web development techniques and
                design principles for music artist websites. Special thanks to:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-1">Kpop Profiles and tripleS Fandom</h4>
                  <p className="text-gray-400 text-sm">For providing references and data for this website</p>
                </div>
                <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-1">Design Contributors</h4>
                  <p className="text-gray-400 text-sm">For the visual direction and UI/UX guidance</p>
                </div>
                <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-1">Open Source Community</h4>
                  <p className="text-gray-400 text-sm">For the amazing tools and libraries that power this site</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="flex items-center justify-center gap-2 text-gray-400">
              Made with <FaHeart className="h-4 w-4 text-pink-500 animate-pulse" /> for music fans everywhere
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <a
                href="https://github.com/fadhilafif98"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/fadhil-afif-al-qadri/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
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