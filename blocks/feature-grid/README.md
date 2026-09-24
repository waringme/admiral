# Feature Grid

Icon feature items for admiral.com landing pages. One block, two automatic
layouts:

- **Tile grid** — centered icon + title tiles, used when no item has a
  description (e.g. "What does LittleBox measure?": Speeding / When you drive /
  Smoothness / Cornering).
- **Feature rows** — bordered rows with an icon + bold blue title on the left
  and a description on the right, used when any item has a description (e.g.
  "Why LittleBox could be your best black box cover", "How do I get my
  feedback?").

The layout is chosen automatically from the content — you don't pick it.

## Authoring (Universal Editor)

Add a **Feature Grid** block, then use **Add** on the block to add **Feature Row** items. Select a row to edit its properties:

| Field | Type | Notes |
|-------|------|-------|
| Image | reference | Icon image (set its alt text on the image itself) |
| Feature Title | text | Bold blue title |
| Feature Text | rich text | Optional. Leave blank on every item for the tile grid; fill it in to get the bordered rows layout |

## Structure

```
Feature Grid
  Feature Row   → image | title | text
  ...
```

## Not this block

- Numbered how-it-works steps → use **steps-list**.
- Boolean coverage/spec tables with ticks → use **comparison-table**.
