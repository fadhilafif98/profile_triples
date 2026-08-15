export interface Album {
  id: string;
  title: string;
  type?: "Studio Album" | "Mini Album" | "Single Album" | "Digital Single" | "Japanese EP" | "Japanese Single";
  unit?: string;
  releaseDate: string;
  cover: string;
  description: string;
  spotifyLink: string;
}
