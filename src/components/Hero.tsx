"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Headline from "./Headline";
import Car from "./Car";
import CanvasFX, { CanvasFXHandle } from "./CanvasFX";
import HUD from "./HUD";
import StatGate, { GateData } from "./StatGate";
import ParallaxScenery from "./ParallaxScenery";
import TrafficCone, { ConeData } from "./TrafficCone";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ChevronDown } from "lucide-react";

// The 4 mandatory benchmark impact stats
const GATES_CONFIG: GateData[] = [
  {
    id: "gate-1",
    gateNumber: 1,
    progressTrigger: 0.18,
    targetValue: 58,
    suffix: "%",
    title: "Increase in pick up point use",
    direction: "up",
    badge: "Telemetry Sector A",
  },
  {
    id: "gate-2",
    gateNumber: 2,
    progressTrigger: 0.40,
    targetValue: 23,
    suffix: "%",
    title: "Decrease in customer phone calls",
    direction: "down",
    badge: "Efficiency Sector B",
  },
  {
    id: "gate-3",
    gateNumber: 3,
    progressTrigger: 0.62,
    targetValue: 27,
    suffix: "%",
    title: "Increase in pick up point use",
    direction: "up",
    badge: "Throughput Sector C",
  },
  {
    id: "gate-4",
    gateNumber: 4,
    progressTrigger: 0.84,
    targetValue: 40,
    suffix: "%",
    title: "Decrease in customer phone calls",
    direction: "down",
    badge: "Resolution Sector D",
  },
];

// Initial traffic cones easter egg
const INITIAL_CONES: ConeData[] = [
  { id: "cone-1", x: -90, progress: 0.11, isKnocked: false, knockDirection: -1 },
  { id: "cone-2", x: 95, progress: 0.32, isKnocked: false, knockDirection: 1 },
  { id: "cone-3", x: -75, progress: 0.54, isKnocked: false, knockDirection: -1 },
  { id: "cone-4", x: 80, progress: 0.76, isKnocked: false, knockDirection: 1 },
];

