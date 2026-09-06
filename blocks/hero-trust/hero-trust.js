/**
 * Hero Trust — admiral.com home hero ("30 years trust" banner).
 *
 * The authored table carries the hero-trust model's field groups as rows
 * (image, text, enableunderline, herolayout, backgroundstyle, ctalabel, ctalink).
 * Rather than depend on fixed row indices, this decorator locates content by
 * type so it is resilient to model/row changes:
 *   heading + subtitle  — the cell that holds the h1..h6
 *   CTA label           — a paragraph outside the heading cell with no link
 *   CTA link            — the first anchor's href
 *
 * Renders a single copy panel (.hero-trust-copy) that the CSS positions over a
 * background photo.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');

  // The cell (innermost div) that contains the heading also holds the subtitle.
  const headingCell = heading ? heading.closest('div') : null;
  const subheadings = headingCell
    ? [...headingCell.querySelectorAll('p')].filter((p) => p.textContent.trim())
    : [];

  // CTA link — first anchor in the block; its href is the destination.
  const anchor = block.querySelector('a[href]');
  const ctaLink = anchor ? anchor.getAttribute('href') : '';

  // CTA label — a paragraph outside the heading cell that has no anchor
  // (the ctalabel row). Fall back to the anchor's own text.
  let ctaLabel = '';
  const labelPara = [...block.querySelectorAll('p')].find((p) => {
    if (headingCell && headingCell.contains(p)) return false;
    if (p.querySelector('a')) return false;
    return p.textContent.trim().length > 0;
  });
  if (labelPara) ctaLabel = labelPara.textContent.trim();
  else if (anchor) ctaLabel = anchor.textContent.trim();

  // --- Build the copy panel ---
  const copy = document.createElement('div');
  copy.className = 'hero-trust-copy';

  if (heading) copy.appendChild(heading);
  subheadings.forEach((p) => copy.appendChild(p));

  if (ctaLabel && ctaLink) {
    const cta = document.createElement('a');
    cta.className = 'hero-trust-cta';
    cta.href = ctaLink;
    cta.title = ctaLabel;
    cta.textContent = ctaLabel;
    copy.appendChild(cta);
  }

  block.textContent = '';
  block.appendChild(copy);
}
