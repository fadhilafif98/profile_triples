# tripleS Fan Directory — Design System & Visual Lock Guide (`DESIGN.md`)

Official design lock, visual token system, editorial typography, *Dual-Theme Synergy* color palette, kinetic micro-interactions, and component architecture for the **tripleS Profile & Fan Directory** (`profile-triples.vercel.app`).

> **STRICT DESIGN LOCK**: All AI agents and developers are **STRICTLY PROHIBITED** from deviating into default LLM templates (*AI slop*), including generic 3-column SaaS cards, purple neon glow, excessive mono tracking brackets `[ ... ]`, em-dashes in headings, or arbitrary spinning animations.

---

## 1. Core Dials & Tri-Skill Design Protocol

The user interface of this project is locked to three high-conviction visual dial values:

* **`DESIGN_VARIANCE: 9`** (Asymmetric editorial composition, confident dynamic whitespace, varied visual rhythm between sections reminiscent of high-fashion K-Pop print monographs).
* **`MOTION_INTENSITY: 8`** (GSAP + ScrollTrigger kinetic typography & pinned storytelling, Motion spring physics on tactile UI micro-interactions).
* **`VISUAL_DENSITY: 3`** (Airy, luxurious breathing room, zero cramped data cards or raw data-dump tables).

### Tri-Skill Design Synergy Architecture:
This project synthesizes three frontend design skills (`.agents/skills/`):
1. **`design-taste-frontend`**: Anti-slop invariants, *The Lila Rule* (pure carbon ink contrast `#09090B` in Light Mode), visual dial constraints, audit-first approach on redesigns, and pre-flight checks against telltale AI patterns.
2. **`frontend-design`**: High-conviction editorial typography guidance, K-Pop fashion magazine layouts, and bespoke, non-templated page structures.
3. **`impeccable` (`pbakaus/impeccable` & Polish philosophy)**: Design-director craft standard (*out-of-distribution craft*), non-negotiable quality floor, strict visual hierarchy, tactile micro-interactions, mobile-first responsive adaptation, and zero shortcuts.

---

## 2. Locked Color Palette (*Dual-Theme Synergy*)

The color palette is strictly locked, adapting the creative standards of high-fashion agency *LxL Creative* harmonized with the official visual identity of tripleS & MODHAUS:

### A. System Color Tokens

| Token Name | Dark Mode | Light Mode (Default) | Role / Purpose |
| :--- | :--- | :--- | :--- |
| **`void-base`** | `#08080A` (Deep Obsidian Carbon) | `#F8F8FA` / `#FAFAFA` (Alabaster Paper) | Canvas background for all pages (Full Theme Lock). |
| **`void-surface`**| `#0D0D12` (Tactile Bento Surface)| `#FFFFFF` (Pure White Surface) | Elevated card layer, sheet, and toolbar background (`.spotlight-card`). |
| **`void-elevated`**| `#14141B` (Inner Well Depth) | `#F4F4F6` (Soft Zinc Well) | Card inner wells, simulator ballot frames, pills. |
| **`void-rim`**    | `inset 0 1px 0 rgba(255,255,255,0.12)`| `inset 0 1px 0 rgba(0,0,0,0.04)` | Hairline luxury top bevel highlight (Tactile Depth). |
| **`void-border`** | `rgba(255, 255, 255, 0.08)` | `rgba(0, 0, 0, 0.08)` / `border-zinc-200` | 1px hairline stroke for architectural contours. |
| **`text-primary`**| `#F4F4F6` (Luminescent White) | `#09090B` (Deep Carbon) | Headlines, member names, and primary text with maximum contrast (WCAG AAA). |
| **`text-muted`**  | `#8E8E99` (Cosmic Muted) | `#71717A` (Neutral Zinc) | Subtitles, technical metadata, descriptions, secondary badges. |
| **`kinetic-accent`**| `#D4FF00` (Acid Voltage Pulse) | `#09090B` (Monochromatic Carbon Ink) | Dynamic kinetic accent: nav underline draw, active dots, calligraphic flourishes, active story rings. |
| **`btn-primary`** | `#D4FF00` (Text Black) | `#09090B` (Text White) | Primary CTA button: instant high contrast in both modes without glare. |
| **`brand-violet`**| `#8B5CF6` (COSMO Ultraviolet)| `#7C3AED` (COSMO Deep Violet) | Official MODHAUS ecosystem identity: COSMO voting, Gravity tokens (strictly for data & official branding). |

