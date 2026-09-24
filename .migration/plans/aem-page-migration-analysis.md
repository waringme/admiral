I need to know which pages you want to migrate before I can analyze them and propose a template approach. Let me gather the essentials.# Multi-Page Migration to AEM Edge Delivery — Analysis & Template Plan

## Objective

Migrate a handful (2–10) of admiral.com pages to AEM Edge Delivery Services (the existing xwalk/Universal Editor project). Start with an **analysis-first pass** to group the pages into reusable **page-type templates**, then produce and execute a **full end-to-end migration plan** (infrastructure → import → design → publish).

This builds on the existing project (homepage already migrated) — reusing its blocks, design tokens, header/footer, and JCR packaging conventions wherever the new pages overlap.

## Inputs still needed

- ⏳ **The page URL list.** You selected "Paste URL list" but haven't pasted them yet. Please paste the 2–10 page URLs you want migrated. I'll begin analysis as soon as they're provided.

Confirmed so far:
- **Source:** explicit URL list (to be pasted)
- **Goal:** full migration plan (templates + build + publish)
- **Scale:** a handful (2–10 pages), analyzed individually in depth

## Phase 1 — Analysis (read-only, no changes)

- [ ] Receive the URL list from you
- [ ] Scrape each page (content, metadata, images, cleaned HTML) — with bot-protection fallback if needed
- [ ] For each page: identify section structure, content sequences, and candidate block types
- [ ] Compare pages against each other to detect shared structure
- [ ] Compare against **existing homepage blocks** (hero, cards, columns variants, carousel, app-download, nav, footer) to maximize reuse
- [ ] Produce a per-page structural summary + a cross-page similarity matrix

## Phase 2 — Template proposal (decision point)

- [ ] Group the pages into candidate templates (e.g. "product/insurance page", "hub/resource page", "article page")
- [ ] For each template: list its sections, required blocks (reused vs new), and which pages map to it
- [ ] Flag any pages that are one-offs (don't fit a template)
- [ ] Recommend which templates to build and in what order
- [ ] **Review the proposal with you and get sign-off before building**

## Phase 3 — Infrastructure (per approved template)

- [ ] Identify/confirm block variants needed; reuse existing blocks where possible
- [ ] Generate any new block code (JS/CSS) + `_block.json` models; run `npm run build:json`
- [ ] Generate import parsers + page transformers for each template
- [ ] Generate the `import-<template>.js` script(s) with embedded page-template config
- [ ] Model new blocks as block-based components (avoid the `columns-*` naming pitfall that strips variant classes in JCR)

## Phase 4 — Content import

- [ ] Bundle and run the bulk import per template (`run-bulk-import.js`)
- [ ] Verify parsed `content/*.plain.html` for each page (structure, field hints, images → DAM)
- [ ] Run import validation; drill into any page below the completeness threshold and fix parsers → re-import

## Phase 5 — Design & verification

- [ ] Apply/extend block styling to match the source pages (reuse site design tokens)
- [ ] Preview locally and compare each migrated page against its original (visual critique)
- [ ] Iterate on flagged blocks/sections until visually faithful

## Phase 6 — Package, publish, verify

- [ ] Generate JCR content XML per page; stage DAM assets; build/refresh the CRX package(s)
- [ ] Commit and push code (deploys via code bus)
- [ ] Install the JCR package in AEM Package Manager *(manual — injected credentials can't install)*
- [ ] Publish pages (preview + live) *(requires the Adobe-credentials publish opt-in in Settings → LLM Permissions)*
- [ ] Verify each page renders correctly on the published site

## Constraints & notes

- **Execution requires Execute mode** — this plan is read-only. Once you approve, switch to Execute mode to begin Phase 1.
- Two steps are **gated on you**: AEM Package Manager install, and the publish opt-in. I'll flag these when reached.
- I won't proceed past the **Phase 2 sign-off** without your approval of the template groupings.

## Checklist (summary)

- [ ] **You:** paste the 2–10 page URLs
- [ ] Phase 1 — analyze each page's structure (read-only)
- [ ] Phase 2 — propose templates + get your sign-off
- [ ] Phase 3 — build infrastructure (blocks, parsers, import scripts)
- [ ] Phase 4 — import content + validate
- [ ] Phase 5 — design match + visual critique
- [ ] Phase 6 — package, install, publish, verify
- [ ] Switch to **Execute mode** to begin
