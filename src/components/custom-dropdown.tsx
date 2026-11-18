"use client";

import type { CSSProperties } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useListboxA11y } from "@/lib/a11y";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  subLabel?: string;
}

interface CustomDropdownProps<T extends string = string> {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  align?: "left" | "right" | "auto";
  className?: string;
}

export default function CustomDropdown<T extends string = string>({
  label,
  value,
  options,
  onChange,
  align = "auto",
  className = "",
}: CustomDropdownProps<T>) {
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

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

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
            {label}
          </span>
          <span className="h-3.5 w-px bg-zinc-300 dark:bg-zinc-700 shrink-0" />
          <span className="text-zinc-500 dark:text-zinc-400 truncate">
            {selectedOption?.label || value}
          </span>
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
        aria-label={label}
        popover="auto"
        data-align={menuAlign}
        data-open={isOpen ? "true" : "false"}
        data-lenis-prevent
        onKeyDown={handleMenuKeyDown}
        style={{ positionAnchor: anchorName, ...fallbackStyle } as CSSProperties}
        className="dropdown-popover dropdown-scroll-hints min-w-50 max-w-[calc(100vw-2rem)] max-h-80 overflow-y-auto overscroll-contain bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-1.5 backdrop-blur-xl text-left"
      >
        <div className="space-y-0.5">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  closeAndFocusTrigger();
                }}
                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-colors ${
                  isSelected
                    ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white font-medium"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                  <span className="text-xs sm:text-sm font-sans font-semibold tracking-tight text-zinc-900 dark:text-white truncate">
                    {option.label}
                  </span>
                  {option.subLabel && (
                    <span className="text-[0.6875rem] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                      {option.subLabel}
                    </span>
                  )}
                </div>

                {/* Active Accent Dot (Carbon/Voltage Dual Theme) */}
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-zinc-950 dark:bg-[#D4FF00] shrink-0 shadow-xs" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