### B. tripleS Official Brand & Member Colors

1. **Unifying Ecosystem Palette**:
   - **Monochromatic Carbon Ink (`#09090B` / `text-zinc-950`)**: High-fashion editorial standard in Light Mode (19:1 WCAG AAA contrast ratio). Eliminates generic AI purple (*The Lila Rule*), rendering `Pinyon Script` calligraphic swashes razor-sharp and crisp without blur or fuzziness.
   - **Acid Voltage Lime (`#D4FF00`)**: Modern kinetic accent signature to First Class Objekts & Dimension energy. Used as kinetic accent and CTA in Dark Mode and on dark cinematic photography backgrounds.
2. **24 Official Member Colors (MODHAUS Identity)**:
   - S1 SeoYeon (`#17A7FE`), S2 HyeRin (`#8801FF`), S3 JiWoo (`#FFD800`), S4 ChaeYeon (`#76C722`)
   - S5 YooYeon (`#D10A70`), S6 SooMin (`#FF95C8`), S7 NaKyoung (`#538FC8`), S8 YuBin (`#FFECF3`)
   - S9 Kaede (`#FFA947`), S10 DaHyun (`#FF73B3`), S11 Kotone (`#FFF554`), S12 YeonJi (`#4243A2`)
   - S13 Nien (`#FF9649`), S14 SoHyun (`#082855`), S15 Xinyu (`#D51312`), S16 Mayu (`#F88059`)
   - S17 Lynn (`#C7DFF8`), S18 JooBin (`#C9FF50`), S19 HaYeon (`#85E3B3`), S20 ShiOn (`#FFAFD3`)
   - S21 ChaeWon (`#BEE6B5`), S22 Sullin (`#FD82B8`), S23 SeoAh (`#FFFFFF`), S24 JiYeon (`#C99DF3`)
   *Note*: Official member colors must be applied to avatar rings, personal highlights, ambient glow auras, and individual profile badges.

### C. Banned Palettes & Anti-Regression Rules
* **Prohibited**: Using `#D4FF00` text on white/light backgrounds (contrast ratio is merely 1.1:1, completely unreadable). Must use `text-zinc-950 dark:text-[#D4FF00]` or the `.kinetic-dot` utility class.
* **Prohibited**: Using generic AI Purple Glow / SaaS Purple text in Light Mode (`text-violet-600` violates *The Lila Rule*). Must use Carbon Ink `#09090B`.
* **Prohibited**: Hardcoding dark backgrounds `#0D0D12` or `#050505` on reusable cards or general pages. All layouts must be theme-adaptive (Light: `#FAFAFA` / `#FFFFFF`, Dark: `#08080A` / `#0D0D12`).
* **Prohibited**: Inverting themes per section (all sections must adhere to the globally active theme, with the sole exception of cinematic dark hero photography).

---

## 3. Locked Typography Stack (4-Tier Editorial Architecture)

| Role | Font Family | Variable / Utility | Character & Usage Rules |
| :--- | :--- | :--- | :--- |
| **Luxury Monogram & Flourish** | `Pinyon Script` | `var(--font-accent)` / `.font-accent` | Ornate calligraphic flourish, high-fashion contrast, looping vertical swashes. The visual gravity center of the website. Strictly for keyword accents, **never** for body text. |
| **Display & Headline** | `Syne` | `var(--font-display)` / `font-display` | Parisian art direction, organic artistic curves, tight tracking, weight `font-black` (900) or `font-bold` (700). |
| **Body & Navigation** | `Manrope` | `var(--font-body)` / `font-sans` | Clean geometric neo-grotesque, ultra-legible, modern agency standard. Max line-length: `65ch`. |
| **Technical Metadata & S-Number** | `JetBrains Mono` | `var(--font-mono)` / `font-mono` | Technical stats, countdown timers, S-numbers, release dates. **No surrounding brackets** (`S1`, `2026.08`, never `[ S1 ]`). |

