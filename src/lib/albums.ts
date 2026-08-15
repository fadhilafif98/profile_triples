import { Album } from "@/types/album"

import a01 from "@/data/albums/01-access.json"
import a02 from "@/data/albums/02-assemble.json"
import a03 from "@/data/albums/03-aesthetic.json"
import a04 from "@/data/albums/04-touch.json"
import a05 from "@/data/albums/05-cherry-gene.json"
import a06 from "@/data/albums/06-muhan.json"
import a07 from "@/data/albums/07-mujuk.json"
import a08 from "@/data/albums/08-just-do-it.json"
import a09 from "@/data/albums/09-structure-of-sadness.json"
import a10 from "@/data/albums/10-assemble24.json"
import a11 from "@/data/albums/11-inner-dance.json"
import a12 from "@/data/albums/12-hash.json"
import a13 from "@/data/albums/13-performante.json"
import a14 from "@/data/albums/14-untitled.json"
import a15 from "@/data/albums/15-assemble25.json"
import a16 from "@/data/albums/16-secrethimitsubimil.json"
import a17 from "@/data/albums/17-beyond-beauty.json"
import a18 from "@/data/albums/18-love-and-pop-pt1.json"

export const albumsList: Album[] = [
  a01, a02, a03, a04, a05, a06, a07, a08, a09,
  a10, a11, a12, a13, a14, a15, a16, a17, a18,
] as Album[]

// Newest first by default for discography timeline
export const albums: Album[] = [...albumsList].reverse()

export function getAllAlbums(): Album[] {
  return albums
}

export function getAlbumById(id: string): Album | undefined {
  return albumsList.find((a) => a.id === id)
}
