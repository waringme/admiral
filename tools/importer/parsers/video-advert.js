/* eslint-disable */
/* global WebImporter */
/**
 * Parser for video-advert. Base block: video.
 * Source: https://www.admiral.com/ (#basic-18611)
 * xwalk simple block — model field: videoUrl (single row/cell).
 * The section (#basic-18611) also carries a heading ("Watch our new TV advert")
 * as default content. Because the block instance selector targets the whole
 * section, this parser preserves that heading (as default content) alongside the
 * video block instead of discarding it.
 * Generated: 2026-09-05
 */
export default function parse(element, { document }) {
  // Preserve the section heading (default content) so it is not dropped when
  // the section element is replaced by the block.
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');

  const iframe = element.querySelector('iframe');

  // The embed URL is lazy-loaded; check the common carriers in priority order.
  let videoUrl = '';
  if (iframe) {
    videoUrl = iframe.getAttribute('src')
      || iframe.getAttribute('data-src')
      || iframe.getAttribute('data-lazy-src')
      || '';
  }
  if (!videoUrl) {
    const videoEl = element.querySelector('video source, video');
    if (videoEl) videoUrl = videoEl.getAttribute('src') || '';
  }
  if (!videoUrl) {
    const link = element.querySelector('a[href*="youtube"], a[href*="youtu.be"], a[href*="vimeo"], a[href*=".mp4"]');
    if (link) videoUrl = link.getAttribute('href') || '';
  }

  const hinted = (fieldName, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
    return frag;
  };

  const urlSpan = document.createElement('span');
  urlSpan.textContent = videoUrl;

  const cells = [
    [hinted('videoUrl', urlSpan)],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-advert', cells });

  // Emit the section heading as default content before the block, then swap the
  // whole section for [heading, block] so the "Watch our new TV advert" title
  // is preserved in the imported content.
  const frag = document.createDocumentFragment();
  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.textContent = heading.textContent.trim();
    frag.appendChild(h);
  }
  frag.appendChild(block);
  element.replaceWith(frag);
}
