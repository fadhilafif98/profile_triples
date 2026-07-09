import type { Metadata } from "next"
import AlbumsClient from "./AlbumsClient"

export const metadata: Metadata = {
  title: "tripleS Discography | List of Albums & Songs",
  description: "Explore the discography of tripleS (트리플에스). Browse through their albums from ASSEMBLE, Lovelution, Evolution, Aria, to ASSEMBLE24 and listen on Spotify.",
  openGraph: {
    title: "tripleS Discography | List of Albums & Songs",
    description: "Explore the discography of tripleS (트리플에스). Browse through their albums from ASSEMBLE, Lovelution, Evolution, Aria, to ASSEMBLE24 and listen on Spotify.",
    url: "https://profile-triples.vercel.app/albums",
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
    title: "tripleS Discography | List of Albums & Songs",
    description: "Explore the discography of tripleS (트리플에스).",
    images: ["https://i.imgur.com/vHqYhWc.jpeg"],
  },
}

export default function AlbumsPage() {
  return <AlbumsClient />
}