/**
 * Award Banner — dark navy award banner (admiral.com home #reusable-block-16247).
 *
 * A block-based component (not a "columns" variant): the core columns component
 * always emits the base `class="columns"` and drops the variant, so the award
 * styling never attached on the published page. As a block, the model id
 * `award-banner` becomes the rendered class.
 *
 * Authored structure (post-decorate):
 *   .award-banner > div
 *     > div  — image cell: the award badge <img> (editable image field)
 *     > div  — text cell: heading (h2) + paragraph
 *
 * Rendered layout:
 *   .award-banner
 *     > .award-banner-badge  (holds the authored badge <img>)
 *     > .award-banner-copy   (heading + paragraph)
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const badge = document.createElement('div');
  badge.className = 'award-banner-badge';

  const copy = document.createElement('div');
  copy.className = 'award-banner-copy';

  // Each row's cells: [image][text]. Route the image cell to the badge and
  // everything else (heading + paragraphs) to the copy panel. Fall back
  // gracefully if the image field is empty.
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.querySelector('img, picture')) {
        const pic = cell.querySelector('picture') || cell.querySelector('img');
        if (pic) badge.appendChild(pic);
      } else {
        while (cell.firstChild) copy.appendChild(cell.firstChild);
      }
    });
  });

  block.textContent = '';
  block.appendChild(badge);
  block.appendChild(copy);
}
