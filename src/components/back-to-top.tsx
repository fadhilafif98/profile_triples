"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useSafeReducedMotion } from "@/lib/a11y";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const isPast = !entry.isIntersecting;
        setIsVisible((prev) => (prev !== isPast ? isPast : prev));
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-60 w-px opacity-0"
      />
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 16 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 16 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group flex items-center justify-center w-11 h-11 rounded-full bg-white/90 dark:bg-[#0D0D12]/90 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-[0_8px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:border-zinc-400 dark:hover:border-zinc-700 transition-[border-color,color,transform] hover:scale-110 active:scale-95 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white select-none cursor-pointer"
            >
              <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
