/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion. Vanilla accordion block (blocks/accordion/),
 * container block (resourceType block/v1/block, filter "accordion") with
 * repeating "accordion-item" items.
 * Source: https://www.admiral.com/black-box-insurance
 *
 * Library convention: 2-column table, first row = block name, each subsequent
 * row = one accordion item (title cell + content cell).
 *
 * The selector matches two distinct source DOM shapes; this parser runs once
 * per matched element and handles both:
 *   1. #basic-13192 .accordion — true accordion markup:
 *      <a.accordion__header><h3>summary</h3></a> + <div.accordion__panel> body.
 *      There can be multiple header/panel pairs inside one .accordion wrapper.
 *   2. #faqs-13193 .faqs — FAQ pods (matched via fallback below): each Q&A is
 *      <div.pod--faq><h3.js-toggle-content>question</h3><div.hide>answer</div>.
 *
 * accordion-item model fields: summary (text, col 1), text (richtext, col 2).
 * One item row per Q&A. xwalk field hints: field:summary, field:text.
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
  const richFrom = (el) => (el
    ? Array.from(el.childNodes)
      .map((n) => n.cloneNode(true))
      .filter((n) => (n.textContent || '').trim() || n.querySelector?.('img,a'))
    : []);

  // Collect { summaryText, bodyEl } pairs from whichever shape is present.
  const pairs = [];

  // Shape 1: true accordion — header anchors + following panels.
  const headers = Array.from(element.querySelectorAll(':scope a.accordion__header, a.accordion__header'));
  if (headers.length) {
    headers.forEach((header) => {
      const summaryEl = header.querySelector('h1, h2, h3, h4, h5') || header;
      // The panel is the next element sibling (accordion__panel); unwrap .container.
      let panel = header.nextElementSibling;
      while (panel && !panel.classList.contains('accordion__panel')) {
        panel = panel.nextElementSibling;
      }
      // Use the whole panel — its content may span several wrappers
      // (e.g. an empty .container followed by a reusable-block div), so a
      // single .container query would miss the real body.
      pairs.push({ summaryText: textOf(summaryEl), bodyEl: panel });
    });
  } else {
    // Shape 2: FAQ pods — question heading + .hide answer body.
    const pods = Array.from(element.querySelectorAll(':scope .pod--faq, .pod--faq'));
    pods.forEach((pod) => {
      const summaryEl = pod.querySelector('h1, h2, h3, h4, h5, .js-toggle-content');
      const bodyEl = pod.querySelector('.hide > div, .hide') || null;
      pairs.push({ summaryText: textOf(summaryEl), bodyEl });
    });
  }

  const cells = [];
  pairs.forEach(({ summaryText, bodyEl }) => {
    if (!summaryText && !bodyEl) return;
    const summaryCell = summaryText
      ? hinted('summary', document.createTextNode(summaryText))
      : '';
    const bodyNodes = richFrom(bodyEl);
    const textCell = bodyNodes.length ? hinted('text', ...bodyNodes) : hinted('text');
    cells.push([summaryCell, textCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
