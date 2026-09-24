# Steps List

Numbered process rows for admiral.com landing pages — e.g. "LittleBox in four
simple steps" and "How is LittleBox installed". Each step shows an
auto-generated circular number, a blue bold title, and a grey description.

## Authoring (Universal Editor)

Add a **Steps List** block, then add one or more **Steps List Step** items.
Each step has:

| Field | Type | Notes |
|-------|------|-------|
| Step Title | text | Short bold title (shown next to the number) |
| Step Text | rich text | Description shown in the right cell |

The step **number is generated automatically** from the item order — do not
type it into the title. Reorder items to renumber.

## Structure

```
Steps List
  Steps List Step   → title | text
  Steps List Step   → title | text
  ...
```

Rendered as an `<ol class="steps-list-items">`; each `<li>` is a two-column
grid (title cell with the number badge + description cell). Collapses to a
single column below 700px.

## Not this block

- Boolean coverage/spec tables with ticks → use **comparison-table**.
- Icon feature rows/grids → use **feature-grid**.
