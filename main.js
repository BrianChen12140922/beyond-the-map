/* ================================================================
   BEYOND THE MAP — main.js
   Design System v1.0 — Animation & Interaction Orchestrator
================================================================ */

/* ----------------------------------------------------------------
   DEBUG FLAG
   Flip to `true` (or set window.DEBUG = true; in DevTools) to enable
   console.* output across this file. Production ships with logging
   silenced so the browser console stays clean for end users.
---------------------------------------------------------------- */
const DEBUG = false;
if (typeof window !== 'undefined' && typeof window.DEBUG === 'undefined') {
  window.DEBUG = DEBUG;
}

/* ================================================================
   TABLE OF CONTENTS
   ─────────────────────────────────────────────────────────────
   01. Motion Tokens (mirrors Design System §4.2)
   02. Accessibility — Reduced Motion Check
   03. Plugin Registration
   04. Native Scroll Setup
   05. Splitting.js — Hero Title Char Split
   06. Hero Entry Animation Timeline (Design System §5.1)
   07. Hero Scroll-Out (parallax fade on scroll)
   08. Three.js Mist Particle Scene (Design System §7)
   09. Dragon Vein Scrollytelling (Design System §5.1)
   10. Bento Tile Reveal Animations (Design System §5.1)
   11. Bento Tile — Mouse 3D Tilt
   12. Featured Quote Reveal (brass rules + word stagger)
   13. Navigation — Auto-hide on scroll
   14. Region Horizontal Scroll
   15. Utility: DOM ready helper
   16. Language Toggle (EN ⇄ 繁中, persisted in localStorage)
   17. Myths Filter & Timeline (myths.html only)
   18. Mobile Drawer (hamburger → slide-in panel, ESC + scrim close)
   19. Gallery Lightbox (gallery.html — filter + masonry + lightbox)
   20. Feedback Form (about.html — validation, counter, success swap)
   21. My Atlas (saved routes · FAB · slide panel · localStorage sync)
   22. Live Weather Widget (Open-Meteo · 30-min cache · graceful offline fallback)
   23. Route Compare — side-by-side picker · table · localStorage
   24. Progressive Web App — service worker · install prompt · offline UI
   25. Route print sheet — QR + A4 styles (see style.css §23 print)
================================================================ */


/* ================================================================
   01 · MOTION TOKENS — Design System §4.2
   Mirrors the JS token spec; used for all GSAP .duration() / ease params
================================================================ */
const motion = {
  ease: {
    organic:    'cubic-bezier(0.6, 0.01, 0.05, 0.95)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    flow:       'expo.out',      // GSAP built-in
    mist:       'power2.inOut',  // breath fades
    ink:        'power4.out',    // dropping into place
    vein:       'sine.inOut',    // pulsing dragon vein loop
  },
  dur: {
    instant:   0.15,
    quick:     0.35,
    standard:  0.7,
    slow:      1.2,
    cinematic: 2.4,
  }
};


/* ================================================================
   02 · REDUCED MOTION CHECK — Design System §4.4 + §10.2
   When true: collapse all timescales, reveal elements immediately
================================================================ */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  // GSAP global timeline effectively disabled (0.001 = near-instant)
  // This is set after gsap.registerPlugin below
  if (window.DEBUG) console.info('[Beyond the Map] Reduced motion preference detected — animations minimised.');
}


/* ================================================================
   03 · PLUGIN REGISTRATION
   GSAP plugins must be registered before use
================================================================ */
gsap.registerPlugin(ScrollTrigger);


/* Now kill timescale if reduced motion */
if (prefersReduced) {
  gsap.globalTimeline.timeScale(0.001);
  // Immediately reveal all scroll-triggered elements
  gsap.set('[data-reveal]', { opacity: 1, y: 0, clearProps: 'all' });
}


/* ================================================================
   04 · NATIVE SCROLL SETUP
   The site keeps browser-native scrolling for stable demos and grading.
================================================================ */
let lenis;

function initLenis() {
  // Native browser scrolling is the most reliable choice for the final demo.
  // A smooth-scroll hijacker can make ScrollTrigger sections feel offset.
  return;
}

initLenis();


/* ================================================================
   05 · SPLITTING.JS — Hero Title Char Split
   Wraps each character in .hero-title in <span class="char">
   Must run before the GSAP hero timeline sets up the animation.
================================================================ */
function initSplitting() {
  if (typeof Splitting === 'undefined') {
    if (window.DEBUG) console.warn('[Beyond the Map] Splitting.js not loaded — hero animation will still run on the full title element.');
    return;
  }

  // Split hero title into individual characters
  Splitting({ target: '.hero-title', by: 'chars' });

  // Split the featured quote into words for stagger reveal
  Splitting({ target: '.quote-text', by: 'words' });
}

initSplitting();


/* ================================================================
   06 · HERO ENTRY ANIMATION TIMELINE — Design System §5.1
   Sequence: eyebrow → chars → chinese → subtitle → CTA → indicator
================================================================ */
function initHeroReveal() {
  const eyebrow    = document.querySelector('.hero-eyebrow');
  const chars      = document.querySelectorAll('.hero-title .char');
  const titleElem  = document.querySelector('.hero-title');
  const chinese    = document.querySelector('.hero-title-chinese');
  const subtitle   = document.querySelector('.hero-subtitle');
  const cta        = document.querySelector('.hero-cta');
  const indicator  = document.querySelector('.hero-scroll-indicator');
  const scrollLine = document.querySelector('.scroll-line');

  if (!eyebrow || !titleElem) return;

  // Keep hero readable by default. Animations start from hidden states only
  // when their tween actually runs, so browser translation/CDN hiccups cannot
  // leave the landing copy permanently transparent.
  const charTargets = chars.length > 0 ? chars : titleElem;

  const revealHeroContent = () => {
    gsap.set([eyebrow, charTargets, chinese, subtitle, cta, indicator].filter(Boolean), {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'none',
      clearProps: 'transform,filter'
    });
    if (scrollLine) scrollLine.style.height = '32px';
  };

  const safetyTimer = window.setTimeout(revealHeroContent, 3200);

  // Master timeline — explicit fromTo so targets are always opacity:1 at end
  const heroTl = gsap.timeline({ delay: 0.3 });

  // ── Step 1: Eyebrow fades + slides up (delay 0.2s) ──
  heroTl.from(eyebrow, {
    opacity: 0,
    y: 20,
    duration: motion.dur.quick,
    ease: motion.ease.flow,
    immediateRender: false,
  }, 0.2);

  // ── Step 2: Title chars — blur + slide up, staggered ──
  heroTl.from(charTargets, {
    opacity: 0,
    y: 60,
    filter: 'blur(20px)',
    stagger: 0.04,
    duration: motion.dur.slow,
    ease: motion.ease.flow,
    immediateRender: false,
  }, 0.5);

  // ── Step 3: Chinese title fades in ──
  if (chinese) {
    heroTl.from(chinese, {
      opacity: 0,
      y: 20,
      duration: motion.dur.standard,
      ease: motion.ease.mist,
      immediateRender: false,
    }, 1.3);
  }

  // ── Step 4: Subtitle slides up ──
  if (subtitle) {
    heroTl.from(subtitle, {
      opacity: 0,
      y: 30,
      duration: motion.dur.standard,
      ease: motion.ease.flow,
      immediateRender: false,
    }, 1.45);
  }

  // ── Step 5: CTA group scales in ──
  if (cta) {
    heroTl.from(cta, {
      opacity: 0,
      scale: 0.92,
      duration: motion.dur.standard,
      ease: motion.ease.emphasized,
      immediateRender: false,
    }, 1.7);
  }

  // ── Step 6: Scroll indicator line grows in ──
  if (indicator && scrollLine) {
    heroTl.from(indicator, {
      opacity: 0,
      duration: motion.dur.quick,
      immediateRender: false,
    }, 2.2);

    heroTl.fromTo(scrollLine, {
      height: 0,
    }, {
      height: 32,
      duration: motion.dur.standard,
      ease: motion.ease.emphasized,
      immediateRender: false,
    }, 2.2);
  }

  heroTl.eventCallback('onComplete', () => {
    window.clearTimeout(safetyTimer);
    revealHeroContent();
  });
}

initHeroReveal();


/* ================================================================
   07 · HERO SCROLL-OUT — Design System §5.1
   As user scrolls hero section: opacity fades, scales, translates up.
   A black scrim darkens over it (scrub: 0.8 for cinematic lag).
================================================================ */
function initHeroScrollOut() {
  const hero  = document.querySelector('.hero');
  const scrim = document.querySelector('.hero-scrim');

  if (!hero) return;

  // Hero content fades and recedes as user scrolls down
  gsap.to(hero, {
    opacity: 0,
    scale: 0.95,
    y: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
    }
  });

  // Scrim darkens over the hero (separate so it controls the ink overlay)
  if (scrim) {
    gsap.to(scrim, {
      opacity: 0.65,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
      }
    });
  }
}

initHeroScrollOut();


/* ================================================================
   08 · THREE.JS MIST PARTICLE SCENE — Design System §7
   Floating brass-gold particles above the hero background.
   Desktop only (disabled on ≤767px width or reduced motion).
================================================================ */
function initMistScene() {
  // Skip on mobile or if user prefers reduced motion
  if (window.innerWidth <= 767 || prefersReduced) return;

  // Skip if Three.js failed to load
  if (typeof THREE === 'undefined') {
    if (window.DEBUG) console.warn('[Beyond the Map] Three.js not loaded — mist scene skipped.');
    return;
  }

  const canvas = document.querySelector('#hero-canvas');
  if (!canvas) return;

  /* ── Scene Setup ── */
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0B0F0E, 0.06);

  const camera = new THREE.PerspectiveCamera(
    35,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 2, 14);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,        // transparent background (hero-bg shows through)
    antialias: false,   // off for performance
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  /* ── Particle system (~600 desktop, capped at 200 on mobile check above) ── */
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);
  const sizes     = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    // Spread particles across a wide frustum volume
    positions[i * 3]     = (Math.random() - 0.5) * 32;  // x
    positions[i * 3 + 1] = Math.random() * 12 - 3;       // y (mostly above)
    positions[i * 3 + 2] = (Math.random() - 0.5) * 22;  // z

    // Vary size for depth perception
    sizes[i] = 0.04 + Math.random() * 0.08;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xB8924A,         // --brass-500
    size: 0.07,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  /* ── Animation loop — throttled to ~30fps to save battery ── */
  let rafId;
  let lastTime = 0;
  const fpsLimit = 1000 / 30; // 30fps target

  function tick(timestamp) {
    rafId = requestAnimationFrame(tick);

    // Throttle
    if (timestamp - lastTime < fpsLimit) return;
    lastTime = timestamp;

    const t = timestamp * 0.001; // seconds

    // Slow rotation of the entire particle cloud
    points.rotation.y = t * 0.00004;

    // Each particle drifts upward with a gentle sine sway
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      // Drift upward
      pos[i * 3 + 1] += 0.004;

      // Horizontal sine sway
      pos[i * 3] += Math.sin(t * 0.3 + i * 0.1) * 0.001;

      // Recycle particles that float too high back to the bottom
      if (pos[i * 3 + 1] > 9) {
        pos[i * 3 + 1] = -3;
      }
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  rafId = requestAnimationFrame(tick);

  /* ── Resize handler ── */
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  /* ── Pause when tab is hidden (battery saving) ── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(tick);
    }
  });

  // Return cleanup function
  return () => cancelAnimationFrame(rafId);
}

initMistScene();


/* ================================================================
   09 · DRAGON VEIN SCROLLYTELLING — Design System §5.1
   The signature feature: scroll-linked route sequence.

   Timeline structure (scrub-based):
   0.0 – 0.2  Topo map fades in
   0.2 – 1.4  Dragon vein draws (stroke-dashoffset 0)
   0.4 – 1.4  Pin markers scale in, staggered as vein passes
   1.4 – 2.0  Panel 01 fades in
   2.0 – 2.6  Panel 01 out, Panel 02 in
   2.6 – 3.2  Panel 02 out, Panel 03 in
   3.2 – 3.8  Panel 03 out, Panel 04 in
   3.8 – 4.2  Map zooms out (scale 0.88)
   4.2 – 4.6  Closing caption appears
================================================================ */
function initDragonVein() {
  const section  = document.querySelector('.dragon-vein-section');
  const topoMap  = document.querySelector('.topo-map');
  const veinPath = document.querySelector('.vein-path');
  const pins     = document.querySelectorAll('.pin-marker');
  const panels   = document.querySelectorAll('.dv-panel');
  const caption  = document.querySelector('.closing-caption');

  if (!section || !veinPath) return;

  // Keep this section readable and stable: no timed card swapping.
  const pathLength = veinPath.getTotalLength();
  gsap.set(veinPath, {
    strokeDasharray: pathLength,
    strokeDashoffset: 0,
  });
  gsap.set(topoMap, { opacity: 1, scale: 1, clearProps: 'transform' });
  gsap.set(pins, { scale: 1, opacity: 1, transformOrigin: 'center center' });
  gsap.set(panels, { opacity: 1, x: 0, yPercent: 0, clearProps: 'transform' });
  gsap.set(caption, { opacity: 1, y: 0, clearProps: 'transform' });
}

initDragonVein();


/* ================================================================
   10 · BENTO TILE REVEAL ANIMATIONS — Design System §5.1
   Each tile has its OWN ScrollTrigger so it fires individually
   as IT enters the viewport — cards genuinely appear one by one,
   not in a simultaneous batch.
   Image inside each tile relaxes from scale:1.12 → 1.0 in sync.
================================================================ */
function initBentoReveal() {
  const tiles = gsap.utils.toArray('.bento-tile');
  if (!tiles.length) return;

  tiles.forEach((tile) => {
    const img = tile.querySelector('.tile-image');

    /* Per-tile timeline — fires when THIS tile's top edge
       crosses 88% of the viewport height (well before it's fully visible). */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: tile,
        start: 'top 96%',
        toggleActions: 'play none none none',
      }
    });

    /* Tile: slide up, fade in, subtle scale-up from 0.99 → 1.
       immediateRender:false keeps content visible if ScrollTrigger stalls. */
    tl.from(tile, {
      opacity: 0,
      y: 28,
      scale: 0.99,
      duration: 0.45,
      ease: motion.ease.flow,       // expo.out — soft deceleration
      immediateRender: false,
    });

    /* Image inside: relaxes from a slight zoom simultaneously */
    if (img) {
      tl.from(img, {
        scale: 1.12,
        duration: 0.45,
        ease: motion.ease.emphasized, // cubic-bezier(0.2,0,0,1) — cinematic
        immediateRender: false,
      }, 0); // start at same time as tile reveal
    }
  });
}

