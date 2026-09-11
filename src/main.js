// ==========================================================================
// KAEDUAS — entry point. Order matters: preload, smooth scroll,
// WebGL monolith, choreography, interface.
// ==========================================================================

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initWebGL } from './webgl.js';
import { heroIntro, initScrollAnims } from './anims.js';
import {
  initCursor, initMagnetic, initMenu,
  initFacades, initClock, initHeader, initToTop
} from './ui.js';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* ---------- WebGL — Three.js is a separate lazy chunk; the
   preloader covers the fetch. Calls are buffered until it lands. ---------- */

const proxy = (() => {
  let api = null;
  let queuedAssemble = false;
  let lastScroll = 0;
  import('./webgl.js').then((m) => {
    api = m.initWebGL(document.getElementById('webgl'));
    api.setScroll(lastScroll);
    if (queuedAssemble) api.assemble();
  }).catch(() => { /* hero falls back to the CSS gradient scene */ });
  return {
    assemble() { queuedAssemble = true; api?.assemble(); },
    setScroll(p) { lastScroll = p; api?.setScroll(p); }
  };
})();

/* ---------- Scroll choreography ---------- */

initScrollAnims(proxy);

/* ---------- Interface ---------- */

initCursor();
initMagnetic();
initMenu((open) => {
  if (!lenis) return;
  if (open) lenis.stop(); else lenis.start();
});
initFacades();
initClock();
initHeader();
initToTop(scrollToTarget);

/* ---------- Preloader ---------- */

const loader = document.querySelector('.loader');
const count = document.querySelector('.loader-count');
const bars = gsap.utils.toArray('.loader-bar');

if (reduced || !loader) {
  loader?.remove();
  document.documentElement.classList.add('reduced');
  proxy.assemble();
} else {
  lenis?.stop();

  const state = { v: 0 };
  const tl = gsap.timeline({
    onComplete: () => {
      loader.classList.add('is-done');
      lenis?.start();
      proxy.assemble();
      heroIntro();
      gsap.delayedCall(1.0, () => loader.remove());
    }
  });

  tl.to(state, {
    v: 100,
    duration: 1.7,
    ease: 'power2.inOut',
    onUpdate: () => {
      count.textContent = String(Math.round(state.v)).padStart(3, '0');
    }
  });

  tl.to(bars, {
    width: 76,
    duration: 0.55,
    stagger: 0.28,
    ease: 'power3.out'
  }, 0);
}

// ==========================================================================
// Brief form — composes a pre-filled email client-side.
// No backend, nothing stored: the submit simply opens the visitor's
// email app with everything from the form already written in.
// ==========================================================================
const briefForm = document.getElementById('brief-form');
if (briefForm) {
  briefForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(briefForm);
    const subject = `Project brief for Kaeduas (${data.get('need') || 'new'})`;
    const body = [
      `Name: ${data.get('name') || ''}`,
      `From: ${data.get('from') || ''}`,
      `Needs: ${data.get('need') || ''}`,
      `Engagement: ${data.get('engagement') || ''}`,
      '',
      'Brief:',
      data.get('brief') || '',
      '',
      '(via the Kaeduas brief form)'
    ].join('\n');
    window.location.href = `mailto:motsamai.main@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
