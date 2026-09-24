/* eslint-disable */
/* global WebImporter */
/**
 * Parser for comparison-table. Container block (resourceType block/v1/block,
 * filter "comparison-table") with repeating "comparison-row" items.
 * Source: https://www.admiral.com/black-box-insurance (#basic-18312 table)
 *
 * The selector "#basic-18312 table" matches THREE <table> elements and this
 * parser runs once per table:
 *   1. <table class="general hybrid blue"> — coverage table. Each <tr> is
 *      <th>Feature label</th><td>value</td>. The value is short text
 *      ("Optional", "Up to £200") OR a tick/cross badge span
 *      (.badge--tick-* => "yes", .badge--cross* => "no").
 *   2/3. <table class="table-list table-list--badges"> — the 4-step process
 *      tables. Each <tr> is <th.table-list__badge>(numbered SVG)</th>
 *      <th.table-list__heading><h3>step title</h3></th><td><p>step copy</p></td>.
 *      label = step heading, value = step copy. The decorative numbered SVG
 *      badge is dropped (non-authorable data-URI).
 *
 * comparison-row model fields: label (text, col 1), value (richtext, col 2).
 * One item row per source <tr>. xwalk field hints: field:label, field:value.
 * Generated: 2026-09-24
 */
export default function parse(element, { document }) {
  const hinted = (fieldName, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
    return frag;
  };

  const textOf = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  const isProcessTable = element.classList.contains('table-list')
    || element.querySelector(':scope th.table-list__heading');

  // Only body rows are content — skip the empty <thead> spacer row.
  const rows = Array.from(element.querySelectorAll(':scope > tbody > tr, :scope tbody tr'));

  const cells = [];

  rows.forEach((tr) => {
    let labelText = '';
    let valueCell = '';

    if (isProcessTable) {
      // Process step: heading (label) + copy paragraph (value).
      const headingEl = tr.querySelector('th.table-list__heading, th:not(.table-list__badge)');
      labelText = textOf(headingEl);
      const copyEl = tr.querySelector('td');
      if (copyEl && textOf(copyEl)) {
        valueCell = hinted('value', ...Array.from(copyEl.childNodes).map((n) => n.cloneNode(true)));
      }
    } else {
      // Coverage row: <th> feature label + <td> value.
      const th = tr.querySelector('th');
      const td = tr.querySelector('td');
      labelText = textOf(th);
      if (td) {
        const tick = td.querySelector('[class*="tick"]');
        const cross = td.querySelector('[class*="cross"]');
        if (tick) {
          valueCell = hinted('value', document.createTextNode('yes'));
        } else if (cross) {
          valueCell = hinted('value', document.createTextNode('no'));
        } else if (textOf(td)) {
          valueCell = hinted('value', ...Array.from(td.childNodes).map((n) => n.cloneNode(true)));
        }
      }
    }

    // Skip structural/empty rows (e.g. the header spacer <tr><th></th><th></th></tr>).
    if (!labelText && !valueCell) return;

    const labelCell = labelText
      ? hinted('label', document.createTextNode(labelText))
      : '';
    cells.push([labelCell, valueCell || '']);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'comparison-table', cells });
  element.replaceWith(block);
}
