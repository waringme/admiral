/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer content — metadata-independent dual-fetch:
  // /content first (localhost / aem up), then root (DA/EDS production)
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';

  const sections = ['social', 'legal'];
  [...fragment.children].forEach((section, i) => {
    if (sections[i]) section.classList.add(`footer-${sections[i]}`);
    footer.append(section);
  });

  block.append(footer);
}
