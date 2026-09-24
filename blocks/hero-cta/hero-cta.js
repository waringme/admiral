/**
 * Hero CTA — full-bleed hero with a background photo and a navy copy box holding
 * an eyebrow label, heading, and a stack of CTA buttons (admiral.com product
 * landing hero, e.g. black-box-insurance / littlebox).
 *
 * A block-based component (block/v1/block). Authored structure (post-decorate)
 * — the container fields are one-per-row, then each CTA item is its own row:
 *   image row  — single cell: [ background <picture> ]
 *   text row   — single cell: [ eyebrow (h1) + heading (h2) (+ paragraphs) ]
 *   CTA row(s) — three cells: [ label ][ link ][ style ]
 * The container's `image` is a decorative background; `text` holds the eyebrow +
 * heading; each item is a button with a style (primary/secondary/ghost).
 * Rows are classified by content, not position (md2jcr emits container fields as
 * separate one-cell rows, so positions are not fixed).
 *
 * Rendered layout:
 *   .hero-cta                (full-bleed; background photo painted from the image)
 *     > .hero-cta-box        (navy panel, right-aligned)
 *         > eyebrow, heading, .hero-cta-actions > a.hero-cta-button-{style} x N
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  let bgImg = null;
  const box = document.createElement('div');
  box.className = 'hero-cta-box';
  const actions = document.createElement('div');
  actions.className = 'hero-cta-actions';

  rows.forEach((row) => {
    const cells = [...row.children];
    const pic = row.querySelector('picture, img');
    // A heading, or a paragraph that carries text (not just the wrapped picture).
    const hasText = !!row.querySelector('h1, h2, h3, h4')
      || [...row.querySelectorAll('p')].some((p) => p.textContent.trim() && !p.querySelector('picture, img'));

    // CTA button row: three cells (label / link / style), no image or heading.
    if (cells.length >= 3 && !pic) {
      const label = (cells[0]?.textContent || '').trim();
      if (!label) return;
      const linkCell = cells[1];
      const href = linkCell ? (linkCell.querySelector('a')?.getAttribute('href')
        || (linkCell.textContent || '').trim()) : '';
      const style = (cells[2]?.textContent || 'primary').trim().toLowerCase();
      const a = document.createElement('a');
      a.className = `hero-cta-button hero-cta-button-${style || 'primary'}`;
      if (href) a.href = href;
      a.textContent = label;
      actions.appendChild(a);
      return;
    }

    // Background image row: a picture with no accompanying heading/paragraph.
    if (pic && !hasText) {
      bgImg = pic.querySelector('img') || pic;
      return;
    }

    // Text row: eyebrow + heading (+ any paragraphs). Move its content into box.
    const cell = cells[0] || row;
    while (cell.firstChild) box.appendChild(cell.firstChild);
  });

  if (actions.childNodes.length) box.appendChild(actions);

  // Background image element (kept in the DOM for LCP/responsive; CSS covers it).
  const bg = document.createElement('div');
  bg.className = 'hero-cta-bg';
  if (bgImg) {
    const picture = bgImg.closest('picture') || bgImg;
    bg.appendChild(picture);
  }

  block.textContent = '';
  block.appendChild(bg);
  block.appendChild(box);

  // Sticky quote bar (block option "sticky"): once the hero has scrolled out of
  // view, repeat the primary button in a translucent bar fixed at the top of the
  // viewport, over the site header (source: .sticky-button).
  const primary = actions.querySelector('.hero-cta-button-primary') || actions.firstElementChild;
  if (block.classList.contains('sticky') && primary) {
    const bar = document.createElement('div');
    bar.className = 'hero-cta-sticky';
    bar.setAttribute('aria-hidden', 'true');
    const cta = primary.cloneNode(true);
    cta.className = 'hero-cta-sticky-button';
    cta.tabIndex = -1;
    bar.appendChild(cta);
    document.body.appendChild(bar);

    // Header height (offsetHeight ignores the slide-away transform, so the
    // threshold stays stable while the header is hidden — no flicker).
    const headerBottom = () => {
      const header = document.querySelector('header .nav-wrapper');
      return header ? header.offsetHeight : 0;
    };
    const setVisible = (visible) => {
      bar.classList.toggle('is-visible', visible);
      // Like the source (whose header has scrolled away), slide the fixed site
      // header out of view while the bar is showing.
      document.body.classList.toggle('hero-cta-sticky-active', visible);
      bar.setAttribute('aria-hidden', visible ? 'false' : 'true');
      cta.tabIndex = visible ? 0 : -1;
    };
    // Show once the hero's own primary button has scrolled up under the header
    // (i.e. the reader can no longer reach it); hide again when it returns.
    let visible = false;
    const update = () => {
      const next = primary.getBoundingClientRect().bottom < headerBottom();
      if (next !== visible) {
        visible = next;
        setVisible(visible);
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }
}
