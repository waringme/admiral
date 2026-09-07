/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroTrustParser from './parsers/hero-trust.js';
import cardsProductParser from './parsers/cards-product.js';
import videoAdvertParser from './parsers/video-advert.js';
import columnsNoticeParser from './parsers/columns-notice.js';
import cardsArticleParser from './parsers/cards-article.js';
import awardBannerParser from './parsers/award-banner.js';
import carouselReviewParser from './parsers/carousel-review.js';
import appDownloadParser from './parsers/app-download.js';
import columnsLinksParser from './parsers/columns-links.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/admiral-cleanup.js';
import damImagesTransformer from './transformers/admiral-dam-images.js';
import sectionsTransformer from './transformers/admiral-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-trust': heroTrustParser,
  'cards-product': cardsProductParser,
  'video-advert': videoAdvertParser,
  'columns-notice': columnsNoticeParser,
  'cards-article': cardsArticleParser,
  'award-banner': awardBannerParser,
  'carousel-review': carouselReviewParser,
  'app-download': appDownloadParser,
  'columns-links': columnsLinksParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Admiral.com homepage: hero, product tiles, TV advert video, fake-emails notice, magazine article cards, award banner, testimonials carousel, get-to-know-us copy, app download, explore-website links.',
  urls: [
    'https://www.admiral.com/',
  ],
  blocks: [
    {
      name: 'hero-trust',
      instances: ['#basic-12087'],
    },
    {
      name: 'cards-product',
      instances: [
        '#basic-18119 > div.wrapper.pt-sml > div.container.container--responsive-tablet.pt-sml.pb-sml > div.product-grid',
        '#basic-18119 .product-grid',
      ],
    },
    {
      name: 'video-advert',
      instances: ['#basic-18611'],
    },
    {
      name: 'columns-notice',
      instances: ['#basic-18085'],
    },
    {
      name: 'cards-article',
      instances: [
        '#product-pods-5856 > div.container.container--responsive-tablet.pt-sml > div.grid',
        '#product-pods-5856 .grid',
      ],
    },
    {
      name: 'award-banner',
      instances: ['#reusable-block-16247'],
    },
    {
      name: 'carousel-review',
      instances: ['#testimonials-7343'],
    },
    {
      name: 'app-download',
      instances: ['#basic-10863'],
    },
    {
      name: 'columns-links',
      instances: ['#basic-19327'],
    },
  ],
  sections: [
    { id: 'hero-trust', name: 'Hero (trust banner)', selector: '#basic-12087', style: null, blocks: ['hero-trust'], defaultContent: [] },
    { id: 'product-tiles', name: 'Product tiles', selector: '#basic-18119', style: null, blocks: ['cards-product'], defaultContent: ['#basic-18119 > div.wrapper.pt-sml > div.container.container--responsive-tablet.pt-sml.pb-sml > div:nth-of-type(2)'] },
    { id: 'tv-advert', name: 'TV advert', selector: '#basic-18611', style: null, blocks: ['video-advert'], defaultContent: ['#basic-18611'] },
    { id: 'fake-emails-notice', name: 'Fake emails notice', selector: '#basic-18085', style: null, blocks: ['columns-notice'], defaultContent: [] },
    { id: 'magazine-articles', name: 'Magazine articles', selector: '#product-pods-5856', style: 'grey', blocks: ['cards-article'], defaultContent: ['#product-pods-5856 > div.container.container--responsive-tablet.pt-sml > div.text-center'] },
    { id: 'award-banner', name: 'Award banner', selector: '#reusable-block-16247', style: 'dark', blocks: ['award-banner'], defaultContent: [] },
    { id: 'testimonials', name: 'Testimonials', selector: '#testimonials-7343', style: 'grey', blocks: ['carousel-review'], defaultContent: [] },
    { id: 'get-to-know-us', name: 'Get to know us', selector: '#paragraph-5858', style: null, blocks: [], defaultContent: ['#paragraph-5858'] },
    { id: 'app-download', name: 'App download', selector: '#basic-10863', style: null, blocks: ['app-download'], defaultContent: [] },
    { id: 'explore-website-links', name: 'Explore website links', selector: '#basic-19327', style: 'dark', blocks: ['columns-links'], defaultContent: [] },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  const transformers = [
    cleanupTransformer,
    damImagesTransformer,
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

/**
 * Find all blocks on the page based on the embedded template configuration.
 * De-duplicates by element so overlapping selectors don't parse the same node twice.
 * @param {Document} document
 * @param {Object} template
 * @returns {Array}
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by earlier parser
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

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // Keep packaged DAM references root-relative (adjustImageUrls absolutizes
    // them against the source origin). The home page packages to
    // content/admiral/language-masters/en with assets under /content/dam/admiral/en/images.
    // Also normalize /icons/ references (product-tile SVGs) to root-relative so
    // they load from the site's code bus, not the source origin.
    main.querySelectorAll('img[src*="/content/dam/"], source[srcset*="/content/dam/"], img[src*="/icons/"], source[srcset*="/icons/"]').forEach((el) => {
      ['src', 'srcset'].forEach((attr) => {
        const v = el.getAttribute(attr);
        if (v) el.setAttribute(attr, v.replace(/^https?:\/\/[^/]+(\/(content\/dam|icons)\/)/, '$1'));
      });
    });

    // 6. Generate sanitized path. Map the root/homepage URL to `/index`.
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
