# Admiral JCR content package

## Use this one: `admiral-home-v1.3.zip`

Installs the home page, nav, footer as **full cq:Page nodes** (fixes the
"404 NO CONTENT / Cannot serve .../en.html" that v1.2 caused by installing
jcr:content only onto a non-existent page node), plus images as proper
**dam:Asset** nodes.

- `/content/admiral/language-masters/en` — home page (cq:Page, all 9 blocks)
- `/content/admiral/language-masters/en/nav` and `/footer` — child pages
- `/content/dam/admiral/en/images` — 6 dam:Asset images

**Install:** Package Manager → upload `admiral-home-v1.3.zip` → Install. It
replaces the `en` node, so it repairs the broken folder v1.2 may have created.

### Superseded packages
- v1.2 (jcr:content-only) — caused 404, `en` became a folder not a page.
- v1.1 — images as raw nt:file (DAM blank).
- v1.0 / admiral-nav-footer — earlier partials.

## Sources / regeneration
- `dam-assets-src/` — unpacked dam:Asset structure for the images.
- `index.xml` — generated home-page JCR (cq:Page form); `index-jcr-content.xml`
  is the jcr:content-only form used in v1.1/v1.2.
- `tools/importer/html-to-jcr.mjs` regenerates the home JCR from
  `content/index.plain.html` (run `npm run build:json` first).