initBentoReveal();


/* ================================================================
   11 · BENTO TILE — 3D MOUSE TILT (Desktop only)
   Subtle perspective tilt follows cursor within each tile.
   Max ±2deg per axis so it never feels gimmicky.
================================================================ */
function initBentoTilt() {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const tiles = document.querySelectorAll('.bento-tile');

  tiles.forEach((tile) => {
    const TILT_MAX = 2; // degrees

    tile.addEventListener('mousemove', (e) => {
      const rect = tile.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      // Normalise to -1 … +1 from center
      const normX = (relX / rect.width - 0.5) * 2;
      const normY = (relY / rect.height - 0.5) * 2;

      // Apply tilt: rotateY on X axis, rotateX inverted on Y axis
      gsap.to(tile, {
        rotateY: normX * TILT_MAX,
        rotateX: -normY * TILT_MAX,
        transformPerspective: 800,
        duration: 0.4,
        ease: motion.ease.mist,
        overwrite: 'auto',
      });
    });

    tile.addEventListener('mouseleave', () => {
      gsap.to(tile, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: motion.ease.mist,
      });
    });
  });
}

initBentoTilt();


/* ================================================================
   12 · FEATURED QUOTE REVEAL — Design System §5.1
   Brass rules draw from center outward.
   Quote words stagger in if Splitting.js split them.
================================================================ */
function initQuoteReveal() {
  const ruleTop    = document.querySelector('.brass-rule--top');
  const ruleBottom = document.querySelector('.brass-rule--bottom');
  const words      = document.querySelectorAll('.quote-text .word');
  const quoteFull  = document.querySelector('.quote-text');
  const attribution = document.querySelector('.quote-attribution');

  if (!quoteFull) return;

  // ── Brass rules draw from center outward ──
  if (ruleTop) {
    gsap.to(ruleTop, {
      scaleX: 1,
      opacity: 0.6,
      duration: 1.0,
      ease: motion.ease.vein,
      scrollTrigger: {
        trigger: '.quote-section',
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });
  }

  if (ruleBottom) {
    gsap.to(ruleBottom, {
      scaleX: 1,
      opacity: 0.6,
      duration: 1.0,
      ease: motion.ease.vein,
      delay: 0.3,
      scrollTrigger: {
        trigger: '.quote-section',
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });
  }

  // ── Quote words stagger in ──
  const wordTargets = words.length > 0 ? words : quoteFull;

  gsap.from(wordTargets, {
    opacity: 0,
    y: 20,
    stagger: 0.055,
    duration: 0.7,
    ease: motion.ease.flow,
    immediateRender: false,
    scrollTrigger: {
      trigger: '.featured-quote',
      start: 'top 75%',
      toggleActions: 'play none none none',
    }
  });

  // ── Attribution fades in after words complete ──
  if (attribution) {
    gsap.from(attribution, {
      opacity: 0,
      duration: 0.5,
      ease: motion.ease.mist,
      delay: 0.6,
      immediateRender: false,
      scrollTrigger: {
        trigger: '.featured-quote',
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });
  }
}

initQuoteReveal();


/* ================================================================
   13 · NAVIGATION — Auto-hide on scroll down, re-show on scroll up
   Design System §6.2
================================================================ */
function initNavBehaviour() {
  const nav = document.querySelector('#main-nav');
  if (!nav) return;

  let lastScrollY  = window.scrollY;
  let ticking      = false;
  const SCROLL_THRESHOLD = 80; // px scrolled before hiding nav

  function updateNav() {
    const currentScrollY = window.scrollY;
    const scrollingDown  = currentScrollY > lastScrollY;

    if (currentScrollY > SCROLL_THRESHOLD) {
      if (scrollingDown) {
        nav.classList.add('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
    } else {
      // Near top — always show
      nav.classList.remove('is-hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      // Throttle to RAF for performance
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  /* Mobile hamburger / drawer behaviour lives in §18 · Mobile Drawer
     at the bottom of this file. The previous inline-style dropdown
     was removed because the drawer panel is the canonical mobile-nav
     surface. */
}

initNavBehaviour();


/* ================================================================
   14 · REGION HORIZONTAL SCROLL — Design System §5.1
   The .regions-track translates horizontally as the user
   scrolls vertically, for one full viewport height of scroll.
   
   On mobile (touch), the native overflow-x scroll is used instead.
================================================================ */
function initHorizontalScroll() {
  const section = document.querySelector('.regions-section');
  const track   = document.querySelector('.regions-track');

  if (!section || !track) return;

  // Keep this section as a normal horizontally scrollable row.
  // Pinning a second section after the dragon-vein sequence makes the
  // vertical page flow feel unpredictable during a short demo.
  gsap.set(track, { clearProps: 'x' });
}

initHorizontalScroll();


/* ================================================================
   15 · SEVEN ROUTES — Heading + Cards Reveal
   A dedicated choreographed timeline for the regions section.

   Sequence:
   → Eyebrow slides up first (sets the stage)
   → Latin headline sweeps up with larger travel (monumental weight)
   → Chinese subtitle follows with a blur-dissolve (ink-wash feel)
   → Section lead fades in beneath
   → Region cards reveal quickly as the row enters view
================================================================ */
function initRegionsSectionReveal() {
  const section      = document.querySelector('#regions');
  const eyebrow      = document.querySelector('.regions-section .eyebrow');
  const latinHead    = document.querySelector('.regions-section .section-headline .latin');
  const chineseHead  = document.querySelector('.regions-section .section-headline .chinese');
  const sectionLead  = document.querySelector('.regions-section .section-lead');
  const cards        = gsap.utils.toArray('.region-card');

  if (!section) return;

  /* ── Part 1: Heading cascade timeline ──
     Fires when the section top hits 72% of the viewport — early enough
     to feel like the content rises to meet the user as they scroll in. */
  const headingTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 92%',
      toggleActions: 'play none none none',
    }
  });

  /* Step 1: Eyebrow — short, quick, sets context */
  if (eyebrow) {
    headingTl.from(eyebrow, {
      opacity: 0,
      y: 24,
      duration: 0.5,
      ease: motion.ease.flow,
      immediateRender: false,
    });
  }

  /* Step 2: "Seven Routes" Latin — large travel, weighted landing */
  if (latinHead) {
    headingTl.from(latinHead, {
      opacity: 0,
      y: 72,
      duration: 0.9,
      ease: motion.ease.flow,        // expo.out: fast start, weighted stop
      immediateRender: false,
    }, '-=0.25');                    // overlap: starts as eyebrow is finishing
  }

  /* Step 3: "七條路線" Chinese — blur-dissolve, like ink clearing in water */
  if (chineseHead) {
    headingTl.from(chineseHead, {
      opacity: 0,
      y: 44,
      filter: 'blur(10px)',
      duration: 0.8,
      ease: motion.ease.mist,        // power2.inOut: breath-like symmetry
      immediateRender: false,
    }, '-=0.6');                     // rides in while Latin is still landing
  }

  /* Step 4: Section lead paragraph — quiet, understated finish */
  if (sectionLead) {
    headingTl.from(sectionLead, {
      opacity: 0,
      y: 22,
      duration: 0.65,
      ease: motion.ease.flow,
      immediateRender: false,
    }, '-=0.45');
  }

  /* ── Part 2: Region cards reveal ──
     Separate trigger once the track wrapper is visible. */
  if (cards.length) {
    gsap.from(cards, {
      opacity: 0,
      y: 24,
      scale: 0.99,
      duration: 0.38,
      stagger: 0.06,
      ease: motion.ease.flow,
      immediateRender: false,
      scrollTrigger: {
        trigger: '.regions-track-wrapper',
        start: 'top 96%',
        toggleActions: 'play none none none',
      }
    });
  }
}

initRegionsSectionReveal();


/* ================================================================
   16 · GENERAL SCROLL REVEALS — Other section headers
   The regions section has its own dedicated reveal above.
   This handles the remaining headers (bento myths section, etc.).
================================================================ */
function initGeneralReveals() {
  /* Animate children of every section-header EXCEPT the regions section
     (which is handled with its own choreographed timeline above). */
  gsap.utils.toArray('.section-header').forEach((header) => {
    // Skip the regions section header — already handled
    if (header.closest('#regions')) return;

    gsap.from(header.children, {
      opacity: 0,
      y: 18,
      stagger: 0.06,
      duration: 0.38,
      ease: motion.ease.flow,
      immediateRender: false,
      scrollTrigger: {
        trigger: header,
        start: 'top 92%',
        toggleActions: 'play none none none',
      }
    });
  });
}

initGeneralReveals();


/* ================================================================
   17 · INTERACTIVE TRAIL MAP
   Data-driven route selector for the homepage and full map page.
================================================================ */
const trailMapData = {
  maclehose: {
    category: 'Long-Distance Trail',
    type: 'Ridge route',
    title: 'MacLehose Trail',
    subtitle: 'The MacLehose Trail — 100 km across wild Hong Kong',
    image: 'assets/images/route-maclehose.jpg',
    imageAlt: 'MacLehose Trail ridge and reservoir landscape in Sai Kung',
    district: 'New Territories',
    difficulty: 'Very difficult',
    difficultyRating: 5,
    distance: 'About 16 km',
    time: 'About 6 hours',
    transport: 'MTR + Bus',
    routeFromTo: 'Sai Kung → Tuen Mun',
    start: 'High Island Reservoir East Dam',
    best: 'Clear cool days; bring water and sun protection',
    note: 'Use this as the most immersive day route: reservoir edges, volcanic coast, beach valleys, and long ridgelines make the landscape feel continuous.',
    myth: 'Traverse the legendary MacLehose Trail. Cross Sharp Peak\'s knife-edge ridge, walk reservoir edges, and follow the dragon vein east to west across the New Territories.'
  },
  'lion-rock': {
    category: 'Urban Guardian Ridge',
    type: 'Urban guardian',
    title: 'Lion Rock',
    subtitle: 'Lion Rock — Kowloon\'s quiet guardian above the city',
    image: 'assets/images/route-lion-rock.jpg',
    imageAlt: 'Lion Rock rising above Kowloon and the surrounding city',
    district: 'Kowloon',
    difficulty: 'Very easy to moderate',
    difficultyRating: 2,
    distance: 'About 4 km',
    time: 'About 2 hours',
    transport: 'MTR + Bus',
    routeFromTo: 'Sha Tin → Wong Tai Sin',
    start: 'Kowloon Reservoir / Lion Rock Country Park',
    best: 'Late afternoon for city views; avoid exposed heat',
    note: 'A compact city-edge route for visitors who want reservoirs, skyline viewpoints, and a quick shift from urban street to country park path.',
    myth: 'Climb above Kowloon to Hong Kong\'s guardian ridge. Reservoir woodland, sweeping skyline views, and the rocky lion silhouette that watches over the city.'
  },
  'dragons-back': {
    category: 'Coastal Spine Walk',
    type: 'Coastal spine',
    title: 'Dragon\'s Back',
    subtitle: 'Dragon\'s Back — a rolling spine facing the open sea',
    image: 'assets/images/route-dragons-back.jpg',
    imageAlt: 'Dragon\'s Back ridgeline looking north across Hong Kong Island',
    district: 'Hong Kong Island East',
    difficulty: 'Moderate',
    difficultyRating: 3,
    distance: 'About 8 km',
    time: 'About 4 hours',
    transport: 'MTR + Bus',
    routeFromTo: 'To Tei Wan → Big Wave Bay',
    start: 'To Tei Wan / Shek O Road',
    best: 'Morning or late afternoon; finish at Big Wave Bay',
    note: 'The most accessible route for a first-time visitor: a clear ridge walk, open sea views, and a beach finish that turns the hike into a half-day outing.',
    myth: 'Walk the rolling spine of the dragon above Shek O. Open ridges, blue water on every side, and a finish at the beach where the trail meets the sea.'
  },
  lantau: {
    category: 'Ancestor Mountain Trail',
    type: 'Ancestor mountain',
    title: 'Lantau Peak',
    subtitle: 'Lantau Peak — the pilgrim path to the island\'s high source',
    image: 'assets/images/route-lantau.jpg',
    imageAlt: 'Lantau Peak mountain ridge under open sky',
    district: 'Lantau Island',
    difficulty: 'Challenging',
    difficultyRating: 4,
    distance: 'About 4.5 km',
    time: 'About 2.5 hours',
    transport: 'MTR + Bus + Cable Car',
    routeFromTo: 'Pak Kung Au → Ngong Ping',
    start: 'Pak Kung Au to Ngong Ping',
    best: 'Sunrise or October–April for cooler weather',
    note: 'A short but steep mountain crossing that links Pak Kung Au, Ngong Ping, temple visits, and the wider geography of Lantau.',
    myth: 'Climb the ancestor mountain of Lantau. Steep ridges, sweeping island horizons, and a finish at Ngong Ping where pilgrim routes converge under the Buddha.'
  },
  'cheung-chau': {
    category: 'Island Pilgrimage',
    type: 'Island ritual',
    title: 'Cheung Chau',
    subtitle: 'Cheung Chau — harbour rituals and protective village form',
    image: 'assets/images/route-cheung-chau.jpg',
    imageAlt: 'Cheung Chau harbour and village shoreline',
    district: 'Outlying Islands',
    difficulty: 'Easy',
    difficultyRating: 1,
    distance: 'About 5 km loop',
    time: 'Half-day ferry visit',
    transport: 'Ferry',
    routeFromTo: 'Pier → Pak Tai Temple',
    start: 'Cheung Chau Ferry Pier',
    best: 'Festival season in May or quieter weekday visits',
    note: 'A harbour-scale route for ferry arrival, temple stops, village lanes, seafood streets, and the ritual memory of the Bun Festival.',
    myth: 'Step off the ferry into a working harbour village. Pak Tai Temple, festival lanes, seafood streets, and the protective dumbbell shape that gives Cheung Chau its character.'
  },
  'pat-sin-leng': {
    category: 'Eight Immortals Ridge',
    type: 'Named-peak ridge',
    title: 'Pat Sin Leng',
    subtitle: 'Pat Sin Leng — eight Daoist immortals named across one ridge',
    image: 'assets/images/route-pat-sin-leng.jpg',
    imageAlt: 'Pat Sin Leng ridge above Tai Mei Tuk reservoir in the New Territories',
    district: 'New Territories Ridge',
    difficulty: 'Moderate to challenging',
    difficultyRating: 4,
    distance: 'About 7.5 km',
    time: 'About 5 hours',
    transport: 'MTR + Bus',
    routeFromTo: 'Tai Mei Tuk → Bride\'s Pool',
    start: 'Tai Mei Tuk reservoir',
    best: 'November–March (cool, low haze)',
    note: 'A long named-ridge walk where every peak carries the name of one of the Daoist Eight Immortals, and a 1996 fire memorial asks for a brief pause along the way.',
    myth: 'Cross the ridge of the Eight Immortals — eight named peaks above Plover Cove reservoir, the only walking route in Hong Kong where every summit belongs to a single mythic cycle.',
    detailPath: 'routes/pat-sin-leng.html'
  },
  'sunset-peak': {
    category: 'Silvergrass Plateau',
    type: 'Wind-path plateau',
    title: 'Sunset Peak',
    subtitle: 'Sunset Peak — silvergrass and stone huts on the wind path',
    image: 'assets/images/route-sunset-peak.jpg',
    imageAlt: 'Sunset Peak silvergrass slope and stone hut on Lantau Island',
    district: 'Lantau Island',
    difficulty: 'Moderate',
    difficultyRating: 3,
    distance: 'About 5 km',
    time: 'About 3 hours',
    transport: 'MTR + Bus',
    routeFromTo: 'Pak Kung Au → Mui Wo',
    start: 'Pak Kung Au',
    best: 'October–December for silvergrass at sunset',
    note: 'Hong Kong\'s second-highest peak, paired with Lantau Peak across Pak Kung Au — famous for autumn silvergrass and the row of traditional stone huts along the plateau.',
    myth: 'Walk Lantau\'s contemplative wind path — silvergrass plateau, stone huts (爛頭營), and a long west-facing horizon that gives the route its name.',
    detailPath: 'routes/sunset-peak.html'
  }
};

function initTrailMap() {
  const layout = document.querySelector('.trail-map-layout');
  const mapCard = document.querySelector('.map-card');
  const card = document.querySelector('[data-trail-card]');
  if (!layout || !mapCard || !card) return;

  const hits = mapCard.querySelectorAll('.route-hit');
  const paths = mapCard.querySelectorAll('.route-path');
  const selectors = document.querySelectorAll('[data-trail-select]');
  const closeBtn = card.querySelector('[data-trail-close]');
  const mapLink = card.querySelector('[data-trail-map-link]');
  const exploreLink = card.querySelector('[data-trail-explore-link]');
  const ratingDots = card.querySelectorAll('[data-trail-rating] span');
  const fields = {
    category: card.querySelector('[data-trail-category]'),
    title: card.querySelector('[data-trail-title]'),
    subtitle: card.querySelector('[data-trail-subtitle]'),
    myth: card.querySelector('[data-trail-myth]'),
    time: card.querySelector('[data-trail-time]'),
    transport: card.querySelector('[data-trail-transport]'),
    route: card.querySelector('[data-trail-route]')
  };

  const setText = (target, value) => {
    if (target) target.textContent = value || '';
  };

  function activatePath(slug) {
    paths.forEach((path) => {
      path.classList.toggle('is-active', path.dataset.trail === slug);
    });
    selectors.forEach((item) => {
      item.classList.toggle('is-active', item.dataset.trailSelect === slug);
    });
  }

  function paintRating(rating) {
    const value = Math.max(0, Math.min(5, Number(rating) || 0));
    ratingDots.forEach((dot, i) => {
      dot.classList.toggle('is-empty', i >= value);
    });
  }

  function fillCard(slug) {
    const entry = trailMapData[slug] || trailMapData.maclehose;
    setText(fields.category, entry.category || entry.type);
    setText(fields.title, entry.title || entry.district);
    setText(fields.subtitle, entry.subtitle || entry.title);
    setText(fields.myth, entry.myth);
    setText(fields.time, entry.time);
    setText(fields.transport, entry.transport);
    setText(fields.route, entry.routeFromTo || entry.start);
    paintRating(entry.difficultyRating);
    if (mapLink) mapLink.href = `map.html?trail=${slug}#trail-map`;
    if (exploreLink) exploreLink.href = entry.detailPath || `explore.html#${slug}`;
  }

  let hideTimer = null;
  function showCard() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    card.classList.add('is-active');
  }

  function hideCard() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    card.classList.remove('is-active');
  }

  function hideCardSoon(delay = 220) {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      card.classList.remove('is-active');
      hideTimer = null;
    }, delay);
  }

  function selectRoute(slug, { showInfo = true } = {}) {
    activatePath(slug);
    fillCard(slug);
    if (showInfo) showCard();
  }

  // Map route hit areas
  hits.forEach((hit) => {
    const slug = hit.dataset.trail;

    hit.addEventListener('mouseenter', () => selectRoute(slug));
    hit.addEventListener('focus', () => selectRoute(slug));
    hit.addEventListener('click', (event) => {
      event.preventDefault();
      selectRoute(slug);
    });
    hit.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectRoute(slug);
      }
    });
  });

  // Side panel selectors
  selectors.forEach((item) => {
    const slug = item.dataset.trailSelect;

    item.addEventListener('mouseenter', () => selectRoute(slug));
    item.addEventListener('focus', () => selectRoute(slug));
    item.addEventListener('click', (event) => {
      event.preventDefault();
      selectRoute(slug);
    });
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectRoute(slug);
      }
    });
  });

  // Card hover keeps it open; leaving the map closes it after a short delay.
  card.addEventListener('mouseenter', showCard);
  card.addEventListener('mouseleave', () => hideCardSoon());
  mapCard.addEventListener('mouseleave', () => hideCardSoon());
  mapCard.addEventListener('mouseenter', () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  });

  // Explicit close button
  if (closeBtn) {
    closeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      hideCard();
    });
  }

  // Escape closes the card if it's open
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && card.classList.contains('is-active')) {
      hideCard();
    }
  });

  // Initial state — pre-fill content; if a ?trail= param is present, also pop
  // the card open so the user lands on the requested route.
  const requestedTrail = new URLSearchParams(window.location.search).get('trail');
  const initialTrail = trailMapData[requestedTrail] ? requestedTrail : 'maclehose';
  activatePath(initialTrail);
  fillCard(initialTrail);
  if (requestedTrail && trailMapData[requestedTrail]) {
    showCard();
  }

  if (requestedTrail && window.location.hash === '#trail-map') {
    window.requestAnimationFrame(() => {
      document.querySelector('#trail-map')?.scrollIntoView({ block: 'start' });
    });
  }

  // Reveal animation: fire pop-in once the map enters the viewport
  layout.classList.add('reveal-map');

  const playReveal = () => {
    layout.classList.add('is-visible');
    mapCard.classList.add('is-visible');
  };

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playReveal();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    observer.observe(layout);
  } else {
    playReveal();
  }

  // Anchor jumps to #trail-map should also force the reveal so the map
  // shows up immediately without waiting for the IntersectionObserver.
  document.querySelectorAll('a[href$="#trail-map"]').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      window.requestAnimationFrame(playReveal);
    });
  });
}

