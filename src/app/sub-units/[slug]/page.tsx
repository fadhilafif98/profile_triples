import { use } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllSubUnits, getSubUnitBySlug } from "@/lib/sub-units"
import SubUnitDetailClient from "./SubUnitDetailClient"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const units = getAllSubUnits()
  return units.map((unit) => ({
    slug: unit.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const unit = getSubUnitBySlug(slug)

  if (!unit) {
    return {
      title: "Sub-Unit Not Found | tripleS Dimension DB",
    }
  }

  const title = `${unit.name} (${unit.hangul}) | tripleS Dimension Directory`
  const description = `Explore ${unit.name} (${unit.era} • ${unit.category}), official tripleS sub-unit featuring ${unit.members.join(", ")}. Debut: ${unit.debutRelease}. Concept: ${unit.concept}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://profile-triples.vercel.app/sub-units/${slug}`,
      siteName: "tripleS Profile & Dimension DB",
      images: [
        {
          url: unit.image.startsWith("http") ? unit.image : `https://profile-triples.vercel.app${unit.image}`,
          alt: `${unit.name} Dimension Photo`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [unit.image.startsWith("http") ? unit.image : `https://profile-triples.vercel.app${unit.image}`],
    },
  }
}

export default function SubUnitDetailPage({ params }: PageProps) {
  const { slug } = use(params)
  const unit = getSubUnitBySlug(slug)

  if (!unit) {
    notFound()
  }

  return <SubUnitDetailClient slug={slug} />
}
