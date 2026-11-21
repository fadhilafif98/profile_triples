import { GroupedObjekt, Objekt, ObjektSide } from "@/types/objekt";

export type ObjektSortOption =
  | "newest"
  | "oldest"
  | "collectionNoAsc"
  | "collectionNoDesc"
  | "memberAsc"
  | "memberDesc";

const OBJEKT_COLLATOR = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

// Merge multi-day minting delays within the same event drop while splitting separate release waves
const DROP_CLUSTER_GAP_MS = 7 * 24 * 60 * 60 * 1000;

interface DropCluster {
  items: Objekt[];
  minCreatedAt: number;
  maxCreatedAt: number;
  season: string;
  objektClass: string;
  description: string;
}

function compareWithinDropCluster(a: Objekt, b: Objekt): number {
  const memberDiff = (a.memberSortOrder || 0) - (b.memberSortOrder || 0);
  if (memberDiff !== 0) return memberDiff;
  return OBJEKT_COLLATOR.compare(a.collectionNo || "", b.collectionNo || "");
}

function sortObjektsByDropCluster(
  objekts: Objekt[],
  direction: "newest" | "oldest"
): Objekt[] {
  if (objekts.length <= 1) return [...objekts];

  const buckets = new Map<string, Objekt[]>();
  for (const item of objekts) {
    const season = (item.season || "").trim();
    const objektClass = (item.class || "").trim();
    const description = (item.description || "").trim();
    const key = `${season}|${objektClass}|${description}`.toLowerCase();
    let list = buckets.get(key);
    if (!list) {
      list = [];
      buckets.set(key, list);
    }
    list.push(item);
  }

  const clusters: DropCluster[] = [];

  for (const items of buckets.values()) {
    items.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    let current: DropCluster | null = null;
    for (const item of items) {
      const ts = item.createdAt || 0;
      if (!current || ts - current.maxCreatedAt > DROP_CLUSTER_GAP_MS) {
        if (current) {
          current.items.sort(compareWithinDropCluster);
          clusters.push(current);
        }
        current = {
          items: [item],
          minCreatedAt: ts,
          maxCreatedAt: ts,
          season: (item.season || "").trim(),
          objektClass: (item.class || "").trim(),
          description: (item.description || "").trim(),
        };
      } else {
        current.items.push(item);
        if (ts > current.maxCreatedAt) current.maxCreatedAt = ts;
      }
    }
    if (current) {
      current.items.sort(compareWithinDropCluster);
      clusters.push(current);
    }
  }

  clusters.sort((a, b) => {
    const timeDiff =
      direction === "newest"
        ? b.maxCreatedAt - a.maxCreatedAt
        : a.minCreatedAt - b.minCreatedAt;
    if (timeDiff !== 0) return timeDiff;

    const seasonCmp = OBJEKT_COLLATOR.compare(a.season, b.season);
    if (seasonCmp !== 0) return seasonCmp;
    const classCmp = OBJEKT_COLLATOR.compare(a.objektClass, b.objektClass);
    if (classCmp !== 0) return classCmp;
    return OBJEKT_COLLATOR.compare(a.description, b.description);
  });

  return clusters.flatMap((cluster) => cluster.items);
}

export function sortObjekts(objekts: Objekt[], sortBy: ObjektSortOption): Objekt[] {
  if (sortBy === "newest" || sortBy === "oldest") {
    return sortObjektsByDropCluster(objekts, sortBy);
  }
  return objekts.toSorted((a, b) => compareObjekts(a, b, sortBy));
}

