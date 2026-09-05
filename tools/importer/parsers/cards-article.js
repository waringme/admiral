/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base block: cards (container).
 * Source: https://www.admiral.com/ (#product-pods-5856 .grid)
 * xwalk container block — one row per card, 2 columns: image cell, text cell.
 * card model fields: image (col 1), text (col 2: heading + description + CTA).
 * Generated: 2026-09-05
 */
export default function parse(element, { document }) {
  // Each article card is a .pod inside a grid cell. (validated against source.html)
  let items = Array.from(element.querySelectorAll('.pod, .grid__cell .pod'));
  if (!items.length) {
    items = Array.from(element.querySelectorAll(':scope > .grid__cell, .grid__cell'));
  }

  // Empty-block guard
  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const hinted = (fieldName, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
    return frag;
  };

  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.image img, img');
    const heading = item.querySelector('h1, h2, h3, h4');
    const description = item.querySelector('p');
    const cta = item.querySelector('a[href]');

    // Image cell (may be empty but must exist).
    const imageCell = img ? hinted('image', img) : '';

    // Text cell: heading + description + CTA as rich text.
    const textNodes = [];
    if (heading) textNodes.push(heading);
    if (description) textNodes.push(description);
    if (cta) textNodes.push(cta);
    const textCell = textNodes.length ? hinted('text', ...textNodes) : '';

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