initTrailMap();


/* ================================================================
   18 · SCROLLTRIGGER REFRESH
   Fonts, SVG sizing, and late layout changes can shift trigger starts.
================================================================ */
function initScrollRefresh() {
  if (typeof ScrollTrigger === 'undefined') return;

  const refresh = () => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  };

  window.addEventListener('load', () => {
    requestAnimationFrame(refresh);
    window.setTimeout(refresh, 450);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh).catch(() => {});
  }

  window.addEventListener('resize', () => {
    window.clearTimeout(initScrollRefresh.resizeTimer);
    initScrollRefresh.resizeTimer = window.setTimeout(refresh, 180);
  });
}

initScrollRefresh();


/* ================================================================
   16 · LANGUAGE TOGGLE — bilingual EN ⇄ 繁中
   ──────────────────────────────────────────────────────────────
   Behaviour
   • Click on .nav__lang-toggle flips the active language.
   • Active language is mirrored to <html data-lang> AND <html lang>
     so CSS [data-lang] selectors and screen readers stay in sync.
   • Choice is persisted in localStorage under "btm-lang" so it
     survives navigation between pages.
   • Any element carrying BOTH data-en and data-zh attributes has
     its textContent swapped to the matching value on toggle.
   • The toggle's two .lang-opt spans receive .lang-opt--active to
     reflect the current language.
   • Splitting.js is re-applied to .hero-title after a swap so any
     CSS that targets `.char` keeps working in the new language.
================================================================ */
(function initLanguageToggle() {
  const STORAGE_KEY = 'btm-lang';
  const SUPPORTED   = ['en', 'zh-Hant'];
  const DEFAULT     = 'en';
  const html        = document.documentElement;

  /* Resolve initial language: localStorage → existing <html lang> → default */
  function readInitial() {
    let saved = null;
    try { saved = window.localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
    if (SUPPORTED.includes(saved)) return saved;
    if (SUPPORTED.includes(html.getAttribute('lang'))) return html.getAttribute('lang');
    return DEFAULT;
  }

  /* Update every paired-attribute element's visible text. */
  function applyLang(lang) {
    const attr = lang === 'zh-Hant' ? 'data-zh' : 'data-en';
    document.querySelectorAll('[data-en][data-zh]').forEach((el) => {
      const next = el.getAttribute(attr);
      if (next != null && el.textContent !== next) {
        el.textContent = next;
      }
    });
  }

  /* Splitting.js wraps .hero-title chars at load. After a textContent
     swap that wipes those wrappers, re-run Splitting so future hover /
     CSS treatments that depend on `.char` keep working. */
  function reSplitHeroTitle() {
    if (typeof Splitting === 'undefined') return;
    const title = document.querySelector('.hero-title[data-en][data-zh]');
    if (!title) return;
    title.removeAttribute('data-splitting');
    Splitting({ target: title, by: 'chars' });
  }

  /* Mirror active state on the .lang-opt spans inside every toggle. */
  function paintToggles(lang) {
    document.querySelectorAll('.nav__lang-toggle').forEach((btn) => {
      const opts = btn.querySelectorAll('.lang-opt');
      if (opts.length < 2) return;
      const enOpt = opts[0];
      const zhOpt = opts[opts.length - 1];
      enOpt.classList.toggle('lang-opt--active', lang === 'en');
      zhOpt.classList.toggle('lang-opt--active', lang === 'zh-Hant');
      btn.setAttribute(
        'aria-label',
        lang === 'en'
          ? 'Switch to Traditional Chinese'
          : 'Switch to English'
      );
    });
  }

  /* Single source of truth for changing language. */
  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT;
    html.setAttribute('data-lang', lang);
    html.setAttribute('lang', lang);
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
    applyLang(lang);
    reSplitHeroTitle();
    paintToggles(lang);
    try {
      window.dispatchEvent(new CustomEvent('btm:glossary-refresh'));
    } catch (e) { /* no listeners */ }
  }

  /* Wire click handlers on every toggle present on the page. */
  function bindToggles() {
    document.querySelectorAll('.nav__lang-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = html.getAttribute('data-lang') || DEFAULT;
        setLang(current === 'en' ? 'zh-Hant' : 'en');
      });
    });
  }

  setLang(readInitial());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggles);
  } else {
    bindToggles();
  }
})();