> **BANNED TYPOGRAPHY**: Using `Inter`, `Fraunces`, `font-pretendard` indiscriminately (Pretendard is only a Korean Hangul system fallback), or generic serifs without brand justification is strictly prohibited.

---

## 4. Locked Heading Scale & Hierarchy Architecture

| Level | Token / CSS Classes | Font & Weight | Scope / Purpose |
| :--- | :--- | :--- | :--- |
| **`H1 - Main Page Title`** | `text-3xl xs:text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] sm:whitespace-nowrap` | `Syne` (900 `font-black`) | Primary title across all catalog pages (`/members`, `/albums`, `/sub-units`, `/objekts`, `/about`, `/credits`). Locked single-line without wrapping. |
| **`H1 - Script Flourish`** | `font-accent text-4xl xs:text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1` | `Pinyon Script` (400) | Calligraphic keyword flourish within H1. |
| **`H1 - Detail Page`** | `text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05]` | `Syne` (900 `font-black`) | Individual name title on profile/detail pages (`/members/[slug]`, `/sub-units/[slug]`). |
| **`H2 - Major Section`** | `text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05]` | `Syne` (900 `font-black`) | Primary section title on pages. |
| **`H2 - Section Flourish`**| `font-accent text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1` | `Pinyon Script` (400) | Calligraphic keyword flourish within H2 sections. |
| **`H2 - Detail Section`** | `text-2xl sm:text-3xl font-display font-black text-zinc-950 dark:text-white tracking-tight` | `Syne` (900 `font-black`) | Sub-sections on detail pages or preview modals (`Trajectory`, `Visual Archive`, `Formations`). |
| **`H3 - Module / Card`** | `text-xl sm:text-2xl font-display font-black text-zinc-950 dark:text-white tracking-tight` | `Syne` (900 `font-black`) | Architectural module/card titles (e.g. Stage 01–03 on About, Card titles). |
| **`H4 - Micro Title`** | `text-base sm:text-lg font-display font-bold text-zinc-950 dark:text-white tracking-tight` | `Syne` (700 `font-bold`) | Micro metadata group title or stack item in Credits. |
| **`Lead Subtitle`** | `text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed pt-1` | `Manrope` (`font-sans`) | Introductory description directly beneath H1. |

### Strict Heading Anti-Regression Rules:
1. **Font Consistency**: All `h1`, `h2`, `h3` elements must use `font-display` (`Syne`) with weight `font-black`.
2. **Single-Line H1 Lock**: All catalog page H1 titles must remain on a single line (`sm:whitespace-nowrap`) without awkward multi-line line breaks (`About tripleS`, `Official Discography`, `Sub-Units & Dimensions`, `Twenty-four, in order`, `Objekts Vault`, `Official Credits`). Restricting header wrapper width with `max-w-3xl` that forces vertical text stacking is prohibited.
3. **No-Pill/Bar Above H1**: Never place status bars, pill chips, or metadata tags above H1 titles. Transition from `<Breadcrumb />` directly to the `<h1>` title must be clean and consistent across all pages.
4. **Flourish Padding**: Calligraphic `Pinyon Script` accent words in H1/H2 must have horizontal padding `inline-block px-1` to prevent italic/swash glyph clipping at container bounds.

---

## 5. Standardized Button & Interactive Component Tokens

All button and interactive components are consolidated in official utility classes defined in `src/app/globals.css`:

