"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

export interface CanvasFXHandle {
  addSkidSegment: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width?: number,
    alpha?: number
  ) => void;
  emitTireSmoke: (x: number, y: number, count?: number) => void;
  emitExhaustSparks: (x: number, y: number, isBoosting?: boolean) => void;
  emitCheckpointRing: (x: number, y: number, color?: string) => void;
  updateRoadScroll: (deltaY: number) => void;
  setSpeedState: (velocity: number, isBoosting: boolean) => void;
  clear: () => void;
}

interface CanvasFXProps {
  className?: string;
}

// ==============================================================
// OBJECT POOL DEFINITIONS (Pre-allocated, zero runtime garbage)
// ==============================================================
const MAX_SKID_SEGMENTS = 250;
const MAX_PARTICLES = 160;
const MAX_RINGS = 12;
const MAX_SPEED_LINES = 25;

interface SkidSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
  width: number;
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  type: "smoke" | "spark";
  active: boolean;
}

interface ShockwaveRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  lineWidth: number;
  color: string;
  active: boolean;
}

interface SpeedLine {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
  active: boolean;
}

const CanvasFX = forwardRef<CanvasFXHandle, CanvasFXProps>(function CanvasFX(
  { className = "" },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References for mutable runtime state without triggering React re-renders
  const stateRef = useRef({
    velocity: 0,
    isBoosting: false,
    reducedMotion: false,
    width: 0,
    height: 0,
    dpr: 1,
    roadDeltaY: 0,
  });

  // Pools
  const skidPool = useRef<SkidSegment[]>([]);
  const particlePool = useRef<Particle[]>([]);
  const ringPool = useRef<ShockwaveRing[]>([]);
  const speedLinePool = useRef<SpeedLine[]>([]);

  // Initialize object pools once
  if (skidPool.current.length === 0) {
    for (let i = 0; i < MAX_SKID_SEGMENTS; i++) {
      skidPool.current.push({
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        alpha: 0,
        width: 4,
        active: false,
      });
    }

    for (let i = 0; i < MAX_PARTICLES; i++) {
      particlePool.current.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 0,
        alpha: 0,
        decay: 0.02,
        color: "#ffffff",
        type: "smoke",
        active: false,
      });
    }

    for (let i = 0; i < MAX_RINGS; i++) {
      ringPool.current.push({
        x: 0,
        y: 0,
        radius: 0,
        maxRadius: 180,
        alpha: 0,
        lineWidth: 3,
        color: "#ff5e14",
        active: false,
      });
    }

    for (let i = 0; i < MAX_SPEED_LINES; i++) {
      speedLinePool.current.push({
        x: 0,
        y: 0,
        length: 50,
        speed: 15,
        alpha: 0,
        active: false,
      });
    }
  }

  // Imperative handle exposed to Hero orchestrator
  useImperativeHandle(ref, () => ({
    addSkidSegment(x1, y1, x2, y2, width = 5, alpha = 0.85) {
      if (stateRef.current.reducedMotion) return;
      // Find inactive or oldest segment
      const pool = skidPool.current;
      let target: SkidSegment | null = null;
      for (let i = 0; i < pool.length; i++) {
        if (!pool[i].active) {
          target = pool[i];
          break;
        }
      }
      if (!target) {
        // Reuse first element (ring buffer fallback)
        target = pool[0];
      }
      target.x1 = x1;
      target.y1 = y1;
      target.x2 = x2;
      target.y2 = y2;
      target.width = width;
      target.alpha = alpha;
      target.active = true;
    },

    emitTireSmoke(x, y, count = 2) {
      if (stateRef.current.reducedMotion) return;
      const pool = particlePool.current;
      let spawned = 0;
      for (let i = 0; i < pool.length && spawned < count; i++) {
        if (!pool[i].active) {
          const p = pool[i];
          p.x = x + (Math.random() - 0.5) * 12;
          p.y = y + (Math.random() - 0.5) * 10;
          p.vx = (Math.random() - 0.5) * 1.5;
          p.vy = 1 + Math.random() * 2;
          p.size = 6 + Math.random() * 8;
          p.alpha = 0.5 + Math.random() * 0.3;
          p.decay = 0.018 + Math.random() * 0.015;
          p.color = Math.random() > 0.4 ? "rgba(220, 225, 235," : "rgba(180, 190, 205,";
          p.type = "smoke";
          p.active = true;
          spawned++;
        }
      }
    },

    emitExhaustSparks(x, y, isBoosting = false) {
      if (stateRef.current.reducedMotion) return;
      const pool = particlePool.current;
      let spawned = 0;
      const count = isBoosting ? 4 : 2;
      for (let i = 0; i < pool.length && spawned < count; i++) {
        if (!pool[i].active) {
          const p = pool[i];
          p.x = x + (Math.random() - 0.5) * 8;
          p.y = y;
          p.vx = (Math.random() - 0.5) * 4;
          p.vy = 4 + Math.random() * 6; // shoots backward
          p.size = 2 + Math.random() * 2;
          p.alpha = 1;
          p.decay = 0.05 + Math.random() * 0.04;
          p.color = isBoosting ? "#00f0ff" : "#ff5e14";
          p.type = "spark";
          p.active = true;
          spawned++;
        }
      }
    },

    emitCheckpointRing(x, y, color = "#ff5e14") {
      if (stateRef.current.reducedMotion) return;
      const pool = ringPool.current;
      for (let i = 0; i < pool.length; i++) {
        if (!pool[i].active) {
          const r = pool[i];
          r.x = x;
          r.y = y;
          r.radius = 15;
          r.maxRadius = 260;
          r.alpha = 1;
          r.lineWidth = 6;
          r.color = color;
          r.active = true;
          break;
        }
      }
    },

    updateRoadScroll(deltaY) {
      stateRef.current.roadDeltaY = deltaY;
    },

    setSpeedState(velocity, isBoosting) {
      stateRef.current.velocity = velocity;
      stateRef.current.isBoosting = isBoosting;
    },

    clear() {
      skidPool.current.forEach((s) => (s.active = false));
      particlePool.current.forEach((p) => (p.active = false));
      ringPool.current.forEach((r) => (r.active = false));
      speedLinePool.current.forEach((s) => (s.active = false));
    },
  }));

  // Canvas lifecycle, resize listener, and RAF rendering engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    stateRef.current.reducedMotion = mediaQuery.matches;

    const handleMediaChange = (e: MediaQueryListEvent) => {
      stateRef.current.reducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // Resize handling with devicePixelRatio caching
    const updateSize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      stateRef.current.width = width;
      stateRef.current.height = height;
      stateRef.current.dpr = dpr;

      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });

    let animationFrameId: number;
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // ==============================================================
    // MASTER 60 FPS CANVAS TICKER
    // ==============================================================
    const render = () => {
      if (isTabVisible && !stateRef.current.reducedMotion) {
        const { width, height, velocity, isBoosting, roadDeltaY } = stateRef.current;

        ctx.clearRect(0, 0, width, height);

        // 1. RENDER & SCROLL SKID MARKS
        const skids = skidPool.current;
        for (let i = 0; i < skids.length; i++) {
          const s = skids[i];
          if (!s.active) continue;

          // Scroll with the road
          s.y1 += roadDeltaY;
          s.y2 += roadDeltaY;

          // Fade out over time
          s.alpha *= 0.993;

          // Cull if offscreen or invisible
          if (s.alpha < 0.015 || s.y1 > height + 80 || s.y2 > height + 80) {
            s.active = false;
            continue;
          }

          ctx.beginPath();
          ctx.strokeStyle = `rgba(10, 12, 16, ${s.alpha.toFixed(3)})`;
          ctx.lineWidth = s.width;
          ctx.lineCap = "round";
          ctx.moveTo(s.x1, s.y1);
          ctx.lineTo(s.x2, s.y2);
          ctx.stroke();
        }

        // 2. RENDER SHOCKWAVE EXPANSION RINGS
        const rings = ringPool.current;
        for (let i = 0; i < rings.length; i++) {
          const r = rings[i];
          if (!r.active) continue;

          r.radius += 7;
          r.alpha *= 0.94;
          r.lineWidth = Math.max(1, r.lineWidth * 0.96);

          if (r.alpha < 0.02 || r.radius > r.maxRadius) {
            r.active = false;
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = r.color;
          ctx.globalAlpha = r.alpha;
          ctx.lineWidth = r.lineWidth;
          ctx.shadowColor = r.color;
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.restore();
        }

        // 3. RENDER PARTICLES (Smoke & Sparks)
        const particles = particlePool.current;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!p.active) continue;

          p.x += p.vx;
          p.y += p.vy + roadDeltaY * 0.5;
          p.alpha -= p.decay;

          if (p.type === "smoke") {
            p.size += 0.35; // Expands outward as it disperses
            ctx.beginPath();
            ctx.fillStyle = `${p.color} ${p.alpha.toFixed(3)})`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Spark: tiny fast needle
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          if (p.alpha <= 0 || p.y > height + 40 || p.y < -40) {
            p.active = false;
          }
        }

        // 4. RENDER EDGE SPEED LINES (High Velocity & Nitro)
        if (velocity > 0.45 || isBoosting) {
          const lines = speedLinePool.current;
          const spawnChance = isBoosting ? 0.65 : 0.35;

          // Spawn new speed lines along screen edges (left 15% and right 15%)
          if (Math.random() < spawnChance) {
            for (let i = 0; i < lines.length; i++) {
              if (!lines[i].active) {
                const isLeft = Math.random() > 0.5;
                lines[i].x = isLeft
                  ? Math.random() * (width * 0.16)
                  : width - Math.random() * (width * 0.16);
                lines[i].y = -60;
                lines[i].length = (40 + Math.random() * 80) * (isBoosting ? 1.6 : 1);
                lines[i].speed = (18 + Math.random() * 24) * (velocity * 1.5 + (isBoosting ? 0.8 : 0));
                lines[i].alpha = 0.25 + Math.random() * 0.45;
                lines[i].active = true;
                break;
              }
            }
          }

          // Update & draw active speed lines
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line.active) continue;

            line.y += line.speed;
            if (line.y > height + 80) {
              line.active = false;
              continue;
            }

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = isBoosting
              ? `rgba(0, 240, 255, ${line.alpha})`
              : `rgba(255, 255, 255, ${line.alpha * 0.7})`;
            ctx.lineWidth = isBoosting ? 2 : 1.2;
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.x, line.y + line.length);
            ctx.stroke();
            ctx.restore();
          }
        }

        // Reset per-frame road delta
        stateRef.current.roadDeltaY = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateSize);
      mediaQuery.removeEventListener("change", handleMediaChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none z-10 ${className}`}
      style={{ willChange: "transform" }}
    />
  );
});

export default CanvasFX;
