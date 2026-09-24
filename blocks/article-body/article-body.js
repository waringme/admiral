/**
 * Article Body — long-form magazine guide body (admiral.com /magazine/guides/*).
 *
 * A thin layout-containment wrapper: the authored content is ordinary
 * default-content prose (headings, paragraphs, lists, inline images, tables,
 * CTAs), but the design requires a contained reading-width column with article
 * typography that a full-width section can't enforce. The block provides that
 * column; article-body.css styles the prose.
 *
 * Authored structure: a single cell holding the rich-text body. This decorator
 * unwraps the block/row/cell scaffold so the prose sits directly in
 * .article-body, then tags any child tables so they pick up readable styling.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  // The richtext lands as block > div(row) > div(cell) > <prose…>. Hoist the
  // prose out of the row/cell wrappers so CSS can target children directly.
  const cell = block.querySelector(':scope > div > div') || block.querySelector(':scope > div');
  if (cell) {
    const frag = document.createDocumentFragment();
    while (cell.firstChild) frag.appendChild(cell.firstChild);
    block.textContent = '';
    block.appendChild(frag);
  }

  // Tag tables for the contained/striped article-table styling.
  block.querySelectorAll('table').forEach((t) => t.classList.add('article-body-table'));
}
