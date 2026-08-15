"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getObjektImageUrl } from "@/lib/objekts";
import { ObjektSide } from "@/types/objekt";
import TriplesLogo from "./triples-logo";

interface ObjektImageProps {
  season: string;
  member: string;
  slug: string;
  side?: ObjektSide;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  onLoad?: () => void;
}

/**
 * High-performance Objekt Image component.
 * Directs to valid official image sources (resources.cosmo.fans / imagedelivery.net / Hugging Face CDN)
 * with instant fallback to official static tripleS logo for unreleased sides without 404 console errors.
 */
export default function ObjektImage({
  season,
  member,
  slug,
  side = "front",
  alt,
  className = "",
  fallbackSrc,
  priority = false,
  fill = true,
  width,
  height,
  sizes,
  onLoad,
}: ObjektImageProps) {
  // Check if fallbackSrc is a valid non-empty URL
  const hasDirectSrc = Boolean(fallbackSrc && fallbackSrc.trim().length > 0);
  const primaryHfUrl = getObjektImageUrl(season, member, slug, side);

  // If fallbackSrc exists, prioritize it to prevent 404 on un-uploaded HF scans
  // If side is 'back' and no backImage is provided, don't attempt HF request
  const initialSrc = hasDirectSrc
    ? fallbackSrc!
    : side === "back"
    ? ""
    : primaryHfUrl;

  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [triedHf, setTriedHf] = useState<boolean>(!hasDirectSrc);
  const [allFailed, setAllFailed] = useState<boolean>(!initialSrc);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(initialSrc));

  const imageAlt = alt || `${season} ${member} ${slug} (${side})`;

  // Reset states when card attributes change
  useEffect(() => {
    const hasValidDirect = Boolean(fallbackSrc && fallbackSrc.trim().length > 0);
    const nextHfUrl = getObjektImageUrl(season, member, slug, side);
    const nextSrc = hasValidDirect
      ? fallbackSrc!
      : side === "back"
      ? ""
      : nextHfUrl;

    setCurrentSrc(nextSrc);
    setTriedHf(!hasValidDirect);
    setAllFailed(!nextSrc);
    setIsLoading(Boolean(nextSrc));
  }, [season, member, slug, side, fallbackSrc]);

  const handleImageError = () => {
    // If we were using direct src and haven't tried HF CDN yet, try HF CDN
    if (!triedHf && primaryHfUrl && currentSrc !== primaryHfUrl) {
      setTriedHf(true);
      setCurrentSrc(primaryHfUrl);
      setIsLoading(true);
    } else {
      // All image sources failed, show clean static logo placeholder
      setAllFailed(true);
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && !allFailed && (
        <div className="absolute inset-0 bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse rounded-inherit z-10" />
      )}

      {/* Fallback Graphic: pure clean official static tripleS logo */}
      {allFailed || !currentSrc ? (
        <div className="w-full h-full flex items-center justify-center p-6 bg-[#0c0c0e] select-none border border-zinc-200/50 dark:border-white/5 relative overflow-hidden">
          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-radial from-white/5 to-transparent pointer-events-none" />

          {/* Official Static tripleS Logo */}
          <div className="text-zinc-300 dark:text-zinc-200 drop-shadow-[0_0_16px_rgba(255,255,255,0.25)]">
            <TriplesLogo
              width={64}
              height={64}
              strokeColor="currentColor"
              strokeWidth={160}
            />
          </div>
        </div>
      ) : fill ? (
        <Image
          src={currentSrc}
          alt={imageAlt}
          fill
          unoptimized={true}
          priority={priority}
          sizes={sizes || "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"}
          referrerPolicy="no-referrer"
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => {
            setIsLoading(false);
            if (onLoad) onLoad();
          }}
          onError={handleImageError}
        />
      ) : (
        <Image
          src={currentSrc}
          alt={imageAlt}
          width={width || 360}
          height={height || 560}
          unoptimized={true}
          priority={priority}
          referrerPolicy="no-referrer"
          className={`transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => {
            setIsLoading(false);
            if (onLoad) onLoad();
          }}
          onError={handleImageError}
        />
      )}
    </div>
  );
}
