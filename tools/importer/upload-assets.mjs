/*
 * Upload DAM images to AEM via the Assets HTTP API (POST /api/assets/...),
 * which runs the DAM Update Asset workflow automatically — so renditions and
 * metadata generate on ingest and no manual "Reprocess Assets" is needed.
 *
 * Auth: relies on credentials being available to the environment. If a bearer
 * token is present in AEM_TOKEN, it is sent as `Authorization: Bearer`.
 * Usage: node tools/importer/upload-assets.mjs [--dry]
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const AUTHOR = 'https://author-p147324-e2050468.adobeaemcloud.com';
const LOCAL_ROOT = 'content/dam/admiral/en/images';
const DAM_ROOT = '/content/dam/admiral/en/images';
const DRY = process.argv.includes('--dry');

const MIME = (f) => (f.endsWith('.svg') ? 'image/svg+xml'
  : f.endsWith('.png') ? 'image/png'
    : f.endsWith('.jpg') || f.endsWith('.jpeg') ? 'image/jpeg' : 'application/octet-stream');

// Collect files: top-level images + icons/ subfolder (the referenced set).
// Skip stale product-*.svg at the images ROOT (superseded by icons/product-*.svg).
function collect(dir, rel = '') {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const r = rel ? `${rel}/${name}` : name;
    if (statSync(full).isDirectory()) out.push(...collect(full, r));
    else if (/\.(svg|jpe?g|png)$/i.test(name)) {
      const isStaleRootIcon = rel === '' && /^product-.*\.svg$/i.test(name);
      if (!isStaleRootIcon) out.push({ full, rel: r });
    }
  }
  return out;
}

const files = collect(LOCAL_ROOT);
const token = process.env.AEM_TOKEN || '';
const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

let ok = 0; let fail = 0;
for (const f of files) {
  const damPath = `${DAM_ROOT}/${f.rel}`; // e.g. /content/dam/.../icons/product-x.svg
  const parent = damPath.substring(0, damPath.lastIndexOf('/'));
  const fileName = damPath.substring(damPath.lastIndexOf('/') + 1);
  const url = `${AUTHOR}/api/assets/${parent.replace('/content/dam/', '')}/*`;
  if (DRY) { console.log(`DRY ${MIME(f.full)}  ${damPath}`); ok += 1; continue; }
  const body = readFileSync(f.full);
  const resp = await fetch(`${AUTHOR}/api/assets/${parent.replace('/content/dam/', '')}.createasset.html`, {
    method: 'POST',
    headers: { ...authHeader },
    body: (() => {
      const fd = new FormData();
      fd.append('file', new Blob([body], { type: MIME(f.full) }), fileName);
      fd.append('name', fileName);
      return fd;
    })(),
  });
  const status = resp.status;
  if (status >= 200 && status < 300) { ok += 1; console.log(`OK  ${status}  ${damPath}`); }
  else { fail += 1; console.log(`ERR ${status}  ${damPath}`); }
}
console.log(`\n${DRY ? 'DRY-RUN' : 'UPLOAD'}: ${ok} ok, ${fail} failed, of ${files.length}`);
