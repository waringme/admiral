# Single Page Migration to AEM Edge Delivery Services — admiral.com Homepage

## Overview
Migrate the page at **https://www.admiral.com/** to AEM Edge Delivery Services with a **close visual match** to the original. Scope covers both **content** (sections, blocks, text, images, metadata) and **code** (block parsers/transformers, new block variants, CSS/JS, and the full design system). This plan spans scraping, structural analysis, block/content modeling, import infrastructure, content generation, design migration, and visual verification.

## Scope (confirmed)
- **Source:** `https://www.admiral.com/`
- **Content:** Page content + site header & footer as they appear on this page.
- **Code:** Import infrastructure (parsers/transformers), any new block variants, block CSS/JS, and the site design system.
- **Design fidelity:** Close visual match — extract computed styles from the source and visually verify against the original.

## Phases & Approach

### 1. Project setup & context
- Confirm project type (doc / da / xwalk) and the block library endpoint available for this project.
- Survey which existing EDS blocks are available to reuse before creating new ones.

### 2. Scrape & prepare the source page
- Scrape `https://www.admiral.com/`, extract metadata, download images, and produce cleaned HTML for analysis.

### 3. Analyze page structure
- Identify section boundaries and content sequences.
- Decide per sequence: default content vs. block.
- Match to existing blocks where possible; identify any new block variants needed.

### 4. Design system migration (code)
- Extract design tokens (colors, typography, spacing) from the source.
- Apply site-level styling and author per-block CSS/JS to match the original.

### 5. Build import infrastructure (code)
- Generate block parsers and page transformers.
- Assemble the import script from the page template + parsers + transformers.

### 6. Generate & import content
- Run the bundled import script to produce HTML content in the content directory (never hand-authored).
- Import the page.

### 7. Preview & visual verification
- Render the migrated page in preview.
- Compare against the original; iterate on block styling for a close visual match.

### 8. Header & footer
- Instrument navigation/header and footer as they appear on this page, matching the source.

## Checklist
- [ ] Determine project type and block library endpoint
- [ ] Survey available EDS blocks (block inventory)
- [ ] Scrape source page (metadata, images, cleaned HTML)
- [ ] Identify page structure (sections and content sequences)
- [ ] Perform authoring analysis (default content vs. blocks)
- [ ] Match sequences to existing blocks; define any new block variants
- [ ] Extract design tokens (colors, fonts, spacing) from source
- [ ] Apply site-level design styling
- [ ] Author/adjust per-block CSS & JS to match original
- [ ] Generate block parsers
- [ ] Generate page transformers
- [ ] Assemble import script (template + parsers + transformers)
- [ ] Run bundled import script to generate content
- [ ] Preview the imported page
- [ ] Visually compare migrated page vs. original and iterate to close match
- [ ] Instrument header/navigation
- [ ] Instrument footer
- [ ] Final full-page visual critique and fixes

## Notes
- Content HTML will be produced only via the project's bundled import script — not authored directly.
- Code work covers block variants, parsers/transformers, and the design system; design work extracts real computed styles from the source and verifies visually, per the close-match requirement.
- **Execution requires Execute mode.** Once you approve this plan and switch out of plan mode, I'll begin with project setup and scraping of `https://www.admiral.com/`.
