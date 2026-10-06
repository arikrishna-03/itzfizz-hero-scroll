"use client";

import React from "react";
import { Cpu, Wind, Activity, Zap, Compass, CheckCircle2 } from "lucide-react";

export default function AboutSection() {
  const specs = [
    {
      icon: Cpu,
      title: "Realtime Telemetry Sync",
      desc: "Instantaneous sub-millisecond data pipelines coordinating pickup hubs and automated routing engines.",
    },
    {
      icon: Wind,
      title: "Fluid Aerodynamics",
      desc: "Ultra-low drag coefficient UI architecture running exclusively on GPU compositor layers at 60 FPS.",
    },
    {
      icon: Activity,
      title: "Predictive Dispatching",
      desc: "Machine-assisted logistics balancing order density, reducing telephone friction by 40% across all sectors.",
    },
    {
      icon: Zap,
      title: "Scrubbed Motion Precision",
      desc: "Physics-based interpolation providing continuous bi-directional scroll synchronization without layout shifts.",
    },
  ];

  return (
    <section id="about" className="relative w-full bg-surface-dark py-24 sm:py-32 px-4 sm:px-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-4 uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Architecture & Performance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight leading-tight">
            Engineered for Velocity. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-400 to-accent-cyan">
              Calibrated for Zero Friction.
            </span>
          </h2>
          <p className="mt-4 text-neutral-400 font-sans text-sm sm:text-base leading-relaxed">
            The ITZFIZZ kinetic engine demonstrates the intersection of pure automotive aesthetics and deterministic frontend animation logic. Built on GPU hardware-accelerated transforms and GSAP ScrollTrigger timeline interpolation.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {specs.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div
                key={i}
                className="group relative p-6 sm:p-8 rounded-2xl bg-surface/40 backdrop-blur-md border border-white/5 hover:border-accent/40 transition-all duration-300 hover:shadow-cardGlass"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-light flex items-center justify-center border border-white/10 group-hover:border-accent/40 group-hover:scale-105 transition-all duration-300 mb-6">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-2">
                  {spec.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {spec.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-mono text-neutral-500 group-hover:text-accent transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Verified Benchmark Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
