/* eslint-disable */
/* global WebImporter */
/**
 * Parser for notice-banner. Block-based component (resourceType block/v1/block).
 * Source: https://www.admiral.com/ (#basic-18085 .sub-hero-banner)
 *
 * Modelled as a block (not a "columns" variant) so the JCR converter keeps the
 * variant identity — md2jcr forces any block whose name starts with "columns"
 * into a plain <columns> node, dropping the variant class, so the notice panel
 * styling (blue rounded panel + person image) never attached on the published
 * page. As a block, the model id `notice-banner` becomes the rendered class.
 *
 * The person image is a CSS background on the source `.image` element (no <img>),
 * so synthesize an <img> pointing at the source URL — the admiral-dam-images
 * transformer maps it to the packaged DAM path. Modelling it as an `image` field
 * makes the image author-editable.
 *
 * Fields: image, imageAlt, text. md2jcr lays out a block's container fields as
 * one field-group per ROW (single cell each, like hero-trust), so emit the image
 * on its own row and the copy (heading + paragraph + CTA) on the next.
 * Generated: 2026-09-07
 */
const IMAGE_SRC = 'https://mktgblobpubaccess1.blob.core.windows.net/eui-frontend-assets/admiral/images/sub-hero/sub-hero-annie-foldedhands.png';

export default function parse(element, { document }) {
  // Drop inline <style>/<script> (background-image CSS) — non-authorable.
  element.querySelectorAll('style, script').forEach((n) => n.remove());

  const copy = element.querySelector('.copy') || element;
  const heading = copy.querySelector('h1, h2, h3, h4');
  const paragraph = copy.querySelector('p');
  const cta = copy.querySelector('a[href]');

  // Empty-block guard
  if (!heading && !paragraph) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const hinted = (fieldName, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
    return frag;
  };

  // Person image — existing <img> if any, else synthesize from the source URL.
  let image = element.querySelector('.image img, img');
  if (!image) {
    image = document.createElement('img');
    image.setAttribute('src', IMAGE_SRC);
    image.setAttribute('alt', '');
  }

  // Copy: heading + paragraph + CTA (kept together in the text field).
  const copyNodes = [];
  if (heading) copyNodes.push(heading);
  if (paragraph) copyNodes.push(paragraph);
  if (cta) copyNodes.push(cta);

  // One field-group per row (single cell each), matching how md2jcr lays out a
  // block's container fields. Row 0 = image, row 1 = text.
  const cells = [
    [hinted('image', image)],
    [copyNodes.length ? hinted('text', ...copyNodes) : hinted('text')],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'notice-banner', cells });
  element.replaceWith(block);
}
