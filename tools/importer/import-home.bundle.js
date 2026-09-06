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

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
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

  // tools/importer/parsers/video-advert.js
  function parse3(element, { document: document2 }) {
    const heading = element.querySelector("h1, h2, h3, h4, h5, h6");
    const iframe = element.querySelector("iframe");
    let videoUrl = "";
    if (iframe) {
      videoUrl = iframe.getAttribute("src") || iframe.getAttribute("data-src") || iframe.getAttribute("data-lazy-src") || "";
    }
    if (!videoUrl) {
      const videoEl = element.querySelector("video source, video");
      if (videoEl) videoUrl = videoEl.getAttribute("src") || "";
    }
    if (!videoUrl) {
      const link = element.querySelector('a[href*="youtube"], a[href*="youtu.be"], a[href*="vimeo"], a[href*=".mp4"]');
      if (link) videoUrl = link.getAttribute("href") || "";
    }
    const hinted = (fieldName, ...nodes) => {
      const frag2 = document2.createDocumentFragment();
      frag2.appendChild(document2.createComment(` field:${fieldName} `));
      nodes.filter(Boolean).forEach((n) => frag2.appendChild(n));
      return frag2;
    };
    const urlSpan = document2.createElement("span");
    urlSpan.textContent = videoUrl;
    const cells = [
      [hinted("videoUrl", urlSpan)]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "video-advert", cells });
    const frag = document2.createDocumentFragment();
    if (heading) {
      const h = document2.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent.trim();
      frag.appendChild(h);
    }
    frag.appendChild(block);
    element.replaceWith(frag);
  }

  // tools/importer/parsers/columns-notice.js
  function parse4(element, { document: document2 }) {
    element.querySelectorAll("style, script").forEach((n) => n.remove());
    const image = element.querySelector(".image img, img");
    const copy = element.querySelector(".copy") || element;
    const heading = copy.querySelector("h1, h2, h3, h4");
    const paragraph = copy.querySelector("p");
    const cta = copy.querySelector("a[href]");
    if (!image && !heading && !paragraph) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const copyCell = [];
    if (heading) copyCell.push(heading);
    if (paragraph) copyCell.push(paragraph);
    if (cta) copyCell.push(cta);
    const cells = [
      [image || "", copyCell.length ? copyCell : ""]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-notice", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
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

  // tools/importer/parsers/columns-award.js
  function parse6(element, { document: document2 }) {
    element.querySelectorAll("style, script").forEach((n) => n.remove());
    const image = element.querySelector(".image img, img");
    const textWrap = element.querySelector(".text") || element;
    const heading = textWrap.querySelector("h1, h2, h3, h4");
    const paragraphs = Array.from(textWrap.querySelectorAll("p"));
    if (!image && !heading && !paragraphs.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCell = [];
    if (heading) textCell.push(heading);
    paragraphs.forEach((p) => textCell.push(p));
    const cells = [
      [image || "", textCell.length ? textCell : ""]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-award", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-review.js
  function parse7(element, { document: document2 }) {
    let slides = Array.from(element.querySelectorAll(".slick-slide:not(.slick-cloned)"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".testimonial")).filter((t) => !t.closest(".slick-cloned"));
    }
    if (!slides.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const hinted = (fieldName, ...nodes) => {
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      nodes.filter(Boolean).forEach((n) => frag.appendChild(n));
      return frag;
    };
    const cells = [
      [""],
      // autoplay
      [""],
      // autoplayInterval
      [""]
      // imageZoom
    ];
    slides.forEach((slide) => {
      const testimonial = slide.querySelector(".testimonial") || slide;
      const img = testimonial.querySelector(".image img, img");
      const quote = testimonial.querySelector(".callout, p.callout");
      const author = testimonial.querySelector(".testimonial__author, h1, h2, h3, h4");
      const location = testimonial.querySelector(".testimonial__location");
      const textNodes = [];
      if (quote) textNodes.push(quote);
      if (author) textNodes.push(author);
      if (location) textNodes.push(location);
      const textCell = textNodes.length ? hinted("text", ...textNodes) : "";
      cells.push([img ? hinted("image", img) : hinted("image"), textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-review", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/app-download.js
  function parse8(element, { document: document2 }) {
    element.querySelectorAll("style, script").forEach((n) => n.remove());
    const copy = element.querySelector(".copy") || element;
    const heading = copy.querySelector("h1, h2, h3, h4");
    const paragraphs = Array.from(copy.querySelectorAll("p"));
    const subtitle = paragraphs.find((p) => p.textContent.trim() && !p.querySelector("a"));
    const appLinks = Array.from(
      copy.querySelectorAll('.app-icons a, a[href*="apps.apple"], a[href*="play.google"]')
    );
    if (!heading && !subtitle && !appLinks.length) {
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
    if (subtitle) textNodes.push(subtitle);
    const cells = [
      [textNodes.length ? hinted("text", ...textNodes) : hinted("text")]
    ];
    appLinks.forEach((a) => {
      const img = a.querySelector("img");
      const href = a.getAttribute("href") || "";
      const imageCell = img ? hinted("image", img) : hinted("image");
      let linkCell = hinted("link");
      if (href) {
        const link = document2.createElement("a");
        link.setAttribute("href", href);
        link.textContent = href;
        linkCell = hinted("link", link);
      }
      cells.push([imageCell, linkCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "app-download", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-links.js
  function parse9(element, { document: document2 }) {
    const container = document2.querySelector(
      'nav[id*="exploreourwebsite"] .page-links, .explore .page-links, .page-links'
    );
    const cols = container ? Array.from(container.querySelectorAll(":scope > .exploreCol, .exploreCol")) : [];
    if (!cols.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const heading = document2.querySelector(".explore > .wrapper > h2, section.explore h2:not(.visually-hidden)");
    const row = cols.map((col) => {
      const list = col.querySelector("ul") || col;
      return list;
    });
    const cells = [];
    if (heading) {
      const headingRow = [heading];
      while (headingRow.length < row.length) headingRow.push("");
      cells.push(headingRow);
    }
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-links", cells });
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

  // tools/importer/transformers/admiral-dam-images.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var DAM_BASE = "/content/dam/admiral/en/images";
  var IMAGE_MAP = {
    "dog-water-bottle.jpg": "dog-water-bottle.jpg",
    "mother-and-daughter-using-a-tablet.jpg": "mother-and-daughter-using-a-tablet.jpg",
    "GettyImages-996496112.jpg": "gettyimages-996496112.jpg",
    "apple-app.svg": "apple-app.svg",
    "google-app.svg": "google-app.svg"
  };
  var TRACKING_HOSTS = ["tracking.audio.thisisdax.com"];
  function basename(src) {
    try {
      const u = new URL(src, "https://www.admiral.com");
      const path = u.pathname;
      return path.substring(path.lastIndexOf("/") + 1);
    } catch (e) {
      return "";
    }
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    element.querySelectorAll("img[src]").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (TRACKING_HOSTS.some((h) => src.includes(h))) {
        const pic = img.closest("picture");
        (pic || img).remove();
        return;
      }
      const name = basename(src);
      if (IMAGE_MAP[name]) {
        img.setAttribute("src", `${DAM_BASE}/${IMAGE_MAP[name]}`);
        const pic = img.closest("picture");
        if (pic) {
          pic.querySelectorAll("source[srcset]").forEach((s) => {
            s.setAttribute("srcset", `${DAM_BASE}/${IMAGE_MAP[name]}`);
          });
        }
      }
    });
  }

  // tools/importer/transformers/admiral-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform3(hookName, element, payload) {
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

  // tools/importer/import-home.js
  var parsers = {
    "hero-trust": parse,
    "cards-product": parse2,
    "video-advert": parse3,
    "columns-notice": parse4,
    "cards-article": parse5,
    "columns-award": parse6,
    "carousel-review": parse7,
    "app-download": parse8,
    "columns-links": parse9
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Admiral.com homepage: hero, product tiles, TV advert video, fake-emails notice, magazine article cards, award banner, testimonials carousel, get-to-know-us copy, app download, explore-website links.",
    urls: [
      "https://www.admiral.com/"
    ],
    blocks: [
      {
        name: "hero-trust",
        instances: ["#basic-12087"]
      },
      {
        name: "cards-product",
        instances: [
          "#basic-18119 > div.wrapper.pt-sml > div.container.container--responsive-tablet.pt-sml.pb-sml > div.product-grid",
          "#basic-18119 .product-grid"
        ]
      },
      {
        name: "video-advert",
        instances: ["#basic-18611"]
      },
      {
        name: "columns-notice",
        instances: ["#basic-18085"]
      },
      {
        name: "cards-article",
        instances: [
          "#product-pods-5856 > div.container.container--responsive-tablet.pt-sml > div.grid",
          "#product-pods-5856 .grid"
        ]
      },
      {
        name: "columns-award",
        instances: ["#reusable-block-16247"]
      },
      {
        name: "carousel-review",
        instances: ["#testimonials-7343"]
      },
      {
        name: "app-download",
        instances: ["#basic-10863"]
      },
      {
        name: "columns-links",
        instances: ["#basic-19327"]
      }
    ],
    sections: [
      { id: "hero-trust", name: "Hero (trust banner)", selector: "#basic-12087", style: null, blocks: ["hero-trust"], defaultContent: [] },
      { id: "product-tiles", name: "Product tiles", selector: "#basic-18119", style: null, blocks: ["cards-product"], defaultContent: ["#basic-18119 > div.wrapper.pt-sml > div.container.container--responsive-tablet.pt-sml.pb-sml > div:nth-of-type(2)"] },
      { id: "tv-advert", name: "TV advert", selector: "#basic-18611", style: null, blocks: ["video-advert"], defaultContent: ["#basic-18611"] },
      { id: "fake-emails-notice", name: "Fake emails notice", selector: "#basic-18085", style: null, blocks: ["columns-notice"], defaultContent: [] },
      { id: "magazine-articles", name: "Magazine articles", selector: "#product-pods-5856", style: "grey", blocks: ["cards-article"], defaultContent: ["#product-pods-5856 > div.container.container--responsive-tablet.pt-sml > div.text-center"] },
      { id: "award-banner", name: "Award banner", selector: "#reusable-block-16247", style: "dark", blocks: ["columns-award"], defaultContent: [] },
      { id: "testimonials", name: "Testimonials", selector: "#testimonials-7343", style: "grey", blocks: ["carousel-review"], defaultContent: [] },
      { id: "get-to-know-us", name: "Get to know us", selector: "#paragraph-5858", style: null, blocks: [], defaultContent: ["#paragraph-5858"] },
      { id: "app-download", name: "App download", selector: "#basic-10863", style: null, blocks: ["app-download"], defaultContent: [] },
      { id: "explore-website-links", name: "Explore website links", selector: "#basic-19327", style: "dark", blocks: ["columns-links"], defaultContent: [] }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    const transformers = [
      transform,
      transform2,
      ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform3] : []
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
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
  return __toCommonJS(import_home_exports);
})();
