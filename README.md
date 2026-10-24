# Kaeduas — Creative Portfolio

A concise portfolio for **Qophe Junior Motsamai (QJ)**, a South African graphic designer and creative producer.

**Graphic design · Social content strategy · Generative video**

The practice is human-led: design, direction, photography and live-action production can work alongside generative imagery and hands-on editing.

## Run locally

```bash
npm install
npm run dev
npm run build
```

## Portfolio work and brand-book samples

Generative video is shown in its own section. Graphic design is grouped into five sideways-scroll categories: digital, print, packaging, point-of-sale and retail activation. Each category pairs a Kaeduas studio concept with ORUVI, a clearly labelled self-initiated spec concept. The graphic examples are typography-led; product photography is limited to the two application mockups for apparel/mailer and beverage packaging.

`npm run render:category-art` builds the eight typographic SVG studies and PDF preview files. `npm run render:photo-art` applies the exact identities to the two product mockup scenes in `scripts/assets/`. Rebuild the sample PDFs by running `python -m pip install -r requirements-design.txt` and then `python scripts/create-guides.py` after generating the category-art previews.

The downloadable samples in `public/downloads/` are the Kaeduas Creative Brand Guide and the ORUVI Spec Concept Brand Guide. ORUVI is not commissioned work; any commercial use would require name, formulation, claims and trademark clearance.

## Deployment

The static site is built with Vite and can be deployed using the repository's existing GitHub Pages workflow.
