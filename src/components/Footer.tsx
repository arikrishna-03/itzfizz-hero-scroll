"use client";

import React from "react";
import { ArrowUp, ExternalLink } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-background border-t border-white/5 py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-heading font-black text-lg text-white tracking-widest uppercase">
            ITZFIZZ MOTION
          </span>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            Recreated with Next.js, Tailwind CSS & GSAP ScrollTrigger
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://paraschaturvedi.github.io/car-scroll-animation"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-accent" />
            <span>Reference Live Demo</span>
          </a>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-light border border-white/10 text-xs font-mono text-neutral-300 hover:text-white hover:border-accent/40 transition-all cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-accent" />
          </button>
        </div>
      </div>
    </footer>
  );
}
