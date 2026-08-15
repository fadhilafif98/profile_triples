"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [menuAlign, setMenuAlign] = useState<"left" | "right">("left");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Auto-detect viewport boundary to prevent right-edge screen overflow
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      if (align !== "auto") {
        setMenuAlign(align);
      } else {
        const rect = dropdownRef.current.getBoundingClientRect();
        // If trigger is in the right half of the screen or near the edge, anchor menu to the right
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

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3 sm:px-3.5 py-2.5 rounded-2xl border transition-all text-xs font-mono select-none ${
          isOpen
            ? "bg-white dark:bg-[#151518] border-zinc-400 dark:border-zinc-600 shadow-md text-zinc-900 dark:text-white"
            : "bg-white dark:bg-[#121214] border-zinc-200 dark:border-zinc-800/90 text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-bold text-zinc-900 dark:text-white shrink-0">
            {label}
          </span>
          <span className="h-3.5 w-[1px] bg-zinc-300 dark:bg-zinc-700 shrink-0" />
          <span className="text-zinc-500 dark:text-zinc-400 truncate">
            {selectedOption?.label || value}
          </span>
        </div>

        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5 text-zinc-400 shrink-0 transition-transform" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0 transition-transform" />
        )}
      </button>

      {/* ── Dropdown Popover Menu (Auto Left/Right Align) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={`absolute top-full mt-2 min-w-[200px] max-w-[calc(100vw-2rem)] max-h-[320px] overflow-y-auto z-40 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-1.5 backdrop-blur-xl no-scrollbar ${
              menuAlign === "right" ? "right-0 left-auto" : "left-0 right-auto"
            }`}
          >
            <div className="space-y-0.5">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-colors ${
                      isSelected
                        ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white font-medium"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                      <span className="text-xs sm:text-sm font-pretendard font-semibold tracking-tight text-zinc-900 dark:text-white truncate">
                        {option.label}
                      </span>
                      {option.subLabel && (
                        <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                          {option.subLabel}
                        </span>
                      )}
                    </div>

                    {/* Active Accent Dot (Purple/Theme) */}
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-purple-600 dark:bg-[#8B5CF6] shrink-0 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                    )}
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
