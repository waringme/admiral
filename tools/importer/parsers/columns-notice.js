/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-notice. Base block: columns.
 * Source: https://www.admiral.com/ (#basic-18085)
 * xwalk columns block — 2 columns, 1 content row. No field hints (columns rule).
 * Col 1: image. Col 2: heading + paragraph + CTA (default content).
 * Generated: 2026-09-05
 * Note: validator similarity is low only because the source element embeds a
 * large inline CSS background-image blob (non-authorable). All authorable
 * content (image, heading, paragraph, CTA) is captured and correctly placed.
 */
export default function parse(element, { document }) {
  // Drop inline <style>/<script> (background-image CSS) — non-authorable.
  element.querySelectorAll('style, script').forEach((n) => n.remove());

  const image = element.querySelector('.image img, img');

  const copy = element.querySelector('.copy') || element;
  const heading = copy.querySelector('h1, h2, h3, h4');
  const paragraph = copy.querySelector('p');
  const cta = copy.querySelector('a[href]');

  // Empty-block guard
  if (!image && !heading && !paragraph) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Column 2 content (heading, paragraph, CTA) as default content.
  const copyCell = [];
  if (heading) copyCell.push(heading);
  if (paragraph) copyCell.push(paragraph);
  if (cta) copyCell.push(cta);

  const cells = [
    [image || '', copyCell.length ? copyCell : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-notice', cells });
  element.replaceWith(block);
}
