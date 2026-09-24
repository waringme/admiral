/**
 * Breadcrumb — path trail for guide pages (admiral.com /magazine/guides/*).
 *
 * A block-based component with repeating items. Each authored row is
 * [ label ][ link ]; the last item is rendered as the current page (no link).
 *
 * Rendered layout:
 *   nav.breadcrumb-nav > ol > li > a (or span for the current/last item)
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb-nav';
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const label = (labelCell?.textContent || '').trim();
    if (!label) return;

    const href = linkCell ? (linkCell.querySelector('a')?.getAttribute('href')
      || (linkCell.textContent || '').trim()) : '';

    const li = document.createElement('li');
    li.className = 'breadcrumb-item';

    const isLast = i === rows.length - 1;
    if (href && !isLast) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      li.appendChild(a);
    } else {
      const span = document.createElement('span');
      span.setAttribute('aria-current', 'page');
      span.textContent = label;
      li.appendChild(span);
    }
    ol.appendChild(li);
  });

  nav.appendChild(ol);
  block.textContent = '';
  block.appendChild(nav);
}
