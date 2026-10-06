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
        background: "#08090d",
        surface: {
          light: "#161922",
          DEFAULT: "#0f1118",
          dark: "#0a0b10",
        },
        accent: {
          DEFAULT: "#ff5e14", // McLaren Papaya / dynamic neon
          glow: "#ff8438",
          cyan: "#00f0ff",
        },
        border: "rgba(255, 255, 255, 0.08)",
        borderHighlight: "rgba(255, 94, 20, 0.4)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(255, 94, 20, 0.35)",
        carGlow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(255, 94, 20, 0.25)",
        cardGlass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
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
