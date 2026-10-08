"use client";

import React, { memo } from "react";
import { Zap, Flag, Award, Compass } from "lucide-react";

export interface HUDProps {
  velocity: number; // 0 to 1 normalized
  speedKmh: number; // 0 to 380+
  gear: number; // 1 to 7
  scrollProgress: number; // 0 to 1
  checkpointsCleared: number; // 0 to 4
  isBoosting: boolean;
  boostAvailable: boolean;
  activeToast: { id: number; title: string; subtitle: string } | null;
  onMobileBoostToggle?: (active: boolean) => void;
}

const HUD = memo(function HUD({
  velocity,
  speedKmh,
  gear,
  scrollProgress,
  checkpointsCleared,
  isBoosting,
  boostAvailable,
  activeToast,
  onMobileBoostToggle,
}: HUDProps) {
  // Speedometer needle angle: -125deg (at 0 KM/H) to +125deg (at 400 KM/H)
  const maxSpeed = 380;
  const needleAngle = -125 + Math.min(1, speedKmh / maxSpeed) * 250;

  // Track milestones (gates at 18%, 40%, 62%, 84%)
  const gateMilestones = [0.18, 0.4, 0.62, 0.84];

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-30 flex flex-col justify-between p-3 sm:p-6 overflow-hidden">
      {/* ============================================================== */}
      {/* 1. TOP BAR: ROUTE PROGRESS & CHECKPOINT TOAST NOTIFICATION     */}
      {/* ============================================================== */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-2">
        {/* Checkpoint Pop Toast */}
        <div
          role="status"
          aria-live="polite"
          className={`transition-all duration-300 transform ${
            activeToast
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-6 scale-95 pointer-events-none"
          }`}
        >
          {activeToast && (
            <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5 rounded-2xl bg-surface/90 backdrop-blur-xl border border-accent/60 shadow-glow text-white">
              <div className="w-7 h-7 rounded-xl bg-accent flex items-center justify-center text-white font-black text-xs shadow-md animate-pulse">
                <Award className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xs sm:text-sm tracking-wider uppercase text-accent">
                  {activeToast.title}
                </span>
                <span className="font-sans text-[11px] sm:text-xs text-neutral-200">
                  {activeToast.subtitle}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Global Track Progress Bar */}
        <div className="w-full max-w-xl px-4 py-2 rounded-2xl bg-surface/85 backdrop-blur-md border border-white/10 shadow-hudGlass">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
              <Compass className="w-3 h-3 text-accent" />
              Stage Route
            </span>
            <span className="text-accent font-bold">
              {Math.round(scrollProgress * 100)}% COMPLETE
            </span>
          </div>

          {/* Progress Track Line with Gate Pips */}
          <div className="relative w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
            {/* Filled Bar */}
            <div
              className="h-full bg-gradient-to-r from-accent via-amber-400 to-accent-cyan transition-all duration-75"
              style={{ width: `${Math.min(100, scrollProgress * 100)}%` }}
            />

            {/* Checkpoint Gate Markers */}
            {gateMilestones.map((p, idx) => {
              const isPassed = scrollProgress >= p;
              return (
                <div
                  key={idx}
                  className={`absolute top-0 bottom-0 w-1.5 -ml-0.5 rounded-full transition-colors duration-200 ${
                    isPassed ? "bg-emerald-400 shadow-[0_0_8px_#10b981]" : "bg-white/30"
                  }`}
                  style={{ left: `${p * 100}%` }}
                  title={`Checkpoint ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Bottom stats row */}
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">GATES:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((num) => (
                  <span
                    key={num}
                    className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold ${
                      checkpointsCleared >= num
                        ? "bg-accent text-white shadow-[0_0_8px_rgba(255,94,20,0.8)]"
                        : "bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-neutral-400">
              <Flag className="w-3 h-3 text-neutral-400" />
              <span>RECORD RUN</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. BOTTOM COCKPIT CLUSTER: SPEEDOMETER, GEAR, NITRO & CONTROLS */}
      {/* ============================================================== */}
      <div className="w-full max-w-5xl mx-auto flex items-end justify-between gap-3">
        {/* LEFT: SPEEDOMETER ARC GAUGE & DIGITAL TELEMETRY */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface/85 backdrop-blur-md border border-white/10 shadow-hudGlass">
          {/* Gauge Dial SVG */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Outer track arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="6"
                strokeDasharray="188 62"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* Active velocity arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={isBoosting ? "#00f0ff" : "#ff5e14"}
                strokeWidth="6"
                strokeDasharray="188 62"
                strokeDashoffset={`${188 - (Math.min(1, speedKmh / maxSpeed) * 188)}`}
                strokeLinecap="round"
                className="transition-all duration-75"
              />
            </svg>

            {/* Rotating Speed Needle */}
            <div
              className="absolute inset-0 flex items-center justify-center will-change-transform transition-transform duration-75"
              style={{
                transform: `rotate(${needleAngle}deg)`,
              }}
            >
              <div className="w-1 h-9 sm:h-11 bg-gradient-to-t from-transparent via-white to-accent rounded-full -translate-y-4 shadow-[0_0_8px_#ff5e14]" />
              <div className="absolute w-3 h-3 rounded-full bg-white border-2 border-accent" />
            </div>

            {/* Digital Speed Number Overlay */}
            <div className="absolute flex flex-col items-center justify-center mt-6">
              <span className="font-heading font-black text-xs sm:text-sm text-neutral-300">
                KM/H
              </span>
            </div>
          </div>

          {/* Digital Readout & Current Gear */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tighter">
                {Math.round(speedKmh)}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">KM/H</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {/* Gear Display */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-surface-light border border-white/10">
                <span className="text-[9px] font-mono text-neutral-400">GEAR</span>
                <span className="font-heading font-black text-sm text-accent">
                  {gear}
                </span>
              </div>

              {/* Status Pill */}
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isBoosting
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse"
                    : speedKmh > 260
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : "bg-white/5 text-neutral-400 border border-white/5"
                }`}
              >
                {isBoosting ? "NITRO BURST" : speedKmh > 260 ? "OVERDRIVE" : "CRUISE"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: NITRO BOOST STATUS & INTERACTIVE MOBILE PEDAL */}
        <div className="flex flex-col items-end gap-2">
          {/* Desktop Nitro Gauge */}
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-surface/85 backdrop-blur-md border border-white/10 shadow-hudGlass">
            <Zap
              className={`w-4 h-4 ${
                isBoosting ? "text-cyan-400 animate-spin" : "text-amber-400"
              }`}
            />
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-3 text-[10px] font-mono">
                <span className="text-neutral-400 uppercase tracking-wider">
                  NITRO [SPACE]
                </span>
                <span className={isBoosting ? "text-cyan-300 font-bold" : "text-amber-400 font-bold"}>
                  {isBoosting ? "ENGAGED" : "READY"}
                </span>
              </div>
              <div className="w-28 h-1.5 bg-neutral-900 rounded-full overflow-hidden mt-1 border border-white/5">
                <div
                  className={`h-full transition-all duration-75 ${
                    isBoosting
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500 w-full animate-pulse shadow-[0_0_10px_#00f0ff]"
                      : "bg-gradient-to-r from-amber-400 to-accent w-full"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Interactive Mobile Nitro Boost Pedal (pointer-events-auto) */}
          <button
            type="button"
            aria-label="Activate Nitro Boost"
            onPointerDown={() => onMobileBoostToggle?.(true)}
            onPointerUp={() => onMobileBoostToggle?.(false)}
            onPointerLeave={() => onMobileBoostToggle?.(false)}
            onTouchStart={() => onMobileBoostToggle?.(true)}
            onTouchEnd={() => onMobileBoostToggle?.(false)}
            className={`pointer-events-auto sm:hidden flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl font-heading font-black text-xs tracking-wider uppercase border transition-all active:scale-95 shadow-lg ${
              isBoosting
                ? "bg-cyan-500 text-black border-cyan-300 shadow-[0_0_20px_#00f0ff]"
                : "bg-surface/90 text-white border-white/20 active:bg-accent"
            }`}
          >
            <Zap className="w-4 h-4 text-cyan-300" />
            <span>BOOST</span>
          </button>

          {/* Controls Prompt Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-surface/70 backdrop-blur-md border border-white/5 text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
            <span>[A/D or MOUSE] STEER</span>
            <span className="text-neutral-600">•</span>
            <span>[SCROLL] DRIVE</span>
            <span className="text-neutral-600">•</span>
            <span className="text-accent">[SPACE] NITRO</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default HUD;
