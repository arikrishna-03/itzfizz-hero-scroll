"use client";

import React, { memo } from "react";

interface ParallaxSceneryProps {
  scrollOffsetY: number; // Pixels of road scroll
  nightFactor: number; // 0 = day/twilight, 1 = deep night
}

/**
 * 3-Depth-Layer Roadside Parallax Scenery:
 * - Layer 1 (Far): Distant cyber city skyline & horizon twilight-to-night sky
 * - Layer 2 (Mid): High-tech sponsor billboards & highway lamp posts with light pools
 * - Layer 3 (Near): Curbs, guardrails, and neon chevron markers
 */
const ParallaxScenery = memo(function ParallaxScenery({
  scrollOffsetY,
  nightFactor,
}: ParallaxSceneryProps) {
  // Layer translations
  const farY = (scrollOffsetY * 0.18) % 600;
  const midY = (scrollOffsetY * 0.55) % 900;
  const nearY = (scrollOffsetY * 1.0) % 1200;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* ============================================================== */}
      {/* LAYER 1: FAR BACKGROUND (City Skyline & Dynamic Day/Night Sky) */}
      {/* ============================================================== */}
      <div
        className="absolute inset-x-0 top-0 h-full transition-colors duration-500"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(${Math.round(10 - 5 * nightFactor)}, ${Math.round(14 - 8 * nightFactor)}, ${Math.round(26 - 15 * nightFactor)}, 1) 0%, 
            rgba(${Math.round(28 - 20 * nightFactor)}, ${Math.round(18 - 14 * nightFactor)}, ${Math.round(40 - 28 * nightFactor)}, 0.8) 60%, 
            #08090d 100%)`,
        }}
      >
        {/* Distant horizon warm twilight glow (fades out as night deepens) */}
        <div
          className="absolute inset-x-0 bottom-[40%] h-[300px] pointer-events-none transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255, 94, 20, 0.25) 0%, rgba(120, 40, 90, 0.15) 50%, transparent 80%)",
            opacity: 1 - nightFactor * 0.85,
          }}
        />

        {/* Distant Cyber City Skyline Silhouettes */}
        <div
          className="absolute inset-x-0 bottom-[20%] flex justify-between px-4 opacity-25 will-change-transform"
          style={{
            transform: `translate3d(0, ${farY * 0.2}px, 0)`,
          }}
        >
          {/* Left Skyline Cluster */}
          <div className="flex items-end gap-2">
            <div className="w-8 h-40 bg-neutral-900 border-t border-cyan-500/30" />
            <div className="w-12 h-64 bg-neutral-950 border-t border-accent/40 relative">
              <span className="absolute top-1 left-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="w-10 h-48 bg-neutral-900" />
            <div className="w-14 h-80 bg-neutral-950 border-t border-white/20" />
          </div>

          {/* Right Skyline Cluster */}
          <div className="flex items-end gap-2">
            <div className="w-14 h-72 bg-neutral-950 border-t border-accent/30" />
            <div className="w-8 h-44 bg-neutral-900 relative">
              <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="w-12 h-60 bg-neutral-950 border-t border-cyan-500/20" />
            <div className="w-10 h-36 bg-neutral-900" />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* LAYER 2: MIDGROUND (Billboards & Streetlamp Posts)             */}
      {/* ============================================================== */}
      <div
        className="absolute inset-y-0 inset-x-0 will-change-transform"
        style={{
          transform: `translate3d(0, ${midY}px, 0)`,
        }}
      >
        {/* Repeating Billboards along left & right highway flanks */}
        {[-300, 300, 900].map((offset, i) => (
          <React.Fragment key={i}>
            {/* Left Sponsor Billboard */}
            <div
              className="absolute left-4 sm:left-12 w-44 sm:w-56 p-2.5 rounded-xl bg-surface-dark/90 border border-white/10 shadow-cardGlass backdrop-blur-md"
              style={{ top: `${offset}px` }}
            >
              <div className="flex items-center justify-between text-[8px] font-mono text-accent mb-1">
                <span>ITZFIZZ SPEED LABS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              </div>
              <p className="font-heading font-black text-xs text-white uppercase tracking-wider leading-tight">
                {i % 2 === 0 ? "TELEMETRY ENGINE" : "ZERO LATENCY FLOW"}
              </p>
              <div className="w-full h-0.5 bg-gradient-to-r from-accent to-transparent mt-1.5" />
            </div>

            {/* Right Highway Lamp Post with Light Pool */}
            <div
              className="absolute right-4 sm:right-16 flex flex-col items-center"
              style={{ top: `${offset + 180}px` }}
            >
              {/* Lamp Mast Arm */}
              <div className="w-2.5 h-20 bg-neutral-800 rounded-t-md border-r border-white/10 relative">
                <div className="absolute -left-6 top-0 w-8 h-3 bg-neutral-900 rounded-l-md border-b border-amber-300" />
                {/* Glowing Lamp Bulb */}
                <div
                  className="absolute -left-5 top-2 w-4 h-4 rounded-full transition-opacity duration-300"
                  style={{
                    background: "radial-gradient(circle, #fff7c2 0%, #ffbe3b 60%, transparent 100%)",
                    filter: "blur(2px)",
                    boxShadow: "0 0 25px 8px rgba(255, 190, 59, 0.65)",
                    opacity: 0.4 + nightFactor * 0.6,
                  }}
                />
              </div>

              {/* Roadside Ground Light Pool */}
              <div
                className="w-32 h-20 rounded-full bg-amber-400/10 blur-xl -mt-6 pointer-events-none transition-opacity duration-300"
                style={{ opacity: 0.3 + nightFactor * 0.7 }}
              />
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ============================================================== */}
      {/* LAYER 3: FOREGROUND VERGES (Curbs, Guardrails & Chevrons)      */}
      {/* ============================================================== */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-4xl will-change-transform"
        style={{
          transform: `translate3d(0, ${nearY}px, 0)`,
        }}
      >
        {/* Left Guardrail Posts & Chevrons */}
        <div className="absolute left-0 top-[-600px] bottom-[-600px] w-6 flex flex-col justify-around opacity-70">
          {Array.from({ length: 16 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <div className="w-2.5 h-12 bg-neutral-700 border-l border-white/20 rounded-sm" />
              {idx % 3 === 0 && (
                <div className="w-4 h-6 bg-accent rounded-sm flex items-center justify-center shadow-[0_0_8px_#ff5e14]">
                  <span className="text-[9px] font-black text-black">›</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Guardrail Posts & Chevrons */}
        <div className="absolute right-0 top-[-600px] bottom-[-600px] w-6 flex flex-col justify-around opacity-70">
          {Array.from({ length: 16 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-end gap-1">
              {idx % 3 === 0 && (
                <div className="w-4 h-6 bg-accent rounded-sm flex items-center justify-center shadow-[0_0_8px_#ff5e14]">
                  <span className="text-[9px] font-black text-black">‹</span>
                </div>
              )}
              <div className="w-2.5 h-12 bg-neutral-700 border-r border-white/20 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ParallaxScenery;
