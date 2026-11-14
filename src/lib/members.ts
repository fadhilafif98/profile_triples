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

// 24 Official Member Colors (MODHAUS Identity from GEMINI.md)
export const OFFICIAL_MEMBER_COLORS: Record<number, string> = {
  1: "#17A7FE",
  2: "#8801FF",
  3: "#FFD800",
  4: "#76C722",
  5: "#D10A70",
  6: "#FF95C8",
  7: "#538FC8",
  8: "#FFECF3",
  9: "#FFA947",
  10: "#FF73B3",
  11: "#FFF554",
  12: "#4243A2",
  13: "#FF9649",
  14: "#082855",
  15: "#D51312",
  16: "#F88059",
  17: "#C7DFF8",
  18: "#C9FF50",
  19: "#85E3B3",
  20: "#FFAFD3",
  21: "#BEE6B5",
  22: "#FD82B8",
  23: "#FFFFFF",
  24: "#C99DF3",
}

export function getMemberColor(id: number): string {
  return OFFICIAL_MEMBER_COLORS[id] || "#D4FF00"
}

function parseHexRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "").trim()
  if (clean.length !== 6) return null
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return [r, g, b]
}

function mixHex(rgb: [number, number, number], target: [number, number, number], factor: number): string {
  const mix = (c: number, t: number) => Math.round(c + (t - c) * factor)
  return `#${mix(rgb[0], target[0]).toString(16).padStart(2, "0")}${mix(rgb[1], target[1]).toString(16).padStart(2, "0")}${mix(rgb[2], target[2]).toString(16).padStart(2, "0")}`
}

export function getContrastingInk(hex: string): string {
  const rgb = parseHexRgb(hex)
  if (!rgb) return "#FFFFFF"
  const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
  return yiq >= 155 ? "#09090B" : "#FFFFFF"
}

/**
 * Ensures member text/dot accents remain WCAG-legible against dark or light surfaces
 * (e.g. S14 #082855 navy on obsidian or S23 #FFFFFF white on alabaster).
 */
export function getReadableMemberColor(hex: string, onDark = true): string {
  const upper = hex.toUpperCase()
  const rgb = parseHexRgb(upper)
  if (!rgb) return onDark ? "#F4F4F6" : "#09090B"

  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const lum = 0.2126 * toLinear(rgb[0]) + 0.7152 * toLinear(rgb[1]) + 0.0722 * toLinear(rgb[2])

  if (onDark) {
    if (upper === "#FFFFFF") return "#F4F4F6"
    if (lum < 0.16) return mixHex(rgb, [255, 255, 255], 0.56)
    return hex
  }

  if (lum > 0.72) return mixHex(rgb, [9, 9, 11], 0.52)
  return hex
}

/**
 * Resolves official member portrait image URL using local Andless assets in public/members/.
 */
export function getMemberImageUrl(
  memberOrImage?: { id?: number; image?: string; slug?: string } | string | null
): string {
  if (!memberOrImage) return ""

  if (typeof memberOrImage === "string") {
    if (memberOrImage.startsWith("/") || memberOrImage.startsWith("http")) {
      return memberOrImage
    }
    return ""
  }

  if (memberOrImage.image) {
    if (memberOrImage.image.startsWith("/") || memberOrImage.image.startsWith("http")) {
      return memberOrImage.image
    }
  }

  if (memberOrImage.id) {
    return `/members/s${String(memberOrImage.id).padStart(2, "0")}.jpg`
  }

  return ""
}

