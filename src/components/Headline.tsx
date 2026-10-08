"use client";

import React, { memo } from "react";

const HEADLINE_TEXT = "WELCOME ITZFIZZ";

interface HeadlineProps {
  className?: string;
}

/**
 * Headline component with letter-by-letter masked reveal.
 * Each letter sits in an overflow-hidden wrapper so GSAP can rise it from below the mask.
 */
const Headline = memo(function Headline({ className = "" }: HeadlineProps) {
  const words = HEADLINE_TEXT.split(" ");

  return (
    <div className={`relative z-20 w-full text-center px-4 select-none pointer-events-none ${className}`}>
      <h1
        aria-label={HEADLINE_TEXT}
        className="font-heading uppercase font-black tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.45em] lg:tracking-[0.55em] leading-none drop-shadow-[0_10px_35px_rgba(255,255,255,0.15)]"
        style={{
          fontSize: "clamp(1.5rem, 4vw + 0.8rem, 4.5rem)",
        }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap mx-2 sm:mx-4">
            {word.split("").map((char, charIndex) => (
              <span
                key={`${wordIndex}-${charIndex}`}
                className="headline-char-mask inline-block overflow-hidden pb-1"
              >
                <span
                  className="headline-char inline-block will-change-[transform,opacity] text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400"
                  style={{
                    textShadow: "0 0 35px rgba(255, 94, 20, 0.3)",
                  }}
                >
                  {char}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h1>

      {/* High-tech sub-header */}
      <p className="headline-sub mt-3 md:mt-4 text-[10px] sm:text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-neutral-400 max-w-xl mx-auto flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse inline-block" />
        High-Performance Scroll-Driven Racing Dynamics
      </p>
    </div>
  );
});

export default Headline;
