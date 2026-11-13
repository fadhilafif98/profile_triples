# 001 — Smooth Cross-Fade and Motion Bridge for How-It-Works CTA Button

- **Status**: DONE
- **Commit**: 4a29cd9
- **Severity**: MEDIUM
- **Category**: Missed opportunities & Preventing a jarring change
- **Estimated scope**: 1 file (`src/components/home/how-it-works-section.tsx`), ~35 lines modified

## Problem

In `src/components/home/how-it-works-section.tsx`, while scrolling or navigating between the three phases (01 Collect → 02 Vote → 03 Watch), the left narrative panel (`narrativeContainerRef`) smoothly cross-fades via GSAP (`opacity` and `y`). However, the adjacent primary CTA button in the right control dock teleports immediately without transition:

```tsx
/* src/components/home/how-it-works-section.tsx:782-801 — current */
{currentPhase.external ? (
  <a
    href={currentPhase.href}
    target="_blank"
    rel="noopener noreferrer"
    className="group inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-black text-xs font-mono font-semibold transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 shadow-sm"
  >
    <span>{currentPhase.cta}</span>
    <span className="sr-only"> (opens in a new tab)</span>
    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
  </a>
) : (
  <Link
    href={currentPhase.href}
    className="group inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-black text-xs font-mono font-semibold transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 shadow-sm"
  >
    <span>{currentPhase.cta}</span>
    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
  </Link>
)}
```

Issues:
1. **Teleporting State**: The CTA text ("Open vault" → "How Gravity works" → "Watch SIGNAL") and link target snap abruptly mid-scroll, breaking visual rhythm with the smooth narrative text cross-fade right next to it.
2. **`transition-all` Violation**: The button has `transition-all` on hover/active states, which interpolates off-GPU layout properties.
3. **Accessibility / Focus Safety**: Swapping between `<a>` and `<Link>` dynamically can drop active keyboard focus.

## Target

All 3 phase action buttons are mounted within a dedicated `ctaContainerRef`. The active button remains interactive and keyboard-focusable (`tabIndex={0}`, `aria-hidden={false}`), while inactive buttons are visually hidden and inert (`tabIndex={-1}`, `aria-hidden={true}`, `pointer-events-none`).

Phase transitions cross-fade and slide the CTA with exact values matching the repo's GSAP standards:
- **Entering button**:
  - `opacity`: `0` → `1`
  - `y`: `6px` → `0px`
  - Duration: `240ms` (`0.24s`)
  - Easing: `power2.out` (equivalent to `cubic-bezier(0.23, 1, 0.32, 1)`)
  - `pointerEvents: "auto"`
- **Exiting button**:
  - `opacity`: `1` → `0`
  - `y`: `0px` → `-6px`
  - Duration: `160ms` (`0.16s`)
  - Easing: `power1.in` (fast exit)
  - `pointerEvents: "none"`
- **Hover/Active transitions on button**:
  - Replace `transition-all` with specific `transition-[background-color,transform] duration-200 ease-out`.
- **Reduced motion (`reduceMotion === true`)**:
  - Opacity fade only, zero `y` transform (`y: 0`), duration `150ms`.

## Repo conventions to follow

The file already establishes a panel-stack cross-fade pattern for `narrativeContainerRef`:
- Exemplar: [`src/components/home/how-it-works-section.tsx:258-275`](file:///Users/macair/Project/Github/profile_triples/src/components/home/how-it-works-section.tsx#L258-L275)
- Standard token easing: `power2.out` for entrances, `power1.in` for rapid exits.
- GSAP clean orchestration with `overwrite: "auto"`.

## Steps

### Step 1: Add `ctaContainerRef` ref hook
In `src/components/home/how-it-works-section.tsx`, add `ctaContainerRef` alongside existing refs (around line 130):

```tsx
const ctaContainerRef = useRef<HTMLDivElement>(null)
```

### Step 2: Add CTA cross-fade to `animateToPhase`
Inside `animateToPhase` (around line 276, right after the narrative panels tween):

```tsx
// 6. Action CTA Button Cross-Fade & Micro-Slide
const ctaButtons = ctaContainerRef.current?.querySelectorAll<HTMLElement>(".cta-action-btn")
if (reduceMotion) {
  ctaButtons?.forEach((btn, i) => {
    if (i === targetIndex) {
      gsap.to(btn, { opacity: 1, pointerEvents: "auto", duration: 0.15, overwrite: "auto" })
    } else {
      gsap.to(btn, { opacity: 0, pointerEvents: "none", duration: 0.15, overwrite: "auto" })
    }
  })
} else {
  ctaButtons?.forEach((btn, i) => {
    if (i === targetIndex) {
      gsap.fromTo(
        btn,
        { opacity: 0, y: 6, pointerEvents: "none" },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.24, ease: "power2.out", overwrite: "auto" }
      )
    } else {
      gsap.to(btn, {
        opacity: 0,
        y: -6,
        pointerEvents: "none",
        duration: 0.16,
        ease: "power1.in",
        overwrite: "auto",
      })
    }
  })
}
```

### Step 3: Replace the conditional single-button block with the keyed button stack
In `src/components/home/how-it-works-section.tsx:782-801`, replace the conditional `currentPhase.external ? <a ...> : <Link ...>` with:

```tsx
<div ref={ctaContainerRef} className="relative inline-flex items-center min-h-[44px]">
  {PHASES.map((phase, idx) => {
    const isExternal = phase.external
    const Comp = isExternal ? "a" : Link
    const externalProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}
    const isActive = activePhase === idx

    return (
      <Comp
        key={phase.id}
        href={phase.href}
        {...externalProps}
        tabIndex={isActive ? 0 : -1}
        aria-hidden={!isActive}
        className={`cta-action-btn group inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-black text-xs font-mono font-semibold transition-[background-color,transform] duration-200 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 shadow-sm ${
          reduceMotion
            ? isActive
              ? "relative"
              : "hidden"
            : idx === 0
            ? "relative opacity-100 pointer-events-auto"
            : "opacity-0 absolute inset-0 pointer-events-none"
        }`}
      >
        <span>{phase.cta}</span>
        {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
        <ArrowUpRight
          className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </Comp>
    )
  })}
</div>
```

## Boundaries

- Do NOT touch `src/components/home/hero-section.tsx` or any other components.
- Do NOT change the 3D card layout coordinates or gesture lock handlers.
- Do NOT add new dependencies (GSAP and motion/react are already in the file).
- Do NOT run `npm run build` or automated git commits.

## Verification

- **Mechanical**: Run `npx tsc --noEmit` to ensure zero TypeScript errors.
- **Feel check**:
  - Scroll into the "How It Works" section.
  - Advance from Phase 01 (Collect) to Phase 02 (Vote): observe the CTA button "Open vault" slide slightly upwards while fading out as "How Gravity works" enters smoothly from +6px.
  - Advance to Phase 03 (Watch): confirm "Watch SIGNAL" enters smoothly and opens in a new tab on click.
  - In DevTools Animations panel set speed to 10%: confirm `transform` and `opacity` animate cleanly with no layout jumps or size shifts.
  - Emulate `prefers-reduced-motion: reduce`: confirm buttons swap via opacity cross-fade without vertical translation.
- **Done when**: CTA button text and link transition in sync with the narrative panel without jarring visual pops.
