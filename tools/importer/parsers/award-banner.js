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
 * The award badge (personal-finance-award-11) is a CSS background on the source
 * `.image` element (no <img>), so the parser synthesizes an <img> pointing at
 * the source badge URL — the admiral-dam-images transformer then maps it to the
 * packaged DAM path. Modelling it as an `image` field (not a hard-coded CSS
 * background) makes the badge author-editable.
 *
 * Fields: image, imageAlt, text. md2jcr lays out a block's container fields as
 * one field-group per ROW (single cell each, like hero-trust), so emit the
 * image on its own row and the text on the next. imageAlt collapses into the
 * image field (it rides on the <img> alt attribute).
 * Generated: 2026-09-07
 */
const BADGE_SRC = 'https://mktgblobpubaccess1.blob.core.windows.net/eui-frontend-assets/admiral/images/side-images/personal-finance-award-11@2x.png';

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

  // Award badge — existing <img> if any, else synthesize from the source URL.
  let badge = element.querySelector('.image img, img');
  if (!badge) {
    badge = document.createElement('img');
    badge.setAttribute('src', BADGE_SRC);
    badge.setAttribute('alt', 'Personal Finance Awards - Best Motor Insurer 2024/25');
  }

  const textNodes = [];
  if (heading) textNodes.push(heading);
  paragraphs.forEach((p) => textNodes.push(p));

  // One field-group per row (single cell each), matching how md2jcr lays out a
  // block's container fields (cf. hero-trust). Row 0 = image, row 1 = text.
  const cells = [
    [hinted('image', badge)],
    [textNodes.length ? hinted('text', ...textNodes) : hinted('text')],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'award-banner', cells });
  element.replaceWith(block);
}
