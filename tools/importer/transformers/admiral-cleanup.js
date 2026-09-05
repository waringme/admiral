/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: admiral.com site-wide cleanup.
 * Removes non-authorable site chrome and third-party widgets.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Third-party widgets / consent / chat overlays (verified in cleaned.html):
    //   #teconsent, #consent-banner   -> TrustArc cookie consent (lines 3, 9)
    //   #block-emergencymessaging     -> emergency messaging shell (line 23)
    //   #genesys-thirdparty, #genesys-messenger -> Genesys chat iframes (lines 1018, 1022)
    WebImporter.DOMUtils.remove(element, [
      '#teconsent',
      '#consent-banner',
      '#block-emergencymessaging',
      '#genesys-thirdparty',
      '#genesys-messenger',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome and leftover elements (verified in cleaned.html):
    //   header.main (line 25) contains the mega-nav; footer (line 814) contains
    //   explore-links nav / social / legal. These are global chrome, not page content.
    //   Stray <meta> tags appear inside #basic-19327 (lines 799-810); <iframe>,
    //   empty <img src="">, <link>, <noscript> are non-authorable leftovers.
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'iframe',
      'meta',
      'link',
      'noscript',
      'source',
    ]);
  }
}
