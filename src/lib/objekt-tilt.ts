"use client";

import { useCallback, useEffect, useRef, type PointerEvent } from "react";

interface UseObjektTiltOptions {
  /** Max tilt angle in degrees on X/Y axes. */
  maxTilt?: number;
  /** Peak opacity of the holographic foil overlay while active (0..1). */
  holoOpacity?: number;
  /** Allow touch pointer drag to tilt (useful in modal showcase, off in scrollable grids). */
  allowTouch?: boolean;
}

/**
 * Zero-re-render pointer tracking hook that drives 3D photocard tilt and
 * holographic foil specular coordinates via CSS custom properties.
 *
 * Caches `getBoundingClientRect()` at pointer entry and batches style writes
 * inside `requestAnimationFrame` to avoid layout thrashing on high-Hz pointers.
 */
export function useObjektTilt<T extends HTMLElement>({
  maxTilt = 8,
  holoOpacity = 0.58,
  allowTouch = false,
}: UseObjektTiltOptions = {}) {
  const ref = useRef<T>(null);
  const activePointerId = useRef<number | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number>(0);
  const pendingClientRef = useRef<{ x: number; y: number } | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const onChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const flushFrame = useCallback(() => {
    rafRef.current = 0;
    const el = ref.current;
    const rect = rectRef.current;
    const pt = pendingClientRef.current;
    if (!el || !rect || !pt || !rect.width || !rect.height) return;

    const px = Math.min(1, Math.max(0, (pt.x - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (pt.y - rect.top) / rect.height));

    const nx = px * 2 - 1;
    const ny = py * 2 - 1;

    const rx = (-ny * maxTilt).toFixed(2);
    const ry = (nx * maxTilt).toFixed(2);
    const mx = `${(px * 100).toFixed(1)}%`;
    const my = `${(py * 100).toFixed(1)}%`;
    const sx = `${(50 + nx * 38).toFixed(1)}%`;
    const sy = `${(50 + ny * 38).toFixed(1)}%`;

    el.dataset.tilting = "true";
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", mx);
    el.style.setProperty("--my", my);
    el.style.setProperty("--sx", sx);
    el.style.setProperty("--sy", sy);
    el.style.setProperty("--holo-o", String(holoOpacity));
  }, [maxTilt, holoOpacity]);

  const scheduleUpdate = useCallback(
    (clientX: number, clientY: number) => {
      if (reducedMotionRef.current) return;
      pendingClientRef.current = { x: clientX, y: clientY };
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(flushFrame);
      }
    },
    [flushFrame]
  );

  const reset = useCallback(() => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    rectRef.current = null;
    pendingClientRef.current = null;
    const el = ref.current;
    if (!el) return;
    delete el.dataset.tilting;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--holo-o", "0");
  }, []);

  const onPointerEnter = useCallback(
    (e: PointerEvent<T>) => {
      if (e.pointerType !== "mouse" || reducedMotionRef.current) return;
      if (ref.current) {
        rectRef.current = ref.current.getBoundingClientRect();
      }
      scheduleUpdate(e.clientX, e.clientY);
    },
    [scheduleUpdate]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<T>) => {
      if (e.pointerType === "mouse" || (allowTouch && e.pointerId === activePointerId.current)) {
        if (!rectRef.current && ref.current) {
          rectRef.current = ref.current.getBoundingClientRect();
        }
        scheduleUpdate(e.clientX, e.clientY);
      }
    },
    [allowTouch, scheduleUpdate]
  );

  const onPointerDown = useCallback(
    (e: PointerEvent<T>) => {
      if (!allowTouch || e.pointerType === "mouse" || reducedMotionRef.current) return;
      activePointerId.current = e.pointerId;
      if (ref.current) {
        rectRef.current = ref.current.getBoundingClientRect();
      }
      scheduleUpdate(e.clientX, e.clientY);
    },
    [allowTouch, scheduleUpdate]
  );

  const onPointerLeave = useCallback(
    (e: PointerEvent<T>) => {
      if (e.pointerType === "mouse") reset();
    },
    [reset]
  );

  const onPointerUp = useCallback(
    (e: PointerEvent<T>) => {
      if (e.pointerId !== activePointerId.current) return;
      activePointerId.current = null;
      reset();
    },
    [reset]
  );

  return {
    ref,
    handlers: {
      onPointerEnter,
      onPointerMove,
      onPointerDown,
      onPointerLeave,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
