import { FaDiscord, FaInstagram, FaSpotify, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              tripleS
            </h2>
          </div>

          <div className="flex space-x-6 mb-6 md:mb-0">
            <a
              href="https://www.youtube.com/@triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-400 transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube className="h-5 w-5" />
            </a>
            
            <a
              href="https://twitter.com/triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-400 transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="h-5 w-5" />
            </a>

            <a
              href="https://www.instagram.com/triplescosmos/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-400 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="h-5 w-5" />
            </a>

            <a
              href="https://open.spotify.com/artist/5Z71xE9prhpHrqL5thVMyK"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-400 transition-colors"
              aria-label="Spotify"
            >
              <FaSpotify className="h-5 w-5" />
            </a>

            <a
              href="https://www.tiktok.com/@triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-400 transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok className="h-5 w-5" />
            </a>

            <a
              href="https://discord.gg/triplescosmos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-400 transition-colors"
              aria-label="Discord"
            >
              <FaDiscord className="h-5 w-5" />
            </a>
          </div>

          <div className="text-gray-500 text-sm">&copy; {currentYear} tripleS. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}