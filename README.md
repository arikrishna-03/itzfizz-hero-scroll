# ITZFIZZ — Scroll-Driven Automotive Hero Section Animation

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-green?logo=greensock)](https://greensock.com/gsap/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A reproduction and elevated implementation of the scroll-driven hero section inspired by [paraschaturvedi.github.io/car-scroll-animation](https://paraschaturvedi.github.io/car-scroll-animation).

Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **GSAP ScrollTrigger**, integrated with **Lenis** smooth momentum scrolling, and optimized for **GitHub Pages Static Export**.

---

## 🏎️ Key Features

1. **First-Screen Layout (`100svh`)**:
   - Spaced, responsive headline: `W E L C O M E   I T Z F I Z Z` rendered with individual character `<span>` tokens for staggered animation.
   - 4 impact metrics below the fold line:
     - **58%** — *Increase in pick up point use*
     - **23%** — *Decrease in customer phone calls*
     - **27%** — *Increase in pick up point use*
     - **40%** — *Decrease in customer phone calls*
   - Top-down supercar visual with dual forward headlight illumination, papaya underglow aura, and rear exhausts.

2. **Initial Load Sequence (~2s Timeline)**:
   - Headline letters fade in from `translateY(40px)` with optical blur-to-sharp settling (`power3.out`).
   - Car glides into starting position on the tarmac.
   - Stat cards stagger into view (`opacity: 0 -> 1`, `y: 35 -> 0`), and numbers count up smoothly from `0` to their respective targets.

3. **Deterministic Scroll-Driven Kinematics (Core Feature)**:
   - Hero pinned with `ScrollTrigger` across `350vh` of virtual travel distance.
   - Fully scrubbed timeline (`scrub: 1.2` with Lenis lerp smoothing): **Zero time-based autoplay**.
   - The supercar follows a multi-phase S-curve trajectory:
     - **Stage 1 (0% - 30%)**: Forward acceleration with banking tilt (-5°). Left stat cards elevate and glow.
     - **Stage 2 (30% - 65%)**: Sweeping cross-center drift (7°), passing by the right stat cards with dynamic highlight traces. Road lines rush backward at velocity.
     - **Stage 3 (65% - 100%)**: High-speed realign, downward exit, and seamless transition into the subsequent content section.
   - **Reversible**: Scrolling up exactly and faithfully reverses the animation at every frame.

4. **Performance & Standards**:
   - Animates exclusively GPU-composited properties: `transform` (`x`, `y`, `rotate`, `scale`) and `opacity`.
   - `will-change: transform` and `force3D: true`.
   - Fully accessible: `aria-label` on headline, respects `prefers-reduced-motion` media queries.
   - Clean lifecycle management: `gsap.context()` ensures zero memory leaks on unmount.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Static Export `output: 'export'`)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation Engine**: [GSAP](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Smooth Momentum**: [Lenis](https://lenis.darkroom.engineering/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Architecture

```
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions automated Pages deployment
├── public/
│   ├── car-top.png            # High-res top-view supercar asset
│   └── car-top.jpg            # Optimized asset fallback
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind directives, fonts, GPU tokens
│   │   ├── layout.tsx         # Root layout, Google fonts, metadata
│   │   └── page.tsx           # Assembled page
│   ├── components/
│   │   ├── Hero.tsx           # Pinned scroll hero, GSAP master timelines
│   │   ├── Headline.tsx       # Character-wrapped fluid headline
│   │   ├── StatsGrid.tsx      # Responsive metrics grid
│   │   ├── StatCard.tsx       # Glassmorphism stat card & counter hooks
│   │   ├── CarVisual.tsx      # Supercar visual + headlights + SVG fallback
│   │   ├── Navbar.tsx         # HUD telemetry header
│   │   ├── ScrollProgress.tsx # Realtime scroll bar + percentage indicator
│   │   ├── AboutSection.tsx   # Subsequent telemetry showcase
│   │   ├── Footer.tsx         # Footer with reference links & top jump
│   │   └── SmoothScroll.tsx   # Lenis integration with GSAP ticker
│   ├── hooks/
│   │   └── useReducedMotion.ts# Accessible motion detection hook
│   └── lib/
│       └── gsap.ts            # Client-side GSAP & ScrollTrigger registration
├── next.config.mjs            # Static export configuration & basePath resolution
├── tailwind.config.ts         # Automotive noir theme tokens
└── tsconfig.json              # TypeScript compilation rules
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18.x or 20.x
- npm / pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/itzfizz-scroll-animation.git
cd itzfizz-scroll-animation

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Static Build & Testing

To test the GitHub Pages static export locally:

```bash
# Generate the static HTML/CSS/JS export in /out
npm run build
```

The output directory `./out` contains the completely static, zero-server bundle ready to be hosted on GitHub Pages, Cloudflare Pages, Vercel, or Netlify.

---

## 🌐 Deploying to GitHub Pages

1. Push your repository to GitHub (`main` branch).
2. Go to **Settings** > **Pages** in your repository.
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and deploy your site on every push to `main`.
