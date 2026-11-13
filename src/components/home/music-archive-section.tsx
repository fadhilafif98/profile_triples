"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Album } from "@/types/album";

interface MusicArchiveSectionProps {
  albums: Album[];
}

export function MusicArchiveSection({ albums }: MusicArchiveSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const crateRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef({
    down: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  useEffect(() => {
    const container = crateRef.current;
    const item = itemRefs.current[activeIndex];
    if (!container || !item) return;

    const targetLeft =
      item.offsetLeft - container.clientWidth / 2 + item.clientWidth / 2;
    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
    const clampedLeft = Math.max(0, Math.min(targetLeft, maxScroll));

    if (Math.abs(container.scrollLeft - clampedLeft) < 2) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    container.scrollTo({
      left: clampedLeft,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [activeIndex]);

  if (!albums || albums.length === 0) return null;

  const activeAlbum = albums[activeIndex] ?? albums[0];

  const stepAlbum = (delta: number) => {
    setActiveIndex((prev) => (prev + delta + albums.length) % albums.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepAlbum(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      stepAlbum(1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.pointerType === "touch") return;
    const el = crateRef.current;
    if (!el) return;

    drag.current = {
      down: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.down) return;
    const el = crateRef.current;
    if (!el) return;

    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 5) {
      drag.current.moved = true;
    }
    if (drag.current.moved) {
      el.scrollLeft = drag.current.scrollLeft - delta;
    }
  };

  const endDrag = () => {
    drag.current.down = false;
    if (drag.current.moved) {
      window.setTimeout(() => {
        drag.current.moved = false;
      }, 0);
    }
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <section
      id="music-archive"
      aria-labelledby="music-archive-heading"
      onKeyDown={handleKeyDown}
      className="relative flex flex-col justify-between lg:min-h-[calc(100dvh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 gap-6 lg:gap-8 overflow-x-clip"
    >
      {/* Top Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2
            id="music-archive-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05]"
          >
            Music{" "}
            <span className="font-accent text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
              Archive
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
            Every unit and full-group release pressed on physical sleeve and digital stream.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <span
            aria-live="polite"
            className="font-mono text-xs tabular-nums tracking-[0.14em] text-zinc-500 dark:text-zinc-400 mr-1"
          >
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(albums.length).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => stepAlbum(-1)}
              aria-label="Previous release"
              className="w-9 h-9 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0D0D12] text-zinc-950 dark:text-white hover:border-zinc-950 dark:hover:border-[#D4FF00] transition-[border-color,color] duration-200 inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] motion-reduce:transition-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => stepAlbum(1)}
              aria-label="Next release"
              className="w-9 h-9 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0D0D12] text-zinc-950 dark:text-white hover:border-zinc-950 dark:hover:border-[#D4FF00] transition-[border-color,color] duration-200 inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] motion-reduce:transition-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/albums"
            className="nav-draw-link inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-zinc-950 dark:text-zinc-200 pb-0.5 ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
          >
            All {albums.length} Releases
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Middle Row: Interactive Vinyl Sleeve Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-2">
        {/* Left: Unboxed Sliding Vinyl Sleeve */}
        <div className="lg:col-span-5 flex items-center justify-center py-2">
          <div className="relative w-full max-w-[230px] sm:max-w-[270px] lg:max-w-[300px] mr-12 sm:mr-16 group">
            {/* Ambient artwork blur */}
            <div
              className="pointer-events-none absolute -inset-6 rounded-full opacity-35 dark:opacity-30 blur-2xl overflow-hidden"
              aria-hidden="true"
            >
              <Image
                src={activeAlbum.cover}
                alt=""
                fill
                sizes="320px"
                className="object-cover scale-125"
              />
            </div>

            {/* Protruding Vinyl Disc */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[4%] right-0 w-[92%] h-[92%] translate-x-[36%] group-hover:translate-x-[42%] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
            >
              <div
                className="relative w-full h-full rounded-full shadow-[0_20px_40px_-14px_rgba(9,9,11,0.55)] flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle, #18181B 0%, #09090B 68%, #141418 100%)",
                }}
              >
                <div className="absolute inset-[12%] rounded-full border border-white/[0.06]" />
                <div className="absolute inset-[22%] rounded-full border border-white/[0.04]" />
                <div className="relative w-[34%] h-[34%] rounded-full overflow-hidden ring-2 ring-black/70">
                  <Image
                    src={activeAlbum.cover}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-[#09090B] ring-1 ring-white/25" />
                </div>
              </div>
            </div>

            {/* Square Album Jacket Sleeve (Shadow Only — Single Elevation) */}
            <div className="relative z-10 aspect-square w-full rounded-xl overflow-hidden shadow-[0_24px_48px_-18px_rgba(9,9,11,0.45)] dark:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.85)] bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={activeAlbum.cover}
                alt={`${activeAlbum.title} album cover`}
                fill
                sizes="(max-width: 1024px) 270px, 300px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Active Release Details */}
        <div className="lg:col-span-7 flex flex-col items-start gap-4 lg:gap-5">
          <h3 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.06]">
            {activeAlbum.title}
          </h3>

          <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="text-zinc-950 dark:text-zinc-200 font-medium">
              {activeAlbum.unit}
            </span>
            <span aria-hidden="true">/</span>
            <span>{activeAlbum.type}</span>
            <span aria-hidden="true">/</span>
            <span className="tabular-nums">{activeAlbum.releaseDate}</span>
          </p>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed line-clamp-2">
            {activeAlbum.description}
          </p>

          <div className="flex flex-wrap items-center gap-5 pt-1">
            <Link
              href={`/albums#${activeAlbum.id}`}
              className="btn-primary btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.15em]"
            >
              Inspect Release
              <ArrowUpRight className="btn-arrow w-3.5 h-3.5" />
            </Link>

            {activeAlbum.spotifyLink && (
              <a
                href={activeAlbum.spotifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-draw-link inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-zinc-950 dark:text-zinc-200 pb-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
              >
                Stream on Spotify
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Horizontal Draggable Record Crate */}
      <div className="w-full">
        <div
          ref={crateRef}
          role="listbox"
          aria-label="Discography record crate"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={handleClickCapture}
          className="flex items-start gap-3 overflow-x-auto no-scrollbar py-2 px-1 cursor-grab active:cursor-grabbing select-none"
        >
          {albums.map((album, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={album.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                type="button"
                role="option"
                aria-selected={isActive}
                aria-label={`${String(idx + 1).padStart(2, "0")}. ${album.title}`}
                draggable={false}
                onClick={() => setActiveIndex(idx)}
                className="w-16 sm:w-20 shrink-0 group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] rounded-lg"
              >
                <div
                  className={`relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
                    isActive
                      ? "ring-2 ring-zinc-950 dark:ring-[#D4FF00] ring-offset-2 ring-offset-[#FAFAFA] dark:ring-offset-[#08080A] -translate-y-1 opacity-100"
                      : "opacity-60 group-hover:opacity-100"
                  }`}
                >
                  <Image
                    src={album.cover}
                    alt=""
                    fill
                    sizes="80px"
                    draggable={false}
                    className="object-cover pointer-events-none"
                  />
                </div>
                <div className="mt-1.5 flex items-center gap-1 font-mono text-[10px] tabular-nums leading-none">
                  <span
                    className={
                      isActive
                        ? "text-zinc-950 dark:text-[#D4FF00] font-semibold"
                        : "text-zinc-400 dark:text-zinc-500"
                    }
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`truncate ${
                      isActive
                        ? "text-zinc-950 dark:text-white font-medium"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {album.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MusicArchiveSection;
