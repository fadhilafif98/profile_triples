import type { Metadata } from "next"
import SubUnitsClient from "./SubUnitsClient"

export const metadata: Metadata = {
  title: "tripleS Sub-Units (Dimensions) | AAA, KRE, LOVElution, VV, Hatchi & more",
  description: "Explore all 15 official tripleS (트리플에스) sub-units generated through Grand Gravity, including AAA, KRE, ACID EYES, LOVElution, EVOLution, NXT, Aria, Glow, VV, Hatchi, and msnz.",
  openGraph: {
    title: "tripleS Sub-Units (Dimensions) | Official Fandom Directory",
    description: "Explore all 15 official tripleS sub-units generated through Grand Gravity.",
    url: "https://profile-triples.vercel.app/sub-units",
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
    title: "tripleS Sub-Units (Dimensions) | Official Fandom Directory",
    description: "Explore all 15 official tripleS sub-units generated through Grand Gravity.",
    images: ["https://i.imgur.com/vHqYhWc.jpeg"],
  },
}

export default function SubUnitsPage() {
  return <SubUnitsClient />
}