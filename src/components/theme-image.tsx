"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type SyntheticEvent,
} from "react"
import Image from "next/image"

type NextImageProps = ComponentProps<typeof Image>

export interface ThemeImageProps extends Omit<NextImageProps, "src"> {
  src: string
  /**
   * Visual transition style when `src` changes:
   * - `"dissolve"` (default): quiet darkroom dissolve (`opacity` + micro lens settle) for grids & avatars.
   * - `"curtain"`: editorial vertical shutter reveal (`clip-path` + `scale` settle) for focal portraits.
   */
  variant?: "dissolve" | "curtain"
  /** Transition duration in milliseconds when `src` changes (e.g. light/dark switch). */
  fadeDurationMs?: number
}

interface ImageLayer {
  id: number
  src: string
}

/**
 * Drop-in Next.js `<Image fill />` wrapper that crossfades smoothly when `src`
 * changes (such as switching between light and dark portrait variants).
 *
 * Uses stable-keyed layers + `img.decode()` + Web Animations API (`opacity` only):
 * - Keeps the previous image opaque underneath until the incoming image is fully decoded.
 * - Immune to `next-themes`'s `disableTransitionOnChange` CSS transition reset.
 * - Never remounts the incoming `<img>` upon commit, eliminating end-of-fade blips.
 */
export default function ThemeImage({
  src,
  alt,
  className = "",
  variant = "dissolve",
  fadeDurationMs,
  onLoad,
  onError,
  preload,
  fetchPriority,
  loading,
  ...rest
}: ThemeImageProps) {
  const resolvedDurationMs = fadeDurationMs ?? (variant === "curtain" ? 560 : 420)
  const nextIdRef = useRef(1)
  const [layers, setLayers] = useState<ImageLayer[]>(() => [{ id: 0, src }])
  const topLayerRef = useRef<HTMLSpanElement>(null)
  const activeAnimRef = useRef<Animation | null>(null)
  const cancelledRef = useRef(false)

  // Synchronize incoming `src` changes into the 2-layer stack without remounting the base layer.
  useEffect(() => {
    setLayers((prev) => {
      const top = prev[prev.length - 1]
      if (top && top.src === src) return prev
      const base = prev[0]
      if (base && base.src === src && prev.length > 1) {
        return [base]
      }
      const id = nextIdRef.current++
      return base ? [base, { id, src }] : [{ id, src }]
    })
  }, [src])

  useEffect(() => {
    cancelledRef.current = false
    return () => {
      cancelledRef.current = true
      activeAnimRef.current?.cancel()
    }
  }, [src])

  const commitTopLayer = useCallback((layerId: number) => {
    if (cancelledRef.current) return
    setLayers((prev) => {
      const target = prev.find((l) => l.id === layerId)
      if (!target) return prev
      return [target]
    })
  }, [])

  const handleIncomingLoad = useCallback(
    async (layerId: number, e: SyntheticEvent<HTMLImageElement>) => {
      onLoad?.(e)
      const img = e.currentTarget

      // Ensure bitmap is decoded before starting the opacity fade so there is no mid-fade pop.
      if (typeof img.decode === "function") {
        try {
          await img.decode()
        } catch {
          // Ignore decode errors on aborted/cached images and proceed with fade.
        }
      }

      if (cancelledRef.current) return
      const wrapper = topLayerRef.current
      if (!wrapper) {
        commitTopLayer(layerId)
        return
      }

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const duration = prefersReducedMotion
        ? Math.min(140, resolvedDurationMs)
        : resolvedDurationMs

      if (typeof wrapper.animate !== "function") {
        wrapper.style.opacity = "1"
        commitTopLayer(layerId)
        return
      }

      const keyframes: Keyframe[] = prefersReducedMotion
        ? [{ opacity: 0 }, { opacity: 1 }]
        : variant === "curtain"
          ? [
              {
                opacity: 0.85,
                clipPath: "inset(100% 0% 0% 0%)",
                transform: "scale(1.035)",
              },
              {
                opacity: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                transform: "scale(1)",
              },
            ]
          : [
              { opacity: 0, transform: "scale(1.035)" },
              { opacity: 1, transform: "scale(1)" },
            ]

      activeAnimRef.current?.cancel()
      const animation = wrapper.animate(keyframes, {
        duration,
        easing: prefersReducedMotion ? "ease-out" : "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      })
      activeAnimRef.current = animation

      await Promise.race([
        animation.finished.catch(() => undefined),
        new Promise((resolve) => window.setTimeout(resolve, duration + 150)),
      ])

      if (cancelledRef.current) return
      wrapper.style.opacity = "1"
      animation.cancel()
      commitTopLayer(layerId)
    },
    [commitTopLayer, resolvedDurationMs, variant, onLoad]
  )

  const handleIncomingError = useCallback(
    (layerId: number, e: SyntheticEvent<HTMLImageElement>) => {
      onError?.(e)
      commitTopLayer(layerId)
    },
    [commitTopLayer, onError]
  )

  const hasIncoming = layers.length > 1

  return (
    <>
      {layers.map((layer, index) => {
        const isIncoming = hasIncoming && index === layers.length - 1

        if (isIncoming) {
          return (
            <span
              key={layer.id}
              ref={topLayerRef}
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: 0 }}
            >
              <Image
                src={layer.src}
                alt=""
                className={className}
                loading="eager"
                onLoad={(e) => {
                  void handleIncomingLoad(layer.id, e)
                }}
                onError={(e) => handleIncomingError(layer.id, e)}
                {...rest}
              />
            </span>
          )
        }

        return (
          <span key={layer.id} className="absolute inset-0 pointer-events-none">
            <Image
              src={layer.src}
              alt={alt}
              className={className}
              preload={preload}
              fetchPriority={fetchPriority}
              loading={loading}
              onLoad={!hasIncoming ? onLoad : undefined}
              onError={!hasIncoming ? onError : undefined}
              {...rest}
            />
          </span>
        )
      })}
    </>
  )
}
