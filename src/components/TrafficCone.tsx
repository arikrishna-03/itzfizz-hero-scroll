"use client";

import React, { memo } from "react";

export interface ConeData {
  id: string;
  x: number; // Pixels relative to road center (-180 to 180)
  progress: number; // 0 to 1 road progress trigger
  isKnocked: boolean;
  knockDirection: number; // -1 (left) or 1 (right)
}

interface TrafficConeProps {
  cone: ConeData;
  className?: string;
}

const TrafficCone = memo(function TrafficCone({
  cone,
  className = "",
}: TrafficConeProps) {
  return (
    <div
      className={`absolute pointer-events-none select-none will-change-transform transition-all duration-300 ${className}`}
      style={{
        transform: cone.isKnocked
          ? `translate3d(${cone.knockDirection * 35}px, 20px, 0) rotate(${
              cone.knockDirection * 65
            }deg) scale(0.9)`
          : "translate3d(0, 0, 0) rotate(0deg) scale(1)",
        transformOrigin: "center bottom",
      }}
    >
      {/* Floating point bonus toast on hit */}
      {cone.isKnocked && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-amber-500 text-black font-mono font-black text-[9px] shadow-glow animate-bounce">
          +50 APEX
        </div>
      )}

      {/* Traffic Cone SVG */}
      <svg
        viewBox="0 0 40 46"
        className="w-8 h-9 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rubber Square Base */}
        <path d="M 4,40 L 36,40 L 34,44 L 6,44 Z" fill="#1b1d24" stroke="#000000" strokeWidth="1" />
        <ellipse cx="20" cy="40" rx="15" ry="3.5" fill="#2d313d" />

        {/* Orange Cone Body */}
        <path d="M 12,38 L 18,6 L 22,6 L 28,38 Z" fill="#ff5722" />

        {/* White Reflective Band 1 */}
        <path d="M 14,30 L 16,20 L 24,20 L 26,30 Z" fill="#ffffff" />

        {/* White Reflective Band 2 */}
        <path d="M 17,14 L 18,10 L 22,10 L 23,14 Z" fill="#ffffff" />

        {/* Top Rim */}
        <ellipse cx="20" cy="6" rx="2" ry="1" fill="#e64a19" />
      </svg>
    </div>
  );
});

export default TrafficCone;
