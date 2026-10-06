"use client";

import React from "react";
import { TrendingUp, TrendingDown, Zap, ShieldCheck } from "lucide-react";

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  title: string;
  direction: "up" | "down";
  badge: string;
}

interface StatCardProps {
  stat: StatItem;
  index: number;
}

export default function StatCard({ stat, index }: StatCardProps) {
  const isUp = stat.direction === "up";
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <div
      data-stat-card
      data-index={index}
      className="stat-card relative group p-4 sm:p-5 md:p-6 rounded-2xl bg-surface/70 backdrop-blur-xl border border-white/10 shadow-cardGlass transition-all duration-300 hover:border-accent/40 will-change-transform overflow-hidden"
    >
      {/* Background radial glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top telemetry row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent/70" />
          {stat.badge}
        </span>
        <div
          className={`flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full border ${
            isUp
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : "text-amber-400 bg-amber-500/10 border-amber-500/20"
          }`}
        >
          <Icon className="w-3 h-3" />
          <span>{isUp ? "+Metric" : "-Friction"}</span>
        </div>
      </div>

      {/* Metric value with animated counter */}
      <div className="flex items-baseline gap-1 my-1">
        <span
          data-counter-target={stat.value}
          className="stat-number font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)]"
        >
          0
        </span>
        <span className="font-heading font-bold text-2xl sm:text-3xl text-accent">
          {stat.suffix}
        </span>
      </div>

      {/* Description */}
      <p className="mt-2 text-xs sm:text-sm text-neutral-300/90 font-sans font-normal leading-snug">
        {stat.title}
      </p>

      {/* Bottom glowing accent trace */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
