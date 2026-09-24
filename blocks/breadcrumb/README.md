# Breadcrumb

Path trail for interior/guide pages. A block-based component with repeating
items. The source guide pages don't render a breadcrumb in markup, so this is an
author-maintained trail.

## Authoring

Add a **Breadcrumb** block; add one **Breadcrumb Item** per level:

| Breadcrumb |                                   |
| ---------- | --------------------------------- |
| Home       | /                                 |
| Magazine   | /magazine                         |
| Guides     | /magazine/guides                  |
| Which class of use |                           |

- **Label** — the visible text.
- **Link** — destination (omit on the last/current item; it renders as plain
  text with `aria-current="page"`).

## Rendering

Decorates to `<nav class="breadcrumb-nav"><ol>…</ol></nav>` with `›` separators;
non-final items are links, the final item is the current page.
