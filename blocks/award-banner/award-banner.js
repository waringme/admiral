/**
 * Award Banner — dark navy award banner (admiral.com home #reusable-block-16247).
 *
 * A block-based component (not a "columns" variant): the core columns component
 * always emits the base `class="columns"` and drops the variant, so the award
 * styling never attached on the published page. As a block, the model id
 * `award-banner` becomes the rendered class.
 *
 * Authored structure (post-decorate):
 *   .award-banner > div > div  — text cell: heading (h2) + paragraph
 *
 * Rendered layout:
 *   .award-banner
 *     > .award-banner-badge  (empty; award image painted as CSS background)
 *     > .award-banner-copy   (heading + paragraph)
 *
 * @param {Element} block
 */
export default function decorate(block) {
  // Gather the authored copy (heading + paragraphs) from the block's cells.
  const copy = document.createElement('div');
  copy.className = 'award-banner-copy';

  [...block.children].forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    while (cell.firstChild) copy.appendChild(cell.firstChild);
  });

  // Award badge: empty element; the badge image is a CSS background.
  const badge = document.createElement('div');
  badge.className = 'award-banner-badge';

  block.textContent = '';
  block.appendChild(badge);
  block.appendChild(copy);
}
