/* eslint-disable */
/* global WebImporter */
/**
 * Parser for article-body. Block-based component (resourceType block/v1/block,
 * model article-body) with a single richtext "text" field.
 * Source: https://www.admiral.com/magazine/guides/van-insurance/which-class-of-use
 *   (#block-admiral-annie-content > .magazine-story > .magazine-story__body)
 *
 * The long-form body is the .story region (featured image + prose: headings,
 * paragraphs, lists, inline images/links). Surrounding chrome is stripped:
 *   - .fixed-content  — the "Article contents" table-of-contents sidebar
 *   - .story__meta    — author avatar, byline, date, reading time
 *   - .story__share / .story__social — social share icon rows
 *   - empty .story__introduction heading placeholder
 *
 * Simple block: one cell holding the whole body as richtext.
 * xwalk field hint: field:text.
 * Generated: 2026-09-24
 */
export default function parse(element, { document }) {
  const hinted = (fieldName, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
    return frag;
  };

  // Prefer the prose container; fall back to the whole body element.
  const source = element.querySelector('.story') || element;
  const body = source.cloneNode(true);

  // Strip non-prose chrome.
  body.querySelectorAll(
    '.fixed-content, .story__meta, .story__share, .story__social, .magazine-story__meta-avatar, script, style',
  ).forEach((n) => n.remove());

  // Drop empty placeholder headings (e.g. <h2 class="story__introduction"></h2>).
  body.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    if (!h.textContent.trim() && !h.querySelector('img')) h.remove();
  });

  // Emit the remaining block-level content, skipping now-empty wrappers.
  const nodes = Array.from(body.childNodes).filter((n) => {
    if (n.nodeType === 3) return n.textContent.trim().length > 0; // text node
    return (n.textContent || '').trim().length > 0 || n.querySelector?.('img');
  });

  // Empty-block guard.
  if (!nodes.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[hinted('text', ...nodes)]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'article-body', cells });
  element.replaceWith(block);
}