/* ================================================================
   17 · MYTHS FILTER & TIMELINE — myths.html only
   ──────────────────────────────────────────────────────────────
   Two independent micro-modules, both no-ops on pages that don't
   contain the relevant DOM:

   A · Category filter
       • Click .filter-btn[data-filter] to filter [data-filter-grid]
         children by their data-category attribute.
       • Cards fade out (~250ms) before being hidden, and fade in
         when re-shown. The is-leaving / is-entering CSS classes
         (style.css §17) drive the transition.
       • The active button gets .filter-btn--active and
         aria-pressed="true". A live count is mirrored into
         [data-filter-count] for screen readers.

   B · Feng-Shui timeline tablist
       • Tablist pattern with role="tab" / role="tabpanel".
       • Click or ←/→/Home/End on a node to activate it.
       • Roving tabindex: only the active tab is tab-focusable.
       • Default state: first node is active and visible.

   Both modules respect prefers-reduced-motion via the CSS
   @media block in style.css §17.
================================================================ */
(function initMythsHub() {

  /* ────────────────────────────────────────────────────────── */
  /*  A · CATEGORY FILTER                                       */
  /* ────────────────────────────────────────────────────────── */
  function initFilter() {
    const grid    = document.querySelector('[data-filter-grid]');
    const buttons = document.querySelectorAll('.filter-btn[data-filter]');
    const count   = document.querySelector('[data-filter-count]');
    if (!grid || buttons.length === 0) return;

    const FADE_MS = 250;
    const cards   = Array.from(grid.querySelectorAll('[data-category]'));

    function updateCount(visible, total, label) {
      if (!count) return;
      count.textContent = visible === total
        ? `Showing all ${total} myths`
        : `Showing ${visible} of ${total} · ${label}`;
    }

    function applyFilter(category, label) {
      let visible = 0;

      cards.forEach((card) => {
        const matches = category === 'all' || card.dataset.category === category;

        if (matches) {
          visible++;

          /* If the card was hidden, reveal it and play an entry transition. */
          if (card.hidden) {
            card.hidden = false;
            card.classList.add('is-entering');
            // Force a reflow so the transition fires from the entering state
            void card.offsetWidth;
            requestAnimationFrame(() => card.classList.remove('is-entering'));
          } else {
            card.classList.remove('is-leaving', 'is-entering');
          }

        } else {
          /* Already hidden — nothing to animate. */
          if (card.hidden) return;

          card.classList.add('is-leaving');
          window.setTimeout(() => {
            /* Guard against a faster subsequent filter change. */
            if (card.classList.contains('is-leaving')) {
              card.hidden = true;
              card.classList.remove('is-leaving');
            }
          }, FADE_MS);
        }
      });

      updateCount(visible, cards.length, label);
    }

    function setActive(btn) {
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('filter-btn--active', on);
        b.setAttribute('aria-pressed', String(on));
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setActive(btn);
        applyFilter(btn.dataset.filter, btn.textContent.trim());
      });
    });

    /* Initial state — respect whichever button starts with .filter-btn--active. */
    const initial = document.querySelector('.filter-btn.filter-btn--active')
                 || buttons[0];
    setActive(initial);
    applyFilter(initial.dataset.filter, initial.textContent.trim());
  }


  /* ────────────────────────────────────────────────────────── */
  /*  B · FENG-SHUI TIMELINE TABLIST                            */
  /* ────────────────────────────────────────────────────────── */
  function initTimeline() {
    const root = document.querySelector('[data-myth-timeline]');
    if (!root) return;

    const tabs   = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
    if (tabs.length === 0 || tabs.length !== panels.length) return;

    function activate(index, { focus = false } = {}) {
      const clamped = Math.max(0, Math.min(tabs.length - 1, index));

      tabs.forEach((tab, i) => {
        const on = i === clamped;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', String(on));
        tab.setAttribute('tabindex', on ? '0' : '-1');
      });

      panels.forEach((panel, i) => {
        const on = i === clamped;
        if (on) {
          panel.hidden = false;
          /* Trigger fade-in by toggling .is-active on the next frame */
          requestAnimationFrame(() => panel.classList.add('is-active'));
        } else {
          panel.classList.remove('is-active');
          panel.hidden = true;
        }
      });

      if (focus) tabs[clamped].focus();
    }

    /* Click — activate but don't pull focus (avoids visual jump) */
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(i));
    });

    /* Keyboard — arrow keys + Home/End for tablist navigation */
    root.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
      const current = tabs.findIndex((t) => t === document.activeElement);
      if (current === -1) return;

      let next = null;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          next = (current + 1) % tabs.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          next = (current - 1 + tabs.length) % tabs.length;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = tabs.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      activate(next, { focus: true });
    });

    /* Default state — first node active. */
    activate(0);
  }


  /* Boot — guard against pre-DOM execution (main.js loads at end of
     body so this is mostly belt-and-braces). */
  function boot() {
    initFilter();
    initTimeline();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();


/* ================================================================
   18 · MOBILE DRAWER — hamburger → slide-in panel
   ──────────────────────────────────────────────────────────────
   Behaviour
   • Active below 900px (mirrors the CSS media query in §18 of
     style.css). Above that breakpoint the drawer is display:none.
   • DOM is injected at runtime — no per-page HTML edit needed.
     The drawer clones .nav__links and .nav__lang-toggle from the
     existing header so a single source of truth controls labels
     and active state.
   • Open: hamburger click. Close: scrim click, ESC key, link click,
     close-button click, or window resize above 900px.
   • Body scroll is locked while open (.mobile-drawer-open class).
   • Hamburger icon morphs to an X via .is-active (CSS handles the
     transform).
   • aria-expanded on the hamburger and aria-hidden on the drawer
     stay in sync. Focus moves to the close button on open and back
     to the hamburger on close.
================================================================ */
(function initMobileDrawer() {
  const BREAKPOINT = 900;

  const hamburger     = document.querySelector('.nav__hamburger');
  const linksSource   = document.querySelector('.nav__links');
  const langSource    = document.querySelector('.nav__lang-toggle');
  if (!hamburger || !linksSource) return;

  /* ── Build drawer DOM once ───────────────────────────────────── */
  const scrim = document.createElement('div');
  scrim.className = 'mobile-drawer__scrim';
  scrim.setAttribute('hidden', '');

  const drawer = document.createElement('aside');
  drawer.className = 'mobile-drawer';
  drawer.id = 'mobile-drawer';
  drawer.setAttribute('aria-label', 'Mobile navigation');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');

  /* Close button (X) */
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'mobile-drawer__close';
  closeBtn.setAttribute('aria-label', 'Close menu');

  /* Clone the existing nav links so labels and active state mirror
     the desktop header. The clone is a plain <ul>; we strip the
     desktop-only class so style.css §18 can target the drawer-only
     variant. */
  const linksClone = linksSource.cloneNode(true);
  linksClone.classList.remove('nav__links');
  linksClone.classList.add('mobile-drawer__links');
  linksClone.removeAttribute('role');

  drawer.appendChild(closeBtn);
  drawer.appendChild(linksClone);

  /* Clone the language toggle so users can switch languages from
     inside the drawer too. The §16 click handler queries every
     .nav__lang-toggle on every toggle, so the cloned button stays
     in visual sync automatically — but its own click handler does
     not exist yet, so we proxy through the source button. */
  let langClone = null;
  if (langSource) {
    langClone = langSource.cloneNode(true);
    langClone.classList.add('mobile-drawer__lang');
    drawer.appendChild(langClone);

    langClone.addEventListener('click', (e) => {
      e.preventDefault();
      langSource.click();
    });
  }

  document.body.appendChild(scrim);
  document.body.appendChild(drawer);

  hamburger.setAttribute('aria-controls', 'mobile-drawer');
  hamburger.setAttribute('aria-expanded', 'false');

  /* ── State helpers ───────────────────────────────────────────── */
  function isOpen() {
    return drawer.classList.contains('is-open');
  }

  function setOpen(open) {
    /* Drawer + scrim + body scroll lock */
    drawer.classList.toggle('is-open', open);
    scrim.classList.toggle('is-open', open);
    document.body.classList.toggle('mobile-drawer-open', open);

    /* ARIA / hamburger morph */
    drawer.setAttribute('aria-hidden', String(!open));
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.classList.toggle('is-active', open);

    if (open) {
      /* Make scrim hit-testable immediately so first-tap closes work. */
      scrim.removeAttribute('hidden');
      /* Move focus into the drawer for keyboard users. */
      window.requestAnimationFrame(() => closeBtn.focus());
    } else {
      /* Hide scrim from AT after the fade completes. */
      window.setTimeout(() => {
        if (!isOpen()) scrim.setAttribute('hidden', '');
      }, 320);
      /* Return focus to the hamburger that opened it. */
      hamburger.focus();
    }
  }

  /* ── Wiring ──────────────────────────────────────────────────── */

  /* Hamburger toggles */
  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    setOpen(!isOpen());
  });

  /* Close button */
  closeBtn.addEventListener('click', () => setOpen(false));

  /* Scrim click closes (clicking outside the panel) */
  scrim.addEventListener('click', () => setOpen(false));

  /* Any link click inside the drawer closes it (UX expectation). */
  linksClone.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  /* ESC key closes (only when open, to avoid stealing global ESC). */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      setOpen(false);
    }
  });

  /* If the viewport grows past the mobile breakpoint while open,
     close the drawer so the desktop nav doesn't show two surfaces. */
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (window.innerWidth > BREAKPOINT && isOpen()) setOpen(false);
    }, 120);
  });
})();