export function compareObjekts(a: Objekt, b: Objekt, sortBy: ObjektSortOption): number {
  if (sortBy === "newest") {
    const batchA = Math.floor((a.createdAt || 0) / 43200000);
    const batchB = Math.floor((b.createdAt || 0) / 43200000);
    if (batchB !== batchA) return batchB - batchA;
    const memberDiff = (a.memberSortOrder || 0) - (b.memberSortOrder || 0);
    if (memberDiff !== 0) return memberDiff;
    return OBJEKT_COLLATOR.compare(a.collectionNo || "", b.collectionNo || "");
  }
  if (sortBy === "oldest") {
    const batchA = Math.floor((a.createdAt || 0) / 43200000);
    const batchB = Math.floor((b.createdAt || 0) / 43200000);
    if (batchA !== batchB) return batchA - batchB;
    const memberDiff = (a.memberSortOrder || 0) - (b.memberSortOrder || 0);
    if (memberDiff !== 0) return memberDiff;
    return OBJEKT_COLLATOR.compare(a.collectionNo || "", b.collectionNo || "");
  }
  if (sortBy === "collectionNoAsc") {
    const cmp = OBJEKT_COLLATOR.compare(a.collectionNo || "", b.collectionNo || "");
    if (cmp !== 0) return cmp;
    return (a.memberSortOrder || 0) - (b.memberSortOrder || 0);
  }
  if (sortBy === "collectionNoDesc") {
    const cmp = OBJEKT_COLLATOR.compare(b.collectionNo || "", a.collectionNo || "");
    if (cmp !== 0) return cmp;
    return (b.memberSortOrder || 0) - (a.memberSortOrder || 0);
  }
  if (sortBy === "memberAsc") {
    const diff = (a.memberSortOrder || 0) - (b.memberSortOrder || 0);
    if (diff !== 0) return diff;
    return OBJEKT_COLLATOR.compare(a.collectionNo || "", b.collectionNo || "");
  }
  if (sortBy === "memberDesc") {
    const diff = (b.memberSortOrder || 0) - (a.memberSortOrder || 0);
    if (diff !== 0) return diff;
    return OBJEKT_COLLATOR.compare(a.collectionNo || "", b.collectionNo || "");
  }
  return 0;
}

/**
 * Extracts the collection suffix letter (e.g. "Z" from "101Z", "A" from "101A").
 */
export function getObjektCollectionSuffix(objekt: Pick<Objekt, "collectionNo" | "onOffline">): string {
  const match = (objekt.collectionNo || "").trim().match(/^\d+([A-Za-z]+)$/);
  if (match) return match[1].toUpperCase();
  if (objekt.onOffline === "online") return "Z";
  if (objekt.onOffline === "offline") return "A";
  return "";
}

/**
 * Builds a canonical grouping key shared by online ("Z") and offline ("A") editions
 * of the same photocard (same season, member, class, and base collection number).
 */
export function getObjektVariantGroupKey(objekt: Objekt): string {
  const code = (objekt.collectionNo || "").trim();
  const match = code.match(/^(\d+)[A-Za-z]+$/);
  const baseNo = match ? match[1] : code || objekt.slug || objekt.id;
  return `${objekt.season}|${objekt.member}|${objekt.class}|${baseNo}`.toLowerCase();
}

function getVariantPriority(objekt: Objekt): number {
  const suffix = getObjektCollectionSuffix(objekt);
  if (suffix === "Z" || objekt.onOffline === "online") return 0;
  if (suffix === "A" || objekt.onOffline === "offline") return 1;
  return 2;
}

/**
 * Collapses duplicate online/offline editions (e.g. 101A + 101Z) into a single
 * GroupedObjekt entry while preserving the input sort order.
 */
export function groupObjektVariants(objekts: Objekt[]): GroupedObjekt[] {
  const orderedKeys: string[] = [];
  const buckets = new Map<string, Objekt[]>();

  for (const item of objekts) {
    const key = getObjektVariantGroupKey(item);
    let list = buckets.get(key);
    if (!list) {
      list = [];
      buckets.set(key, list);
      orderedKeys.push(key);
    }
    list.push(item);
  }

  return orderedKeys.map((key) => {
    const variants = buckets.get(key)!;
    if (variants.length > 1) {
      variants.sort((a, b) => {
        const pDiff = getVariantPriority(a) - getVariantPriority(b);
        if (pDiff !== 0) return pDiff;
        return OBJEKT_COLLATOR.compare(a.collectionNo || "", b.collectionNo || "");
      });
    }
    return {
      primary: variants[0],
      variants,
    };
  });
}

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

export interface ObjektsInitialSnapshot {
  objekts: Objekt[];
  groups: GroupedObjekt[];
  totalCount: number;
  uniqueCount: number;
  seasons: string[];
  classes: string[];
}

const SNAPSHOT_TTL_MS = 24 * 60 * 60 * 1000;
let cachedSnapshot: (ObjektsInitialSnapshot & { expiresAt: number }) | null = null;
let cachedLatestByMember: { map: Record<string, Objekt>; expiresAt: number } | null = null;
let snapshotInFlight: Promise<ObjektsInitialSnapshot> | null = null;
let clientLatestByMemberPromise: Promise<Record<string, Objekt>> | null = null;

