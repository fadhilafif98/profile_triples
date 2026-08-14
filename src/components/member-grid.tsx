"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowUpRight } from "lucide-react"
import { Member, members } from '../utils/members'


const MemberCard = React.memo(({ member, setSelectedMember }: { member: Member, setSelectedMember: (member: Member) => void }) => {
  return (
    <motion.div
      key={member.id}
      className="parallax-card bg-zinc-900/40 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-zinc-600 transition-all group"
      whileHover={{ y: -6 }}
      onClick={() => setSelectedMember(member)}
    >
      <div className="relative h-60 sm:h-64 md:h-72">
        <Image 
          src={`https://i.imgur.com/${member.image}`}
          alt={member.name} 
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <img
          src={`https://i.giphy.com/media/v1.${member.gif}`}
          alt={`${member.name} preview`}
          loading="lazy"
          className="absolute inset-0 object-cover w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        
        {/* S-number badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white">
            S{member.id}
          </span>
        </div>

        {/* View Profile button */}
        <Link
          href={`/members/${member.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-medium bg-white text-black rounded-full px-2.5 py-1 hover:bg-zinc-200"
        >
          Profile <ArrowUpRight className="h-3 w-3" />
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-base">{member.name}</h3>
          <p className="text-zinc-400 text-xs font-mono mt-0.5">{member.role}</p>
        </div>
      </div>
    </motion.div>
  );
});

MemberCard.displayName = 'MemberCard';

export default function MemberGrid() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid md:grid-cols-2">
                <div className="relative h-72 md:h-full min-h-[320px] overflow-hidden bg-zinc-900">
                  <Image
                    src={`https://i.imgur.com/${selectedMember.image}`}
                    alt={selectedMember.name}
                    fill
                    loading="lazy"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent md:bg-gradient-to-r md:from-transparent md:to-zinc-950"></div>
                </div>

                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="mb-6">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        S{selectedMember.id} &bull; {selectedMember.mbti}
                      </span>
                      <h2 className="text-3xl font-extrabold text-white mt-2">{selectedMember.name}</h2>
                      <p className="text-zinc-400 text-sm font-mono mt-1">{selectedMember.role}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                        <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">Birthday</span>
                        <p className="text-white font-medium">{selectedMember.birthday}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                        <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">Nationality</span>
                        <p className="text-white font-medium">{selectedMember.nationality}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                        <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">MBTI</span>
                        <p className="text-white font-medium">{selectedMember.mbti}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                        <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">Symbol</span>
                        <p className="text-white font-medium">{selectedMember.representativeEmoji}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Link
                      href={`/members/${selectedMember.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-white text-black py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-all"
                    >
                      View Full Dossier <ArrowUpRight className="h-4 w-4" />
                    </Link>
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