"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Check } from "lucide-react";
import TriplesLogo from "./triples-logo";

interface SeasonDropdownProps {
  selectedSeason: string;
  seasons: string[];
  onSelectSeason: (season: string) => void;
  align?: "left" | "right" | "auto";
  className?: string;
}

export default function SeasonDropdown({
  selectedSeason,
  seasons,
  onSelectSeason,
  align = "auto",
  className = "",
}: SeasonDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuAlign, setMenuAlign] = useState<"left" | "right">("left");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-detect viewport boundary to prevent right-edge screen overflow
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      if (align !== "auto") {
        setMenuAlign(align);
      } else {
        const rect = dropdownRef.current.getBoundingClientRect();
        if (rect.left + 210 > window.innerWidth || rect.left > window.innerWidth / 2) {
          setMenuAlign("right");
        } else {
          setMenuAlign("left");
        }
      }
    }
  }, [isOpen, align]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const isFiltered = selectedSeason !== "All";

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* ── Trigger Button matching Screenshot ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3 sm:px-3.5 py-2.5 rounded-2xl border transition-all text-xs font-mono select-none ${
          isOpen
            ? "bg-white dark:bg-[#151518] border-purple-500/80 shadow-[0_0_12px_rgba(139,92,246,0.25)] text-zinc-900 dark:text-white"
            : "bg-white dark:bg-[#121214] border-zinc-200 dark:border-zinc-800/90 text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-bold text-zinc-900 dark:text-white shrink-0">
            Season
          </span>
          <span className="h-3.5 w-[1px] bg-zinc-300 dark:bg-zinc-700 shrink-0" />
          <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate">
            {selectedSeason === "All" ? "All Seasons" : selectedSeason}
          </span>
          {isFiltered && (
            <span className="px-1.5 py-0.5 rounded-full bg-purple-600 dark:bg-[#8B5CF6] text-white text-[10px] font-bold font-mono shadow-[0_0_6px_rgba(139,92,246,0.6)]">
              1
            </span>
          )}
        </div>

        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5 text-zinc-400 shrink-0 transition-transform" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0 transition-transform" />
        )}
      </button>

      {/* ── Popover Dropdown Menu (Auto Left/Right Align) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={`absolute top-full mt-2 min-w-[200px] max-w-[calc(100vw-2rem)] max-h-[340px] overflow-y-auto z-40 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2.5 backdrop-blur-xl no-scrollbar ${
              menuAlign === "right" ? "right-0 left-auto" : "left-0 right-auto"
            }`}
          >
            {/* TRIPLES Brand Header */}
            <div className="flex items-center gap-2 px-2 py-2 mb-1 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="w-4 h-4 text-zinc-800 dark:text-white shrink-0">
                <TriplesLogo
                  width={16}
                  height={16}
                  strokeColor="currentColor"
                  strokeWidth={180}
                />
              </div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                TRIPLES
              </span>
            </div>

            {/* Seasons List with Radio Checkbox */}
            <div className="space-y-1 mt-1">
              {seasons.map((season) => {
                const isSelected = selectedSeason === season;
                return (
                  <button
                    key={season}
                    type="button"
                    onClick={() => {
                      onSelectSeason(season);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-colors group ${
                      isSelected
                        ? "bg-zinc-100 dark:bg-zinc-800/70 text-zinc-900 dark:text-white font-medium"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {/* Circular Radio Icon */}
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-purple-600 dark:bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-[0_0_8px_rgba(139,92,246,0.6)]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-700 bg-transparent shrink-0 group-hover:border-zinc-400 dark:group-hover:border-zinc-500 transition-colors" />
                    )}

                    {/* Season Label */}
                    <span className="text-sm font-pretendard tracking-tight text-zinc-900 dark:text-zinc-100">
                      {season === "All" ? "All Seasons" : season}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