/* ================================================================
   19 · GALLERY LIGHTBOX — gallery.html only
   ──────────────────────────────────────────────────────────────
   Two paired sub-modules; both no-op on pages without the DOM.

   A · Filter
       • Click .filter-btn[data-filter] inside .gallery-filter to
         show only [data-route="…"] items in [data-gallery-grid].
       • Items fade out (~200ms) before being hidden, fade in when
         re-shown. Visible-count mirrored to [data-gallery-count].

   B · Lightbox
       • Click any .gallery-item button to open a fullscreen overlay
         showing the large image plus its data-caption in Fraunces
         italic (style.css §19).
       • Counter "n / total" reflects the index inside the CURRENT
         filtered set, not the entire gallery.
       • ←/→ navigate, ESC closes, focus is trapped while open, body
         scroll is locked, focus returns to the originally clicked
         thumbnail on close.
       • DOM is built once at runtime — no per-page HTML needed.
================================================================ */
(function initGalleryHub() {

  /* ────────────────────────────────────────────────────────── */
  /*  A · GALLERY FILTER                                        */
  /* ────────────────────────────────────────────────────────── */
  function initFilter(state) {
    const grid    = document.querySelector('[data-gallery-grid]');
    const buttons = document.querySelectorAll('.gallery-filter .filter-btn[data-filter]');
    const count   = document.querySelector('[data-gallery-count]');
    if (!grid || buttons.length === 0) return null;

    const FADE_MS = 200;
    /* Gallery thumbnails live inside optional .gallery-masonry__cell wrappers
       (My Atlas save controls sit beside each .gallery-item). */
    const items   = Array.from(grid.querySelectorAll('.gallery-item[data-route]'));

    /* Visible items in current filter — used by the lightbox so
       prev/next stays inside the active set. */
    state.visible = items.slice();

    function updateCount(visible, total, label) {
      if (!count) return;
      count.textContent = visible === total
        ? `Showing all ${total} images`
        : `Showing ${visible} of ${total} · ${label}`;
    }

    function applyFilter(route, label) {
      let visible = 0;
      const visibleNow = [];

      items.forEach((item) => {
        const cell = item.closest('.gallery-masonry__cell');
        const matches = route === 'all' || item.dataset.route === route;

        if (matches) {
          visible++;
          visibleNow.push(item);

          if (cell) cell.hidden = false;

          if (item.hidden) {
            item.hidden = false;
            item.classList.add('is-entering');
            void item.offsetWidth; /* reflow so the transition fires */
            requestAnimationFrame(() => item.classList.remove('is-entering'));
          } else {
            item.classList.remove('is-leaving', 'is-entering');
          }
        } else {
          if (item.hidden && (!cell || cell.hidden)) return;
          item.classList.add('is-leaving');
          window.setTimeout(() => {
            if (item.classList.contains('is-leaving')) {
              item.hidden = true;
              item.classList.remove('is-leaving');
              if (cell) cell.hidden = true;
            }
          }, FADE_MS);
        }
      });

      state.visible = visibleNow;
      updateCount(visible, items.length, label);
    }

    function setActive(btn) {
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('filter-btn--active', on);
        b.setAttribute('aria-pressed', String(on));
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setActive(btn);
        applyFilter(btn.dataset.filter, btn.textContent.trim());
      });
    });

    /* Initial state — respect whichever button starts as active. */
    const initial = document.querySelector('.gallery-filter .filter-btn--active')
                 || buttons[0];
    setActive(initial);
    applyFilter(initial.dataset.filter, initial.textContent.trim());

    return { items, grid };
  }


  /* ────────────────────────────────────────────────────────── */
  /*  B · LIGHTBOX                                              */
  /* ────────────────────────────────────────────────────────── */
  function initLightbox(state) {
    const grid = document.querySelector('[data-gallery-grid]');
    if (!grid) return;

    /* ── Build lightbox DOM once ─────────────────────────────── */
    const lb = document.createElement('div');
    lb.className = 'gallery-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.setAttribute('aria-hidden', 'true');
    lb.hidden = true;

    lb.innerHTML = `
      <div class="gallery-lightbox__topbar">
        <span class="gallery-lightbox__counter" data-lb-counter>0 / 0</span>
        <button type="button" class="gallery-lightbox__close" data-lb-close
                aria-label="Close image viewer"></button>
      </div>
      <div class="gallery-lightbox__stage">
        <button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--prev"
                data-lb-prev aria-label="Previous image">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <polyline points="15 4 7 12 15 20" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="gallery-lightbox__image-wrap">
          <img class="gallery-lightbox__image" data-lb-image alt="">
        </div>
        <button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--next"
                data-lb-next aria-label="Next image">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <polyline points="9 4 17 12 9 20" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <p class="gallery-lightbox__caption" data-lb-caption></p>
      <div class="gallery-lightbox__bottombar"></div>
    `;

    document.body.appendChild(lb);

    const elImage   = lb.querySelector('[data-lb-image]');
    const elCaption = lb.querySelector('[data-lb-caption]');
    const elCounter = lb.querySelector('[data-lb-counter]');
    const btnClose  = lb.querySelector('[data-lb-close]');
    const btnPrev   = lb.querySelector('[data-lb-prev]');
    const btnNext   = lb.querySelector('[data-lb-next]');

    /* ── State ───────────────────────────────────────────────── */
    let currentIndex = -1;          /* index into state.visible[] */
    let triggerEl    = null;        /* element to refocus on close */

    function isOpen() { return lb.classList.contains('is-open'); }

    /* ── Focus trap (limited to the lightbox's interactive nodes) */
    function focusableNodes() {
      return [btnClose, btnPrev, btnNext].filter((n) => !n.disabled);
    }

    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      const nodes = focusableNodes();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last  = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    /* ── Render the image at currentIndex ───────────────────── */
    function render() {
      const set = state.visible;
      if (!set || set.length === 0) return;

      currentIndex = Math.max(0, Math.min(set.length - 1, currentIndex));
      const item   = set[currentIndex];
      const img    = item.querySelector('img');

      const src     = img ? img.src           : '';
      const alt     = img ? img.alt           : '';
      const caption = item.dataset.caption || alt || '';

      /* Fade image out → swap → fade in once loaded */
      elImage.classList.remove('is-ready');
      elImage.removeAttribute('alt');

      const onLoad = () => {
        elImage.classList.add('is-ready');
        elImage.removeEventListener('load', onLoad);
      };
      elImage.addEventListener('load', onLoad);
      elImage.src = src;
      elImage.alt = alt;
      /* If the browser pulls from cache the load event may not fire */
      if (elImage.complete) onLoad();

      elCaption.textContent = caption;
      elCounter.textContent = `${currentIndex + 1} / ${set.length}`;

      /* Single-image filter sets disable both arrows */
      const single = set.length <= 1;
      btnPrev.disabled = single;
      btnNext.disabled = single;
    }

    /* ── Open / Close / Navigate ─────────────────────────────── */
    function open(item) {
      const set = state.visible;
      const idx = set.indexOf(item);
      if (idx === -1) return;

      triggerEl   = item;
      currentIndex = idx;

      lb.hidden = false;
      /* Force a reflow before adding .is-open so the opacity tween fires */
      void lb.offsetWidth;
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('gallery-lightbox-open');

      render();

      /* Move focus into the lightbox */
      window.requestAnimationFrame(() => btnClose.focus());
    }

    function close() {
      if (!isOpen()) return;
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('gallery-lightbox-open');

      /* Hide from AT and the layout once the fade completes */
      window.setTimeout(() => {
        if (!isOpen()) lb.hidden = true;
      }, 220);

      /* Return focus to the originally clicked thumbnail */
      if (triggerEl && typeof triggerEl.focus === 'function') {
        triggerEl.focus();
      }
    }

    function step(delta) {
      const set = state.visible;
      if (!set || set.length <= 1) return;
      currentIndex = (currentIndex + delta + set.length) % set.length;
      render();
    }

    /* ── Wiring ──────────────────────────────────────────────── */

    /* Open on any thumbnail click — event-delegated so future
       filter changes don't break the binding. */
    grid.addEventListener('click', (e) => {
      if (e.target.closest('.route-save-btn')) return;
      const item = e.target.closest('.gallery-item');
      if (!item || item.hidden) return;
      open(item);
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', () => step(-1));
    btnNext.addEventListener('click', () => step(+1));

    /* Click on the dim backdrop (but not on inner content) closes */
    lb.addEventListener('click', (e) => {
      if (e.target === lb) close();
    });

    /* Keyboard handling — only when lightbox is open */
    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          close();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          step(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          step(+1);
          break;
        case 'Tab':
          trapFocus(e);
          break;
      }
    });
  }


  /* ── Boot ──────────────────────────────────────────────────── */
  function boot() {
    /* Shared state mutated by the filter module so the lightbox can
       always read the live "currently visible" set without re-querying
       the DOM on every navigation step. */
    const state = { visible: [] };

    if (!initFilter(state)) return;
    initLightbox(state);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();


/* ================================================================
   20 · FEEDBACK FORM — about.html only
   ──────────────────────────────────────────────────────────────
   Behaviour
   • Submit handler runs entirely client-side. The validated payload
     is logged to the console (placeholder for a future endpoint).
   • Each field has its own validator. Errors set .field-error on
     the input and reveal an inline message tied via aria-describedby.
   • A summary message is also written to a shared aria-live region
     so screen readers announce that something failed.
   • A live character counter for the textarea ("87 / 500") changes
     colour as the user approaches and exceeds the limit.
   • On success the form fades out and a green success card fades in
     with the user's name interpolated in. "Send another" resets and
     re-shows the form, focusing the name field.
   • Module is a no-op on pages without [data-feedback-form].
================================================================ */
(function initFeedbackForm() {
  const form = document.querySelector('[data-feedback-form]');
  if (!form) return;

  const successCard = document.querySelector('[data-feedback-success]');
  const thanksEl    = successCard ? successCard.querySelector('[data-feedback-thanks]') : null;
  const resetBtn    = document.querySelector('[data-feedback-reset]');
  const statusEl    = document.querySelector('[data-feedback-status]');
  const counterEl   = document.querySelector('[data-counter-current]');
  const messageEl   = form.querySelector('#ff-message');

  /* Field map — each entry knows how to read its DOM and validate. */
  const fields = {
    name: {
      el:  form.querySelector('#ff-name'),
      err: form.querySelector('#ff-name-err'),
      validate(v) {
        if (!v.trim())            return 'Please enter your name.';
        if (v.trim().length < 2)  return 'Name must be at least 2 characters.';
        return '';
      }
    },
    visitorType: {
      el:  form.querySelector('#ff-type'),
      err: form.querySelector('#ff-type-err'),
      validate(v) {
        if (!v) return 'Please choose how you are visiting.';
        return '';
      }
    },
    route: {
      el:  form.querySelector('.form-row--radios'),
      err: form.querySelector('#ff-route-err'),
      validate() {
        const checked = form.querySelector('input[name="route"]:checked');
        if (!checked) return 'Please pick the route that interests you most.';
        return '';
      },
      readValue() {
        const checked = form.querySelector('input[name="route"]:checked');
        return checked ? checked.value : '';
      }
    },
    message: {
      el:  messageEl,
      err: form.querySelector('#ff-message-err'),
      validate(v) {
        const t = v.trim();
        if (!t)               return 'Please share a few words of feedback.';
        if (t.length < 10)    return 'Feedback must be at least 10 characters.';
        if (t.length > 500)   return 'Feedback must be 500 characters or fewer.';
        return '';
      }
    }
  };

  /* ── Helpers ─────────────────────────────────────────────── */

  function readValue(field) {
    return typeof field.readValue === 'function'
      ? field.readValue()
      : (field.el && 'value' in field.el ? field.el.value : '');
  }

  function showError(field, message) {
    if (!field.el || !field.err) return;
    field.el.classList.add('field-error');
    field.err.textContent = message;
    field.err.hidden = false;
    /* aria-invalid lets AT announce the field as invalid on focus */
    if ('setAttribute' in field.el) field.el.setAttribute('aria-invalid', 'true');
  }

  function clearError(field) {
    if (!field.el || !field.err) return;
    field.el.classList.remove('field-error');
    field.err.hidden = true;
    field.err.textContent = '';
    if ('removeAttribute' in field.el) field.el.removeAttribute('aria-invalid');
  }

  function clearAllErrors() {
    Object.values(fields).forEach(clearError);
    if (statusEl) statusEl.textContent = '';
  }

  /* ── Live character counter ─────────────────────────────── */
  function updateCounter() {
    if (!messageEl || !counterEl) return;
    const len    = messageEl.value.length;
    counterEl.textContent = len;

    const wrap = counterEl.parentElement;
    if (!wrap) return;
    wrap.classList.toggle('is-near-limit', len >= 450 && len <= 500);
    wrap.classList.toggle('is-over-limit', len > 500);
  }

  if (messageEl) {
    messageEl.addEventListener('input', updateCounter);
    updateCounter();
  }

  /* Clear a field's error as soon as the user edits it again. */
  Object.entries(fields).forEach(([key, field]) => {
    if (!field.el) return;
    const targets = key === 'route'
      ? form.querySelectorAll('input[name="route"]')
      : [field.el];
    targets.forEach((node) => {
      node.addEventListener('input',  () => clearError(field));
      node.addEventListener('change', () => clearError(field));
    });
  });

  /* ── Submit handler ─────────────────────────────────────── */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors();

    const payload = {
      name:        readValue(fields.name).trim(),
      visitorType: readValue(fields.visitorType),
      route:       readValue(fields.route),
      message:     readValue(fields.message).trim(),
      submittedAt: new Date().toISOString()
    };

    /* Run every validator; collect failures so we can focus the first
       invalid field and announce a single summary line. */
    const failures = [];
    Object.entries(fields).forEach(([key, field]) => {
      const message = field.validate(readValue(field));
      if (message) {
        showError(field, message);
        failures.push({ key, field, message });
      }
    });

    if (failures.length > 0) {
      if (statusEl) {
        statusEl.textContent = failures.length === 1
          ? failures[0].message
          : `Please fix ${failures.length} issues above before sending.`;
      }
      /* Move focus to the first failing input — for the radio group
         the legend is the labelling element, so focus the first radio. */
      const first = failures[0].field;
      const focusTarget = first === fields.route
        ? form.querySelector('input[name="route"]')
        : first.el;
      if (focusTarget && typeof focusTarget.focus === 'function') {
        focusTarget.focus();
      }
      return;
    }

    /* Success — log payload (real backend would POST here) and swap UI. */
    if (window.DEBUG) console.log('[Feedback Form] submission', payload);
    showSuccess(payload);
  });

  /* ── Success swap ────────────────────────────────────────── */
  function showSuccess(payload) {
    if (!successCard) return;

    /* Personalise the thank-you line with the submitted name */
    if (thanksEl && payload.name) {
      thanksEl.textContent = `Thank you, ${payload.name} — your feedback has been recorded.`;
    }

    /* Fade the form out, then unmount and reveal the success card */
    form.classList.add('is-fading');
    window.setTimeout(() => {
      form.hidden = true;
      form.classList.remove('is-fading');
      successCard.hidden = false;
      /* Force a reflow so the entry transition fires */
      void successCard.offsetWidth;
      successCard.classList.add('is-visible');
      /* Move focus to the success heading for AT confirmation */
      if (thanksEl) {
        thanksEl.setAttribute('tabindex', '-1');
        thanksEl.focus({ preventScroll: false });
      }
    }, 260);
  }

  /* ── Reset to send another ───────────────────────────────── */
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!successCard) return;
      successCard.classList.remove('is-visible');
      window.setTimeout(() => {
        successCard.hidden = true;
        form.reset();
        clearAllErrors();
        updateCounter();
        form.hidden = false;
        /* Bring the user back to the first field */
        const nameInput = fields.name.el;
        if (nameInput) nameInput.focus();
      }, 260);
    });
  }
})();


