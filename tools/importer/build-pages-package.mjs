/**
 * Rebuild the landing + guide JCR content package (admiral-pages-v1.zip).
 *
 * Steps:
 *   1. Rewrite remote image URLs in each generated page XML to /content/dam/...
 *      using migration-work/jcr-new/image-map.json.
 *   2. Copy the rewritten page XML into the package jcr_root at its cq:Page path.
 *   3. Ensure every referenced DAM image has a dam:Asset node (+ original
 *      rendition binary) under jcr_root/content/dam/admiral/en/images/blackbox.
 *      New local images in content/dam/... are staged as fresh assets.
 *
 * Images live in their own DAM sub-folder (images/blackbox) and the package
 * filter covers only that folder, so installing the package never replaces or
 * removes images already in /content/dam/admiral/en/images. Page references
 * to /content/dam/admiral/en/images/<file> are rewritten to the sub-folder.
 *   4. Rezip jcr_root + META-INF into admiral-pages-v1.zip (pages + images).
 *   5. Also write admiral-pages-content-v1.zip: the same pages with no images
 *      (no DAM filter, no assets), for page-only changes. A checked-in hash
 *      list of the packaged images (dam-manifest.json) tells whether any image
 *      was added or changed since the last build, i.e. which zip to install.
 *
 * Run: node tools/importer/build-pages-package.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';

const ROOT = process.cwd();
const JCR_NEW = join(ROOT, 'migration-work/jcr-new');
const PKG = join(ROOT, 'tools/importer/jcr-package-pages');
const JCR_ROOT = join(PKG, 'jcr_root');
const DAM_FOLDER = 'blackbox';
const DAM_DIR = join(JCR_ROOT, 'content/dam/admiral/en/images', DAM_FOLDER);
const LOCAL_DAM = join(ROOT, 'content/dam/admiral/en/images');

// XML file (in jcr-new) -> package cq:Page path.
const PAGES = {
  'black-box-insurance.xml': 'content/admiral/language-masters/en/black-box-insurance',
  'black-box-insurance_littlebox.xml': 'content/admiral/language-masters/en/black-box-insurance/littlebox',
  'resources_motor-hub_van-advice.xml': 'content/admiral/language-masters/en/resources/motor-hub/van-advice',
  'magazine_guides_van-insurance_which-class-of-use.xml': 'content/admiral/language-masters/en/magazine/guides/van-insurance/which-class-of-use',
  // Authoring template skeletons — starter pages authors copy to create new
  // Landing / Guide pages (each pre-populated with that template's blocks).
  'template-landing.xml': 'content/admiral/templates/landing',
  'template-guide.xml': 'content/admiral/templates/guide',
};

const imageMap = JSON.parse(readFileSync(join(JCR_NEW, 'image-map.json'), 'utf8'));
const damBase = `/content/dam/admiral/en/images/${DAM_FOLDER}/`;

// Track every DAM filename referenced by the packaged pages.
const referenced = new Set();

function mime(name) {
  const ext = name.split('.').pop().toLowerCase();
  return { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', gif: 'image/gif', webp: 'image/webp' }[ext] || 'application/octet-stream';
}

function rewrite(xml) {
  let out = xml;
  // Map-based rewrite: remote source URL -> DAM path.
  for (const [url, file] of Object.entries(imageMap)) {
    if (out.includes(url)) {
      out = out.split(url).join(damBase + file);
    }
  }
  // Move top-level DAM refs (/content/dam/…/images/<file>) into the package's
  // own sub-folder — any attribute (image, icon, src, fileReference, …) may
  // carry one.
  const FILE = '([A-Za-z0-9._%@-]+\\.(?:jpg|jpeg|png|svg|gif|webp))';
  out = out.replace(new RegExp(`/content/dam/admiral/en/images/${FILE}`, 'g'), `${damBase}$1`);
  // Collect all DAM refs now present.
  const re = new RegExp(`/content/dam/admiral/en/images/${DAM_FOLDER}/${FILE}`, 'g');
  let m;
  while ((m = re.exec(out)) !== null) referenced.add(decodeURIComponent(m[1]));
  return out;
}

// 1 + 2: rewrite and place page XML.
for (const [xmlFile, pagePath] of Object.entries(PAGES)) {
  const src = join(JCR_NEW, xmlFile);
  if (!existsSync(src)) { console.warn(`SKIP missing ${xmlFile}`); continue; }
  const rewritten = rewrite(readFileSync(src, 'utf8'));
  const dest = join(JCR_ROOT, pagePath, '.content.xml');
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, rewritten);
  console.log(`page  ${pagePath}`);
}

// 3: ensure a dam:Asset node exists for every referenced image.
function ensureAsset(file) {
  const assetDir = join(DAM_DIR, file);
  const contentXml = join(assetDir, '.content.xml');
  const origDir = join(assetDir, '_jcr_content/renditions');
  const original = join(origDir, 'original');
  const originalDir = join(origDir, 'original.dir');
  if (existsSync(original) && existsSync(contentXml)) return 'exists';

  // Need the binary from the local content DAM.
  const localBin = join(LOCAL_DAM, file);
  if (!existsSync(localBin)) return 'no-binary';

  const mt = mime(file);
  mkdirSync(origDir, { recursive: true });
  mkdirSync(originalDir, { recursive: true });
  writeFileSync(contentXml,
`<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:dam="http://www.day.com/dam/1.0" xmlns:dc="http://purl.org/dc/elements/1.1/"
    jcr:primaryType="dam:Asset">
    <jcr:content jcr:primaryType="dam:AssetContent">
        <metadata jcr:primaryType="nt:unstructured" dam:MIMEtype="${mt}" dc:format="${mt}"/>
        <renditions jcr:primaryType="nt:folder"/>
    </jcr:content>
</jcr:root>
`);
  writeFileSync(join(originalDir, '.content.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="nt:file">
    <jcr:content jcr:primaryType="nt:resource" jcr:mimeType="${mt}"/>
</jcr:root>
`);
  copyFileSync(localBin, original);
  return 'added';
}

let added = 0, missing = [];
for (const file of referenced) {
  const r = ensureAsset(file);
  if (r === 'added') { added++; console.log(`asset+ ${file}`); }
  else if (r === 'no-binary') missing.push(file);
}
if (missing.length) console.warn(`\nWARN no local binary for ${missing.length}: ${missing.join(', ')}`);

// 4: rezip (via python3 zipfile — no `zip` binary in this image).
const zipPath = join(PKG, 'admiral-pages-v1.zip');
const pyScript = `
import os, zipfile, sys
base = sys.argv[1]
out = sys.argv[2]
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for top in ('META-INF', 'jcr_root'):
        root = os.path.join(base, top)
        for dp, _dn, fns in os.walk(root):
            for fn in fns:
                fp = os.path.join(dp, fn)
                z.write(fp, os.path.relpath(fp, base))
`;
execFileSync('python3', ['-c', pyScript, PKG, zipPath]);

// 5: pages-only package — same page filters, minus the DAM folder.
const CONTENT_PKG = join(ROOT, 'migration-work/jcr-package-pages-content');
const contentZip = join(PKG, 'admiral-pages-content-v1.zip');
const pageFilters = readFileSync(join(PKG, 'META-INF/vault/filter.xml'), 'utf8')
  .split('\n').filter((l) => !l.includes('/content/dam/')).join('\n');
const contentProps = readFileSync(join(PKG, 'META-INF/vault/properties.xml'), 'utf8')
  .replace('<entry key="name">admiral-pages</entry>', '<entry key="name">admiral-pages-content</entry>')
  .replace(/<entry key="description">[^<]*<\/entry>/, '<entry key="description">Admiral landing + guide pages and templates only (no images).</entry>');
const stageScript = `
import os, shutil, sys
src, dst = sys.argv[1], sys.argv[2]
shutil.rmtree(dst, ignore_errors=True)
skip_dam = lambda d, names: ['dam'] if os.path.basename(d) == 'content' else []
shutil.copytree(os.path.join(src, 'jcr_root'), os.path.join(dst, 'jcr_root'), ignore=skip_dam)
os.makedirs(os.path.join(dst, 'META-INF', 'vault'))
`;
execFileSync('python3', ['-c', stageScript, PKG, CONTENT_PKG]);
writeFileSync(join(CONTENT_PKG, 'META-INF/vault/filter.xml'), pageFilters);
writeFileSync(join(CONTENT_PKG, 'META-INF/vault/properties.xml'), contentProps);
execFileSync('python3', ['-c', pyScript, CONTENT_PKG, contentZip]);

// Which zip to install: compare the packaged images with the last build.
const hashes = {};
readdirSync(DAM_DIR).sort().forEach((d) => {
  const bin = join(DAM_DIR, d, '_jcr_content/renditions/original');
  if (existsSync(bin)) hashes[d] = createHash('sha1').update(readFileSync(bin)).digest('hex');
});
const manifestPath = join(PKG, 'dam-manifest.json');
const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
const changed = Object.keys(hashes).filter((f) => previous[f] !== hashes[f]);
writeFileSync(manifestPath, `${JSON.stringify(hashes, null, 2)}\n`);

console.log(`\nAssets referenced: ${referenced.size}  new: ${added}  total in package: ${Object.keys(hashes).length}`);
console.log(`Wrote ${zipPath}`);
console.log(`Wrote ${contentZip}`);
console.log(changed.length
  ? `Images added/changed since last build (${changed.length}): ${changed.join(', ')}\n=> install admiral-pages-v1.zip`
  : 'No image changes since last build\n=> install admiral-pages-content-v1.zip (pages only)');
