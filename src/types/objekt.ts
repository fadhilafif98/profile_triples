export interface Objekt {
  id: string;
  season: string; // "Atom01" | "Binary01" | "Cream01" | "Divine01" | "Ever01"
  member: string; // "SeoYeon", "HyeRin", "JiWoo", etc.
  collectionId: string; // "Atom01 JiWoo 100Z"
  collectionNo: string; // "100Z", "201A", etc.
  class: string; // "Welcome" | "First" | "Special" | "Double" | "Zero" | "Premier"
  slug: string; // "atom01-jiwoo-100z"
  shortCode?: string; // "A100Z"
  artist?: string; // "triples" | "artms"
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  comoAmount?: number;
  onOffline?: "online" | "offline" | string;
  memberSortOrder?: number;
  frontImage?: string;
  backImage?: string;
  thumbnailImage?: string;
  frontMedia?: string;
  backMedia?: string;
  description?: string;
  createdAt?: number;
  contract?: string;
  hasAudio?: boolean;
}

export type ObjektSide = "front" | "back";

export interface ObjektFilters {
  season: string;
  member: string;
  class: string;
  onOffline: string;
  search: string;
  sortBy: "collectionNo" | "newest" | "oldest" | "member";
}
