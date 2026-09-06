/* eslint-disable */
/* global WebImporter */
/**
 * Parser for app-download. Container block (resourceType block/v1/block + filter).
 * Source: https://www.admiral.com/ (#basic-10863)
 *
 * Model layout:
 *   container "app-download" — field: text (richtext: heading + subtitle)
 *   item "app-download-badge" — fields: image, imageAlt, link (one per store badge)
 *
 * The badges are image-inside-link pairs, which the JCR converter cannot keep
 * inside a richtext/default-content cell (richtext is greedy but stops at images,
 * and a plain image-link is flattened to a text-less button). Modelling each
 * badge as an item (image reference + store link) is the reliable representation;
 * app-download.js re-wraps each badge image in its link at render time.
 * Generated: 2026-09-06
 */
export default function parse(element, { document }) {
  // Drop inline <style>/<script> (background-image CSS) — non-authorable.
  element.querySelectorAll('style, script').forEach((n) => n.remove());

  const copy = element.querySelector('.copy') || element;

  const heading = copy.querySelector('h1, h2, h3, h4');
  const paragraphs = Array.from(copy.querySelectorAll('p'));
  // Subtitle: first paragraph with text that isn't a badge-link wrapper.
  const subtitle = paragraphs.find((p) => p.textContent.trim() && !p.querySelector('a'));

  const appLinks = Array.from(
    copy.querySelectorAll('.app-icons a, a[href*="apps.apple"], a[href*="play.google"]'),
  );

  // Empty-block guard
  if (!heading && !subtitle && !appLinks.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const hinted = (fieldName, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
    return frag;
  };

  // Container field row: text = heading + subtitle.
  const textNodes = [];
  if (heading) textNodes.push(heading);
  if (subtitle) textNodes.push(subtitle);

  const cells = [
    [textNodes.length ? hinted('text', ...textNodes) : hinted('text')],
  ];

  // One item row per badge. The badge item model is [image, imageAlt, link],
  // but md2jcr collapses `imageAlt` into the `image` field (suffix collapsing),
  // leaving TWO field-groups: image (carries its alt) and link. So emit two
  // positional cells — image | link — else the extra cell overruns the field
  // groups and md2jcr throws. The image's alt attribute supplies imageAlt.
  appLinks.forEach((a) => {
    const img = a.querySelector('img');
    const href = a.getAttribute('href') || '';

    const imageCell = img ? hinted('image', img) : hinted('image');

    let linkCell = hinted('link');
    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = href;
      linkCell = hinted('link', link);
    }

    cells.push([imageCell, linkCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'app-download', cells });
  element.replaceWith(block);
}
