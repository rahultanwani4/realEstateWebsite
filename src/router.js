import { initHomeHero } from './components/HomeHero.js';
import { initHomeContent } from './components/HomeContent.js';
import { initBenefitsPage } from './components/BenefitsPage.js';
import { initHowItWorksPage } from './components/HowItWorksPage.js';
import { initLiveDemoSection } from './components/LiveDemoSection.js';
import { initAboutSection } from './components/AboutSection.js';
import { initContactUsPage } from './components/ContactUsPage.js';
import { initLegalPage } from './components/LegalPage.js';
import { setActiveNavRoute } from './components/Header.js';
import { scrollToSection } from './utils/scrollHelper.js';
import siteConfig from './data/site-config.json';

/**
 * Single-Page Architecture (Inspired by SurveyResults.online)
 * 
 * Order of Sections:
 * 1. #home         -> Hero Banner & Trust Proof Strip
 * 2. #features     -> Core Functional Cards & 4-Stage Enquiry-to-Booking Journey
 * 3. #benefits     -> Role-Based Advantages, Before vs After Matrix & Interactive ROI Calculator
 * 4. #how-it-works -> 14-Day Rapid Deployment Roadmap & 5 Onboarding Pillars
 * 5. #live-demo    -> Interactive Video Player with Audio, Closed Captions & Chapters
 * 6. #about        -> Backed by Cloud Certitude (Summit Partner, Real Estate Projects Portfolio)
 * 7. #contact      -> Inbound Inquiry & Request a Demo Desk (Salesforce Web-to-Lead)
 */
export function renderSinglePage(rootSelector = '#app') {
  const root = typeof rootSelector === 'string' ? document.querySelector(rootSelector) : rootSelector;
  if (!root) return;

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

      <!-- 3. Benefits: Role Tabs, Comparison Matrix & ROI Calculator (#benefits) -->
      <section id="benefits">
        <div id="benefits-root"></div>
      </section>

      <!-- 4. How It Works: 14-Day Roadmap & Onboarding Pillars (#how-it-works) -->
      <section id="how-it-works">
        <div id="how-it-works-root"></div>
      </section>

      <!-- 5. Live Demo: Video Player with Audio & Captions (#live-demo) -->
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
 * Route mapping for single-page application with anchor scrolling
 */
export const routes = {
  '/': {
    title: 'EstateForce | Real Estate Salesforce Package',
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
    redirect: '/#about'
  },
  '/contact': {
    redirect: '/#contact'
  },
  '/contact-us': {
    redirect: '/#contact'
  },
  '/request-demo': {
    redirect: '/#contact'
  },
  '/privacy-policy': {
    title: 'Privacy Policy | EstateForce',
    render: (root) => {
      initLegalPage(root, 'privacyPolicy');
    }
  },
  '/terms-of-use': {
    title: 'Terms of Use | EstateForce',
    render: (root) => {
      initLegalPage(root, 'termsOfUse');
    }
  },
  '/cookie-notice': {
    title: 'Cookie Notice | EstateForce',
    render: (root) => {
      initLegalPage(root, 'cookieNotice');
    }
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
 * Updates SEO meta description tag dynamically
 */
function updateSeoMeta(path, title) {
  const seoConfig = siteConfig.seo;
  const routeMeta = seoConfig?.routes?.[path];

  document.title = routeMeta?.title || title || seoConfig?.defaultTitle || 'EstateForce | Real Estate Salesforce Package';

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = routeMeta?.description || seoConfig?.defaultDescription || 'Manage every lead, sale and booking in one place, natively on Salesforce. The premier real estate CRM package for builders and brokerages.';
}

/**
 * Renders the active route or single page
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
    route.render('#app');
  } else {
    // Default to single page if unknown path
    renderSinglePage('#app');
  }
}

/**
 * Initializes router and listening on browser popstate / hashchange
 */
export function initRouter() {
  window.addEventListener('popstate', handleRoute);
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#') && !hash.startsWith('#/')) {
      scrollToSection(hash);
      setActiveNavRoute(hash);
    } else {
      handleRoute();
    }
  });

  // Initial route handle
  handleRoute();
}
