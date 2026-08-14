import { FaDiscord, FaInstagram, FaSpotify, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#050505] py-10 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold tracking-tight text-white font-pretendard">
              tripleS
            </h2>
            <span className="text-xs font-mono text-zinc-500">[ FAN ARCHIVE ]</span>
          </div>

          <div className="flex items-center space-x-6 text-zinc-400">
            <a
              href="https://www.youtube.com/@triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube className="h-4 w-4" />
            </a>
            
            <a
              href="https://twitter.com/triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="h-4 w-4" />
            </a>

            <a
              href="https://www.instagram.com/triplescosmos/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="h-4 w-4" />
            </a>

            <a
              href="https://open.spotify.com/artist/5Z71xE9prhpHrqL5thVMyK"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Spotify"
            >
              <FaSpotify className="h-4 w-4" />
            </a>

            <a
              href="https://www.tiktok.com/@triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok className="h-4 w-4" />
            </a>

            <a
              href="https://discord.gg/triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Discord"
            >
              <FaDiscord className="h-4 w-4" />
            </a>
          </div>

          <div className="text-zinc-500 text-xs font-mono">
            &copy; {currentYear} tripleS fan directory &bull; All media &copy; MODHAUS
          </div>
        </div>
      </div>
    </footer>
  )
}