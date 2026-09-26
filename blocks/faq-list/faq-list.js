/**
 * FAQ List — expandable question/answer list (admiral.com "Your questions
 * answered"). Each item is a white bordered box with a blue question and a
 * "+" toggle; the answer opens inside the same box. Only the first three items
 * are shown; each "Show more" click reveals the next three.
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

/**
 * Titles are authored in a plain-text field, which AEM stores as a <p>. Promote
 * that paragraph to a heading (keeping its attributes, incl. UE bindings) so
 * the rendered page has the same heading structure as the source.
 * @param {Element} cell
 * @param {string} [tag]
 */
function promoteToHeading(cell, tag = 'h3') {
  if (!cell || cell.querySelector('h1, h2, h3, h4, h5, h6')) return;
  const heading = document.createElement(tag);
  const p = cell.querySelector('p');
  if (p) {
    [...p.attributes].forEach(({ name, value }) => heading.setAttribute(name, value));
    heading.append(...p.childNodes);
    p.replaceWith(heading);
  } else if (cell.textContent.trim()) {
    heading.append(...[...cell.childNodes].filter((n) => n.nodeType !== Node.COMMENT_NODE));
    cell.append(heading);
  }
}

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
    promoteToHeading(summary);

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
  // Each click reveals the next VISIBLE questions; the button goes once
  // they're all showing.
  button.addEventListener('click', () => {
    list.querySelectorAll('.faq-list-item-hidden').forEach((item, i) => {
      if (i < VISIBLE) item.classList.remove('faq-list-item-hidden');
    });
    if (!list.querySelector('.faq-list-item-hidden')) more.remove();
  });
  more.appendChild(button);
  block.appendChild(more);
}
