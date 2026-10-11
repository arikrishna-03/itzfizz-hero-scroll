"use client";

import React from "react";

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  ariaLabel: string;
}

export const STATS_DATA: StatItem[] = [
  {
    id: "stat-1",
    value: 58,
    suffix: "%",
    label: "Increase in user interaction",
    ariaLabel: "58 percent increase in user interaction",
  },
  {
    id: "stat-2",
    value: 23,
    suffix: "%",
    label: "Increase in revenue",
    ariaLabel: "23 percent increase in revenue",
  },
  {
    id: "stat-3",
    value: 27,
    suffix: "%",
    label: "Boost in engagement",
    ariaLabel: "27 percent boost in engagement",
  },
  {
    id: "stat-4",
    value: 40,
    suffix: "%",
    label: "Decrease in bounce rate",
    ariaLabel: "40 percent decrease in bounce rate",
  },
];

interface StatCounterProps {
  stats?: StatItem[];
}

export default function StatCounter({ stats = STATS_DATA }: StatCounterProps) {
  return (
    <ul
      role="list"
      aria-label="Impact Metrics"
      className="stats-container grid grid-cols-2 lg:grid-cols-4 w-full max-w-5xl mx-auto rounded-2xl bg-surface/80 border border-white/10 backdrop-blur-md shadow-2xl relative"
    >
      {stats.map((stat, idx) => (
        <li
          key={stat.id}
          className="hero-stat-block group relative flex flex-col items-center justify-center py-4 px-3 sm:py-6 sm:px-6 text-center cursor-default transition-all duration-300 ease-out hover:-translate-y-1.5 hover:bg-white/[0.02]"
        >
          {/* Subtle Vertical Divider between stats (except last on row) */}
          {idx < stats.length - 1 && (
            <div
              className={`hero-stat-divider absolute right-0 top-[15%] bottom-[15%] w-[1px] bg-white/10 pointer-events-none origin-top transition-colors duration-300 group-hover:bg-accent group-hover:shadow-[0_0_12px_var(--accent-glow-bright)] ${
                idx === 1 ? "hidden lg:block" : ""
              }`}
              aria-hidden="true"
            />
          )}

          {/* Horizontal Divider for 2x2 mobile grid */}
          {idx < 2 && (
            <div
              className="lg:hidden absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-white/10 pointer-events-none transition-colors duration-300 group-hover:bg-accent group-hover:shadow-[0_0_12px_var(--accent-glow-bright)]"
              aria-hidden="true"
            />
          )}

          {/* Large Stat Number */}
          <div
            className="flex items-baseline justify-center gap-0.5 text-accent transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]"
            aria-label={stat.ariaLabel}
          >
            <span
              id={`stat-num-${idx}`}
              className="stat-number tabular-nums font-heading font-bold text-[clamp(1.85rem,4.5vw,3.6rem)] leading-none"
            >
              0
            </span>
            <span className="stat-suffix text-[clamp(1.1rem,2.4vw,2rem)] font-bold text-accent group-hover:text-white transition-colors duration-300">
              {stat.suffix}
            </span>
          </div>

          {/* Description beneath number (0.9rem, 60% opacity) */}
          <p className="hero-stat-desc mt-2 text-[clamp(0.75rem,1.1vw,0.9rem)] text-[#F5F5F7]/60 leading-snug font-normal max-w-[170px] transition-colors duration-300 group-hover:text-[#F5F5F7]">
            {stat.label}
          </p>
        </li>
      ))}
    </ul>
  );
}
