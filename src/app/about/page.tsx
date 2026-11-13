import type { Metadata } from "next"
import AboutClient from "./AboutClient"

export const metadata: Metadata = {
  title: "About tripleS | The Idol of All Possibilities",
  description:
    "Discover tripleS (트리플에스), the 24-member K-pop girl group under MODHAUS known as 'The Idol of All Possibilities' — 'We are one and also twenty-four.' Explore their story from small 's' to big 'S', daily SIGNAL episodes, COSMO Objekts, and fan-voted Dimensions.",
  openGraph: {
    title: "About tripleS | The Idol of All Possibilities",
    description:
      "Discover tripleS (트리플에스), the 24-member K-pop girl group under MODHAUS known as 'The Idol of All Possibilities' — 'We are one and also twenty-four.' Explore their story from small 's' to big 'S', daily SIGNAL episodes, COSMO Objekts, and fan-voted Dimensions.",
    url: "https://profile-triples.vercel.app/about",
    siteName: "tripleS Profile DB",
    images: [
      {
        url: "https://profile-triples.vercel.app/home/triples_hero.jpg",
        width: 1200,
        height: 630,
        alt: "tripleS 24-member official assemble portrait",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About tripleS | Decentralized K-Pop Idol Group",
    description:
      "Learn about the concept of tripleS (트리플에스), the world's first decentralized girl group with 24 members.",
    images: ["https://profile-triples.vercel.app/home/triples_hero.jpg"],
  },
}

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "tripleS",
    alternateName: ["트리플에스", "トリプルS", "Social Sonyo Seoul"],
    description:
      "24-member South Korean K-pop girl group under MODHAUS ('The Idol of All Possibilities' — 'We are one and also twenty-four'), where WAV shape Dimensions and title tracks through Grand Gravity on COSMO.",
    genre: ["K-pop", "Dance-pop", "Alternative R&B"],
    foundingLocation: {
      "@type": "Place",
      name: "Seoul, South Korea",
    },
    member: [
      { "@type": "Person", name: "Yoon SeoYeon" },
      { "@type": "Person", name: "Jeong HyeRin" },
      { "@type": "Person", name: "Lee JiWoo" },
      { "@type": "Person", name: "Kim ChaeYeon" },
      { "@type": "Person", name: "Kim YooYeon" },
      { "@type": "Person", name: "Kim SooMin" },
      { "@type": "Person", name: "Kim NaKyoung" },
      { "@type": "Person", name: "Gong YuBin" },
      { "@type": "Person", name: "Kaede" },
      { "@type": "Person", name: "Seo DaHyun" },
      { "@type": "Person", name: "Kotone" },
      { "@type": "Person", name: "Kwak YeonJi" },
      { "@type": "Person", name: "Nien" },
      { "@type": "Person", name: "Park SoHyun" },
      { "@type": "Person", name: "Xinyu" },
      { "@type": "Person", name: "Mayu" },
      { "@type": "Person", name: "Lynn" },
      { "@type": "Person", name: "JooBin" },
      { "@type": "Person", name: "Jeong HaYeon" },
      { "@type": "Person", name: "Park ShiOn" },
      { "@type": "Person", name: "Kim ChaeWon" },
      { "@type": "Person", name: "Sullin" },
      { "@type": "Person", name: "SeoAh" },
      { "@type": "Person", name: "JiYeon" },
    ],
    url: "https://profile-triples.vercel.app/about",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  )
}