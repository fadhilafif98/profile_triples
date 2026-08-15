"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowUpRight } from "lucide-react"
import { Member } from "@/types/member"
import { getAllMembers } from "@/lib/members"


const MemberCard = React.memo(({ member, setSelectedMember }: { member: Member, setSelectedMember: (member: Member) => void }) => {
  return (
    <motion.div
      key={member.id}
      className="parallax-card bg-white dark:bg-zinc-900/40 rounded-2xl overflow-hidden cursor-pointer border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm dark:shadow-none transition-all group"
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
        
        {/* S-number outline typography */}
        <div className="absolute top-2.5 left-3 z-10 pointer-events-none">
          <span
            className="text-xl sm:text-2xl font-black tracking-tighter text-transparent select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            style={{
              WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.95)",
            }}
          >
            S{member.id}
          </span>
        </div>

        {/* View Profile button */}
        <Link
          href={`/members/${member.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-medium bg-white text-black rounded-full px-2.5 py-1 hover:bg-zinc-200 shadow-md"
        >
          Profile <ArrowUpRight className="h-3 w-3" />
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-base flex flex-wrap items-baseline gap-1.5 font-pretendard">
            <span>{member.name}</span>
            {member.hangul && (
              <span className="text-xs text-zinc-300 font-normal font-mono">
                ({member.hangul})
              </span>
            )}
          </h3>
        </div>
      </div>
    </motion.div>
  );
});

MemberCard.displayName = 'MemberCard';

export default function MemberGrid() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const allMembers = getAllMembers()

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {allMembers.map((member) => (
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-zinc-100/90 dark:bg-black/60 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shadow-md"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid md:grid-cols-2">
                <div className="relative h-72 md:h-full min-h-[320px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <Image
                    src={`https://i.imgur.com/${selectedMember.image}`}
                    alt={selectedMember.name}
                    fill
                    loading="lazy"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent md:bg-gradient-to-r md:from-transparent md:to-white dark:from-zinc-950 dark:via-transparent dark:md:from-transparent dark:md:to-zinc-950"></div>
                </div>

                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 dark:bg-black/85 border border-zinc-200 dark:border-zinc-700/80 text-xs font-mono font-bold text-zinc-900 dark:text-white shadow-sm dark:shadow-md">
                        S{selectedMember.id} &bull; {selectedMember.mbti}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-2 flex flex-wrap items-baseline gap-2 font-pretendard">
                        <span>{selectedMember.name}</span>
                        {selectedMember.hangul && (
                          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 font-mono">
                            ({selectedMember.hangul})
                          </span>
                        )}
                      </h2>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-mono mt-1">{selectedMember.role}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Birthday</span>
                        <p className="text-zinc-900 dark:text-white font-medium text-xs">{selectedMember.birthday}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Hometown</span>
                        <p className="text-zinc-900 dark:text-white font-medium text-xs truncate">{selectedMember.birthplace || selectedMember.nationality}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Height & Blood</span>
                        <p className="text-zinc-900 dark:text-white font-medium text-xs">{selectedMember.height || "N/A"} &bull; {selectedMember.bloodType ? `Type ${selectedMember.bloodType}` : "N/A"}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Symbol</span>
                        <p className="text-zinc-900 dark:text-white font-medium text-xs truncate">{selectedMember.representativeEmoji}</p>
                      </div>
                    </div>

                    {selectedMember.subUnits && selectedMember.subUnits.length > 0 && (
                      <div className="mb-6">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5">Dimensions & Sub-Units</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedMember.subUnits.map((unit) => (
                            <span key={unit} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300">
                              {unit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Link
                      href={`/members/${selectedMember.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md"
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