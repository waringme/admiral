/**
 * Feature Grid — icon feature items (admiral.com landing pages). Two looks,
 * chosen automatically by whether the items carry descriptions:
 *   - "grid" (no descriptions): centered icon + title tiles, e.g.
 *     "What does LittleBox measure?" (Speeding / When you drive / …).
 *   - "rows" (descriptions present): bordered rows with an icon + bold title
 *     on the left and a description on the right, e.g. "Why LittleBox could be
 *     your best black box cover" and "How do I get my feedback?".
 *
 * A block-based component (block/v1/block) with repeating items. Authored
 * structure (post-decorate): each row is [ icon ][ title ][ text ]. The icon's
 * alt text travels on the <img> itself (no separate alt cell).
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const items = [...block.children].map((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const titleCell = cells[1];
    const textCell = cells[2];

    const pic = iconCell ? iconCell.querySelector('picture, img') : null;
    const hasTitle = titleCell ? !!(titleCell.textContent || '').trim() : false;
    const hasText = textCell && textCell.textContent.trim();
    return {
      pic, titleCell, textCell, hasTitle, hasText,
    };
  }).filter((it) => it.hasTitle || it.pic || it.hasText);

  const withText = items.some((it) => it.hasText);
  const list = document.createElement('ul');
  list.className = `feature-grid-items feature-grid-${withText ? 'rows' : 'grid'}`;

  items.forEach((it) => {
    const li = document.createElement('li');
    li.className = 'feature-grid-item';

    // Head = icon + title (kept together so it forms one grid cell in the
    // rows layout, and stacks in the tile layout).
    const head = document.createElement('div');
    head.className = 'feature-grid-head';

    if (it.pic) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'feature-grid-icon';
      const picture = it.pic.closest('picture') || it.pic;
      iconWrap.appendChild(picture);
      head.appendChild(iconWrap);
    }
    if (it.titleCell) {
      const title = document.createElement('div');
      title.className = 'feature-grid-title';
      while (it.titleCell.firstChild) title.appendChild(it.titleCell.firstChild);
      head.appendChild(title);
    }
    li.appendChild(head);

    if (it.hasText) {
      const text = document.createElement('div');
      text.className = 'feature-grid-text';
      while (it.textCell.firstChild) text.appendChild(it.textCell.firstChild);
      li.appendChild(text);
    }

    list.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(list);
}
