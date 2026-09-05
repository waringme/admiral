/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-links. Base block: columns.
 * Source: https://www.admiral.com/ (#basic-19327)
 * xwalk columns block — no field hints (columns rule).
 * NOTE: the mapped element (#basic-19327) contains only empty <meta> tags; the
 * real "Explore our website" link lists live in a sibling <footer> .explore
 * section (nav#...exploreourwebsite > .page-links > .exploreCol[]). Each
 * .exploreCol becomes one column in the single content row.
 * Generated: 2026-09-05
 */
export default function parse(element, { document }) {
  // Locate the explore-links container. Prefer a sibling/document lookup since
  // the mapped element itself is empty.
  const container = document.querySelector(
    'nav[id*="exploreourwebsite"] .page-links, .explore .page-links, .page-links'
  );

  const cols = container
    ? Array.from(container.querySelectorAll(':scope > .exploreCol, .exploreCol'))
    : [];

  // Empty-block guard
  if (!cols.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Optional section heading (e.g. "Explore our website").
  const heading = document.querySelector('.explore > .wrapper > h2, section.explore h2:not(.visually-hidden)');

  // One content row: each exploreCol is a column cell holding its link list.
  const row = cols.map((col) => {
    const list = col.querySelector('ul') || col;
    return list;
  });

  const cells = [];
  if (heading) {
    // Full-width heading row padded to the column count so the table stays even.
    const headingRow = [heading];
    while (headingRow.length < row.length) headingRow.push('');
    cells.push(headingRow);
  }
  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-links', cells });
  element.replaceWith(block);
}
