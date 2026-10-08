"use client";

import React, { memo } from "react";

export interface CarProps {
  steeringAngle?: number; // In degrees, roughly -25 to +25
  tiltAngle?: number; // Body roll/bank, roughly -10 to +10
  velocity?: number; // 0 to 1 normalized speed
  isBoosting?: boolean; // Space bar nitro mode
  isDrifting?: boolean; // Fast turning skid
  nightFactor?: number; // 0 = day, 1 = deep night
  className?: string;
}

/**
 * Top-down high-performance SVG hypercar.
 * Features:
 * - Dynamic steerable front wheels that pivot on hub axes
 * - Body roll / chassis tilt & suspension squash
 * - Volumetric xenon laser headlights that illuminate the road asphalt
 * - Dynamic dual-mode exhaust flames (Papaya turbo flames vs Electric Blue nitro blast)
 * - Ground underglow and high-res aerodynamic carbon details
 */
const Car = memo(function Car({
  steeringAngle = 0,
  tiltAngle = 0,
  velocity = 0,
  isBoosting = false,
  isDrifting = false,
  nightFactor = 0.5,
  className = "",
}: CarProps) {
  // Clamp values for smooth rendering
  const clampedSteer = Math.max(-28, Math.min(28, steeringAngle));
  const clampedTilt = Math.max(-12, Math.min(12, tiltAngle));

  // Flame sizing based on velocity + boost
  const baseFlameScale = 0.5 + velocity * 1.5 + (isBoosting ? 1.2 : 0);
  const flameOpacity = Math.min(1, Math.max(0.2, velocity * 1.2 + (isBoosting ? 0.6 : 0)));

  // Headlight beam brightness: stronger as it gets darker (nightFactor 0 -> 1)
  const beamOpacity = Math.min(1, Math.max(0.25, 0.2 + nightFactor * 0.75 + (isBoosting ? 0.2 : 0)));
  const beamLength = 360 + velocity * 120 + (isBoosting ? 80 : 0);

  return (
    <div
      className={`relative select-none pointer-events-none will-change-transform ${className}`}
      style={{
        width: "210px",
        height: "380px",
        transform: `rotate(${clampedTilt}deg) scale(${isBoosting ? 1.05 : 1})`,
        transition: "transform 0.08s ease-out",
        transformOrigin: "center 60%",
      }}
    >
      {/* ============================================================== */}
      {/* 1. VOLUMETRIC LASER HEADLIGHTS & ROAD PROJECTION               */}
      {/* ============================================================== */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          top: `-${beamLength - 30}px`,
          width: "480px",
          height: `${beamLength}px`,
          opacity: beamOpacity,
        }}
      >
        {/* Wide ambient cone of illumination */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 100% at 50% 100%, rgba(200, 245, 255, 0.45) 0%, rgba(100, 220, 255, 0.22) 40%, rgba(0, 180, 255, 0.06) 70%, transparent 88%)",
            maskImage: "linear-gradient(to top, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 95%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 95%)",
          }}
        />

        {/* Left Focused Projector Cone */}
        <div
          className="absolute bottom-6 left-[34%] -translate-x-1/2 w-[70px] origin-bottom"
          style={{
            height: `${beamLength - 40}px`,
            background:
              "linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(180, 240, 255, 0.55) 25%, rgba(0, 220, 255, 0.15) 70%, transparent 100%)",
            filter: "blur(5px)",
            clipPath: "polygon(35% 100%, 65% 100%, 100% 0%, 0% 0%)",
            transform: "rotate(-3deg)",
          }}
        />

        {/* Right Focused Projector Cone */}
        <div
          className="absolute bottom-6 left-[66%] -translate-x-1/2 w-[70px] origin-bottom"
          style={{
            height: `${beamLength - 40}px`,
            background:
              "linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(180, 240, 255, 0.55) 25%, rgba(0, 220, 255, 0.15) 70%, transparent 100%)",
            filter: "blur(5px)",
            clipPath: "polygon(35% 100%, 65% 100%, 100% 0%, 0% 0%)",
            transform: "rotate(3deg)",
          }}
        />

        {/* High-Intensity Road Contact Hotspots */}
        <div className="absolute bottom-4 left-[34%] -translate-x-1/2 w-12 h-6 bg-cyan-200/90 blur-md rounded-full" />
        <div className="absolute bottom-4 left-[66%] -translate-x-1/2 w-12 h-6 bg-cyan-200/90 blur-md rounded-full" />
      </div>

      {/* ============================================================== */}
      {/* 2. CHASSIS SHADOW & GROUND UNDERGLOW                           */}
      {/* ============================================================== */}
      {/* Ground contact shadow */}
      <div
        className="absolute inset-[8%] rounded-[45px] bg-black/95 blur-xl transform translate-y-3 pointer-events-none z-0"
        style={{
          boxShadow: "0 25px 50px 18px rgba(0, 0, 0, 0.95)",
        }}
      />

      {/* Papaya / Cyan Ground Underglow */}
      <div
        className="absolute -inset-[14%] rounded-[60px] pointer-events-none z-0 transition-all duration-200"
        style={{
          background: isBoosting
            ? "radial-gradient(ellipse at center, rgba(0, 240, 255, 0.75) 0%, rgba(0, 160, 255, 0.35) 45%, transparent 75%)"
            : "radial-gradient(ellipse at center, rgba(255, 94, 20, 0.65) 0%, rgba(255, 140, 40, 0.3) 45%, rgba(0, 240, 255, 0.12) 65%, transparent 80%)",
          filter: "blur(24px)",
          opacity: 0.8 + (velocity * 0.2),
        }}
      />

      {/* ============================================================== */}
      {/* 3. DETAILED TOP-DOWN SVG HYPERCAR CHASSIS                      */}
      {/* ============================================================== */}
      <svg
        viewBox="0 0 200 360"
        className="relative z-10 w-full h-full filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Body Paint Gradient: Deep Obsidian & Carbon */}
          <linearGradient id="bodyBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e222d" />
            <stop offset="35%" stopColor="#12151e" />
            <stop offset="70%" stopColor="#0a0c12" />
            <stop offset="100%" stopColor="#161a24" />
          </linearGradient>

          {/* McLaren Papaya Signature Accent Gradient */}
          <linearGradient id="accentOrange" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff8533" />
            <stop offset="50%" stopColor="#ff5e14" />
            <stop offset="100%" stopColor="#d94500" />
          </linearGradient>

          {/* Electric Cyan Telemetry Stripe */}
          <linearGradient id="accentCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#00aaff" />
          </linearGradient>

          {/* Cockpit Canopy Tint */}
          <linearGradient id="cockpitGlass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#253245" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#151d28" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#0d1219" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1a2533" stopOpacity="0.98" />
          </linearGradient>

          {/* Carbon Fiber Weave Texture Simulation */}
          <linearGradient id="carbonAero" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#20242f" />
            <stop offset="50%" stopColor="#141720" />
            <stop offset="100%" stopColor="#0c0e14" />
          </linearGradient>

          {/* Tire Tread Gradient */}
          <linearGradient id="tireTread" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0a0c10" />
            <stop offset="30%" stopColor="#222834" />
            <stop offset="70%" stopColor="#222834" />
            <stop offset="100%" stopColor="#0a0c10" />
          </linearGradient>

          {/* Brake Disc Glow Gradient */}
          <radialGradient id="brakeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7733" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#ff3300" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#330000" stopOpacity="0" />
          </radialGradient>

          {/* Normal Exhaust Flame Gradient (Papaya / Amber) */}
          <linearGradient id="orangeFlame" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#ffe680" />
            <stop offset="50%" stopColor="#ff5e14" />
            <stop offset="85%" stopColor="#ff2200" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
          </linearGradient>

          {/* Nitro Boost Plasma Flame Gradient (Electric Blue / Cyan) */}
          <linearGradient id="nitroFlame" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#a3f7ff" />
            <stop offset="55%" stopColor="#00e5ff" />
            <stop offset="85%" stopColor="#0066ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7a00ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ------------------------------------------------------------ */}
        {/* REAR WHEELS (Fixed Alignment, Wide Racing Slicks)            */}
        {/* ------------------------------------------------------------ */}
        {/* Rear Left Wheel */}
        <g id="rear-left-wheel" transform="translate(18, 252)">
          <rect x="0" y="0" width="22" height="52" rx="4" fill="url(#tireTread)" />
          {/* Wheel rim detail & spoke hub */}
          <rect x="3" y="10" width="16" height="32" rx="2" fill="#1b1f2b" stroke="#374151" strokeWidth="1" />
          <circle cx="11" cy="26" r="4" fill="#ff5e14" />
          {/* Glowing brake disc during drift/braking */}
          {isDrifting && (
            <circle cx="11" cy="26" r="8" fill="url(#brakeGlow)" className="animate-pulse" />
          )}
        </g>

        {/* Rear Right Wheel */}
        <g id="rear-right-wheel" transform="translate(160, 252)">
          <rect x="0" y="0" width="22" height="52" rx="4" fill="url(#tireTread)" />
          <rect x="3" y="10" width="16" height="32" rx="2" fill="#1b1f2b" stroke="#374151" strokeWidth="1" />
          <circle cx="11" cy="26" r="4" fill="#ff5e14" />
          {isDrifting && (
            <circle cx="11" cy="26" r="8" fill="url(#brakeGlow)" className="animate-pulse" />
          )}
        </g>

        {/* ------------------------------------------------------------ */}
        {/* FRONT WHEELS (Pivoting Steerable Wheels on Hub Axes!)        */}
        {/* ------------------------------------------------------------ */}
        {/* Front Left Wheel with Steering Angle */}
        <g
          id="front-left-wheel"
          transform={`translate(18, 76) rotate(${clampedSteer}, 11, 24)`}
          className="transition-transform duration-75 ease-out"
        >
          <rect x="0" y="0" width="20" height="48" rx="4" fill="url(#tireTread)" />
          <rect x="3" y="9" width="14" height="30" rx="2" fill="#1b1f2b" stroke="#374151" strokeWidth="1" />
          <circle cx="10" cy="24" r="3.5" fill="#ff5e14" />
          <line x1="2" y1="24" x2="18" y2="24" stroke="#ff5e14" strokeWidth="1.5" />
        </g>

        {/* Front Right Wheel with Steering Angle */}
        <g
          id="front-right-wheel"
          transform={`translate(162, 76) rotate(${clampedSteer}, 11, 24)`}
          className="transition-transform duration-75 ease-out"
        >
          <rect x="0" y="0" width="20" height="48" rx="4" fill="url(#tireTread)" />
          <rect x="3" y="9" width="14" height="30" rx="2" fill="#1b1f2b" stroke="#374151" strokeWidth="1" />
          <circle cx="10" cy="24" r="3.5" fill="#ff5e14" />
          <line x1="2" y1="24" x2="18" y2="24" stroke="#ff5e14" strokeWidth="1.5" />
        </g>

        {/* ------------------------------------------------------------ */}
        {/* SUSPENSION WISHBONES & CHASSIS UNDERTRAY                     */}
        {/* ------------------------------------------------------------ */}
        {/* Front suspension arms */}
        <line x1="38" y1="96" x2="60" y2="102" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="104" x2="60" y2="106" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        <line x1="162" y1="96" x2="140" y2="102" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="162" y1="104" x2="140" y2="106" stroke="#374151" strokeWidth="2" strokeLinecap="round" />

        {/* Rear suspension arms */}
        <line x1="40" y1="272" x2="62" y2="274" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="160" y1="272" x2="138" y2="274" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />

        {/* ------------------------------------------------------------ */}
        {/* MAIN AERODYNAMIC HYPERCAR BODY SHELL                         */}
        {/* ------------------------------------------------------------ */}
        {/* Sculpted outer chassis silhouette */}
        <path
          d="
            M 100,28
            C 118,28 138,36 150,52
            C 158,64 163,82 163,106
            C 163,126 156,146 152,168
            C 148,188 147,208 152,228
            C 158,252 166,274 166,298
            C 166,316 156,334 140,340
            C 126,345 114,346 100,346
            C 86,346 74,345 60,340
            C 44,334 34,316 34,298
            C 34,274 42,252 48,228
            C 53,208 52,188 48,168
            C 44,146 37,126 37,106
            C 37,82 42,64 50,52
            C 62,36 82,28 100,28 Z
          "
          fill="url(#bodyBase)"
          stroke="#374151"
          strokeWidth="1.2"
        />

        {/* Carbon Front Splitter & Dive Planes */}
        <path
          d="
            M 68,26
            C 84,22 116,22 132,26
            L 142,34
            L 138,40
            C 124,36 76,36 62,40
            L 58,34 Z
          "
          fill="url(#carbonAero)"
          stroke="#ff5e14"
          strokeWidth="1"
        />
        {/* Splitter canards */}
        <path d="M 46,44 L 56,40 L 52,48 Z" fill="#ff5e14" />
        <path d="M 154,44 L 144,40 L 148,48 Z" fill="#ff5e14" />

        {/* McLaren Signature Papaya Side Swooshes / Aerodynamic Inlets */}
        <path
          d="
            M 52,66
            C 58,85 64,115 62,142
            C 60,165 54,185 53,212
            C 52,228 56,242 58,252
            C 54,242 49,224 49,208
            C 49,185 55,160 57,138
            C 59,114 55,88 48,68 Z
          "
          fill="url(#accentOrange)"
          opacity="0.95"
        />
        <path
          d="
            M 148,66
            C 142,85 136,115 138,142
            C 140,165 146,185 147,212
            C 148,228 144,242 142,252
            C 146,242 151,224 151,208
            C 151,185 145,160 143,138
            C 141,114 145,88 152,68 Z
          "
          fill="url(#accentOrange)"
          opacity="0.95"
        />

        {/* Central Racing Telemetry Stripe */}
        <path
          d="M 98,30 L 102,30 L 102,340 L 98,340 Z"
          fill="url(#accentOrange)"
          opacity="0.8"
        />
        <path
          d="M 96,65 L 104,65 L 104,78 L 96,78 Z"
          fill="url(#accentCyanGrad)"
        />

        {/* Front Hood Aerodynamic Air Extractors (Louver Vents) */}
        <g opacity="0.85">
          <path d="M 82,72 C 92,69 108,69 118,72 L 116,75 C 106,73 94,73 84,75 Z" fill="#08090d" />
          <path d="M 80,80 C 92,77 108,77 120,80 L 118,83 C 106,81 94,81 82,83 Z" fill="#08090d" />
          <path d="M 78,88 C 92,85 108,85 122,88 L 120,91 C 106,89 94,89 80,91 Z" fill="#08090d" />
        </g>

        {/* Front Laser Headlight Clusters (Signature LED Fangs) */}
        <g id="headlight-clusters">
          {/* Left Headlight */}
          <path
            d="M 56,44 C 62,48 68,54 72,62 L 67,64 C 64,57 59,52 54,48 Z"
            fill="#e0f7ff"
            filter="drop-shadow(0 0 6px #00f0ff)"
          />
          <circle cx="68" cy="60" r="2.5" fill="#ffffff" />

          {/* Right Headlight */}
          <path
            d="M 144,44 C 138,48 132,54 128,62 L 133,64 C 136,57 141,52 146,48 Z"
            fill="#e0f7ff"
            filter="drop-shadow(0 0 6px #00f0ff)"
          />
          <circle cx="132" cy="60" r="2.5" fill="#ffffff" />
        </g>

        {/* Side Mirrors with Integrated Indicators */}
        <path d="M 44,116 L 28,110 L 29,114 L 43,122 Z" fill="#1b1f2b" stroke="#ff5e14" strokeWidth="0.8" />
        <path d="M 156,116 L 172,110 L 171,114 L 157,122 Z" fill="#1b1f2b" stroke="#ff5e14" strokeWidth="0.8" />

        {/* ------------------------------------------------------------ */}
        {/* FIGHTER COCKPIT CANOPY & ROOF                                */}
        {/* ------------------------------------------------------------ */}
        {/* Cockpit Shell */}
        <path
          d="
            M 100,108
            C 114,108 126,114 130,126
            C 134,138 134,166 132,192
            C 130,212 124,228 118,236
            C 112,242 106,244 100,244
            C 94,244 88,242 82,236
            C 76,228 70,212 68,192
            C 66,166 66,138 70,126
            C 74,114 86,108 100,108 Z
          "
          fill="url(#cockpitGlass)"
          stroke="#4b5563"
          strokeWidth="1.5"
        />

        {/* Windshield Reflection Arc */}
        <path
          d="
            M 76,126
            C 86,116 114,116 124,126
            C 118,136 82,136 76,126 Z
          "
          fill="rgba(255, 255, 255, 0.35)"
        />

        {/* Cockpit HUD Reflection Glow */}
        <rect x="94" y="132" width="12" height="6" rx="1" fill="#00f0ff" opacity="0.6" className="animate-pulse" />

        {/* Helmet Top View of Pilot */}
        <ellipse cx="100" cy="172" rx="9" ry="11" fill="#ff5e14" stroke="#ffffff" strokeWidth="1" />
        <ellipse cx="100" cy="167" rx="6" ry="3.5" fill="#000000" />

        {/* Roof Air Intake Scoop (Le Mans Periscope) */}
        <path
          d="M 94,196 L 106,196 L 104,212 L 96,212 Z"
          fill="#0c0e14"
          stroke="#ff5e14"
          strokeWidth="1"
        />

        {/* ------------------------------------------------------------ */}
        {/* REAR ENGINE DECK & VENTILATION LOUVERS                       */}
        {/* ------------------------------------------------------------ */}
        {/* Louvers */}
        <g opacity="0.9">
          <line x1="84" y1="248" x2="116" y2="248" stroke="#ff5e14" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="82" y1="254" x2="118" y2="254" stroke="#222736" strokeWidth="2" strokeLinecap="round" />
          <line x1="80" y1="260" x2="120" y2="260" stroke="#222736" strokeWidth="2" strokeLinecap="round" />
          <line x1="78" y1="266" x2="122" y2="266" stroke="#222736" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="272" x2="124" y2="272" stroke="#222736" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Rear Deck Telemetry Badge */}
        <text
          x="100"
          y="286"
          textAnchor="middle"
          fill="#9ca3af"
          fontSize="5"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="1"
        >
          ITZFIZZ V8 TT
        </text>

        {/* ------------------------------------------------------------ */}
        {/* ACTIVE AERO REAR WING                                        */}
        {/* ------------------------------------------------------------ */}
        <g id="rear-wing">
          {/* Wing pylons */}
          <rect x="80" y="306" width="4" height="14" rx="1" fill="#ff5e14" />
          <rect x="116" y="306" width="4" height="14" rx="1" fill="#ff5e14" />
          {/* Main carbon aero blade */}
          <path
            d="
              M 52,316
              C 74,313 126,313 148,316
              L 146,324
              C 124,321 76,321 54,324 Z
            "
            fill="url(#carbonAero)"
            stroke="#ff5e14"
            strokeWidth="1.2"
          />
          {/* Wing endplates */}
          <rect x="50" y="312" width="4" height="16" rx="1.5" fill="#ff5e14" />
          <rect x="146" y="312" width="4" height="16" rx="1.5" fill="#ff5e14" />
        </g>

        {/* Rear Diffuser Strakes */}
        <line x1="88" y1="336" x2="88" y2="348" stroke="#ff5e14" strokeWidth="2" strokeLinecap="round" />
        <line x1="100" y1="336" x2="100" y2="348" stroke="#ff5e14" strokeWidth="2" strokeLinecap="round" />
        <line x1="112" y1="336" x2="112" y2="348" stroke="#ff5e14" strokeWidth="2" strokeLinecap="round" />

        {/* Rear LED Full-Width Taillight Blade */}
        <path
          d="
            M 62,336
            C 82,332 118,332 138,336
          "
          stroke="#ff2a2a"
          strokeWidth="3"
          strokeLinecap="round"
          filter="drop-shadow(0 0 6px #ff2a2a)"
        />

        {/* Exhaust Nozzles */}
        <circle cx="94" cy="336" r="3.5" fill="#1b1f2b" stroke="#6b7280" strokeWidth="1" />
        <circle cx="106" cy="336" r="3.5" fill="#1b1f2b" stroke="#6b7280" strokeWidth="1" />

        {/* ------------------------------------------------------------ */}
        {/* DYNAMIC TURBO & NITRO EXHAUST FLAMES                         */}
        {/* ------------------------------------------------------------ */}
        {velocity > 0.05 && (
          <g
            id="exhaust-flames"
            className={isBoosting ? "animate-nitro-flame" : "animate-flame"}
            style={{
              opacity: flameOpacity,
              transformOrigin: "100px 338px",
              transform: `scaleY(${baseFlameScale})`,
            }}
          >
            {/* Left Exhaust Flame */}
            <path
              d="
                M 91,338
                C 90,345 88,355 94,372
                C 100,355 98,345 97,338 Z
              "
              fill={isBoosting ? "url(#nitroFlame)" : "url(#orangeFlame)"}
              filter={isBoosting ? "drop-shadow(0 0 10px #00f0ff)" : "drop-shadow(0 0 8px #ff5e14)"}
            />
            {/* Right Exhaust Flame */}
            <path
              d="
                M 103,338
                C 102,345 100,355 106,372
                C 112,355 110,345 109,338 Z
              "
              fill={isBoosting ? "url(#nitroFlame)" : "url(#orangeFlame)"}
              filter={isBoosting ? "drop-shadow(0 0 10px #00f0ff)" : "drop-shadow(0 0 8px #ff5e14)"}
            />
          </g>
        )}
      </svg>
    </div>
  );
});

export default Car;
