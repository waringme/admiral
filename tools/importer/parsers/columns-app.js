/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-app. Base block: columns.
 * Source: https://www.admiral.com/ (#basic-10863)
 * xwalk columns block — 2 columns, 1 content row. No field hints (columns rule).
 * Col 1: app screenshot image. Col 2: heading + paragraph + app-store link buttons.
 * Generated: 2026-09-05
 */
export default function parse(element, { document }) {
  // Drop inline <style>/<script> (background-image CSS) — non-authorable.
  element.querySelectorAll('style, script').forEach((n) => n.remove());

  const copy = element.querySelector('.copy');

  // Column 1 image: the hero/screenshot img, not the app-store badge icons.
  const image = element.querySelector('.sub-hero-banner > .image img, .image img')
    || Array.from(element.querySelectorAll('img')).find((img) => !copy || !copy.contains(img))
    || null;

  const scope = copy || element;
  const heading = scope.querySelector('h1, h2, h3, h4');
  const paragraph = scope.querySelector('p');
  const appLinks = Array.from(scope.querySelectorAll('.app-icons a, a[href*="apps.apple"], a[href*="play.google"]'));

  // Empty-block guard
  if (!image && !heading && !paragraph) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Column 2 content (heading, paragraph, app-store links) as default content.
  const copyCell = [];
  if (heading) copyCell.push(heading);
  if (paragraph) copyCell.push(paragraph);
  appLinks.forEach((a) => copyCell.push(a));

  const cells = [
    [image || '', copyCell.length ? copyCell : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-app', cells });
  element.replaceWith(block);
}
