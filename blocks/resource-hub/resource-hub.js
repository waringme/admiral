/**
 * Resource Hub — "Quick links" + categorised article cards in one block
 * (admiral.com motor hub, e.g. /resources/motor-hub/van-advice).
 *
 * The quick links are generated from the block's categories, so they always
 * point at a section that exists; each card is placed under the category named
 * in its Category field.
 *
 * A block-based component (block/v1/block) with two item types. Authored
 * structure (post-decorate):
 *   container rows — one cell each: [ quick-links heading ], [ intro ]
 *   category rows  — two cells:     [ name ][ intro ]
 *   card rows      — three cells:   [ image ][ text ][ category ]
 * (In the source .plain.html an item row may start with its component id —
 * "resource-hub-category" — which the converter uses; it is dropped here.)
 *
 * Rendered layout:
 *   .resource-hub-intro      (h3 + intro)
 *   nav.resource-hub-links   (> a[href="#<category>"] per category)
 *   section.resource-hub-group#<category> x N
 *     > .resource-hub-group-header (h3 + intro)
 *     > .cards.cards-article.boxed > ul > li (cards-article boxed markup)
 *
 * @param {Element} block
 */
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const ITEM_IDS = ['resource-hub-card', 'resource-hub-category'];

function toId(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Titles are authored in a plain-text field, which AEM stores as a <p>. Promote
 * it to a heading, keeping its attributes (incl. UE bindings).
 * @param {Element} cell
 * @returns {Element|null} the heading
 */
function toHeading(cell, tag = 'h3') {
  if (!cell || !cell.textContent.trim()) return null;
  const heading = document.createElement(tag);
  const p = cell.querySelector('p');
  if (p) {
    [...p.attributes].forEach(({ name, value }) => heading.setAttribute(name, value));
    heading.append(...p.childNodes);
  } else {
    [...cell.attributes].forEach(({ name, value }) => heading.setAttribute(name, value));
    heading.append(...[...cell.childNodes].filter((n) => n.nodeType !== Node.COMMENT_NODE));
  }
  return heading;
}

function buildCard(row, [imageCell, textCell]) {
  const li = document.createElement('li');
  moveInstrumentation(row, li);
  if (imageCell) {
    imageCell.className = 'cards-card-image';
    li.append(imageCell);
  }
  if (textCell) {
    textCell.className = 'cards-card-body';
    li.append(textCell);
  }
  li.querySelectorAll('picture > img').forEach((img) => {
    const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, picture.querySelector('img'));
    img.closest('picture').replaceWith(picture);
  });
  return li;
}

function scrollToGroup(group, smooth) {
  group.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
}

export default function decorate(block) {
  const intro = document.createElement('div');
  intro.className = 'resource-hub-intro';
  const categories = [];
  const uncategorised = [];
  const cards = [];
  let containerRow = 0;

  [...block.children].forEach((row) => {
    let cells = [...row.children];
    if (cells.length > 1 && ITEM_IDS.includes(cells[0].textContent.trim())) {
      cells[0].remove();
      cells = cells.slice(1);
    }

    if (cells.length === 1) {
      // container fields: quick-links heading, then intro
      const [cell] = cells;
      if (containerRow === 0) {
        const heading = toHeading(cell);
        if (heading) intro.append(heading);
      } else if (cell.textContent.trim()) {
        intro.append(...cell.childNodes);
      }
      containerRow += 1;
      return;
    }

    if (cells.length === 2) {
      const [titleCell, descriptionCell] = cells;
      const name = titleCell.textContent.trim();
      const header = document.createElement('div');
      header.className = 'resource-hub-group-header';
      moveInstrumentation(row, header);
      const heading = toHeading(titleCell);
      if (heading) header.append(heading);
      if (descriptionCell?.textContent.trim()) header.append(...descriptionCell.childNodes);
      categories.push({
        key: toId(name), name, header, cards: [],
      });
      return;
    }

    const category = toId(cells[2]?.textContent || '');
    cards.push({ category, li: buildCard(row, cells) });
  });

  cards.forEach(({ category, li }) => {
    const match = categories.find((c) => c.key && c.key === category);
    (match ? match.cards : uncategorised).push(li);
  });
  if (uncategorised.length) {
    categories.push({
      key: '', name: '', header: null, cards: uncategorised,
    });
  }

  const nav = document.createElement('nav');
  nav.className = 'resource-hub-links';
  nav.setAttribute('aria-label', intro.querySelector('h3')?.textContent.trim() || 'Quick links');

  const groups = categories.map(({
    key, name, header, cards: items,
  }) => {
    const group = document.createElement('section');
    group.className = 'resource-hub-group';
    if (key) group.id = key;
    if (header) group.append(header);
    const cardsBlock = document.createElement('div');
    cardsBlock.className = 'cards cards-article boxed';
    const ul = document.createElement('ul');
    ul.append(...items);
    cardsBlock.append(ul);
    group.append(cardsBlock);

    if (key && name) {
      const link = document.createElement('a');
      link.href = `#${key}`;
      link.textContent = name;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToGroup(group, true);
        window.history.pushState(null, '', `#${key}`);
      });
      nav.append(link);
    }
    return group;
  });

  block.textContent = '';
  block.append(intro);
  if (nav.children.length) block.append(nav);
  block.append(...groups);

  // A page opened with #<category> jumps before this block exists; jump again.
  const hash = decodeURIComponent(window.location.hash.slice(1));
  const target = hash && groups.find((g) => g.id === hash);
  if (target) requestAnimationFrame(() => scrollToGroup(target, false));
}
