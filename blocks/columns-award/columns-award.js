import baseDecorate from '../columns/columns.js';

/**
 * Columns Award — variant of the "columns" block.
 * Created for the admiral.com home migration (https://www.admiral.com/).
 *
 * Delegates decoration to the base columns block. The base class is re-added so
 * shared scripts/CSS that target ".columns" continue to work; variant-specific
 * styling lives in columns-award.css (which @imports the base stylesheet).
 */
export default function decorate(block) {
  block.classList.add('columns', 'columns-award');
  baseDecorate(block);
}
