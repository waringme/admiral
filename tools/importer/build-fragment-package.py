"""Build a single-fragment JCR package: the footer or the nav (never both,
so installing one never overwrites the other).

The published site fetches /footer.plain.html and /nav.plain.html, which
paths.json maps to /content/admiral/{footer,nav}; the language-master copies
under /content/admiral/language-masters/en/ are kept in step.

usage (from the repo root):
  node tools/importer/html-to-jcr.mjs content/footer.plain.html migration-work/jcr-new/footer.xml
  python3 tools/importer/build-footer-package.py            # footer (default)
  node tools/importer/html-to-jcr.mjs content/nav.plain.html migration-work/jcr-new/nav.xml
  python3 tools/importer/build-footer-package.py nav
"""
import sys
import zipfile
from pathlib import Path

FRAGMENT = sys.argv[1] if len(sys.argv) > 1 else 'footer'
VERSIONS = {'footer': '2', 'nav': '2'}
DESCRIPTIONS = {
    'footer': 'Admiral footer only (Explore our website links, social icons, legal)',
    'nav': 'Admiral nav only (mega-menu, utility links incl. mobile-only app + breakdown rows)',
}
SRC = Path(f'migration-work/jcr-new/{FRAGMENT}.xml')
OUT = Path(f'tools/importer/jcr-package/admiral-{FRAGMENT}-v{VERSIONS[FRAGMENT]}.zip')
ROOTS = [f'/content/admiral/{FRAGMENT}', f'/content/admiral/language-masters/en/{FRAGMENT}']

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
  <entry key="description">{DESCRIPTIONS[FRAGMENT]} at {ROOTS[0]} (web /{FRAGMENT}) and {ROOTS[1]}. Touches nothing else.</entry>
  <entry key="packageType">content</entry>
</properties>
'''
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    for r in ROOTS:
        z.writestr(f'jcr_root{r}/.content.xml', xml)
    z.writestr('META-INF/vault/filter.xml', filter_xml)
    z.writestr('META-INF/vault/properties.xml', props)

# Keep the checked-in unpacked copy in step.
Path(f'tools/importer/jcr-package/jcr_root/content/admiral/language-masters/en/{FRAGMENT}/.content.xml').write_text(xml, encoding='utf-8')
print('Wrote', OUT)
