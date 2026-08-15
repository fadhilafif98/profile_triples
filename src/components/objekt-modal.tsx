"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, RotateCw, Info } from "lucide-react";
import { Objekt, ObjektSide } from "@/types/objekt";
import ObjektImage from "./objekt-image";
import CosmoLogo from "./cosmo-logo";
import { getClassBadgeStyle } from "@/lib/objekts";

interface ObjektModalProps {
  objekt: Objekt | null;
  onClose: () => void;
}

export default function ObjektModal({ objekt, onClose }: ObjektModalProps) {
  const [activeSide, setActiveSide] = useState<ObjektSide>("front");
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  // Reset states when selected objekt changes
  useEffect(() => {
    setActiveSide("front");
    setShowMobileInfo(false);
  }, [objekt?.id]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!objekt) return null;

  const badgeStyle = getClassBadgeStyle(objekt.class);

  const toggleFlip = () => {
    setActiveSide((prev) => (prev === "front" ? "back" : "front"));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md md:max-w-3xl lg:max-w-4xl max-h-[92vh] bg-[#0c0c0e] border border-zinc-800 rounded-3xl shadow-2xl overflow-y-auto md:overflow-hidden z-10 flex flex-col md:flex-row my-auto text-white"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 backdrop-blur-md transition-colors z-30 shadow-md"
            aria-label="Close modal"
          >
            <X className="h-4 sm:h-5 w-4 sm:w-5" />
          </button>

          {/* ── Left Column: Clickable 3D Flip Photocard ── */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 bg-[#08080a] flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800/80 shrink-0">
            <div
              onClick={toggleFlip}
              className="group relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] aspect-[1/1.55] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900 cursor-pointer select-none transition-transform hover:scale-[1.02]"
              title="Click photo to flip front/back"
            >
              <motion.div
                animate={{ rotateY: activeSide === "front" ? 0 : 180 }}
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
                    priority={true}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Back Side */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <ObjektImage
                    season={objekt.season}
                    member={objekt.member}
                    slug={objekt.slug}
                    side="back"
                    fallbackSrc={objekt.backImage}
                    priority={true}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Hover Flip Indicator Button */}
              <div className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 shadow-lg transition-transform group-hover:scale-110">
                <RotateCw className="h-3.5 w-3.5" />
              </div>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 mt-2">
              Tap photo to flip 3D
            </span>

            {/* ── Mobile Only: 3-Column Action Grid & Collapsible Drawer ── */}
            <div className="block md:hidden w-full pt-3">
              <div className="grid grid-cols-3 gap-2 w-full">
                {/* Toggle Info Button */}
                <button
                  type="button"
                  onClick={() => setShowMobileInfo((prev) => !prev)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl text-xs font-mono font-bold transition-all border ${
                    showMobileInfo
                      ? "bg-white text-black border-white shadow-md"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800"
                  }`}
                >
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  <span>{showMobileInfo ? "Hide" : "Info"}</span>
                </button>

                {/* Buy on COSMO App Link */}
                <a
                  href="https://bit.ly/4hQegaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono font-bold transition-all shadow-md shadow-purple-500/20 active:scale-95 truncate text-center"
                >
                  <CosmoLogo width={14} height={14} className="shrink-0" />
                  <span className="truncate">COSMO</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>

                {/* Apollo Explorer Link */}
                <a
                  href={`https://apollo.cafe/objekts?member=${encodeURIComponent(
                    objekt.member
                  )}&season=${encodeURIComponent(objekt.season)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-all border border-zinc-800 active:scale-95 truncate text-center"
                >
                  <span className="truncate">Apollo</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                </a>
              </div>

              {/* Mobile Info Collapsible Drawer */}
              <AnimatePresence>
                {showMobileInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden text-left"
                  >
                    <div className="pt-4 mt-3 border-t border-zinc-800/80 space-y-3">
                      {/* Badges & Member Header */}
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-mono uppercase tracking-wider text-zinc-300">
                            {objekt.season}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                          >
                            {objekt.class}
                          </span>
                          {objekt.onOffline && (
                            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-mono uppercase text-zinc-400">
                              {objekt.onOffline}
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline justify-between gap-2">
                          <h2 className="text-xl font-extrabold text-white font-pretendard tracking-tight">
                            {objekt.member}
                          </h2>
                          <span className="text-xs font-mono font-bold text-purple-400">
                            #{objekt.collectionNo}
                          </span>
                        </div>
                      </div>

                      {/* Description Note */}
                      {objekt.description && (
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800/80">
                          {objekt.description}
                        </p>
                      )}

                      {/* Specifications Details */}
                      <div className="space-y-2 text-xs font-mono bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/60">
                        <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                          <span className="text-zinc-400">Collection No:</span>
                          <span className="font-bold text-white">#{objekt.collectionNo}</span>
                        </div>
                        {objekt.shortCode && (
                          <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                            <span className="text-zinc-400">Short Code:</span>
                            <span className="text-zinc-200">{objekt.shortCode}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between py-1">
                          <span className="text-zinc-400">Slug:</span>
                          <span className="text-zinc-300 truncate max-w-[180px]">
                            {objekt.slug}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right Column (Desktop Layout): Specs & 3-Pills Action Grid ── */}
          <div className="hidden md:flex flex-col justify-between w-1/2 p-6 md:p-8 overflow-y-auto max-h-[90vh]">
            <div className="space-y-5">
              {/* Header Badges */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono uppercase tracking-wider text-zinc-300">
                    {objekt.season}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-xs font-mono uppercase tracking-wider ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                  >
                    {objekt.class}
                  </span>
                  {objekt.onOffline && (
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-mono uppercase text-zinc-400">
                      {objekt.onOffline}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-3xl font-extrabold text-white font-pretendard tracking-tight">
                    {objekt.member}
                  </h2>
                  <span className="text-sm font-mono font-bold text-purple-400">
                    #{objekt.collectionNo}
                  </span>
                </div>
              </div>

              {/* Description Box */}
              {objekt.description && (
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                    {objekt.description}
                  </p>
                </div>
              )}

              {/* Specifications Table */}
              <div className="space-y-2.5 text-xs font-mono bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/60">
                <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Collection No:</span>
                  <span className="font-bold text-white">#{objekt.collectionNo}</span>
                </div>
                {objekt.shortCode && (
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Short Code:</span>
                    <span className="text-zinc-200">{objekt.shortCode}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Edition:</span>
                  <span className="text-zinc-200">{objekt.season}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-zinc-400">Slug:</span>
                  <span className="text-zinc-300 truncate max-w-[200px]">
                    {objekt.slug}
                  </span>
                </div>
              </div>
            </div>

            {/* ── 3 Action Pills on Right Column (Desktop) ── */}
            <div className="pt-6 mt-6 border-t border-zinc-800/80">
              <div className="grid grid-cols-3 gap-2.5 w-full">
                {/* 1. Official Info/Collection Pill */}
                <div className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-zinc-900 text-zinc-300 text-xs font-mono font-medium border border-zinc-800 select-none">
                  <Info className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">Verified</span>
                </div>

                {/* 2. Buy on COSMO App Link */}
                <a
                  href="https://bit.ly/4hQegaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono font-bold transition-all shadow-md shadow-purple-500/20 active:scale-95 truncate text-center"
                >
                  <CosmoLogo width={14} height={14} className="shrink-0" />
                  <span className="truncate">COSMO</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>

                {/* 3. Apollo Explorer Link */}
                <a
                  href={`https://apollo.cafe/objekts?member=${encodeURIComponent(
                    objekt.member
                  )}&season=${encodeURIComponent(objekt.season)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-all border border-zinc-800 active:scale-95 truncate text-center"
                >
                  <span className="truncate">Apollo</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
