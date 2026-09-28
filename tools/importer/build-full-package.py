"""Build one JCR package with all the migrated content and its images:
home page, nav, footer, the four landing/guide pages, the two authoring
templates, and every DAM image they use.

Filters are scoped so installing it never removes anything it doesn't own:
- pages, nav, footer, templates: replace (each page is exactly as packaged)
- home page: only its own jcr:content (the pages under /en are separate roots)
- images: mode="update" on /content/dam/admiral/en/images, so packaged images
  are added/updated and other images already in that folder are kept

usage (from the repo root, after regenerating the page XML):
  node tools/importer/build-pages-package.mjs        # refreshes the pages + images tree
  python3 tools/importer/build-full-package.py
"""
import re
import zipfile
from pathlib import Path

VERSION = '1'
OUT = Path(f'tools/importer/jcr-package/admiral-all-v{VERSION}.zip')
JCR_NEW = Path('migration-work/jcr-new')
PAGES_ROOT = Path('tools/importer/jcr-package-pages/jcr_root')
HOME_ASSETS_ZIP = Path('tools/importer/jcr-package/admiral-home-v1.9.zip')
EN = '/content/admiral/language-masters/en'
DAM = '/content/dam/admiral/en/images'

FILTERS = [
    (f'{EN}/jcr:content', ''),
    ('/content/admiral/nav', ''),
    ('/content/admiral/footer', ''),
    (f'{EN}/nav', ''),
    (f'{EN}/footer', ''),
    (f'{EN}/black-box-insurance', ''),
    (f'{EN}/resources/motor-hub/van-advice', ''),
    (f'{EN}/magazine/guides/van-insurance/which-class-of-use', ''),
    ('/content/admiral/templates', ''),
    (DAM, ' mode="update"'),
]

files = {}  # zip path -> bytes

# Home page, nav and footer (nav/footer at the served fragment path and the
# language-master copy, as in the single-fragment packages).
files[f'jcr_root{EN}/.content.xml'] = (JCR_NEW / 'index-check.xml').read_bytes()
for frag in ('nav', 'footer'):
    xml = (JCR_NEW / f'{frag}.xml').read_bytes()
    files[f'jcr_root/content/admiral/{frag}/.content.xml'] = xml
    files[f'jcr_root{EN}/{frag}/.content.xml'] = xml

# Landing/guide pages, templates and their images (images/blackbox).
for p in PAGES_ROOT.rglob('*'):
    if p.is_file():
        files['jcr_root/' + p.relative_to(PAGES_ROOT).as_posix()] = p.read_bytes()

# Home page images (top level of images/ and images/icons).
with zipfile.ZipFile(HOME_ASSETS_ZIP) as z:
    for n in z.namelist():
        if n.startswith(f'jcr_root{DAM}/'):
            files[n] = z.read(n)

# Every DAM image the pages reference must be in the package.
assets = {m.group(1) for n in files
          if (m := re.match(r'jcr_root(/content/dam/.+?\.(?:png|jpe?g|svg|webp|gif))/', n, re.I))}
missing = set()
for n, data in files.items():
    if n.endswith('.content.xml') and '/content/dam/' not in n:
        for ref in re.findall(r'/content/dam/[^"&;]+?\.(?:png|jpe?g|svg|webp|gif)', data.decode('utf-8'), re.I):
            if ref not in assets:
                missing.add(ref)
if missing:
    raise SystemExit(f'Missing DAM assets: {sorted(missing)}')

filter_xml = '<?xml version="1.0" encoding="UTF-8"?>\n<workspaceFilter version="1.0">\n' + ''.join(
    f'  <filter root="{root}"{mode}/>\n' for root, mode in FILTERS) + '</workspaceFilter>\n'
props = f'''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <comment>FileVault Package Definition</comment>
  <entry key="name">admiral-all</entry>
  <entry key="group">waringme</entry>
  <entry key="version">{VERSION}.0.0</entry>
  <entry key="description">All migrated Admiral content: home page, nav, footer, Black Box, LittleBox, Van advice, Which class of use guide, Landing/Guide templates, and their {len(assets)} images. Images are added/updated only (nothing else in the DAM folder is removed).</entry>
  <entry key="packageType">content</entry>
</properties>
'''

with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('META-INF/vault/filter.xml', filter_xml)
    z.writestr('META-INF/vault/properties.xml', props)
    for n in sorted(files):
        z.writestr(n, files[n])

pages = sorted(n[len('jcr_root'):-len('/.content.xml')] for n in files
               if n.endswith('/.content.xml') and '/content/dam/' not in n)
print(f'Wrote {OUT} ({OUT.stat().st_size // 1024} KB)')
print(f'{len(pages)} pages/fragments, {len(assets)} images')
for p in pages:
    print('  ', p)
