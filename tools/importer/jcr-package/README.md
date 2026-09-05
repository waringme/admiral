# Admiral JCR content packages

FileVault content packages for installing the migrated content into the AEM
author repository (xwalk / Universal Editor project).

## Packages

### `admiral-home.zip` (complete — use this)
Installs the **home page, nav, footer, and DAM images**:
- `/content/admiral/language-masters/en` — home page (9 blocks: hero-trust,
  cards-product, video-advert, columns-notice, cards-article, columns-award,
  carousel-review, columns-app, columns-links)
- `/content/admiral/language-masters/en/nav` — navigation
- `/content/admiral/language-masters/en/footer` — footer
- `/content/dam/admiral/en/images` — 6 assets (article photos, app-store
  badges, logo)

`filter.xml` scopes the install to `/content/admiral/language-masters/en` and
`/content/dam/admiral/en/images`.

### `admiral-nav-footer.zip` (nav + footer only)
Earlier package with just nav + footer, no home page or images. Superseded by
`admiral-home.zip`.

## Install
1. Open Package Manager on the author instance:
   `https://author-p147324-e2050468.adobeaemcloud.com/crx/packmgr`
2. **Upload Package** → select `admiral-home.zip`.
3. **Install**.

## Sources
- `jcr_root/` + `META-INF/` — unpacked vault sources for `admiral-home.zip`.
- `index.xml` — the generated home-page JCR (also at `jcr_root/.../en/.content.xml`).

## How the home-page JCR was generated
`tools/importer/html-to-jcr.mjs` runs `content/index.plain.html` through
helix-html2md → helix-md2jcr using the project's component-models.json /
component-definition.json / component-filters.json. Requires `npm run build:json`
first so all block models are registered.