function buildLatestObjektsByMember(groupedNewest: GroupedObjekt[]): Record<string, Objekt> {
  const latestByMember: Record<string, Objekt> = {};
  for (const group of groupedNewest) {
    const key = (group.primary.member || "").trim().toLowerCase();
    if (key && !latestByMember[key]) {
      latestByMember[key] = group.primary;
    }
  }
  return latestByMember;
}

/**
 * Fetches a compact SSR preview slice (first 30 newest Objekts + facet counts)
 * cached in server memory so Next.js does not retain or log 2MB+ fetch cache limits.
 */
export async function getInitialObjektsSnapshot(): Promise<ObjektsInitialSnapshot> {
  const now = Date.now();
  if (cachedSnapshot && now < cachedSnapshot.expiresAt) {
    return {
      objekts: cachedSnapshot.objekts,
      groups: cachedSnapshot.groups,
      totalCount: cachedSnapshot.totalCount,
      uniqueCount: cachedSnapshot.uniqueCount,
      seasons: cachedSnapshot.seasons,
      classes: cachedSnapshot.classes,
    };
  }

  if (!snapshotInFlight) {
    snapshotInFlight = fetch(ALL_OBJEKTS_JSON_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(900),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch Objekts snapshot: ${res.status}`);
        }
        const data: Objekt[] = await res.json();
        const sortedNewest = sortObjekts(data, "newest");
        const groupedNewest = groupObjektVariants(sortedNewest);
        const previewGroups = groupedNewest.slice(0, 30);
        const expiresAt = Date.now() + SNAPSHOT_TTL_MS;
        cachedLatestByMember = {
          map: buildLatestObjektsByMember(groupedNewest),
          expiresAt,
        };
        const snapshot: ObjektsInitialSnapshot = {
          objekts: previewGroups.map((g) => g.primary),
          groups: previewGroups,
          totalCount: data.length,
          uniqueCount: groupedNewest.length,
          seasons: getObjektSeasons(data),
          classes: getObjektClasses(data),
        };
        cachedSnapshot = {
          ...snapshot,
          expiresAt,
        };
        return snapshot;
      })
      .catch(() => ({
        objekts: [],
        groups: [],
        totalCount: 0,
        uniqueCount: 0,
        seasons: DEFAULT_SEASONS,
        classes: DEFAULT_CLASSES,
      }))
      .finally(() => {
        snapshotInFlight = null;
      });
  }

  return snapshotInFlight;
}

/**
 * Returns the newest Objekt for a given member (server-side 24h in-memory cache).
 */
export async function getLatestObjektForMember(memberName: string): Promise<Objekt | null> {
  const key = memberName.trim().toLowerCase();
  if (!key) return null;

  const now = Date.now();
  if (!cachedLatestByMember || now >= cachedLatestByMember.expiresAt) {
    await getInitialObjektsSnapshot();
  }

  return cachedLatestByMember?.map[key] ?? null;
}

/**
 * Client-side cached lookup for a member's latest Objekt (fallback when SSR snapshot timed out).
 */
export async function fetchLatestObjektForMember(memberName: string): Promise<Objekt | null> {
  const key = memberName.trim().toLowerCase();
  if (!key) return null;

  if (!clientLatestByMemberPromise) {
    clientLatestByMemberPromise = fetchAllObjekts()
      .then((data) => {
        const sortedNewest = sortObjekts(data, "newest");
        const groupedNewest = groupObjektVariants(sortedNewest);
        return buildLatestObjektsByMember(groupedNewest);
      })
      .catch(() => {
        clientLatestByMemberPromise = null;
        return {};
      });
  }

  const map = await clientLatestByMemberPromise;
  return map[key] ?? null;
}

/**
 * Fetches the entire collection of Objekts from the Hugging Face dataset repository.
 */
export async function fetchAllObjekts(): Promise<Objekt[]> {
  try {
    const res = await fetch(ALL_OBJEKTS_JSON_URL, {
      cache: "no-store",
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
        bg: "bg-[#7C3AED]/10 dark:bg-[#8B5CF6]/20",
        text: "text-[#6D28D9] dark:text-[#C4B5FD]",
        border: "border-[#7C3AED]/30",
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
