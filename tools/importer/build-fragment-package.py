"""Build a single-fragment JCR package: the footer, the nav or the home page
(one at a time, so installing one never overwrites another).

The published site fetches /footer.plain.html and /nav.plain.html, which
paths.json maps to /content/admiral/{footer,nav}; the language-master copies
under /content/admiral/language-masters/en/ are kept in step.

usage (from the repo root):
  node tools/importer/html-to-jcr.mjs content/footer.plain.html migration-work/jcr-new/footer.xml
  python3 tools/importer/build-footer-package.py            # footer (default)
  node tools/importer/html-to-jcr.mjs content/nav.plain.html migration-work/jcr-new/nav.xml
  python3 tools/importer/build-footer-package.py nav
  node tools/importer/html-to-jcr.mjs content/index.plain.html migration-work/jcr-new/index-check.xml
  python3 tools/importer/build-fragment-package.py home

"home" replaces only the home page's own jcr:content (the language-master
root /content/admiral/language-masters/en, served as /); the pages under it
(black-box-insurance, nav, footer, ...) are left alone.
"""
import sys
import zipfile
from pathlib import Path

FRAGMENT = sys.argv[1] if len(sys.argv) > 1 else 'footer'
VERSIONS = {'footer': '2', 'nav': '2', 'home': '2'}
DESCRIPTIONS = {
    'footer': 'Admiral footer only (Explore our website links, social icons, legal)',
    'nav': 'Admiral nav only (mega-menu, utility links incl. mobile-only app + breakdown rows)',
    'home': 'Admiral home page content only (award banner heading line break)',
}
HOME = FRAGMENT == 'home'
SRC = Path('migration-work/jcr-new/index-check.xml' if HOME else f'migration-work/jcr-new/{FRAGMENT}.xml')
OUT = Path(f'tools/importer/jcr-package/admiral-{FRAGMENT}-v{VERSIONS[FRAGMENT]}.zip')
ROOTS = [f'/content/admiral/{FRAGMENT}', f'/content/admiral/language-masters/en/{FRAGMENT}']
# The home page is the language-master root itself: write its .content.xml
# there, but filter to its jcr:content so child pages aren't touched.
FILES = ['/content/admiral/language-masters/en'] if HOME else ROOTS
if HOME:
    ROOTS = ['/content/admiral/language-masters/en/jcr:content']

xml = SRC.read_text(encoding='utf-8')
filters = '\n'.join(f'  <filter root="{r}"/>' for r in ROOTS)
filter_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
{filters}
</workspaceFilter>
'''
props = f'''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <comment>FileVault Package Definition</comment>
  <entry key="name">admiral-{FRAGMENT}</entry>
  <entry key="group">waringme</entry>
  <entry key="version">{VERSIONS[FRAGMENT]}.0.0</entry>
  <entry key="description">{DESCRIPTIONS[FRAGMENT]} at {', '.join(ROOTS)}. Touches nothing else.</entry>
  <entry key="packageType">content</entry>
</properties>
'''
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    for r in FILES:
        z.writestr(f'jcr_root{r}/.content.xml', xml)
    z.writestr('META-INF/vault/filter.xml', filter_xml)
    z.writestr('META-INF/vault/properties.xml', props)

# Keep the checked-in unpacked copy in step.
UNPACKED = 'tools/importer/jcr-package/jcr_root/content/admiral/language-masters/en'
Path(f'{UNPACKED}/.content.xml' if HOME else f'{UNPACKED}/{FRAGMENT}/.content.xml').write_text(xml, encoding='utf-8')
print('Wrote', OUT)
