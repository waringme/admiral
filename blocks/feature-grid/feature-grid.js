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
 * structure (post-decorate): each row is [ image ][ title ][ text ]. The image
 * alt travels on the <img> itself.
 *
 * Universal Editor: each row's instrumentation is moved onto its <li>, and the
 * authored cells are reused (not emptied) so their field bindings survive —
 * rows stay selectable/addable and each field stays editable.
 *
 * @param {Element} block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const withText = rows.some((row) => row.children[2]?.textContent.trim());

  const list = document.createElement('ul');
  list.className = `feature-grid-items feature-grid-${withText ? 'rows' : 'grid'}`;

  rows.forEach((row) => {
    const [iconCell, titleCell, textCell] = row.children;

    const li = document.createElement('li');
    li.className = 'feature-grid-item';
    moveInstrumentation(row, li);

    // Head = image + title (one grid cell in the rows layout, stacked in tiles).
    const head = document.createElement('div');
    head.className = 'feature-grid-head';
    if (iconCell) {
      iconCell.className = 'feature-grid-icon';
      head.appendChild(iconCell);
    }
    if (titleCell) {
      titleCell.className = 'feature-grid-title';
      head.appendChild(titleCell);
    }
    li.appendChild(head);

    if (textCell) {
      textCell.className = 'feature-grid-text';
      li.appendChild(textCell);
    }

    list.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(list);
}
