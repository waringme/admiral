# Admiral JCR content package

## Use this one: `admiral-home-v1.6.zip`

Rebuilds the **app-download** section as a proper block-based component so the
JCR converter preserves both its variant identity and the two app-store badge
images. Earlier versions modelled it as a `columns` variant, which the md2jcr
columns partial could not represent — it dropped the `columns-app` class (so the
styling never applied) and flattened the badge image-links into empty buttons.

- `/content/admiral/language-masters/en` — home page (cq:Page, all sections;
  app-download now a block with an `App Download` container + `App Download
  Badge` items)
- `/content/admiral/language-masters/en/nav` and `/footer` — child pages
- `/content/dam/admiral/en/images` — dam:Asset images (icons + root images +
  app-store badges + article photos)

**Install:** Package Manager → upload `admiral-home-v1.6.zip` → Install (it
replaces the `en` page node), then **Reprocess Assets** on
`/content/dam/admiral/en/images` if any image renditions are missing.

### Superseded packages
- v1.5 — app-download as a `columns` variant (badges + variant class lost in JCR).
- v1.3 / v1.4 — full cq:Page nodes; earlier content revisions.
- v1.2 (jcr:content-only) — caused 404, `en` became a folder not a page.
- v1.1 — images as raw nt:file (DAM blank).
- v1.0 / admiral-nav-footer — earlier partials.

## Sources / regeneration
- `dam-assets-src/` — unpacked dam:Asset structure for the images.
- `tools/importer/html-to-jcr.mjs` regenerates the home JCR from
  `content/index.plain.html` (run `npm run build:json` first).
