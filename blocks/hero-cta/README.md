# Hero CTA

Full-bleed product-landing hero: a background photo with a navy copy box holding
an eyebrow label, a heading, and a stack of CTA buttons (green / blue / ghost).

## Authoring

Add a **Hero CTA** block. On the container set:
- **Background Image** — the hero photo (DAM asset).
- **Background Image Alt** — alt text.
- **Text** — the eyebrow (author as an H1) followed by the main heading (H2).

Then add one **Hero CTA Button** item per call-to-action:

| Hero CTA |  |  |
| -------- | -- | -- |
| Get a Quote | /bbQuoteStatus.php | primary |
| Retrieve a Quote | /bbQuoteStatus.php?r=t | secondary |
| Documents | /existing-customers/policy-documents.php | ghost |

- **Button Style** — `primary` (green), `secondary` (blue), `ghost` (outline), or `link` (light-blue text link with a circled arrow, e.g. "How does it work?" pointing at `#how-does-admiral-littlebox-work`).

## Rendering

Decorates to `.hero-cta` (full-bleed, background photo) containing a right-aligned
`.hero-cta-box` navy panel with the eyebrow (H1), heading (H2), and
`.hero-cta-actions` stack of styled buttons. Stacks below the photo on mobile.

## Sticky quote bar

Tick **Sticky quote bar** on the block to repeat the hero's primary button in a
translucent bar fixed to the top edge of the screen; the site header slides out
of view while it shows. It
fades in once the hero's own button has scrolled out of view and hides again
when the reader scrolls back up — matching admiral.com's sticky "Get a Quote"
bar. Both black box landing heroes have it switched on.
