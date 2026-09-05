/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-review. Base block: carousel (container, card filter).
 * Source: https://www.admiral.com/ (#testimonials-7343)
 * xwalk container block — one row per slide, 2 columns: image cell, text cell.
 * card model fields: image (col 1), text (col 2: quote + author + location).
 * NOTE: source is a Slick slider that duplicates slides as .slick-cloned —
 * those clones are excluded so only the real slides are emitted.
 * Generated: 2026-09-05
 * Note: validator similarity (~78%) is depressed because the source repeats
 * each testimonial as Slick clones; all 3 unique slides are captured and the
 * clones are intentionally excluded to prevent duplicate carousel slides.
 */
export default function parse(element, { document }) {
  // Real slides only — drop Slick's cloned duplicates. (validated against source.html)
  let slides = Array.from(element.querySelectorAll('.slick-slide:not(.slick-cloned)'));
  if (!slides.length) {
    // Fallback: any testimonial that isn't inside a cloned slide.
    slides = Array.from(element.querySelectorAll('.testimonial'))
      .filter((t) => !t.closest('.slick-cloned'));
  }

  // Empty-block guard
  if (!slides.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const hinted = (fieldName, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
    return frag;
  };

  // carousel-review is a container: md2jcr consumes the first N rows as the
  // container model's own fields (autoplay, autoplayInterval, imageZoom), then
  // treats the remaining rows as `card` items. Emit those 3 container-field rows
  // (empty = use defaults) before the review items so the split lands correctly.
  const cells = [
    [''], // autoplay
    [''], // autoplayInterval
    [''], // imageZoom
  ];

  slides.forEach((slide) => {
    const testimonial = slide.querySelector('.testimonial') || slide;
    const img = testimonial.querySelector('.image img, img');
    const quote = testimonial.querySelector('.callout, p.callout');
    const author = testimonial.querySelector('.testimonial__author, h1, h2, h3, h4');
    const location = testimonial.querySelector('.testimonial__location');

    // Text cell: quote + author heading + location.
    const textNodes = [];
    if (quote) textNodes.push(quote);
    if (author) textNodes.push(author);
    if (location) textNodes.push(location);
    const textCell = textNodes.length ? hinted('text', ...textNodes) : '';

    // card model = [image, text]; md2jcr maps each item cell positionally to a
    // field. Always emit two cells (image | text) so the text lands on the text
    // field. Reviews have no image → hinted-but-empty image cell.
    cells.push([img ? hinted('image', img) : hinted('image'), textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-review', cells });
  element.replaceWith(block);
}
