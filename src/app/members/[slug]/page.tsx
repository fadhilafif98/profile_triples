import { use } from "react"
import { notFound } from "next/navigation"
import { getMemberBySlug } from "@/utils/members"
import MemberProfileClient from "./MemberProfileClient"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const member = getMemberBySlug(slug)
  if (!member) {
    return {
      title: "Member Not Found | tripleS Profile DB",
    }
  }

  const title = `${member.name} (${member.mbti}) | tripleS Member Profile`
  const description = `Explore full profile, roles, and stats for tripleS member ${member.name} (${member.representativeEmoji}). Role: ${member.role}. Nationality: ${member.nationality}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://profile-triples.vercel.app/members/${slug}`,
      siteName: "tripleS Profile DB",
      images: [
        {
          url: `https://i.imgur.com/${member.image}`,
          alt: `${member.name} Profile Photo`,
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://i.imgur.com/${member.image}`],
    },
  }
}

export default function MemberProfilePage({ params }: PageProps) {
  const { slug } = use(params)
  const member = getMemberBySlug(slug)

  if (!member) notFound()

  return <MemberProfileClient slug={slug} />
}
