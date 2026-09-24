/**
 * Comparison Table — feature comparison grid (admiral.com landing pages,
 * e.g. black-box-insurance "What's covered" / LittleBox coverage table).
 *
 * A block-based component (resourceType block/v1/block) with repeating rows.
 * Authored structure (post-decorate): each row is [ label ][ value ] where the
 * value cell holds either short text ("Optional", "£5,000") or a tick/cross
 * indicator authored as the words "yes"/"no"/"tick"/"cross" or a ✓/✗ glyph.
 *
 * Rendered layout:
 *   table.comparison-table-grid
 *     > tbody > tr > th (feature label) + td (value)
 * Value cells whose text is an affirmative/negative token render as a
 * tick/cross badge instead of the raw text.
 *
 * @param {Element} block
 */
const TICK_TOKENS = ['yes', 'tick', 'included', 'true', '✓', '✔'];
const CROSS_TOKENS = ['no', 'cross', 'not included', 'false', '✗', '✘', '—'];

function valueToNode(cell) {
  const raw = (cell.textContent || '').trim().toLowerCase();
  if (TICK_TOKENS.includes(raw)) {
    const span = document.createElement('span');
    span.className = 'comparison-table-badge comparison-table-badge-tick';
    span.setAttribute('aria-label', 'Included');
    return span;
  }
  if (CROSS_TOKENS.includes(raw)) {
    const span = document.createElement('span');
    span.className = 'comparison-table-badge comparison-table-badge-cross';
    span.setAttribute('aria-label', 'Not included');
    return span;
  }
  // otherwise keep the authored rich text as-is
  const wrap = document.createElement('span');
  wrap.className = 'comparison-table-value';
  while (cell.firstChild) wrap.appendChild(cell.firstChild);
  return wrap;
}

export default function decorate(block) {
  const table = document.createElement('table');
  table.className = 'comparison-table-grid';

  // Dark charcoal header strip spanning both columns (decorative, matches the
  // source coverage table). Cells are empty — no authored header content.
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  const thLabel = document.createElement('th');
  thLabel.scope = 'col';
  const thValue = document.createElement('th');
  thValue.scope = 'col';
  headRow.append(thLabel, thValue);
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const valueCell = cells[1];
    if (!labelCell) return;

    const tr = document.createElement('tr');

    const th = document.createElement('th');
    th.scope = 'row';
    th.className = 'comparison-table-label';
    while (labelCell.firstChild) th.appendChild(labelCell.firstChild);
    tr.appendChild(th);

    const td = document.createElement('td');
    td.className = 'comparison-table-cell';
    if (valueCell) td.appendChild(valueToNode(valueCell));
    tr.appendChild(td);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  block.textContent = '';
  block.appendChild(table);
}
