"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import StatCounter, { STATS_DATA } from "./StatCounter";

/* ===========================================================================
   8. CONFIGURATION CONSTANTS (Top of animation file, easy to tweak)
   =========================================================================== */
export const INTRO = {
  letterStagger: 0.045,
  letterDuration: 1.0,
  statGap: 0.18,
  statDuration: 0.9,
  countDuration: 1.6,
  ease: "expo.out",
  startDelay: 0.3,
};

export const SCROLL = {
  pinDistance: { desktop: "300%", tablet: "250%", mobile: "200%" },
  scrub: 1.2,
  travelX: { desktop: 30, tablet: 24, mobile: 16 },
  scaleRange: [0.9, 1.4],
  rotateRange: [-4, 4],
  letterSpacingRange: [0.5, 0.9],
  holdStart: 0.1,
  ease: "power2.inOut",
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Outer (Intro) vs Inner (Scroll) references to prevent transform collisions
  const headlineOuterRef = useRef<HTMLDivElement>(null);
  const headlineInnerRef = useRef<HTMLDivElement>(null);
  const headlineTextRef = useRef<HTMLHeadingElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);

  const objectOuterRef = useRef<HTMLDivElement>(null);
  const objectInnerRef = useRef<HTMLDivElement>(null);

  const statsOuterRef = useRef<HTMLDivElement>(null);
  const statsInnerRef = useRef<HTMLDivElement>(null);

  const glowOuterRef = useRef<HTMLDivElement>(null);
  const glowInnerRef = useRef<HTMLDivElement>(null);

  // Debug HUD state
  const [debugActive, setDebugActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("HOLD (0.00)");
  const [accentColor, setAccentColor] = useState<"lime" | "blue">("lime");

  // Character sets for "WELCOME ITZFIZZ"
  const welcomeChars = "WELCOME".split("");
  const itzfizzChars = "ITZFIZZ".split("");

  // Detect ?debug param on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDebug = window.location.search.includes("debug");
      setDebugActive(isDebug);
    }
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || !stageRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Handle reduced motion profile
      if (prefersReducedMotion) {
        gsap.to(stageRef.current, { opacity: 1, duration: 0.3 });
        gsap.set(".hero-char", { opacity: 1, yPercent: 0, rotateX: 0 });
        gsap.set(headlineTextRef.current, {
          letterSpacing: `${SCROLL.letterSpacingRange[0]}em`,
        });
        gsap.set(accentLineRef.current, { scaleX: 1 });
        gsap.set(".hero-stat-block", { opacity: 1, y: 0, filter: "none" });
        gsap.set(".hero-stat-divider", { scaleY: 1 });
        gsap.set(objectOuterRef.current, { opacity: 1, scale: 1 });
        STATS_DATA.forEach((s, idx) => {
          const el = document.getElementById(`stat-num-${idx}`);
          if (el) el.textContent = s.value.toString();
        });
        return;
      }

      // -----------------------------------------------------------------------
      // PRE-LOAD STATE: Set elements hidden until fonts ready
      // -----------------------------------------------------------------------
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

      gsap.set(stageRef.current, { opacity: 0 });
      gsap.set(".hero-char", {
        opacity: 0,
        yPercent: 100,
        filter: isDesktop ? "blur(6px)" : "none",
      });
      gsap.set(headlineTextRef.current, { letterSpacing: "0.2em" });
      gsap.set(accentLineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".hero-stat-block", {
        opacity: 0,
        y: 32,
        filter: isDesktop ? "blur(8px)" : "none",
      });
      gsap.set(".hero-stat-divider", { scaleY: 0, transformOrigin: "top center" });
      gsap.set(objectOuterRef.current, { opacity: 0, scale: 0.92 });
      gsap.set(glowInnerRef.current, { opacity: 0.18, scale: 1 });

      // Ambient 8s slow radial pulse
      const glowPulse = gsap.to(glowInnerRef.current, {
        opacity: 0.23, // ~5% opacity fluctuation
        scale: 1.04,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // Mouse-follow parallax with gsap.quickTo (desktop fine pointer only)
      const isFinePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches;
      let quickGlowX: ((val: number) => void) | null = null;
      let quickGlowY: ((val: number) => void) | null = null;

      if (isFinePointer && glowOuterRef.current) {
        quickGlowX = gsap.quickTo(glowOuterRef.current, "x", {
          duration: 0.8,
          ease: "power2.out",
        });
        quickGlowY = gsap.quickTo(glowOuterRef.current, "y", {
          duration: 0.8,
          ease: "power2.out",
        });

        const onMouseMove = (e: MouseEvent) => {
          const normX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
          const normY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
          if (quickGlowX && quickGlowY) {
            quickGlowX(normX * 24);
            quickGlowY(normY * 24);
          }
        };

        window.addEventListener("mousemove", onMouseMove, { passive: true });
      }

      // -----------------------------------------------------------------------
      // MASTER INTRO TIMELINE BUILDER
      // -----------------------------------------------------------------------
      const buildIntroTimeline = () => {
        const introTl = gsap.timeline({
          onStart: () => {
            // Apply will-change only while animating
            if (objectOuterRef.current) objectOuterRef.current.style.willChange = "transform, opacity";
            if (headlineOuterRef.current) headlineOuterRef.current.style.willChange = "transform, opacity";
          },
          onComplete: () => {
            // Remove will-change on complete for performance
            if (objectOuterRef.current) objectOuterRef.current.style.willChange = "auto";
            if (headlineOuterRef.current) headlineOuterRef.current.style.willChange = "auto";
            // Enable scroll timeline
            initScrollTimeline();
          },
        });

        // 0.00s: Background fades in from black
        introTl.to(stageRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0);

        // Visual Object arrives
        introTl.to(
          objectOuterRef.current,
          { opacity: 1, scale: 1, duration: 1.2, ease: INTRO.ease },
          0.2
        );

        // 0.30s: Label "headline" - Letters rise from behind mask
        introTl.addLabel("headline", INTRO.startDelay);

        introTl.to(
          ".hero-char",
          {
            opacity: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: INTRO.letterDuration,
            stagger: {
              each: INTRO.letterStagger,
              from: "center",
            },
            ease: INTRO.ease,
          },
          "headline"
        );

        // Letter-spacing breathes outward 0.2em -> 0.5em
        introTl.to(
          headlineTextRef.current,
          {
            letterSpacing: `${SCROLL.letterSpacingRange[0]}em`,
            duration: 1.3,
            ease: INTRO.ease,
          },
          "headline"
        );

        // 1.60s: Accent line draws left to right
        introTl.to(
          accentLineRef.current,
          { scaleX: 1, duration: 0.8, ease: INTRO.ease },
          1.6
        );

        // 2.00s: Label "stats" - sequence one by one
        introTl.addLabel("stats", 2.0);

        const statBlocks = gsap.utils.toArray<HTMLElement>(".hero-stat-block");
        statBlocks.forEach((block, idx) => {
          const startTime = 2.0 + idx * INTRO.statGap;

          // Divider draws slightly before text
          const divider = block.querySelector(".hero-stat-divider");
          if (divider) {
            introTl.to(divider, { scaleY: 1, duration: 0.6, ease: INTRO.ease }, startTime - 0.05);
          }

          // Block rises with blur clearing
          introTl.to(
            block,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: INTRO.statDuration,
              ease: INTRO.ease,
            },
            startTime
          );

          // Number counts up from 0 to target over 1.6s
          const targetNum = STATS_DATA[idx].value;
          const numEl = document.getElementById(`stat-num-${idx}`);
          const counterObj = { val: 0 };

          introTl.to(
            counterObj,
            {
              val: targetNum,
              duration: INTRO.countDuration,
              ease: INTRO.ease,
              onUpdate: () => {
                if (numEl) numEl.textContent = Math.round(counterObj.val).toString();
              },
            },
            startTime
          );

          // Description fades in 0.12s after number
          const descEl = block.querySelector(".hero-stat-desc");
          if (descEl) {
            introTl.fromTo(
              descEl,
              { opacity: 0 },
              { opacity: 0.6, duration: 0.5, ease: "power2.out" },
              startTime + 0.12
            );
          }
        });

        return introTl;
      };

      // -----------------------------------------------------------------------
      // SCROLL-DRIVEN TIMELINE WITH gsap.matchMedia()
      // -----------------------------------------------------------------------
      let mm: gsap.MatchMedia | null = null;

      const initScrollTimeline = () => {
        if (mm) mm.revert();
        mm = gsap.matchMedia();

        const isDebugUrl = window.location.search.includes("debug");

        // Breakpoint: Desktop (min-width: 1024px)
        mm.add("(min-width: 1024px)", () => {
          const travel = SCROLL.travelX.desktop;
          const scrollTl = gsap.timeline({
            defaults: { ease: SCROLL.ease },
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: `+=${SCROLL.pinDistance.desktop}`,
              pin: stageRef.current,
              scrub: SCROLL.scrub,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              markers: isDebugUrl,
              onUpdate: (self) => {
                const prog = self.progress;
                setScrollProgress(prog);
                let phase = "HOLD";
                if (prog >= 0.1 && prog < 0.55) phase = "PHASE 1: TRAVEL";
                else if (prog >= 0.55 && prog < 0.9) phase = "PHASE 2: DEPTH";
                else if (prog >= 0.9) phase = "RELEASE";
                setCurrentPhase(`${phase} (${prog.toFixed(2)})`);
                if (isDebugUrl) console.log(`[ITZFIZZ Scroll Progress] ${prog.toFixed(2)} - ${phase}`);
              },
            },
          });

          // PHASE 1 (0.10 -> 0.55): TRAVEL
          scrollTl
            .fromTo(
              objectInnerRef.current,
              { x: `-${travel}vw`, y: 0, rotate: SCROLL.rotateRange[0], scale: SCROLL.scaleRange[0] },
              {
                x: `${travel}vw`,
                y: "-4vh", // slight Y arc up at peak
                rotate: SCROLL.rotateRange[1],
                scale: 1.15,
                duration: 0.45,
              },
              0.1
            )
            .fromTo(
              headlineTextRef.current,
              { letterSpacing: `${SCROLL.letterSpacingRange[0]}em` },
              { letterSpacing: `${SCROLL.letterSpacingRange[1]}em`, duration: 0.45 },
              0.1
            )
            .fromTo(
              glowInnerRef.current,
              { x: `-${travel * 0.4}vw` },
              { x: `${travel * 0.4}vw`, duration: 0.45 },
              0.1
            );

          // PHASE 2 (0.55 -> 0.90): DEPTH
          scrollTl
            .to(
              objectInnerRef.current,
              {
                x: 0,
                y: 0,
                rotate: 0,
                scale: SCROLL.scaleRange[1],
                filter: "blur(3px)",
                duration: 0.35,
              },
              0.55
            )
            .to(
              headlineInnerRef.current,
              { y: -60, opacity: 0, duration: 0.35 },
              0.55
            )
            .to(
              statsInnerRef.current,
              { y: 45, opacity: 0.4, duration: 0.35 },
              0.55
            )
            .to(
              glowInnerRef.current,
              { scale: 1.5, opacity: 0, duration: 0.35 },
              0.55
            );

          // 0.90 -> 1.00: RELEASE hold final frame
          scrollTl.to({}, { duration: 0.1 }, 0.9);
        });

        // Breakpoint: Tablet (768px to 1023px)
        mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
          const travel = SCROLL.travelX.tablet;
          const scrollTl = gsap.timeline({
            defaults: { ease: SCROLL.ease },
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: `+=${SCROLL.pinDistance.tablet}`,
              pin: stageRef.current,
              scrub: SCROLL.scrub,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              markers: isDebugUrl,
            },
          });

          // Phase 1: Travel
          scrollTl.fromTo(
            objectInnerRef.current,
            { x: `-${travel}vw`, scale: 0.9 },
            { x: `${travel}vw`, scale: 1.1, duration: 0.45 },
            0.1
          );

          // Phase 2: Depth
          scrollTl
            .to(objectInnerRef.current, { x: 0, scale: 1.25, duration: 0.35 }, 0.55)
            .to(headlineInnerRef.current, { y: -45, opacity: 0, duration: 0.35 }, 0.55)
            .to(statsInnerRef.current, { y: 35, opacity: 0.4, duration: 0.35 }, 0.55)
            .to(glowInnerRef.current, { scale: 1.3, opacity: 0, duration: 0.35 }, 0.55);
        });

        // Breakpoint: Mobile (<768px - No blur, reduced travel)
        mm.add("(max-width: 767px)", () => {
          const travel = SCROLL.travelX.mobile;
          const scrollTl = gsap.timeline({
            defaults: { ease: SCROLL.ease },
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: `+=${SCROLL.pinDistance.mobile}`,
              pin: stageRef.current,
              scrub: SCROLL.scrub,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              markers: isDebugUrl,
            },
          });

          // Mobile Phase 1: Clean translate without blur
          scrollTl.fromTo(
            objectInnerRef.current,
            { x: `-${travel}vw`, scale: 0.92 },
            { x: `${travel}vw`, scale: 1.05, duration: 0.45 },
            0.1
          );

          // Mobile Phase 2: Fade & Lift
          scrollTl
            .to(objectInnerRef.current, { x: 0, scale: 1.15, opacity: 0.2, duration: 0.35 }, 0.55)
            .to(headlineInnerRef.current, { y: -30, opacity: 0, duration: 0.35 }, 0.55)
            .to(statsInnerRef.current, { y: 25, opacity: 0.3, duration: 0.35 }, 0.55)
            .to(glowInnerRef.current, { opacity: 0, duration: 0.35 }, 0.55);
        });
      };

      // -----------------------------------------------------------------------
      // FONT READY CHECK (with 1.5s fallback)
      // -----------------------------------------------------------------------
      let introInstance: gsap.core.Timeline | null = null;
      let hasStarted = false;

      const triggerIntro = () => {
        if (hasStarted) return;
        hasStarted = true;
        ScrollTrigger.refresh();
        introInstance = buildIntroTimeline();
      };

      if (document.fonts && document.fonts.ready) {
        const safetyTimer = setTimeout(triggerIntro, 1500);
        document.fonts.ready.then(() => {
          clearTimeout(safetyTimer);
          triggerIntro();
        });
      } else {
        triggerIntro();
      }

      // Expose window.replayIntro() for debugging and live reviews
      if (typeof window !== "undefined") {
        (window as any).replayIntro = () => {
          window.scrollTo({ top: 0, behavior: "instant" });
          if (mm) mm.revert();
          if (introInstance) {
            introInstance.restart();
          } else {
            triggerIntro();
          }
        };
      }

      return () => {
        glowPulse.kill();
        if (mm) mm.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="hero-scroll-wrapper relative w-full bg-[#0A0A0A]"
      data-theme={accentColor}
    >
      {/* 9. DEBUG HUD (Visible when ?debug in URL or toggled) */}
      {debugActive && (
        <div className="fixed top-4 right-4 z-[9999] bg-black/90 border border-accent/40 rounded-lg p-3 font-mono text-xs text-white shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="font-bold text-accent">ITZFIZZ DEBUG HUD</span>
          </div>
          <div>Progress: <span className="text-accent">{scrollProgress.toFixed(3)}</span></div>
          <div>Phase: <span className="text-white/80">{currentPhase}</span></div>
          <div className="mt-2 flex gap-1">
            <button
              onClick={() => (window as any).replayIntro?.()}
              className="px-2 py-0.5 bg-accent/20 border border-accent/40 rounded text-[10px] hover:bg-accent hover:text-black transition-colors"
            >
              Replay Intro
            </button>
          </div>
        </div>
      )}

      {/* STAGE: Fills exactly the first screen (min-height 100svh) */}
      <section
        ref={stageRef}
        className="hero-stage relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] flex flex-col justify-between items-center px-4 sm:px-8 pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-hidden"
      >
        {/* Background Radial Glow Layer (Follows cursor, pulses, and scales) */}
        <div
          ref={glowOuterRef}
          className="glow-outer pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <div
            ref={glowInnerRef}
            className="glow-inner w-[clamp(320px,65vw,850px)] h-[clamp(240px,45vh,520px)] rounded-full blur-[65px] bg-[radial-gradient(ellipse_at_center,var(--accent-glow)_0%,rgba(var(--accent-rgb),0.04)_48%,transparent_72%)]"
          />
        </div>

        {/* TOP CONTROLS & BRAND ROW */}
        <header className="relative z-30 w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md border border-accent bg-accent/10 flex items-center justify-center font-heading font-extrabold text-xs text-accent shadow-[0_0_12px_var(--accent-glow)]">
              IF
            </div>
            <span className="font-heading font-bold text-sm tracking-[0.2em] text-[#F5F5F7] uppercase">
              ITZFIZZ
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Replay Intro Button */}
            <button
              onClick={() => (window as any).replayIntro?.()}
              className="px-3 py-1 rounded-full text-xs font-mono tracking-wider text-[#F5F5F7]/70 bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-colors"
              title="Replay Entrance Choreography"
            >
              REPLAY
            </button>
            {/* Color Accent Switcher */}
            <button
              onClick={() => setAccentColor((c) => (c === "lime" ? "blue" : "lime"))}
              className="px-3 py-1 rounded-full text-xs font-mono tracking-wider text-accent bg-accent/10 border border-accent/30 hover:border-accent transition-colors flex items-center gap-1.5"
              title="Switch Accent Tone (Lime / Electric Blue)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>{accentColor === "lime" ? "LIME" : "BLUE"}</span>
            </button>
          </div>
        </header>

        {/* 2. HEADLINE AREA (Outer for Intro, Inner for Scroll) */}
        <div
          ref={headlineOuterRef}
          className="headline-outer relative z-20 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center my-auto"
        >
          <div ref={headlineInnerRef} className="headline-inner w-full flex flex-col items-center">
            {/* Kicker badge */}
            <div className="font-mono text-[clamp(0.68rem,1.1vw,0.8rem)] tracking-[0.3em] text-[#F5F5F7]/40 uppercase mb-2 sm:mb-3">
              [ <span className="text-accent font-semibold">HYPER-CINEMATIC</span> MOTION ARCHITECTURE ]
            </div>

            {/* Semantic H1 with aria-label; individual letter spans marked aria-hidden */}
            <h1
              ref={headlineTextRef}
              aria-label="Welcome Itzfizz"
              className="hero-headline w-full font-heading font-extrabold uppercase text-[clamp(2.4rem,7vw,6.5rem)] leading-none text-[#F5F5F7] select-none flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4"
            >
              {/* Word 1: WELCOME */}
              <span className="word-group inline-flex whitespace-nowrap">
                {welcomeChars.map((char, i) => (
                  <span
                    key={`w-${i}`}
                    className="char-mask inline-block overflow-hidden align-top"
                  >
                    <span
                      className="hero-char inline-block cursor-default transition-colors duration-200 hover:text-accent hover:drop-shadow-[0_0_16px_var(--accent-glow-bright)]"
                      aria-hidden="true"
                    >
                      {char}
                    </span>
                  </span>
                ))}
              </span>

              {/* Word 2: ITZFIZZ */}
              <span className="word-group inline-flex whitespace-nowrap">
                {itzfizzChars.map((char, i) => (
                  <span
                    key={`i-${i}`}
                    className="char-mask inline-block overflow-hidden align-top"
                  >
                    <span
                      className="hero-char inline-block cursor-default transition-colors duration-200 hover:text-accent hover:drop-shadow-[0_0_16px_var(--accent-glow-bright)]"
                      aria-hidden="true"
                    >
                      {char}
                    </span>
                  </span>
                ))}
              </span>
            </h1>

            {/* Thin Accent Line under the headline */}
            <div className="accent-line-track w-[min(80%,420px)] h-[2px] mt-3 sm:mt-5 overflow-hidden rounded-full">
              <div
                ref={accentLineRef}
                className="hero-accent-line w-full h-full bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_12px_var(--accent-glow-bright)]"
              />
            </div>
          </div>
        </div>

        {/* 2. MAIN VISUAL OBJECT (Centered between headline and stats) */}
        <div
          ref={objectOuterRef}
          className="object-outer relative z-10 w-full max-w-4xl mx-auto flex items-center justify-center my-1 sm:my-2"
        >
          <div
            ref={objectInnerRef}
            className="object-inner flex items-center justify-center pointer-events-none select-none"
          >
            <Image
              src="/car-transparent.png"
              alt=""
              priority
              aria-hidden="true"
              width={800}
              height={400}
              className="hero-visual-obj w-[clamp(240px,46vw,680px)] h-auto max-h-[28vh] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] filter transition-all duration-300"
            />
          </div>
        </div>

        {/* 2. IMPACT METRICS ROW (Anchored below headline and visual object) */}
        <div
          ref={statsOuterRef}
          className="stats-outer relative z-20 w-full max-w-5xl mx-auto"
        >
          <div ref={statsInnerRef} className="stats-inner w-full">
            <StatCounter stats={STATS_DATA} />
          </div>
        </div>

        {/* Scroll indicator prompt */}
        <div className="relative z-10 font-mono text-[10px] tracking-[0.25em] text-[#F5F5F7]/30 uppercase mt-2 flex items-center gap-1.5 select-none">
          <span>SCROLL TO ENGAGE</span>
          <span className="inline-block animate-bounce">↓</span>
        </div>
      </section>
    </div>
  );
}
