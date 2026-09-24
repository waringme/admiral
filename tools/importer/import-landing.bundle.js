/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-landing.js
  var import_landing_exports = {};
  __export(import_landing_exports, {
    default: () => import_landing_default
  });

  // tools/importer/parsers/hero-trust.js
  function parse(element, { document: document2 }) {
    const copy = element.querySelector(".hero-banner__copy, .hero-background, .container");
    element.querySelectorAll("style, script").forEach((n) => n.remove());
    const allImages = Array.from(element.querySelectorAll("img"));
    const bgImage = allImages.find((img) => !copy || !copy.contains(img)) || allImages[0] || null;
    const heading = element.querySelector('h1, h2, h3, h4, [class*="copy"] :is(h1,h2,h3,h4)');
    const subheading = element.querySelector('.hero-banner__copy p, .hero-background p, [class*="copy"] p, p');
    const cta = element.querySelector('.buttons a, a.button, a[class*="button"], a[href]');
    if (!heading && !subheading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const hinted = (fieldName, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
      return frag;
    };
    const textNodes = [];
    if (heading) textNodes.push(heading);
    if (subheading) textNodes.push(subheading);
    let label = null;
    if (cta && cta.textContent.trim()) {
      label = document2.createElement("span");
      label.textContent = cta.textContent.trim();
    }
    let link = null;
    if (cta && cta.getAttribute("href")) {
      link = document2.createElement("a");
      link.setAttribute("href", cta.getAttribute("href"));
      link.textContent = cta.getAttribute("href");
    }
    const cells = [
      [bgImage ? hinted("image", bgImage) : ""],
      [textNodes.length ? hinted("text", ...textNodes) : ""],
      [""],
      // enableunderline
      [""],
      // herolayout
      [""],
      // backgroundstyle
      [label ? hinted("ctalabel", label) : ""],
      [link ? hinted("ctalink", link) : ""]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-trust", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > a.product-grid__item, a.product-grid__item, .product-grid__item"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const hinted = (fieldName, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
      return frag;
    };
    const cells = [];
    const ICONS = "/content/dam/admiral/en/images/icons";
    const slug = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    items.forEach((item) => {
      const href = item.getAttribute("href") || "";
      const labelEl = item.querySelector(".product-grid__text, span");
      const labelText = labelEl ? labelEl.textContent.trim() : item.textContent.trim();
      let iconEl = null;
      if (labelText) {
        iconEl = document2.createElement("img");
        iconEl.setAttribute("src", `${ICONS}/product-${slug(labelText)}.svg`);
        iconEl.setAttribute("alt", labelText);
      }
      const imageCell = iconEl ? hinted("image", iconEl) : "";
      const textFrag = document2.createDocumentFragment();
      if (labelText) {
        const link = document2.createElement("a");
        if (href) link.setAttribute("href", href);
        link.textContent = labelText;
        textFrag.appendChild(link);
      }
      const textCell = textFrag.childNodes.length ? hinted("text", textFrag) : "";
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/comparison-table.js
  function parse3(element, { document: document2 }) {
    const hinted = (fieldName, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
      return frag;
    };
    const textOf = (el) => el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    const isProcessTable = element.classList.contains("table-list") || element.querySelector(":scope th.table-list__heading");
    const rows = Array.from(element.querySelectorAll(":scope > tbody > tr, :scope tbody tr"));
    const cells = [];
    rows.forEach((tr) => {
      let labelText = "";
      let valueCell = "";
      if (isProcessTable) {
        const headingEl = tr.querySelector("th.table-list__heading, th:not(.table-list__badge)");
        labelText = textOf(headingEl);
        const copyEl = tr.querySelector("td");
        if (copyEl && textOf(copyEl)) {
          valueCell = hinted("value", ...Array.from(copyEl.childNodes).map((n) => n.cloneNode(true)));
        }
      } else {
        const th = tr.querySelector("th");
        const td = tr.querySelector("td");
        labelText = textOf(th);
        if (td) {
          const tick = td.querySelector('[class*="tick"]');
          const cross = td.querySelector('[class*="cross"]');
          if (tick) {
            valueCell = hinted("value", document2.createTextNode("yes"));
          } else if (cross) {
            valueCell = hinted("value", document2.createTextNode("no"));
          } else if (textOf(td)) {
            valueCell = hinted("value", ...Array.from(td.childNodes).map((n) => n.cloneNode(true)));
          }
        }
      }
      if (!labelText && !valueCell) return;
      const labelCell = labelText ? hinted("label", document2.createTextNode(labelText)) : "";
      cells.push([labelCell, valueCell || ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "comparison-table", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(".pod, .grid__cell .pod"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll(":scope > .grid__cell, .grid__cell"));
    }
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const hinted = (fieldName, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
      return frag;
    };
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".image img, img");
      const heading = item.querySelector("h1, h2, h3, h4");
      const description = item.querySelector("p");
      const cta = item.querySelector("a[href]");
      const imageCell = img ? hinted("image", img) : "";
      const textNodes = [];
      if (heading) textNodes.push(heading);
      if (description) textNodes.push(description);
      if (cta) textNodes.push(cta);
      const textCell = textNodes.length ? hinted("text", ...textNodes) : "";
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/award-banner.js
  var BADGE_SRC = "https://mktgblobpubaccess1.blob.core.windows.net/eui-frontend-assets/admiral/images/side-images/personal-finance-award-11@2x.png";
  function parse5(element, { document: document2 }) {
    element.querySelectorAll("style, script").forEach((n) => n.remove());
    const textWrap = element.querySelector(".text") || element;
    const heading = textWrap.querySelector("h1, h2, h3, h4");
    const paragraphs = Array.from(textWrap.querySelectorAll("p"));
    if (!heading && !paragraphs.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const hinted = (fieldName, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
      return frag;
    };
    let badge = element.querySelector(".image img, img");
    if (!badge) {
      badge = document2.createElement("img");
      badge.setAttribute("src", BADGE_SRC);
      badge.setAttribute("alt", "Personal Finance Awards - Best Motor Insurer 2024/25");
    }
    const textNodes = [];
    if (heading) textNodes.push(heading);
    paragraphs.forEach((p) => textNodes.push(p));
    const cells = [
      [hinted("image", badge)],
      [textNodes.length ? hinted("text", ...textNodes) : hinted("text")]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "award-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse6(element, { document: document2 }) {
    const hinted = (fieldName, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
      return frag;
    };
    const textOf = (el) => el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    const richFrom = (el) => el ? Array.from(el.childNodes).map((n) => n.cloneNode(true)).filter((n) => {
      var _a;
      return (n.textContent || "").trim() || ((_a = n.querySelector) == null ? void 0 : _a.call(n, "img,a"));
    }) : [];
    const pairs = [];
    const headers = Array.from(element.querySelectorAll(":scope a.accordion__header, a.accordion__header"));
    if (headers.length) {
      headers.forEach((header) => {
        const summaryEl = header.querySelector("h1, h2, h3, h4, h5") || header;
        let panel = header.nextElementSibling;
        while (panel && !panel.classList.contains("accordion__panel")) {
          panel = panel.nextElementSibling;
        }
        pairs.push({ summaryText: textOf(summaryEl), bodyEl: panel });
      });
    } else {
      const pods = Array.from(element.querySelectorAll(":scope .pod--faq, .pod--faq"));
      pods.forEach((pod) => {
        const summaryEl = pod.querySelector("h1, h2, h3, h4, h5, .js-toggle-content");
        const bodyEl = pod.querySelector(".hide > div, .hide") || null;
        pairs.push({ summaryText: textOf(summaryEl), bodyEl });
      });
    }
    const cells = [];
    pairs.forEach(({ summaryText, bodyEl }) => {
      if (!summaryText && !bodyEl) return;
      const summaryCell = summaryText ? hinted("summary", document2.createTextNode(summaryText)) : "";
      const bodyNodes = richFrom(bodyEl);
      const textCell = bodyNodes.length ? hinted("text", ...bodyNodes) : hinted("text");
      cells.push([summaryCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/admiral-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#teconsent",
        "#consent-banner",
        "#block-emergencymessaging",
        "#genesys-thirdparty",
        "#genesys-messenger"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "iframe",
        "meta",
        "link",
        "noscript",
        "source"
      ]);
    }
  }

  // tools/importer/transformers/admiral-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = element.ownerDocument.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-landing.js
  var parsers = {
    "hero-trust": parse,
    "cards-product": parse2,
    "comparison-table": parse3,
    "cards-article": parse4,
    "award-banner": parse5,
    accordion: parse6
  };
  var TEMPLATES = {
    // --- black-box-insurance (product landing) --------------------------------
    "/black-box-insurance": {
      name: "landing",
      blocks: [
        { name: "hero-trust", instances: ["#hero-banner-5509"] },
        { name: "comparison-table", instances: ["#basic-18312 table.general", "table.table-list--badges"] },
        { name: "cards-article", instances: ["#basic-18083 .grid--badges", "#product-pods-13189 .grid"] },
        { name: "award-banner", instances: ["#reusable-block-13191"] },
        { name: "accordion", instances: ["#faqs-13193 .accordion", "#basic-13192 .accordion"] }
      ],
      sections: [
        { id: "hero", name: "Hero banner", selector: "#hero-banner-5509", style: null, blocks: ["hero-trust"], defaultContent: [] },
        { id: "intro-prose", name: "Intro prose + image", selector: "#side-image-13170", style: null, blocks: [], defaultContent: ["#side-image-13170"] },
        { id: "products-prose", name: "Black box products (side-image panels)", selector: "#basic-13176", style: null, blocks: [], defaultContent: ["#basic-13176"] },
        { id: "cover-and-steps", name: "What's covered (comparison table)", selector: "#basic-18312", style: null, blocks: ["comparison-table"], defaultContent: ["#basic-18312 > div:nth-of-type(1)"] },
        { id: "measure-badges", name: "What LittleBox measures (badges)", selector: "#basic-18083", style: "grey", blocks: ["cards-article"], defaultContent: [] },
        { id: "spacer", name: "Steps table", selector: "#basic-18084", style: null, blocks: ["comparison-table"], defaultContent: [] },
        { id: "why-littlebox", name: "Is black box for me (badge table)", selector: "#paragraph-16063", style: "grey", blocks: ["comparison-table"], defaultContent: ["#paragraph-16063 > div.text-center"] },
        { id: "different-kind-cta", name: "Different kind CTA", selector: "#basic-13181", style: null, blocks: [], defaultContent: ["#basic-13181"] },
        { id: "articles", name: "Latest articles", selector: "#product-pods-13189", style: null, blocks: ["cards-article"], defaultContent: ["#product-pods-13189 > div.container.container--responsive-tablet > div.text-center"] },
        { id: "van-insurance", name: "Van insurance (side image)", selector: "#side-image-13190", style: null, blocks: [], defaultContent: ["#side-image-13190"] },
        { id: "award-banner", name: "Award banner", selector: "#reusable-block-13191", style: "dark", blocks: ["award-banner"], defaultContent: [] },
        { id: "faq", name: "FAQ accordion", selector: "#faqs-13193", style: null, blocks: ["accordion"], defaultContent: [] },
        { id: "driver-options", name: "What sort of driver (prose)", selector: "#reusable-block-13195", style: null, blocks: [], defaultContent: ["#reusable-block-13195"] },
        { id: "explore", name: "Explore link directory", selector: "#basic-13196", style: null, blocks: [], defaultContent: ["#basic-13196"] }
      ]
    },
    // --- black-box-insurance/littlebox (product landing) ----------------------
    "/black-box-insurance/littlebox": {
      name: "landing",
      blocks: [
        { name: "hero-trust", instances: ["#basic-18961"] },
        { name: "cards-article", instances: ["#basic-18964 .grid", "#basic-18967 .grid", "#basic-18968 .grid", "#basic-18970 .grid"] },
        { name: "comparison-table", instances: ["#basic-18966 table"] },
        { name: "accordion", instances: ["#basic-18971 .accordion"] }
      ],
      sections: [
        { id: "hero", name: "Hero banner", selector: "#basic-18961", style: null, blocks: ["hero-trust"], defaultContent: [] },
        { id: "intro", name: "What's Admiral LittleBox (side-image)", selector: "#basic-18963", style: null, blocks: [], defaultContent: ["#basic-18963"] },
        { id: "install-steps", name: "How is LittleBox installed (steps)", selector: "#basic-18964", style: null, blocks: ["cards-article"], defaultContent: ["#basic-18964 > div.container"] },
        { id: "how-works", name: "How does LittleBox work (prose)", selector: "#basic-18965", style: null, blocks: [], defaultContent: ["#basic-18965"] },
        { id: "measures", name: "What does LittleBox measure (table)", selector: "#basic-18966", style: "grey", blocks: ["comparison-table"], defaultContent: ["#basic-18966 > div.wrapper"] },
        { id: "feedback", name: "How do I get feedback (score badges)", selector: "#basic-18967", style: null, blocks: ["cards-article"], defaultContent: ["#basic-18967 > div.container"] },
        { id: "more-products", name: "Looking for more (content pods)", selector: "#basic-18968", style: null, blocks: ["cards-article"], defaultContent: ["#basic-18968 > div.container"] },
        { id: "van-cta", name: "Black box for van drivers (side-image)", selector: "#basic-18969", style: null, blocks: [], defaultContent: ["#basic-18969"] },
        { id: "guides", name: "Useful guides (article cards)", selector: "#basic-18970", style: null, blocks: ["cards-article"], defaultContent: ["#basic-18970 > div.wrapper > div.container.container--responsive-tablet > div.text-center"] },
        { id: "faq", name: "FAQ accordion", selector: "#basic-18971", style: null, blocks: ["accordion"], defaultContent: [] }
      ]
    },
    // --- resources/motor-hub/van-advice (resource hub) ------------------------
    "/resources/motor-hub/van-advice": {
      name: "landing",
      blocks: [
        { name: "hero-trust", instances: ["#basic-19070"] },
        {
          name: "cards-article",
          instances: [
            "#basic-19071 .grid",
            "#basic-19072 .grid",
            "#basic-19073 .grid",
            "#basic-19074 .grid",
            "#basic-19075 .grid",
            "#basic-19076 .grid",
            "#basic-19077 .grid",
            "#basic-19078 .grid"
          ]
        }
      ],
      sections: [
        { id: "hero", name: "Hero banner", selector: "#basic-19070", style: null, blocks: ["hero-trust"], defaultContent: [] },
        { id: "featured", name: "Featured row", selector: "#basic-19071", style: null, blocks: ["cards-article"], defaultContent: ["#basic-19071 > div.container"] },
        { id: "grid-1", name: "Topic grid", selector: "#basic-19072", style: null, blocks: ["cards-article"], defaultContent: ["#basic-19072 > div.wrapper > div.container.container--responsive-tablet > div.text-center"] },
        { id: "grid-2", name: "Topic grid", selector: "#basic-19073", style: null, blocks: ["cards-article"], defaultContent: ["#basic-19073 > div.wrapper > div.container.container--responsive-tablet > div.text-center"] },
        { id: "grid-3", name: "Topic grid", selector: "#basic-19074", style: null, blocks: ["cards-article"], defaultContent: ["#basic-19074 > div.wrapper > div.container.container--responsive-tablet > div.text-center"] },
        { id: "grid-4", name: "Topic grid", selector: "#basic-19075", style: null, blocks: ["cards-article"], defaultContent: ["#basic-19075 > div.wrapper > div.container.container--responsive-tablet > div.text-center"] },
        { id: "grid-5", name: "Topic grid", selector: "#basic-19076", style: null, blocks: ["cards-article"], defaultContent: ["#basic-19076 > div.wrapper > div.container.container--responsive-tablet > div.text-center"] },
        { id: "grid-6", name: "Topic grid", selector: "#basic-19077", style: null, blocks: ["cards-article"], defaultContent: ["#basic-19077 > div.wrapper > div.container.container--responsive-tablet > div.text-center"] },
        { id: "grid-7", name: "Topic grid", selector: "#basic-19078", style: null, blocks: ["cards-article"], defaultContent: ["#basic-19078 > div.wrapper > div.container.container--responsive-tablet > div.text-center"] }
      ]
    }
  };
  var DEFAULT_TEMPLATE = { name: "landing", blocks: [], sections: [] };
  function templateForUrl(url) {
    let path = "/";
    try {
      path = new URL(url).pathname.replace(/\/$/, "");
    } catch (e) {
      path = url;
    }
    return TEMPLATES[path] || DEFAULT_TEMPLATE;
  }
  function executeTransformers(hookName, element, payload, template) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template });
    const transformers = [
      transform,
      ...template.sections && template.sections.length > 1 ? [transform2] : []
    ];
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_landing_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      const template = templateForUrl(params.originalURL || url);
      executeTransformers("beforeTransform", main, payload, template);
      const pageBlocks = findBlocksOnPage(document2, template);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload, template);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      main.querySelectorAll('img[src*="/content/dam/"], source[srcset*="/content/dam/"], img[src*="/icons/"], source[srcset*="/icons/"]').forEach((el) => {
        ["src", "srcset"].forEach((attr) => {
          const v = el.getAttribute(attr);
          if (v) el.setAttribute(attr, v.replace(/^https?:\/\/[^/]+(\/(content\/dam|icons)\/)/, "$1"));
        });
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: template.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_landing_exports);
})();
