"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Member } from "@/types/member"
import { getAllMembers, getMemberColor } from "@/lib/members"

const MemberCard = React.memo(({ member, onSelect }: { member: Member; onSelect: (member: Member) => void }) => {
  const memberColor = getMemberColor(member.id)
  const formattedId = member.id < 10 ? `0${member.id}` : `${member.id}`

  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className="spotlight-card group relative aspect-[3/4] w-full rounded-xl overflow-hidden text-left bg-zinc-100 dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
      aria-label={`View quick profile for S${member.id} ${member.name}`}
    >
      {/* 4px side-band in official MODHAUS member color */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 z-20 transition-all duration-300 group-hover:w-2"
        style={{ backgroundColor: memberColor }}
        aria-hidden="true"
      />

      {/* Main portrait image */}
      <Image
        src={`https://i.imgur.com/${member.image}`}
        alt={`${member.name} (${member.birthName || member.name}) portrait`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 17vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* SIGNAL highlight GIF preview on hover */}
      <img
        src={`https://i.giphy.com/media/v1.${member.gif}`}
        alt=""
        loading="lazy"
        className="absolute inset-0 object-cover w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />

      {/* Editorial bottom gradient scrim */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Bottom text overlay: S-number + Member Name */}
      <div className="absolute inset-x-0 bottom-0 pl-3.5 pr-2.5 pb-2.5 sm:pl-4 sm:pr-3 sm:pb-3 z-10 flex flex-col justify-end pointer-events-none">
        <span
          className="text-[11px] font-mono font-bold tracking-wider mb-0.5"
          style={{ color: memberColor === "#FFFFFF" ? "#F4F4F6" : memberColor }}
        >
          S{formattedId}
        </span>
        <h3 className="text-white font-bold text-sm sm:text-base flex items-baseline gap-1.5 font-display truncate">
          <span>{member.name}</span>
          {member.hangul && (
            <span className="text-[11px] text-zinc-300 font-mono font-normal">
              {member.hangul}
            </span>
          )}
        </h3>
      </div>
    </button>
  )
})

MemberCard.displayName = "MemberCard"

export default function MemberGrid() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const allMembers = getAllMembers()

  const handleClose = useCallback(() => {
    setSelectedMember(null)
  }, [])

  const currentIndex = selectedMember ? allMembers.findIndex((m) => m.id === selectedMember.id) : -1
  const prevMember = currentIndex > 0 ? allMembers[currentIndex - 1] : allMembers[allMembers.length - 1]
  const nextMember = currentIndex >= 0 && currentIndex < allMembers.length - 1 ? allMembers[currentIndex + 1] : allMembers[0]
  const selectedMemberColor = selectedMember ? getMemberColor(selectedMember.id) : "#FFFFFF"

  // Close modal on Escape, navigate with ArrowLeft/ArrowRight
  useEffect(() => {
    if (!selectedMember) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      } else if (e.key === "ArrowLeft") {
        const idx = allMembers.findIndex((m) => m.id === selectedMember.id)
        const prev = idx > 0 ? allMembers[idx - 1] : allMembers[allMembers.length - 1]
        setSelectedMember(prev)
      } else if (e.key === "ArrowRight") {
        const idx = allMembers.findIndex((m) => m.id === selectedMember.id)
        const next = idx >= 0 && idx < allMembers.length - 1 ? allMembers[idx + 1] : allMembers[0]
        setSelectedMember(next)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedMember, handleClose, allMembers])

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {allMembers.map((member) => (
          <MemberCard key={member.id} member={member} onSelect={setSelectedMember} />
        ))}
      </div>

      {/* Member Modal — Authentic Vertical First Class Objekt Photocard Inspect */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="objekt-card-title"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-colors shadow-lg"
              aria-label="Close card inspect"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Previous Member Button (Desktop) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedMember(prevMember)
              }}
              className="hidden sm:flex absolute left-4 lg:left-12 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 transition-colors shadow-lg"
              aria-label={`Previous member: S${prevMember.id} ${prevMember.name}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Next Member Button (Desktop) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedMember(nextMember)
              }}
              className="hidden sm:flex absolute right-4 lg:right-12 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 transition-colors shadow-lg"
              aria-label={`Next member: S${nextMember.id} ${nextMember.name}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Vertical Objekt Photocard */}
            <motion.div
              initial={{ scale: 0.92, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 16, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="relative w-full max-w-[330px] xs:max-w-[360px] sm:max-w-[390px] aspect-[1/1.5] max-h-[85vh] rounded-2xl overflow-hidden bg-zinc-950 border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.9)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Member Color Top Foil Line */}
              <div
                className="absolute top-0 inset-x-0 h-1 z-30 shadow-sm"
                style={{ backgroundColor: selectedMemberColor }}
                aria-hidden="true"
              />

              {/* Full Portrait Photo */}
              <Image
                src={`https://i.imgur.com/${selectedMember.image}`}
                alt={`${selectedMember.name} (${selectedMember.birthName || selectedMember.name}) photocard portrait`}
                fill
                sizes="(max-width: 640px) 360px, 400px"
                className="object-cover object-top"
                priority
              />

              {/* Top Header Plate */}
              <div className="absolute top-0 inset-x-0 p-4 sm:p-5 z-20 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono tracking-widest text-white/90 font-bold uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                    tripleS
                  </span>
                  <span className="text-[10px] font-mono text-white/60 tracking-wider">
                    {"// OBJEKT"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: selectedMemberColor }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-xs font-mono font-bold tracking-tight"
                    style={{ color: selectedMemberColor === "#FFFFFF" ? "#F4F4F6" : selectedMemberColor }}
                  >
                    S{selectedMember.id < 10 ? `0${selectedMember.id}` : selectedMember.id}
                  </span>
                </div>
              </div>

              {/* Bottom Metadata Plaque */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col justify-end">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h2
                    id="objekt-card-title"
                    className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight"
                  >
                    {selectedMember.name}
                  </h2>
                  {selectedMember.hangul && (
                    <span className="text-sm font-mono text-zinc-300">
                      {selectedMember.hangul}
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-zinc-300 flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-2">
                  <span>{selectedMember.birthName}</span>
                  {selectedMember.birthNameHangul && (
                    <span className="text-zinc-400">({selectedMember.birthNameHangul})</span>
                  )}
                  <span className="text-zinc-500">&bull;</span>
                  <span>{selectedMember.mbti}</span>
                </div>

                <p className="text-xs text-zinc-300 font-sans mb-2 truncate">
                  {selectedMember.role}
                  {selectedMember.revealDate && (
                    <span className="text-zinc-400 font-mono text-[11px] ml-1.5">
                      · Revealed {selectedMember.revealDate}
                    </span>
                  )}
                </p>

                {selectedMember.subUnits && selectedMember.subUnits.length > 0 && (
                  <div className="text-[11px] font-mono text-zinc-400 truncate mb-4">
                    <span className="text-zinc-500 mr-1.5">Units:</span>
                    {selectedMember.subUnits.join(" · ")}
                  </div>
                )}

                <Link
                  href={`/members/${selectedMember.slug}`}
                  className="btn-magnetic group/btn w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white/95 border border-white/20 hover:border-white/40 backdrop-blur-md py-2.5 rounded-xl text-xs font-mono font-medium tracking-wide transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                >
                  <span>View Full Profile</span>
                  <ArrowUpRight className="btn-arrow h-3.5 w-3.5 text-white/70 group-hover/btn:text-white transition-colors" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}