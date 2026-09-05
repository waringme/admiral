/**
 * Hero Trust — full-bleed navy hero banner (admiral.com home).
 *
 * Content model (rows in the authored table):
 *   row 0  text      — heading (h2) + subheading paragraph
 *   row 1  ctalabel  — CTA button label text (e.g. "EXPLORE OUR COVER")
 *   row 2  ctalink   — CTA target (an <a> whose href is the destination)
 *
 * The base "hero" block expects an asset + text model, so it cannot be reused
 * here — it mis-maps the rows and drops the CTA. This decorator assembles the
 * banner directly instead.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  // --- Row 0: heading + subheading ---
  const textRow = rows[0];
  const heading = textRow?.querySelector('h1, h2, h3, h4, h5, h6') || null;
  const paras = textRow ? [...textRow.querySelectorAll('p')] : [];

  // --- Row 1: CTA label ---
  const ctaLabel = rows[1]?.textContent.trim() || '';

  // --- Row 2: CTA link ---
  const ctaAnchor = rows[2]?.querySelector('a');
  const ctaLink = ctaAnchor?.getAttribute('href')
    || rows[2]?.textContent.trim()
    || '';

  // --- Build the copy container ---
  const copy = document.createElement('div');
  copy.className = 'hero-trust-copy';

  if (heading) copy.appendChild(heading);
  paras.forEach((p) => {
    // ignore empty paragraphs
    if (p.textContent.trim()) copy.appendChild(p);
  });

  if (ctaLabel && ctaLink) {
    const cta = document.createElement('a');
    cta.className = 'hero-trust-cta';
    cta.href = ctaLink;
    cta.title = ctaLabel;
    cta.textContent = ctaLabel;
    copy.appendChild(cta);
  }

  // --- Replace the authored table with the assembled banner ---
  block.textContent = '';
  block.appendChild(copy);
}
