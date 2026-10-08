/**
 * ============================================================================
 * ITZFIZZ — Scroll-Driven Automotive Hero Section
 * Modern Vanilla JavaScript (ES6+) Architecture
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Benchmark Gates Configuration
  // --------------------------------------------------------------------------
  const GATES_CONFIG = [
    {
      id: 'gate-1',
      gateNumber: 1,
      triggerProgress: 0.18,
      targetValue: 58,
      suffix: '%',
      title: 'Increase in pick up point use',
      badge: 'Sector A · Telemetry',
      cleared: false
    },
    {
      id: 'gate-2',
      gateNumber: 2,
      triggerProgress: 0.40,
      targetValue: 23,
      suffix: '%',
      title: 'Decrease in customer phone calls',
      badge: 'Sector B · Efficiency',
      cleared: false
    },
    {
      id: 'gate-3',
      gateNumber: 3,
      triggerProgress: 0.62,
      targetValue: 27,
      suffix: '%',
      title: 'Increase in pick up point use',
      badge: 'Sector C · Throughput',
      cleared: false
    },
    {
      id: 'gate-4',
      gateNumber: 4,
      triggerProgress: 0.84,
      targetValue: 40,
      suffix: '%',
      title: 'Decrease in customer phone calls',
      badge: 'Sector D · Resolution',
      cleared: false
    }
  ];

  // --------------------------------------------------------------------------
  // 2. Synthesized Web Audio Engine (Zero External Audio Files)
  // --------------------------------------------------------------------------
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = true;
      this.engineOsc = null;
      this.engineGain = null;
      this.noiseNode = null;
      this.noiseGain = null;
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      // Engine oscillator (warm sawtooth drone)
      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);
      this.engineOsc.start();

      this.initialized = true;
    }

    setMuted(muted) {
      this.isMuted = muted;
      if (!this.initialized && !muted) {
        this.init();
      }
      if (this.ctx && this.ctx.state === 'suspended' && !muted) {
        this.ctx.resume();
      }
      if (this.engineGain) {
        const targetGain = this.isMuted ? 0 : 0.08;
        this.engineGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
      }
    }

    updateEnginePitch(speedNorm, isBoosting) {
      if (!this.initialized || this.isMuted || !this.engineOsc) return;
      const baseFreq = 42 + speedNorm * 120 + (isBoosting ? 45 : 0);
      this.engineOsc.frequency.setTargetAtTime(baseFreq, this.ctx.currentTime, 0.05);

      const gain = 0.04 + speedNorm * 0.12 + (isBoosting ? 0.06 : 0);
      this.engineGain.gain.setTargetAtTime(gain, this.ctx.currentTime, 0.05);
    }

    playCheckpointChime() {
      if (!this.initialized || this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    }

    playConeHit() {
      if (!this.initialized || this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  }

  // --------------------------------------------------------------------------
  // 3. Object-Pooled Canvas FX Layer (60fps Particles & Skidmarks)
  // --------------------------------------------------------------------------
  class CanvasFX {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width = window.innerWidth;
      this.height = canvas.height = window.innerHeight;

      this.skidmarks = [];
      this.particles = [];
      this.rings = [];
      this.speedLines = [];

      // Pre-allocate speed lines
      for (let i = 0; i < 24; i++) {
        this.speedLines.push({
          x: Math.random() < 0.5 ? Math.random() * 120 : this.width - Math.random() * 120,
          y: Math.random() * this.height,
          length: 40 + Math.random() * 90,
          speed: 18 + Math.random() * 30,
          alpha: 0.1 + Math.random() * 0.4,
          active: false
        });
      }

      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    addSkidMark(x, y, width = 12) {
      this.skidmarks.push({
        x1: x - 20,
        y1: y,
        x2: x + 20,
        y2: y + 25,
        alpha: 0.7,
        width: width
      });
      if (this.skidmarks.length > 120) {
        this.skidmarks.shift();
      }
    }

    addSpark(x, y, isNitro) {
      if (this.particles.length > 80) return;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + Math.random() * 10,
        vx: (Math.random() - 0.5) * 4,
        vy: 4 + Math.random() * 8,
        size: 2 + Math.random() * 3,
        alpha: 1,
        color: isNitro ? '#00f0ff' : '#ff5e14'
      });
    }

    addShockwaveRing(x, y) {
      this.rings.push({
        x: x,
        y: y,
        radius: 10,
        maxRadius: 160,
        alpha: 1
      });
    }

    render(deltaScroll, speedNorm, isBoosting) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // 1. Skid marks rendering
      for (let i = this.skidmarks.length - 1; i >= 0; i--) {
        const s = this.skidmarks[i];
        s.y1 += deltaScroll;
        s.y2 += deltaScroll;
        s.alpha -= 0.0035;

        if (s.alpha <= 0 || s.y1 > this.height + 100) {
          this.skidmarks.splice(i, 1);
          continue;
        }

        this.ctx.strokeStyle = `rgba(10, 10, 14, ${s.alpha})`;
        this.ctx.lineWidth = s.width;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(s.x1, s.y1);
        this.ctx.lineTo(s.x1, s.y2);
        this.ctx.moveTo(s.x2, s.y1);
        this.ctx.lineTo(s.x2, s.y2);
        this.ctx.stroke();
      }

      // 2. Particles (Nitro sparks / exhaust embers)
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy + deltaScroll * 0.5;
        p.alpha -= 0.035;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
      }

      // 3. Shockwave rings
      for (let i = this.rings.length - 1; i >= 0; i--) {
        const r = this.rings[i];
        r.radius += (r.maxRadius - r.radius) * 0.12;
        r.alpha -= 0.025;

        if (r.alpha <= 0) {
          this.rings.splice(i, 1);
          continue;
        }

        this.ctx.strokeStyle = `rgba(0, 240, 255, ${r.alpha})`;
        this.ctx.lineWidth = 4 * r.alpha;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
      }

      // 4. Edge speed lines (Active at high velocity or boost)
      if (speedNorm > 0.45 || isBoosting) {
        const lineCount = isBoosting ? 18 : Math.floor(speedNorm * 14);
        for (let i = 0; i < lineCount; i++) {
          const l = this.speedLines[i];
          l.y += l.speed + speedNorm * 25;
          if (l.y > this.height) {
            l.y = -l.length;
            l.x = Math.random() < 0.5 ? Math.random() * 140 : this.width - Math.random() * 140;
          }

          this.ctx.strokeStyle = isBoosting ? `rgba(0, 240, 255, ${l.alpha})` : `rgba(255, 255, 255, ${l.alpha * 0.7})`;
          this.ctx.lineWidth = isBoosting ? 2.5 : 1.5;
          this.ctx.beginPath();
          this.ctx.moveTo(l.x, l.y);
          this.ctx.lineTo(l.x, l.y + l.length);
          this.ctx.stroke();
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // 4. Main Application Master Controller
  // --------------------------------------------------------------------------
  class RacingHeroApp {
    constructor() {
      // DOM Elements
      this.heroContainer = document.getElementById('heroContainer');
      this.cameraBox = document.getElementById('cameraBox');
      this.carAnchor = document.getElementById('carAnchor');
      this.carUnderglow = document.getElementById('carUnderglow');
      this.leftFlame = document.getElementById('leftFlame');
      this.rightFlame = document.getElementById('rightFlame');
      this.roadStrip = document.getElementById('roadStrip');
      this.canvas = document.getElementById('fxCanvas');
      
      // HUD Elements
      this.speedValEl = document.getElementById('speedVal');
      this.gearBadgeEl = document.getElementById('gearBadge');
      this.speedNeedle = document.getElementById('speedNeedle');
      this.trackFillEl = document.getElementById('trackProgressFill');
      this.checkpointToast = document.getElementById('checkpointToast');
      this.toastTitle = document.getElementById('toastTitle');
      this.toastSubtitle = document.getElementById('toastSubtitle');
      this.nitroBtn = document.getElementById('nitroBtn');
      this.nitroFill = document.getElementById('nitroFill');
      this.audioToggleBtn = document.getElementById('audioToggleBtn');
      this.audioStatusText = document.getElementById('audioStatusText');

      // State
      this.scrollProgress = 0;
      this.lastScrollY = window.scrollY;
      this.scrollVelocity = 0;
      this.speedNorm = 0; // 0 to 1
      this.speedKmh = 0;
      this.gear = 1;

      // Steering & Physics
      this.targetCarX = 0; // -1 to 1 normalized across road
      this.carX = 0;
      this.steeringAngle = 0;
      this.tiltAngle = 0;
      this.isDrifting = false;

      // Boost & Nitro
      this.isBoosting = false;
      this.nitroFuel = 100; // 0 to 100

      // Subsystems
      this.sound = new SoundEngine();
      this.fx = new CanvasFX(this.canvas);
      this.gates = JSON.parse(JSON.stringify(GATES_CONFIG));
      this.roadOffset = 0;

      // Cones Easter Egg
      this.cones = [
        { el: document.getElementById('cone-1'), triggerProgress: 0.12, xOffset: -120, knocked: false },
        { el: document.getElementById('cone-2'), triggerProgress: 0.34, xOffset: 130, knocked: false },
        { el: document.getElementById('cone-3'), triggerProgress: 0.55, xOffset: -90, knocked: false },
        { el: document.getElementById('cone-4'), triggerProgress: 0.77, xOffset: 110, knocked: false },
      ];

      this.init();
    }

    init() {
      this.setupIntroHeadline();
      this.bindEvents();
      this.renderLoop();
    }

    // ------------------------------------------------------------------------
    // Intro Headline Reveal
    // ------------------------------------------------------------------------
    setupIntroHeadline() {
      const charElements = document.querySelectorAll('.headline-char');
      const subtitle = document.querySelector('.headline-subtitle');

      charElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('revealed');
        }, 120 + index * 45);
      });

      if (subtitle) {
        setTimeout(() => {
          subtitle.classList.add('revealed');
        }, 120 + charElements.length * 45 + 150);
      }
    }

    // ------------------------------------------------------------------------
    // Event Listeners (Mouse, Touch, Keyboard, Controls)
    // ------------------------------------------------------------------------
    bindEvents() {
      // 1. Mouse Steering
      window.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const norm = (e.clientX - centerX) / (centerX * 0.8);
        this.targetCarX = Math.max(-1, Math.min(1, norm));
      });

      // 2. Keyboard Controls (A/D, Arrows, Space, M)
      window.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          this.targetCarX = Math.max(-1, this.targetCarX - 0.25);
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          this.targetCarX = Math.min(1, this.targetCarX + 0.25);
        } else if (e.code === 'Space') {
          if (!this.isBoosting && this.nitroFuel > 15) {
            this.setBoosting(true);
          }
          e.preventDefault();
        } else if (e.code === 'KeyM') {
          this.toggleAudio();
        }
      });

      window.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
          this.setBoosting(false);
        }
      });

      // 3. Touch Controls for Mobile
      let touchStartX = 0;
      window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          const deltaX = e.touches[0].clientX - touchStartX;
          this.targetCarX = Math.max(-1, Math.min(1, this.targetCarX + deltaX / (window.innerWidth * 0.35)));
          touchStartX = e.touches[0].clientX;
        }
      }, { passive: true });

      // Mobile On-screen steer buttons
      const btnLeft = document.getElementById('steerLeftBtn');
      const btnRight = document.getElementById('steerRightBtn');
      if (btnLeft && btnRight) {
        btnLeft.addEventListener('click', () => {
          this.targetCarX = Math.max(-1, this.targetCarX - 0.35);
        });
        btnRight.addEventListener('click', () => {
          this.targetCarX = Math.min(1, this.targetCarX + 0.35);
        });
      }

      // 4. Nitro Button Click/Hold
      if (this.nitroBtn) {
        const startNitro = (e) => {
          e.preventDefault();
          this.setBoosting(true);
        };
        const stopNitro = (e) => {
          e.preventDefault();
          this.setBoosting(false);
        };
        this.nitroBtn.addEventListener('mousedown', startNitro);
        window.addEventListener('mouseup', stopNitro);
        this.nitroBtn.addEventListener('touchstart', startNitro, { passive: false });
        window.addEventListener('touchend', stopNitro);
      }

      // 5. Audio Toggle
      if (this.audioToggleBtn) {
        this.audioToggleBtn.addEventListener('click', () => this.toggleAudio());
      }

      // 6. Traffic Cones Manual Click Easter Egg
      this.cones.forEach(cone => {
        if (cone.el) {
          cone.el.addEventListener('click', () => this.knockCone(cone));
        }
      });

      // 7. Launch / Ignite Button
      const launchBtn = document.getElementById('launchBtn');
      if (launchBtn) {
        launchBtn.addEventListener('click', () => {
          window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
          if (this.sound.isMuted) this.toggleAudio();
        });
      }

      // 8. Ignition Top Button
      const igniteTopBtn = document.getElementById('igniteTopBtn');
      if (igniteTopBtn) {
        igniteTopBtn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }

    setBoosting(boost) {
      if (boost && this.nitroFuel > 10) {
        this.isBoosting = true;
        if (this.nitroBtn) this.nitroBtn.classList.add('active');
        if (this.carUnderglow) this.carUnderglow.classList.add('nitro');
        if (this.leftFlame) this.leftFlame.classList.add('nitro');
        if (this.rightFlame) this.rightFlame.classList.add('nitro');
      } else {
        this.isBoosting = false;
        if (this.nitroBtn) this.nitroBtn.classList.remove('active');
        if (this.carUnderglow) this.carUnderglow.classList.remove('nitro');
        if (this.leftFlame) this.leftFlame.classList.remove('nitro');
        if (this.rightFlame) this.rightFlame.classList.remove('nitro');
      }
    }

    toggleAudio() {
      const nextMuted = !this.sound.isMuted;
      this.sound.setMuted(nextMuted);
      if (this.audioStatusText) {
        this.audioStatusText.textContent = nextMuted ? 'Muted' : 'Sound ON';
      }
      if (this.audioToggleBtn) {
        this.audioToggleBtn.classList.toggle('text-accent-papaya', !nextMuted);
      }
    }

    knockCone(cone) {
      if (cone.knocked) return;
      cone.knocked = true;
      if (cone.el) cone.el.classList.add('knocked');
      this.sound.playConeHit();
      const carRect = this.carAnchor.getBoundingClientRect();
      this.fx.addShockwaveRing(carRect.left + carRect.width / 2, carRect.top + carRect.height / 2);
    }

    // ------------------------------------------------------------------------
    // Checkpoint Triggering & Animated Stats
    // ------------------------------------------------------------------------
    triggerCheckpoint(gate) {
      gate.cleared = true;
      const gateEl = document.getElementById(gate.id);
      if (gateEl) {
        gateEl.classList.add('passed-gate');
      }

      // Mark route progress point
      const marker = document.querySelector(`.gate-marker[data-gate="${gate.id}"]`);
      if (marker) {
        marker.classList.add('cleared');
      }

      // Count-up stat number
      const numEl = document.getElementById(`${gate.id}-num`);
      if (numEl) {
        let current = 0;
        const target = gate.targetValue;
        const duration = 850;
        const startTime = performance.now();

        const step = (time) => {
          const progress = Math.min(1, (time - startTime) / duration);
          current = Math.round(progress * target);
          numEl.textContent = `${current}${gate.suffix}`;
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
      }

      // Pop HUD Toast
      if (this.checkpointToast && this.toastTitle && this.toastSubtitle) {
        this.toastTitle.textContent = `CHECKPOINT ${gate.gateNumber} CLEARED: +${gate.targetValue}${gate.suffix}`;
        this.toastSubtitle.textContent = gate.title;
        this.checkpointToast.classList.add('show');
        setTimeout(() => {
          this.checkpointToast.classList.remove('show');
        }, 2800);
      }

      // Play chime & emit shockwave
      this.sound.playCheckpointChime();
      const carRect = this.carAnchor.getBoundingClientRect();
      this.fx.addShockwaveRing(carRect.left + carRect.width / 2, carRect.top + carRect.height / 2);
    }

    // ------------------------------------------------------------------------
    // 60FPS Main Animation & Physics Loop
    // ------------------------------------------------------------------------
    renderLoop() {
      // 1. Calculate Scroll Runway Progress
      const currentScrollY = window.scrollY;
      const totalRunway = this.heroContainer ? (this.heroContainer.offsetHeight - window.innerHeight) : 1;
      this.scrollProgress = Math.max(0, Math.min(1, currentScrollY / totalRunway));

      // 2. Velocity Tracking & Smoothing
      const deltaScroll = currentScrollY - this.lastScrollY;
      this.lastScrollY = currentScrollY;
      const rawVelocity = Math.abs(deltaScroll);

      // Smooth decay
      this.scrollVelocity = this.scrollVelocity * 0.88 + rawVelocity * 0.12;
      this.speedNorm = Math.min(1, this.scrollVelocity / 35);

      // 3. Speed & Nitro Calculations
      if (this.isBoosting) {
        this.nitroFuel = Math.max(0, this.nitroFuel - 0.45);
        if (this.nitroFuel <= 0) {
          this.setBoosting(false);
        }
      } else {
        this.nitroFuel = Math.min(100, this.nitroFuel + 0.15);
      }

      if (this.nitroFill) {
        this.nitroFill.style.width = `${this.nitroFuel}%`;
      }

      const boostBonus = this.isBoosting ? 65 : 0;
      this.speedKmh = Math.round(this.speedNorm * 290 + boostBonus);

      // Gear calculation
      if (this.speedKmh < 45) this.gear = 1;
      else if (this.speedKmh < 95) this.gear = 2;
      else if (this.speedKmh < 145) this.gear = 3;
      else if (this.speedKmh < 205) this.gear = 4;
      else if (this.speedKmh < 265) this.gear = 5;
      else this.gear = 6;

      // 4. Update HUD Elements
      if (this.speedValEl) this.speedValEl.textContent = this.speedKmh;
      if (this.gearBadgeEl) this.gearBadgeEl.textContent = this.gear;
      if (this.trackFillEl) this.trackFillEl.style.width = `${Math.round(this.scrollProgress * 100)}%`;

      if (this.speedNeedle) {
        // -125deg (0 km/h) to +125deg (360 km/h)
        const needleAngle = -125 + Math.min(1, this.speedKmh / 360) * 250;
        this.speedNeedle.setAttribute('transform', `rotate(${needleAngle} 50 50)`);
      }

      // 5. Sound Engine Pitch
      this.sound.updateEnginePitch(this.speedNorm, this.isBoosting);

      // 6. Car Steering Physics & Sway
      const prevCarX = this.carX;
      this.carX += (this.targetCarX - this.carX) * 0.1;
      const steerDelta = this.carX - prevCarX;

      this.steeringAngle = steerDelta * 120;
      this.tiltAngle = -this.steeringAngle * 0.45;
      this.isDrifting = Math.abs(steerDelta) > 0.015 && this.speedNorm > 0.25;

      // Road tarmac width bound (approx 340px each side)
      const maxDisplacement = Math.min(360, window.innerWidth * 0.38);
      const pixelX = this.carX * maxDisplacement;

      // Update Car DOM position
      if (this.carAnchor) {
        const shake = (Math.random() - 0.5) * (this.speedNorm * 3 + (this.isBoosting ? 4 : 0));
        this.carAnchor.style.transform = `translate(calc(-50% + ${pixelX + shake}px), 0) rotate(${this.tiltAngle}deg) scale(${this.isBoosting ? 1.04 : 1})`;
      }

      // Exhaust Flames
      const flamesActive = this.speedNorm > 0.18 || this.isBoosting;
      if (this.leftFlame && this.rightFlame) {
        this.leftFlame.classList.toggle('active', flamesActive);
        this.rightFlame.classList.toggle('active', flamesActive);
      }

      // 7. Road Lines & Asphalt Scrolling
      const roadSpeed = 4 + this.speedNorm * 28 + (this.isBoosting ? 14 : 0);
      this.roadOffset = (this.roadOffset + roadSpeed) % 110;
      if (this.roadStrip) {
        this.roadStrip.style.transform = `translateX(-50%) translateY(${this.roadOffset}px)`;
      }

      // 8. Gate Position & Checkpoint Triggers
      this.gates.forEach((gate) => {
        const gateEl = document.getElementById(gate.id);
        if (gateEl) {
          // Relative position on screen based on scroll runway
          // Appear at top (progress - triggerProgress), pass car at bottom
          const relativeDiff = gate.triggerProgress - this.scrollProgress;
          const screenY = (window.innerHeight * 0.5) + relativeDiff * (window.innerHeight * 4);

          // Position gate on road
          gateEl.style.top = `${screenY}px`;

          // If gate is near the car (screen bottom ~ 65%)
          if (!gate.cleared && this.scrollProgress >= gate.triggerProgress) {
            this.triggerCheckpoint(gate);
          }
        }
      });

      // 9. Traffic Cones Hit Detection
      this.cones.forEach(cone => {
        if (!cone.knocked && cone.el) {
          const relativeDiff = cone.triggerProgress - this.scrollProgress;
          const screenY = (window.innerHeight * 0.5) + relativeDiff * (window.innerHeight * 4);
          cone.el.style.top = `${screenY}px`;
          cone.el.style.left = `calc(50% + ${cone.xOffset}px)`;

          // Check collision with car
          const carY = window.innerHeight * 0.65;
          const carScreenX = (window.innerWidth / 2) + pixelX;
          const coneScreenX = (window.innerWidth / 2) + cone.xOffset;

          if (Math.abs(screenY - carY) < 45 && Math.abs(carScreenX - coneScreenX) < 55) {
            this.knockCone(cone);
          }
        }
      });

      // 10. Canvas FX & Skidmarks
      const carRect = this.carAnchor ? this.carAnchor.getBoundingClientRect() : null;
      if (carRect) {
        const carCenterX = carRect.left + carRect.width / 2;
        const carBottomY = carRect.bottom - 20;

        if (this.isDrifting) {
          this.fx.addSkidMark(carCenterX, carBottomY);
        }

        if (this.speedNorm > 0.3 || this.isBoosting) {
          this.fx.addSpark(carCenterX - 22, carBottomY, this.isBoosting);
          this.fx.addSpark(carCenterX + 22, carBottomY, this.isBoosting);
        }
      }

      this.fx.render(deltaScroll, this.speedNorm, this.isBoosting);

      // Loop
      requestAnimationFrame(() => this.renderLoop());
    }
  }

  // --------------------------------------------------------------------------
  // Initialize on DOM Ready
  // --------------------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new RacingHeroApp());
  } else {
    new RacingHeroApp();
  }

})();