const SCROLL_DISTANCE_VH = 420; // 420vh distance for cinematic racing playthrough

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroScreenRef = useRef<HTMLDivElement>(null);
  const cameraShakeRef = useRef<HTMLDivElement>(null);
  const carWrapperRef = useRef<HTMLDivElement>(null);
  const roadSurfaceRef = useRef<HTMLDivElement>(null);
  const roadLinesRef = useRef<HTMLDivElement>(null);
  const canvasFXRef = useRef<CanvasFXHandle>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  // Gameplay State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [gear, setGear] = useState(1);
  const [velocityNorm, setVelocityNorm] = useState(0);
  const [checkpointsCleared, setCheckpointsCleared] = useState(0);
  const [isBoosting, setIsBoosting] = useState(false);
  const [steeringAngle, setSteeringAngle] = useState(0);
  const [chassisTilt, setChassisTilt] = useState(0);
  const [isDrifting, setIsDrifting] = useState(false);
  const [nightFactor, setNightFactor] = useState(0.2);

  // Checkpoint gate states: [id]: { isPassed, isFlashing, displayValue }
  const [gateStates, setGateStates] = useState<
    Record<string, { isPassed: boolean; isFlashing: boolean; displayValue: number }>
  >(() => {
    const init: Record<string, { isPassed: boolean; isFlashing: boolean; displayValue: number }> = {};
    GATES_CONFIG.forEach((g) => {
      init[g.id] = { isPassed: false, isFlashing: false, displayValue: 0 };
    });
    return init;
  });

  // Traffic Cones state
  const [cones, setCones] = useState<ConeData[]>(INITIAL_CONES);

  // Active toast notification in HUD
  const [activeToast, setActiveToast] = useState<{
    id: number;
    title: string;
    subtitle: string;
  } | null>(null);

  // Mutable Physics & Animation Loop References (No React overhead in ticker!)
  const physicsRef = useRef({
    targetProgress: 0,
    currentProgress: 0,
    prevProgress: 0,
    velocity: 0,
    smoothedVelocity: 0,
    targetSteerX: 0, // -1 to 1
    currentSteerX: 0,
    prevSteerX: 0,
    steerVelocity: 0,
    carXPixels: 0,
    isBoosting: false,
    reducedMotion: false,
    viewportWidth: 1200,
    viewportHeight: 800,
    roadScrollY: 0,
    lastFrameTime: 0,
  });

  // Checkpoint triggers tracking
  const clearedGatesRef = useRef<Set<string>>(new Set());

  // Mobile boost handler passed to HUD
  const handleMobileBoost = useCallback((active: boolean) => {
    physicsRef.current.isBoosting = active;
    setIsBoosting(active);
  }, []);

  // Keyboard navigation & controls (Arrow keys / A/D for steering, Space for boost)
  useEffect(() => {
    let keySteerIntent = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        physicsRef.current.isBoosting = true;
        setIsBoosting(true);
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        keySteerIntent = -1;
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        keySteerIntent = 1;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        physicsRef.current.isBoosting = false;
        setIsBoosting(false);
      } else if (
        (e.code === "ArrowLeft" || e.code === "KeyA") &&
        keySteerIntent === -1
      ) {
        keySteerIntent = 0;
      } else if (
        (e.code === "ArrowRight" || e.code === "KeyD") &&
        keySteerIntent === 1
      ) {
        keySteerIntent = 0;
      }
    };

    // Keyboard ticker interval for steering hold
    const steerInterval = setInterval(() => {
      if (keySteerIntent !== 0) {
        const next = Math.max(-1, Math.min(1, physicsRef.current.targetSteerX + keySteerIntent * 0.12));
        physicsRef.current.targetSteerX = next;
      }
    }, 16);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      clearInterval(steerInterval);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Mouse & Touch steering input
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Steer relative to screen center
      const centerX = window.innerWidth / 2;
      const normalized = (e.clientX - centerX) / (centerX * 0.75);
      physicsRef.current.targetSteerX = Math.max(-1, Math.min(1, normalized));
    };

    let touchStartX = 0;
    let initialSteer = 0;
    let lastTap = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        initialSteer = physicsRef.current.targetSteerX;

        // Double tap detection for boost
        const now = Date.now();
        if (now - lastTap < 300) {
          physicsRef.current.isBoosting = true;
          setIsBoosting(true);
          setTimeout(() => {
            physicsRef.current.isBoosting = false;
            setIsBoosting(false);
          }, 1500);
        }
        lastTap = now;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const normalized = initialSteer + deltaX / (window.innerWidth * 0.35);
        physicsRef.current.targetSteerX = Math.max(-1, Math.min(1, normalized));
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Cache measurements on resize
  useEffect(() => {
    const updateDimensions = () => {
      physicsRef.current.viewportWidth = window.innerWidth;
      physicsRef.current.viewportHeight = window.innerHeight;
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions, { passive: true });
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    physicsRef.current.reducedMotion = mq.matches;
    const handleChange = (e: MediaQueryListEvent) => {
      physicsRef.current.reducedMotion = e.matches;
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // ==============================================================
  // MASTER GSAP TIMELINES & SCROLL TRIGGER SETUP
  // ==============================================================
  useEffect(() => {
    const prefersReducedMotion = physicsRef.current.reducedMotion;

    const ctx = gsap.context(() => {
      // 1. INTRO ANIMATION TIMELINE (Letter-by-letter reveal + car roll-in)
      const introTl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      if (!prefersReducedMotion) {
        // Prepare initial states
        gsap.set(".headline-char", {
          yPercent: 120,
          opacity: 0,
        });
        gsap.set(".headline-sub", {
          y: 20,
          opacity: 0,
        });
        gsap.set(carWrapperRef.current, {
          y: 350,
          opacity: 0,
          scale: 0.88,
        });
        gsap.set(scrollCueRef.current, {
          opacity: 0,
          y: -15,
        });

        // Intro sequence
        introTl
          // Letters rise out of overflow mask
          .to(".headline-char", {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.04,
          })
          .to(
            ".headline-sub",
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
            },
            "-=0.5"
          )
          // Car drives in with rev rumble
          .to(
            carWrapperRef.current,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: "power2.out",
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
            "-=0.3"
          );
      } else {
        // Fallback for reduced motion
        gsap.set(".headline-char", { yPercent: 0, opacity: 1 });
        gsap.set(".headline-sub", { y: 0, opacity: 1 });
        gsap.set(carWrapperRef.current, { y: 0, opacity: 1, scale: 1 });
        gsap.set(scrollCueRef.current, { opacity: 1, y: 0 });
      }

      // 2. MASTER PINNED SCROLL TRIGGER
      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${SCROLL_DISTANCE_VH}%`,
        pin: heroScreenRef.current,
        scrub: prefersReducedMotion ? false : 0.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          physicsRef.current.targetProgress = self.progress;

          // Fade out scroll cue as soon as driving begins
          if (scrollCueRef.current) {
            const cueOpacity = Math.max(0, 1 - self.progress * 15);
            scrollCueRef.current.style.opacity = cueOpacity.toString();
          }
        },
      });

      // QuickSetters for direct transform updates (zero layout thrashing)
      const setCarX = gsap.quickSetter(carWrapperRef.current, "x", "px");
      const setCameraShake = gsap.quickSetter(cameraShakeRef.current, "transform");

      // 3. MASTER 60 FPS GSAP SHARED TICKER
      const updatePhysics = (time: number, deltaTime: number) => {
        const dt = Math.min(32, deltaTime) / 1000;
        const pState = physicsRef.current;

        // A. LERP SCROLL PROGRESS
        const progressLerpFactor = prefersReducedMotion ? 1 : 0.085;
        pState.currentProgress +=
          (pState.targetProgress - pState.currentProgress) * progressLerpFactor;

        // Calculate velocity (rate of change)
        const progressDelta = pState.currentProgress - pState.prevProgress;
        pState.velocity = Math.abs(progressDelta) / (dt || 0.016);
        pState.smoothedVelocity +=
          (pState.velocity - pState.smoothedVelocity) * 0.12;
        pState.prevProgress = pState.currentProgress;

        // Road scroll distance in pixels
        const trackPixelRate = 1800; // Track movement speed
        const roadDeltaY = progressDelta * trackPixelRate;
        pState.roadScrollY += roadDeltaY;

        // B. DAY-TO-NIGHT FACTOR (0 to 1 as progress increases)
        const night = Math.min(1, Math.max(0, pState.currentProgress * 1.15));

        // C. LERP STEERING POSITION & INERTIA
        const steerLerpFactor = 0.14;
        pState.currentSteerX +=
          (pState.targetSteerX - pState.currentSteerX) * steerLerpFactor;

        // Steer velocity & lateral G-force
        pState.steerVelocity = (pState.currentSteerX - pState.prevSteerX) / (dt || 0.016);
        pState.prevSteerX = pState.currentSteerX;

        // Maximum road steer range (clamped to asphalt width)
        const maxSteerWidth = Math.min(260, pState.viewportWidth * 0.28);
        pState.carXPixels = pState.currentSteerX * maxSteerWidth;
        setCarX(pState.carXPixels);

        // Wheels steering angle and chassis roll/tilt
        const wheelSteerAngle = (pState.targetSteerX - pState.currentSteerX) * 45;
        const bodyTilt = pState.currentSteerX * 5 - pState.steerVelocity * 6;

        // Drift check
        const isTurningFast =
          Math.abs(pState.steerVelocity) > 1.8 && pState.smoothedVelocity > 0.08;

        // D. SPEEDOMETER & GEAR COMPUTATION
        const speedMultiplier = pState.isBoosting ? 380 : 330;
        const calculatedKmh = Math.min(
          pState.isBoosting ? 385 : 345,
          Math.round(pState.smoothedVelocity * speedMultiplier + (pState.isBoosting ? 60 : 0))
        );

        let currentGear = 1;
        if (calculatedKmh > 290) currentGear = 7;
        else if (calculatedKmh > 235) currentGear = 6;
        else if (calculatedKmh > 180) currentGear = 5;
        else if (calculatedKmh > 130) currentGear = 4;
        else if (calculatedKmh > 80) currentGear = 3;
        else if (calculatedKmh > 35) currentGear = 2;

        // E. CAMERA SHAKE & SPEED-BLUR
        if (!prefersReducedMotion) {
          const shakeIntensity =
            (pState.smoothedVelocity > 0.35 ? pState.smoothedVelocity * 2.8 : 0) +
            (pState.isBoosting ? 4.5 : 0);

          if (shakeIntensity > 0.2) {
            const rx = (Math.random() - 0.5) * shakeIntensity;
            const ry = (Math.random() - 0.5) * shakeIntensity;
            const scale = pState.isBoosting ? 1.03 : 1;
            setCameraShake(`translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) scale(${scale})`);
          } else {
            setCameraShake("translate3d(0, 0, 0) scale(1)");
          }
        }

        // F. CANVAS FX UPDATES: SKID MARKS, PARTICLES, SMOKE
        if (canvasFXRef.current) {
          canvasFXRef.current.setSpeedState(
            pState.smoothedVelocity,
            pState.isBoosting
          );
          canvasFXRef.current.updateRoadScroll(roadDeltaY);

          // Rear tire contact positions for skid marks
          if (isTurningFast || pState.isBoosting) {
            const carCenterX = pState.viewportWidth / 2 + pState.carXPixels;
            const carRearY = pState.viewportHeight / 2 + 100;
            const wheelSpread = 38;

            canvasFXRef.current.addSkidSegment(
              carCenterX - wheelSpread,
              carRearY,
              carCenterX - wheelSpread,
              carRearY - roadDeltaY,
              5,
              0.85
            );
            canvasFXRef.current.addSkidSegment(
              carCenterX + wheelSpread,
              carRearY,
              carCenterX + wheelSpread,
              carRearY - roadDeltaY,
              5,
              0.85
            );

            // Tire smoke puffs
            canvasFXRef.current.emitTireSmoke(carCenterX - wheelSpread, carRearY, 1);
            canvasFXRef.current.emitTireSmoke(carCenterX + wheelSpread, carRearY, 1);
          }

          // Exhaust sparks when accelerating or boosting
          if (pState.smoothedVelocity > 0.25 || pState.isBoosting) {
            const carCenterX = pState.viewportWidth / 2 + pState.carXPixels;
            const carRearY = pState.viewportHeight / 2 + 130;
            canvasFXRef.current.emitExhaustSparks(carCenterX, carRearY, pState.isBoosting);
          }
        }

        // G. CHECKPOINT GATES COLLISION / TRIGGER DETECTION
        GATES_CONFIG.forEach((gate) => {
          if (
            pState.currentProgress >= gate.progressTrigger &&
            !clearedGatesRef.current.has(gate.id)
          ) {
            // Checkpoint CLEARED!
            clearedGatesRef.current.add(gate.id);

            // Trigger Gate Flash & Live Count-Up
            setGateStates((prev) => ({
              ...prev,
              [gate.id]: {
                ...prev[gate.id],
                isPassed: true,
                isFlashing: true,
              },
            }));

            // Stop flash after 350ms
            setTimeout(() => {
              setGateStates((prev) => ({
                ...prev,
                [gate.id]: {
                  ...prev[gate.id],
                  isFlashing: false,
                },
              }));
            }, 350);

            // Number count-up animation
            const counterObj = { val: 0 };
            gsap.to(counterObj, {
              val: gate.targetValue,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => {
                setGateStates((prev) => ({
                  ...prev,
                  [gate.id]: {
                    ...prev[gate.id],
                    displayValue: Math.round(counterObj.val),
                  },
                }));
              },
            });

            // Shockwave ring pulse expanding from car
            if (canvasFXRef.current) {
              const carCenterX = pState.viewportWidth / 2 + pState.carXPixels;
              const carCenterY = pState.viewportHeight / 2;
              canvasFXRef.current.emitCheckpointRing(
                carCenterX,
                carCenterY,
                gate.direction === "up" ? "#ff5e14" : "#00f0ff"
              );
            }

            // HUD +1 Checkpoint Pop Toast
            setActiveToast({
              id: Date.now(),
              title: `CHECKPOINT 0${gate.gateNumber} CLEARED!`,
              subtitle: `${gate.targetValue}${gate.suffix} ${gate.title}`,
            });

            // Auto-dismiss toast
            setTimeout(() => {
              setActiveToast(null);
            }, 3000);

            setCheckpointsCleared(clearedGatesRef.current.size);
          }
        });

        // H. EASTER EGG: TRAFFIC CONE COLLISIONS
        setCones((prevCones) => {
          let updated = false;
          const next = prevCones.map((cone) => {
            if (cone.isKnocked) return cone;
            // Check if car passes cone progress
            if (Math.abs(pState.currentProgress - cone.progress) < 0.015) {
              // Lateral distance check
              if (Math.abs(pState.carXPixels - cone.x) < 38) {
                updated = true;
                // Emit collision sparks
                if (canvasFXRef.current) {
                  const carCenterX = pState.viewportWidth / 2 + pState.carXPixels;
                  const carCenterY = pState.viewportHeight / 2;
                  canvasFXRef.current.emitExhaustSparks(carCenterX, carCenterY, false);
                }
                return {
                  ...cone,
                  isKnocked: true,
                  knockDirection: pState.carXPixels < cone.x ? 1 : -1,
                };
              }
            }
            return cone;
          });
          return updated ? next : prevCones;
        });

        // SYNC REACT STATE FOR HUD & CAR
        setScrollProgress(pState.currentProgress);
        setSpeedKmh(calculatedKmh);
        setGear(currentGear);
        setVelocityNorm(Math.min(1, pState.smoothedVelocity));
        setSteeringAngle(wheelSteerAngle);
        setChassisTilt(bodyTilt);
        setIsDrifting(isTurningFast);
        setNightFactor(night);
      };

      // Register shared ticker
      gsap.ticker.add(updatePhysics);

      // Visibility & Tab offscreen pausing
      const handleVisibilityChange = () => {
        if (document.hidden) {
          gsap.ticker.remove(updatePhysics);
        } else {
          gsap.ticker.add(updatePhysics);
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        gsap.ticker.remove(updatePhysics);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        scrollTriggerInstance.kill();
      };
    }, containerRef);

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
      {/* Pinned Viewport Screen */}
      <div
        ref={heroScreenRef}
        className="relative w-full h-[100svh] overflow-hidden flex flex-col justify-between"
      >
        {/* Camera Shake & FOV Zoom Shell */}
        <div
          ref={cameraShakeRef}
          className="relative w-full h-full flex flex-col justify-between will-change-transform"
        >
          {/* ============================================================== */}
          {/* 1. PARALLAX ROADSIDE SCENERY (3 DEPTH LAYERS + DAY-TO-NIGHT)  */}
          {/* ============================================================== */}
          <ParallaxScenery
            scrollOffsetY={physicsRef.current.roadScrollY}
            nightFactor={nightFactor}
          />

          {/* ============================================================== */}
          {/* 2. MULTI-LANE HIGHWAY CIRCUIT ROADWAY                          */}
          {/* ============================================================== */}
          <div
            ref={roadSurfaceRef}
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-3xl pointer-events-none overflow-hidden z-0"
          >
            {/* Asphalt surface */}
            <div className="relative w-full h-full mx-auto bg-gradient-to-b from-[#0a0c12] via-[#0d1017] to-[#0a0c12] border-x border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.95)]">
              {/* Left Racing Curb (Red & White Rumble Strip) */}
              <div
                className="absolute top-0 bottom-0 left-0 w-3 shadow-[0_0_15px_rgba(255,40,40,0.6)]"
                style={{
                  background:
                    "repeating-linear-gradient(to bottom, #ff2a2a 0px, #ff2a2a 24px, #ffffff 24px, #ffffff 48px)",
                }}
              />
              {/* Right Racing Curb (Red & White Rumble Strip) */}
              <div
                className="absolute top-0 bottom-0 right-0 w-3 shadow-[0_0_15px_rgba(255,40,40,0.6)]"
                style={{
                  background:
                    "repeating-linear-gradient(to bottom, #ff2a2a 0px, #ff2a2a 24px, #ffffff 24px, #ffffff 48px)",
                }}
              />

              {/* Lane guide lines */}
              <div className="absolute top-0 bottom-0 left-[26%] w-[1px] bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent" />
              <div className="absolute top-0 bottom-0 right-[26%] w-[1px] bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent" />

              {/* Center Dashed Highway Line (translates with road scroll) */}
              <div
                ref={roadLinesRef}
                className="absolute inset-x-0 -top-[900px] -bottom-[900px] will-change-transform flex justify-center opacity-85"
                style={{
                  transform: `translate3d(0, ${(physicsRef.current.roadScrollY * 0.9) % 240}px, 0)`,
                }}
              >
                <div className="w-[3px] h-full flex flex-col items-center gap-14 py-8">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-16 bg-gradient-to-b from-accent to-amber-300 rounded-full shadow-[0_0_12px_rgba(255,94,20,0.9)]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. HARDWARE-ACCELERATED CANVAS FX (SKID MARKS, SMOKE, RINGS)   */}
          {/* ============================================================== */}
          <CanvasFX ref={canvasFXRef} />

          {/* ============================================================== */}
          {/* 4. INTRO HEADLINE SECTION                                      */}
          {/* ============================================================== */}
          <div className="relative z-20 w-full pt-16 sm:pt-20 pb-4">
            <Headline />
          </div>

          {/* ============================================================== */}
          {/* 5. CHECKPOINT GATES ("DRIVE THROUGH THE STATS")                */}
          {/* ============================================================== */}
          <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
            {GATES_CONFIG.map((gate) => {
              // Calculate screen Y position based on scroll progress
              // When scrollProgress == gate.progressTrigger, gate is right at the car!
              const trackDistance = 1400; // Visual perspective depth
              const delta = gate.progressTrigger - scrollProgress;
              const screenY = delta * trackDistance;

              // Only render gate when near or in viewport
              if (screenY < -400 || screenY > 1200) return null;

              const state = gateStates[gate.id] || {
                isPassed: false,
                isFlashing: false,
                displayValue: 0,
              };

              return (
                <div
                  key={gate.id}
                  className="absolute inset-x-0 will-change-transform"
                  style={{
                    transform: `translate3d(0, ${screenY}px, 0)`,
                  }}
                >
                  <StatGate
                    gate={gate}
                    isPassed={state.isPassed}
                    isFlashing={state.isFlashing}
                    displayValue={state.displayValue}
                  />
                </div>
              );
            })}
          </div>

          {/* ============================================================== */}
          {/* 6. TRAFFIC CONES EASTER EGG                                    */}
          {/* ============================================================== */}
          <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
            {cones.map((cone) => {
              const trackDistance = 1400;
              const delta = cone.progress - scrollProgress;
              const screenY = delta * trackDistance + (physicsRef.current.viewportHeight / 2 || 350);

              if (screenY < -100 || screenY > 1000) return null;

              return (
                <div
                  key={cone.id}
                  className="absolute left-1/2 -translate-x-1/2 will-change-transform"
                  style={{
                    transform: `translate3d(${cone.x}px, ${screenY}px, 0)`,
                  }}
                >
                  <TrafficCone cone={cone} />
                </div>
              );
            })}
          </div>

          {/* ============================================================== */}
          {/* 7. CENTER STAGE: TOP-DOWN SVG HYPERCAR                         */}
          {/* ============================================================== */}
          <div className="relative z-20 w-full flex-1 flex items-center justify-center pointer-events-none">
            <div
              ref={carWrapperRef}
              className="relative will-change-transform"
            >
              <Car
                steeringAngle={steeringAngle}
                tiltAngle={chassisTilt}
                velocity={velocityNorm}
                isBoosting={isBoosting}
                isDrifting={isDrifting}
                nightFactor={nightFactor}
              />
            </div>
          </div>

          {/* ============================================================== */}
          {/* 8. SCROLL TO DRIVE CUE INDICATOR                              */}
          {/* ============================================================== */}
          <div
            ref={scrollCueRef}
            className="relative z-20 pb-20 flex flex-col items-center gap-1.5 pointer-events-none"
          >
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              Scroll to Drive
            </span>
            <ChevronDown className="w-4 h-4 text-accent animate-bounce" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 9. COCKPIT TELEMETRY HUD OVERLAY                               */}
        {/* ============================================================== */}
        <HUD
          velocity={velocityNorm}
          speedKmh={speedKmh}
          gear={gear}
          scrollProgress={scrollProgress}
          checkpointsCleared={checkpointsCleared}
          isBoosting={isBoosting}
          boostAvailable={true}
          activeToast={activeToast}
          onMobileBoostToggle={handleMobileBoost}
        />
      </div>
    </section>
  );
}
