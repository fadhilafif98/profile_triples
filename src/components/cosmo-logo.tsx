"use client";

import Image from "next/image";

interface CosmoLogoProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

/**
 * Official COSMO App Icon
 * Sourced directly from COSMO official platform (shop.cosmo.fans).
 */
export default function CosmoLogo({
  width = 16,
  height = 16,
  className = "",
  alt = "COSMO",
}: CosmoLogoProps) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-md flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <Image
        src="/icons/cosmo-logo.png"
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-contain"
        unoptimized
      />
    </div>
  );
}
