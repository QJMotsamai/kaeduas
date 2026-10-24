// ==========================================================================
// KAEDUAS — entry point: considered motion, smooth navigation and interface.
// ==========================================================================

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroIntro, initScrollAnims } from './anims.js';
import {
  initMenu,
  initFacades, initDesignGallery, initClock, initHeader, initToTop
} from './ui.js';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) document.documentElement.classList.add('reduced');

/* ---------- Smooth scroll ---------- */

let lenis = null;
if (!reduced) {
  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    touchMultiplier: 1.4
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -56, duration: 1.3 });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
}

// Intercept in-page anchors so Lenis drives them
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1 && document.querySelector(id)) {
      e.preventDefault();
      scrollToTarget(id);
      history.replaceState(null, '', id);
    }
  });
});

/* ---------- Scroll choreography ---------- */

initScrollAnims();
heroIntro();

/* ---------- Interface ---------- */

initMenu((open) => {
  if (!lenis) return;
  if (open) lenis.stop(); else lenis.start();
});
initFacades();
initDesignGallery();
initClock();
initHeader();
initToTop(scrollToTarget);
