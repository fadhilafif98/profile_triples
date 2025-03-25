import MemberGrid from "@/components/member-grid"

export default function MembersPage() {
  return (
    <div className="bg-black text-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Meet <span className="text-white">tripleS</span> Members
        </h1>

        <p className="text-lg text-gray-300 mb-12 max-w-3xl">
          tripleS brings together a dynamic group of talented girls from Seoul, each contributing their own unique style, skills, and personality to create a collective sound and powerful performances. 
          Click on a member to learn more about their story and artistry.
        </p>

        <MemberGrid />
      </div>
    </div>
  )
}

