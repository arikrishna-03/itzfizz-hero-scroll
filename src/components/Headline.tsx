"use client";

import React from "react";

// Component constants
const HEADLINE_TEXT = "WELCOME ITZFIZZ";
const LETTER_SPACING_CLASS = "tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.45em] lg:tracking-[0.55em]";

export default function Headline() {
  const words = HEADLINE_TEXT.split(" ");

  return (
    <div className="relative z-10 w-full text-center px-4 select-none pointer-events-none">
      <h1
        aria-label={HEADLINE_TEXT}
        className={`font-heading uppercase font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400/60 leading-none drop-shadow-[0_10px_35px_rgba(255,255,255,0.15)] ${LETTER_SPACING_CLASS}`}
        style={{
          fontSize: "clamp(1.5rem, 4.2vw + 0.8rem, 4.75rem)",
        }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap mx-2 sm:mx-4">
            {word.split("").map((char, charIndex) => (
              <span
                key={`${wordIndex}-${charIndex}`}
                className="headline-char inline-block will-change-[transform,opacity] transition-colors duration-300"
                style={{
                  textShadow: "0 0 30px rgba(255, 94, 20, 0.2)",
                }}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </h1>
      
      {/* Sleek subtitle tagline */}
      <p className="headline-sub mt-3 md:mt-4 text-[10px] sm:text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-neutral-400/80 max-w-xl mx-auto flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse inline-block" />
        Next-Gen Performance & Logistics Optimization
      </p>
    </div>
  );
}
