import { Member } from "@/types/member"

import s01 from "@/data/members/s01-yoon-seo-yeon.json"
import s02 from "@/data/members/s02-jeong-hye-rin.json"
import s03 from "@/data/members/s03-lee-ji-woo.json"
import s04 from "@/data/members/s04-kim-chae-yeon.json"
import s05 from "@/data/members/s05-kim-yoo-yeon.json"
import s06 from "@/data/members/s06-kim-soo-min.json"
import s07 from "@/data/members/s07-kim-na-kyoung.json"
import s08 from "@/data/members/s08-gong-yu-bin.json"
import s09 from "@/data/members/s09-kaede.json"
import s10 from "@/data/members/s10-seo-da-hyun.json"
import s11 from "@/data/members/s11-kotone.json"
import s12 from "@/data/members/s12-kwak-yeon-ji.json"
import s13 from "@/data/members/s13-nien.json"
import s14 from "@/data/members/s14-park-so-hyun.json"
import s15 from "@/data/members/s15-xinyu.json"
import s16 from "@/data/members/s16-mayu.json"
import s17 from "@/data/members/s17-lynn.json"
import s18 from "@/data/members/s18-joobin.json"
import s19 from "@/data/members/s19-jeong-ha-yeon.json"
import s20 from "@/data/members/s20-park-shi-on.json"
import s21 from "@/data/members/s21-kim-chae-won.json"
import s22 from "@/data/members/s22-sullin.json"
import s23 from "@/data/members/s23-seoah.json"
import s24 from "@/data/members/s24-jiyeon.json"

export const membersList: Member[] = [
  s01, s02, s03, s04, s05, s06, s07, s08,
  s09, s10, s11, s12, s13, s14, s15, s16,
  s17, s18, s19, s20, s21, s22, s23, s24,
] as Member[]

export const members: { [key: string]: Member } = membersList.reduce((acc, m) => {
  acc[`member${m.id}`] = m
  return acc
}, {} as { [key: string]: Member })

export function getAllMembers(): Member[] {
  return membersList
}

export function getMemberBySlug(slug: string): Member | undefined {
  return membersList.find((m) => m.slug === slug)
}

export function getMemberById(id: number): Member | undefined {
  return membersList.find((m) => m.id === id)
}

export function getRelatedMembers(member: Member, count = 4): Member[] {
  return membersList
    .filter((m) => m.id !== member.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
}
