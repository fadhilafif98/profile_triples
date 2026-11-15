"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { RotateCw } from "lucide-react";
import { Objekt, ObjektSide } from "@/types/objekt";
import { getObjektCollectionSuffix } from "@/lib/objekts";
import ObjektImage from "./objekt-image";

interface ObjektCardProps {
  objekt: Objekt;
  variants?: Objekt[];
  onSelect?: (objekt: Objekt, variants?: Objekt[]) => void;
  priority?: boolean;
}

/**
 * Clean edge-to-edge photocard Objekt design matching the official COSMO scan aesthetic.
 */
export default function ObjektCard({
  objekt,
  variants,
  onSelect,
  priority = false,
}: ObjektCardProps) {
  const [side, setSide] = useState<ObjektSide>("front");
  const [hasFlipped, setHasFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const hasMultipleVariants = Boolean(variants && variants.length > 1);
  const activeObjekt =
    (hasMultipleVariants && selectedVariantId
      ? variants?.find((variant) => variant.id === selectedVariantId)
      : undefined) ?? objekt;

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasFlipped(true);
    setIsFlipping(true);
    setSide((prev) => (prev === "front" ? "back" : "front"));
    setTimeout(() => setIsFlipping(false), 300);
  };

  return (
    <div
      onClick={() => onSelect && onSelect(activeObjekt, variants)}
      className="group relative aspect-[1/1.55] w-full rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-[#0D0D12] shadow-sm hover:shadow-2xl transition-[box-shadow,transform,border-color] duration-300 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer border border-zinc-200/80 dark:border-white/10 select-none"
    >
      {/* ── 3D Flip Card Container ── */}
      <motion.div
        animate={{ rotateY: side === "front" ? 0 : 180 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.45, ease: "easeInOut" }}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <ObjektImage
            season={activeObjekt.season}
            member={activeObjekt.member}
            slug={activeObjekt.slug}
            side="front"
            fallbackSrc={activeObjekt.frontImage || activeObjekt.thumbnailImage}
            priority={priority}
            className="w-full h-full object-cover"
          />

          {/* Official COSMO Collection Code Overlay (Vertical Right Tab) */}
          {activeObjekt.collectionNo && (
            <div
              className="absolute right-0 top-0 bottom-0 w-[11.2%] flex items-center justify-center pointer-events-none select-none z-10"
              aria-hidden="true"
            >
              <span
                className="font-bold text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] md:text-[11.5px] tracking-[0.05em] whitespace-nowrap rotate-90 leading-none select-none uppercase font-display"
                style={{
                  color: activeObjekt.textColor || "#000000",
                }}
              >
                {activeObjekt.collectionNo}
              </span>
            </div>
          )}
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
              season={activeObjekt.season}
              member={activeObjekt.member}
              slug={activeObjekt.slug}
              side="back"
              fallbackSrc={activeObjekt.backImage}
              priority={priority}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900" />
          )}
        </div>
      </motion.div>

      {/* ── Online / Offline Variant Switcher (Merged A/Z Pairs) ── */}
      {hasMultipleVariants && variants && (
        <div
          onClick={(e) => e.stopPropagation()}
          role="group"
          aria-label="Switch Objekt format variant"
          className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 flex items-center gap-0.5 p-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 shadow-lg z-20"
        >
          {variants.map((variant) => {
            const suffix =
              getObjektCollectionSuffix(variant) ||
              (variant.onOffline === "offline" ? "A" : "Z");
            const isActive = variant.id === activeObjekt.id;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVariantId(variant.id);
                }}
                aria-pressed={isActive}
                title={`${variant.collectionNo} (${variant.onOffline || "edition"})`}
                className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold leading-none transition-colors ${
                  isActive
                    ? "bg-white text-zinc-950 dark:bg-[#D4FF00] dark:text-black shadow-sm"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {suffix}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Flip Button Overlay (Visible on Hover) ── */}
      <button
        type="button"
        onClick={handleFlip}
        aria-label="Flip Objekt"
        className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 transition-[opacity,transform,background-color] hover:scale-110 active:scale-95 z-20"
      >
        <RotateCw className={`h-3 sm:h-3.5 w-3 sm:w-3.5 transition-transform ${isFlipping ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
