import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary, #08090d)",
        asphalt: {
          DEFAULT: "var(--asphalt, #0d1017)",
          dark: "#06070a",
          light: "#161922",
          track: "#0a0c12",
        },
        surface: {
          light: "#1a1d27",
          DEFAULT: "var(--bg-secondary, #0f1118)",
          dark: "#0a0b10",
        },
        accent: {
          DEFAULT: "var(--accent-papaya, #ff5e14)", // McLaren Papaya
          glow: "#ff8438",
          hot: "#ff3b00",
          cyan: "var(--accent-cyan, #00f0ff)",
          electric: "#00d4ff",
        },
        nitro: {
          DEFAULT: "#00f0ff",
          glow: "#70f5ff",
          purple: "#a855f7",
        },
        gate: {
          flash: "#ffffff",
          active: "#ff5e14",
          success: "#10b981",
        },
        border: "rgba(255, 255, 255, 0.08)",
        borderHighlight: "rgba(255, 94, 20, 0.4)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(255, 94, 20, 0.45)",
        glowCyan: "0 0 40px -10px rgba(0, 240, 255, 0.45)",
        carGlow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(255, 94, 20, 0.25)",
        cardGlass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        hudGlass: "0 10px 40px -10px rgba(0, 0, 0, 0.65), 0 0 1px 1px rgba(255, 255, 255, 0.1)",
        gateGlow: "0 0 50px rgba(255, 94, 20, 0.6)",
      },
      backgroundImage: {
        "radial-dark": "radial-gradient(circle at 50% 40%, rgba(30, 36, 54, 0.45) 0%, rgba(8, 9, 13, 0.95) 70%, #08090d 100%)",
        "grid-pattern": "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
