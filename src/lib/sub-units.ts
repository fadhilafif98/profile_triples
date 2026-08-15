import { SubUnit } from "@/types/sub-unit"

import u01 from "@/data/sub-units/01-acid-angel-from-asia.json"
import u02 from "@/data/sub-units/02-krystal-eyes.json"
import u03 from "@/data/sub-units/03-acid-eyes.json"
import u04 from "@/data/sub-units/04-lovelution.json"
import u05 from "@/data/sub-units/05-evolution.json"
import u06 from "@/data/sub-units/06-nxt.json"
import u07 from "@/data/sub-units/07-aria.json"
import u08 from "@/data/sub-units/08-glow.json"
import u09 from "@/data/sub-units/09-visionary-vision.json"
import u10 from "@/data/sub-units/10-hatchi.json"
import u11 from "@/data/sub-units/11-alphie.json"
import u12 from "@/data/sub-units/12-moon.json"
import u13 from "@/data/sub-units/13-sun.json"
import u14 from "@/data/sub-units/14-neptune.json"
import u15 from "@/data/sub-units/15-zenith.json"

export const subUnits: SubUnit[] = [
  u01, u02, u03, u04, u05, u06, u07, u08,
  u09, u10, u11, u12, u13, u14, u15,
] as SubUnit[]

export function getAllSubUnits(): SubUnit[] {
  return subUnits
}

export function getSubUnitBySlug(slug: string): SubUnit | undefined {
  return subUnits.find((u) => u.slug === slug)
}

export function getSubUnitsByCategory(category: SubUnit["category"]): SubUnit[] {
  return subUnits.filter((u) => u.category === category)
}
