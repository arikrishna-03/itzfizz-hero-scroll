"use client";

import React, { useRef, useEffect } from "react";
import Headline from "./Headline";
import StatsGrid from "./StatsGrid";
import CarVisual from "./CarVisual";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ChevronDown, Gauge, Zap, Activity } from "lucide-react";

// Timing & Motion Constants
const LOAD_HEADLINE_STAGGER = 0.035;
const LOAD_STATS_STAGGER = 0.12;
const SCROLL_DISTANCE_VH = 350; // Pin distance across 350vh for smooth cinematic journey

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroScreenRef = useRef<HTMLDivElement>(null);
  const roadLinesRef = useRef<HTMLDivElement>(null);
  const carWrapperRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  // Telemetry HUD Element Refs for Zero-Lag Direct DOM Updates
  const speedDisplayRef = useRef<HTMLSpanElement>(null);
  const gearDisplayRef = useRef<HTMLSpanElement>(null);
  const boostBarRef = useRef<HTMLDivElement>(null);
  const gforceDisplayRef = useRef<HTMLSpanElement>(null);
  const modeDisplayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // 1. ACCESSIBILITY: REDUCED MOTION FALLBACK
      if (prefersReducedMotion) {
        gsap.set(".headline-char", { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(".stat-card", { opacity: 1, y: 0 });
        gsap.set(carWrapperRef.current, { opacity: 1, y: 0, scale: 1 });
        if (speedDisplayRef.current) speedDisplayRef.current.innerText = "342";
        if (gearDisplayRef.current) gearDisplayRef.current.innerText = "7";
        if (modeDisplayRef.current) modeDisplayRef.current.innerText = "CORSA V-MAX";
        document.querySelectorAll<HTMLElement>("[data-counter-target]").forEach((el) => {
          el.innerText = el.getAttribute("data-counter-target") || "0";
        });
        return;
      }

      // 2. INITIAL INTRO LOAD TIMELINE (~1.8s)
      const loadTl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Prepare initial resting states
      gsap.set(".headline-char", {
        opacity: 0,
        y: 40,
        filter: "blur(10px)",
      });
      gsap.set(".headline-sub", {
        opacity: 0,
        y: 15,
      });
      gsap.set(carWrapperRef.current, {
        opacity: 0,
        y: 80,
        scale: 0.92,
      });
      gsap.set(".stat-card", {
        opacity: 0,
        y: 40,
        scale: 0.95,
      });
      gsap.set(scrollCueRef.current, {
        opacity: 0,
        y: -12,
      });
      gsap.set(".hud-telemetry", {
        opacity: 0,
        y: 20,
      });

      // Stagger headline characters into view
      loadTl
        .to(".headline-char", {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: LOAD_HEADLINE_STAGGER,
        })
        .to(
          ".headline-sub",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.5"
        )
        // Glide supercar into starting grid position
        .to(
          carWrapperRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power2.out",
          },
          "-=0.6"
        )
        // Reveal HUD telemetry bar
        .to(
          ".hud-telemetry",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.7"
        )
        // Stagger stat cards
        .to(
          ".stat-card",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: LOAD_STATS_STAGGER,
          },
          "-=0.6"
        )
        .to(
          scrollCueRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.2"
        );

      // Animate stat number counters counting from 0 to target
      document.querySelectorAll<HTMLElement>("[data-counter-target]").forEach((counterEl) => {
        const targetValue = parseInt(
          counterEl.getAttribute("data-counter-target") || "0",
          10
        );
        const counterObj = { val: 0 };

        gsap.to(counterObj, {
          val: targetValue,
          duration: 1.9,
          ease: "power2.out",
          delay: 0.45,
          onUpdate: () => {
            counterEl.innerText = Math.round(counterObj.val).toString();
          },
        });
      });

      // 3. MASTER SCROLL-DRIVEN SCRUB TIMELINE (CORE FEATURE)
      // Tight 0.8 scrub provides instantaneous responsiveness to Lenis's smoothed momentum
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${SCROLL_DISTANCE_VH}%`,
          pin: heroScreenRef.current,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Synchronize Direct-DOM Telemetry HUD updates with zero React overhead
      scrollTl.eventCallback("onUpdate", () => {
        const p = scrollTl.progress();

        // 1. Live Speedometer (0 -> 342 KM/H)
        let speed = 0;
        if (p < 0.28) {
          speed = Math.round(p * (145 / 0.28));
        } else if (p < 0.65) {
          speed = Math.round(145 + ((p - 0.28) / (0.65 - 0.28)) * (268 - 145));
        } else if (p < 0.88) {
          speed = Math.round(268 + ((p - 0.65) / (0.88 - 0.65)) * (342 - 268));
        } else {
          speed = 342;
        }
        if (speedDisplayRef.current) {
          speedDisplayRef.current.innerText = speed.toString();
        }

        // 2. Dynamic Gear Shifts
        let gear = 1;
        if (p > 0.82) gear = 7;
        else if (p > 0.68) gear = 6;
        else if (p > 0.52) gear = 5;
        else if (p > 0.38) gear = 4;
        else if (p > 0.22) gear = 3;
        else if (p > 0.1) gear = 2;
        if (gearDisplayRef.current) {
          gearDisplayRef.current.innerText = gear.toString();
        }

        // 3. Turbo Boost Pressure
        const boostPercent = Math.min(100, Math.round(p * 115));
        if (boostBarRef.current) {
          boostBarRef.current.style.width = `${boostPercent}%`;
        }

        // 4. Lateral G-Force Sensor
        let gForce = "0.0";
        if (p >= 0.12 && p < 0.35) {
          const factor = Math.sin(((p - 0.12) / (0.35 - 0.12)) * Math.PI);
          gForce = `+${(factor * 1.3).toFixed(1)}`;
        } else if (p >= 0.35 && p < 0.65) {
          const factor = Math.sin(((p - 0.35) / (0.65 - 0.35)) * Math.PI);
          gForce = `-${(factor * 1.5).toFixed(1)}`;
        }
        if (gforceDisplayRef.current) {
          gforceDisplayRef.current.innerText = `${gForce}G`;
        }

        // 5. Active Drive Mode
        let mode = "LAUNCH CONTROL";
        if (p > 0.85) mode = "CORSA V-MAX";
        else if (p > 0.65) mode = "OVERDRIVE";
        else if (p > 0.18) mode = "APEX DRIFT";
        if (modeDisplayRef.current) {
          modeDisplayRef.current.innerText = mode;
        }
      });

      // Fade out the "Scroll to Drive" cue immediately as scroll starts
      scrollTl.to(
        scrollCueRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.06,
          ease: "power1.out",
        },
        0
      );

      // ==============================================================
      // STAGE 1 (0.0 -> 0.28): LAUNCH, FORWARD ACCELERATION & LEFT DIVE
      // ==============================================================
      // Car accelerates forward, chassis squats, banks left into lane 1
      scrollTl.to(
        carWrapperRef.current,
        {
          y: -30,
          x: -105,
          rotate: -8.5,
          skewX: -2.2,
          scale: 1.04,
          ease: "power2.inOut",
          duration: 0.28,
        },
        0
      );

      // Road markings rush backward at high velocity
      if (roadLinesRef.current) {
        scrollTl.to(
          roadLinesRef.current,
          {
            y: 950,
            ease: "none",
            duration: 1,
          },
          0
        );
      }

      // Exhaust flames lengthen and ignite with turbo power
      scrollTl.to(
        ".car-exhaust-flame",
        {
          scaleY: 1.8,
          scaleX: 1.25,
          opacity: 1,
          ease: "power1.out",
          duration: 0.25,
        },
        0
      );

      // Headlight beams brighten and reach further into the distance
      scrollTl.to(
        ".headlight-beam",
        {
          opacity: 1,
          scaleY: 1.2,
          ease: "power1.out",
          duration: 0.2,
        },
        0
      );

      // Speed streaks stream past
      scrollTl.to(
        ".speed-streak",
        {
          y: 800,
          opacity: 0.8,
          stagger: 0.02,
          ease: "none",
          duration: 1,
        },
        0
      );

      // Car passes Stat Cards 0 & 1 on the left -> Reactive Neon Telemetry Activation
      scrollTl.to(
        '.stat-card[data-index="0"], .stat-card[data-index="1"]',
        {
          y: -14,
          scale: 1.04,
          borderColor: "rgba(255, 94, 20, 0.8)",
          boxShadow: "0 15px 40px -5px rgba(255, 94, 20, 0.45)",
          ease: "power2.out",
          duration: 0.14,
        },
        0.12
      );
      scrollTl.to(
        '.stat-card[data-index="0"], .stat-card[data-index="1"]',
        {
          y: 0,
          scale: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          ease: "power2.in",
          duration: 0.14,
        },
        0.28
      );

      // Right-side skid mark fades in as rear tires bite into tarmac during turn
      scrollTl.to(
        ".car-skid-right",
        {
          opacity: 0.85,
          duration: 0.1,
          ease: "power1.out",
        },
        0.15
      );
      scrollTl.to(
        ".car-skid-right",
        {
          opacity: 0,
          duration: 0.1,
          ease: "power1.in",
        },
        0.28
      );

      // ==============================================================
      // STAGE 2 (0.28 -> 0.65): HIGH-SPEED SLALOM CROSS-CENTER APEX DRIFT
      // ==============================================================
      // Car counter-steers fluidly across center into the right lane
      scrollTl.to(
        carWrapperRef.current,
        {
          y: -15,
          x: 110,
          rotate: 10.5,
          skewX: 2.8,
          scale: 1.08,
          ease: "power1.inOut",
          duration: 0.37,
        },
        0.28
      );

      // Left tire drift mark illuminates during rightward powerslide
      scrollTl.to(
        ".car-skid-left",
        {
          opacity: 0.9,
          duration: 0.12,
          ease: "power1.out",
        },
        0.38
      );
      scrollTl.to(
        ".car-skid-left",
        {
          opacity: 0,
          duration: 0.12,
          ease: "power1.in",
        },
        0.58
      );

      // Tire smoke puff during drift apex
      scrollTl.to(
        ".car-tire-smoke",
        {
          opacity: 0.6,
          scale: 1.8,
          duration: 0.15,
          ease: "power1.out",
        },
        0.36
      );
      scrollTl.to(
        ".car-tire-smoke",
        {
          opacity: 0,
          scale: 2.5,
          duration: 0.15,
          ease: "power1.in",
        },
        0.52
      );

      // Car passes Stat Cards 2 & 3 on the right -> Synchronized Neon Activation
      scrollTl.to(
        '.stat-card[data-index="2"], .stat-card[data-index="3"]',
        {
          y: -14,
          scale: 1.04,
          borderColor: "rgba(0, 240, 255, 0.8)",
          boxShadow: "0 15px 40px -5px rgba(0, 240, 255, 0.4)",
          ease: "power2.out",
          duration: 0.16,
        },
        0.42
      );
      scrollTl.to(
        '.stat-card[data-index="2"], .stat-card[data-index="3"]',
        {
          y: 0,
          scale: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          ease: "power2.in",
          duration: 0.16,
        },
        0.62
      );

      // ==============================================================
      // STAGE 3 (0.65 -> 0.88): STRAIGHTAWAY REALIGN & OVERDRIVE
      // ==============================================================
      // Car snaps straight into center track at 300+ KM/H
      scrollTl.to(
        carWrapperRef.current,
        {
          y: -70,
          x: 0,
          rotate: 0,
          skewX: 0,
          scale: 1.14,
          ease: "power2.out",
          duration: 0.23,
        },
        0.65
      );

      // Exhaust flames reach maximum afterburner plume
      scrollTl.to(
        ".car-exhaust-flame",
        {
          scaleY: 2.4,
          scaleX: 1.4,
          opacity: 1,
          ease: "power2.out",
          duration: 0.2,
        },
        0.65
      );

      // Underglow pulses intense papaya & cyan ground aura
      scrollTl.to(
        ".car-underglow",
        {
          opacity: 1,
          scale: 1.35,
          duration: 0.2,
        },
        0.65
      );

      // ==============================================================
      // STAGE 4 (0.88 -> 1.00): HYPERSPACE BLASTOFF & SMOOTH EXIT
      // ==============================================================
      // Supercar roars forward into the horizon and unpins seamlessly
      scrollTl.to(
        carWrapperRef.current,
        {
          y: -380,
          scale: 1.25,
          opacity: 0,
          ease: "power2.in",
          duration: 0.12,
        },
        0.88
      );

      // Headline and stats gently recede with optical blur into the background
      scrollTl.to(
        ".headline-char",
        {
          opacity: 0.2,
          y: -40,
          filter: "blur(6px)",
          stagger: 0.008,
          ease: "power1.out",
          duration: 0.25,
        },
        0.75
      );
      scrollTl.to(
        ".stat-card",
        {
          opacity: 0.3,
          y: -20,
          stagger: 0.03,
          ease: "power1.out",
          duration: 0.25,
        },
        0.78
      );
      scrollTl.to(
        ".hud-telemetry",
        {
          opacity: 0.4,
          y: -15,
          ease: "power1.out",
          duration: 0.2,
        },
        0.82
      );
    }, containerRef);

    // Refresh after DOM layout settles
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-background overflow-hidden"
      style={{
        height: `${SCROLL_DISTANCE_VH + 100}vh`,
      }}
    >
      {/* Pinned Hero Viewport Screen */}
      <div
        ref={heroScreenRef}
        className="relative w-full h-[100svh] flex flex-col justify-between overflow-hidden bg-radial-dark pt-16 sm:pt-20 pb-4 sm:pb-8"
      >
        {/* Ambient Dark Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-35 pointer-events-none" />

        {/* ============================================================== */}
        {/* MULTI-LANE HIGHWAY CIRCUIT WITH TEXTURED TARMAC & CURBS        */}
        {/* ============================================================== */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-5xl pointer-events-none overflow-hidden z-0 opacity-45">
          {/* Dark textured tarmac surface */}
          <div className="relative w-full h-full mx-auto max-w-2xl bg-gradient-to-b from-[#08090d] via-[#0d1017] to-[#08090d] border-x border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
            {/* Left glowing racing curb (red/white rumble strip) */}
            <div
              className="absolute top-0 bottom-0 left-0 w-3 shadow-[0_0_15px_rgba(255,40,40,0.6)]"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, #ff2a2a 0px, #ff2a2a 24px, #ffffff 24px, #ffffff 48px)",
              }}
            />
            {/* Right glowing racing curb (red/white rumble strip) */}
            <div
              className="absolute top-0 bottom-0 right-0 w-3 shadow-[0_0_15px_rgba(255,40,40,0.6)]"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, #ff2a2a 0px, #ff2a2a 24px, #ffffff 24px, #ffffff 48px)",
              }}
            />

            {/* Continuous highway lane guide lines */}
            <div className="absolute top-0 bottom-0 left-[22%] w-[1px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
            <div className="absolute top-0 bottom-0 right-[22%] w-[1px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />

            {/* High-Speed Scrolling Centerlines & Lane Dashes */}
            <div
              ref={roadLinesRef}
              className="absolute inset-x-0 -top-[800px] -bottom-[800px] will-change-transform flex justify-center opacity-85"
            >
              {/* Center Dashed Highway Line with Neon Papaya Glow */}
              <div className="w-[3px] h-full flex flex-col items-center gap-14 py-8">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-16 bg-gradient-to-b from-accent to-amber-300 rounded-full shadow-[0_0_12px_rgba(255,94,20,0.9)]"
                  />
                ))}
              </div>
              {/* Left Lane Dashes */}
              <div className="absolute left-[34%] top-0 bottom-0 w-[2px] flex flex-col items-center gap-24 py-8 opacity-45">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 h-10 bg-white/70 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  />
                ))}
              </div>
              {/* Right Lane Dashes */}
              <div className="absolute right-[34%] top-0 bottom-0 w-[2px] flex flex-col items-center gap-24 py-8 opacity-45">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 h-10 bg-white/70 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* HIGH-VELOCITY SPEED STREAKS ON FLANKS                          */}
        {/* ============================================================== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-35">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="speed-streak absolute w-[1.5px] bg-gradient-to-b from-transparent via-cyan-300 to-transparent will-change-transform"
              style={{
                left: `${6 + i * 6.8}%`,
                height: `${70 + (i % 5) * 35}px`,
                top: `${(i * 19) % 100}%`,
                opacity: 0.15,
              }}
            />
          ))}
        </div>

        {/* Ambient Top & Bottom Vignettes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-background/40 to-background pointer-events-none" />

        {/* Header Section: Spaced Headline */}
        <div className="relative z-10 w-full flex-shrink-0 pt-2 sm:pt-4">
          <Headline />
        </div>

        {/* Center Stage: High-Performance Supercar Visual */}
        <div className="relative z-20 w-full flex-1 flex items-center justify-center my-[-15px] sm:my-[-5px]">
          <div
            ref={carWrapperRef}
            className="relative will-change-transform"
          >
            <CarVisual />
          </div>
        </div>

        {/* Cockpit Realtime Telemetry HUD Bar */}
        <div className="hud-telemetry relative z-30 w-full max-w-4xl mx-auto px-4 mb-2 select-none pointer-events-none">
          <div className="flex items-center justify-between gap-2 sm:gap-4 px-4 py-2 rounded-xl bg-surface/80 backdrop-blur-md border border-white/10 shadow-cardGlass text-xs font-mono">
            {/* Speedometer */}
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-accent animate-pulse" />
              <div className="flex items-baseline gap-1">
                <span
                  ref={speedDisplayRef}
                  className="font-heading font-black text-lg sm:text-2xl text-white tracking-tight"
                >
                  0
                </span>
                <span className="text-[10px] sm:text-xs text-neutral-400">KM/H</span>
              </div>
            </div>

            {/* Gear Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-light border border-white/5">
              <span className="text-[10px] text-neutral-400">GEAR</span>
              <span
                ref={gearDisplayRef}
                className="font-heading font-bold text-sm text-accent"
              >
                1
              </span>
            </div>

            {/* Boost Pressure Meter */}
            <div className="hidden sm:flex items-center gap-2 flex-1 max-w-[160px]">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  ref={boostBarRef}
                  className="h-full bg-gradient-to-r from-amber-400 to-accent transition-all duration-75"
                  style={{ width: "0%" }}
                />
              </div>
            </div>

            {/* Lateral G-Force Vector */}
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-accent-cyan" />
              <span
                ref={gforceDisplayRef}
                className="text-[11px] sm:text-xs text-neutral-300 font-semibold"
              >
                0.0G
              </span>
            </div>

            {/* Drive Mode Tag */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] text-accent tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span ref={modeDisplayRef}>LAUNCH CONTROL</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: 4 Stat Metrics */}
        <div className="relative z-30 w-full flex-shrink-0">
          <StatsGrid />
        </div>

        {/* Subtle Scroll Indicator Cue */}
        <div
          ref={scrollCueRef}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none z-30"
        >
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
            Scroll to Drive
          </span>
          <ChevronDown className="w-4 h-4 text-accent animate-bounce" />
        </div>
      </div>
    </section>
  );
}
