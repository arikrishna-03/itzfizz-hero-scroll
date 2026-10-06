"use client";

import React from "react";
import StatCard, { StatItem } from "./StatCard";

// The 4 mandatory benchmark metrics defined in specification
export const STATS_DATA: StatItem[] = [
  {
    id: "pickup-1",
    value: 58,
    suffix: "%",
    title: "Increase in pick up point use",
    direction: "up",
    badge: "Telemetry A-1",
  },
  {
    id: "calls-1",
    value: 23,
    suffix: "%",
    title: "Decrease in customer phone calls",
    direction: "down",
    badge: "Efficiency B-2",
  },
  {
    id: "pickup-2",
    value: 27,
    suffix: "%",
    title: "Increase in pick up point use",
    direction: "up",
    badge: "Throughput C-3",
  },
  {
    id: "calls-2",
    value: 40,
    suffix: "%",
    title: "Decrease in customer phone calls",
    direction: "down",
    badge: "Resolution D-4",
  },
];

export default function StatsGrid() {
  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {STATS_DATA.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} index={index} />
        ))}
      </div>
    </div>
  );
}
