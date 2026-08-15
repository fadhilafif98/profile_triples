export interface Member {
  id: number;
  name: string; // Stage Name (e.g., "SeoYeon", "HyeRin")
  birthName?: string; // Full Birth Name (e.g., "Yoon Seo-yeon")
  hangul: string; // Stage Name Hangul (e.g., "서연")
  birthNameHangul?: string; // Full Birth Name Hangul (e.g., "윤서연")
  nativeName?: string; // Native name in original script (Japanese/Chinese/Thai)
  slug: string;
  role: string;
  image: string;
  birthday: string;
  birthplace: string;
  nationality: string;
  bloodType: string;
  height: string;
  mbti: string;
  representativeEmoji: string;
  subUnits: string[];
  revealDate: string;
  funFacts: string[];
  gif?: string;
  nextBirthday?: Date;
  daysUntil?: number;
}
