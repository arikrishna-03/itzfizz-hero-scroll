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
        background: "var(--bg-color, #0A0A0A)",
        offwhite: "var(--text-primary, #F5F5F7)",
        muted: "var(--text-muted, rgba(245, 245, 247, 0.6))",
        subtle: "rgba(245, 245, 247, 0.35)",
        surface: {
          DEFAULT: "rgba(18, 18, 20, 0.7)",
          card: "rgba(255, 255, 255, 0.03)",
        },
        divider: "var(--divider-color, rgba(255, 255, 255, 0.12))",
        accent: {
          DEFAULT: "var(--accent-color, #C6FF3D)",
          lime: "#C6FF3D",
          blue: "#00E5FF",
          glow: "var(--accent-glow, rgba(198, 255, 61, 0.25))",
          bright: "var(--accent-glow-bright, rgba(198, 255, 61, 0.8))",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "power2-inout": "cubic-bezier(0.45, 0, 0.55, 1)",
      },
      letterSpacing: {
        "ultra-wide": "0.5em",
        "scroll-wide": "0.9em",
      },
    },
  },
  plugins: [],
};

export default config;
