"use client";

import type { CSSProperties } from "react";
import { ChevronUp, ChevronDown, Check } from "lucide-react";
import TriplesLogo from "./triples-logo";
import { useListboxA11y } from "@/lib/a11y";

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
  const {
    isOpen,
    menuAlign,
    anchorName,
    fallbackStyle,
    dropdownRef,
    triggerRef,
    menuRef,
    listboxId,
    handleTriggerClick,
    handleTriggerKeyDown,
    handleMenuKeyDown,
    closeAndFocusTrigger,
  } = useListboxA11y(align);

  const isFiltered = selectedSeason !== "All";

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* ── Trigger Button ── */}
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={listboxId}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        style={{ anchorName } as CSSProperties}
        className={`w-full flex items-center justify-between gap-2 px-3 sm:px-3.5 py-2.5 rounded-2xl border transition-[background-color,border-color,color,box-shadow] text-xs font-mono select-none ${
          isOpen
            ? "bg-white dark:bg-[#151518] border-zinc-950 dark:border-[#D4FF00] shadow-sm text-zinc-900 dark:text-white"
            : "bg-white dark:bg-[#0D0D12] border-zinc-200 dark:border-zinc-800/90 text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-bold text-zinc-900 dark:text-white shrink-0">
            Season
          </span>
          <span className="h-3.5 w-px bg-zinc-300 dark:bg-zinc-700 shrink-0" />
          <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate">
            {selectedSeason === "All" ? "All Seasons" : selectedSeason}
          </span>
          {isFiltered && (
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-950 text-white dark:bg-[#D4FF00] dark:text-black text-[0.625rem] font-bold font-mono shadow-xs">
              1
            </span>
          )}
        </div>

        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5 text-zinc-400 shrink-0 transition-transform" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0 transition-transform" aria-hidden="true" />
        )}
      </button>

      {/* ── Top-Layer Popover Menu (CSS Anchor Positioning + JS Fallback + Scroll Shadows) ── */}
      <div
        ref={menuRef}
        id={listboxId}
        role="listbox"
        aria-label="Season"
        popover="auto"
        data-align={menuAlign}
        data-open={isOpen ? "true" : "false"}
        data-lenis-prevent
        onKeyDown={handleMenuKeyDown}
        style={{ positionAnchor: anchorName, ...fallbackStyle } as CSSProperties}
        className="dropdown-popover dropdown-scroll-hints min-w-50 max-w-[calc(100vw-2rem)] max-h-85 overflow-y-auto overscroll-contain bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2.5 backdrop-blur-xl text-left"
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
          <span className="text-[0.6875rem] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
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
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelectSeason(season);
                  closeAndFocusTrigger();
                }}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-colors group ${
                  isSelected
                    ? "bg-zinc-100 dark:bg-zinc-800/70 text-zinc-900 dark:text-white font-medium"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {/* Circular Radio Icon */}
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-zinc-950 text-white dark:bg-[#D4FF00] dark:text-black flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-3" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-700 bg-transparent shrink-0 group-hover:border-zinc-400 dark:group-hover:border-zinc-500 transition-colors" />
                )}

                {/* Season Label */}
                <span className="text-sm font-sans font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                  {season === "All" ? "All Seasons" : season}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
