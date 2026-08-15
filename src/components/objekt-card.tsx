"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { Objekt, ObjektSide } from "@/types/objekt";
import ObjektImage from "./objekt-image";

interface ObjektCardProps {
  objekt: Objekt;
  onSelect?: (objekt: Objekt) => void;
  priority?: boolean;
}

/**
 * Clean edge-to-edge photocard Objekt design matching the official COSMO scan aesthetic.
 */
export default function ObjektCard({ objekt, onSelect, priority = false }: ObjektCardProps) {
  const [side, setSide] = useState<ObjektSide>("front");
  const [hasFlipped, setHasFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasFlipped(true);
    setIsFlipping(true);
    setSide((prev) => (prev === "front" ? "back" : "front"));
    setTimeout(() => setIsFlipping(false), 300);
  };

  return (
    <div
      onClick={() => onSelect && onSelect(objekt)}
      className="group relative aspect-[1/1.55] w-full rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-[#0e0e11] shadow-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer border border-zinc-200/80 dark:border-white/10 select-none"
    >
      {/* ── 3D Flip Card Container ── */}
      <motion.div
        animate={{ rotateY: side === "front" ? 0 : 180 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <ObjektImage
            season={objekt.season}
            member={objekt.member}
            slug={objekt.slug}
            side="front"
            fallbackSrc={objekt.frontImage || objekt.thumbnailImage}
            priority={priority}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Back Side (Lazy loaded on flip) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {hasFlipped || side === "back" ? (
            <ObjektImage
              season={objekt.season}
              member={objekt.member}
              slug={objekt.slug}
              side="back"
              fallbackSrc={objekt.backImage}
              priority={priority}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900" />
          )}
        </div>
      </motion.div>

      {/* ── Flip Button Overlay (Visible on Hover) ── */}
      <button
        type="button"
        onClick={handleFlip}
        aria-label="Flip Objekt"
        className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-20"
      >
        <RotateCw className={`h-3 sm:h-3.5 w-3 sm:w-3.5 transition-transform ${isFlipping ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
