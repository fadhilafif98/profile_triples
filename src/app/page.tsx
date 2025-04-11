import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import SpotifyEmbed from "@/components/spotify-embed"
import BirthdayCountdown from "@/components/birthday-countdown"
import { members } from "@/utils/members"

export default function Home() {
  return (
    <div className="relative bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/home/triples_home_2.jpg"
            alt="Background"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent text-white font-pretendard">
            tripleS
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">the idol of all possibilities</p>
          <Link
            href="/members"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-all"
          >
            Meet the Members <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Animated Accent Lines */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-pink-600"></div>
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-purple-500 to-pink-600"></div>
      </div>

      {/* Preview Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Experience the Future
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/60 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-semibold mb-3 text-pink-400">Latest Album</h3>
              <p className="text-gray-400 mb-4">Our newest release &quot;Performante&quot; is breaking all records.</p>
              <Link href="/about" className="text-purple-400 inline-flex items-center gap-1 hover:text-purple-300">
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-gray-900/60 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-semibold mb-3 text-pink-400">World Tour</h3>
              <p className="text-gray-400 mb-4">Join us on our &quot;tripleS Voyage&quot; world tour starting next month.</p>
              <Link href="/about" className="text-purple-400 inline-flex items-center gap-1 hover:text-purple-300">
                See dates <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-gray-900/60 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-semibold mb-3 text-pink-400">Fan Community</h3>
              <p className="text-gray-400 mb-4">Join our growing community of fans from around the world.</p>
              <Link href="/credits" className="text-purple-400 inline-flex items-center gap-1 hover:text-purple-300">
                Join now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Album Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        {/* Background stage lights effect */}
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="/home/triples_hatchi.jpg"
            alt="Stage lights"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-16 text-center uppercase tracking-wider">Latest Release</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <button className="bg-black/60 text-white hover:bg-black/80 transition-colors py-4 px-8 w-full md:w-auto text-lg font-medium uppercase tracking-wider border border-gray-700">
                Play on other platforms
              </button>
            </div>

            <div>
              <SpotifyEmbed/>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <Link
              href="/albums"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 px-6 py-3 rounded-full text-white font-medium hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-600/30 transition-all"
            >
              View All Albums <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sub-Units Preview Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Our Sub-Units
            </span>
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Discover the diverse musical styles and concepts of our specialized sub-units, each showcasing unique
            talents and artistic directions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative group h-64 overflow-hidden rounded-lg">
              <Image
                src="/sub-units/sub_unit_hatchi.jpg"
                alt="tripleS Hatch!"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white">∞! (Hatch!)</h3>
                <p className="text-pink-400">Japanese sub-unit</p>
              </div>
            </div>

            <div className="relative group h-64 overflow-hidden rounded-lg">
              <Image
                src="/sub-units/sub_unit_Visionary_Vision.jpg"
                alt="Velvet Noir"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white">Vision@ry Vision</h3>
                <p className="text-pink-400">Dance sub-unit</p>
              </div>
            </div>

            <div className="relative group h-64 overflow-hidden rounded-lg">
              <Image
                src="/sub-units/sub_unit_Glow.jpg"
                alt="Neon Pulse"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white">Glow</h3>
                <p className="text-pink-400">tripleS sub-unit last 4 members</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/sub-units"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 px-6 py-3 rounded-full text-white font-medium hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-600/30 transition-all"
            >
              Explore All Sub-Units <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      {/* Birthday Countdown Section */}
      <section className="mt-2">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Next Events
          </span>
        </h2>
        <BirthdayCountdown members={Object.values(members)} />
      </section>
    </div>
  )
}