/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroTrustParser from './parsers/hero-trust.js';
import cardsProductParser from './parsers/cards-product.js';
import comparisonTableParser from './parsers/comparison-table.js';
import cardsArticleParser from './parsers/cards-article.js';
import awardBannerParser from './parsers/award-banner.js';
import accordionParser from './parsers/accordion.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/admiral-cleanup.js';
import sectionsTransformer from './transformers/admiral-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-trust': heroTrustParser,
  'cards-product': cardsProductParser,
  'comparison-table': comparisonTableParser,
  'cards-article': cardsArticleParser,
  'award-banner': awardBannerParser,
  accordion: accordionParser,
};

// PAGE-AWARE TEMPLATE CONFIGS. The three "landing" pages use different element
// IDs, so each URL path gets its own block + section map (derived from
// per-page analysis). findBlocksOnPage skips selectors absent on the page.
const TEMPLATES = {
  // --- black-box-insurance (product landing) --------------------------------
  '/black-box-insurance': {
    name: 'landing',
    blocks: [
      { name: 'hero-trust', instances: ['#hero-banner-5509'] },
      { name: 'comparison-table', instances: ['#basic-18312 table.general'] },
      { name: 'steps-list', instances: ['#basic-18084 table.general'] },
      { name: 'feature-grid', instances: ['#basic-18083 .grid--badges', 'table.table-list--badges'] },
      { name: 'media-panels', instances: ['#basic-13176 .grid'] },
      { name: 'cards-article', instances: ['#product-pods-13189 .grid'] },
      { name: 'award-banner', instances: ['#reusable-block-13191'] },
      { name: 'accordion', instances: ['#faqs-13193 .accordion', '#basic-13192 .accordion'] },
    ],
    sections: [
      { id: 'hero', name: 'Hero banner', selector: '#hero-banner-5509', style: null, blocks: ['hero-trust'], defaultContent: [] },
      { id: 'intro-prose', name: 'Intro prose + image', selector: '#side-image-13170', style: null, blocks: [], defaultContent: ['#side-image-13170'] },
      { id: 'products-prose', name: 'Black box products (media panels)', selector: '#basic-13176', style: 'centered', blocks: ['media-panels'], defaultContent: ['#basic-13176 > div:first-child'] },
      { id: 'cover-and-steps', name: "What's covered (comparison table)", selector: '#basic-18312', style: null, blocks: ['comparison-table'], defaultContent: ['#basic-18312 > div:nth-of-type(1)'] },
      { id: 'measure-badges', name: 'What LittleBox measures (feature grid)', selector: '#basic-18083', style: 'grey', blocks: ['feature-grid'], defaultContent: [] },
      { id: 'spacer', name: 'Steps (numbered process rows)', selector: '#basic-18084', style: null, blocks: ['steps-list'], defaultContent: [] },
      { id: 'why-littlebox', name: 'Is black box for me (feature grid)', selector: '#paragraph-16063', style: 'grey', blocks: ['feature-grid'], defaultContent: ['#paragraph-16063 > div.text-center'] },
      { id: 'different-kind-cta', name: 'Different kind CTA', selector: '#basic-13181', style: null, blocks: [], defaultContent: ['#basic-13181'] },
      { id: 'articles', name: 'Latest articles', selector: '#product-pods-13189', style: null, blocks: ['cards-article'], defaultContent: ['#product-pods-13189 > div.container.container--responsive-tablet > div.text-center'] },
      { id: 'van-insurance', name: 'Van insurance (side image)', selector: '#side-image-13190', style: null, blocks: [], defaultContent: ['#side-image-13190'] },
      { id: 'award-banner', name: 'Award banner', selector: '#reusable-block-13191', style: 'dark', blocks: ['award-banner'], defaultContent: [] },
      { id: 'faq', name: 'FAQ accordion', selector: '#faqs-13193', style: null, blocks: ['accordion'], defaultContent: [] },
      { id: 'driver-options', name: 'What sort of driver (prose)', selector: '#reusable-block-13195', style: null, blocks: [], defaultContent: ['#reusable-block-13195'] },
      { id: 'explore', name: 'Explore link directory', selector: '#basic-13196', style: null, blocks: [], defaultContent: ['#basic-13196'] },
    ],
  },

  // --- black-box-insurance/littlebox (product landing) ----------------------
  '/black-box-insurance/littlebox': {
    name: 'landing',
    blocks: [
      { name: 'hero-trust', instances: ['#basic-18961'] },
      { name: 'feature-grid', instances: ['#basic-18964 .grid', '#basic-18966 table', '#basic-18967 .grid'] },
      { name: 'cards-article', instances: ['#basic-18968 .grid', '#basic-18970 .grid'] },
      { name: 'accordion', instances: ['#basic-18971 .accordion'] },
    ],
    sections: [
      { id: 'hero', name: 'Hero banner', selector: '#basic-18961', style: null, blocks: ['hero-trust'], defaultContent: [] },
      { id: 'intro', name: "What's Admiral LittleBox (side-image)", selector: '#basic-18963', style: null, blocks: [], defaultContent: ['#basic-18963'] },
      { id: 'install-steps', name: 'How is LittleBox installed (feature grid)', selector: '#basic-18964', style: null, blocks: ['feature-grid'], defaultContent: ['#basic-18964 > div.container'] },
      { id: 'how-works', name: 'How does LittleBox work (prose)', selector: '#basic-18965', style: null, blocks: [], defaultContent: ['#basic-18965'] },
      { id: 'measures', name: 'What does LittleBox measure (feature grid)', selector: '#basic-18966', style: 'grey', blocks: ['feature-grid'], defaultContent: ['#basic-18966 > div.wrapper'] },
      { id: 'feedback', name: 'How do I get feedback (feature grid)', selector: '#basic-18967', style: null, blocks: ['feature-grid'], defaultContent: ['#basic-18967 > div.container'] },
      { id: 'more-products', name: 'Looking for more (content pods)', selector: '#basic-18968', style: null, blocks: ['cards-article'], defaultContent: ['#basic-18968 > div.container'] },
      { id: 'van-cta', name: 'Black box for van drivers (side-image)', selector: '#basic-18969', style: null, blocks: [], defaultContent: ['#basic-18969'] },
      { id: 'guides', name: 'Useful guides (article cards)', selector: '#basic-18970', style: null, blocks: ['cards-article'], defaultContent: ['#basic-18970 > div.wrapper > div.container.container--responsive-tablet > div.text-center'] },
      { id: 'faq', name: 'FAQ accordion', selector: '#basic-18971', style: null, blocks: ['accordion'], defaultContent: [] },
    ],
  },

  // --- resources/motor-hub/van-advice (resource hub) ------------------------
  '/resources/motor-hub/van-advice': {
    name: 'landing',
    blocks: [
      { name: 'hero-trust', instances: ['#basic-19070'] },
      {
        name: 'cards-article',
        instances: [
          '#basic-19071 .grid', '#basic-19072 .grid', '#basic-19073 .grid',
          '#basic-19074 .grid', '#basic-19075 .grid', '#basic-19076 .grid',
          '#basic-19077 .grid', '#basic-19078 .grid',
        ],
      },
    ],
    sections: [
      { id: 'hero', name: 'Hero banner', selector: '#basic-19070', style: null, blocks: ['hero-trust'], defaultContent: [] },
      { id: 'featured', name: 'Featured row', selector: '#basic-19071', style: null, blocks: ['cards-article'], defaultContent: ['#basic-19071 > div.container'] },
      { id: 'grid-1', name: 'Topic grid', selector: '#basic-19072', style: null, blocks: ['cards-article'], defaultContent: ['#basic-19072 > div.wrapper > div.container.container--responsive-tablet > div.text-center'] },
      { id: 'grid-2', name: 'Topic grid', selector: '#basic-19073', style: null, blocks: ['cards-article'], defaultContent: ['#basic-19073 > div.wrapper > div.container.container--responsive-tablet > div.text-center'] },
      { id: 'grid-3', name: 'Topic grid', selector: '#basic-19074', style: null, blocks: ['cards-article'], defaultContent: ['#basic-19074 > div.wrapper > div.container.container--responsive-tablet > div.text-center'] },
      { id: 'grid-4', name: 'Topic grid', selector: '#basic-19075', style: null, blocks: ['cards-article'], defaultContent: ['#basic-19075 > div.wrapper > div.container.container--responsive-tablet > div.text-center'] },
      { id: 'grid-5', name: 'Topic grid', selector: '#basic-19076', style: null, blocks: ['cards-article'], defaultContent: ['#basic-19076 > div.wrapper > div.container.container--responsive-tablet > div.text-center'] },
      { id: 'grid-6', name: 'Topic grid', selector: '#basic-19077', style: null, blocks: ['cards-article'], defaultContent: ['#basic-19077 > div.wrapper > div.container.container--responsive-tablet > div.text-center'] },
      { id: 'grid-7', name: 'Topic grid', selector: '#basic-19078', style: null, blocks: ['cards-article'], defaultContent: ['#basic-19078 > div.wrapper > div.container.container--responsive-tablet > div.text-center'] },
    ],
  },
};

// Fallback (used only if a URL doesn't match a known landing page).
const DEFAULT_TEMPLATE = { name: 'landing', blocks: [], sections: [] };

function templateForUrl(url) {
  let path = '/';
  try {
    path = new URL(url).pathname.replace(/\/$/, '');
  } catch (e) {
    path = url;
  }
  return TEMPLATES[path] || DEFAULT_TEMPLATE;
}

function executeTransformers(hookName, element, payload, template) {
  const enhancedPayload = { ...payload, template };
  const transformers = [
    cleanupTransformer,
    ...(template.sections && template.sections.length > 1 ? [sectionsTransformer] : []),
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

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;
    const template = templateForUrl(params.originalURL || url);

    executeTransformers('beforeTransform', main, payload, template);

    const pageBlocks = findBlocksOnPage(document, template);
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

    executeTransformers('afterTransform', main, payload, template);

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
        template: template.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
