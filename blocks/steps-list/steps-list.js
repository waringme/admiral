/**
 * Steps List — numbered process rows (admiral.com landing pages, e.g.
 * "LittleBox in four simple steps").
 *
 * A block-based component (block/v1/block) with repeating step items.
 * Authored structure (post-decorate): each row is [ title ][ text ]. The step
 * number is generated automatically (CSS counter) so authors only edit the
 * title and description.
 *
 * Universal Editor: each row's instrumentation is moved onto its <li>, and the
 * authored cells are reused (not emptied) so their field bindings survive.
 *
 * Rendered layout:
 *   ol.steps-list-items
 *     > li.steps-list-step
 *         > div.steps-list-title      (span.steps-list-num badge + title cell)
 *         > div.steps-list-text       (description cell)
 *
 * @param {Element} block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const list = document.createElement('ol');
  list.className = 'steps-list-items';

  [...block.children].forEach((row) => {
    const [titleCell, textCell] = row.children;
    if (!titleCell && !textCell) return;

    const li = document.createElement('li');
    li.className = 'steps-list-step';
    moveInstrumentation(row, li);

    // Left cell: circular auto number beside the authored title cell.
    const title = document.createElement('div');
    title.className = 'steps-list-title';
    const num = document.createElement('span');
    num.className = 'steps-list-num';
    num.setAttribute('aria-hidden', 'true');
    title.appendChild(num);
    if (titleCell) {
      titleCell.classList.add('steps-list-title-text');
      title.appendChild(titleCell);
    }
    li.appendChild(title);

    // Right cell: the authored description cell.
    if (textCell) {
      textCell.classList.add('steps-list-text');
      li.appendChild(textCell);
    }

    list.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(list);
}
