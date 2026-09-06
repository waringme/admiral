import baseDecorate from '../carousel/carousel.js';

/**
 * Carousel Review — testimonial variant of the "carousel" block.
 * Created for the admiral.com home migration (https://www.admiral.com/).
 *
 * Delegates slider scaffolding to the base carousel block, then restructures
 * each slide to match the Admiral testimonial layout:
 *   quote → avatar (orange circle w/ flanking rules) → author name → location
 *
 * The authored first cell is empty; the base block turns it into
 * `.cards-card-image`, which we repurpose as the decorative avatar and move
 * inside the card body, between the quote and the author name.
 */
export default function decorate(block) {
  block.classList.add('carousel', 'carousel-review');
  baseDecorate(block);

  // After base decoration: li > [.cards-card-image (empty), .cards-card-body(p, h3, p)]
  block.querySelectorAll(':scope > ul > li').forEach((li) => {
    const image = li.querySelector(':scope > .cards-card-image');
    const body = li.querySelector(':scope > .cards-card-body');
    if (!image || !body) return;

    // Mark up the body pieces for styling.
    const quote = body.querySelector('p');
    const author = body.querySelector('h3');
    const location = author ? author.nextElementSibling : null;
    if (quote) quote.classList.add('review-quote');
    if (author) author.classList.add('review-author');
    if (location && location.tagName === 'P') location.classList.add('review-location');

    // Repurpose the empty image cell as the avatar and place it above the author.
    image.classList.add('review-avatar');
    if (author) body.insertBefore(image, author);
    else body.appendChild(image);
  });

  // Wire up prev/next navigation. The shared slider.js handler resolves the
  // track via `.closest('.carousel-container')`, but this block's section
  // wrapper is `.carousel-review-container`, so that lookup returns null and the
  // click handler throws before scrolling. Add our own robust handlers that
  // scroll the track directly (one testimonial per click, with wrap-around).
  const track = block.querySelector(':scope > ul');
  const next = block.querySelector(':scope > .button-container .next');
  const prev = block.querySelector(':scope > .button-container .prev');

  if (track && (next || prev)) {
    const move = (dir) => {
      const items = track.children.length || 1;
      const step = Math.round(track.scrollWidth / items);
      const maxScroll = track.scrollWidth - track.clientWidth;
      let target = track.scrollLeft + dir * step;
      // wrap-around at the ends so the testimonials cycle continuously
      if (target > maxScroll + 1) target = 0;
      else if (target < 0) target = maxScroll;
      track.scrollTo({ left: target, behavior: 'smooth' });
    };

    if (next) {
      next.addEventListener('click', (e) => { e.stopImmediatePropagation(); move(1); }, true);
    }
    if (prev) {
      prev.addEventListener('click', (e) => { e.stopImmediatePropagation(); move(-1); }, true);
    }
  }
}
