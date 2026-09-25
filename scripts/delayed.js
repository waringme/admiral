// add delayed functionality here
import {
  getMetadata, loadScript,
} from './aem.js';
import {
  a, span, i,
} from './dom-helpers.js';

// Adobe Launch (analytics) - loaded here, ~3s after page load, rather than in
// <head>, so it doesn't compete with the page's first render.
loadScript('https://assets.adobedtm.com/b2f5fbf72a47/9f8bfb0ead12/launch-6e7d1b4318bd-development.min.js', { async: '' });

// Adobe Target - start

window.targetGlobalSettings = {
  bodyHidingEnabled: false,
};

function loadAT() {
  // Note: at.js only reads a *global* window.targetPageParams, so this nested
  // helper is not picked up; kept as-is so Target behaviour is unchanged.
  // eslint-disable-next-line no-unused-vars
  function targetPageParams() {
    return {
      at_property: '549d426b-0bcc-be60-ce27-b9923bfcad4f',
    };
  }
  loadScript(`${window.hlx.codeBasePath}/scripts/at-lsig.js`);
}
// Adobe Target - end

// refactor tweetable links function
/**
 * Opens a popup for the Twitter links autoblock.
 */
function openPopUp(popUrl) {
  const popupParams = `height=450, width=550, top=${(window.innerHeight / 2 - 275)}`
   + `, left=${(window.innerWidth / 2 - 225)}`
   + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0';
  window.open(popUrl, 'fbShareWindow', popupParams);
}

/**
 * Finds and embeds custom JS and css
 */
function embedCustomLibraries() {
  const externalLibs = getMetadata('js-files');
  const libsArray = externalLibs?.split(',').map((url) => url.trim());

  libsArray.forEach((url) => {
    loadScript(`${url}`);
  });
}

/**
 * Finds and decorates anchor elements with Twitter hrefs
 */
// Tweetable-links autoblock (not currently wired up; kept for future use).
// eslint-disable-next-line no-unused-vars
function buildTwitterLinks() {
  const main = document.querySelector('main');
  if (!main) return;

  // get all paragraph elements
  const paras = main.querySelectorAll('p');
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);

  [...paras].forEach((paragraph) => {
    const tweetables = paragraph.innerHTML.match(/&lt;tweetable[^>]*&gt;([\s\S]*?)&lt;\/tweetable&gt;/g);
    if (tweetables) {
      tweetables.forEach((tweetableTag) => {
        const matchedContent = tweetableTag.match(
          /&lt;tweetable(?:[^>]*data-channel=['"]([^'"]*)['"])?(?:[^>]*data-hashtag=['"]([^'"]*)['"])?[^>]*&gt;([\s\S]*?)&lt;\/tweetable&gt;/,
        );
        const channel = matchedContent[1] || '';
        const hashtag = matchedContent[2] || '';
        const tweetContent = matchedContent[3];

        let modalURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetContent)}`
          + `&original_referrer=${encodedUrl}&source=tweetbutton`;
        if (channel) modalURL += `&via=${encodeURIComponent(channel.charAt(0) === '@' ? channel.substring(1) : channel)}`;
        if (hashtag) modalURL += `&hashtags=${encodeURIComponent(hashtag)}`;

        const tweetableEl = span(
          { class: 'tweetable' },
          a({ href: modalURL, target: '_blank', tabindex: 0 }, tweetContent, i({ class: 'lp lp-twit' })),
        );
        paragraph.innerHTML = paragraph.innerHTML.replace(tweetableTag, tweetableEl.outerHTML);
      });
    }
    [...paragraph.querySelectorAll('.tweetable > a')].forEach((twitterAnchor) => {
      twitterAnchor.addEventListener('click', (event) => {
        event.preventDefault();
        const apiURL = twitterAnchor.href;
        openPopUp(apiURL);
      });
    });
  });
}

if (!window.location.hostname.includes('localhost')) {
  embedCustomLibraries();
  if (window.parent && !(window.parent.location.pathname.indexOf('/canvas/') > -1)) {
    loadAT();
  }
}
