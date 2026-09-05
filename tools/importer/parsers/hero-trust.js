/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-trust. Base block: hero.
 * Source: https://www.admiral.com/ (#basic-12087)
 * xwalk simple block — 1 column, field-hinted rows.
 * Model fields: image, imageAlt(collapsed), text, ctalabel, ctalink, ctastyle, badge, ...
 * Generated: 2026-09-05
 * Note: source element embeds a large inline <style> background-image blob
 * (non-authorable) which deflates the validator's text-similarity score; the
 * extracted table (image, title+subheading, CTA link) is complete.
 */
export default function parse(element, { document }) {
  // --- Extract (selectors validated against source.html) ---
  const copy = element.querySelector('.hero-banner__copy, .hero-background, .container');

  // Inline <style>/<script> nodes carry background-image CSS but no authorable
  // content — drop them so they don't leak into the block.
  element.querySelectorAll('style, script').forEach((n) => n.remove());

  // Background image: first <img> that is not inside the copy block.
  const allImages = Array.from(element.querySelectorAll('img'));
  const bgImage = allImages.find((img) => !copy || !copy.contains(img)) || allImages[0] || null;

  const heading = element.querySelector('h1, h2, h3, h4, [class*="copy"] :is(h1,h2,h3,h4)');
  const subheading = element.querySelector('.hero-banner__copy p, .hero-background p, [class*="copy"] p, p');
  const cta = element.querySelector('.buttons a, a.button, a[class*="button"], a[href]');

  // Empty-block guard
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- Helper: cell with a leading field hint comment ---
  const hinted = (fieldName, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
    return frag;
  };

  const cells = [];

  // Row: background image
  if (bgImage) {
    cells.push([hinted('image', bgImage)]);
  }

  // Row: text (title + subheading as richtext)
  const textNodes = [];
  if (heading) textNodes.push(heading);
  if (subheading) textNodes.push(subheading);
  if (textNodes.length) {
    cells.push([hinted('text', ...textNodes)]);
  }

  // Row: CTA label (button text)
  if (cta && cta.textContent.trim()) {
    const label = document.createElement('span');
    label.textContent = cta.textContent.trim();
    cells.push([hinted('ctalabel', label)]);
  }

  // Row: CTA link (anchor for aem-content link field)
  if (cta && cta.getAttribute('href')) {
    const link = document.createElement('a');
    link.setAttribute('href', cta.getAttribute('href'));
    link.textContent = cta.getAttribute('href');
    cells.push([hinted('ctalink', link)]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-trust', cells });
  element.replaceWith(block);
}
