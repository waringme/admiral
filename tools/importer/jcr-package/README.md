# Admiral nav + footer JCR content package

FileVault content package that installs the migrated **nav** and **footer**
pages into the AEM author repository for the xwalk (Universal Editor) project.

## Contents
- `admiral-nav-footer.zip` — the installable package (upload this).
- `jcr_root/` + `META-INF/` — the unpacked vault sources (for reference / rebuild).

## Installs to
- `/content/admiral/language-masters/en/nav`
- `/content/admiral/language-masters/en/footer`

These are the paths `blocks/header/header.js` and `blocks/footer/footer.js`
fetch on the author instance (`/content/{site}/language-masters/{lang}/nav|footer`).

The `META-INF/vault/filter.xml` scopes the install to exactly those two paths —
nothing else in the repository is touched.

## Install
1. Open Package Manager on the author instance:
   `https://author-p147324-e2050468.adobeaemcloud.com/crx/packmgr`
2. **Upload Package** → select `admiral-nav-footer.zip`.
3. **Install**.

## Rebuild the zip (if you edit the .content.xml sources)
From this directory:
```
node -e "/* zip jcr_root + META-INF into admiral-nav-footer.zip */"
```
(or use any FileVault/`zip` tool: `zip -r admiral-nav-footer.zip jcr_root META-INF`)
