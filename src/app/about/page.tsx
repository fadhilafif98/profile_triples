import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="bg-black text-white pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          About tripleS
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-lg text-gray-300 mb-6">
              tripleS (트리플에스/トリプルS; also known as SSS or Social Sonyo Seoul), is a 24-member South Korean girl group under MODHAUS.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              The group consists of Kim YooYeon, Mayu, Xinyu, Kim NaKyoung, Park SoHyun, Seo DaHyun, Nien, Yoon SeoYeon, JiYeon, Kotone, Kim ChaeYeon, 
              Gong YuBin, Lee JiWoo, Kaede, Park ShiOn, Sullin, Lynn, Jeong HyeRin, Kim ChaeWon, Jeong HaYeon, Kim SooMin, Kwak YeonJi, JooBin, and SeoAh. 
            </p>
            <p className="text-lg text-gray-300">
              tripleS debuted with the first 10 members on February 13, 2023, with the mini album ASSEMBLE, and made their OT24 debut on May 8, 2024, with ASSEMBLE24. 
              Their official anniversary date is May 1, 2022, when the first member was revealed.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/about/triples_about.jpg"
              alt="tripleS 24 Group Photo"
              fill
              className="object-scale-down"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 to-transparent"></div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-pink-400">tripleS Concept</h2>
          <div className="bg-gray-900/60 p-8 rounded-lg border border-purple-500/20">
            <p className="text-gray-300 mb-4">
              Known as “the idol of all possibilities“, tripleS is the world’s first decentralized K-pop idol group.
            </p>
            <p className="text-gray-300 mb-4">
              The members will rotate between the full group, sub-units, and solo activities. 
              Fans can communicate with the group and participate in their activities such as deciding sub-units through Gravity, 
              and can collect digital photocards called “Objekts”.
            </p>
            <p className="text-gray-300">
              With the members all having the special ability ‘S’, they will join forces and demonstrate their abilities through the 
              “Dimensions” (sub-units) that they will recreate every season with new concepts.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-8 text-pink-400">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900/60 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-semibold mb-3 text-white">740K+</h3>
              <p className="text-gray-400">Albums sold worldwide</p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-semibold mb-3 text-white">680K+</h3>
              <p className="text-gray-400">Instagram followers</p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-semibold mb-3 text-white">2.78M+</h3>
              <p className="text-gray-400">Youtube subscribers</p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-semibold mb-3 text-white">9</h3>
              <p className="text-gray-400">Music awards</p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-semibold mb-3 text-white">20+</h3>
              <p className="text-gray-400">Countries visited</p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-semibold mb-3 text-white">523M+</h3>
              <p className="text-gray-400">Youtube streams</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}