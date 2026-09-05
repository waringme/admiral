import baseDecorate from '../cards/cards.js';

/**
 * Cards Product — variant of the "cards" block.
 * Created for the admiral.com home migration (https://www.admiral.com/).
 *
 * Delegates DOM building to the base cards decorator (which produces the
 * ul > li > .cards-card-image / .cards-card-body structure), but deliberately
 * does NOT add the base ".cards" class: this compact icon-tile layout is a
 * completely different visual design from the base image-card block, and the
 * global ".cards ..." rules (pulled in via other variants' @import of the base
 * stylesheet) would otherwise override this variant's styling. All styling
 * lives self-contained in cards-product.css and targets ".cards-product".
 */
export default function decorate(block) {
  block.classList.add('cards-product');
  baseDecorate(block);
}
