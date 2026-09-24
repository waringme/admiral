# Article Body

Long-form magazine guide body for `/magazine/guides/*` pages. A thin
layout-containment wrapper that gives ordinary prose a contained reading-width
column with article typography.

## Authoring

Add an **Article Body** block and author the guide content into its **Body**
rich-text field — headings (H2/H3), paragraphs, bulleted/numbered lists, inline
images, tables, and inline CTA links all render with article styling.

## Rendering

Decorates by hoisting the authored prose directly into `.article-body` (max
760px, centred) and tagging any `<table>` with `article-body-table` for
readable, bordered/striped styling.
