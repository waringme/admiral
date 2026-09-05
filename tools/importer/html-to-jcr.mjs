/*
 * Convert an EDS .plain.html content file to xwalk JCR page XML.
 *
 * Pipeline: .plain.html  →  helix-html2md  →  helix-md2jcr (project models)  →  JCR XML
 *
 * Usage:
 *   node tools/importer/html-to-jcr.mjs <input.plain.html> <output.xml>
 *
 * Uses the project's component-models.json / component-definition.json /
 * component-filters.json so custom blocks map to their correct resource types
 * and model fields.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const H2M = '/home/node/.excat-marketplaces/excat-marketplace/excat/tools/excatops-mcp/node_modules/@adobe/helix-html2md/src/index.js';
const M2J = '/home/node/.excat-marketplaces/excat-marketplace/excat/hooks/import-validator/node_modules/@adobe/helix-md2jcr/src/index.js';

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error('Usage: node html-to-jcr.mjs <input.plain.html> <output.xml>');
  process.exit(1);
}

const { html2md } = await import(H2M);
const { md2jcr } = await import(M2J);

const models = JSON.parse(readFileSync('component-models.json', 'utf8'));
const definition = JSON.parse(readFileSync('component-definition.json', 'utf8'));
const filters = JSON.parse(readFileSync('component-filters.json', 'utf8'));

// The .plain.html fragment has no <main>; html2md selects <main>, so wrap it.
const fragment = readFileSync(inPath, 'utf8');
const html = `<!DOCTYPE html><html><body><main>${fragment}</main></body></html>`;

const log = {
  info: () => {}, warn: (...a) => console.warn(...a), error: (...a) => console.error(...a), debug: () => {},
};

const md = await html2md(html, { log, url: 'https://admiral.com/', mediaHandler: undefined });
const xml = await md2jcr(md, { models, definition, filters });

writeFileSync(outPath, xml);
console.log(`Wrote ${outPath} (${xml.length} bytes)`);