```css
/* ── 1. Primary Action Button ── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 9999px;
  background-color: #09090B;
  color: #FFFFFF;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-mono), monospace;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.btn-primary:hover {
  background-color: #27272A;
}
.btn-primary:active {
  transform: scale(0.98);
}
.btn-primary:focus-visible {
  outline: 2px solid #09090B;
  outline-offset: 2px;
}
.dark .btn-primary {
  background-color: #D4FF00;
  color: #000000;
}
.dark .btn-primary:hover {
  background-color: #E2FF33;
}
.dark .btn-primary:focus-visible {
  outline: 2px solid #D4FF00;
  outline-offset: 2px;
}

/* ── 2. Secondary / Utility Pill Button ── */
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  border-radius: 9999px;
  background-color: #FFFFFF;
  color: #27272A;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 0.5rem 1rem;
  font-family: var(--font-mono), monospace;
  font-size: 0.75rem;
  line-height: 1rem;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.btn-secondary:hover {
  border-color: rgba(0, 0, 0, 0.25);
  color: #000000;
  background-color: #F8F8FA;
}
.btn-secondary:active {
  transform: scale(0.98);
}
.btn-secondary:focus-visible {
  outline: 2px solid #09090B;
  outline-offset: 2px;
}
.dark .btn-secondary {
  background-color: #0D0D12;
  color: #E4E4E7;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
.dark .btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.25);
  color: #FFFFFF;
  background-color: #14141B;
}
.dark .btn-secondary:focus-visible {
  outline: 2px solid #D4FF00;
  outline-offset: 2px;
}

/* ── 3. Category & Filter Tabs ── */
.tab-pill-active {
  background-color: #09090B;
  color: #FFFFFF;
  font-weight: 700;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.dark .tab-pill-active {
  background-color: #D4FF00;
  color: #000000;
}
.tab-pill-inactive {
  color: #71717A;
}
.tab-pill-inactive:hover {
  color: #09090B;
  background-color: #F4F4F6;
}
.dark .tab-pill-inactive {
  color: #A1A1AA;
}
.dark .tab-pill-inactive:hover {
  color: #FFFFFF;
  background-color: rgba(255, 255, 255, 0.05);
}

/* ── 4. Dual-Theme Kinetic Indicator Dot ── */
.kinetic-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background-color: #09090B;
  flex-shrink: 0;
}
.dark .kinetic-dot {
  background-color: #D4FF00;
}
```

---

## 6. Motion & Micro-Interactions Standards

* **Interactive Underline Draw (`.nav-draw-link`)**:
  * All navbar links and tabs use an animated kinetic underline that draws from left to right on hover (`scaleX(0)` ➔ `scaleX(1)`). Light: `#09090B`, Dark: `#D4FF00`.
* **Tactile Magnetic Buttons (`.btn-magnetic`)**:
  * CTA buttons integrate micro-movement where the indicator arrow shifts 45° (`.btn-arrow translate(3px, -3px)`) with spring physics on hover.
* **Spotlight Bento Cards (`.spotlight-card`)**:
  * Adaptive surfaces (light: `#FFFFFF` with soft zinc border; dark: `#0D0D12` with bevel `inset 0 1px 0 rgba(255,255,255,0.12)`).
* **Authentic K-Pop Editorial 24-Member Hero (`<HeroSection />`)**:
  1. **Lower-Third Anchor Layout**: Monumental `tripleS` typography is anchored in the lower third (`justify-end`), leaving all 24 member faces in the upper photograph unobstructed.
  2. **Zero AI-Slop Gimmicks**: No generic template widgets (digital Seoul KST clocks in corners, mouse capsule "scroll to explore" animations, or forced script typography stacks).
  3. **Mobile Safe-Area**: Photographic focal point locked to `object-[center_28%]` to keep member faces pristine on vertical screen ratios (9:16 / 19.5:9).
  4. **Accessibility (WCAG AAA)**: Visible focus ring (`focus-visible:ring-2 focus-visible:ring-[#D4FF00]`), contrast well gradient >16:1, and reduced motion fallback.
* **GSAP + ScrollTrigger Isolation**:
  * Must be isolated within Client leaf components (`"use client"`) using `gsap.context()` inside `useEffect`, and must include `ctx.revert()` on unmount cleanup.

---

## 7. Purposeful Iconography Architecture

* **Banned Generic AI Icons**:
  * **Prohibited**: Using `Sparkles` icon as generic filler or magic-wand aesthetic.
  * **Prohibited**: Spinning rotation animations on celebration badges (e.g. `animate-spin` on star or sparkle icons).
* **Locked Semantic Mapping**:
  * **Objekts (Photocards / Vault)**: Must use `Layers` (representing stacked physical and digital card decks), never `Sparkles`.
  * **Dimensions (Sub-Units)**: Must use `Boxes` in navigation (representing unit modularity and dimension structures), never duplicate `Users` icons.
  * **Discography / Albums**: Must use `Disc3` (vinyl record disc).
  * **Birthday Celebration**: Must use `Cake` for birthday celebration events.
  * **Empty Search State**: Must use `SearchX` for empty search or filter results.
  * **Dimension Concept Tags**: Must use minimal kinetic indicator dots (`.kinetic-dot`), never decorative sparkles.

