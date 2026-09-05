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
}