/* ================================================================
   21 · MY ATLAS — saved routes (localStorage) + FAB + slide panel
   ──────────────────────────────────────────────────────────────
   • Key "btm-atlas" stores a JSON array of route slugs.
   • .route-save-btn toggles membership; state syncs across tabs via
     the storage event.
   • FAB + panel mirror the mobile-drawer focus / scrim / ESC pattern.
================================================================ */
(function initMyAtlas() {
  const STORAGE_KEY = 'btm-atlas';

  const ROUTE_META = {
    maclehose: { en: 'MacLehose Trail', zh: '麥理浩徑' },
    'lion-rock': { en: 'Lion Rock', zh: '獅子山' },
    'dragons-back': { en: "Dragon's Back", zh: '龍脊' },
    lantau: { en: 'Lantau Peak', zh: '鳳凰山' },
    'cheung-chau': { en: 'Cheung Chau', zh: '長洲' },
    'pat-sin-leng': { en: 'Pat Sin Leng', zh: '八仙嶺' },
    'sunset-peak': { en: 'Sunset Peak', zh: '大東山' },
  };

  const SLUG_ORDER = [
    'maclehose',
    'lion-rock',
    'dragons-back',
    'lantau',
    'cheung-chau',
    'pat-sin-leng',
    'sunset-peak',
  ];

  let fabEl = null;
  let panelEl = null;
  let scrimEl = null;
  let openerEl = null;
  let trapHandler = null;
  let escHandler = null;
  let prevOverflow = '';

  function inRoutesFolder() {
    return /\/routes\//.test(window.location.pathname);
  }

  function routeHref(slug) {
    return inRoutesFolder() ? `${slug}.html` : `routes/${slug}.html`;
  }

  function thumbSrc(slug) {
    return (inRoutesFolder() ? '../' : '') + `assets/images/route-${slug}.jpg`;
  }

  function readAtlas() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const uniq = [...new Set(parsed.map(String))];
      return SLUG_ORDER.filter((s) => uniq.includes(s));
    } catch (e) {
      return [];
    }
  }

  function writeAtlas(slugs) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch (e) { /* quota / private mode */ }
  }

  function labelForSlug(slug) {
    const m = ROUTE_META[slug];
    return m ? m.en : slug;
  }

  function updateSaveButton(btn, saved) {
    const slug = btn.dataset.saveRoute;
    if (!slug) return;
    const meta = ROUTE_META[slug];
    const name = meta ? meta.en : slug;
    btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    btn.classList.toggle('is-saved', saved);
    btn.setAttribute(
      'aria-label',
      saved ? `Remove ${name} from My Atlas` : `Save ${name} to My Atlas`
    );
  }

  function syncSaveButtons(list) {
    const set = new Set(list);
    document.querySelectorAll('.route-save-btn[data-save-route]').forEach((btn) => {
      updateSaveButton(btn, set.has(btn.dataset.saveRoute));
    });
  }

  function animateFabCount(el) {
    if (!el) return;
    el.classList.remove('atlas-fab__count--pop');
    void el.offsetWidth;
    el.classList.add('atlas-fab__count--pop');
    window.setTimeout(() => el.classList.remove('atlas-fab__count--pop'), 450);
  }

  function pulseSaveButtons(slug) {
    document.querySelectorAll(`.route-save-btn[data-save-route="${slug}"]`).forEach((btn) => {
      btn.classList.remove('route-save-btn--pop');
      void btn.offsetWidth;
      btn.classList.add('route-save-btn--pop');
      window.setTimeout(() => btn.classList.remove('route-save-btn--pop'), 450);
    });
  }

  function syncFab(list) {
    if (!fabEl) return;
    const n = list.length;
    const countEl = fabEl.querySelector('.atlas-fab__count');
    const prev = countEl ? parseInt(countEl.textContent, 10) : 0;
    fabEl.hidden = n === 0;
    fabEl.setAttribute(
      'aria-label',
      n === 0 ? 'Open My Atlas' : `Open My Atlas, ${n} route${n === 1 ? '' : 's'} saved`
    );
    if (countEl) {
      countEl.textContent = String(n);
      if (!Number.isNaN(prev) && prev !== n) animateFabCount(countEl);
    }
    const titleCount = panelEl && panelEl.querySelector('.atlas-panel__heading-count');
    if (titleCount) titleCount.textContent = String(n);
  }

  function renderPanelList(list) {
    if (!panelEl) return;
    const ul = panelEl.querySelector('.atlas-panel__list');
    const empty = panelEl.querySelector('.atlas-panel__empty');
    if (!ul || !empty) return;

    ul.innerHTML = '';

    if (list.length === 0) {
      empty.hidden = false;
      ul.hidden = true;
      return;
    }

    empty.hidden = true;
    ul.hidden = false;

    list.forEach((slug) => {
      const meta = ROUTE_META[slug];
      if (!meta) return;

      const li = document.createElement('li');
      li.className = 'atlas-panel__row';
      li.dataset.atlasSlug = slug;

      const img = document.createElement('img');
      img.className = 'atlas-panel__thumb';
      img.src = thumbSrc(slug);
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';

      const text = document.createElement('div');
      text.className = 'atlas-panel__text';

      const en = document.createElement('span');
      en.className = 'atlas-panel__name';
      en.textContent = meta.en;

      const zh = document.createElement('span');
      zh.className = 'atlas-panel__name-zh';
      zh.lang = 'zh-Hant';
      zh.textContent = meta.zh;

      text.appendChild(en);
      text.appendChild(zh);

      const view = document.createElement('a');
      view.className = 'btn btn--text atlas-panel__view';
      view.href = routeHref(slug);
      view.textContent = 'View route';

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'btn btn--text atlas-panel__remove';
      remove.setAttribute('aria-label', `Remove ${meta.en} from My Atlas`);
      remove.textContent = 'Remove';

      remove.addEventListener('click', () => {
        const next = readAtlas().filter((s) => s !== slug);
        writeAtlas(next);
        syncSaveButtons(next);
        syncFab(next);
        renderPanelList(next);
      });

      li.appendChild(img);
      li.appendChild(text);
      li.appendChild(view);
      li.appendChild(remove);
      ul.appendChild(li);
    });
  }

  function injectUiOnce() {
    if (document.getElementById('atlas-fab')) return;

    const fab = document.createElement('button');
    fab.type = 'button';
    fab.id = 'atlas-fab';
    fab.className = 'atlas-fab';
    fab.dataset.atlasOpen = '';
    fab.hidden = true;
    fab.setAttribute('aria-label', 'Open My Atlas');
    fab.innerHTML = `
      <svg class="atlas-fab__star" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
      </svg>
      <span class="atlas-fab__label">My Atlas</span>
      <span class="atlas-fab__count" aria-hidden="true">0</span>
    `;

    const scrim = document.createElement('div');
    scrim.className = 'atlas-scrim';
    scrim.dataset.atlasScrim = '';
    scrim.hidden = true;

    const panel = document.createElement('aside');
    panel.id = 'atlas-panel';
    panel.className = 'atlas-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'atlas-panel-title');
    panel.hidden = true;
    panel.innerHTML = `
      <div class="atlas-panel__inner">
        <header class="atlas-panel__header">
          <h2 id="atlas-panel-title" class="atlas-panel__title">
            My Atlas <span class="atlas-panel__heading-count">0</span>
          </h2>
          <button type="button" class="atlas-panel__close" aria-label="Close My Atlas">
            <span aria-hidden="true">&times;</span>
          </button>
        </header>
        <div class="atlas-panel__body">
          <p class="atlas-panel__empty">No routes saved yet. Tap the ⭐ on any route card to start your atlas.</p>
          <ul class="atlas-panel__list" role="list" hidden></ul>
        </div>
        <footer class="atlas-panel__footer">
          <button type="button" class="btn btn--text atlas-panel__clear">Clear all</button>
          <button type="button" class="btn btn--primary atlas-panel__print">Print my atlas</button>
        </footer>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(scrim);
    document.body.appendChild(panel);

    fabEl = fab;
    scrimEl = scrim;
    panelEl = panel;

    fab.addEventListener('click', () => openPanel(fab));

    scrim.addEventListener('click', () => closePanel(true));

    panel.querySelector('.atlas-panel__close').addEventListener('click', () => closePanel(true));

    panel.querySelector('.atlas-panel__clear').addEventListener('click', () => {
      writeAtlas([]);
      const empty = readAtlas();
      syncSaveButtons(empty);
      syncFab(empty);
      renderPanelList(empty);
    });

    panel.querySelector('.atlas-panel__print').addEventListener('click', () => {
      window.print();
    });
  }

  function focusablesInPanel() {
    if (!panelEl) return [];
    return Array.from(
      panelEl.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled') && panelEl.contains(el));
  }

  function onPanelKeydown(e) {
    if (e.key !== 'Tab') return;
    const nodes = focusablesInPanel();
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function attachTrap() {
    detachTrap();
    trapHandler = onPanelKeydown;
    if (panelEl) panelEl.addEventListener('keydown', trapHandler);
    escHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePanel(true);
      }
    };
    document.addEventListener('keydown', escHandler, true);
  }

  function detachTrap() {
    if (panelEl && trapHandler) panelEl.removeEventListener('keydown', trapHandler);
    if (escHandler) document.removeEventListener('keydown', escHandler, true);
    trapHandler = null;
    escHandler = null;
  }

  function openPanel(fromEl) {
    injectUiOnce();
    const list = readAtlas();
    renderPanelList(list);
    syncFab(list);

    openerEl = fromEl || fabEl;
    scrimEl.hidden = false;
    panelEl.hidden = false;
    document.body.classList.add('atlas-panel-open');
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.requestAnimationFrame(() => {
      scrimEl.classList.add('is-open');
      panelEl.classList.add('is-open');
    });

    attachTrap();

    const nodes = focusablesInPanel();
    const closeBtn = panelEl.querySelector('.atlas-panel__close');
    (closeBtn || nodes[0])?.focus();
  }

  function closePanel(restore) {
    if (!panelEl || !scrimEl) return;

    scrimEl.classList.remove('is-open');
    panelEl.classList.remove('is-open');

    window.setTimeout(() => {
      scrimEl.hidden = true;
      panelEl.hidden = true;
      document.body.classList.remove('atlas-panel-open');
      document.body.style.overflow = prevOverflow;
    }, 260);

    detachTrap();

    if (restore !== false && openerEl && typeof openerEl.focus === 'function') {
      try {
        openerEl.focus();
      } catch (e) { /* ignore */ }
    }
    openerEl = null;
  }

  function toggleSlug(slug) {
    let list = readAtlas();
    if (list.includes(slug)) {
      list = list.filter((s) => s !== slug);
    } else {
      list = [...list, slug];
      list = SLUG_ORDER.filter((s) => list.includes(s));
    }
    writeAtlas(list);
    syncSaveButtons(list);
    syncFab(list);
    if (panelEl && panelEl.classList.contains('is-open')) {
      renderPanelList(list);
    }
  }

  function onSaveClick(e) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const slug = btn.dataset.saveRoute;
    if (!slug || !ROUTE_META[slug]) return;
    toggleSlug(slug);
    pulseSaveButtons(slug);
  }

  function bindSaveButtons() {
    document.querySelectorAll('.route-save-btn[data-save-route]').forEach((btn) => {
      if (btn.dataset.atlasBound === '1') return;
      btn.dataset.atlasBound = '1';
      btn.addEventListener('click', onSaveClick);
    });
  }

  function syncAll() {
    const list = readAtlas();
    syncSaveButtons(list);
    syncFab(list);
    if (panelEl && panelEl.classList.contains('is-open')) {
      renderPanelList(list);
    }
  }

  function run() {
    injectUiOnce();
    syncAll();
    bindSaveButtons();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) syncAll();
    });

    document.addEventListener('btm:content-mounted', () => {
      bindSaveButtons();
      syncAll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();


/* ================================================================
   22 · LIVE WEATHER WIDGET — Open-Meteo · 30-min cache · offline fallback
   ──────────────────────────────────────────────────────────────
   Trail route pages expose [data-weather-widget][data-trail]. Forecast
   data cached in localStorage under btm-weather-<slug> (30 minutes).
================================================================ */

(function initWeatherWidgets() {
  const WEATHER_CACHE_MS = 30 * 60 * 1000;

  const TRAIL_COORDS = {
    maclehose: { lat: 22.379, lng: 114.358, nameEn: 'East Dam, Sai Kung', nameZh: '西貢萬宜水庫東壩' },
    'lion-rock': { lat: 22.35, lng: 114.19, nameEn: 'Lion Rock summit', nameZh: '獅子山頂' },
    'dragons-back': { lat: 22.23, lng: 114.249, nameEn: 'To Tei Wan trailhead', nameZh: '土地灣（龍脊）起步點' },
    lantau: { lat: 22.26, lng: 113.917, nameEn: 'Pak Kung Au, Lantau', nameZh: '大嶼山伯公坳' },
    'cheung-chau': { lat: 22.21, lng: 114.027, nameEn: 'Cheung Chau Pier', nameZh: '長洲渡輪碼頭' },
    'pat-sin-leng': { lat: 22.49, lng: 114.23, nameEn: 'Tai Mei Tuk Reservoir', nameZh: '大尾篤水壩（船灣淡水湖）' },
    'sunset-peak': { lat: 22.26, lng: 113.917, nameEn: 'Pak Kung Au, Lantau', nameZh: '大嶼山伯公坳' },
  };

  function escAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  /** Mirrors §16 text swap for nodes injected after initial load. */
  function syncInjectedLang() {
    const html = document.documentElement;
    const lang = html.getAttribute('data-lang') || html.getAttribute('lang') || 'en';
    const attr = lang === 'zh-Hant' ? 'data-zh' : 'data-en';
    document.querySelectorAll('[data-en][data-zh]').forEach((el) => {
      const next = el.getAttribute(attr);
      if (next != null && el.textContent !== next) el.textContent = next;
    });
  }

  function weatherEmoji(code) {
    const c = code == null ? -1 : Number(code);
    if (c === 0) return { emoji: '☀', label: 'Clear' };
    if (c >= 1 && c <= 3) return { emoji: '🌤', label: 'Partly cloudy' };
    if (c === 45 || c === 48) return { emoji: '🌫', label: 'Fog' };
    if (c >= 51 && c <= 67) return { emoji: '🌧', label: 'Rain' };
    if (c >= 71 && c <= 77) return { emoji: '❄', label: 'Snow' };
    if (c >= 80 && c <= 82) return { emoji: '🌧', label: 'Showers' };
    if (c >= 95 && c <= 99) return { emoji: '⛈', label: 'Storm' };
    return { emoji: '🌤', label: 'Partly cloudy' };
  }

  function fmtHm(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Hong_Kong',
    });
  }

  function relativeUpdatedPair(fetchedAt) {
    const ms = Date.now() - fetchedAt;
    const sec = Math.floor(ms / 1000);
    if (sec < 45) return { en: 'just now', zh: '剛剛' };
    const min = Math.floor(sec / 60);
    if (min < 60) return { en: `${min} min ago`, zh: `${min} 分鐘前` };
    const hr = Math.floor(min / 60);
    if (hr < 48) return { en: `${hr} hr ago`, zh: `${hr} 小時前` };
    const day = Math.floor(hr / 24);
    return {
      en: `${day} day${day === 1 ? '' : 's'} ago`,
      zh: `${day} 天前`,
    };
  }

  function bindRefresh(widget, slug, refreshBtn) {
    refreshBtn.onclick = () => {
      refreshBtn.classList.remove('weather-widget__refresh--spin');
      void refreshBtn.offsetWidth;
      refreshBtn.classList.add('weather-widget__refresh--spin');
      window.setTimeout(() => refreshBtn.classList.remove('weather-widget__refresh--spin'), 650);
      loadWeather(widget, slug, true);
    };
  }

  function renderError(widget) {
    const contentEl = widget.querySelector('[data-weather-content]');
    const metaEl = widget.querySelector('[data-weather-meta]');
    const refreshBtn = widget.querySelector('[data-weather-refresh]');
    if (!contentEl) return;
    contentEl.innerHTML =
      '<p class="weather-widget__error"><span data-en="Live weather unavailable." data-zh="暫無即時天氣資料。">Live weather unavailable.</span> '
      + '<a href="https://www.hko.gov.hk/" target="_blank" rel="noopener"><span data-en="Check HKO" data-zh="查看香港天文台">Check HKO</span></a>'
      + '<span data-en=" before you go." data-zh="，出發前請先確認。"> before you go.</span></p>';
    if (metaEl) metaEl.hidden = true;
    if (refreshBtn) {
      refreshBtn.hidden = false;
      bindRefresh(widget, widget.dataset.trail, refreshBtn);
    }
    widget.setAttribute('aria-busy', 'false');
    syncInjectedLang();
  }

  function renderWeather(widget, data, coords, fetchedAt, stale) {
    const contentEl = widget.querySelector('[data-weather-content]');
    const metaEl = widget.querySelector('[data-weather-meta]');
    const refreshBtn = widget.querySelector('[data-weather-refresh]');
    if (!contentEl || !data || !data.current) {
      renderError(widget);
      return;
    }

    const cur = data.current;
    const code = cur.weather_code;
    const { emoji } = weatherEmoji(code);
    const temp = Math.round(cur.temperature_2m);
    const feels = Math.round(cur.apparent_temperature);
    const hum = Math.round(cur.relative_humidity_2m);
    const wind = Math.round(cur.wind_speed_10m);
    const sr = data.daily && data.daily.sunrise && data.daily.sunrise[0];
    const ss = data.daily && data.daily.sunset && data.daily.sunset[0];
    const sunRange = sr && ss ? `${fmtHm(sr)}–${fmtHm(ss)}` : '—';

    contentEl.innerHTML = `
      <div class="weather-widget__layout">
        <div class="weather-widget__icon" aria-hidden="true">${emoji}</div>
        <div class="weather-widget__stats">
          <div class="weather-stat weather-stat--temperature">
            <p class="stat__label eyebrow" data-en="Temperature" data-zh="氣溫">Temperature</p>
            <p class="stat__value stat__value--large">${temp}°C</p>
          </div>
          <div class="weather-stat">
            <p class="stat__label eyebrow" data-en="Feels like" data-zh="體感">Feels like</p>
            <p class="stat__value">${feels}°C</p>
          </div>
          <div class="weather-stat">
            <p class="stat__label eyebrow" data-en="Humidity" data-zh="濕度">Humidity</p>
            <p class="stat__value">${hum}%</p>
          </div>
          <div class="weather-stat">
            <p class="stat__label eyebrow" data-en="Wind" data-zh="風速">Wind</p>
            <p class="stat__value">${wind} km/h</p>
          </div>
          <div class="weather-stat">
            <p class="stat__label eyebrow" data-en="Sunrise → Sunset" data-zh="日出–日落">Sunrise → Sunset</p>
            <p class="stat__value">${sunRange}</p>
          </div>
        </div>
      </div>
      <p class="weather-widget__location"><span data-en="${escAttr(coords.nameEn)}" data-zh="${escAttr(coords.nameZh)}">${coords.nameEn}</span></p>
    `;

    const rel = relativeUpdatedPair(fetchedAt);
    const staleEn = stale ? ' (cached, may be outdated)' : '';
    const staleZh = stale ? '（快取資料，或已過時）' : '';
    const enMeta = `Updated ${rel.en} · ${coords.nameEn}${staleEn}`;
    const zhMeta = `${rel.zh}更新 · ${coords.nameZh}${staleZh}`;
    const escHtml = (s) =>
      String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (metaEl) {
      metaEl.hidden = false;
      metaEl.innerHTML = `<span data-en="${escAttr(enMeta)}" data-zh="${escAttr(zhMeta)}">${escHtml(enMeta)}</span>`;
    }
    if (refreshBtn) {
      refreshBtn.hidden = false;
      bindRefresh(widget, widget.dataset.trail, refreshBtn);
    }
    widget.setAttribute('aria-busy', 'false');
    syncInjectedLang();
  }

  async function loadWeather(widget, slug, bypassCache) {
    const coords = TRAIL_COORDS[slug];
    const cacheKey = `btm-weather-${slug}`;
    const contentEl = widget.querySelector('[data-weather-content]');
    const metaEl = widget.querySelector('[data-weather-meta]');
    const refreshBtn = widget.querySelector('[data-weather-refresh]');

    if (!coords || !contentEl) {
      widget.setAttribute('aria-busy', 'false');
      return;
    }

    let stalePayload = null;
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        stalePayload = JSON.parse(raw);
      }
    } catch (e) {
      stalePayload = null;
    }

    if (!bypassCache && stalePayload && stalePayload.data && stalePayload.fetchedAt != null) {
      const age = Date.now() - stalePayload.fetchedAt;
      if (age >= 0 && age < WEATHER_CACHE_MS) {
        renderWeather(widget, stalePayload.data, coords, stalePayload.fetchedAt, false);
        return;
      }
    }

    if (bypassCache) {
      contentEl.innerHTML =
        '<p class="weather-widget__loading" data-en="Checking weather at the trailhead…" data-zh="查詢山徑天氣中…">Checking weather at the trailhead…</p>';
      metaEl && (metaEl.hidden = true);
      syncInjectedLang();
    }

    widget.setAttribute('aria-busy', 'true');

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}` +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m' +
      '&daily=sunrise,sunset&timezone=Asia%2FHong_Kong';

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('forecast HTTP ' + res.status);
      const data = await res.json();
      const fetchedAt = Date.now();
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ data, fetchedAt }));
      } catch (e) {
        /* quota — still render live */
      }
      renderWeather(widget, data, coords, fetchedAt, false);
    } catch (err) {
      if (window.DEBUG) console.warn('[Beyond the Map] Weather fetch failed', err);
      if (stalePayload && stalePayload.data) {
        renderWeather(
          widget,
          stalePayload.data,
          coords,
          stalePayload.fetchedAt,
          true
        );
      } else {
        renderError(widget);
      }
    }
  }

  function run() {
    document.querySelectorAll('[data-weather-widget]').forEach((widget) => {
      const slug = widget.dataset.trail;
      if (!slug || !TRAIL_COORDS[slug]) return;
      loadWeather(widget, slug, false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();


/* ================================================================
   23 · ROUTE COMPARE — picker chips · comparison table · localStorage
   ──────────────────────────────────────────────────────────────
   • COMPARE_DATA is the single source of truth for comparison rows.
   • Selection persisted under key "btm-compare" (JSON array of slugs).
================================================================ */

const COMPARE_DATA = {
  maclehose: {
    nameEn: 'MacLehose Trail',
    nameZh: '麥理浩徑',
    image: 'assets/images/route-maclehose.jpg',
    imageAlt: 'MacLehose Trail ridge and reservoir landscape in Sai Kung',
    distance: 'About 16 km · Section 2',
    hikingTime: 'About 6 hours',
    difficulty: 'Very difficult',
    difficultyRating: 5,
    elevationGain: 'About 700 m across the section',
    bestSeason: 'October–March (cool, dry)',
    transport: 'MTR Choi Hung → bus 92 + minibus 1A to Sai Kung; taxi to East Dam',
    mythLayer: 'Dragon vein across the New Territories',
  },
  'lion-rock': {
    nameEn: 'Lion Rock',
    nameZh: '獅子山',
    image: 'assets/images/route-lion-rock.jpg',
    imageAlt: 'Lion Rock rising above Kowloon and the surrounding city',
    distance: 'About 4 km',
    hikingTime: 'About 2 hours',
    difficulty: 'Easy to moderate',
    difficultyRating: 2,
    elevationGain: 'About 340 m',
    bestSeason: 'October–April (clear, cool city views)',
    transport: 'MTR Wong Tai Sin → minibus 18M; or bus 81 from Sha Tin',
    mythLayer: 'Protection, identity, and collective memory',
  },
  'dragons-back': {
    nameEn: "Dragon's Back",
    nameZh: '龍脊',
    image: 'assets/images/route-dragons-back.jpg',
    imageAlt: "Dragon's Back ridgeline looking north across Hong Kong Island",
    distance: 'About 8 km',
    hikingTime: 'About 4 hours',
    difficulty: 'Moderate',
    difficultyRating: 3,
    elevationGain: 'About 250 m',
    bestSeason: 'November–April (cool, low haze)',
    transport: 'MTR Shau Kei Wan → bus 9 to To Tei Wan; return bus from Big Wave Bay',
    mythLayer: 'Walking along the back of a dragon',
  },
  lantau: {
    nameEn: 'Lantau Peak',
    nameZh: '鳳凰山',
    image: 'assets/images/route-lantau.jpg',
    imageAlt: 'Lantau Peak mountain ridge under open sky',
    distance: 'About 4.5 km',
    hikingTime: 'About 2.5 hours',
    difficulty: 'Challenging',
    difficultyRating: 4,
    elevationGain: 'About 600 m',
    bestSeason: 'October–April (cool, clear skies)',
    transport: 'MTR Tung Chung → bus 11 or 23 to Pak Kung Au; cable car return from Ngong Ping',
    mythLayer: 'Source mountain and pilgrimage path',
  },
  'cheung-chau': {
    nameEn: 'Cheung Chau',
    nameZh: '長洲',
    image: 'assets/images/route-cheung-chau.jpg',
    imageAlt: 'Cheung Chau harbour and village shoreline',
    distance: 'About 5 km loop',
    hikingTime: 'Half-day ferry visit',
    difficulty: 'Easy',
    difficultyRating: 1,
    elevationGain: 'About 50 m',
    bestSeason: 'April–May for the Bun Festival; quiet weekday visits any time of year',
    transport: 'MTR Central → Cheung Chau ferry from Pier 5',
    mythLayer: 'Temples, festival towers, and safe harbour form',
  },
  'pat-sin-leng': {
    nameEn: 'Pat Sin Leng',
    nameZh: '八仙嶺',
    image: 'assets/images/route-pat-sin-leng.jpg',
    imageAlt: 'Pat Sin Leng ridge above Tai Mei Tuk and Plover Cove Reservoir',
    distance: 'About 7.5 km',
    hikingTime: 'About 5 hours',
    difficulty: 'Moderate to challenging',
    difficultyRating: 4,
    elevationGain: 'About 590 m',
    bestSeason: 'November–March for cool air and clear ridge visibility',
    transport: 'MTR Tai Po Market → bus 75K to Tai Mei Tuk; weekend bus 275R from Bride\'s Pool',
    mythLayer: 'Eight Daoist immortals named across the ridge',
  },
  'sunset-peak': {
    nameEn: 'Sunset Peak',
    nameZh: '大東山',
    image: 'assets/images/route-sunset-peak.jpg',
    imageAlt: 'Stone hut on Sunset Peak with high grass and open sky',
    distance: 'About 5 km',
    hikingTime: 'About 3 hours',
    difficulty: 'Moderate',
    difficultyRating: 3,
    elevationGain: 'About 620 m',
    bestSeason: 'October–December for silvergrass, sunset light, and cooler walking',
    transport: 'MTR Tung Chung → bus 11 or 23 to Pak Kung Au; bus 3M from Mui Wo back',
    mythLayer: "Wind path companion to Lantau Peak's pilgrimage",
  },
};

(function initRouteCompare() {
  const STORAGE_KEY = 'btm-compare';
  const MAX = 4;
  const SLUG_ORDER = [
    'maclehose',
    'lion-rock',
    'dragons-back',
    'lantau',
    'cheung-chau',
    'pat-sin-leng',
    'sunset-peak',
  ];

  const CHIP_LABEL = {
    maclehose: 'MacLehose',
    'lion-rock': 'Lion Rock',
    'dragons-back': "Dragon's Back",
    lantau: 'Lantau Peak',
    'cheung-chau': 'Cheung Chau',
    'pat-sin-leng': 'Pat Sin Leng',
    'sunset-peak': 'Sunset Peak',
  };

  function escChipAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  function syncCompareInjectedLang() {
    const html = document.documentElement;
    const lang = html.getAttribute('data-lang') || html.getAttribute('lang') || 'en';
    const attr = lang === 'zh-Hant' ? 'data-zh' : 'data-en';
    document.querySelectorAll('[data-en][data-zh]').forEach((el) => {
      const next = el.getAttribute(attr);
      if (next != null && el.textContent !== next) el.textContent = next;
    });
  }

  const SAVE_STAR_SVG =
    '<svg class="route-save-btn__icon route-save-btn__icon--outline" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
    + '<svg class="route-save-btn__icon route-save-btn__icon--filled" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>';

  const root = document.querySelector('[data-compare-page]');
  if (!root) return;

  const chipsEl = root.querySelector('[data-compare-chips]');
  const liveEl = root.querySelector('[data-compare-live]');
  const emptyEl = root.querySelector('[data-compare-empty]');
  const resultsEl = root.querySelector('[data-compare-results]');
  const desktopEl = root.querySelector('[data-compare-desktop]');
  const mobileEl = root.querySelector('[data-compare-mobile]');
  const suggestBtn = root.querySelector('[data-compare-suggest]');

  if (!chipsEl || !desktopEl || !mobileEl || !emptyEl || !resultsEl) return;

  let selected = [];

  function readSelection() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const uniq = [...new Set(parsed.map(String))];
      return SLUG_ORDER.filter((s) => uniq.includes(s)).slice(0, MAX);
    } catch (e) {
      return [];
    }
  }

  function writeSelection(arr) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, MAX)));
    } catch (e) { /* quota */ }
  }

  function announce(msg) {
    if (liveEl) liveEl.textContent = msg;
  }

  function announceSelectionCount(n) {
    announce(`Selected ${n} of ${MAX} routes`);
  }

  function ratingHtml(r, labelText) {
    let dots = '';
    for (let i = 1; i <= 5; i += 1) {
      dots += `<span${i > r ? ' class="is-empty"' : ''}></span>`;
    }
    const aria = labelText ? `${labelText}; ${r} out of 5` : `${r} out of 5`;
    return `<div class="compare-rating" aria-label="${aria}">${dots}</div>`;
  }

  function saveButtonHtml(slug, nameEn) {
    return `<button type="button" class="route-save-btn compare-route-save" data-save-route="${slug}" aria-pressed="false" aria-label="Save ${nameEn} to My Atlas">${SAVE_STAR_SVG}</button>`;
  }

  function renderDesktopTable(slugs) {
    let headerCols = '<th scope="col" class="compare-corner"></th>';
    slugs.forEach((slug) => {
      const d = COMPARE_DATA[slug];
      headerCols += `<th scope="col" class="compare-th-route"><span class="compare-th-en">${d.nameEn}</span> <span class="compare-th-zh" lang="zh-Hant">${d.nameZh}</span></th>`;
    });

    function td(colIdx, inner, extraClass = '') {
      return `<td class="compare-td compare-cell-anim${extraClass ? ` ${extraClass}` : ''}" style="--compare-col:${colIdx}">${inner}</td>`;
    }

    function rowCells(fn) {
      let html = '';
      slugs.forEach((slug, colIdx) => {
        html += fn(slug, colIdx);
      });
      return html;
    }

    const rows = [
      {
        label: 'Hero photo',
        cells: (slug, colIdx) =>
          td(colIdx, `<img class="compare-hero-img" src="${COMPARE_DATA[slug].image}" alt="${COMPARE_DATA[slug].imageAlt}" loading="lazy" decoding="async">`),
      },
      {
        label: 'Route name',
        cells: (slug, colIdx) => {
          const d = COMPARE_DATA[slug];
          return td(colIdx, `<span class="compare-name-en">${d.nameEn}</span> <span class="compare-name-zh" lang="zh-Hant">${d.nameZh}</span>`);
        },
      },
      {
        label: 'Distance',
        cells: (slug, colIdx) => td(colIdx, COMPARE_DATA[slug].distance),
      },
      {
        label: 'Hiking time',
        cells: (slug, colIdx) => td(colIdx, COMPARE_DATA[slug].hikingTime),
      },
      {
        label: 'Difficulty',
        cells: (slug, colIdx) => {
          const d = COMPARE_DATA[slug];
          return td(colIdx, `<div class="compare-diff-cell">${ratingHtml(d.difficultyRating, d.difficulty)}<span class="compare-diff-label">${d.difficulty}</span></div>`);
        },
      },
      {
        label: 'Elevation gain',
        cells: (slug, colIdx) => td(colIdx, COMPARE_DATA[slug].elevationGain),
      },
      {
        label: 'Best season',
        cells: (slug, colIdx) => td(colIdx, COMPARE_DATA[slug].bestSeason),
      },
      {
        label: 'Transport',
        cells: (slug, colIdx) => td(colIdx, COMPARE_DATA[slug].transport),
      },
      {
        label: 'Myth layer',
        cells: (slug, colIdx) => td(colIdx, COMPARE_DATA[slug].mythLayer),
      },
      {
        label: 'Actions',
        cells: (slug, colIdx) => {
          const d = COMPARE_DATA[slug];
          return td(colIdx, `<div class="compare-td-actions-inner"><a class="btn btn--text" href="routes/${slug}.html">View route</a>${saveButtonHtml(slug, d.nameEn)}</div>`, 'compare-td--actions');
        },
      },
    ];

    let body = '';
    rows.forEach((row) => {
      body += '<tr>';
      body += `<th scope="row">${row.label}</th>`;
      body += rowCells(row.cells);
      body += '</tr>';
    });

    return `
      <div class="compare-table-scroll">
        <table class="compare-table">
          <thead>
            <tr>${headerCols}</tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>`;
  }

  function renderMobileCards(slugs) {
    let html = '';
    slugs.forEach((slug, cardIdx) => {
      const d = COMPARE_DATA[slug];
      html += `
        <article class="subpage-card compare-mobile-card compare-cell-anim" style="--compare-col:${cardIdx}">
          <img class="compare-mobile-card__img" src="${d.image}" alt="${d.imageAlt}" loading="lazy" decoding="async">
          <h2 class="compare-mobile-card__title">${d.nameEn} <span lang="zh-Hant">${d.nameZh}</span></h2>
          <dl class="compare-mobile-dl">
            <div><dt>Distance</dt><dd>${d.distance}</dd></div>
            <div><dt>Hiking time</dt><dd>${d.hikingTime}</dd></div>
            <div><dt>Difficulty</dt><dd>${ratingHtml(d.difficultyRating, d.difficulty)}<span class="compare-diff-label">${d.difficulty}</span></dd></div>
            <div><dt>Elevation gain</dt><dd>${d.elevationGain}</dd></div>
            <div><dt>Best season</dt><dd>${d.bestSeason}</dd></div>
            <div><dt>Transport</dt><dd>${d.transport}</dd></div>
            <div><dt>Myth layer</dt><dd>${d.mythLayer}</dd></div>
          </dl>
          <div class="compare-mobile-card__actions">
            <a class="btn btn--text" href="routes/${slug}.html">View route</a>
            ${saveButtonHtml(slug, d.nameEn)}
          </div>
        </article>`;
    });
    return html;
  }

  function renderChips() {
    chipsEl.innerHTML = SLUG_ORDER.map((slug) => {
      const on = selected.includes(slug);
      const label = CHIP_LABEL[slug];
      const zhLabel = COMPARE_DATA[slug].nameZh;
      const longName = COMPARE_DATA[slug].nameEn;
      const aria = on ? `Remove ${longName} from comparison` : `Add ${longName} to comparison`;
      return `<button type="button" class="compare-chip${on ? ' compare-chip--selected' : ''}" data-compare-chip="${slug}" aria-pressed="${on ? 'true' : 'false'}" aria-label="${aria}"><span data-en="${escChipAttr(label)}" data-zh="${escChipAttr(zhLabel)}">${label}</span></button>`;
    }).join('');

    chipsEl.querySelectorAll('[data-compare-chip]').forEach((btn) => {
      btn.addEventListener('click', onChipClick);
    });
    syncCompareInjectedLang();
  }

  function onChipClick(e) {
    const slug = e.currentTarget.dataset.compareChip;
    if (!slug || !COMPARE_DATA[slug]) return;

    let next = selected.slice();
    const idx = next.indexOf(slug);
    if (idx >= 0) {
      next.splice(idx, 1);
    } else if (next.length < MAX) {
      next.push(slug);
      next = SLUG_ORDER.filter((s) => next.includes(s));
    } else {
      announce(`Maximum of ${MAX} routes — remove one to add another`);
      window.setTimeout(() => announceSelectionCount(selected.length), 1600);
      return;
    }

    selected = next;
    writeSelection(selected);
    announceSelectionCount(selected.length);
    renderResults();
  }

  function renderResults() {
    renderChips();

    if (selected.length === 0) {
      emptyEl.hidden = false;
      resultsEl.hidden = true;
      desktopEl.innerHTML = '';
      mobileEl.innerHTML = '';
      document.dispatchEvent(new CustomEvent('btm:content-mounted'));
      return;
    }

    emptyEl.hidden = true;
    resultsEl.hidden = false;

    desktopEl.innerHTML = renderDesktopTable(selected);
    mobileEl.innerHTML = renderMobileCards(selected);

    document.dispatchEvent(new CustomEvent('btm:content-mounted'));
  }

  function run() {
    selected = readSelection();
    announceSelectionCount(selected.length);
    renderResults();
  }

  if (suggestBtn) {
    suggestBtn.addEventListener('click', () => {
      selected = ['maclehose', 'lion-rock', 'dragons-back'];
      writeSelection(selected);
      announceSelectionCount(selected.length);
      renderResults();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();


/* ================================================================
   24 · PROGRESSIVE WEB APP — service worker + install + offline banner
   ──────────────────────────────────────────────────────────────
   Registers sw.js when served over HTTPS or localhost. Install toast
   respects localStorage dismissal; offline banner tracks navigator.onLine.
================================================================ */
(function initPWA() {
  const CACHE_LABEL = 'btm-cache-v1';

  function mainScriptUrl() {
    const el = document.querySelector('script[src*="main.js"]');
    return el && el.src ? el.src : `${window.location.origin}/main.js`;
  }

  function registerServiceWorker() {
    if (!window.isSecureContext || !('serviceWorker' in navigator)) {
      if (window.DEBUG) console.info('[PWA] Service worker skipped (no secure context or no API)');
      return;
    }

    const swUrl = new URL('sw.js', mainScriptUrl());

    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        if (window.DEBUG) {
          console.info('[PWA] Service worker registered — cache:', CACHE_LABEL, 'scope:', reg.scope);
        }

        if (reg.installing && window.DEBUG) {
          reg.installing.addEventListener('statechange', () => {
            if (window.DEBUG) console.info('[PWA] SW installing →', reg.installing.state);
          });
        }

        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          if (!nw || !window.DEBUG) return;
          nw.addEventListener('statechange', () => {
            if (window.DEBUG) console.info('[PWA] SW update →', nw.state);
          });
        });
      })
      .catch((err) => {
        if (window.DEBUG) console.warn('[PWA] Service worker registration failed:', err);
      });

    if (window.DEBUG && navigator.serviceWorker.controller) {
      console.info('[PWA] Page controlled by service worker —', CACHE_LABEL);
    }
  }

  function initInstallPrompt() {
    const dismissKey = 'btm-pwa-install-dismissed';
    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      if (window.localStorage.getItem(dismissKey) === '1') return;
      deferredPrompt = e;
      showInstallToast();
    });

    function showInstallToast() {
      if (document.getElementById('pwa-install-toast')) return;

      const toast = document.createElement('div');
      toast.id = 'pwa-install-toast';
      toast.className = 'pwa-install-toast';
      toast.setAttribute('role', 'status');

      toast.innerHTML = `
        <p class="pwa-install-toast__text">Install Beyond the Map for offline trail access</p>
        <div class="pwa-install-toast__actions">
          <button type="button" class="btn btn--primary pwa-install-toast__install" data-pwa-install>Install</button>
          <button type="button" class="pwa-install-toast__close" data-pwa-dismiss aria-label="Dismiss install prompt">&times;</button>
        </div>
      `;

      document.body.appendChild(toast);

      toast.querySelector('[data-pwa-install]').addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        try {
          const choice = await deferredPrompt.userChoice;
          if (window.DEBUG) console.info('[PWA] Install prompt outcome:', choice.outcome);
        } catch (err) {
          if (window.DEBUG) console.warn('[PWA] Install prompt error:', err);
        }
        deferredPrompt = null;
        toast.remove();
      });

      toast.querySelector('[data-pwa-dismiss]').addEventListener('click', () => {
        window.localStorage.setItem(dismissKey, '1');
        toast.remove();
      });
    }
  }

  function initOfflineBanner() {
    const banner = document.createElement('div');
    banner.id = 'pwa-offline-banner';
    banner.className = 'pwa-offline-banner';
    banner.setAttribute('role', 'status');
    banner.hidden = true;
    banner.textContent = "You're offline — viewing cached content.";

    const nav = document.getElementById('main-nav') || document.querySelector('.nav');
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(banner, nav);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }

    function sync() {
      banner.hidden = navigator.onLine;
    }

    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    sync();
  }

  function run() {
    registerServiceWorker();
    initInstallPrompt();
    initOfflineBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();


/* ================================================================
   25 · ROUTE PRINT SHEET — QR code src for route detail pages
================================================================ */
(function initRoutePrintSheet() {
  if (!document.body.classList.contains('route-print-sheet')) return;
  const qr = document.querySelector('[data-route-print-qr]');
  if (!qr) return;
  try {
    qr.src =
      'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=' +
      encodeURIComponent(window.location.href);
    qr.alt = 'QR code linking to this route page online';
  } catch (e) {
    if (window.DEBUG) console.warn('[Route print] QR init failed', e);
  }
})();


/* ================================================================
   END OF main.js
   ──────────────────────────────────────────────────────────────
   All animation systems are initialised above in dependency order.
   Add new features as separate named functions following this pattern.
   
   Recommended next steps (Design System build order §12):
   - Week 3: dragon-vein.js — enhanced with SVG path annotations
   - Week 4: filter-flip.js — GSAP Flip for bento filtering
   - Week 5: parallax-detail.js — 3-layer hero parallax on detail pages
   - Week 6: map-interactions.js — SVG region hover + filter panel
================================================================ */
