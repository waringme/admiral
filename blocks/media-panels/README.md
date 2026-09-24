# Media Panels

Horizontal image-left / text-right product panels for admiral.com landing
pages — e.g. "Our black box insurance products" (LittleBox / LittleBox Plug and
Drive / LittleBox Pod). Each panel shows a wide photo on the left with a blue
title and grey description on the right; panels stack vertically.

## Authoring (Universal Editor)

Add a **Media Panels** block, then add one or more **Media Panel** items:

| Field | Type | Notes |
|-------|------|-------|
| Image | reference | Panel photo (set its alt text on the image) |
| Panel Title | text | Blue bold title |
| Panel Text | rich text | Description (links allowed) |

## Structure

```
Media Panels
  Media Panel   → image | title | text
  ...
```

Rendered as a `<ul class="media-panels-items">`; each panel is a two-column
grid (photo + body) that collapses to a single column below 700px.

## Not this block

- Icon feature tiles/rows → use **feature-grid**.
- 3-up article/magazine card grids → use **cards-article**.
- Numbered how-it-works steps → use **steps-list**.
