"use client";

import React, { useRef, useLayoutEffect } from "react";
import Headline from "./Headline";
import StatsGrid, { STATS_DATA } from "./StatsGrid";
import CarVisual from "./CarVisual";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ChevronDown } from "lucide-react";

// Timing & Motion Constants
const LOAD_HEADLINE_STAGGER = 0.035;
const LOAD_STATS_STAGGER = 0.12;
const SCROLL_DISTANCE_VH = 350; // Scroll distance in vh units

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroScreenRef = useRef<HTMLDivElement>(null);
  const roadLinesRef = useRef<HTMLDivElement>(null);
  const carWrapperRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // 1. REDUCED MOTION FALLBACK
      if (prefersReducedMotion) {
        gsap.set(".headline-char", { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(".stat-card", { opacity: 1, y: 0 });
        gsap.set(carWrapperRef.current, { opacity: 1, y: 0, scale: 1 });
        // Set counter numbers immediately
        document.querySelectorAll<HTMLElement>("[data-counter-target]").forEach((el) => {
          el.innerText = el.getAttribute("data-counter-target") || "0";
        });
        return;
      }

      // 2. INITIAL LOAD TIMELINE
      const loadTl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Prepare initial states
      gsap.set(".headline-char", {
        opacity: 0,
        y: 40,
        filter: "blur(8px)",
      });
      gsap.set(".headline-sub", {
        opacity: 0,
        y: 15,
      });
      gsap.set(carWrapperRef.current, {
        opacity: 0,
        y: 90,
        scale: 0.92,
      });
      gsap.set(".stat-card", {
        opacity: 0,
        y: 35,
        scale: 0.96,
      });
      gsap.set(scrollCueRef.current, {
        opacity: 0,
        y: -10,
      });

      // Stagger headline characters
      loadTl
        .to(".headline-char", {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: LOAD_HEADLINE_STAGGER,
        })
        .to(
          ".headline-sub",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        // Glide car into initial position
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
        // Stagger stat cards
        .to(
          ".stat-card",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: LOAD_STATS_STAGGER,
          },
          "-=0.7"
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

      // Animate stat numbers counting up from 0 to target
      document.querySelectorAll<HTMLElement>("[data-counter-target]").forEach((counterEl) => {
        const targetValue = parseInt(
          counterEl.getAttribute("data-counter-target") || "0",
          10
        );
        const counterObj = { val: 0 };

        gsap.to(counterObj, {
          val: targetValue,
          duration: 1.8,
          ease: "power2.out",
          delay: 0.5,
          onUpdate: () => {
            counterEl.innerText = Math.round(counterObj.val).toString();
          },
        });
      });

      // 3. SCROLL-DRIVEN SCRUB TIMELINE (CORE FEATURE)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${SCROLL_DISTANCE_VH}%`,
          pin: heroScreenRef.current,
          scrub: 1.2, // Silk smooth scrubbing interpolation
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Fade out the scroll down indicator cue as soon as user scrolls
      scrollTl.to(
        scrollCueRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.08,
          ease: "power1.out",
        },
        0
      );

      // Car Journey across stages:
      // Stage 1: Initial forward thrust with slight bank left
      scrollTl.to(
        carWrapperRef.current,
        {
          y: 120,
          x: -60,
          rotate: -5,
          scale: 1.05,
          ease: "power1.inOut",
          duration: 0.3,
        },
        0
      );

      // Road lane lines rushing backward
      if (roadLinesRef.current) {
        scrollTl.to(
          roadLinesRef.current,
          {
            y: 400,
            ease: "none",
            duration: 1,
          },
          0
        );
      }

      // Stats 0 & 1 interact when car drives near them
      scrollTl.to(
        '.stat-card[data-index="0"], .stat-card[data-index="1"]',
        {
          y: -12,
          scale: 1.03,
          borderColor: "rgba(255, 94, 20, 0.6)",
          boxShadow: "0 10px 30px -5px rgba(255, 94, 20, 0.3)",
          ease: "power1.out",
          duration: 0.15,
        },
        0.1
      );
      scrollTl.to(
        '.stat-card[data-index="0"], .stat-card[data-index="1"]',
        {
          y: 0,
          scale: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          ease: "power1.in",
          duration: 0.15,
        },
        0.3
      );

      // Stage 2: S-curve trajectory cutting across center toward right side
      scrollTl.to(
        carWrapperRef.current,
        {
          y: 260,
          x: 75,
          rotate: 7,
          scale: 1.12,
          ease: "power1.inOut",
          duration: 0.35,
        },
        0.3
      );

      // Stats 2 & 3 interact when car sweeps past them
      scrollTl.to(
        '.stat-card[data-index="2"], .stat-card[data-index="3"]',
        {
          y: -12,
          scale: 1.03,
          borderColor: "rgba(255, 94, 20, 0.6)",
          boxShadow: "0 10px 30px -5px rgba(255, 94, 20, 0.3)",
          ease: "power1.out",
          duration: 0.15,
        },
        0.45
      );
      scrollTl.to(
        '.stat-card[data-index="2"], .stat-card[data-index="3"]',
        {
          y: 0,
          scale: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          ease: "power1.in",
          duration: 0.15,
        },
        0.65
      );

      // Stage 3: High speed straight realignment and dynamic downward exit
      scrollTl.to(
        carWrapperRef.current,
        {
          y: 480,
          x: 0,
          rotate: 0,
          scale: 1.2,
          ease: "power2.in",
          duration: 0.35,
        },
        0.65
      );

      // Headline and stats subtly recede as the journey passes into the next chapter
      scrollTl.to(
        ".headline-char",
        {
          opacity: 0.25,
          y: -30,
          stagger: 0.01,
          ease: "power1.out",
          duration: 0.4,
        },
        0.5
      );
      scrollTl.to(
        ".stat-card",
        {
          opacity: 0.4,
          y: -15,
          stagger: 0.05,
          ease: "power1.out",
          duration: 0.4,
        },
        0.55
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
        className="relative w-full h-[100svh] flex flex-col justify-between overflow-hidden bg-radial-dark pt-20 pb-8 sm:pb-12"
      >
        {/* Ambient Dark Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-40 pointer-events-none" />

        {/* Dynamic Road / Highway Centerline Markings */}
        <div
          ref={roadLinesRef}
          className="absolute inset-x-0 top-[-200px] bottom-[-200px] pointer-events-none flex justify-center will-change-transform opacity-30"
        >
          <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-white/40 to-transparent flex flex-col items-center gap-16 py-10">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-12 bg-accent/60 rounded-full shadow-[0_0_10px_rgba(255,94,20,0.8)]"
              />
            ))}
          </div>
        </div>

        {/* Top & Side Ambient Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-background/40 to-background pointer-events-none" />

        {/* Header Section: Spaced Headline */}
        <div className="relative z-10 w-full flex-shrink-0 pt-4 sm:pt-6">
          <Headline />
        </div>

        {/* Center Stage: Top-Down Supercar Visual */}
        <div className="relative z-20 w-full flex-1 flex items-center justify-center my-[-20px] sm:my-[-10px]">
          <div
            ref={carWrapperRef}
            className="relative will-change-transform transition-shadow"
          >
            <CarVisual />
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
