/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-product. Base block: cards (container).
 * Source: https://www.admiral.com/ (#basic-18119 .product-grid)
 * xwalk container block — one row per card, 2 columns: image cell, text cell.
 * card model fields: image (col 1), text (col 2).
 * Generated: 2026-09-05
 */
export default function parse(element, { document }) {
  // Each product tile is an <a> linking to a product page, containing an icon
  // image and a text label. (selectors validated against source.html)
  const items = Array.from(element.querySelectorAll(':scope > a.product-grid__item, a.product-grid__item, .product-grid__item'));

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
    const href = item.getAttribute('href') || '';
    const icon = item.querySelector('.product-grid__icon img, img');
    const labelEl = item.querySelector('.product-grid__text, span');
    const labelText = labelEl ? labelEl.textContent.trim() : item.textContent.trim();

    // Image cell (icon). May be empty but must still be present.
    const imageCell = icon ? hinted('image', icon) : '';

    // Text cell: the card is a link, so render the label as a linked heading.
    const textFrag = document.createDocumentFragment();
    if (labelText) {
      const link = document.createElement('a');
      if (href) link.setAttribute('href', href);
      link.textContent = labelText;
      textFrag.appendChild(link);
    }
    const textCell = textFrag.childNodes.length ? hinted('text', textFrag) : '';

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
