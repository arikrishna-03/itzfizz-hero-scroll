(function () {
      'use strict';

      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger unavailable.');
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const wrapper = document.getElementById('heroScrollWrapper');
      const stage = document.getElementById('heroStage');
      const headline = document.getElementById('headlineText');
      const headlineInner = document.getElementById('headlineInner');
      const accentLine = document.getElementById('accentLine');
      const objectOuter = document.getElementById('objectOuter');
      const objectInner = document.getElementById('objectInner');
      const carTopImg = document.getElementById('carTopImg');
      const carRearImg = document.getElementById('carRearImg');
      const carHeadlightBeams = document.getElementById('carHeadlightBeams');
      const carHeadlightFlares = document.getElementById('carHeadlightFlares');
      const heroTrackContainer = document.getElementById('heroTrackContainer');
      const heroTrackSurface = document.querySelector('.hero-track-surface');
      const carSpeedTrails = document.getElementById('carSpeedTrails');
      const scrollHint = document.getElementById('scrollHint');
      const scrollHintText = document.getElementById('scrollHintText');
      const telemetryStatusText = document.getElementById('telemetryStatusText');
      const glowInner = document.getElementById('glowInner');
      const glowOuter = document.getElementById('glowOuter');
      const chars = document.querySelectorAll('.char');
      const statBlocks = document.querySelectorAll('.stat-block');
      const statsOuter = document.getElementById('statsOuter');
      const street3DWorld = document.getElementById('street3DWorld');
      const carRearRoadReflection = document.getElementById('carRearRoadReflection');
      const cityHorizonBackdrop = document.getElementById('cityHorizonBackdrop');

      // Checkpoint Gates
      const gateStart = document.getElementById('gateStart');
      const gateSector1 = document.getElementById('gateSector1');
      const gateSector2 = document.getElementById('gateSector2');
      const gateSector3 = document.getElementById('gateSector3');
      const gateFinish = document.getElementById('gateFinish');

      const statBlock0 = document.getElementById('statBlock0');
      const statBlock1 = document.getElementById('statBlock1');
      const statBlock2 = document.getElementById('statBlock2');
      const statBlock3 = document.getElementById('statBlock3');

      const STATS = [58, 23, 27, 40];
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;


      // Ambient Radial Glow Pulse
      gsap.to(glowInner, {
        opacity: 0.28,
        scale: 1.05,
        duration: 3.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });

      // Idling Headlight Lens Flare Pulse
      gsap.to(['.flare-left', '.flare-right'], {
        scale: 1.18,
        opacity: 0.88,
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });

      // Mouse-Follow Subtle Ambient Parallax
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && glowOuter) {
        const quickGlowX = gsap.quickTo(glowOuter, 'x', { duration: 0.8, ease: 'power2.out' });
        const quickGlowY = gsap.quickTo(glowOuter, 'y', { duration: 0.8, ease: 'power2.out' });
        window.addEventListener('mousemove', (e) => {
          const normX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
          const normY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
          quickGlowX(normX * 20);
          quickGlowY(normY * 20);
        }, { passive: true });
      }

      // Sector Experience Sync (Hotspots removed)
      function syncSectorExperience(progress) {
        // No-op: Storefront hotspots removed as requested
      }

      // Reduced motion profile
      if (prefersReducedMotion) {
        gsap.to(stage, { opacity: 1, duration: 0.3 });
        gsap.set(heroTrackContainer, { opacity: 0 });
        gsap.set(street3DWorld, { opacity: 1 });
        syncSectorExperience(0.5);
        gsap.set(headlineInner, { opacity: 0 });
        gsap.set(objectOuter, { opacity: 1, y: '2vh' });
        gsap.set(objectInner, { x: 0, y: 0, scale: 1, rotate: 0 });
        gsap.set(carTopImg, { opacity: 0 });
        gsap.set([carHeadlightBeams, carHeadlightFlares], { opacity: 0 });
        gsap.set(carRearImg, { autoAlpha: 1 });
        gsap.set(carRearRoadReflection, { opacity: 0.85 });
        gsap.set(statBlocks, { opacity: 1, y: 0 });
        gsap.set(scrollHint, { opacity: 0 });
        if (telemetryStatusText) telemetryStatusText.textContent = 'TRACK ACTIVE // 60 FPS';
        STATS.forEach((val, i) => {
          const el = document.getElementById(`stat-num-${i}`);
          if (el) el.textContent = val;
        });
        return;
      }

      let introTl = null;
      let scrollTl = null;

      function initScrollExperience() {
        // Kill existing triggers if any
        if (scrollTl) scrollTl.kill();
        ScrollTrigger.getAll().forEach(t => t.kill());

        // Reset elements to initial State
        gsap.set(stage, { opacity: 0 });
        gsap.set(heroTrackContainer, { opacity: 0 });
        gsap.set(heroTrackSurface, { opacity: 1, rotateX: 0, scaleX: 1, scaleY: 1, y: 0 });
        gsap.set(street3DWorld, { opacity: 0 });
        syncSectorExperience(0);
        gsap.set(cityHorizonBackdrop, { y: 0 });
        gsap.set(headlineInner, { opacity: 1, y: 0 });
        gsap.set(chars, { opacity: 0, yPercent: 100 });
        gsap.set(headline, { letterSpacing: '0.14em' });
        gsap.set(accentLine, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(statBlocks, { opacity: 0, y: 28 });
        gsap.set('.stat-divider', { scaleY: 0, transformOrigin: 'top center' });

        // Car elements: ALWAYS visible and centered on home page!
        gsap.set(objectOuter, { opacity: 1, y: 0 });
        gsap.set(objectInner, { x: 0, y: 0, scale: 1, rotate: 0 });
        gsap.set(carTopImg, { autoAlpha: 1, scale: 1, scaleX: 1, scaleY: 1, rotateX: 0, y: 0 });
        gsap.set([carHeadlightBeams, carHeadlightFlares], { autoAlpha: 1, scale: 1, scaleX: 1, scaleY: 1, rotateX: 0, y: 0 });
        gsap.set(carRearImg, { autoAlpha: 0, rotateX: 0, scale: 1, scaleX: 1, scaleY: 1, y: 0 });
        gsap.set(carRearRoadReflection, { opacity: 0 });
        gsap.set(carSpeedTrails, { opacity: 0 });

        gsap.set(scrollHint, { opacity: 1 });
        if (scrollHintText) scrollHintText.textContent = 'SCROLL TO ENGAGE';
        gsap.set(statsOuter, { opacity: 1, y: 0, pointerEvents: 'auto' });

        // Reset gate positions & opacities
        gsap.set(gateStart, { y: 0, opacity: 1 });
        gsap.set([gateSector1, gateSector2, gateSector3, gateFinish], { y: 0, opacity: 0 });

        statBlocks.forEach(b => b.classList.remove('is-cleared'));

        if (telemetryStatusText) telemetryStatusText.textContent = 'READY // SCROLL DOWN';

        STATS.forEach((_, idx) => {
          const el = document.getElementById(`stat-num-${idx}`);
          if (el) el.textContent = '0';
        });

        // -------------------------------------------------------------
        // 1. ENTRANCE TIMELINE (Letters stagger & Stats count up)
        // -------------------------------------------------------------
        introTl = gsap.timeline({
          onComplete: () => {
            ScrollTrigger.refresh();
          }
        });

        introTl
          .to(stage, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
          .fromTo(objectOuter, { opacity: 0, scale: 0.88, y: 22 }, { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.15)
          .to(chars, {
            opacity: 1,
            yPercent: 0,
            duration: 0.85,
            stagger: { each: 0.04, from: 'center' },
            ease: 'expo.out'
          }, 0.25)
          .to(headline, {
            letterSpacing: '0.22em',
            duration: 1.1,
            ease: 'expo.out'
          }, 0.25)
          .to(accentLine, { scaleX: 1, duration: 0.65, ease: 'expo.out' }, 1.1);

        // Stats blocks reveal & count up
        statBlocks.forEach((block, idx) => {
          const startTime = 1.3 + idx * 0.14;
          const divider = block.querySelector('.stat-divider');
          if (divider) {
            introTl.to(divider, { scaleY: 1, duration: 0.5, ease: 'expo.out' }, startTime - 0.05);
          }
          introTl.to(block, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'expo.out'
          }, startTime);

          const target = STATS[idx];
          const numEl = document.getElementById(`stat-num-${idx}`);
          const counter = { val: 0 };
          introTl.to(counter, {
            val: target,
            duration: 1.3,
            ease: 'expo.out',
            onUpdate: () => {
              if (numEl) numEl.textContent = Math.round(counter.val);
            }
          }, startTime);
        });

        // -------------------------------------------------------------
        // 2. SCROLL-DRIVEN RACE (PINNED VIEWPORT, STARTS AT 0 / START LINE)
        // -------------------------------------------------------------
        scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: 'bottom bottom',
            pin: stage,
            scrub: 1.2,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              if (telemetryStatusText) {
                if (p < 0.12) {
                  telemetryStatusText.textContent = 'READY // SCROLL DOWN';
                } else if (p < 0.40) {
                  telemetryStatusText.textContent = '🏁 START // BEGIN THE RACE';
                } else if (p < 0.70) {
                  telemetryStatusText.textContent = 'SECTOR 01 // VELOCITY · 58%';
                } else if (p < 0.85) {
                  telemetryStatusText.textContent = 'SECTOR 02 // INERTIA · 23%';
                } else if (p < 0.95) {
                  telemetryStatusText.textContent = 'SECTOR 03 // APEX INTEGRITY';
                } else {
                  telemetryStatusText.textContent = '🏆 RACE COMPLETE // APEX CLEARED';
                }
              }

              // Highlight stat blocks as sectors pass
              if (statBlock0) statBlock0.classList.toggle('is-cleared', p >= 0.50);
              if (statBlock1) statBlock1.classList.toggle('is-cleared', p >= 0.70);
              if (statBlock2) statBlock2.classList.toggle('is-cleared', p >= 0.88);
              if (statBlock3) statBlock3.classList.toggle('is-cleared', p >= 0.88);

              // Sync Sector Checkpoints & Storefront Hotspots
              syncSectorExperience(p);
            }
          }
        });

        // 0.00 -> 0.08: Top hold buffer
        scrollTl.to({}, { duration: 0.08 });

        // 0.08 -> 0.28: The words "WELCOME ITZFIZZ" disappear & Track emerges
        scrollTl.to(headlineInner, {
          opacity: 0,
          y: -48,
          duration: 0.20,
          ease: 'power2.inOut'
        }, 0.08);

        scrollTl.to(accentLine, {
          scaleX: 0,
          duration: 0.16,
          ease: 'power2.in'
        }, 0.08);

        scrollTl.to(scrollHint, {
          opacity: 0,
          duration: 0.14
        }, 0.08);

        // 0.10 -> 0.28: THE ORIGINAL TRACK EMERGES AT 0 (START LINE // BEGIN THE RACE)
        scrollTl.to(heroTrackContainer, {
          opacity: 1,
          duration: 0.18,
          ease: 'power2.out'
        }, 0.10);

        // Car settles firmly into starting position directly behind the start gate
        scrollTl.to(objectInner, {
          scale: 1.08,
          duration: 0.18,
          ease: 'power2.out'
        }, 0.10);

        // Speed trails activate
        scrollTl.to(carSpeedTrails, {
          opacity: 0.8,
          duration: 0.16
        }, 0.20);

        // -------------------------------------------------------------
        // 3. THE RACE PROGRESSION & CAMERA ANGLE TRANSITION
        // -------------------------------------------------------------
        // 0.28 -> 0.44: Car launches across START LINE -> Start Line rolls past the car
        scrollTl.to(gateStart, {
          y: '85vh',
          duration: 0.16,
          ease: 'power1.inOut'
        }, 0.28);

        scrollTl.to(gateStart, {
          opacity: 0,
          duration: 0.06,
          ease: 'power2.out'
        }, 0.38);

        // When the car crosses the Start Line (0.28 -> 0.42), the bottom stats card dissolves smoothly!
        scrollTl.to(statsOuter, {
          opacity: 0,
          y: 45,
          duration: 0.14,
          ease: 'power2.inOut',
          pointerEvents: 'none'
        }, 0.28);

        // Headlight flares intensify as car launches
        scrollTl.to(carHeadlightFlares, {
          scale: 1.25,
          duration: 0.08,
          yoyo: true,
          repeat: 1
        }, 0.28);

        // -------------------------------------------------------------
        // 4. CRYSTAL-CLEAR SILKY-SMOOTH 3D CAMERA SWOOP & CAR MORPH
        // -------------------------------------------------------------
        // Car chassis gently descends in perspective to sit naturally on the wet asphalt in chase view
        scrollTl.to(objectOuter, {
          y: '2vh',
          duration: 0.16,
          ease: 'power2.inOut'
        }, 0.34);

        // Distant celestial horizon subtle depth parallax
        scrollTl.to(cityHorizonBackdrop, {
          y: '2vh',
          duration: 0.55,
          ease: 'none'
        }, 0.38);

        // Road tilts seamlessly into deep 3D perspective towards vanishing horizon
        scrollTl.to(heroTrackSurface, {
          rotateX: 62,
          scaleY: 1.40,
          scaleX: 1.30,
          y: '-5vh',
          duration: 0.16,
          ease: 'power2.inOut'
        }, 0.34);

        // High beam volumetric road cones fade down gracefully as camera tilts behind the car
        scrollTl.to([carHeadlightBeams, carHeadlightFlares], {
          opacity: 0,
          duration: 0.10,
          ease: 'power1.inOut'
        }, 0.34);

        // Top-down track smoothly dissolves as the 3D street corridor reveals
        scrollTl.to(heroTrackSurface, {
          opacity: 0,
          duration: 0.12,
          ease: 'power1.inOut'
        }, 0.38);

        // 3D street world fades in concurrently with the track tilt
        scrollTl.to(street3DWorld, {
          opacity: 1,
          duration: 0.14,
          ease: 'power1.inOut'
        }, 0.36);

        // Top-down car pitches forward in 3D perspective matching camera dive
        scrollTl.to(carTopImg, {
          rotateX: 58,
          scaleY: 0.72,
          scaleX: 0.96,
          y: 4,
          duration: 0.14,
          ease: 'power2.inOut'
        }, 0.34);

        // Butter-smooth, overlapping crossfade between top-down car and rear chase car
        scrollTl.to(carTopImg, {
          autoAlpha: 0,
          duration: 0.08,
          ease: 'power1.inOut'
        }, 0.40);

        scrollTl.fromTo(carRearImg,
          { autoAlpha: 0, rotateX: -6, scale: 0.92, y: 6 },
          { autoAlpha: 1, rotateX: 0, scale: 1.0, y: 0, duration: 0.08, ease: 'power2.out', immediateRender: false },
          0.40
        );

        // Taillight wet road reflection glow fades in alongside rear car
        scrollTl.to(carRearRoadReflection, {
          opacity: 0.85,
          duration: 0.08,
          ease: 'power2.out'
        }, 0.41);

        // Nitro speed trails flare during acceleration gear-shift
        scrollTl.to(carSpeedTrails, {
          scaleY: 1.6,
          opacity: 0.9,
          duration: 0.04,
          yoyo: true,
          repeat: 1
        }, 0.46);

        // -------------------------------------------------------------
        // 5. HIGH-SPEED 3D PERSPECTIVE CHECKPOINTS FLY OVERHEAD ALONG THE TRACK
        // -------------------------------------------------------------
        // 0.58 -> 0.72: SECTOR 01 (VELOCITY · 58%) moves down the 3D track
        scrollTl.to(gateSector1, {
          opacity: 1,
          duration: 0.05,
          ease: 'power1.out'
        }, 0.58);
        scrollTl.to(gateSector1, {
          y: '85vh',
          duration: 0.16,
          ease: 'power1.inOut'
        }, 0.58);
        scrollTl.to(gateSector1, {
          opacity: 0,
          duration: 0.05,
          ease: 'power2.out'
        }, 0.69);

        // 0.72 -> 0.86: SECTOR 02 (INERTIA · 23%) moves down the 3D track
        scrollTl.to(gateSector2, {
          opacity: 1,
          duration: 0.05,
          ease: 'power1.out'
        }, 0.72);
        scrollTl.to(gateSector2, {
          y: '85vh',
          duration: 0.16,
          ease: 'power1.inOut'
        }, 0.72);
        scrollTl.to(gateSector2, {
          opacity: 0,
          duration: 0.05,
          ease: 'power2.out'
        }, 0.83);

        // 0.85 -> 0.95: SECTOR 03 (APEX INTEGRITY) moves down the 3D track
        scrollTl.to(gateSector3, {
          opacity: 1,
          duration: 0.05,
          ease: 'power1.out'
        }, 0.85);
        scrollTl.to(gateSector3, {
          y: '85vh',
          duration: 0.14,
          ease: 'power1.inOut'
        }, 0.85);
        scrollTl.to(gateSector3, {
          opacity: 0,
          duration: 0.05,
          ease: 'power2.out'
        }, 0.94);

        // 0.95 -> 1.00: FINISH LINE (APEX CLEARED) moves down the 3D track
        scrollTl.to(gateFinish, {
          opacity: 1,
          duration: 0.04,
          ease: 'power1.out'
        }, 0.95);
        scrollTl.to(gateFinish, {
          y: '85vh',
          duration: 0.08,
          ease: 'power1.inOut'
        }, 0.95);
        scrollTl.to(gateFinish, {
          opacity: 0,
          duration: 0.03,
          ease: 'power2.out'
        }, 0.99);
      }

      // Font ready check before starting
      let hasStarted = false;
      function start() {
        if (hasStarted) return;
        hasStarted = true;
        initScrollExperience();
      }

      if (document.fonts && document.fonts.ready) {
        const timer = setTimeout(start, 1200);
        document.fonts.ready.then(() => {
          clearTimeout(timer);
          start();
        });
      } else {
        start();
      }

      // Replay button: Resets scroll and replays
      const replayBtn = document.getElementById('replayBtn');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'instant' });
          initScrollExperience();
        });
      }

      // Theme toggle: Switches between Electric Lime and Cyber Blue
      const themeBtn = document.getElementById('themeToggleBtn');
      const themeLbl = document.getElementById('themeLabel');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          const isBlue = document.body.getAttribute('data-theme') === 'blue';
          document.body.setAttribute('data-theme', isBlue ? 'lime' : 'blue');
          if (themeLbl) themeLbl.textContent = isBlue ? 'LIME' : 'BLUE';
        });
      }
    })();
