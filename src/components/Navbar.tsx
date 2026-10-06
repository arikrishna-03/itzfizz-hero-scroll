"use client";

import React from "react";
import { Gauge, Sparkles, Compass } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand logo */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-amber-500 p-0.5 shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-surface-dark rounded-[6px] flex items-center justify-center">
              <Gauge className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-sm tracking-widest text-white uppercase">
              ITZFIZZ
            </span>
            <span className="text-[9px] font-mono tracking-wider text-accent uppercase">
              Kinetic Engine
            </span>
          </div>
        </div>

        {/* Central status pill */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/70 backdrop-blur-xl border border-white/10 text-xs font-mono text-neutral-300">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>SCROLL-DRIVEN DYNAMICS</span>
          <span className="text-neutral-500">|</span>
          <span className="text-emerald-400">60 FPS REALTIME</span>
        </div>

        {/* Action button */}
        <div className="pointer-events-auto">
          <a
            href="#about"
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-200 bg-white/5 hover:bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 hover:border-accent/50 hover:text-white"
          >
            <Compass className="w-3.5 h-3.5 text-accent" />
            <span>Explore</span>
          </a>
        </div>
      </div>
    </header>
  );
}
