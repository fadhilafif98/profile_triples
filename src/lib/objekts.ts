import { Objekt, ObjektSide } from "@/types/objekt";

export const HF_CDN_BASE =
  "https://huggingface.co/datasets/fadhilafif98/triples-objekts/resolve/main";

export const ALL_OBJEKTS_JSON_URL = `${HF_CDN_BASE}/all_objekts.json`;

/**
 * Returns the direct Hugging Face CDN URL for an Objekt image.
 * Pattern: https://huggingface.co/datasets/fadhilafif98/triples-objekts/resolve/main/images/{season}/{member}/{slug}_{side}.png
 */
export function getObjektImageUrl(
  season: string,
  member: string,
  slug: string,
  side: ObjektSide = "front"
): string {
  // Normalize parameters
  const s = season.trim();
  const m = member.trim();
  const sl = slug.trim().toLowerCase();
  return `${HF_CDN_BASE}/images/${s}/${m}/${sl}_${side}.png`;
}

export function getObjektFrontUrl(objekt: {
  season: string;
  member: string;
  slug: string;
}): string {
  return getObjektImageUrl(objekt.season, objekt.member, objekt.slug, "front");
}

export function getObjektBackUrl(objekt: {
  season: string;
  member: string;
  slug: string;
}): string {
  return getObjektImageUrl(objekt.season, objekt.member, objekt.slug, "back");
}

/**
 * Fetches the entire collection of Objekts from the Hugging Face dataset repository.
 */
export async function fetchAllObjekts(): Promise<Objekt[]> {
  try {
    const res = await fetch(ALL_OBJEKTS_JSON_URL, {
      next: { revalidate: 86400 }, // Cache on edge for 24 hours
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch Objekts: ${res.status} ${res.statusText}`);
    }
    const data: Objekt[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching all_objekts.json:", error);
    return [];
  }
}

export const DEFAULT_SEASONS = [
  "Atom01",
  "Binary01",
  "Cream01",
  "Divine01",
  "Ever01",
  "Atom02",
  "Binary02",
  "Cream02",
];

export const DEFAULT_CLASSES = [
  "First",
  "Special",
  "Double",
  "Zero",
  "Welcome",
  "Premier",
  "Motion",
  "Unit",
];

/**
 * Get distinct seasons from a list of objekts, ordered chronologically
 */
export function getObjektSeasons(objekts: Objekt[]): string[] {
  const extracted = Array.from(new Set(objekts.map((o) => o.season))).filter(Boolean);
  if (extracted.length === 0) return DEFAULT_SEASONS;

  return extracted.sort((a, b) => {
    const idxA = DEFAULT_SEASONS.indexOf(a);
    const idxB = DEFAULT_SEASONS.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });
}

/**
 * Get distinct classes from a list of objekts
 */
export function getObjektClasses(objekts: Objekt[]): string[] {
  const classes = Array.from(new Set(objekts.map((o) => o.class))).filter(Boolean);
  if (classes.length === 0) return DEFAULT_CLASSES;
  return classes.sort();
}

/**
 * Helper to get distinct members from a list of objekts
 */
export function getObjektMembers(objekts: Objekt[]): string[] {
  const members = Array.from(new Set(objekts.map((o) => o.member))).filter(Boolean);
  return members.sort();
}

/**
 * Return badge style based on Objekt class
 */
export function getClassBadgeStyle(objektClass: string): {
  bg: string;
  text: string;
  border: string;
} {
  const c = (objektClass || "").toLowerCase();
  switch (c) {
    case "first":
    case "first class":
      return {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-500/30",
      };
    case "special":
    case "special class":
      return {
        bg: "bg-purple-500/10 dark:bg-purple-500/20",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-500/30",
      };
    case "double":
    case "double class":
      return {
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-500/30",
      };
    case "welcome":
      return {
        bg: "bg-sky-500/10 dark:bg-sky-500/20",
        text: "text-sky-700 dark:text-sky-300",
        border: "border-sky-500/30",
      };
    case "zero":
      return {
        bg: "bg-rose-500/10 dark:bg-rose-500/20",
        text: "text-rose-700 dark:text-rose-300",
        border: "border-rose-500/30",
      };
    case "premier":
      return {
        bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
        text: "text-indigo-700 dark:text-indigo-300",
        border: "border-indigo-500/30",
      };
    case "motion":
      return {
        bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
        text: "text-cyan-700 dark:text-cyan-300",
        border: "border-cyan-500/30",
      };
    case "unit":
      return {
        bg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20",
        text: "text-fuchsia-700 dark:text-fuchsia-300",
        border: "border-fuchsia-500/30",
      };
    default:
      return {
        bg: "bg-zinc-500/10 dark:bg-zinc-500/20",
        text: "text-zinc-700 dark:text-zinc-300",
        border: "border-zinc-500/30",
      };
  }
}
