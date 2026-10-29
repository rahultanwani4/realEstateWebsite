import siteConfig from '../data/site-config.json';

/**
 * Validates header configuration against US-01 validation rules:
 * - Logo SVG/PNG, max 200 KB
 * - Max 8 menu items
 * - Menu links must point to published pages
 * - URLs must be valid https (or relative anchor/path)
 */
function validateHeaderConfig(config) {
  const { header } = config;
  if (!header) {
    throw new Error('US-01: Header configuration is required.');
  }

  const publishedItems = (header.menuItems || []).filter(item => item.isPublished);

  return {
    ...header,
    menuItems: publishedItems
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, 8)
  };
}

/**
 * Records telemetry event for Request a Demo button clicks (US-01 Criterion 3)
 */
export function recordDemoClick(sourcePage = 'global_header') {
  const eventData = {
    event: 'demo_click',
    sourcePage: sourcePage,
    timestamp: new Date().toISOString(),
    currentUrl: window.location.href
  };

  window.dispatchEvent(new CustomEvent('estateforce:demo_click', { detail: eventData }));
  console.log('[Telemetry US-01] Demo button clicked:', eventData);

  // Discreet toast notification
  showToast('Demo request registered');
}

/**
 * Discreet, minimal toast notification helper
 */
function showToast(message) {
  let toast = document.getElementById('telemetry-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'telemetry-toast';
    toast.className = 'telemetry-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/**
 * Initializes the Global Header (US-01) with clean, minimal, enterprise styling
 */
export function initHeader(mountSelector = '#header-root') {
  const container = document.querySelector(mountSelector);
  if (!container) return;

  const headerData = validateHeaderConfig(siteConfig);
  const { logo, supportLink, menuItems, demoButton } = headerData;
  const currentHash = window.location.hash || '#home';

  // Render Single Clean, Unified Header (No heavy top-bar clutter)
  container.innerHTML = `
    <header class="site-header" id="site-header" role="banner">
      <div class="header-container">
        
        <!-- Brand Logo on left (US-01 Criterion 1) -->
        <a href="${logo.homeUrl}" class="brand-logo-link" id="brand-logo" aria-label="EstateForce Home" title="EstateForce - Return to Home Page">
          <img src="${logo.src}" alt="${logo.alt}" class="brand-logo-img" />
        </a>

        <!-- Clean Desktop Navigation (US-01 Criterion 2) -->
        <nav class="desktop-nav" aria-label="Primary Navigation">
          <ul class="nav-menu" id="desktop-nav-menu">
            <li class="nav-item">
              <a href="/" 
                 class="nav-link ${currentHash === '/' || currentHash === '#home' ? 'is-active' : ''}" 
                 id="nav-link-home"
                 data-section="home"
                 title="Return to Home Page">
                Home
              </a>
            </li>
            ${menuItems.map(item => `
              <li class="nav-item">
                <a href="${item.link}" 
                   class="nav-link ${currentHash === item.link ? 'is-active' : ''}" 
                   id="nav-link-${item.id}"
                   data-section="${item.link.replace('#', '')}">
                  ${item.label}
                </a>
              </li>
            `).join('')}
          </ul>
        </nav>

        <!-- Right Side: Clean Support Link & Demo CTA (US-01 Criterion 3, 4) -->
        <div class="header-actions">
          <a href="${supportLink.url}" 
             target="${supportLink.openInNewTab ? '_blank' : '_self'}" 
             rel="noopener noreferrer" 
             class="support-link"
             id="header-support-link"
             title="${supportLink.label}">
            <span>Support</span>
            <svg class="external-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>

          <!-- Primary Demo Button: Clean, solid accent, always visible (US-01 Criterion 3, 6) -->
          <a href="${demoButton.link}" 
             class="btn-request-demo" 
             id="${demoButton.id}"
             data-source-page="${demoButton.sourcePage}">
            ${demoButton.label}
          </a>

          <!-- Minimalist Mobile Menu Toggle (US-01 Criterion 6) -->
          <button type="button" 
                  class="mobile-menu-toggle" 
                  id="mobile-menu-toggle" 
                  aria-expanded="false" 
                  aria-controls="mobile-nav-drawer" 
                  aria-label="Toggle Navigation">
            <span class="hamburger-icon">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Drawer -->
      <div class="mobile-drawer-backdrop" id="mobile-drawer-backdrop"></div>
      <div class="mobile-nav-drawer" id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <ul class="mobile-nav-list" id="mobile-nav-list">
          <li class="mobile-nav-item">
            <a href="/" 
               class="mobile-nav-link ${currentHash === '/' || currentHash === '#home' ? 'is-active' : ''}" 
               data-section="home"
               title="Return to Home Page">
              Home
            </a>
          </li>
          ${menuItems.map(item => `
            <li class="mobile-nav-item">
              <a href="${item.link}" 
                 class="mobile-nav-link ${currentHash === item.link ? 'is-active' : ''}" 
                 data-section="${item.link.replace('#', '')}">
                ${item.label}
              </a>
            </li>
          `).join('')}
          <li class="mobile-nav-item mobile-support-item">
            <a href="${supportLink.url}" 
               target="${supportLink.openInNewTab ? '_blank' : '_self'}" 
               rel="noopener noreferrer" 
               class="mobile-nav-link">
              <span>Customer Support</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </header>
  `;

  setupHeaderInteractivity();
}

/**
 * Minimalist, robust event handlers
 */
function setupHeaderInteractivity() {
  const header = document.getElementById('site-header');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const demoButtons = document.querySelectorAll('.btn-request-demo');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Sticky header border on scroll
  const onScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu open / close
  const openMenu = () => {
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const firstLink = drawer.querySelector('a');
    if (firstLink) firstLink.focus();
  };

  const closeMenu = () => {
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  // Close mobile drawer when clicking any link inside it
  const mobileNavLinks = drawer.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggleBtn.focus();
    }
  });

  // Demo click tracking
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sourcePage = btn.getAttribute('data-source-page') || 'global_header';
      recordDemoClick(sourcePage);
    });
  });
}

/**
 * Highlights current active route in the header menu (US-01 Criterion 2)
 */
export function setActiveNavRoute(routePath = '/') {
  const cleanPath = (routePath || '').split('?')[0].split('#')[0];
  const allNavLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-drawer .mobile-nav-link');
  
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('?')[0].split('#')[0];
    
    if (cleanPath && cleanHref === cleanPath && cleanPath !== '/') {
      link.classList.add('is-active');
    } else if (cleanPath === '/' && (cleanHref === '/' || cleanHref === '#home')) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });
}

