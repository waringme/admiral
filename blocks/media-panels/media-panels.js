/**
 * Media Panels — horizontal image-left / text-right product panels
 * (admiral.com "Our black box insurance products": LittleBox / Plug and Drive /
 * LittleBox Pod). Each panel is a wide photo on the left with a blue heading and
 * grey description on the right.
 *
 * A block-based component (block/v1/block) with repeating panel items. Authored
 * structure (post-decorate): each row is [ image ][ title ][ text ]. The image
 * alt travels on the <img> itself.
 *
 * Rendered layout:
 *   ul.media-panels-items
 *     > li.media-panel
 *         > div.media-panel-media   (picture)
 *         > div.media-panel-body    (title heading + text)
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'media-panels-items';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells[0];
    const titleCell = cells[1];
    const textCell = cells[2];

    const pic = imageCell ? imageCell.querySelector('picture, img') : null;
    const hasTitle = titleCell ? !!(titleCell.textContent || '').trim() : false;
    const hasText = textCell ? !!textCell.textContent.trim() : false;
    if (!pic && !hasTitle && !hasText) return;

    const li = document.createElement('li');
    li.className = 'media-panel';

    if (pic) {
      const media = document.createElement('div');
      media.className = 'media-panel-media';
      media.appendChild(pic.closest('picture') || pic);
      li.appendChild(media);
    }

    const body = document.createElement('div');
    body.className = 'media-panel-body';
    if (titleCell) {
      const title = document.createElement('div');
      title.className = 'media-panel-title';
      while (titleCell.firstChild) title.appendChild(titleCell.firstChild);
      body.appendChild(title);
    }
    if (textCell) {
      const text = document.createElement('div');
      text.className = 'media-panel-text';
      while (textCell.firstChild) text.appendChild(textCell.firstChild);
      body.appendChild(text);
    }
    li.appendChild(body);

    list.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(list);
}
