"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  X,
  ExternalLink,
  RotateCw,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import { Objekt, ObjektSide } from "@/types/objekt";
import ObjektImage from "./objekt-image";
import CosmoLogo from "./cosmo-logo";
import { getClassBadgeStyle, getObjektCollectionSuffix } from "@/lib/objekts";
import { getAllMembers, getMemberColor } from "@/lib/members";
import { useDialogA11y } from "@/lib/a11y";

interface ObjektModalProps {
  objekt: Objekt | null;
  variants?: Objekt[];
  onSelectVariant?: (variant: Objekt) => void;
  onClose: () => void;
}

export default function ObjektModal({
  objekt,
  variants,
  onSelectVariant,
  onClose,
}: ObjektModalProps) {
  const [activeSide, setActiveSide] = useState<ObjektSide>("front");
  const [hasFlipped, setHasFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [overrideVariant, setOverrideVariant] = useState<Objekt | null>(null);
  const [prevObjektId, setPrevObjektId] = useState<string | undefined>(objekt?.id);
  const modalRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Reset states when selected objekt changes
  if (objekt?.id !== prevObjektId) {
    setPrevObjektId(objekt?.id);
    setActiveSide("front");
    setHasFlipped(false);
    setCopied(false);
    setOverrideVariant(null);
  }

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useDialogA11y(Boolean(objekt), modalRef, handleClose);

  const activeObjekt = objekt ? (overrideVariant ?? objekt) : null;
  const hasMultipleVariants = Boolean(variants && variants.length > 1);
  const badgeStyle = activeObjekt ? getClassBadgeStyle(activeObjekt.class) : null;

  // Match official member data (S-number, color, slug)
  const allMembers = getAllMembers();
  const memberData = activeObjekt
    ? allMembers.find(
        (m) =>
          m.name.toLowerCase() === activeObjekt.member.toLowerCase() ||
          (m.birthName && m.birthName.toLowerCase().includes(activeObjekt.member.toLowerCase()))
      )
    : undefined;
  const memberColor = memberData
    ? getMemberColor(memberData.id)
    : activeObjekt?.accentColor || "#7C3AED";

  const toggleFlip = () => {
    setActiveSide((prev) => {
      const next = prev === "front" ? "back" : "front";
      if (next === "back") setHasFlipped(true);
      return next;
    });
  };

  const handleSwitchVariant = (variant: Objekt) => {
    setCopied(false);
    if (onSelectVariant) {
      onSelectVariant(variant);
    } else {
      setOverrideVariant(variant);
    }
  };

  const handleCopyCode = async () => {
    if (!activeObjekt) return;
    try {
      await navigator.clipboard.writeText(
        `#${activeObjekt.collectionNo} (${activeObjekt.member} · ${activeObjekt.season})`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy collection code:", err);
    }
  };

  return (
    <AnimatePresence>
      {activeObjekt && badgeStyle && (
      <div
        key="objekt-modal-root"
        ref={modalRef}
        tabIndex={-1}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto focus:outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="objekt-modal-title"
      >
        {/* Backdrop (solid translucent scrim without full-screen backdrop-blur flash) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.16, ease: "easeOut" }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 dark:bg-black/85"
        />

        {/* Modal Window — Editorial Collector's Atelier Frame (no outer scale() wrapping preserve-3d) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.01 }
              : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
          }
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg md:max-w-4xl lg:max-w-5xl max-h-[92vh] bg-white dark:bg-[#0D0D12] border border-zinc-200/90 dark:border-white/10 rounded-3xl shadow-2xl shadow-zinc-950/15 dark:shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col md:flex-row overflow-hidden z-10 text-zinc-950 dark:text-zinc-100 my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-200 transition-colors z-40 shadow-sm border border-zinc-200/60 dark:border-white/10"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          {/* ── Left Column: Atelier Showcase Pedestal (3D Flip Photocard) ── */}
          <div className="w-full md:w-[46%] lg:w-[44%] p-5 sm:p-7 md:p-8 bg-zinc-50/90 dark:bg-[#08080A] flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-zinc-200/80 dark:border-white/10 shrink-0 relative bg-linear-to-b from-zinc-100/60 to-zinc-50/90 dark:from-white/2 dark:to-transparent">
            {/* Ambient Radial Lighting Behind Card (zero blur filter repaint cost) */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none opacity-20 dark:opacity-15"
              style={{
                background: `radial-gradient(circle, ${memberColor} 0%, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            {/* 3D Flip Card Frame */}
            <div
              onClick={toggleFlip}
              className="group relative w-full max-w-65 sm:max-w-72.5 md:max-w-77.5 aspect-[1/1.55] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-zinc-950/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900 cursor-pointer select-none transition-transform hover:scale-[1.015] z-10 perspective-distant"
              title="Click photo to flip front/back"
            >
              {/* Member Color Top Foil Line */}
              <div
                className="absolute top-0 inset-x-0 h-1 z-30 shadow-sm"
                style={{ backgroundColor: memberColor }}
                aria-hidden="true"
              />

              <div
                className="w-full h-full relative transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none transform-3d"
                style={{
                  transform: activeSide === "front" ? "rotateY(0deg)" : "rotateY(180deg)",
                }}
              >
                {/* Front Side */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {activeObjekt.frontMedia ? (
                    <video
                      src={activeObjekt.frontMedia}
                      poster={activeObjekt.frontImage || activeObjekt.thumbnailImage}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ObjektImage
                      season={activeObjekt.season}
                      member={activeObjekt.member}
                      slug={activeObjekt.slug}
                      side="front"
                      fallbackSrc={activeObjekt.frontImage || activeObjekt.thumbnailImage}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Official COSMO Collection Code Overlay (Vertical Right Tab) */}
                  {activeObjekt.collectionNo && (
                    <div
                      className="absolute right-0 top-0 bottom-0 w-[11.2%] flex items-center justify-center pointer-events-none select-none z-10"
                      aria-hidden="true"
                    >
                      <span
                        className="font-bold text-xs sm:text-sm md:text-[15px] tracking-[0.06em] whitespace-nowrap rotate-90 leading-none select-none uppercase font-display"
                        style={{
                          color: activeObjekt.textColor || "#000000",
                        }}
                      >
                        {activeObjekt.collectionNo}
                      </span>
                    </div>
                  )}
                </div>

                {/* Back Side (Lazy mounted on first flip to prevent open-time blitz) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {hasFlipped || activeSide === "back" ? (
                    activeObjekt.backMedia ? (
                      <video
                        src={activeObjekt.backMedia}
                        poster={activeObjekt.backImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ObjektImage
                        season={activeObjekt.season}
                        member={activeObjekt.member}
                        slug={activeObjekt.slug}
                        side="back"
                        fallbackSrc={activeObjekt.backImage}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900" />
                  )}
                </div>
              </div>

              {/* Motion Badge Indicator */}
              {activeObjekt.frontMedia && activeSide === "front" && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-white/20 text-[11px] font-mono font-bold text-white uppercase tracking-wider shadow-md z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Motion MP4</span>
                </div>
              )}
            </div>

            {/* Showcase Stage Controls: Front/Back Pill + Format Variant Switcher + 3D Flip Hint */}
            <div className="w-full flex flex-col items-center gap-2.5 pt-4 z-10">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="flex items-center p-1 rounded-full bg-zinc-200/70 dark:bg-white/10 border border-zinc-300/60 dark:border-white/10 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setActiveSide("front")}
                    className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-[background-color,color,box-shadow] ${
                      activeSide === "front"
                        ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                    }`}
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasFlipped(true);
                      setActiveSide("back");
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-[background-color,color,box-shadow] ${
                      activeSide === "back"
                        ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                    }`}
                  >
                    Back
                  </button>
                </div>

                {hasMultipleVariants && variants && (
                  <div
                    role="group"
                    aria-label="Switch edition format"
                    className="flex items-center p-1 rounded-full bg-zinc-200/70 dark:bg-white/10 border border-zinc-300/60 dark:border-white/10 shadow-inner"
                  >
                    {variants.map((variant) => {
                      const suffix = getObjektCollectionSuffix(variant);
                      const formatLabel =
                        variant.onOffline === "offline"
                          ? "Offline"
                          : variant.onOffline === "online"
                          ? "Online"
                          : suffix;
                      const isActive = variant.id === activeObjekt.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => handleSwitchVariant(variant)}
                          aria-pressed={isActive}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-[background-color,color,box-shadow] ${
                            isActive
                              ? "bg-zinc-950 text-white dark:bg-[#D4FF00] dark:text-black shadow-sm"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                          }`}
                        >
                          {suffix ? `${suffix} · ${formatLabel}` : formatLabel}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={toggleFlip}
                className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors pt-0.5"
              >
                <RotateCw className="w-3 h-3 transition-transform group-hover:rotate-180" />
                <span>Tap photocard to flip 3D</span>
              </button>
            </div>
          </div>

          {/* ── Right Column: Curator's Ledger & Spec Matrix ── */}
          <div className="w-full md:w-[54%] lg:w-[56%] p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[92vh] md:max-h-none space-y-6">
            <div className="space-y-5">
              {/* Header Badges & Member Identity */}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  {/* Season Badge */}
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200 border border-zinc-300/70 dark:border-white/15">
                    {activeObjekt.season}
                  </span>

                  {/* Class Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                  >
                    {activeObjekt.class}
                  </span>

                  {/* Online/Offline Badge */}
                  {activeObjekt.onOffline && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/5">
                      {activeObjekt.onOffline}
                    </span>
                  )}

                </div>

                {/* Member Stage Name + Collection Number */}
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <h2
                      id="objekt-modal-title"
                      className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-zinc-950 dark:text-white tracking-tight"
                    >
                      {activeObjekt.member}
                      {memberData?.hangul && (
                        <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 ml-2 font-display">
                          {memberData.hangul}
                        </span>
                      )}
                    </h2>

                    {/* Member Profile Deep Link */}
                    {memberData && (
                      <Link
                        href={`/members/${memberData.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-sans text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors mt-1 group"
                      >
                        <span>View {memberData.name}&apos;s profile</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>

                  <span className="text-lg sm:text-xl font-mono font-black text-zinc-900 dark:text-[#D4FF00] tracking-tight shrink-0">
                    #{activeObjekt.collectionNo}
                  </span>
                </div>
              </div>

              {/* Curator Note / Description Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-100/60 dark:bg-white/3 border border-zinc-200/80 dark:border-white/10">
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                  {activeObjekt.description ||
                    "Official tripleS collectible photocard on COSMO : the Gate. Collect Objekts to earn COMO and vote in Grand Gravity."}
                </p>
              </div>

              {/* Spec Matrix Bento (Certificate Grid) */}
              <div className="p-4 rounded-2xl bg-zinc-100/50 dark:bg-white/3 border border-zinc-200/80 dark:border-white/10 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between py-1.5 border-b border-zinc-200/60 dark:border-white/5">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Collection No:
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    #{activeObjekt.collectionNo}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-200/60 dark:border-white/5">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Edition / Season:
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-200 font-semibold">
                    {activeObjekt.season}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-200/60 dark:border-white/5">
                  <span className="text-zinc-500 dark:text-zinc-400">Class:</span>
                  <span className="text-zinc-900 dark:text-zinc-200 font-semibold">
                    {activeObjekt.class}
                  </span>
                </div>

                {activeObjekt.shortCode && (
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-200/60 dark:border-white/5">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      Short Code:
                    </span>
                    <span className="text-zinc-800 dark:text-zinc-300">
                      {activeObjekt.shortCode}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-200/60 dark:border-white/5">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    COMO:
                  </span>
                  <span className="text-zinc-900 dark:text-[#D4FF00] font-bold">
                    {activeObjekt.comoAmount ? `+${activeObjekt.comoAmount} COMO` : "+1 COMO"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-zinc-500 dark:text-zinc-400">Slug:</span>
                  <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-45 sm:max-w-55">
                    {activeObjekt.slug}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Verified Action Dock (Bottom Row) ── */}
            <div className="pt-4 border-t border-zinc-200/80 dark:border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                {/* 1. Verified + Copy Action Pill */}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-medium border border-zinc-200/80 dark:border-white/10 transition-colors select-none active:scale-95"
                  title="Copy Objekt code"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Copied!
                      </span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">Verified</span>
                      <Copy className="h-3 w-3 opacity-50 shrink-0 ml-0.5" />
                    </>
                  )}
                </button>

                {/* 2. Official COSMO App Link */}
                <a
                  href="https://bit.ly/4hQegaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#7C3AED] dark:hover:bg-[#6D28D9] text-white text-xs font-mono font-bold transition-[background-color,transform] shadow-sm active:scale-95 truncate text-center group"
                >
                  <CosmoLogo width={14} height={14} className="shrink-0" />
                  <span className="truncate">COSMO App</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                {/* 3. Apollo Cafe Explorer Link */}
                <a
                  href={`https://apollo.cafe/objekts?member=${encodeURIComponent(
                    activeObjekt.member
                  )}&season=${encodeURIComponent(activeObjekt.season)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-zinc-950 hover:bg-black text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white text-xs font-mono font-bold transition-[background-color,transform] border border-transparent dark:border-white/10 active:scale-95 truncate text-center group"
                >
                  <span className="truncate">Apollo Cafe</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
