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

  // tools/importer/import-guide.js
  var import_guide_exports = {};
  __export(import_guide_exports, {
    default: () => import_guide_default
  });

  // tools/importer/parsers/article-body.js
  function parse(element, { document: document2 }) {
    const hinted = (fieldName, ...nodes2) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      nodes2.filter(Boolean).forEach((n) => frag.appendChild(n));
      return frag;
    };
    const source = element.querySelector(".story") || element;
    const body = source.cloneNode(true);
    body.querySelectorAll(
      ".fixed-content, .story__meta, .story__share, .story__social, .magazine-story__meta-avatar, script, style"
    ).forEach((n) => n.remove());
    body.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
      if (!h.textContent.trim() && !h.querySelector("img")) h.remove();
    });
    const nodes = Array.from(body.childNodes).filter((n) => {
      var _a;
      if (n.nodeType === 3) return n.textContent.trim().length > 0;
      return (n.textContent || "").trim().length > 0 || ((_a = n.querySelector) == null ? void 0 : _a.call(n, "img"));
    });
    if (!nodes.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[hinted("text", ...nodes)]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "article-body", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document: document2 }) {
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

  // tools/importer/parsers/breadcrumb.js
  function parse3(element, { document: document2 }) {
    var _a;
    const hinted = (fieldName, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
      return frag;
    };
    const textOf = (el) => el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    const container = ((_a = element.matches) == null ? void 0 : _a.call(element, '[class*="breadcrumb"], nav, ol, ul')) ? element : element.querySelector('[class*="breadcrumb"], nav[aria-label*="readcrumb" i], ol.breadcrumb, ul.breadcrumb');
    let links = [];
    if (container) {
      links = Array.from(container.querySelectorAll("a[href]")).filter((a) => textOf(a));
    }
    const cells = [];
    const pushItem = (labelText, href) => {
      const labelCell = labelText ? hinted("label", document2.createTextNode(labelText)) : "";
      let linkCell = "";
      if (href) {
        const a = document2.createElement("a");
        a.setAttribute("href", href);
        a.textContent = href;
        linkCell = hinted("link", a);
      }
      cells.push([labelCell, linkCell]);
    };
    if (links.length) {
      links.forEach((a) => pushItem(textOf(a), a.getAttribute("href") || ""));
    } else {
      pushItem("Home", "/");
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "breadcrumb", cells });
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

  // tools/importer/import-guide.js
  var parsers = {
    "article-body": parse,
    "cards-article": parse2,
    breadcrumb: parse3
  };
  var PAGE_TEMPLATE = {
    name: "guide",
    description: "Admiral long-form magazine guide: breadcrumb + title header, article body, related-guide cards.",
    urls: [
      "https://www.admiral.com/magazine/guides/van-insurance/which-class-of-use"
    ],
    blocks: [
      { name: "article-body", instances: ["#block-admiral-annie-content > div.magazine-story > div.magazine-story__body"] },
      { name: "cards-article", instances: ["#block-admiral-annie-content > div.views-element-container .grid"] }
    ],
    sections: [
      { id: "title-header", name: "Title header", selector: "#block-admiral-annie-content > div.magazine-story > div.magazine-story__title", style: null, blocks: [], defaultContent: ["#block-admiral-annie-content > div.magazine-story > div.magazine-story__title"] },
      { id: "article-body", name: "Article body", selector: "#block-admiral-annie-content > div.magazine-story > div.magazine-story__body", style: null, blocks: ["article-body"], defaultContent: [] },
      { id: "related-guides", name: "Related guides", selector: "#block-admiral-annie-content > div.views-element-container", style: null, blocks: ["cards-article"], defaultContent: [] }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    const transformers = [
      transform,
      ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
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
  function prependBreadcrumb(document2, main, url) {
    const segments = new URL(url).pathname.replace(/\/$/, "").split("/").filter(Boolean);
    if (!segments.length) return;
    const rows = [["Home", "/"]];
    let acc = "";
    segments.forEach((seg, i) => {
      acc += `/${seg}`;
      const label = seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      rows.push(i === segments.length - 1 ? [label, ""] : [label, acc]);
    });
    const container = document2.createElement("div");
    const cells = [["Breadcrumb"], ...rows];
    const block = WebImporter.DOMUtils.createTable ? WebImporter.DOMUtils.createTable(cells, document2) : WebImporter.Blocks.createBlock(document2, { name: "breadcrumb", cells: rows });
    container.append(block);
    main.prepend(container);
  }
  var import_guide_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      try {
        prependBreadcrumb(document2, main, params.originalURL || url);
      } catch (e) {
        console.error("Breadcrumb synthesis failed:", e);
      }
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
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_guide_exports);
})();
