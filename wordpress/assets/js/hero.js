/**
 * ITZFIZZ WordPress Hero Section Animation Engine
 * GSAP 3 + ScrollTrigger Choreography
 */

(function () {
  'use strict';

  // Fallback config if not localized
  const CFG = window.ITZFIZZ_HERO_CONFIG || {
    intro: {
      letterStagger: 0.045,
      letterDuration: 1.0,
      statGap: 0.18,
      statDuration: 0.9,
      countDuration: 1.6,
      ease: 'expo.out',
      startDelay: 0.3,
    },
    scroll: {
      pinDistance: { desktop: '300%', tablet: '250%', mobile: '200%' },
      scrub: 1.2,
      travelX: { desktop: 30, tablet: 24, mobile: 16 },
      ease: 'power2.inOut',
    },
    stats: [58, 23, 27, 40],
  };

  function initHero() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = document.getElementById('heroStage');
    const wrapper = document.getElementById('heroScrollWrapper');
    const headline = document.getElementById('headlineText');
    const accentLine = document.getElementById('accentLine');
    const objectOuter = document.getElementById('objectOuter');
    const objectInner = document.getElementById('objectInner');
    const headlineInner = document.getElementById('headlineInner');
    const statsInner = document.getElementById('statsInner');
    const glowInner = document.getElementById('glowInner');
    const glowOuter = document.getElementById('glowOuter');
    const chars = document.querySelectorAll('.itz-char');
    const statBlocks = document.querySelectorAll('.itz-stat-block');

    if (!stage || !wrapper) return;

    if (prefersReducedMotion) {
      gsap.to(stage, { opacity: 1, duration: 0.3 });
      gsap.set(chars, { opacity: 1, yPercent: 0 });
      gsap.set(headline, { letterSpacing: '0.5em' });
      gsap.set(accentLine, { scaleX: 1 });
      gsap.set(statBlocks, { opacity: 1, y: 0 });
      gsap.set(objectOuter, { opacity: 1, scale: 1 });
      CFG.stats.forEach((val, i) => {
        const el = document.getElementById(`stat-num-${i}`);
        if (el) el.textContent = val;
      });
      return;
    }

    // Set Preload Initial State
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    gsap.set(stage, { opacity: 0 });
    gsap.set(chars, { opacity: 0, yPercent: 100, filter: isDesktop ? 'blur(6px)' : 'none' });
    gsap.set(headline, { letterSpacing: '0.2em' });
    gsap.set(accentLine, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(statBlocks, { opacity: 0, y: 32, filter: isDesktop ? 'blur(8px)' : 'none' });
    gsap.set('.itz-stat-divider', { scaleY: 0, transformOrigin: 'top center' });
    gsap.set(objectOuter, { opacity: 0, scale: 0.92 });
    gsap.set(glowInner, { opacity: 0.18, scale: 1 });

    // Ambient radial pulse
    gsap.to(glowInner, {
      opacity: 0.23,
      scale: 1.04,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    // Mouse-follow glow (desktop fine pointer)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && glowOuter) {
      const quickX = gsap.quickTo(glowOuter, 'x', { duration: 0.8, ease: 'power2.out' });
      const quickY = gsap.quickTo(glowOuter, 'y', { duration: 0.8, ease: 'power2.out' });
      window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        quickX(nx * 24);
        quickY(ny * 24);
      }, { passive: true });
    }

    // Build Master Intro Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        initScroll();
      },
    });

    tl.to(stage, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);
    tl.to(objectOuter, { opacity: 1, scale: 1, duration: 1.2, ease: CFG.intro.ease }, 0.2);

    tl.addLabel('headline', CFG.intro.startDelay);
    tl.to(chars, {
      opacity: 1,
      yPercent: 0,
      filter: 'blur(0px)',
      duration: CFG.intro.letterDuration,
      stagger: { each: CFG.intro.letterStagger, from: 'center' },
      ease: CFG.intro.ease,
    }, 'headline');

    tl.to(headline, {
      letterSpacing: '0.5em',
      duration: 1.3,
      ease: CFG.intro.ease,
    }, 'headline');

    tl.to(accentLine, { scaleX: 1, duration: 0.8, ease: CFG.intro.ease }, 1.6);

    tl.addLabel('stats', 2.0);
    statBlocks.forEach((block, idx) => {
      const startTime = 2.0 + idx * CFG.intro.statGap;
      const div = block.querySelector('.itz-stat-divider');
      if (div) {
        tl.to(div, { scaleY: 1, duration: 0.6, ease: CFG.intro.ease }, startTime - 0.05);
      }
      tl.to(block, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: CFG.intro.statDuration,
        ease: CFG.intro.ease,
      }, startTime);

      const target = CFG.stats[idx];
      const numEl = document.getElementById(`stat-num-${idx}`);
      const counter = { val: 0 };
      tl.to(counter, {
        val: target,
        duration: CFG.intro.countDuration,
        ease: CFG.intro.ease,
        onUpdate: () => {
          if (numEl) numEl.textContent = Math.round(counter.val);
        },
      }, startTime);
    });

    let mm = null;
    function initScroll() {
      if (mm) mm.revert();
      mm = gsap.matchMedia();

      // Desktop
      mm.add('(min-width: 1024px)', () => {
        const travel = CFG.scroll.travelX.desktop;
        const st = gsap.timeline({
          defaults: { ease: CFG.scroll.ease },
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: `+=${CFG.scroll.pinDistance.desktop}`,
            pin: stage,
            scrub: CFG.scroll.scrub,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Phase 1: Travel
        st.fromTo(objectInner,
          { x: `-${travel}vw`, rotate: -4, scale: 0.9 },
          { x: `${travel}vw`, y: '-4vh', rotate: 4, scale: 1.15, duration: 0.45 },
          0.1
        )
        .fromTo(headline, { letterSpacing: '0.5em' }, { letterSpacing: '0.9em', duration: 0.45 }, 0.1)
        .fromTo(glowInner, { x: `-${travel * 0.4}vw` }, { x: `${travel * 0.4}vw`, duration: 0.45 }, 0.1);

        // Phase 2: Depth
        st.to(objectInner, { x: 0, y: 0, rotate: 0, scale: 1.4, filter: 'blur(3px)', duration: 0.35 }, 0.55)
          .to(headlineInner, { y: -60, opacity: 0, duration: 0.35 }, 0.55)
          .to(statsInner, { y: 45, opacity: 0.4, duration: 0.35 }, 0.55)
          .to(glowInner, { scale: 1.5, opacity: 0, duration: 0.35 }, 0.55);

        // Phase 3: Release
        st.to({}, { duration: 0.1 }, 0.9);
      });

      // Tablet / Mobile
      mm.add('(max-width: 1023px)', () => {
        const travel = CFG.scroll.travelX.mobile;
        const st = gsap.timeline({
          defaults: { ease: CFG.scroll.ease },
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: `+=${CFG.scroll.pinDistance.mobile}`,
            pin: stage,
            scrub: CFG.scroll.scrub,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        st.fromTo(objectInner, { x: `-${travel}vw`, scale: 0.92 }, { x: `${travel}vw`, scale: 1.05, duration: 0.45 }, 0.1)
          .to(objectInner, { x: 0, scale: 1.15, opacity: 0.2, duration: 0.35 }, 0.55)
          .to(headlineInner, { y: -30, opacity: 0, duration: 0.35 }, 0.55)
          .to(statsInner, { y: 25, opacity: 0.3, duration: 0.35 }, 0.55)
          .to(glowInner, { opacity: 0, duration: 0.35 }, 0.55);
      });
    }

    // Replay helper
    window.replayIntro = function () {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (mm) mm.revert();
      tl.restart();
    };

    // Theme toggle helper
    const themeBtn = document.getElementById('wpThemeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isBlue = wrapper.getAttribute('data-theme') === 'blue';
        wrapper.setAttribute('data-theme', isBlue ? 'lime' : 'blue');
        const lbl = document.getElementById('wpThemeLabel');
        if (lbl) lbl.textContent = isBlue ? 'LIME' : 'BLUE';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero);
  } else {
    initHero();
  }
})();
