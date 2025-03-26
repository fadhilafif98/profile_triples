"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Member, members } from '../utils/members'


const MemberCard = React.memo(({ member, setSelectedMember }: { member: Member, setSelectedMember: (member: Member) => void }) => {
  return (
    <motion.div
      key={member.id}
      className="parallax-card bg-gray-900/60 rounded-lg overflow-hidden cursor-pointer border border-purple-500/20 hover:border-purple-500/50 transition-all"
      whileHover={{ y: -10 }}
      onClick={() => setSelectedMember(member)}
    >
      <div className="relative h-60 sm:h-64 md:h-72 group">
        <Image 
          src={`https://i.imgur.com/${member.image}`}
          alt={member.name} 
          width={500} 
          height={800} 
          className="object-cover"
          priority
        />
        <img
          src={`https://i.giphy.com/media/v1.${member.gif}`}
          alt="GIF"
          className="absolute inset-0 object-cover w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold">{member.name}</h3>
          <p className="text-pink-400 text-sm">{member.role}</p>
        </div>
      </div>
    </motion.div>
  );
});

MemberCard.displayName = 'MemberCard';

export default function MemberGrid() {
  // Define the type of the state for the selected member
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {/* Render each member individually */}
        {Object.values(members).map((member) => (
          <MemberCard key={member.id} member={member} setSelectedMember={setSelectedMember} />
        ))}
      </div>

      {/* Member Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-gray-900 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid md:grid-cols-2">
                <div className="relative h-full overflow-hidden">
                  <Image
                    src={`https://i.imgur.com/${selectedMember.image}`}
                    alt={selectedMember.name}
                    width={500} // Replace with a static width or based on the design
                    height={300} // Replace with a static height or based on the design
                    loading="lazy"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent md:bg-gradient-to-r"></div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-1">{selectedMember.name}</h2>
                    <p className="text-pink-400 font-medium">{selectedMember.role}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Birthday</h3>
                      <p className="text-gray-300">{selectedMember.birthday}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Nationality</h3>
                      <p className="text-gray-300">{selectedMember.nationality}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">MBTI</h3>
                      <p className="text-gray-300">{selectedMember.mbti}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Representative Emoji</h3>
                      <p className="text-gray-300">{selectedMember.representativeEmoji}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}