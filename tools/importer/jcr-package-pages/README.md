# Admiral landing + guide pages — JCR content package

## Use: `admiral-pages-v1.zip`

Installable AEM content package for the four migrated pages (landing + guide
templates). Separate from the homepage package (`../jcr-package/`).

### Contents
- `/content/admiral/language-masters/en/black-box-insurance` (+ `/littlebox` child) — landing
- `/content/admiral/language-masters/en/resources/motor-hub/van-advice` — landing (hub)
- `/content/admiral/language-masters/en/magazine/guides/van-insurance/which-class-of-use` — guide
- `/content/admiral/templates/landing` and `/content/admiral/templates/guide` —
  **authoring template skeletons**: starter pages pre-populated with each
  template's block set. Authors copy one to create a new Landing / Guide page.
- `/content/dam/admiral/en/images` — dam:Asset images referenced by these pages
  (downloaded from the Admiral CDN + admiral.com and localized), including the
  LittleBox feature/step icons and the three "latest black box articles"
  thumbnails (re-sourced from Admiral's CDN after the original URLs 404'd).

### Blocks used
- New: comparison-table, article-body, breadcrumb, hero-cta, steps-list,
  feature-grid, media-panels, faq-list
- Reused: cards-article (now with a Style option: Default / Boxed), award-banner,
  accordion
- The black-box + littlebox landing heroes use `hero-cta` (background photo +
  navy copy box + stacked CTA buttons), not the homepage `hero-trust`.
- Coverage tables use `comparison-table` (navy label column + tick badges);
  numbered process rows use `steps-list`; icon feature tiles/rows use
  `feature-grid`. Full-width navy promo bands use the reusable `.section.navy`
  style variant.

### Install
Package Manager → upload `admiral-pages-v1.zip` → Install. Then **Reprocess
Assets** on `/content/dam/admiral/en/images` if any renditions are missing.

### Sources / regeneration
- Page JCR regenerated from `content/<path>.plain.html` via
  `tools/importer/html-to-jcr.mjs` (run `npm run build:json` first) into
  `migration-work/jcr-new/<name>.xml`.
- Image localization map: `migration-work/jcr-new/image-map.json`.
- Rebuild the tree + zip in one step:
  `node tools/importer/build-pages-package.mjs`
  (rewrites remote image URLs to `/content/dam/...`, stages any new local DAM
  binaries from `content/dam/admiral/en/images`, and rezips
  `admiral-pages-v1.zip`).
