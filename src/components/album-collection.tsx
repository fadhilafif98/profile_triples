"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Music } from "lucide-react"
import SpotifyAlbum, { type Album } from "./spotify-album"

interface AlbumCollectionProps {
  albums: Album[]
}

export default function AlbumCollection({ albums }: AlbumCollectionProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)

  return (
    <div className="space-y-12">
      {/* Album Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {albums.map((album) => (
          <div key={album.id} className="group cursor-pointer" onClick={() => setSelectedAlbum(album)}>
            <div className="relative aspect-square overflow-hidden rounded-md mb-3">
              <Image
                src={album.cover || "/placeholder.svg"}
                alt={album.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-[#1DB954] rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <Play className="h-6 w-6 text-black fill-current" />
                </div>
              </div>
            </div>
            <h3 className="font-medium text-white truncate">{album.title}</h3>
            <p className="text-sm text-gray-400 truncate">
              {album.releaseYear} • {album.artist}
            </p>
          </div>
        ))}
      </div>

      {/* Selected Album */}
      {selectedAlbum && (
        <div className="pt-8 border-t border-gray-800">
          <SpotifyAlbum album={selectedAlbum} />
        </div>
      )}

      {/* Spotify Button */}
      <div className="text-center mt-10">
        <a
          href="https://spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#1DB954] px-6 py-3 rounded-full text-white font-medium hover:bg-opacity-90 transition-all"
        >
          <Music className="h-5 w-5" />
          View All Albums on Spotify
        </a>
      </div>
    </div>
  )
}