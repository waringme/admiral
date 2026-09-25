# Admiral JCR content package

## Footer: `admiral-footer-v2.zip`

Footer-only package (the nav is not touched). Adds the "Explore our website"
band (heading + five link columns) above the social icons and legal copy, at
`/content/admiral/footer` (served as `/footer`, which every page loads) and
`/content/admiral/language-masters/en/footer`. Rebuild with
`node tools/importer/html-to-jcr.mjs content/footer.plain.html migration-work/jcr-new/footer.xml`
then `python3 tools/importer/build-footer-package.py`. Supersedes the footer in
`admiral-nav-footer-root.zip`.

## Use this one: `admiral-home-v1.9.zip`

Rebuilds the **fake-emails notice** as a proper block-based component named
`notice-banner` (was a `columns-notice` variant — md2jcr collapses any
`columns-*` block to plain `<columns>`, dropping the variant class, so the blue
rounded panel + person image never rendered on the published page). Renaming to
`notice-banner` (resourceType `block/v1/block`) keeps the variant so it renders
as `class="notice-banner"`. Its person image is now an author-editable `image`
field backed by a DAM asset
(`/content/dam/admiral/en/images/sub-hero-annie-foldedhands.png`), added here as
node + PNG binary.

Built on top of v1.8, which made the **award banner** badge an author-editable
image. The `award-banner` model has `image` + `imageAlt` fields (plus `text`);
the badge is a DAM asset
(`/content/dam/admiral/en/images/personal-finance-award-11.png`) instead of a
hard-coded CSS background, so authors can swap it in Universal Editor.

Built on top of v1.7, which rebuilt the **award banner** ("May the Best Motor
Insurer win…") as a proper block-based component named `award-banner`. It was
previously a `columns-award` variant, but the md2jcr columns partial forces any
block whose name starts with `columns` into a plain `<columns>` node — dropping
the `columns-award` class, so the award styling (and its badge image) never
attached on the published page. Renaming it to `award-banner` (resourceType
`block/v1/block`) makes the converter keep the variant, so it renders as
`class="award-banner"`. All DAM images from v1.6 are carried over unchanged.

Built on top of v1.6, which had rebuilt the **app-download** section as a proper
block-based component so the JCR converter preserves both its variant identity
and the two app-store badge images (earlier versions modelled it as a `columns`
variant, which the md2jcr columns partial could not represent — it dropped the
`columns-app` class and flattened the badge image-links into empty buttons).

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
