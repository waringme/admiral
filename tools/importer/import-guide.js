/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import articleBodyParser from './parsers/article-body.js';
import cardsArticleParser from './parsers/cards-article.js';
import breadcrumbParser from './parsers/breadcrumb.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/admiral-cleanup.js';
import sectionsTransformer from './transformers/admiral-sections.js';

// PARSER REGISTRY
const parsers = {
  'article-body': articleBodyParser,
  'cards-article': cardsArticleParser,
  breadcrumb: breadcrumbParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json ("guide").
const PAGE_TEMPLATE = {
  name: 'guide',
  description: 'Admiral long-form magazine guide: breadcrumb + title header, article body, related-guide cards.',
  urls: [
    'https://www.admiral.com/magazine/guides/van-insurance/which-class-of-use',
  ],
  blocks: [
    { name: 'article-body', instances: ['#block-admiral-annie-content > div.magazine-story > div.magazine-story__body'] },
    { name: 'cards-article', instances: ['#block-admiral-annie-content > div.views-element-container .grid'] },
  ],
  sections: [
    { id: 'title-header', name: 'Title header', selector: '#block-admiral-annie-content > div.magazine-story > div.magazine-story__title', style: null, blocks: [], defaultContent: ['#block-admiral-annie-content > div.magazine-story > div.magazine-story__title'] },
    { id: 'article-body', name: 'Article body', selector: '#block-admiral-annie-content > div.magazine-story > div.magazine-story__body', style: null, blocks: ['article-body'], defaultContent: [] },
    { id: 'related-guides', name: 'Related guides', selector: '#block-admiral-annie-content > div.views-element-container', style: null, blocks: ['cards-article'], defaultContent: [] },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  const transformers = [
    cleanupTransformer,
    ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  ];
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Build an authored breadcrumb trail from the URL path and prepend it to the
 * content. The source guide page has no breadcrumb markup, so synthesize one:
 * Home / <segment> / <segment> ... with the final (current) segment unlinked.
 */
function prependBreadcrumb(document, main, url) {
  const segments = new URL(url).pathname.replace(/\/$/, '').split('/').filter(Boolean);
  if (!segments.length) return;

  const rows = [['Home', '/']];
  let acc = '';
  segments.forEach((seg, i) => {
    acc += `/${seg}`;
    const label = seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    // last segment is the current page — no link
    rows.push(i === segments.length - 1 ? [label, ''] : [label, acc]);
  });

  const container = document.createElement('div');
  const cells = [['Breadcrumb'], ...rows];
  const block = WebImporter.DOMUtils.createTable
    ? WebImporter.DOMUtils.createTable(cells, document)
    : WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells: rows });
  container.append(block);
  main.prepend(container);
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    // Authored breadcrumb (no source markup) — synthesized from the URL path.
    try {
      prependBreadcrumb(document, main, params.originalURL || url);
    } catch (e) {
      console.error('Breadcrumb synthesis failed:', e);
    }

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    main.querySelectorAll('img[src*="/content/dam/"], source[srcset*="/content/dam/"], img[src*="/icons/"], source[srcset*="/icons/"]').forEach((el) => {
      ['src', 'srcset'].forEach((attr) => {
        const v = el.getAttribute(attr);
        if (v) el.setAttribute(attr, v.replace(/^https?:\/\/[^/]+(\/(content\/dam|icons)\/)/, '$1'));
      });
    });

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
