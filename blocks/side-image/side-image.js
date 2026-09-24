/**
 * Side Image — image beside text (admiral.com .side-image, e.g. "What is black
 * box insurance?", "Black box van insurance"). The image sits in its own
 * column on the left or right; the heading, copy and optional CTA sit in a
 * ~410px text column beside it.
 *
 * A block-based component (block/v1/block) with a single model. Authored
 * structure (post-decorate): one row per field — [ image ] and [ text ].
 * Block options (classes) control layout:
 *   right                 image column on the right (default left)
 *   center / top           vertical alignment of the image (default bottom)
 *
 * The authored rows are kept in place and only classed, so Universal Editor
 * field bindings on each cell stay intact.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const hasPicture = !!row.querySelector('picture, img');
    const hasText = !!row.querySelector('h1, h2, h3, h4, h5, h6, ul, ol')
      || [...row.querySelectorAll('p')].some((p) => p.textContent.trim());
    if (hasPicture && !hasText) {
      row.classList.add('side-image-media');
    } else {
      row.classList.add('side-image-text');
    }
  });
}
