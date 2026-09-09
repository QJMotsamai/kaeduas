// ==========================================================================
// KAEDUAS — Scroll & entrance choreography (GSAP + ScrollTrigger)
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

/** Hero entrance — called once the preloader lifts. */
export function heroIntro() {
  if (reduced) return;

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.fromTo('.hero-overline',
    { autoAlpha: 0, y: 14 },
    { autoAlpha: 1, y: 0, duration: 0.9 },
    0.15
  );

  tl.fromTo('.hero-title .line-inner',
    { yPercent: 112 },
    { yPercent: 0, duration: 1.35, stagger: 0.11 },
    0.1
  );

  tl.fromTo(['.hero-sub', '.hero-ctas'],
    { autoAlpha: 0, y: 26 },
    { autoAlpha: 1, y: 0, duration: 1.0, stagger: 0.12 },
    0.65
  );

  tl.fromTo('.hero-foot',
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 1.0 },
    0.9
  );
}

/** Everything driven by scroll position. */
export function initScrollAnims(webgl) {
  // Hero canvas reacts to scroll even if ScrollTrigger-only animations are off
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => webgl.setScroll(self.progress)
  });

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

  // Studio statement — words ignite as you scroll through (scrubbed)
  const statement = document.querySelector('.statement');
  if (statement) {
    const words = splitWords(statement);
    gsap.fromTo(words,
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.06,
        scrollTrigger: {
          trigger: statement,
          start: 'top 78%',
          end: 'bottom 42%',
          scrub: true
        }
      }
    );
  }

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

  // Slight skew on work cards with scroll velocity — the "reactive" feel
  const proxy = { skew: 0 };
  const skewSetters = gsap.utils.toArray('.work-media').map((el) => gsap.quickSetter(el, 'skewY', 'deg'));
  ScrollTrigger.create({
    trigger: '.work-list',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const skew = gsap.utils.clamp(-4, 4, self.getVelocity() / -350);
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {
          skew: 0,
          duration: 0.7,
          ease: 'power3',
          overwrite: true,
          onUpdate: () => skewSetters.forEach((set) => set(proxy.skew))
        });
      }
    }
  });
}
