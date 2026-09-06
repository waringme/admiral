/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer content — metadata-independent dual-fetch. Order the candidates
  // by environment so the working URL is hit first (avoids a guaranteed console
  // 404): localhost/aem serves it under /content, DA/EDS production at the root.
  const onLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    || window.location.hostname.endsWith('.aem.reviews');
  const candidates = onLocal
    ? ['/content/footer.plain.html', '/footer.plain.html']
    : ['/footer.plain.html', '/content/footer.plain.html'];
  let resp = await fetch(candidates[0]);
  if (!resp.ok) resp = await fetch(candidates[1]);
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
