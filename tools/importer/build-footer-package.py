"""Build the footer-only JCR package (nav is left untouched).

The published site fetches /footer.plain.html, which paths.json maps to
/content/admiral/footer; the language-master copy under
/content/admiral/language-masters/en/footer is kept in step with it.

usage (from the repo root):
  node tools/importer/html-to-jcr.mjs content/footer.plain.html migration-work/jcr-new/footer.xml
  python3 tools/importer/build-footer-package.py
"""
import zipfile
from pathlib import Path

SRC = Path('migration-work/jcr-new/footer.xml')
OUT = Path('tools/importer/jcr-package/admiral-footer-v2.zip')
ROOTS = ['/content/admiral/footer', '/content/admiral/language-masters/en/footer']

xml = SRC.read_text(encoding='utf-8')
filters = '\n'.join(f'  <filter root="{r}"/>' for r in ROOTS)
filter_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
{filters}
</workspaceFilter>
'''
props = '''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <comment>FileVault Package Definition</comment>
  <entry key="name">admiral-footer</entry>
  <entry key="group">waringme</entry>
  <entry key="version">2.0.0</entry>
  <entry key="description">Admiral footer only (Explore our website links, social icons, legal) at /content/admiral/footer (web /footer) and /content/admiral/language-masters/en/footer. Does not touch the nav.</entry>
  <entry key="packageType">content</entry>
</properties>
'''
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    for r in ROOTS:
        z.writestr(f'jcr_root{r}/.content.xml', xml)
    z.writestr('META-INF/vault/filter.xml', filter_xml)
    z.writestr('META-INF/vault/properties.xml', props)

# Keep the checked-in unpacked copy in step.
Path('tools/importer/jcr-package/jcr_root/content/admiral/language-masters/en/footer/.content.xml').write_text(xml, encoding='utf-8')
print('Wrote', OUT)
