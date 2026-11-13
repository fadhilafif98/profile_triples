import React from "react"

const SpotifyEmbed: React.FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-white/10 bg-black">
      <iframe
        src="https://open.spotify.com/embed/artist/5Z71xE9prhpHrqL5thVMyK?utm_source=generator&theme=0"
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="tripleS Spotify Player"
        className="w-full"
      />
    </div>
  )
}

export default SpotifyEmbed
