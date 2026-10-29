import { initHomeHero } from './components/HomeHero.js';
import { initHomeContent } from './components/HomeContent.js';
import { initFeaturesPage } from './components/FeaturesPage.js';
import { initBenefitsPage } from './components/BenefitsPage.js';
import { initWhoItIsForPage } from './components/WhoItIsForPage.js';
import { initHowItWorksPage } from './components/HowItWorksPage.js';
import { initSecurityFitPage } from './components/SecurityFitPage.js';
import { initPricingPage } from './components/PricingPage.js';
import { initCustomerStoriesPage } from './components/CustomerStoriesPage.js';
import { initRequestDemoPage } from './components/RequestDemoPage.js';
import { initResourcesPage } from './components/ResourcesPage.js';
import { initAboutUsPage } from './components/AboutUsPage.js';
import { initContactUsPage } from './components/ContactUsPage.js';
import { initFaqPage } from './components/FaqPage.js';
import { initLegalPage } from './components/LegalPage.js';
import { initEventsPage } from './components/EventsPage.js';
import { initComparisonPage } from './components/ComparisonPage.js';
import { setActiveNavRoute } from './components/Header.js';
import siteConfig from './data/site-config.json';

/**
 * Route registry mapping paths to page titles and component renderers
 * Strictly adhering to Section 6 (Site Map) and Section 8 (Page-by-Page) of website_brief.pdf
 */
export const routes = {
  '/': {
    title: 'EstateForce | Real Estate Salesforce Package',
    render: (root) => {
      initHomeHero(root);
      initHomeContent('#home-content-root');
    }
  },
  '/home': {
    redirect: '/'
  },
  '/features': {
    title: 'Features & Architecture | EstateForce',
    render: (root) => {
      initFeaturesPage(root);
    }
  },
  '/benefits': {
    title: 'Role Benefits & Savings Calculator | EstateForce',
    render: (root) => {
      initBenefitsPage(root);
    }
  },
  '/who-it-is-for': {
    title: 'Who It Is For - Real Estate Operating Models | EstateForce',
    render: (root) => {
      initWhoItIsForPage(root);
    }
  },
  '/how-it-works': {
    title: 'How It Works - 14-Day Implementation Roadmap | EstateForce',
    render: (root) => {
      initHowItWorksPage(root);
    }
  },
  '/security': {
    title: 'Security, Governance & Salesforce Architecture | EstateForce',
    render: (root) => {
      initSecurityFitPage(root);
    }
  },
  '/security-and-fit': {
    redirect: '/security'
  },
  '/pricing': {
    title: 'Simple, Transparent Pricing | EstateForce',
    render: (root) => {
      initPricingPage(root);
    }
  },
  '/customers': {
    title: 'Customer Results & Case Studies | EstateForce',
    render: (root) => {
      initCustomerStoriesPage(root);
    }
  },
  '/request-demo': {
    title: 'Request a Guided Demo | EstateForce',
    render: (root) => {
      initRequestDemoPage(root);
    }
  },
  '/resources': {
    title: 'Resources, Guides & Release Updates | EstateForce',
    render: (root) => {
      initResourcesPage(root);
    }
  },
  '/about': {
    title: 'About EstateForce & Leadership | Cloud Certitude',
    render: (root) => {
      initAboutUsPage(root);
    }
  },
  '/about-us': {
    redirect: '/about'
  },
  '/contact': {
    title: 'Contact Us & Support | EstateForce',
    render: (root) => {
      initContactUsPage(root);
    }
  },
  '/contact-us': {
    redirect: '/contact'
  },
  '/faq': {
    title: 'Frequently Asked Questions | EstateForce',
    render: (root) => {
      initFaqPage(root);
    }
  },
  '/faqs': {
    redirect: '/faq'
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
  },
  '/legal': {
    redirect: '/privacy-policy'
  },
  '/compare': {
    title: 'EstateForce vs Spreadsheets & Legacy CRMs | Comparison Matrix',
    render: (root) => {
      initComparisonPage(root);
    }
  },
  '/comparison': {
    redirect: '/compare'
  },
  '/events': {
    title: 'Events & Masterclasses | EstateForce',
    render: (root) => {
      initEventsPage(root);
    }
  },
  '/webinars': {
    redirect: '/events'
  }
};

/**
 * Normalizes URL path (supports both clean paths e.g. /features and hash fallback e.g. #/features or #features)
 */
export function getCurrentPath() {
  const fullHash = window.location.hash || '';
  const pathname = window.location.pathname || '/';

  // If hash is used for routing (e.g. #/features or #features)
  if (fullHash.startsWith('#/')) {
    return fullHash.replace('#', '').split('?')[0];
  } else if (fullHash.startsWith('#') && fullHash.length > 1 && !fullHash.includes('=')) {
    const candidate = `/${fullHash.replace('#', '')}`;
    if (routes[candidate]) return candidate;
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
 * Updates SEO meta description tag dynamically (US-37)
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
  metaDesc.content = routeMeta?.description || seoConfig?.defaultDescription || '';
}

/**
 * Renders the active route
 */
export function handleRoute() {
  const path = getCurrentPath();
  const route = routes[path];

  // Redirect handling
  if (route && route.redirect) {
    navigateTo(route.redirect, true);
    return;
  }

  const appRoot = document.querySelector('#app');
  if (!appRoot) return;

  if (route && route.render) {
    // Update Document Title & SEO Meta (US-37)
    updateSeoMeta(path, route.title);
    
    // Clear previous page and render active page
    appRoot.innerHTML = '';
    route.render('#app');

    // Update active nav link in header (US-01)
    setActiveNavRoute(path);

    // Handle anchor scrolling (e.g. /features#lead-management)
    const hash = window.location.hash;
    if (hash && hash.length > 1 && !hash.startsWith('#/')) {
      setTimeout(() => {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }

  } else {
    // 404 Page (US-37 Criterion 3: friendly page not found page linking to Home and Request a Demo)
    document.title = 'Page Not Found | EstateForce';
    appRoot.innerHTML = `
      <section class="min-h-[70vh] flex items-center justify-center py-20 px-4 text-center bg-white">
        <div class="max-w-md mx-auto">
          <div class="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 font-extrabold text-2xl">404</div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Page Not Found</h1>
          <p class="text-sm text-slate-600 leading-relaxed mb-8">
            The page you are looking for might have been moved or doesn't exist.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/" class="btn-cta-demo w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors no-underline">
              <span>Return Home</span>
            </a>
            <a href="/request-demo" class="btn-cta-demo w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm border border-slate-200 hover:bg-slate-200 transition-colors no-underline">
              <span>Request a Demo</span>
            </a>
          </div>
        </div>
      </section>
    `;
    setActiveNavRoute(null);
  }
}

/**
 * Initializes client-side routing & link interception
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

    // Intercept internal routing links
    if (href.startsWith('/') || href.startsWith('#')) {
      e.preventDefault();
      
      // If same-page hash on current page e.g. #faq-1
      if (href.startsWith('#') && !routes[`/${href.replace('#', '')}`]) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, '', href);
          return;
        }
      }

      navigateTo(href);
    }
  });

  // Listen for browser forward/back buttons
  window.addEventListener('popstate', handleRoute);
  window.addEventListener('hashchange', handleRoute);

  // Initial load
  handleRoute();
}
