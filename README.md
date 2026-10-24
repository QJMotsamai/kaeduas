# Kaeduas — Creative Portfolio

A compact portfolio for **Qophe Junior Motsamai (QJ)**, a South African graphic designer and creative producer.

**Graphic design · Social content strategy · Generative video**

The practice is human-led: design, direction, photography and live-action production can work alongside generated imagery and hands-on editing.

## Run locally

```bash
npm install
npm run dev
npm run build
```

## Portfolio design assets and brand books

Five editable SVG studies in `public/design-work/` power the horizontal design rail. They are a connected fictional concept identity, ORUVI, and are clearly labelled as not a real product. The downloadable Kaeduas and ORUVI brand guides are in `public/downloads/`; the PDF generator is `scripts/create-guides.py` (requires ReportLab and Pillow). Rebuild the guides with `npm run render:design`, `python -m pip install -r requirements-design.txt`, then `python scripts/create-guides.py`.

The artwork and identity guides are portfolio concept work, not client commissions. ORUVI is fictional and would need its own name/claims and trademark checks before any commercial use.

## Deployment

The static site is built with Vite and can be deployed using the repository's existing GitHub Pages workflow.
