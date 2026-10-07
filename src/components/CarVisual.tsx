"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface CarVisualProps {
  className?: string;
  steeringAngle?: number;
}

export default function CarVisual({ className = "" }: CarVisualProps) {
  const [imageError, setImageError] = useState(false);
  const mouseTiltRef = useRef<HTMLDivElement>(null);

  // Subtle interactive 3D mouse parallax tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseTiltRef.current) return;
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yNorm = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

      // Subtle tilt: max 6deg yaw, 4deg pitch
      const rotateY = xNorm * 6;
      const rotateX = -yNorm * 4;
      mouseTiltRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      id="car-container"
      className={`relative will-change-transform pointer-events-none select-none ${className}`}
      style={{
        transformOrigin: "center 50%",
      }}
    >
      {/* 3D Mouse Parallax & Idle Vibration Shell */}
      <div
        ref={mouseTiltRef}
        className="relative transition-transform duration-300 ease-out animate-car-rumble"
      >
        {/* ============================================================== */}
        {/* 1. DYNAMIC DUAL VOLUMETRIC LASER HEADLIGHTS & ROAD PROJECTION */}
        {/* ============================================================== */}
        <div className="absolute -top-[360px] left-1/2 -translate-x-1/2 w-[520px] h-[400px] pointer-events-none z-0">
          {/* Main Wide Road Illumination Field */}
          <div
            className="headlight-beam absolute inset-0 opacity-80 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(ellipse 65% 100% at 50% 100%, rgba(200, 240, 255, 0.45) 0%, rgba(120, 210, 255, 0.22) 35%, rgba(0, 180, 255, 0.08) 60%, transparent 85%)",
              maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
            }}
          />

          {/* Left Focused Xenon Projector Cone */}
          <div
            className="headlight-beam-left absolute bottom-[10px] left-[28%] -translate-x-1/2 w-[90px] h-[340px] origin-bottom transform -rotate-4"
            style={{
              background:
                "linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(180, 235, 255, 0.55) 25%, rgba(0, 220, 255, 0.2) 60%, transparent 95%)",
              filter: "blur(6px)",
              clipPath: "polygon(40% 100%, 60% 100%, 100% 0%, 0% 0%)",
            }}
          />

          {/* Right Focused Xenon Projector Cone */}
          <div
            className="headlight-beam-right absolute bottom-[10px] left-[72%] -translate-x-1/2 w-[90px] h-[340px] origin-bottom transform rotate-4"
            style={{
              background:
                "linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(180, 235, 255, 0.55) 25%, rgba(0, 220, 255, 0.2) 60%, transparent 95%)",
              filter: "blur(6px)",
              clipPath: "polygon(40% 100%, 60% 100%, 100% 0%, 0% 0%)",
            }}
          />

          {/* High-Intensity Road Contact Hotspots */}
          <div className="absolute bottom-[20px] left-[28%] -translate-x-1/2 w-14 h-8 bg-cyan-200/80 blur-md rounded-full" />
          <div className="absolute bottom-[20px] left-[72%] -translate-x-1/2 w-14 h-8 bg-cyan-200/80 blur-md rounded-full" />
        </div>

        {/* ============================================================== */}
        {/* 2. CHASSIS UNDERGLOW & REALISTIC GROUND CONTACT SHADOW         */}
        {/* ============================================================== */}
        {/* Pitch Black Localized Asphalt Tire Shadow */}
        <div
          className="absolute inset-[6%] rounded-[40px] bg-black/90 blur-xl pointer-events-none transform translate-y-3 z-0"
          style={{
            boxShadow: "0 20px 45px 15px rgba(0, 0, 0, 0.95)",
          }}
        />

        {/* McLaren Signature Papaya Ground Underglow Aura */}
        <div
          className="car-underglow absolute -inset-[18%] rounded-[50px] opacity-75 blur-2xl pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 94, 20, 0.65) 0%, rgba(255, 140, 40, 0.3) 45%, rgba(0, 240, 255, 0.12) 65%, transparent 80%)",
          }}
        />

        {/* ============================================================== */}
        {/* 3. TIRE DRIFT SKID MARKS & ASPHALT SMOKE PUFFS                */}
        {/* ============================================================== */}
        {/* Left Wheel Skid Mark Decal */}
        <div
          className="car-skid-left absolute top-[68%] left-[6%] w-5 h-28 opacity-0 pointer-events-none transition-opacity duration-200"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(20,20,20,0.6) 60%, transparent 100%)",
            filter: "blur(1.5px)",
            borderRadius: "4px",
            transform: "translateY(20px)",
          }}
        />
        {/* Right Wheel Skid Mark Decal */}
        <div
          className="car-skid-right absolute top-[68%] right-[6%] w-5 h-28 opacity-0 pointer-events-none transition-opacity duration-200"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(20,20,20,0.6) 60%, transparent 100%)",
            filter: "blur(1.5px)",
            borderRadius: "4px",
            transform: "translateY(20px)",
          }}
        />

        {/* Tire Smoke / Vapor Wisps during Drift */}
        <div
          className="car-tire-smoke absolute top-[75%] -left-4 w-12 h-12 rounded-full bg-white/20 blur-md opacity-0 pointer-events-none"
        />
        <div
          className="car-tire-smoke absolute top-[75%] -right-4 w-12 h-12 rounded-full bg-white/20 blur-md opacity-0 pointer-events-none"
        />

        {/* ============================================================== */}
        {/* 4. HIGH-RESOLUTION McLAREN SUPERCAR VISUAL                    */}
        {/* ============================================================== */}
        {!imageError ? (
          <div className="relative z-10 w-[180px] sm:w-[220px] md:w-[255px] lg:w-[285px] aspect-[480/920] mx-auto filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/car-top.png`}
              alt="McLaren 720S High-Performance Supercar"
              fill
              sizes="(max-width: 640px) 180px, (max-width: 1024px) 255px, 285px"
              priority
              onError={() => setImageError(true)}
              className="object-contain select-none pointer-events-none"
            />

            {/* Headlight Lens Flare Projector Rings on Car Body */}
            <div className="headlight-flare absolute top-[11.2%] left-[28.5%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_4px_rgba(200,245,255,0.9)] animate-pulse" />
            <div className="headlight-flare absolute top-[11.2%] left-[71.5%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_4px_rgba(200,245,255,0.9)] animate-pulse" />

            {/* Aerodynamic Wind-Tunnel Streamlines (Dynamic Air Flow) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40 car-streamlines overflow-visible"
              viewBox="0 0 480 920"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left aerodynamic contour line */}
              <path
                d="M 138 120 C 120 220 110 380 95 600 C 85 720 70 820 60 880"
                stroke="url(#streamCyan)"
                strokeWidth="2"
                strokeDasharray="12 8"
                className="animate-streamline"
              />
              {/* Right aerodynamic contour line */}
              <path
                d="M 342 120 C 360 220 370 380 385 600 C 395 720 410 820 420 880"
                stroke="url(#streamCyan)"
                strokeWidth="2"
                strokeDasharray="12 8"
                className="animate-streamline"
              />
              {/* Center cockpit canopy streamline */}
              <path
                d="M 240 100 Q 240 400 240 850"
                stroke="url(#streamPapaya)"
                strokeWidth="1.5"
                strokeDasharray="20 15"
                className="animate-streamline"
              />
              <defs>
                <linearGradient id="streamCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#ff5e14" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <linearGradient id="streamPapaya" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.9" />
                  <stop offset="80%" stopColor="#ff1a1a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        ) : (
          /* High-Fidelity Vector Fallback SVG */
          <div className="relative z-10 w-[180px] sm:w-[220px] md:w-[255px] aspect-[480/920] mx-auto">
            <svg
              viewBox="0 0 200 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_20px_40px_rgba(255,94,20,0.5)]"
            >
              <path
                d="M 100 20 C 65 20 40 70 35 150 C 30 220 32 290 38 350 C 42 380 65 390 100 390 C 135 390 158 380 162 350 C 168 290 170 220 165 150 C 160 70 135 20 100 20 Z"
                fill="url(#bodyGrad)"
                stroke="#ff7a00"
                strokeWidth="2"
              />
              <path
                d="M 100 110 C 75 110 65 140 62 195 C 60 240 68 275 100 275 C 132 275 140 240 138 195 C 135 140 125 110 100 110 Z"
                fill="#0a0c10"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1.5"
              />
              <defs>
                <linearGradient id="bodyGrad" x1="100" y1="20" x2="100" y2="390" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff7a00" />
                  <stop offset="50%" stopColor="#ff5e14" />
                  <stop offset="100%" stopColor="#cc4100" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. TWIN TURBO EXHAUST AFTERBURNERS & BLUE NITRO FLAMES         */}
        {/* ============================================================== */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-28 flex justify-center items-center gap-7 pointer-events-none z-20">
          {/* Left Exhaust Flame Cone */}
          <div className="car-exhaust-flame relative flex flex-col items-center origin-top transition-transform duration-100">
            {/* Outer Fiery Orange Flame */}
            <div
              className="w-4 h-12 bg-gradient-to-b from-cyan-300 via-amber-400 to-red-600 rounded-b-full blur-[2px] opacity-90 animate-flame-flicker"
              style={{
                clipPath: "polygon(20% 0%, 80% 0%, 100% 70%, 50% 100%, 0% 70%)",
              }}
            />
            {/* Inner High-Heat Cyan Nitro Jet */}
            <div
              className="absolute top-0 w-2 h-7 bg-gradient-to-b from-white via-cyan-300 to-transparent rounded-b-full blur-[0.5px] opacity-95"
            />
            {/* Exhaust Heat Distortion Glow */}
            <div className="absolute -bottom-2 w-7 h-7 rounded-full bg-orange-500/50 blur-md" />
          </div>

          {/* Right Exhaust Flame Cone */}
          <div className="car-exhaust-flame relative flex flex-col items-center origin-top transition-transform duration-100">
            {/* Outer Fiery Orange Flame */}
            <div
              className="w-4 h-12 bg-gradient-to-b from-cyan-300 via-amber-400 to-red-600 rounded-b-full blur-[2px] opacity-90 animate-flame-flicker"
              style={{
                clipPath: "polygon(20% 0%, 80% 0%, 100% 70%, 50% 100%, 0% 70%)",
              }}
            />
            {/* Inner High-Heat Cyan Nitro Jet */}
            <div
              className="absolute top-0 w-2 h-7 bg-gradient-to-b from-white via-cyan-300 to-transparent rounded-b-full blur-[0.5px] opacity-95"
            />
            {/* Exhaust Heat Distortion Glow */}
            <div className="absolute -bottom-2 w-7 h-7 rounded-full bg-orange-500/50 blur-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
