export interface Album {
    id: string;
    title: string;
    releaseDate: string;
    cover: string;
    description: string;
    spotifyLink: string;
}

export const albums: Album[] = [
    {
        id: "access",
        title: "<ACCESS>",
        releaseDate: "November 9, 2022",
        cover: "/album/1_aaa_access.jpg",
        description:
            `<ACCESS> (Hangul: 액세스) is the debut mini album by tripleS' first sub-unit, Acid Angel from Asia. With title "Generation" and B-side "Rolex"`,
        spotifyLink: "https://open.spotify.com/album/4EdQFAwm8sQbbeEX1laj7H?si=xgS3kBzNS0aPnI2eTVGWcQ",
    },
    {
        id: "assemble",
        title: "ASSEMBLE",
        releaseDate: "February 13, 2023",
        cover: "/album/2_assamble_10.jpg",
        description:
            `Debut mini album by tripleS featuring the first ten revealed members. With Title ”Rising”, B-side “Colorful” and “Beam”`,
        spotifyLink: "https://open.spotify.com/album/6lCXOBwO98PfkbR32dsxrp?si=2dOFI_R5S-OKBMhmPU_VjQ",
    },
    {
        id: "aesthetic",
        title: "<AESTHETIC>,",
        releaseDate: "May 4, 2023",
        cover: "/album/3_kre_aesthetic.jpg",
        description:
            "<AESTHETIC>, which reinterprets the sensibility of Y2K with the music taste of 2023",
        spotifyLink: "https://open.spotify.com/album/6ZOfnNRe1tp5tQpdkdDfCy?si=gUa7wmakTvC5KEyji-t39A",
    },
    {
        id: "cherry-gene",
        title: "Cherry Gene",
        releaseDate: "July 6, 2023 ",
        cover: "/album/4_acid_eyes_cherry_gene.jpg",
        description:
            "The first single album by the collaborative sub-unit, ACID EYES. The lead single, Cherry Gene 'Baddest Mix'",
        spotifyLink: "https://spotify.com",
    },
    {
        id: "touch",
        title: "Touch+",
        releaseDate: "June 22, 2023",
        cover: "/album/5_kre_touch+.jpg",
        description:
            "Touch+ is an alternate version of +(KR)ystal Eyes' song 'Touch' off of their mini album AESTHETIC.",
        spotifyLink: "https://spotify.com",
    },
    {
        id: "muhan",
        title: "MUHAN",
        releaseDate: "August 17, 2023 ",
        cover: "/album/6_LOVElution_MUHAN.jpg",
        description:
            "<MUHAN> (Stylised as ↀ, meaning 'Infinity'; Hangul: 무한) is the debut mini album by tripleS' fourth sub-unit, LOVElution.",
        spotifyLink: "https://spotify.com",
    },
    {
        id: "mujuk",
        title: "MUJUK",
        releaseDate: "October 11, 2023 ",
        cover: "/album/7_EVOLution_Mujuk.jpg",
        description:
            "<MUJUK> (Stylised as ⟡, meaning 'Invincible'; Hangul: 무적) is the debut mini album by tripleS' fifth sub-unit, EVOLution.",
        spotifyLink: "https://spotify.com",
    },
    {
        id: "just-do-it",
        title: "Just Do It",
        releaseDate: "December 23, 2023",
        cover: "/album/9_NXT_just_do_it.jpg",
        description:
            "Despite being classified as a sub-unit debut, this song is not regarded as an official debut for the NXT members.",
        spotifyLink: "https://spotify.com",
    },
    {
        id: "structure-of-sadness",
        title: "Structure of Sadness",
        releaseDate: "January 15, 2024",
        cover: "/album/8_aria_door.jpg",
        description:
            "<Structure of Sadness> (Hangul: 스트럭쳐 오프 Sadness) is the debut single album by tripleS' sixth official sub-unit, Aria.",
        spotifyLink: "https://spotify.com",
    },
    {
        id: "assamble24",
        title: "ASSEMBLE24",
        releaseDate: "May 8, 2024",
        cover: "/album/10_ASSEMBLE24.jpg",
        description:
            "<ASSEMBLE24> (Hangul: 어셈블24) is the first full album by tripleS featuring all 24 members. This release marks the official debuts of 8 last members",
        spotifyLink: "https://spotify.com",
    },
    {
        id: "inner-dance",
        title: "Inner Dance",
        releaseDate: "June 21, 2024",
        cover: "/album/11_Glow_Inner_Dance.jpg",
        description:
            "'Inner Dance' (Hangul: 내적 댄스) is Glow's debut single. It was released on June 21, 2024, on streaming platforms and through a reels compilation on YouTube.",
        spotifyLink: "https://spotify.com",
    },
    {
        id: "performante",
        title: "Performante",
        releaseDate: "October 23, 2024",
        cover: "/album/12_VV_Performante.jpg",
        description:
            "<Performante> is the debut studio album by tripleS' eighth sub-unit, Visionary Vision. With “Hit the Floor” serving as the album's title track",
        spotifyLink: "https://spotify.com",
    },
].reverse();
