/**
 * Article Body — long-form magazine guide body (admiral.com /magazine/guides/*).
 *
 * A block-based component (block/v1/block) with a single model:
 *   text        — the article prose (headings, paragraphs, lists, images, tables)
 *   author      — byline name (optional)
 *   authorImage — byline photo (optional)
 *   dateline    — e.g. "18 June 2024 | Updated 6 July 2026 | 5 minute read"
 * md2jcr emits one row per field; rows are classified by content (the prose row
 * is the one with headings / most elements), so row order is not relied on.
 *
 * Rendered layout (source .magazine-story at 1440px): a 260px "Article
 * contents" sidebar built from the article's h2s, beside a 645px article column
 * that starts with the byline (photo, name, date line, share icons) and ends
 * with a "Share with your friends..." row. Authored elements are moved, not
 * re-created, so Universal Editor field bindings stay intact.
 *
 * @param {Element} block
 */

const SHARE = [
  { key: 'facebook', label: 'Share article on Facebook', href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  { key: 'x', label: 'Share article on X', href: (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
  { key: 'email', label: 'Share article via Email', href: (u, t) => `mailto:?subject=${encodeURIComponent('Check out this article on admiral.com')}&body=${t}%20-%20${u}` },
];

function shareIcons() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent((document.querySelector('main h1')?.textContent || document.title).trim());
  const wrap = document.createElement('div');
  wrap.className = 'article-body-social';
  SHARE.forEach(({ key, label, href }) => {
    const a = document.createElement('a');
    a.className = `article-body-social-icon article-body-social-${key}`;
    a.href = href(url, title);
    a.setAttribute('aria-label', label);
    a.title = label;
    if (key !== 'email') {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    wrap.append(a);
  });
  return wrap;
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function decorate(block) {
  const rows = [...block.children];
  const cellOf = (row) => row.querySelector(':scope > div') || row;

  // Prose row: the one with headings, else the one with the most elements.
  const score = (row) => row.querySelectorAll('h2, h3, ul, ol, table').length * 100
    + cellOf(row).children.length;
  const textRow = rows.reduce((best, row) => (score(row) > score(best) ? row : best), rows[0]);

  let avatar = null;
  const metaLines = [];
  rows.filter((row) => row !== textRow).forEach((row) => {
    const pic = row.querySelector('picture, img');
    if (pic) {
      avatar = pic.closest('picture') || pic;
    } else if (row.textContent.trim()) {
      metaLines.push(cellOf(row).querySelector('p') || cellOf(row));
    }
  });

  const main = document.createElement('div');
  main.className = 'article-body-main';

  // Byline: photo, author, date line + share icons (only when authored).
  if (avatar || metaLines.length) {
    const meta = document.createElement('div');
    meta.className = 'article-body-meta';
    if (avatar) {
      avatar.classList.add('article-body-avatar');
      meta.append(avatar);
    }
    const who = document.createElement('div');
    who.className = 'article-body-byline';
    metaLines.forEach((line, i) => {
      line.classList.add(i === 0 ? 'article-body-author' : 'article-body-dateline');
      who.append(line);
    });
    meta.append(who, shareIcons());
    main.append(meta);
  }

  // Prose: hoist out of the row/cell scaffold.
  const cell = cellOf(textRow);
  while (cell.firstChild) main.append(cell.firstChild);
  main.querySelectorAll('table').forEach((t) => t.classList.add('article-body-table'));

  // Closing share row.
  const share = document.createElement('div');
  share.className = 'article-body-share';
  const shareTitle = document.createElement('h3');
  shareTitle.className = 'article-body-share-title';
  shareTitle.textContent = 'Share with your friends...';
  share.append(shareTitle, shareIcons());
  main.append(share);

  // "Article contents" sidebar from the h2s.
  const headings = [...main.querySelectorAll('h2')].filter((h) => h.textContent.trim());
  block.textContent = '';
  if (headings.length) {
    const toc = document.createElement('nav');
    toc.className = 'article-body-toc';
    toc.setAttribute('aria-label', 'Article contents');
    const tocTitle = document.createElement('h3');
    tocTitle.className = 'article-body-toc-title';
    tocTitle.textContent = 'Article contents';
    const list = document.createElement('ul');
    headings.forEach((h) => {
      if (!h.id) h.id = slug(h.textContent);
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent.trim();
      li.append(a);
      list.append(li);
    });
    toc.append(tocTitle, list);
    block.append(toc);
    block.classList.add('has-toc');
  }
  block.append(main);
}
