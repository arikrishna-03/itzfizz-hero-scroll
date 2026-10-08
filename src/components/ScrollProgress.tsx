"use client";

import React, { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Sleek top indicator bar */}
      <div className="h-[2px] w-full bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-accent via-amber-400 to-accent-cyan shadow-[0_0_12px_rgba(255,94,20,0.8)] transition-all duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating HUD telemetry chip positioned cleanly without clashing with navbar */}
      <div className="hidden sm:flex absolute top-4 right-28 sm:right-36 items-center gap-2 px-3 py-1 rounded-full bg-surface/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-neutral-400">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span>STAGE TRACK: {Math.round(progress)}%</span>
      </div>
    </div>
  );
}
