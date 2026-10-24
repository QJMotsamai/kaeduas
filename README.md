# Kaeduas — Creative Portfolio

A concise portfolio for **Qophe Junior Motsamai (QJ)**, a South African graphic designer and creative producer.

**Graphic design · Social content strategy · Generative video**

The practice is human-led: design, direction, photography and live-action production can work alongside generated imagery and hands-on editing.

## Run locally

```bash
npm install
npm run dev
npm run build
```

## Portfolio work and brand-book samples

The design section pairs Kaeduas identity applications (studio apparel and a mailer mockup) with ORUVI, a clearly labelled self-initiated spec concept. The ORUVI photo-led horizontal rail covers digital, print, packaging, point-of-sale and retail activation. Product mockups are photographic concept applications, not client work or items for sale.

Generated photographic source scenes are kept in `scripts/assets/`; `npm run render:photo-art` applies exact brand typography and outputs the site-ready images into `public/design-work/`. Rebuild the two downloadable sample guides with `python -m pip install -r requirements-design.txt` followed by `python scripts/create-guides.py` (ReportLab and Pillow required).

The sample PDFs live in `public/downloads/`: the Kaeduas Creative Brand Guide and the ORUVI Spec Concept Brand Guide. ORUVI is not commissioned work; any commercial use would require name, formulation, claims and trademark clearance.

## Deployment

The static site is built with Vite and can be deployed using the repository's existing GitHub Pages workflow.
