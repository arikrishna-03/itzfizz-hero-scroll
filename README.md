# ITZFIZZ — Hyper-Cinematic Animated Hero Section

A production-grade, scroll-driven interactive hero section built for **ITZFIZZ**. Engineered with sub-millisecond motion choreography, GPU-accelerated compositing pipelines, and WCAG AA accessibility standards.

---

## 1. Deliverables Overview

This project includes three production-ready implementations matching the identical choreography and timing constants:

| Deliverable | Technology Stack | Entry Points & Key Files |
| :--- | :--- | :--- |
| **A) Next.js + Tailwind (Primary)** | Next.js 15 (App Router), React 19, `@gsap/react` `useGSAP`, Tailwind CSS | `src/app/page.tsx`<br>`src/app/layout.tsx`<br>`src/components/Hero.tsx`<br>`src/components/StatCounter.tsx`<br>`src/lib/gsap.ts` |
| **B) Plain HTML + CSS + JS (Fallback)** | HTML5, Vanilla CSS3, Modern ES2022, GSAP 3 CDN, Bootstrap 5.3 Grid | `index.html`<br>`server.js` |
| **C) WordPress Theme Template (Optional)** | PHP 8+, WordPress Template Hierarchy, Bootstrap 5 Grid, GSAP 3 | `wordpress/template-parts/hero.php`<br>`wordpress/functions.php`<br>`wordpress/assets/css/hero.css`<br>`wordpress/assets/js/hero.js` |

---

## 2. Quick Start & Running Locally

### Running the Next.js Production App
```bash
# Install dependencies (including GSAP and @gsap/react)
npm install

# Start Next.js development server
npx next dev -p 3000

# Run static production build & export
npx next build
```

### Running the Plain HTML / Static Variant
```bash
# Run lightweight Node HTTP static server
node server.js
# Access at: http://localhost:3000
```

---

## 3. Architecture & Choreography Specification

### A. Layout (Above the Fold)
- **Viewport Lock:** Hero fills exactly the initial screen (`min-height: 100svh`, utilizing modern `svh` units to prevent mobile browser URL bar reflows).
- **Dark Theme:** Near-black `#0A0A0A` background, off-white `#F5F5F7` typography, high-voltage Lime `#C6FF3D` primary accent (with Electric Blue `#00E5FF` toggle).
- **Headline:** `"W E L C O M E   I T Z F I Z Z"` rendered with individual letter `<span>` masks, bold geometric sans (`Space Grotesk`), starting at `0.2em` letter-spacing and easing to `0.5em`.
- **Main Visual Object:** Large transparent PNG (`/car-transparent.png`) centered between the ambient pulsing radial glow and the metrics panel.
- **Impact Metrics:** 4 impact stats (58%, 23%, 27%, 40%) in a 4-column desktop layout and automatic 2x2 grid on mobile screens.

### B. Master Load Timeline (~3.5s sequence)
```
0.00s  [Background & Glow]  Fades in from black (0.6s). Radial glow begins 8s loop pulse.
0.20s  [Visual Object]     Main hero object scales and arrives smoothly.
0.30s  [Headline Reveal]   Label "headline": Letters rise from mask (yPercent 100 -> 0, blur 6px -> 0).
       [Letter Spacing]    Letter-spacing breathes outward from 0.2em to 0.5em (1.3s duration).
1.60s  [Accent Line]       Thin accent line draws left-to-right beneath headline (scaleX 0 -> 1, 0.8s).
2.00s  [Stats Sequence]    Label "stats": Blocks rise in staggered sequence (0.18s apart).
       [Dividers]          Vertical divider lines draw in (scaleY 0 -> 1, 0.6s) before numbers.
       [Counters]          Numbers count up 0 to target over 1.6s with easeOutExpo (tabular-nums).
3.50s  [Settled State]     Everything settled; scroll-based scrubbing enabled.
```

### C. 300% Pinned Scroll Choreography
Intro animations control each element's **OUTER wrapper**, while scroll scrub controls the **INNER wrapper**. This architectural separation prevents transform collisions.

- **0.00 - 0.10 (HOLD):** Dead zone for micro-scrolls; composition holds steady at rest.
- **0.10 - 0.55 (PHASE 1 - TRAVEL):**
  - **Visual Object:** Travels horizontally from `-30vw` to `+30vw` with a `4vh` upward arc at midpoint, banking rotation `-4deg` to `+4deg`, scaling `0.9` to `1.15`.
  - **Headline:** Letter-spacing widens dynamically from `0.5em` to `0.9em`.
  - **Radial Glow:** Tracks behind the visual object at `0.4x` parallax speed.
- **0.55 - 0.90 (PHASE 2 - DEPTH):**
  - **Visual Object:** Scales `1.15` to `1.4`, settles back to center, applies subtle `3px` camera blur (desktop only).
  - **Headline:** Lifts `-60px` and fades `1` to `0`.
  - **Stats:** Drifts down with `0.6x` parallax, opacity easing to `0.4`.
  - **Glow:** Scales `1.0` to `1.5` and disperses.
