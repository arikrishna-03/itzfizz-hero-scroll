"use client";

import React, { memo } from "react";
import { TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react";

export interface GateData {
  id: string;
  gateNumber: number;
  progressTrigger: number; // e.g. 0.18, 0.40, 0.62, 0.84
  targetValue: number;
  suffix: string;
  title: string;
  direction: "up" | "down";
  badge: string;
}

interface StatGateProps {
  gate: GateData;
  isPassed: boolean;
  isFlashing: boolean;
  displayValue: number;
  className?: string;
}

const StatGate = memo(function StatGate({
  gate,
  isPassed,
  isFlashing,
  displayValue,
  className = "",
}: StatGateProps) {
  const isUp = gate.direction === "up";
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto px-4 select-none pointer-events-none will-change-transform ${className}`}
    >
      {/* ============================================================== */}
      {/* OVERHEAD RACING GANTRY & LASER CHECKPOINT BEAM                 */}
      {/* ============================================================== */}
      <div className="relative w-full flex flex-col items-center">
        {/* Overhead Gantry Truss Frame */}
        <div
          className={`relative z-20 w-full rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
            isFlashing
              ? "bg-white text-black shadow-[0_0_80px_#ffffff] scale-105 border-2 border-white"
              : isPassed
              ? "bg-surface/90 backdrop-blur-xl border-2 border-accent shadow-gateGlow"
              : "bg-surface/75 backdrop-blur-md border border-white/10 shadow-cardGlass"
          }`}
        >
          {/* Top Telemetry Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase ${
                  isPassed ? "bg-accent text-white" : "bg-white/10 text-neutral-400"
                }`}
              >
                GATE 0{gate.gateNumber}
              </span>
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider hidden sm:inline">
                {gate.badge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isPassed ? (
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CLEARED
                </span>
              ) : (
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest animate-pulse">
                  APPROACHING
                </span>
              )}
            </div>
          </div>

          {/* Central Stat Presentation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Animated Large Metric Number */}
            <div className="flex items-baseline gap-1.5">
              <span
                className={`font-heading font-black text-4xl sm:text-6xl md:text-7xl tracking-tighter transition-colors duration-200 ${
                  isFlashing
                    ? "text-black"
                    : isPassed
                    ? "text-white drop-shadow-[0_0_25px_rgba(255,94,20,0.6)]"
                    : "text-neutral-300"
                }`}
              >
                {displayValue}
              </span>
              <span
                className={`font-heading font-bold text-3xl sm:text-4xl ${
                  isFlashing ? "text-black" : "text-accent"
                }`}
              >
                {gate.suffix}
              </span>
            </div>

            {/* Impact Description & Trend Pill */}
            <div className="flex flex-col sm:items-end">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold mb-1 w-fit ${
                  isUp
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isUp ? "+Gain Metric" : "-Friction Index"}</span>
              </div>
              <p
                className={`text-xs sm:text-sm font-sans max-w-sm sm:text-right leading-snug transition-colors ${
                  isFlashing ? "text-neutral-900 font-semibold" : "text-neutral-300"
                }`}
              >
                {gate.title}
              </p>
            </div>
          </div>

          {/* Gantry Warning Strobe Lights */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPassed
                    ? "bg-accent shadow-[0_0_8px_#ff5e14] animate-pulse"
                    : "bg-neutral-600"
                }`}
              />
              <span
                className={`w-2 h-2 rounded-full ${
                  isPassed
                    ? "bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-pulse"
                    : "bg-neutral-600"
                }`}
              />
            </div>
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
              ITZFIZZ VELOCITY CHECKPOINT // SECTOR {gate.gateNumber}
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROAD LASER CURTAIN / CHECKPOINT TRANSIT LINE                  */}
        {/* ============================================================== */}
        <div className="relative w-full h-8 flex items-center justify-center -mt-1 overflow-visible">
          {/* Neon laser line on tarmac */}
          <div
            className={`w-full h-1 rounded-full transition-all duration-300 ${
              isFlashing
                ? "bg-white shadow-[0_0_30px_#ffffff] scale-y-150"
                : isPassed
                ? "bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_20px_#ff5e14]"
                : "bg-gradient-to-r from-transparent via-white/30 to-transparent"
            }`}
          />

          {/* Holographic light curtain pulse */}
          <div
            className={`absolute inset-0 bg-gradient-to-b from-accent/25 to-transparent transition-opacity duration-300 pointer-events-none ${
              isPassed ? "opacity-100" : "opacity-20"
            }`}
          />
        </div>
      </div>
    </div>
  );
});

export default StatGate;
