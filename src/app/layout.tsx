import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#08090d",
};

export const metadata: Metadata = {
  title: "WELCOME ITZFIZZ — Scroll-Driven Automotive Hero",
  description:
    "High-performance scroll-driven automotive hero section animation built with Next.js, Tailwind CSS, and GSAP ScrollTrigger.",
  keywords: ["GSAP", "ScrollTrigger", "Next.js", "Tailwind CSS", "Scroll Animation", "ITZFIZZ"],
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body className="bg-background text-neutral-100 min-h-screen selection:bg-accent selection:text-white">
        <SmoothScroll>
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
