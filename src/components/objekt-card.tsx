"use client";

import { memo, useState } from "react";
import { RotateCw } from "lucide-react";
import { Objekt, ObjektSide } from "@/types/objekt";
import { getObjektCollectionSuffix } from "@/lib/objekts";
import { useObjektTilt } from "@/lib/objekt-tilt";
import ObjektImage from "./objekt-image";

const preloadedVariantUrls = new Set<string>();

function preloadVariantImage(variant: Objekt) {
  if (typeof window === "undefined") return;
  const url = variant.frontImage || variant.thumbnailImage;
  if (!url || preloadedVariantUrls.has(url)) return;
  if (preloadedVariantUrls.size > 500) {
    preloadedVariantUrls.clear();
  }
  preloadedVariantUrls.add(url);
  const img = new window.Image();
  img.referrerPolicy = "no-referrer";
  img.src = url;
}

interface ObjektCardProps {
  objekt: Objekt;
  variants?: Objekt[];
  onSelect?: (objekt: Objekt, variants?: Objekt[]) => void;
  priority?: boolean;
}

/**
 * Clean edge-to-edge photocard Objekt design matching the official COSMO scan aesthetic.
 */
function ObjektCard({
  objekt,
  variants,
  onSelect,
  priority = false,
}: ObjektCardProps) {
  const [side, setSide] = useState<ObjektSide>("front");
  const [hasFlipped, setHasFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const { ref: tiltRef, handlers: tiltHandlers } = useObjektTilt<HTMLDivElement>({
    maxTilt: 8,
    holoOpacity: 0.22,
    allowTouch: false,
  });

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
      ref={tiltRef}
      {...tiltHandlers}
      className="objekt-tilt-stage group relative aspect-[1/1.55] w-full select-none"
    >
      {/* Primary keyboard-accessible card action sits in 2D stage layer (never slices 3D flip) */}
      <button
        type="button"
        onClick={() => onSelect && onSelect(activeObjekt, variants)}
        aria-label={`Inspect ${activeObjekt.member} ${activeObjekt.season} Objekt #${activeObjekt.collectionNo}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-xl sm:rounded-2xl md:rounded-3xl bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-[#D4FF00]"
      />

      {/* Pure 3D transform pivot: NO background/border here so nothing at Z=0 slices the rotating card */}
      <div className="objekt-tilt-body relative w-full h-full pointer-events-none">
        {/* ── 3D Flip Card Container (GPU CSS transform) ── */}
        <div
          className="w-full h-full relative transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none transform-3d"
          style={{ transform: side === "front" ? "rotateY(0deg)" : "rotateY(180deg)" }}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-[#0D0D12] border border-zinc-200/80 dark:border-white/10 shadow-sm group-hover:shadow-2xl transition-[box-shadow,border-color] duration-300 isolate"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg) translateZ(1px)",
            }}
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

            {/* Holographic Photocard Foil Overlay (active face only) */}
            {side === "front" && (
              <div className="objekt-holo absolute inset-0 z-10" aria-hidden="true" />
            )}

            {/* Official COSMO Collection Code Overlay (Vertical Right Tab) */}
            {activeObjekt.collectionNo && (
              <div
                className="absolute right-0 top-0 bottom-0 w-[11.2%] flex items-center justify-center pointer-events-none select-none z-10"
                aria-hidden="true"
              >
                <span
                  className="font-bold text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] md:text-[11.5px] tracking-wider whitespace-nowrap rotate-90 leading-none select-none uppercase font-display"
                  style={{
                    color: activeObjekt.textColor || "#000000",
                  }}
                >
                  {activeObjekt.collectionNo}
                </span>
              </div>
            )}

            {/* Subtle Polished Bevel Rim */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            />
          </div>

          {/* Back Side (Lazy loaded on flip; never reuses front photo if back is missing) */}
          <div
            className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden bg-[#08080A] border border-zinc-200/80 dark:border-white/10 shadow-sm group-hover:shadow-2xl transition-[box-shadow,border-color] duration-300 isolate"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(1px)",
            }}
          >
            {hasFlipped || side === "back" ? (
              <ObjektImage
                season={activeObjekt.season}
                member={activeObjekt.member}
                slug={activeObjekt.slug}
                side="back"
                fallbackSrc={
                  activeObjekt.backImage &&
                  activeObjekt.backImage !== activeObjekt.frontImage &&
                  activeObjekt.backImage !== activeObjekt.thumbnailImage
                    ? activeObjekt.backImage
                    : undefined
                }
                priority={priority}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#08080A]" />
            )}

            {/* Holographic Photocard Foil Overlay (active face only) */}
            {side === "back" && (
              <div className="objekt-holo absolute inset-0 z-10" aria-hidden="true" />
            )}

            {/* Subtle Polished Bevel Rim */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            />
          </div>
        </div>
      </div>

      {/* ── Online / Offline Variant Switcher (Merged A/Z Pairs) ── */}
      {hasMultipleVariants && variants && (
        <div
          role="group"
          aria-label="Switch Objekt format variant"
          className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 flex items-center gap-0.5 p-0.5 rounded-full bg-black/75 border border-white/20 shadow-lg z-20"
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
                onPointerEnter={() => {
                  if (!isActive) preloadVariantImage(variant);
                }}
                onFocus={() => {
                  if (!isActive) preloadVariantImage(variant);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVariantId(variant.id);
                }}
                aria-pressed={isActive}
                title={`${variant.collectionNo} (${variant.onOffline || "edition"})`}
                className={`min-w-6 min-h-6 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold leading-none transition-colors ${
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

      {/* ── Flip Button Overlay (Visible on Hover, Keyboard Focus, and Touch Devices) ── */}
      <button
        type="button"
        onClick={handleFlip}
        aria-pressed={side === "back"}
        aria-label={`Flip ${activeObjekt.member} #${activeObjekt.collectionNo} to ${side === "front" ? "back" : "front"} side`}
        className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 min-w-7 min-h-7 p-1.5 sm:p-2 inline-flex items-center justify-center rounded-full bg-black/75 hover:bg-black/90 text-white border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 transition-[opacity,transform,background-color] hover:scale-110 active:scale-95 z-20"
      >
        <RotateCw className={`h-3 sm:h-3.5 w-3 sm:w-3.5 transition-transform ${isFlipping ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
    </div>
  );
}

export default memo(ObjektCard);
