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

## Hosting — GitHub Pages (primary, simplest)

The `deploy` branch holds the **pre-built site** (nothing to compile). To put it live:

1. Open **github.com/QJMotsamai/kaeduas** → **Settings** → **Pages** (left sidebar)
2. **Source:** *Deploy from a branch*
3. **Branch:** `deploy` → **Save**
4. ~1 minute later the site is live at `https://qjmotsamai.github.io/kaeduas/`

Every future push to `deploy` redeploys automatically. The build is path-agnostic
(relative `base: './'`), so it works from the `/kaeduas/` subpath or any domain root.

## Custom domain — kaeduas.is-a.dev (after Pages is live)

1. Fork [is-a-dev/register](https://github.com/is-a-dev/register).
2. Add `domains/kaeduas.json` in your fork:

   ```json
   {
     "owner": {
       "username": "QJMotsamai",
       "email": "motsamai.main@gmail.com"
     },
     "record": {
       "CNAME": "qjmotsamai.github.io"
     }
   }
   ```
3. Open a pull request titled `Register kaeduas` and wait for the merge.
4. In the kaeduas repo → **Settings → Pages → Custom domain** → `kaeduas.is-a.dev` → wait for the DNS check → **Enforce HTTPS**.
5. **Domain flip (SEO):** once the domain resolves, update every
   `https://qjmotsamai.github.io/kaeduas/` reference in `index.html`,
   `public/robots.txt`, `public/sitemap.xml` and `public/llms.txt` to
   `https://kaeduas.is-a.dev/` and redeploy — canonical and structured data
   must always match the serving domain.

## SEO / GEO launch checklist

Done in the build:

- ✅ Canonical + OG/Twitter cards, absolute URLs matching the live domain
- ✅ JSON-LD graph: Person (birth date/place, sameAs → all 6 profiles), ProfessionalService, WebSite, VideoObject ×5, FAQPage
- ✅ Exactly one H1, logical H2/H3 outline; every image has alt text
- ✅ geo.region / geo.position meta (Bloemfontein, ZA) + city in copy
- ✅ robots.txt explicitly allows Googlebot, Bingbot **and** AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended)
- ✅ `llms.txt` at the root — structured facts for AI assistants to quote
- ✅ `sitemap.xml`, `robots.txt`, security `_headers`, path-agnostic build
- ✅ Bing IndexNow key file at the root (key: see `public/*.txt`)

Do once, by hand (10 minutes, free):

1. **Google Search Console** — [search.google.com/search-console](https://search.google.com/search-console) → add property `qjmotsamai.github.io/kaeduas` (URL-prefix type) → verify via the HTML-tag method (paste the meta tag into `index.html` `<head>`, tell me, I redeploy) → submit `sitemap.xml`.
2. **Bing Webmaster Tools** — [bing.com/webmasters](https://www.bing.com/webmasters) → **Import from Google Search Console** (fastest) → submit the sitemap there too.
3. After the is-a.dev merge: do the domain flip above, then re-submit the sitemap in both consoles and update the Pages custom domain.

## Alternative — Cloudflare Pages (optional)

Only needed if you later want `kaeduas.pages.dev` in front. Create a **Pages**
(not Workers) project, connect the repo, set the production branch to `deploy`
with **no build command** and output `/` — or point it at
`arena/01a0860a-kaeduas` with `npm run build` → `dist`. Note: the quick
"Deploy" button on the Workers screen does **not** run builds and always grabs
`main` — avoid it.

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
