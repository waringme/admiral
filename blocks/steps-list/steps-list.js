/**
 * Steps List — numbered process rows (admiral.com landing pages, e.g.
 * "LittleBox in four simple steps" and "How is LittleBox installed").
 *
 * A block-based component (block/v1/block) with repeating step items.
 * Authored structure (post-decorate): each row is [ title ][ text ]. The step
 * number is generated automatically (CSS counter) so authors only edit the
 * title and description.
 *
 * Rendered layout:
 *   ol.steps-list-items
 *     > li.steps-list-step
 *         > div.steps-list-title   (span.steps-list-num badge + title heading)
 *         > div.steps-list-text    (description)
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const list = document.createElement('ol');
  list.className = 'steps-list-items';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const titleCell = cells[0];
    const textCell = cells[1];
    if (!titleCell && !textCell) return;

    const li = document.createElement('li');
    li.className = 'steps-list-step';

    // Left cell: circular auto number + the step title.
    const title = document.createElement('div');
    title.className = 'steps-list-title';
    const num = document.createElement('span');
    num.className = 'steps-list-num';
    num.setAttribute('aria-hidden', 'true');
    title.appendChild(num);
    if (titleCell) {
      while (titleCell.firstChild) title.appendChild(titleCell.firstChild);
    }
    li.appendChild(title);

    // Right cell: description.
    const text = document.createElement('div');
    text.className = 'steps-list-text';
    if (textCell) {
      while (textCell.firstChild) text.appendChild(textCell.firstChild);
    }
    li.appendChild(text);

    list.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(list);
}
