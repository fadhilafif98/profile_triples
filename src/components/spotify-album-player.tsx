import Image from "next/image"
import { Play, SkipBack, SkipForward, MoreHorizontal, Plus } from "lucide-react"

interface Track {
  id: number
  title: string
  duration: string
}

export interface Album {
  id: string
  title: string
  artist: string
  cover: string
  releaseYear: string
  tracks: Track[]
}

interface SpotifyAlbumPlayerProps {
  album: Album
}

export default function SpotifyAlbumPlayer({ album }: SpotifyAlbumPlayerProps) {
  return (
    <div className="bg-gray-800/90 rounded-lg overflow-hidden shadow-xl">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          {/* Album Cover */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
            <Image
              src={album.cover || "/placeholder.svg"}
              alt={`${album.title} album cover`}
              fill
              className="object-cover rounded-md"
            />
          </div>

          {/* Album Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-gray-700/50 px-2 py-1 rounded text-xs text-gray-300 mb-2">Preview</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">{album.title}</h2>
            <p className="text-gray-400 mb-6">{album.artist}</p>

            <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
              <button className="bg-white text-black rounded-full p-3 hover:scale-105 transition-transform">
                <Play className="h-6 w-6 fill-current" />
              </button>

              <button className="flex items-center gap-2 border border-gray-600 rounded-full px-4 py-2 text-white hover:border-white transition-colors">
                <Plus className="h-5 w-5" />
                <span>Save on Spotify</span>
              </button>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center md:justify-start gap-6 text-gray-400">
              <button className="hover:text-white transition-colors">
                <SkipBack className="h-5 w-5" />
              </button>
              <button className="hover:text-white transition-colors">
                <Play className="h-5 w-5 fill-current" />
              </button>
              <button className="hover:text-white transition-colors">
                <SkipForward className="h-5 w-5" />
              </button>
              <button className="hover:text-white transition-colors ml-auto md:ml-4">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="mt-8 border-t border-gray-700 pt-6">
          <div className="space-y-4">
            {album.tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between hover:bg-gray-700/50 p-2 rounded-md group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 w-6 text-right">{track.id}</span>
                  <span className="text-white group-hover:text-pink-400 transition-colors">{track.title}</span>
                </div>
                <span className="text-gray-500">{track.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}