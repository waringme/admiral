# Admiral landing + guide pages — JCR content package

## Use: `admiral-pages-v1.zip`

Installable AEM content package for the four migrated pages (landing + guide
templates). Separate from the homepage package (`../jcr-package/`).

### Contents
- `/content/admiral/language-masters/en/black-box-insurance` (+ `/littlebox` child) — landing
- `/content/admiral/language-masters/en/resources/motor-hub/van-advice` — landing (hub)
- `/content/admiral/language-masters/en/magazine/guides/van-insurance/which-class-of-use` — guide
- `/content/dam/admiral/en/images` — 47 dam:Asset images referenced by these pages
  (downloaded from the Admiral CDN + admiral.com and localized). Three dead
  source thumbnails (404 at source) remain as external URLs in the black-box
  page and were not localized.

### Blocks used
- New: comparison-table, article-body, breadcrumb
- Reused: hero-trust, cards-product, cards-article, award-banner, accordion

### Install
Package Manager → upload `admiral-pages-v1.zip` → Install. Then **Reprocess
Assets** on `/content/dam/admiral/en/images` if any renditions are missing.

### Sources / regeneration
- Page JCR regenerated from `content/<path>.plain.html` via
  `tools/importer/html-to-jcr.mjs` (run `npm run build:json` first).
- Image localization map: `migration-work/jcr-new/image-map.json`.
- Rebuild the tree + zip with the packaging step in the migration flow.
