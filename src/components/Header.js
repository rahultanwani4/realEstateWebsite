import siteConfig from '../data/site-config.json';
import { scrollToSection } from '../utils/scrollHelper.js';

/**
 * Validates header configuration
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
  };
}

/**
 * Records telemetry event for Request a Demo button clicks
 */
export function recordDemoClick(sourcePage = 'global_header') {
  const eventData = {
    event: 'demo_click',
    sourcePage: sourcePage,
    timestamp: new Date().toISOString(),
    currentUrl: window.location.href
  };

  window.dispatchEvent(new CustomEvent('estateforce:demo_click', { detail: eventData }));
}

/**
 * Initializes the Global Single-Page Header matching SurveyResults.online layout
 */
export function initHeader(mountSelector = '#header-root') {
  const container = document.querySelector(mountSelector);
  if (!container) return;

  const headerData = validateHeaderConfig(siteConfig);
  const { logo, menuItems, demoButton } = headerData;

  container.innerHTML = `
    <header class="site-header" id="site-header" role="banner">
      <div class="header-container">
        
        <!-- Brand Logo on left: Cloud Certitude side logo + CC Real Estate -->
        <a href="#home" class="brand-logo-link" id="brand-logo" aria-label="CC Real Estate Home" title="CC Real Estate - Return to Top">
          <img src="${logo.src}" alt="${logo.alt}" class="brand-logo-img" />
          <span class="brand-title">CC Real Estate</span>
        </a>

        <!-- Desktop Navigation: Features, Benefits, How It Works, Live Demo, Contact -->
        <nav class="desktop-nav" aria-label="Primary Navigation">
          <ul class="nav-menu" id="desktop-nav-menu">
            ${menuItems.map((item, idx) => `
              <li class="nav-item">
                <a href="${item.link}" 
                   class="nav-link ${idx === 0 ? 'is-active' : ''}" 
                   id="nav-link-${item.id}"
                   data-section="${item.link.replace('#', '')}">
                  ${item.label}
                </a>
              </li>
            `).join('')}
          </ul>
        </nav>

        <!-- Right Side: Primary Request a Demo CTA (Smooth-scrolls to #contact) -->
        <div class="header-actions">
          <a href="${demoButton?.link || '#contact'}" 
             class="btn-request-demo" 
             id="${demoButton?.id || 'global-demo-button'}"
             data-source-page="${demoButton?.sourcePage || 'global_header'}">
            ${demoButton?.label || 'Request a Demo'}
          </a>

          <!-- Mobile Menu Toggle -->
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
        <div class="mobile-drawer-header">
          <a href="#home" class="brand-logo-link">
            <img src="${logo.src}" alt="${logo.alt}" class="brand-logo-img" />
            <span class="brand-title">CC Real Estate</span>
          </a>
          <button type="button" id="mobile-drawer-close-btn" class="p-2 text-slate-500 hover:text-slate-900" aria-label="Close Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <ul class="mobile-nav-list" id="mobile-nav-list">
          ${menuItems.map((item, idx) => `
            <li class="mobile-nav-item">
              <a href="${item.link}" 
                 class="mobile-nav-link ${idx === 0 ? 'is-active' : ''}" 
                 data-section="${item.link.replace('#', '')}">
                ${item.label}
              </a>
            </li>
          `).join('')}
        </ul>
        <div class="mobile-drawer-footer">
          <a href="${demoButton?.link || '#contact'}" class="btn-request-demo w-full text-center block">
            ${demoButton?.label || 'Request a Demo'}
          </a>
        </div>
      </div>
    </header>
  `;

  setupHeaderInteractivity();
  initScrollSpy();
}

/**
 * Event handlers for sticky state, drawer, and smooth anchor scrolling
 */
function setupHeaderInteractivity() {
  const header = document.getElementById('site-header');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-drawer-close-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const demoButtons = document.querySelectorAll('.btn-request-demo');

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
    toggleBtn?.setAttribute('aria-expanded', 'true');
    drawer?.classList.add('is-open');
    backdrop?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const firstLink = drawer?.querySelector('a');
    if (firstLink) firstLink.focus();
  };

  const closeMenu = () => {
    toggleBtn?.setAttribute('aria-expanded', 'false');
    drawer?.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  toggleBtn?.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeBtn?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);

  // Smooth scroll with precise header offset and auto-close drawer on link click
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .brand-logo-link');
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        closeMenu();
        const targetId = href.substring(1);
        scrollToSection(targetId);
        history.pushState(null, '', href);
        setActiveNavRoute(href);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggleBtn.focus();
    }
  });

  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        closeMenu();
        scrollToSection(href.substring(1));
        history.pushState(null, '', href);
      }
      recordDemoClick(btn.getAttribute('data-source-page') || 'global_header');
    });
  });
}

/**
 * Initializes single-page ScrollSpy to highlight the active navbar item as user scrolls
 */
function initScrollSpy() {
  const sections = ['home', 'features', 'benefits', 'how-it-works', 'live-demo', 'about', 'contact'];
  const sectionElements = sections
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (sectionElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        setActiveNavRoute(`#${id}`);
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sectionElements.forEach(el => observer.observe(el));
}

/**
 * Highlights current active anchor in navigation
 */
export function setActiveNavRoute(routeAnchor = '#home') {
  const cleanAnchor = routeAnchor.startsWith('#') ? routeAnchor : `#${routeAnchor.replace('/', '')}`;
  const allNavLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-drawer .mobile-nav-link');
  
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === cleanAnchor) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });
}
