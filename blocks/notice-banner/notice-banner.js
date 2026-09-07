/**
 * Notice Banner — contained light-blue notice panel (admiral.com home
 * #basic-18085 .sub-hero-banner): copy (h3 + p + CTA) on the left, a person
 * image on the right (desktop only).
 *
 * A block-based component (not a "columns" variant): md2jcr forces any block
 * whose name starts with "columns" into a plain <columns> node, dropping the
 * variant class, so the panel styling never attached on the published page. As
 * a block, the model id `notice-banner` becomes the rendered class.
 *
 * Authored structure (post-decorate):
 *   .notice-banner > div
 *     > div  — image cell: the person <img> (editable image field)
 *     > div  — text cell: heading (h3) + paragraph + CTA
 *
 * Rendered layout:
 *   .notice-banner
 *     > .notice-banner-copy   (heading + paragraph + CTA)
 *     > .notice-banner-image  (holds the authored person <img>)
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const copy = document.createElement('div');
  copy.className = 'notice-banner-copy';

  const media = document.createElement('div');
  media.className = 'notice-banner-image';

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.querySelector('img, picture')) {
        const pic = cell.querySelector('picture') || cell.querySelector('img');
        if (pic) media.appendChild(pic);
      } else {
        while (cell.firstChild) copy.appendChild(cell.firstChild);
      }
    });
  });

  // Mark the CTA link as a button (matches the source pill styling).
  copy.querySelectorAll('a').forEach((a) => {
    a.classList.add('button');
    const p = a.closest('p');
    if (p) p.classList.add('button-container');
  });

  block.textContent = '';
  block.appendChild(copy);
  if (media.childNodes.length) block.appendChild(media);
}
