import { FaDiscord, FaInstagram, FaSpotify, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-zinc-100 dark:bg-[#050505] py-5 sm:py-6 border-t border-zinc-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          {/* Left Column: Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-0.5 text-center md:text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white font-pretendard">
                tripleS
              </h2>
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500">[ FAN ARCHIVE ]</span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-500 text-[11px] font-mono">
              &copy; {currentYear} tripleS fan directory &bull; All media &copy; MODHAUS
            </p>
          </div>

          {/* Right Column: Social Media Links */}
          <div className="flex items-center space-x-3 sm:space-x-4 text-zinc-500 dark:text-zinc-400">
            <a
              href="https://www.youtube.com/@triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:text-black dark:hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>
            
            <a
              href="https://twitter.com/triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:text-black dark:hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>

            <a
              href="https://www.instagram.com/triplescosmos/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:text-black dark:hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>

            <a
              href="https://open.spotify.com/artist/5Z71xE9prhpHrqL5thVMyK"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:text-black dark:hover:text-white transition-colors"
              aria-label="Spotify"
            >
              <FaSpotify className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>

            <a
              href="https://www.tiktok.com/@triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:text-black dark:hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>

            <a
              href="https://discord.gg/triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:text-black dark:hover:text-white transition-colors"
              aria-label="Discord"
            >
              <FaDiscord className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}