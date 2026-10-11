import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export const metadata: Metadata = {
  title: "WELCOME ITZFIZZ — Cinematic Hero Experience",
  description:
    "A production-grade, scroll-animated cinematic hero section for ITZFIZZ engineered with GSAP, ScrollTrigger, and Next.js.",
  keywords: ["GSAP", "ScrollTrigger", "Next.js", "Hero Section", "Cinematic", "ITZFIZZ"],
  authors: [{ name: "ITZFIZZ Architecture Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <head>
        <noscript>
          <style>{`
            .hero-char, .hero-stat-block, .hero-visual-obj { opacity: 1 !important; transform: none !important; filter: none !important; }
            .hero-accent-line { transform: scaleX(1) !important; }
            .hero-stat-divider { transform: scaleY(1) !important; }
          `}</style>
        </noscript>
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#0A0A0A] text-[#F5F5F7] min-h-screen selection:bg-[#C6FF3D] selection:text-[#0A0A0A]"
      >
        <div className="film-grain" aria-hidden="true" />
        <main>{children}</main>
      </body>
    </html>
  );
}
