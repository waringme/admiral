// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  // `sections` is the .nav-sections element itself; its top-level items are its
  // direct ul > li children.
  sections.querySelectorAll(':scope > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }

  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav content — metadata-independent dual-fetch. Order the candidates by
  // environment so the working URL is hit first (avoids a guaranteed console
  // 404): localhost/aem serves it under /content, DA/EDS production at the root.
  const onLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    || window.location.hostname.endsWith('.aem.reviews');
  const candidates = onLocal
    ? ['/content/nav.plain.html', '/nav.plain.html']
    : ['/nav.plain.html', '/content/nav.plain.html'];
  let resp = await fetch(candidates[0]);
  if (!resp.ok) resp = await fetch(candidates[1]);
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) {
      section.classList.add(`nav-${c}`);
      section.classList.add('default-content-wrapper');
    }
  });

  // Ensure the brand logo is present. The DA/EDS plain-html pipeline can strip
  // the logo <img> from the fragment (leaving an empty home link), so if the
  // brand link has no image, inject the Admiral logo from the brand CDN.
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a[href="/"], a') || navBrand;
    if (!brandLink.querySelector('img')) {
      const logo = document.createElement('img');
      logo.src = 'https://mktgblobpubaccess1.blob.core.windows.net/eui-frontend-assets/admiral/images/logos/admiral-logo.svg';
      logo.alt = 'Admiral Insurance logo';
      logo.width = 156;
      brandLink.append(logo);
    }
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // tag subtitle group headings (li with <strong> and no link)
    navSections.querySelectorAll(':scope > ul ul > li').forEach((li) => {
      if (!li.querySelector('a') && li.querySelector('strong')) {
        li.classList.add('nav-group-title');
      }
    });

    navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      const isDrop = !!navSection.querySelector('ul');
      if (isDrop) {
        navSection.classList.add('nav-drop');
        // the parent label of a drop is a toggle, not a link (both desktop and
        // mobile) — prevent navigation so the click opens/closes the panel.
        const parentLink = navSection.querySelector(':scope > a');
        if (parentLink) {
          parentLink.addEventListener('click', (e) => e.preventDefault());
        }
      }
      navSection.addEventListener('click', (e) => {
        if (isDesktop.matches) {
          // Desktop: click-to-toggle (source behaviour — no hover). Only the
          // parent label toggles; clicking a sub-link navigates normally.
          const onSubLink = e.target.closest(':scope ul a');
          if (isDrop && onSubLink) return;
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections); // close any other open panel
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        } else if (isDrop) {
          // mobile: only toggle when tapping the row itself (not a sub-link)
          const onSubLink = e.target.closest(':scope ul a');
          if (!onSubLink) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        }
      });
    });

    // Desktop: click outside the nav closes any open dropdown.
    document.addEventListener('click', (e) => {
      if (!isDesktop.matches) return;
      if (!nav.contains(e.target)) toggleAllNavSections(navSections);
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // shrink the header on scroll (desktop)
  const onScroll = () => {
    if (window.scrollY > 40) {
      navWrapper.classList.add('is-scrolled');
    } else {
      navWrapper.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
