# ITZFIZZ — Hyper-Cinematic Animated Automotive Experience

A production-grade, scroll-driven interactive hero section built for **ITZFIZZ**. Engineered with sub-millisecond motion choreography, GPU-accelerated compositing pipelines, and WCAG AA accessibility standards.


## 1. Quick Start & Running Locally

### Development Server
```bash
# Start local server at http://localhost:3000
npm run dev

# Or directly using Node.js:
node server.js
```

Once running, navigate to `http://localhost:3000` in any modern web browser.

---

## 2. Technology Stack

- **Structure:** Semantic HTML5 with Bootstrap 5.3 Grid utilities
- **Styling:** Vanilla CSS3 (Custom design tokens, CSS Grid, Flexbox, hardware-accelerated transforms)
- **Animation Engine:** [GSAP 3.12](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Typography:** Space Grotesk (Headlines), Inter (Body copy), JetBrains Mono (Telemetry/Mono metrics)
- **Server:** Node.js native `http` module (zero external dependencies)

---

## 3. Key Features & Choreography

- **Start Line Launch (0 to 1):** The car launches seamlessly from behind the Starting Line.
- **Dynamic 3D Camera Swoop:** Top-down perspective transitions into a 3D street corridor with realistic road reflection and volumetric headlights.
- **Overhead Sector Checkpoint Gates:** Sector 01 (58% Velocity), Sector 02 (23% Inertia), Sector 03 (Apex Integrity), and Finish Line glide overhead along the track with smooth dissolution.
- **Synchronized Storefront Neon Lighting:** Roadside shops illuminate dynamically as the vehicle crosses each sector.
- **Telemetry HUD:** Live status HUD tracking current race sector and clearing metric cards.
- **Theme Switcher:** Instant toggle between High-Voltage Lime (`#C6FF3D`) and Cyber Blue (`#00E5FF`).
