/**
 * FAQ List — expandable question/answer list (admiral.com "Your questions
 * answered"). Each item is a white bordered box with a blue question and a
 * "+" toggle; the answer opens inside the same box. Only the first few items
 * are shown until the reader clicks "Show more".
 *
 * A block-based component (block/v1/block) with repeating items. Authored
 * structure (post-decorate): each row is [ question ][ answer ].
 *
 * Rendered layout:
 *   div.faq-list-items
 *     > details.faq-list-item (> summary.faq-list-question + div.faq-list-answer)
 *   p.faq-list-more > button  (only when there are more than VISIBLE items)
 *
 * @param {Element} block
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

// Number of questions visible before "Show more" (matches the source).
const VISIBLE = 3;

export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'faq-list-items';

  [...block.children].forEach((row) => {
    const [questionCell, answerCell] = row.children;
    if (!questionCell || !questionCell.textContent.trim()) return;

    const details = document.createElement('details');
    details.className = 'faq-list-item';
    moveInstrumentation(row, details);

    const summary = document.createElement('summary');
    summary.className = 'faq-list-question';
    summary.append(...questionCell.childNodes);

    const answer = document.createElement('div');
    answer.className = 'faq-list-answer';
    if (answerCell) answer.append(...answerCell.childNodes);

    details.append(summary, answer);
    list.appendChild(details);
  });

  block.textContent = '';
  block.appendChild(list);

  const items = [...list.children];
  if (items.length <= VISIBLE) return;

  items.slice(VISIBLE).forEach((item) => item.classList.add('faq-list-item-hidden'));

  const more = document.createElement('p');
  more.className = 'faq-list-more';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Show more';
  button.addEventListener('click', () => {
    items.forEach((item) => item.classList.remove('faq-list-item-hidden'));
    more.remove();
  });
  more.appendChild(button);
  block.appendChild(more);
}
