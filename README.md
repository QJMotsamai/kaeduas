# KAEDUAS: Portfolio v2

The 3D portfolio of **Kaeduas**, the creative AI studio of **Qophe Junior Motsamai** (QJ).
Generative video · AI advertising · brand design · web systems.

Born in Bloemfontein. Working worldwide.

---

## Stack

- **Vite**: build tool, deploys to Cloudflare Pages as static files
- **Three.js**: the "Strata monolith", the Kaeduas mark rebuilt as four ember-lit 3D layers (procedural, zero downloaded assets)
- **GSAP + ScrollTrigger**: masked line reveals, scrubbed word ignition, clip-path media reveals, velocity skew
- **Lenis**: smooth inertial scrolling
- **Sharp**: renders `og-image.png`, the PWA icons and `favicon.ico` from SVG at build time (`npm run og`)

## Run it locally

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Hosting: GitHub Pages (primary, simplest)

The `deploy` branch holds the **pre-built site** (nothing to compile). To put it live:

1. Open **github.com/QJMotsamai/kaeduas** → **Settings** → **Pages** (left sidebar)
2. **Source:** *Deploy from a branch*
3. **Branch:** `deploy` → **Save**
4. ~1 minute later the site is live at `https://qjmotsamai.github.io/kaeduas/`

Every future push to `deploy` redeploys automatically. The build is path-agnostic
(relative `base: './'`), so it works from the `/kaeduas/` subpath or any domain root.
