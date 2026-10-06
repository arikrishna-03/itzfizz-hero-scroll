"use client";

import React, { useState } from "react";
import Image from "next/image";

interface CarVisualProps {
  className?: string;
}

export default function CarVisual({ className = "" }: CarVisualProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      id="car-container"
      className={`relative will-change-transform pointer-events-none select-none ${className}`}
      style={{
        transformOrigin: "center center",
      }}
    >
      {/* Dynamic Forward Headlight Beams */}
      <div
        className="absolute -top-[160px] left-1/2 -translate-x-1/2 w-[340px] h-[220px] pointer-events-none opacity-75 blur-xl"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 100%, transparent 40deg, rgba(230, 245, 255, 0.45) 80deg, rgba(255, 255, 255, 0.8) 90deg, rgba(230, 245, 255, 0.45) 100deg, transparent 140deg)",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)",
        }}
      />

      {/* Dual Focused Projector Spotlights */}
      <div className="absolute -top-[120px] left-1/2 -translate-x-[55px] w-[35px] h-[140px] bg-gradient-to-t from-cyan-200/50 via-white/20 to-transparent blur-md rounded-full transform -rotate-6" />
      <div className="absolute -top-[120px] left-1/2 translate-x-[20px] w-[35px] h-[140px] bg-gradient-to-t from-cyan-200/50 via-white/20 to-transparent blur-md rounded-full transform rotate-6" />

      {/* Papaya Aerodynamic Underglow Aura */}
      <div
        className="absolute inset-[-15%] rounded-full opacity-60 blur-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 94, 20, 0.5) 0%, rgba(255, 130, 45, 0.25) 45%, transparent 75%)",
        }}
      />

      {/* High-Performance Top-Down Supercar Visual */}
      {!imageError ? (
        <div className="relative w-[180px] sm:w-[220px] md:w-[260px] lg:w-[290px] aspect-[1/2] mx-auto filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)]">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/car-top.png`}
            alt="McLaren 720S Top View Supercar"
            fill
            sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 290px"
            priority
            onError={() => setImageError(true)}
            className="object-contain"
            style={{
              mixBlendMode: "screen",
            }}
          />
        </div>
      ) : (
        /* Vector Supercar Fallback in pure SVG */
        <div className="relative w-[180px] sm:w-[220px] md:w-[260px] aspect-[1/2] mx-auto">
          <svg
            viewBox="0 0 200 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_20px_40px_rgba(255,94,20,0.4)]"
          >
            {/* Aerodynamic Body Shell */}
            <path
              d="M 100 20 C 65 20 40 70 35 150 C 30 220 32 290 38 350 C 42 380 65 390 100 390 C 135 390 158 380 162 350 C 168 290 170 220 165 150 C 160 70 135 20 100 20 Z"
              fill="url(#bodyGradient)"
              stroke="#ff7a00"
              strokeWidth="2"
            />
            {/* Cockpit Canopy */}
            <path
              d="M 100 110 C 75 110 65 140 62 195 C 60 240 68 275 100 275 C 132 275 140 240 138 195 C 135 140 125 110 100 110 Z"
              fill="#0a0c10"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.5"
            />
            {/* Front Headlights */}
            <path d="M 52 45 C 55 35 68 32 72 40 C 66 50 56 55 52 45 Z" fill="#e0f7ff" />
            <path d="M 148 45 C 145 35 132 32 128 40 C 134 50 144 55 148 45 Z" fill="#e0f7ff" />
            {/* Rear Diffuser & Tail Lights */}
            <path d="M 50 375 L 75 378 L 75 382 L 50 380 Z" fill="#ff1a1a" />
            <path d="M 150 375 L 125 378 L 125 382 L 150 380 Z" fill="#ff1a1a" />
            <defs>
              <linearGradient id="bodyGradient" x1="100" y1="20" x2="100" y2="390" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff7a00" />
                <stop offset="50%" stopColor="#ff5e14" />
                <stop offset="100%" stopColor="#cc4100" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Rear Afterburner / Exhaust Accent */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-80 blur-sm pointer-events-none">
        <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-red-600" />
        <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-red-600" />
      </div>
    </div>
  );
}
