"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import WavWordmark from "@/components/wav-wordmark";
import { OFFICIAL_MEMBER_COLORS, getMemberImageUrl } from "@/lib/members";
import type { Member } from "@/types/member";

interface HowItWorksSectionProps {
  members: Member[];
}

interface StepItem {
  number: string;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "Collect Objekts",
    description: "Digital and physical photocards that generate COMO voting tokens.",
  },
  {
    number: "02",
    title: "Vote in Gravity",
    description: "Use COMO on COSMO to vote on lineups, title tracks, and concepts.",
  },
  {
    number: "03",
    title: "Form Dimensions",
    description: "Winning fan votes assemble the 24 members into new seasonal sub-units.",
  },
];

function isLightHex(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 165;
}

export default function HowItWorksSection({ members }: HowItWorksSectionProps) {
  const orderedMembers = useMemo(
    () => [...members].sort((a, b) => a.id - b.id),
    [members]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const dragMovedRef = useRef(false);

  const totalMembers = orderedMembers.length;
  const safeActiveIndex = totalMembers > 0 ? Math.min(activeIndex, totalMembers - 1) : 0;
  const activeMember = orderedMembers[safeActiveIndex];

  const stepMember = useCallback(
    (delta: number) => {
      if (totalMembers === 0) return;
      setActiveIndex((prev) => (prev + delta + totalMembers) % totalMembers);
    },
    [totalMembers]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepMember(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepMember(1);
      }
    },
    [stepMember]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const isLg = window.innerWidth >= 1024;
    const collapsedW = isLg ? 56 : 52;
    const expandedW = isLg ? 325 : 290;
    const gap = 8;
    const cardCenter = safeActiveIndex * (collapsedW + gap) + expandedW / 2;
    const targetLeft = Math.max(0, cardCenter - track.clientWidth / 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: targetLeft, behavior: reduced ? "auto" : "smooth" });
  }, [safeActiveIndex]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    dragStartXRef.current = e.pageX;
    dragScrollLeftRef.current = track.scrollLeft;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.pageX - dragStartXRef.current;
    if (Math.abs(dx) > 6) {
      dragMovedRef.current = true;
    }
    track.scrollLeft = dragScrollLeftRef.current - dx;
  }, []);

  const handleMouseUpOrLeave = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  if (!activeMember) return null;

  return (
    <section
      id="how-it-works"
      aria-labelledby="lookbook-heading"
      className="relative py-16 sm:py-20 lg:py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-200 dark:border-white/10 lg:min-h-[calc(100dvh-4rem)] flex items-center overflow-x-clip"
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column (5 Cols): Quiet Typographic Narrative */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <h2
              id="lookbook-heading"
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.04]"
            >
              You decide what tripleS does{" "}
              <span className="font-accent font-normal text-4xl sm:text-5xl lg:text-[3.5rem] text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                next.
              </span>
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[44ch]">
              Every Dimension begins on
              <WavWordmark
                alt="COSMO"
                className="h-[0.82em] mx-1.5 text-zinc-950 dark:text-[#D4FF00] align-baseline"
              />
              in three steps.
            </p>
          </div>

          <ol className="divide-y divide-zinc-200 dark:divide-white/10 border-y border-zinc-200 dark:border-white/10">
            {STEPS.map((step) => (
              <li key={step.number} className="py-4 flex items-baseline gap-4">
                <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500 shrink-0 tabular-nums">
                  {step.number}
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-display font-bold tracking-tight text-zinc-950 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/members" className="btn-primary btn-magnetic">
              <span>Explore 24 Members</span>
              <ArrowUpRight className="w-4 h-4 btn-arrow" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              className="nav-draw-link font-mono text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-[#D4FF00] transition-colors duration-200"
            >
              How COSMO works
            </Link>
          </div>
        </div>

        {/* Right Column (7 Cols): Unified 24-Member Horizontal Filmstrip Track */}
        <div className="lg:col-span-7 flex flex-col gap-3 min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
            <span className="hidden sm:inline">
              Click any card to expand &middot; Drag horizontally to browse
            </span>
            <span className="sm:hidden">
              Swipe horizontally to browse all {totalMembers} members
            </span>
          </p>

          {/* Desktop & Tablet Unified 24-Member Scrollable Accordion Track */}
          <div
            ref={trackRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onKeyDown={handleKeyDown}
            role="region"
            aria-label="tripleS S01 through S24 portrait filmstrip"
            className="hidden sm:flex h-[460px] lg:h-[510px] w-full gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none cursor-grab active:cursor-grabbing"
          >
            {orderedMembers.map((member, idx) => {
              const isExpanded = idx === safeActiveIndex;
              const memberHex = OFFICIAL_MEMBER_COLORS[member.id] ?? "#18181B";
              const lightBand = isLightHex(memberHex);
              const sCode = `S${String(member.id).padStart(2, "0")}`;

              if (!isExpanded) {
                return (
                  <article
                    key={member.id}
                    className="group relative shrink-0 w-[52px] lg:w-[56px] hover:w-[62px] h-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-900 transition-[width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
                  >
                    <Image
                      src={getMemberImageUrl(member)}
                      alt={`${sCode} ${member.name}`}
                      fill
                      draggable={false}
                      sizes="320px"
                      className="object-cover object-top origin-top scale-[1.05]"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        if (dragMovedRef.current) {
                          e.preventDefault();
                          return;
                        }
                        setActiveIndex(idx);
                      }}
                      aria-label={`Select ${sCode} ${member.name}`}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-between py-4 px-1 bg-gradient-to-t from-black/80 via-black/15 to-black/30 group-hover:via-black/5 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D4FF00]"
                    >
                      <span className="font-mono text-[10px] font-bold tracking-wider text-white/90">
                        {sCode}
                      </span>
                      <span
                        style={{ writingMode: "vertical-rl" }}
                        className="rotate-180 font-display text-xs font-bold tracking-tight text-white whitespace-nowrap"
                      >
                        {member.name}
                      </span>
                    </button>
                  </article>
                );
              }

              return (
                <article
                  key={member.id}
                  className="group relative shrink-0 w-[290px] lg:w-[325px] h-full overflow-hidden rounded-2xl bg-zinc-900 shadow-xl transition-[width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
                >
                  <Link
                    href={`/members/${member.slug}`}
                    draggable={false}
                    onClick={(e) => {
                      if (dragMovedRef.current) {
                        e.preventDefault();
                      }
                    }}
                    aria-label={`View ${sCode} ${member.name} profile`}
                    className="block relative w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D4FF00]"
                  >
                    <Image
                      src={getMemberImageUrl(member)}
                      alt={`${sCode} ${member.name} First Class Objekt portrait`}
                      fill
                      draggable={false}
                      sizes="320px"
                      className="object-cover object-top origin-top scale-[1.05] group-hover:scale-[1.07] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
                    />

                    {/* Subtle Bottom 26% Scrim — Face & Upper Portrait Stay Clear */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] z-10 bg-gradient-to-t from-black/90 via-black/45 to-transparent"
                    />

                    {/* Official MODHAUS COSMO Vertical Sideband */}
                    <div
                      aria-hidden="true"
                      style={{ backgroundColor: memberHex }}
                      className={`pointer-events-none absolute top-0 right-0 bottom-0 z-20 w-[26px] flex flex-col items-center justify-between py-4 px-0.5 select-none ${
                        lightBand ? "text-zinc-950" : "text-white"
                      }`}
                    >
                      <span className="font-mono text-[9px] font-bold tracking-tight">
                        {sCode}
                      </span>
                      <span
                        style={{ writingMode: "vertical-rl" }}
                        className="rotate-180 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] truncate max-h-[160px]"
                      >
                        {member.name}
                      </span>
                      <span
                        style={{ writingMode: "vertical-rl" }}
                        className="rotate-180 font-mono text-[7px] uppercase tracking-[0.2em] opacity-80"
                      >
                        COSMO
                      </span>
                    </div>

                    {/* Clean Identity Only: Stage Name + Single-Line Hangul */}
                    <div className="absolute inset-x-0 bottom-0 z-20 p-5 pr-10 flex items-baseline gap-2.5">
                      <h3 className="text-xl lg:text-2xl font-display font-black tracking-tight text-white leading-none whitespace-nowrap">
                        {member.name}
                      </h3>
                      {member.hangul ? (
                        <span className="text-sm font-medium text-white/80 shrink-0 whitespace-nowrap">
                          {member.hangul}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {/* Mobile Native Horizontal Scroll-Snap 24-Member Carousel */}
          <div
            role="region"
            aria-label="tripleS S01 through S24 mobile portrait gallery"
            className="sm:hidden flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain gap-3.5 -mx-4 px-4 pb-2 no-scrollbar"
          >
            {orderedMembers.map((member) => {
              const sCode = `S${String(member.id).padStart(2, "0")}`;
              const memberHex = OFFICIAL_MEMBER_COLORS[member.id] ?? "#18181B";
              const lightBand = isLightHex(memberHex);

              return (
                <Link
                  key={member.id}
                  href={`/members/${member.slug}`}
                  aria-label={`View ${sCode} ${member.name} profile`}
                  className="group relative block w-[76vw] max-w-[280px] aspect-[3/4] snap-center shrink-0 rounded-2xl overflow-hidden bg-zinc-900 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
                >
                  <Image
                    src={getMemberImageUrl(member)}
                    alt={`${sCode} ${member.name} First Class Objekt portrait`}
                    fill
                    sizes="320px"
                    className="object-cover object-top origin-top scale-[1.05]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] z-10 bg-gradient-to-t from-black/95 via-black/55 to-transparent"
                  />
                  <div
                    aria-hidden="true"
                    style={{ backgroundColor: memberHex }}
                    className={`pointer-events-none absolute top-0 right-0 bottom-0 z-20 w-[24px] flex flex-col items-center justify-between py-3.5 px-0.5 select-none ${
                      lightBand ? "text-zinc-950" : "text-white"
                    }`}
                  >
                    <span className="font-mono text-[9px] font-bold tracking-tight">
                      {sCode}
                    </span>
                    <span
                      style={{ writingMode: "vertical-rl" }}
                      className="rotate-180 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] truncate max-h-[140px]"
                    >
                      {member.name}
                    </span>
                    <span
                      style={{ writingMode: "vertical-rl" }}
                      className="rotate-180 font-mono text-[7px] uppercase tracking-[0.2em] opacity-80"
                    >
                      COSMO
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-20 p-4 pr-9 space-y-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#D4FF00] shrink-0">
                        {sCode}
                      </span>
                      <h3 className="text-lg font-display font-black tracking-tight text-white leading-none truncate">
                        {member.name}
                      </h3>
                      {member.hangul ? (
                        <span className="text-xs font-medium text-white/75 shrink-0 whitespace-nowrap">
                          {member.hangul}
                        </span>
                      ) : null}
                    </div>
                    {member.role ? (
                      <p className="text-[11px] font-mono text-zinc-300 truncate">
                        {member.role}
                      </p>
                    ) : null}
                    <span className="inline-flex items-center gap-1 pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/90">
                      View Profile
                      <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
