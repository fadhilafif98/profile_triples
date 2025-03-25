"use client"

import Image from "next/image"
import { FaSpotify } from "react-icons/fa"

// Album data with release dates for timeline
const albums = [
  {
    id: "access",
    title: "<ACCESS>",
    releaseDate: "November 9, 2022",
    cover: "/album/album_aaa.jpg",
    description:
      `<ACCESS> (Hangul: 액세스) is the debut mini album by tripleS' first sub-unit, Acid Angel from Asia. With title "Generation" and B-side "Rolex"`,
    spotifyLink: "https://open.spotify.com/album/4EdQFAwm8sQbbeEX1laj7H?si=xgS3kBzNS0aPnI2eTVGWcQ",
  },
  {
    id: "assemble",
    title: "ASSEMBLE",
    releaseDate: "February 13, 2023",
    cover: "/album/album_assamble_10.jpg",
    description:
      `Debut mini album by tripleS featuring the first ten revealed members. With Title ”Rising”, B-side “Colorful” and “Beam”`,
    spotifyLink: "https://open.spotify.com/album/6lCXOBwO98PfkbR32dsxrp?si=2dOFI_R5S-OKBMhmPU_VjQ",
  },
  {
    id: "aesthetic",
    title: "<AESTHETIC>,",
    releaseDate: "May 4, 2023",
    cover: "/album/3_kre_aesthetic.jpg",
    description: "<AESTHETIC>, which reinterprets the sensibility of Y2K with the music taste of 2023",
    spotifyLink: "https://open.spotify.com/album/6ZOfnNRe1tp5tQpdkdDfCy?si=gUa7wmakTvC5KEyji-t39A",
  },
  {
    id: "velvet-noir-ep",
    title: "Velvet Noir EP",
    releaseDate: "July 2024",
    cover: "/album/4_acid_eyes_cherry_gene.jpg",
    description:
      "Smooth R&B and soul music with sophisticated harmonies and emotional depth from our Velvet Noir sub-unit.",
    spotifyLink: "https://spotify.com",
  },
  {
    id: "neon-pulse-ep",
    title: "Neon Pulse EP",
    releaseDate: "June 2024",
    cover: "/album/5_kre_touch+.jpg",
    description: "Hard-hitting hip-hop tracks with bold lyrics and street style from our Neon Pulse sub-unit.",
    spotifyLink: "https://spotify.com",
  },
  {
    id: "aurora-ep",
    title: "Aurora EP",
    releaseDate: "May 2024",
    cover: "/album/6_LOVElution_MUHAN.jpg",
    description: "Ethereal pop music with dreamy melodies and atmospheric production from our Aurora sub-unit.",
    spotifyLink: "https://spotify.com",
  },
  {
    id: "stellar-maknae-ep",
    title: "Stellar Maknae EP",
    releaseDate: "April 2024",
    cover: "/album/7_EVOLution_Mujuk.jpg",
    description:
      "Bright, energetic pop songs and playful concepts from our youngest members in the Stellar Maknae sub-unit.",
    spotifyLink: "https://spotify.com",
  },
  {
    id: "first-light",
    title: "First Light",
    releaseDate: "November 2023",
    cover: "/album/8_aria_door.jpg",
    description:
      "Our debut album that introduced Stellar 24 to the world, featuring our signature blend of futuristic sounds.",
    spotifyLink: "https://spotify.com",
  },
].reverse()

export default function AlbumsPage() {
  return (
    <div className="bg-black text-white pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Our Discography
        </h1>

        <p className="text-base md:text-lg text-gray-300 mb-10 md:mb-16 max-w-3xl">
          Explore our musical journey through time. Each album represents a chapter in our story, showcasing our growth
          and evolution as artists.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line - hidden on very small screens, visible from sm up */}
          <div className="hidden sm:block absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500 to-pink-600"></div>

          {/* Albums */}
          <div className="space-y-12 md:space-y-24">
            {albums.map((album, index) => (
              <div key={album.id} className="relative">
                {/* Timeline dot - hidden on very small screens, visible from sm up */}
                <div className="hidden sm:block absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-[30px] w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 z-10"></div>

                {/* Album content */}
                <div
                  className={`flex flex-col sm:flex-row ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-4 md:gap-8 items-start sm:items-center`}
                >
                  {/* Date - full width on mobile, half width on larger screens */}
                  <div
                    className={`w-full sm:w-[80px] md:w-1/2 ${
                      index % 2 === 0 ? "sm:text-right sm:pr-8 md:pr-12" : "sm:text-left sm:pl-8 md:pl-12"
                    } mb-2 sm:mb-0`}
                  >
                    <div className="inline-block sm:block bg-gray-800/80 sm:bg-transparent px-2 py-1 sm:p-0 rounded sm:rounded-none text-base md:text-xl font-semibold text-pink-400">
                      {album.releaseDate}
                    </div>
                  </div>

                  {/* Album details - full width on mobile, half width on larger screens */}
                  <div
                    className={`w-full sm:flex-1 md:w-1/2 ${index % 2 === 0 ? "sm:pl-8 md:pl-12" : "sm:pr-8 md:pr-12"}`}
                  >
                    <div className="bg-gray-900/60 p-4 md:p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all">
                      <div className="flex flex-row gap-4 md:gap-6">
                        {/* Album cover - responsive sizing */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0">
                          <Image
                            src={album.cover || "/placeholder.svg"}
                            alt={album.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          {" "}
                          {/* min-w-0 helps with text truncation */}
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 truncate">
                            {album.title}
                          </h3>
                          <p className="text-sm md:text-base text-gray-400 mb-2 md:mb-4 line-clamp-3 md:line-clamp-none">
                            {album.description}
                          </p>
                          <a
                            href={album.spotifyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#1DB954] hover:text-[#1ed760] transition-colors text-sm md:text-base"
                          >
                            <FaSpotify className="h-4 w-4" />
                            Listen on Spotify
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to top button - visible on longer pages */}
        <div className="text-center mt-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-full text-white text-sm font-medium hover:bg-gray-700/80 transition-all"
          >
            Back to top
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}