---

## 8. Page & Component Specific Locks

### A. Member Profile Pages (`/members/[slug]`)
* **Zero-Scroll Above-the-Fold**: Official concept photo, stage name, S-number, emoji badge, MBTI, and specification matrix integrated directly in the upper viewport.
* **Specification Table**:
  1. `Stage Name (예명 / 활동명)`: Stage name + Hangul.
  2. `Birth Name (본명)`: Full birth name + Hangul + Native Script.
  3. `Birthday (생년월일)`: Formatted date + international age.
  4. `Origin (출생 / 국적)`: Birthplace / nationality.
  5. `Symbol (상징)`: Official emoji & symbol.
  6. `Career (활동 경력)`: History & sub-units.
  7. `History & Bio (이력)`: Curated bio facts.
* **More tripleS Slider**: Touch & mouse drag responsive horizontal slider (`cursor-grab active:cursor-grabbing`) with auto-centering on active member without triggering vertical window scroll jumps.

### B. Birthday Countdown Component (`<BirthdayCountdown />`)
* **Borderless Editorial Layout**: Replaced heavy container boxes and generic timer cards with a typographic time stream (`03d · 03h · 44m · 25s`).
* **Dynamic Member Accent**: Ambient lighting glow and inner rim match the active member's official MODHAUS color.
* **Height Stability**: Fixed height slots for header and announcement text to prevent layout shifts (CLS = 0).
* **Action Buttons**: Uses tokenized `.btn-primary` (Send Wish) and `.btn-secondary` (View Dossier).

### C. Objekts Vault (`/objekts`) & Photocard Modal
* **Collector's Atelier 3D Flip Card**: Showcase pedestal with 3D card flip (front/back) and MODHAUS top foil line.
* **Dropdown Filters**: Standardized trigger buttons and popover options using `font-sans` and Carbon/Voltage active states. No SaaS purple glow.
* **Verified Action Dock**: Shortcode copy action, official COSMO App link, and Apollo Cafe Explorer deep-link.

### D. Consistent Breadcrumb Navigation (`<Breadcrumb />`)
* Centralized in `src/components/breadcrumb.tsx`.
* All subpages must include the breadcrumb beneath the navbar.
* Semantic markup `<nav aria-label="Breadcrumb">` with `<ol>` and `<li>`, separator chevron `aria-hidden="true"`.
* Supports optional action slot (`action?: React.ReactNode`) for contextual controls such as `Prev S# Next` switcher.

### E. 404 Page (`/not-found`)
* Must be theme-adaptive (`bg-[#FAFAFA] dark:bg-[#08080A] text-zinc-950 dark:text-[#F4F4F6]`).
* Clean metadata tag without brackets: `404 • Dimension Not Found`.
* Title typography for `404` must use `font-display font-black`.
* Standardized buttons: `.btn-primary` for Home Directory and `.btn-secondary` for Previous.

---

## 9. Pre-Flight Anti-Slop Quality Gate

Before submitting or committing interface changes, verify this checklist:
- [ ] No unauthorized fonts used (`font-pretendard`, `font-inter`, or generic serifs); only `Syne`, `Manrope`, `Pinyon Script`, and `JetBrains Mono`.
- [ ] All `h1`, `h2`, `h3` headings use `font-display` with weight `font-black`.
- [ ] Catalog H1 titles are locked to a single line (`sm:whitespace-nowrap`) with zero status bars or pills above them.
- [ ] All `Pinyon Script` calligraphic accents (`.font-accent`) include padding `inline-block px-1`.
- [ ] No purple text or AI purple glow in Light Mode (*The Lila Rule*). Light mode kinetic accent is Carbon Ink `#09090B`.
- [ ] Primary CTA buttons use `.btn-primary` (Light: carbon `#09090B`, Dark: acid lime `#D4FF00`).
- [ ] No hardcoded pure dark backgrounds (`#050505` or `#0D0D12`) on theme-adaptive pages or components.
- [ ] No generic `Sparkles` icons or spinning badge animations.
- [ ] All animations respect the `prefers-reduced-motion` media query.
