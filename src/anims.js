// ==========================================================================
// KAEDUAS — restrained entrance and scroll choreography
// ==========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Split an element's text into masked words, preserving <em>/<strong> children. */
function splitWords(el) {
  const process = (node) => {
    const kids = Array.from(node.childNodes);
    kids.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
          } else {
            const outer = document.createElement('span');
            outer.className = 'w';
            outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;';
            const inner = document.createElement('span');
            inner.className = 'wi';
            inner.style.cssText = 'display:inline-block;';
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        process(child);
      }
    });
  };
  process(el);
  return el.querySelectorAll('.wi');
}

/** Brief, restrained entrance for the opening copy. */
export function heroIntro() {
  if (reduced) return;
  gsap.fromTo('.hero-overline', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' });
  gsap.fromTo('.hero-title', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.05, ease: 'power2.out' });
  gsap.fromTo('.hero-side', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.18, ease: 'power2.out' });
}

/** Everything driven by scroll position. */
export function initScrollAnims() {
  if (reduced) return;

  // Section rules draw in
  gsap.utils.toArray('.head-rule').forEach((rule) => {
    gsap.fromTo(rule,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.3,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: rule, start: 'top 88%' }
      }
    );
  });

  // Section labels
  gsap.utils.toArray('.section-label').forEach((label) => {
    gsap.fromTo(label,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: label, start: 'top 88%' }
      }
    );
  });

  // Masked word reveals for big titles
  gsap.utils.toArray('.split-title, .contact-title').forEach((title) => {
    const words = splitWords(title);
    gsap.fromTo(words,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.05,
        scrollTrigger: { trigger: title, start: 'top 85%' }
      }
    );
  });

  // Generic fade-ups
  gsap.utils.toArray('.reveal-fade').forEach((el) => {
    gsap.fromTo(el,
      { autoAlpha: 0, y: 26 },
      {
        autoAlpha: 1, y: 0, duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      }
    );
  });

  // Work media — clip reveal + parallax drift
  gsap.utils.toArray('.parallax-media').forEach((media) => {
    const img = media.querySelector('img');
    gsap.fromTo(media,
      { clipPath: 'inset(14% 7% 14% 7% round 8px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 8px)',
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: media, start: 'top 82%' }
      }
    );
    if (img && !window.matchMedia('(hover: none)').matches) {
      gsap.fromTo(img,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: {
            trigger: media,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    }
  });

  // Footer wordmark rises
  gsap.fromTo('.foot-word',
    { yPercent: 45, autoAlpha: 0 },
    {
      yPercent: 0, autoAlpha: 1, duration: 1.3, ease: 'power3.out',
      scrollTrigger: { trigger: '.site-foot', start: 'top 92%' }
    }
  );

}
