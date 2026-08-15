import type { Metadata } from "next";
import { Suspense } from "react";
import ObjektsClient from "./ObjektsClient";

export const metadata: Metadata = {
  title: "tripleS Digital Objekts Vault | Atom01 - Cream02 COSMO Cards",
  description:
    "Explore the complete tripleS (트리플에스) digital photocard Objekt archive across all seasons (Atom01 to Cream02) with official high-resolution front and back scans, classes, and collection metadata.",
  openGraph: {
    title: "tripleS Digital Objekts Vault | Official Fandom Directory",
    description:
      "Explore the complete tripleS digital photocard Objekt collection with high-res scans and COSMO metadata.",
    url: "https://profile-triples.vercel.app/objekts",
    siteName: "tripleS Profile DB",
    images: [
      {
        url: "https://i.imgur.com/vHqYhWc.jpeg",
        width: 1200,
        height: 630,
        alt: "tripleS Digital Objekts",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "tripleS Digital Objekts Vault | Official Fandom Directory",
    description:
      "Explore the complete tripleS digital photocard Objekt collection with high-res scans and COSMO metadata.",
    images: ["https://i.imgur.com/vHqYhWc.jpeg"],
  },
};

export default function ObjektsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]" />}>
      <ObjektsClient />
    </Suspense>
  );
}
