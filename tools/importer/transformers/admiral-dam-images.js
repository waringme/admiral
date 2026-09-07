/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: rewrite content image URLs to packaged DAM references.
 *
 * For the xwalk package the home page lives at
 *   content/admiral/language-masters/en
 * and its assets are packaged under
 *   /content/dam/admiral/en/images
 *
 * This maps each external source image to its local DAM path (the files were
 * downloaded to content/dam/admiral/en/images/), and drops non-content
 * analytics beacons (e.g. tracking pixels) that must not become DAM assets.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

const DAM_BASE = '/content/dam/admiral/en/images';

// Map by source-URL basename → DAM filename actually staged on disk.
const IMAGE_MAP = {
  'dog-water-bottle.jpg': 'dog-water-bottle.jpg',
  'mother-and-daughter-using-a-tablet.jpg': 'mother-and-daughter-using-a-tablet.jpg',
  'GettyImages-996496112.jpg': 'gettyimages-996496112.jpg',
  'apple-app.svg': 'apple-app.svg',
  'google-app.svg': 'google-app.svg',
  'personal-finance-award-11@2x.png': 'personal-finance-award-11.png',
};

// Hostnames whose images are pure tracking beacons — remove, do not DAM-ify.
const TRACKING_HOSTS = ['tracking.audio.thisisdax.com'];

function basename(src) {
  try {
    const u = new URL(src, 'https://www.admiral.com');
    const path = u.pathname;
    return path.substring(path.lastIndexOf('/') + 1);
  } catch (e) {
    return '';
  }
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  element.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src') || '';

    // drop tracking pixels entirely (also remove an empty wrapping <picture>/<p>)
    if (TRACKING_HOSTS.some((h) => src.includes(h))) {
      const pic = img.closest('picture');
      (pic || img).remove();
      return;
    }

    const name = basename(src);
    if (IMAGE_MAP[name]) {
      img.setAttribute('src', `${DAM_BASE}/${IMAGE_MAP[name]}`);
      // update any <source> siblings inside the same <picture>
      const pic = img.closest('picture');
      if (pic) {
        pic.querySelectorAll('source[srcset]').forEach((s) => {
          s.setAttribute('srcset', `${DAM_BASE}/${IMAGE_MAP[name]}`);
        });
      }
    }
  });
}
