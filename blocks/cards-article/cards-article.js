import baseDecorate from '../cards/cards.js';

/**
 * Cards Article — variant of the "cards" block.
 * Created for the admiral.com home migration (https://www.admiral.com/).
 *
 * Delegates decoration to the base cards block. The base class is re-added so
 * shared scripts/CSS that target ".cards" continue to work; variant-specific
 * styling lives in cards-article.css (which @imports the base stylesheet).
 */
export default function decorate(block) {
  block.classList.add('cards', 'cards-article');
  baseDecorate(block);
}
