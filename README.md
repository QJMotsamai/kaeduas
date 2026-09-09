# KAEDUAS — Portfolio v2

The 3D portfolio of **Kaeduas**, the creative AI studio of **Qophe Junior Motsamai** (QJ).
Generative video · AI advertising · brand design · web systems.

Born in Bloemfontein. Working worldwide.

---

## Stack

- **Vite** — build tool, deploys to Cloudflare Pages as static files
- **Three.js** — the "Strata monolith": the Kaeduas mark rebuilt as four ember-lit 3D layers (procedural, zero downloaded assets)
- **GSAP + ScrollTrigger** — masked line reveals, scrubbed word ignition, clip-path media reveals, velocity skew
- **Lenis** — smooth inertial scrolling
- **Sharp** — renders `og-image.png` + PWA icons from SVG at build time (`npm run og`)

## Run it locally

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Deploy to Cloudflare Pages (step by step)

1. **Push this repo to GitHub** — it lives at `github.com/QJMotsamai/kaeduas`.
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → sign up / log in.
3. **Create a project** → *Connect to Git* → authorise GitHub → pick the `kaeduas` repo.
4. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
5. **Save and deploy.** First build takes about a minute. You get `kaeduas.pages.dev`.
6. **Custom domain**: project → *Custom domains* → set `kaeduas.is-a.dev`
   (do this *after* the is-a.dev pull request below is merged — Cloudflare verifies ownership
   by the DNS record the PR creates).

## Register kaeduas.is-a.dev (step by step)

1. Fork [is-a-dev/register](https://github.com/is-a-dev/register).
2. In your fork, add a new file: `domains/kaeduas.json`:

   ```json
   {
     "owner": {
       "username": "QJMotsamai",
       "email": "motsamai.main@gmail.com"
     },
     "record": {
       "CNAME": "kaeduas.pages.dev"
     }
   }
   ```

   *(Use the `*.pages.dev` URL Cloudflare gave you in the deploy step.)*
3. Open a pull request to `is-a-dev/register` with the title `Register kaeduas`.
4. Checks must pass; a maintainer merges it (usually within a day or two).
5. Back in Cloudflare → *Custom domains* → add `kaeduas.is-a.dev`. Done.

## Where things live

```
index.html          all content + JSON-LD schema (Person, ProfessionalService, FAQ, VideoObject)
src/styles.css      design system — ink #0A0A0B, ember #D9612F, Archivo/Instrument Serif/Inter/JetBrains Mono
src/webgl.js        Three.js strata monolith (lazy-loaded chunk)
src/anims.js        GSAP choreography
src/ui.js           cursor, magnetics, menu, YouTube facades, SAST clock
scripts/og.mjs      renders the OG card + icons from SVG
public/             static files copied verbatim (favicon, icons, og-image, robots, sitemap, _headers)
```

## Editing content

- **Videos:** each work card in `index.html` carries a YouTube id in two places
  (`<article data-video="…">` and the facade `<button data-video="…">`) plus the thumbnail URL on the `<img>`.
- **Copy:** everything is plain HTML in `index.html` — no CMS, no build-time magic.
- **Brand assets:** edit `scripts/og.mjs`, run `npm run og`.

## Performance & accessability notes

- Three.js is a separate lazy chunk; the page shell is ~54 KB gzip and paints behind the preloader.
- YouTube videos load only on click (privacy-friendly `youtube-nocookie` embeds).
- `prefers-reduced-motion` disables the preloader, smooth scroll, WebGL loop and all reveals.
- Keyboard reachable throughout; visible focus rings; skip link to the work.
