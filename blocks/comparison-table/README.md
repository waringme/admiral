# Comparison Table

Feature comparison grid for landing pages (e.g. black-box-insurance coverage /
LittleBox feature tables). A block-based component with repeating rows.

## Authoring

Add a **Comparison Table** block; add one **Comparison Row** item per feature:

| Comparison Table |            |
| ---------------- | ---------- |
| Motor Legal Expenses | Optional |
| Courtesy Car     | yes        |
| Personal Injury (up to £5,000) | yes |
| Replacement Locks | no        |

- **Feature** (label) — the row heading (left column).
- **Value** — either short rich text (`Optional`, `£5,000`) or a boolean token.
  Affirmative tokens (`yes`, `tick`, `included`, `true`, `✓`) render a green
  tick badge; negative tokens (`no`, `cross`, `not included`, `false`, `✗`, `—`)
  render a grey cross badge. Any other text is kept as-is in brand blue.

## Rendering

Decorates to a `<table class="comparison-table-grid">` with a `<th scope="row">`
feature label and a `<td>` value per row, zebra-striped, contained to 748px.
