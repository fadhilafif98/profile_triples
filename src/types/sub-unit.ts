export interface SubUnit {
  id: number;
  slug: string;
  name: string;
  hangul: string;
  category: "Main Dimension" | "Special & Genre" | "Introductory" | "Japan" | "msnz Project";
  era: string;
  members: string[];
  concept: string;
  debutRelease: string;
  description: string;
  image: string;
}
