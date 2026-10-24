// ==========================================================================
// KAEDUAS — Interface behaviors: navigation, video facades and local time
// ==========================================================================

import { gsap } from 'gsap';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Mobile menu ---------- */

export function initMenu(onToggle) {
  const btn = document.querySelector('.menu-btn');
  const overlay = document.querySelector('.menu-overlay');
  if (!btn || !overlay) return;

  const setOpen = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'CLOSE' : 'MENU';
    overlay.classList.toggle('is-open', open);
    overlay.setAttribute('aria-hidden', String(!open));
    if (onToggle) onToggle(open);

    if (open && !reduced) {
      gsap.fromTo('.menu-overlay-nav a',
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out', delay: 0.1 }
      );
    }
  };

  btn.addEventListener('click', () => setOpen(!overlay.classList.contains('is-open')));
  overlay.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => setOpen(false))
  );
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) setOpen(false);
  });
}

/* ---------- Video facades — click to load a nocookie embed ---------- */

export function initFacades() {
  document.querySelectorAll('.facade').forEach((btn) => {
    // Thumbnail fallback chain: maxres → hq → branded placeholder
    const img = btn.querySelector('img');
    if (img) {
      img.addEventListener('error', () => {
        if (img.src.includes('maxresdefault')) {
          img.src = img.src.replace('maxresdefault', 'hqdefault');
        } else {
          img.style.display = 'none';
          btn.style.background =
            'radial-gradient(120% 120% at 30% 20%, #2a1a12 0%, #121214 55%, #0a0a0b 100%)';
        }
      });
    }

    btn.addEventListener('click', () => {
      const id = btn.dataset.video;
      if (!id || btn.classList.contains('is-playing')) return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      iframe.title = btn.getAttribute('aria-label') || 'Kaeduas video';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      btn.appendChild(iframe);
      btn.classList.add('is-playing');
    });
  });
}

/* ---------- SAST clock ---------- */

export function initClock() {
  const el = document.getElementById('sast-clock');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Africa/Johannesburg'
  });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 30000);
}

/* ---------- Header hide/show ---------- */

export function initHeader() {
  const head = document.querySelector('.site-head');
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    head.classList.toggle('is-solid', y > 40);
    if (y > lastY && y > 320 && !document.querySelector('.menu-overlay.is-open')) {
      head.classList.add('is-hidden');
    } else {
      head.classList.remove('is-hidden');
    }
    lastY = y;
  }, { passive: true });
}

/* ---------- Back to top ---------- */

export function initToTop(scrollTop) {
  const btn = document.getElementById('to-top');
  if (btn) btn.addEventListener('click', () => scrollTop(0));
}


/* ---------- Horizontal photographic design gallery ---------- */

export function initDesignGallery() {
  document.querySelectorAll('.design-art-image').forEach((img) => {
    img.addEventListener('error', () => { img.hidden = true; }, { once: true });
  });
}
