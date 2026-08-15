"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 240) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group flex items-center justify-center w-11 h-11 rounded-full bg-white/90 dark:bg-[#121214]/90 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-[0_8px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:border-zinc-400 dark:hover:border-zinc-700 transition-all hover:scale-110 active:scale-95 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white select-none cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 stroke-[2.5]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
