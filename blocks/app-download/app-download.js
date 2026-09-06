/**
 * App Download — app-download promo panel (admiral.com "sub-hero-banner--admiral-app").
 *
 * Authored structure (container block + badge items):
 *   row 0                 — text: heading (h3) + subtitle paragraph
 *   row 1..n (2 cells)    — badge item: [ image ] [ store link ]
 *
 * Rendered layout:
 *   .app-download
 *     > .app-download-photo   (empty; app photo painted as CSS background)
 *     > .app-download-copy     (heading + subtitle + <a href><img badge></a> x N)
 *
 * A block-based component (not a "columns" variant) so the JCR converter keeps
 * the variant identity; each badge is modelled as an item (image + link) because
 * the converter can't keep an image-inside-a-link in a single cell.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Row 0 — the copy (heading + subtitle). Anything without an image is copy.
  const copy = document.createElement('div');
  copy.className = 'app-download-copy';

  const badges = document.createElement('p');
  badges.className = 'app-download-badges';

  rows.forEach((row) => {
    const cells = [...row.children];
    const img = row.querySelector('img');

    if (img) {
      // Badge item row: [image cell] [link cell]. Wrap the image in its link.
      const linkAnchor = cells[1] ? cells[1].querySelector('a') : null;
      const href = linkAnchor ? linkAnchor.getAttribute('href') : null;

      const badge = document.createElement('a');
      if (href) badge.href = href;
      badge.className = 'app-download-badge';
      const picture = img.closest('picture') || img;
      badge.appendChild(picture);
      badges.appendChild(badge);
    } else {
      // Copy row: move heading + paragraphs into the copy panel.
      const cell = cells[0] || row;
      while (cell.firstChild) copy.appendChild(cell.firstChild);
    }
  });

  if (badges.childNodes.length) copy.appendChild(badges);

  // Left panel: empty — the app photo is a CSS background.
  const photo = document.createElement('div');
  photo.className = 'app-download-photo';

  block.textContent = '';
  block.appendChild(photo);
  block.appendChild(copy);
}
