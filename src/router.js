import { initHomeHero } from './components/HomeHero.js';
import { initHomeContent } from './components/HomeContent.js';
import { initBenefitsPage } from './components/BenefitsPage.js';
import { initHowItWorksPage } from './components/HowItWorksPage.js';
import { initLiveDemoSection } from './components/LiveDemoSection.js';
import { initAboutSection } from './components/AboutSection.js';
import { initContactUsPage } from './components/ContactUsPage.js';
import { initLegalPage } from './components/LegalPage.js';
import { initPricingPage } from './components/PricingPage.js';
import { initFaqPage } from './components/FaqPage.js';
import { initRequestDemoPage } from './components/RequestDemoPage.js';
import { initWhoItIsForPage } from './components/WhoItIsForPage.js';
import { initResourcesPage } from './components/ResourcesPage.js';
import { initCustomerStoriesPage } from './components/CustomerStoriesPage.js';
import { initSecurityFitPage } from './components/SecurityFitPage.js';
import { initComparisonPage } from './components/ComparisonPage.js';
import { initEventsPage } from './components/EventsPage.js';
import { initAboutUsPage } from './components/AboutUsPage.js';
import { initNotFoundPage } from './components/NotFoundPage.js';
import { setActiveNavRoute } from './components/Header.js';
import { scrollToSection } from './utils/scrollHelper.js';
import siteConfig from './data/site-config.json';

/**
 * Single-Page Architecture (Home Landing Experience)
 * 
 * Order of Sections:
 * 1. #home         -> Hero Banner & Trust Proof Strip
 * 2. #features     -> Core Functional Cards & 6-Stage Enquiry-to-Handover Journey
 * 3. #benefits     -> Role-Based Advantages, Before vs After Matrix
 * 4. #how-it-works -> 14-Day Rapid Deployment Roadmap & 5 Onboarding Pillars
 * 5. #live-demo    -> Guided Product Tour Video Walkthrough
 * 6. #about        -> Backed by Cloud Certitude (Summit Partner, Real Estate Projects Portfolio)
 * 7. #contact      -> Inbound Inquiry & Request a Demo Desk (Salesforce Web-to-Lead)
 */
export function renderSinglePage(rootSelector = '#app') {
  const root = typeof rootSelector === 'string' ? document.querySelector(rootSelector) : rootSelector;
  if (!root) return;

  // If already rendered on the single page, avoid destroying DOM; just handle anchor scroll
  if (root.querySelector('#single-page-site')) {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      scrollToSection(hash);
      setActiveNavRoute(hash);
    }
    return;
  }

  root.innerHTML = `
    <div class="single-page-site" id="single-page-site">
      <!-- 1. Hero & Trust Strip (#home) -->
      <section id="home">
        <div id="home-hero-root"></div>
      </section>

      <!-- 2. Features: Core Functional Areas & Journey Flow (#features) -->
      <section id="features">
        <div id="features-root"></div>
      </section>

      <!-- 3. Benefits: Role Tabs, Comparison Matrix & ROI Highlights (#benefits) -->
      <section id="benefits">
        <div id="benefits-root"></div>
      </section>

      <!-- 4. How It Works: 14-Day Roadmap & Onboarding Pillars (#how-it-works) -->
      <section id="how-it-works">
        <div id="how-it-works-root"></div>
      </section>

      <!-- 5. Live Demo: Guided Walkthrough Video (#live-demo) -->
      <section id="live-demo">
        <div id="live-demo-root"></div>
      </section>

      <!-- 6. About: Backed by Cloud Certitude (#about) -->
      <section id="about">
        <div id="about-root"></div>
      </section>

      <!-- 7. Contact & Request Demo Form (#contact) -->
      <section id="contact">
        <div id="contact-root"></div>
      </section>
    </div>
  `;

  // Initialize all sections
  initHomeHero('#home-hero-root');
  initHomeContent('#features-root');
  initBenefitsPage('#benefits-root');
  initHowItWorksPage('#how-it-works-root');
  initLiveDemoSection('#live-demo-root');
  initAboutSection('#about-root');
  initContactUsPage('#contact-root');

  // Handle incoming hash anchor scroll
  const hash = window.location.hash;
  if (hash && hash.length > 1) {
    setTimeout(() => {
      scrollToSection(hash);
      setActiveNavRoute(hash);
    }, 180);
  }
}

/**
 * Route mapping for single-page application and dedicated pages
 */
