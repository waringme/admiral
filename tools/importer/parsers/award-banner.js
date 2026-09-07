/* eslint-disable */
/* global WebImporter */
/**
 * Parser for award-banner. Block-based component (resourceType block/v1/block).
 * Source: https://www.admiral.com/ (#reusable-block-16247)
 *
 * Modelled as a block (not a "columns" variant) so the JCR converter keeps the
 * variant identity — the core columns component always emits the base
 * `class="columns"` and drops the variant, so the award styling (and its badge)
 * never attached on the published page. As a block, the model id `award-banner`
 * becomes the rendered block class.
 *
 * The award badge (personal-finance-award-11) is a decorative CSS background
 * painted by award-banner.css, so it is NOT authored content — the block holds
 * only the copy (heading + paragraph) in a single `text` field.
 * Generated: 2026-09-07
 */
export default function parse(element, { document }) {
  // Drop inline <style>/<script> (background-image CSS) — non-authorable.
  element.querySelectorAll('style, script').forEach((n) => n.remove());

  const textWrap = element.querySelector('.text') || element;
  const heading = textWrap.querySelector('h1, h2, h3, h4');
  const paragraphs = Array.from(textWrap.querySelectorAll('p'));

  // Empty-block guard
  if (!heading && !paragraphs.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const hinted = (fieldName, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
    return frag;
  };

  const textNodes = [];
  if (heading) textNodes.push(heading);
  paragraphs.forEach((p) => textNodes.push(p));

  const cells = [
    [textNodes.length ? hinted('text', ...textNodes) : hinted('text')],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'award-banner', cells });
  element.replaceWith(block);
}
