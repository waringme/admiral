# admiral-images.zip — DAM images package

Installs all referenced images as `dam:Asset` nodes at
`/content/dam/admiral/en/images`:
- Article photos: dog-water-bottle, mother-and-daughter-using-a-tablet, gettyimages-996496112
- App badges: apple-app, google-app
- Logo: admiral-logo
- Product-tile icons: `icons/product-<slug>.svg` (12)

## Install + process
1. Package Manager (`/crx/packmgr`) → Upload `admiral-images.zip` → **Install**
2. **Reprocess Assets**: in AEM Assets, select `/content/dam/admiral/en/images`
   (and the `icons` subfolder) → **Process → Reprocess Assets** (or Create →
   ... Reprocess). This runs the DAM Update Asset workflow to generate
   thumbnails/renditions — required because package installs ship only the
   `original` rendition (hence blank tiles until reprocessed).

Each asset contains `_jcr_content/renditions/original` (the binary) + nt:file
wrapper. Filter root: `/content/dam/admiral/en/images`.
