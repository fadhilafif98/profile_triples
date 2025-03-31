import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Sub-unit data
const subUnits = [
  {
    id: 1,
    name: "Acid Angel from Asia",
    members: ["HyeRin", "YooYeon", "NaKyoung", "YuBin"],
    concept: "Dance, Electro, Cyberpunk",
    description:
      "Acid Angel from Asia's concept seems to be based on and representing the current youth of Asia, with a particular focus on South Korean youth culture and Generation Z.",
    image: "/sub-units/sub_unit_AAA.jpg",
  },
  {
    id: 2,
    name: "+(KR)ystal Eyes",
    members: ["SeoYeon", "JiWoo", "ChaeYeon", "SooMin"],
    concept: "Pop, Glam, Elegant",
    description:
      "+(KR)ystal Eyes seems to represent the High-teen, Gen Z youth of today and whilst not completely paralleling Acid Angel from Asia, the unit has a much more refreshing, white angel/fairy image that juxtaposes AAA's dark angel and rebellious portrayal.",
    image: "/sub-units/sub_unit_KRE.jpg",
  },
  {
    id: 3,
    name: "ACID EYES",
    members: ["SeoYeon", "HyeRin", "JiWoo", "ChaeYeon", "YooYeon", "SooMin", "NaKyoung", "YuBin"],
    concept: "Collaboration Sub-unit",
    description:
      "ACID EYES (Hangul: 애시드아이즈) is the first collaboration sub-unit of tripleS, consisting of all members from the units, Acid Angel from Asia and +(KR)ystal Eyes.",
    image: "/sub-units/sub_unit_ACID_EYES.jpg",
  },
  {
    id: 4,
    name: "LOVElution",
    members: ["SeoYeon", "HyeRin", "YuBin", "Kaede", "DaHyun", "Nien", "SoHyun", "Xinyu"],
    concept: "Lovely Pop",
    description:
      "LOVElution concept is about self-confidence within our Generation and youth. The Girls Capitalism music video is all about loving yourself, as shown in the “10 Rules of the Mad Money Club“.",
    image: "/sub-units/sub_unit_Lovelution.jpg",
  },
  {
    id: 5,
    name: "EVOLution",
    members: ["JiWoo", "ChaeYeon", "YooYeon", "SooMin", "NaKyoung", "Kotone", "YeonJi", "Mayu"],
    concept: "Fresh & Youthful",
    description:
      "EVOLution's concept involves tripleS' main storyline of “Among the girls inhabiting Earth, there are some who hold special abilities. We decided to call these girls with special abilities, s, through Dimension, the girls of tripleS join forces and demonstrate each of their abilities“.",
    image: "/sub-units/sub_unit_EVOLution.jpg",
  },
  {
    id: 6,
    name: "NXT",
    members: ["Lynn", "JooBin", "HaYeon", "ShiOn"],
    concept: "Dance & Youthful",
    description:
      "NXT (Hangul: 넥스트) is tripleS' fifth sub-unit. The unit was created with the purpose of revealing members Lynn, JooBin, Jeong HaYeon and Park ShiOn. They debuted with the digital single, “Just Do It”, on December 23, 2023.",
    image: "/sub-units/sub_unit_TripleS_NXT.jpg",
  },
  {
    id: 7,
    name: "Aria",
    members: ["JiWoo", "ChaeYeon", "Kaede", "DaHyun", "Nien"],
    concept: "Ballad",
    description:
      "Aria (아리아) is the seventh sub-unit and first ballad sub-unit of tripleS. They made their debut on January 15, 2024 with their single album, Structure of Sadness, and the title track, “Door”. ",
    image: "/sub-units/sub_unit_Aria_Door.jpg",
  },
  {
    id: 8,
    name: "Glow",
    members: ["ChaeWon", "Sullin", "SeoAh", "JiYeon"],
    concept: "Fresh & Youthful",
    description:
      "Glow (Hangul: 글로우) is a non-voted for tripleS sub-unit consisting of the last four revealed members of tripleS. They made their debut with their digital single, “Inner Dance”, on June 21, 2024.",
    image: "/sub-units/sub_unit_Glow.jpg",
  },
  {
    id: 9,
    name: "Vision@ry Vision",
    members: ["HyeRin", "YooYeon", "NaKyoung", "YuBin", "Kaede", "Kotone", "YeonJi", "Nien", "SoHyun", "Xinyu", "Lynn", "JiYeon"],
    concept: "Dance Unit",
    description:
      "Visionary Vision (Stylized as Vision@ry Vision or tripleS VV) is tripleS' eighth sub-unit, and the first dance-orientated unit.",
    image: "/sub-units/sub_unit_Visionary_Vision.jpg",
  },
  {
    id: 10,
    name: "∞! (Hatch!)",
    members: ["JiWoo", "ChaeYeon", "SooMin", "YooYeon", "Kotone", "Mayu", "ShiOn", "ChaeWon"],
    concept: "J-Pop",
    description:
      "∞! (Japanese: ハッチ, Hangul: 핫찌; pronounced: Hatchi, also stylised as Hatch!) is tripleS' Japanese sub-unit. They will make their debut on November 20, 2024 with their single album, “Untitled”. ",
    image: "/sub-units/sub_unit_hatchi.jpg",
  },
]

export default function SubUnitsPage() {
  return (
    <div className="bg-black text-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Sub-Units
        </h1>

        <p className="text-lg text-gray-300 mb-12 max-w-3xl">
          tripleS features specialized sub-units that showcase different musical styles and concepts. Each sub-unit
          highlights the unique talents and personalities of its members while exploring diverse genres and performance
          styles.
        </p>

        <div className="space-y-24">
          {subUnits.map((unit, index) => (
            <div
              key={unit.id}
              className={`grid grid-cols-1 ${index % 2 === 0 ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-[1.2fr_1fr]"} gap-8 lg:gap-12 items-center`}
            >
              <div className={`${index % 2 !== 0 && "lg:order-2"}`}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                  <div className="relative">
                    <Image
                      src={unit.image || "/placeholder.svg"}
                      alt={unit.name}
                      width={600}
                      height={400}
                      className="rounded-lg object-cover w-full aspect-video"
                    />
                  </div>
                </div>
              </div>

              <div className={`${index % 2 !== 0 && "lg:order-1"}`}>
                <div className="inline-block rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 text-sm mb-4">
                  {unit.concept}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{unit.name}</h2>
                <p className="text-gray-300 mb-6">{unit.description}</p>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-pink-400">Members</h3>
                  <div className="flex flex-wrap gap-2">
                    {unit.members.map((member, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-800 rounded-full text-sm text-white hover:bg-purple-600 transition-colors cursor-pointer"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/members`}
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View member profiles <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Special Collaborations</h2>
          <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
            Beyond our established sub-units, tripleS members frequently form special project groups for unique
            collaborations and limited releases. Stay tuned for upcoming projects!
          </p>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-all"
          >
            Learn More About <span className="font-bold">tripleS</span> <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}