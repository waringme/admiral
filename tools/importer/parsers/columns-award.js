/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-award. Base block: columns.
 * Source: https://www.admiral.com/ (#reusable-block-16247)
 * xwalk columns block — 2 columns, 1 content row. No field hints (columns rule).
 * Col 1: award image. Col 2: heading + paragraph (default content).
 * Generated: 2026-09-05
 */
export default function parse(element, { document }) {
  // Drop inline <style>/<script> (background-image CSS) — non-authorable.
  element.querySelectorAll('style, script').forEach((n) => n.remove());

  const image = element.querySelector('.image img, img');

  const textWrap = element.querySelector('.text') || element;
  const heading = textWrap.querySelector('h1, h2, h3, h4');
  const paragraphs = Array.from(textWrap.querySelectorAll('p'));

  // Empty-block guard
  if (!image && !heading && !paragraphs.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const textCell = [];
  if (heading) textCell.push(heading);
  paragraphs.forEach((p) => textCell.push(p));

  const cells = [
    [image || '', textCell.length ? textCell : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-award', cells });
  element.replaceWith(block);
}
