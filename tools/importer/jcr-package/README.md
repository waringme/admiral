# Admiral JCR content package

FileVault content package to install the migrated home page, nav, footer, and
images into AEM author (xwalk / Universal Editor project).

## Use this one: `admiral-home-v1.2.zip`

All fixes combined:
- **Home content** installs at `/content/admiral/language-masters/en/jcr:content`
  **only** (`_jcr_content.xml` + a `jcr:content`-scoped filter), preserving the
  existing `en` site-root page node so the page stays **editable in Universal
  Editor**. (The `en` node maps to `/`.)
- **All 9 blocks** convert correctly (hero-trust, cards-product, video-advert,
  columns-notice, cards-article, columns-award, carousel-review, columns-app,
  columns-links).
- **nav** and **footer** install as child pages.
- **Images** install as proper **`dam:Asset`** nodes (asset + `_jcr_content/
  renditions/original` + `nt:file` wrapper), so they show in the DAM and
  resolve on the page — at `/content/dam/admiral/en/images`.

Filter scopes: `.../en/jcr:content`, `.../en/nav`, `.../en/footer`,
`/content/dam/admiral/en/images`.

## Install
1. `https://author-p147324-e2050468.adobeaemcloud.com/crx/packmgr`
2. **Upload Package** → `admiral-home-v1.2.zip` → **Install**
3. Reopen the `en` page in Universal Editor; check the images in the DAM.

## Older packages (superseded)
- `admiral-home-v1.1.zip` — jcr:content-only home, but images as raw nt:file (DAM blank).
- `admiral-home.zip` — v1.0, replaced whole `en` page node (made it read-only).
- `admiral-nav-footer.zip` — nav + footer only.

## Sources / regeneration
- `dam-assets-src/` — unpacked dam:Asset structure for the images.
- `index.xml` — generated home-page JCR (cq:Page form); `index-jcr-content.xml`
  is the jcr:content-only form used in v1.1/v1.2.
- `tools/importer/html-to-jcr.mjs` regenerates the home JCR from
  `content/index.plain.html` (run `npm run build:json` first).