- **0.90 - 1.00 (RELEASE):** Pinned container cleanly releases into subsequent narrative content.

---

## 4. Configuration & Tweak Guide

All timing, distance, and easing parameters are exposed at the top of the animation files (`src/components/Hero.tsx` and `index.html`):

```typescript
export const INTRO = {
  letterStagger: 0.045,  // Stagger per letter (seconds)
  letterDuration: 1.0,   // Entrance duration per letter
  statGap: 0.18,         // Delay between subsequent stat cards
  statDuration: 0.9,     // Rise duration of stat cards
  countDuration: 1.6,    // Numeric count-up duration
  ease: "expo.out",      // Mathematical easeOutExpo
  startDelay: 0.3,       // Delay before headline unmasking starts
};

export const SCROLL = {
  pinDistance: { desktop: "300%", tablet: "250%", mobile: "200%" },
  scrub: 1.2,            // Inertial catch-up smoothness
  travelX: { desktop: 30, tablet: 24, mobile: 16 }, // Horizontal travel distance in vw
  scaleRange: [0.9, 1.4],
  rotateRange: [-4, 4],
  letterSpacingRange: [0.5, 0.9],
  holdStart: 0.10,
  ease: "power2.inOut",
};
```

### Swapping Impact Metrics Data
In `src/components/StatCounter.tsx`:
```typescript
export const STATS_DATA: StatItem[] = [
  { id: "stat-1", value: 58, suffix: "%", label: "Increase in user interaction", ariaLabel: "58 percent..." },
  { id: "stat-2", value: 23, suffix: "%", label: "Increase in revenue", ariaLabel: "23 percent..." },
  { id: "stat-3", value: 27, suffix: "%", label: "Boost in engagement", ariaLabel: "27 percent..." },
  { id: "stat-4", value: 40, suffix: "%", label: "Decrease in bounce rate", ariaLabel: "40 percent..." },
];
```

### Swapping the Visual Object Asset
Place your transparent WebP/PNG image in `public/` (e.g. `public/my-product.png`) and update the `<Image>` tag in `src/components/Hero.tsx`:
```tsx
<Image
  src="/my-product.png"
  alt=""
  priority
  aria-hidden="true"
  width={800}
  height={400}
  className="hero-visual-obj w-[clamp(240px,46vw,680px)] h-auto object-contain"
/>
```

---

## 5. Micro-Interactions & Features

- **Stat Card Hover:** Hovering a stat block shifts the number to pure white with luminous drop shadow, illuminates the adjacent divider line in accent color, and translates the card `-6px` upward.
- **Letter Hover:** Hovering any headline character applies a pop animation, highlighting the letter in accent tone with soft glow.
- **Desktop Glow Follower:** On pointer-fine devices, the ambient radial glow gently tracks mouse movement (interpolated using `gsap.quickTo` for zero garbage collection).
- **Debug HUD:** Append `?debug` to the URL (e.g., `http://localhost:3000/?debug`) to activate a real-time HUD displaying scroll progress (`0.000` to `1.000`), active choreography phases, and ScrollTrigger visual markers.
- **Window Replay Method:** Call `window.replayIntro()` in the browser console or click the `REPLAY` button in the navigation bar to replay the entrance sequence.

---

## 6. Accessibility & Performance Verification

- **Prefers-Reduced-Motion:** Fully respects user OS accessibility settings. Skips letter stagger, scrubbing, and pinning; immediately presents the final settled composition with a simple 0.3s fade and target figures.
- **No-JS / Noscript Fallback:** Native `<noscript>` styles guarantee immediate display of the headline, car object, and final statistics if scripts are disabled.
- **Screen Reader Clarity:** `<h1 aria-label="Welcome Itzfizz">` ensures screen readers read the full headline naturally, ignoring masked spans (`aria-hidden="true"`). Numeric counters expose complete `aria-label="58 percent"` values so intermediate count-up numbers are never read out loud.
- **GPU-First Pipelines:** Only `transform` and `opacity` are animated during scroll. `will-change` is applied exclusively while animating and removed on completion.

---

## 7. Verification Checklist

- [x] Headline and stats visible above the fold at both 1440x900 and 390x844 viewports
- [x] Entrance timeline executes in ~3.5s with zero Flash of Unstyled Content (FOUC)
- [x] Scroll reverses smoothly and freezes when scrolling ceases
- [x] Strict adherence to composited transforms (`x`, `y`, `scale`, `rotate`, `opacity`)
- [x] Zero memory leaks: `@gsap/react` `useGSAP` hook automatically cleans up triggers on unmount
- [x] WordPress theme integration provided in `wordpress/` directory
- [x] Lighthouse-ready performance with WCAG AA contrast compliance