export const routes = {
  '/': {
    title: 'CC Real Estate | Real Estate Salesforce Package by Cloud Certitude',
    render: (root) => renderSinglePage(root)
  },
  '/home': {
    redirect: '/#home'
  },
  '/features': {
    redirect: '/#features'
  },
  '/benefits': {
    redirect: '/#benefits'
  },
  '/how-it-works': {
    redirect: '/#how-it-works'
  },
  '/live-demo': {
    redirect: '/#live-demo'
  },
  '/demo': {
    redirect: '/#live-demo'
  },
  '/about': {
    redirect: '/#about'
  },
  '/about-us': {
    title: 'About Us & Leadership | CC Real Estate by Cloud Certitude',
    render: (root) => {
      initAboutUsPage(root);
    }
  },
  '/contact': {
    redirect: '/#contact'
  },
  '/contact-us': {
    redirect: '/#contact'
  },
  '/pricing': {
    title: 'Pricing Plans & Transparent Licensing | CC Real Estate',
    render: (root) => {
      initPricingPage(root);
    }
  },
  '/faq': {
    title: 'Frequently Asked Questions | CC Real Estate',
    render: (root) => {
      initFaqPage(root);
    }
  },
  '/faqs': {
    redirect: '/faq'
  },
  '/request-demo': {
    title: 'Request a Live Demo | CC Real Estate',
    render: (root) => {
      initRequestDemoPage(root);
    }
  },
  '/who-it-is-for': {
    title: 'Who It Is For - Operating Models | CC Real Estate',
    render: (root) => {
      initWhoItIsForPage(root);
    }
  },
  '/resources': {
    title: 'Resource Library, Sales Tips & Release Updates | CC Real Estate',
    render: (root) => {
      initResourcesPage(root);
    }
  },
  '/customers': {
    title: 'Customer Stories & Case Studies | CC Real Estate',
    render: (root) => {
      initCustomerStoriesPage(root);
    }
  },
  '/security': {
    title: 'Security, Salesforce Fit & IT Governance | CC Real Estate',
    render: (root) => {
      initSecurityFitPage(root);
    }
  },
  '/security-and-fit': {
    redirect: '/security'
  },
  '/compare': {
    title: 'CC Real Estate vs Spreadsheets & Legacy CRMs | Comparison Matrix',
    render: (root) => {
      initComparisonPage(root);
    }
  },
  '/comparison': {
    redirect: '/compare'
  },
  '/events': {
    title: 'Events & Webinars | CC Real Estate Series',
    render: (root) => {
      initEventsPage(root);
    }
  },
  '/webinars': {
    redirect: '/events'
  },
  '/privacy-policy': {
    title: 'Privacy Policy | CC Real Estate',
    render: (root) => {
      initLegalPage(root, 'privacyPolicy');
    }
  },
  '/terms-of-use': {
    title: 'Terms of Use | CC Real Estate',
    render: (root) => {
      initLegalPage(root, 'termsOfUse');
    }
  },
  '/cookie-notice': {
    title: 'Cookie Notice | CC Real Estate',
    render: (root) => {
      initLegalPage(root, 'cookieNotice');
    }
  },
  '/legal': {
    redirect: '/privacy-policy'
  }
};

/**
 * Normalizes URL path
 */
export function getCurrentPath() {
  const fullHash = window.location.hash || '';
  const pathname = window.location.pathname || '/';

  if (fullHash.startsWith('#/')) {
    return fullHash.replace('#', '').split('?')[0];
  }

  return pathname.split('?')[0] || '/';
}

/**
 * Navigates to a specific URL path
 */
export function navigateTo(url, replace = false) {
  if (replace) {
    history.replaceState(null, '', url);
  } else {
    history.pushState(null, '', url);
  }
  handleRoute();
}

/**
 * Updates SEO meta description and document title dynamically
 */
function updateSeoMeta(path, title) {
  const seoConfig = siteConfig.seo;
  const routeMeta = seoConfig?.routes?.[path];

  document.title = routeMeta?.title || title || seoConfig?.defaultTitle || 'CC Real Estate | Real Estate Salesforce Package by Cloud Certitude';

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = routeMeta?.description || seoConfig?.defaultDescription || 'Manage every lead, sale and booking in one place, natively on Salesforce. The premier real estate CRM package for builders and brokerages.';
}

/**
 * Renders the active route, dedicated page, or 404 Not Found
 */
export function handleRoute() {
  const path = getCurrentPath();
  const route = routes[path];

  // Handle redirects
  if (route && route.redirect) {
    if (route.redirect.startsWith('/#')) {
      const anchor = route.redirect.replace('/', '');
      history.replaceState(null, '', anchor);
      const appRoot = document.querySelector('#app');
      if (!appRoot?.querySelector('#single-page-site')) {
        renderSinglePage('#app');
      }
      setTimeout(() => {
        scrollToSection(anchor);
        setActiveNavRoute(anchor);
      }, 150);
      return;
    }
    navigateTo(route.redirect, true);
    return;
  }

  const appRoot = document.querySelector('#app');
  if (!appRoot) return;

  if (route && route.render) {
    updateSeoMeta(path, route.title);
    appRoot.innerHTML = '';
    route.render('#app');
    setActiveNavRoute(path);

    // If anchor is present in URL (e.g. /pricing#faq), scroll to it
    const hash = window.location.hash;
    if (hash && hash.length > 1 && !hash.startsWith('#/')) {
      setTimeout(() => {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    } else {
      window.scrollTo(0, 0);
    }
  } else if (!route && path !== '/') {
    // 404 Page (Friendly Page Not Found) for unknown or made-up addresses
    updateSeoMeta(path, 'Page Not Found | CC Real Estate');
    appRoot.innerHTML = '';
    initNotFoundPage('#app');
    setActiveNavRoute(null);
    window.scrollTo(0, 0);
  } else {
    // Default to single page for '/'
    renderSinglePage('#app');
  }
}

/**
 * Initializes router, link interception, and listening on browser popstate / hashchange
 */
export function initRouter() {
  // Global click interceptor for internal routing links
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Ignore external links, mailto, tel, or links intended for new tabs
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      anchor.getAttribute('target') === '_blank'
    ) {
      return;
    }

    // Intercept internal routing links (/pricing, /faq, /request-demo, etc.)
    if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      navigateTo(href);
      return;
    }

    // Intercept hash anchors when NOT on single page (e.g. clicking #features while on /pricing or 404)
    if (href.startsWith('#') && !document.querySelector('#single-page-site')) {
      e.preventDefault();
      navigateTo(`/${href}`);
      return;
    }
  });

  window.addEventListener('popstate', handleRoute);
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#') && !hash.startsWith('#/')) {
      const singlePage = document.querySelector('#single-page-site');
      if (singlePage) {
        scrollToSection(hash);
        setActiveNavRoute(hash);
      } else {
        handleRoute();
      }
    } else {
      handleRoute();
    }
  });

  // Initial route handle
  handleRoute();
}
