/* eslint-disable */
/* global WebImporter */
/**
 * Parser for breadcrumb. Container block (resourceType block/v1/block,
 * filter "breadcrumb") with repeating "breadcrumb-item" items.
 * Source: https://www.admiral.com/magazine/guides/van-insurance/which-class-of-use
 *
 * The guide page has NO breadcrumb markup in the source DOM — the trail is an
 * authored navigation component in the target content model, not scraped
 * content. So this parser degrades gracefully:
 *   - If a real trail IS present (any common breadcrumb container/list of
 *     links), emit one breadcrumb-item row per link: label = link text,
 *     link = href.
 *   - Otherwise emit a single placeholder "Home" item so the block exists and
 *     is author-editable. Never fail / never leave an empty block table.
 *
 * breadcrumb-item model fields: label (text, col 1), link (aem-content, col 2).
 * xwalk field hints: field:label, field:link.
 * Generated: 2026-09-24
 */
export default function parse(element, { document }) {
  const hinted = (fieldName, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
    return frag;
  };

  const textOf = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  // Look for a real trail: links inside a breadcrumb-ish container, or an
  // ordered list of links. Selectors are mutually exclusive OR fallbacks.
  const container = element.matches?.('[class*="breadcrumb"], nav, ol, ul')
    ? element
    : element.querySelector('[class*="breadcrumb"], nav[aria-label*="readcrumb" i], ol.breadcrumb, ul.breadcrumb');

  let links = [];
  if (container) {
    links = Array.from(container.querySelectorAll('a[href]'))
      .filter((a) => textOf(a));
  }

  const cells = [];

  const pushItem = (labelText, href) => {
    const labelCell = labelText
      ? hinted('label', document.createTextNode(labelText))
      : '';
    let linkCell = '';
    if (href) {
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = href;
      linkCell = hinted('link', a);
    }
    cells.push([labelCell, linkCell]);
  };

  if (links.length) {
    links.forEach((a) => pushItem(textOf(a), a.getAttribute('href') || ''));
  } else {
    // No source trail — emit a single author-editable placeholder item.
    pushItem('Home', '/');
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells });
  element.replaceWith(block);
}
