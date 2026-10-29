import siteConfig from '../data/site-config.json';
import { openProductTourModal } from './ProductTourModal.js';
import { openFreeTrialModal } from './FreeTrialModal.js';

/**
 * Validates US-08 and US-09 configurations
 */
function validateFeaturesConfig(config) {
  const { featuresPage } = config;
  if (!featuresPage) {
    throw new Error('US-08/09 Error: featuresPage configuration is required.');
  }

  // Introduction <= 300 chars
  if (featuresPage.pageIntroduction.length > 300) {
    console.warn('US-08 Warning: Page introduction exceeds 300 characters.');
  }

  // Exactly 5 menu items
  if (!featuresPage.menuItems || featuresPage.menuItems.length !== 5) {
    console.warn('US-08 Warning: Exactly 5 menu items required for sticky sidebar.');
  }

  // 4 Feature areas required
  if (!featuresPage.featureAreas || featuresPage.featureAreas.length !== 4) {
    console.warn('US-09 Warning: Exactly 4 feature areas required.');
  }

  return featuresPage;
}

/**
 * Initializes and mounts US-08 and US-09 (Features Page Layout & Sections)
 */
export function initFeaturesPage(mountSelector = '#features-page-root') {
  const container = document.querySelector(mountSelector);
  if (!container) return;

  const data = validateFeaturesConfig(siteConfig);

  container.innerHTML = `
    <div class="features-page-wrapper" id="features-page-top">
      
      <!-- Top Introduction Banner (US-08 Criterion 1) -->
      <section class="features-intro-banner" aria-label="Features Page Introduction">
        <div class="features-intro-container">
          <span class="section-tag-pill">Comprehensive Salesforce Real Estate Package</span>
          <h1 class="features-page-headline">Engineered for High-Velocity Property Sales</h1>
          <p class="features-page-subtext">${data.pageIntroduction}</p>
          <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button type="button" 
                    id="features-open-tour-btn"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 shadow-sm transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Take Interactive Screen Tour</span>
            </button>
            <button type="button" 
                    id="features-open-trial-btn"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs hover:bg-slate-50 transition-all">
              <span>Request 14-Day Free Trial</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Main Layout: Sticky Sidebar (Desktop) / Mobile Tabs + Content Sections (US-08 Criterion 2, 3) -->
      <div class="features-layout-container">
        
        <!-- Sticky Side Menu / Mobile Tab Bar -->
        <aside class="features-sticky-sidebar" id="features-sidebar" aria-label="Features navigation">
          <div class="sidebar-sticky-inner">
            <p class="sidebar-section-label">Core Capabilities</p>
            <nav class="sidebar-nav-list" role="tablist">
              ${data.menuItems.map(item => `
                <a href="#${item.id}" 
                   class="sidebar-nav-link" 
                   data-target="${item.id}" 
                   id="nav-link-${item.id}"
                   role="tab"
                   aria-controls="${item.id}">
                  <span class="nav-step-dot" aria-hidden="true"></span>
                  <span class="nav-item-text">${item.label}</span>
                </a>
              `).join('')}
            </nav>
            <div class="sidebar-cta-box">
              <p class="sidebar-cta-title">Need a custom demo?</p>
              <p class="sidebar-cta-text">Walk through the package in a live 1-on-1 sandbox session.</p>
              <a href="#request-demo" class="btn-sidebar-demo btn-cta-demo" data-area="all">Schedule Walkthrough</a>
            </div>
          </div>
        </aside>

        <!-- Feature Content Stream (US-09 Criterion 1, 2, 3, 4, 5, 6) -->
        <main class="features-content-stream" id="features-main-content">
          
          ${data.featureAreas.map((area, idx) => `
            <section class="feature-area-block" id="${area.id}" aria-labelledby="heading-${area.id}">
              <div class="area-header-pill-row">
                <span class="area-badge-tag">${area.badge}</span>
                <span class="area-index-num">Module 0${area.displayOrder}</span>
              </div>

              <h2 class="area-main-title" id="heading-${area.id}">${area.title}</h2>
              <p class="area-description">${area.description}</p>

              <!-- "What This Means For You" Callout Box (US-09 Criterion 5) -->
              <div class="what-means-box" role="note">
                <div class="what-means-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <div class="what-means-content">
                  <p class="what-means-label">What This Means For You</p>
                  <p class="what-means-text">${area.whatThisMeans}</p>
                </div>
              </div>

              <!-- High-Fidelity Screen / Workflow Graphic (US-09 Criterion 1-4) -->
              <div class="feature-screen-frame">
                <img src="${area.screenshot}" 
                     alt="${area.alt}" 
                     class="feature-screen-img" 
                     loading="lazy" />
              </div>

              ${area.journeyGraphic ? `
                <div class="feature-secondary-graphic-frame">
                  <img src="${area.journeyGraphic}" 
                       alt="${area.title} lifecycle journey architecture" 
                       class="feature-graphic-img" 
                       loading="lazy" />
                </div>
              ` : ''}

              <!-- Capability Checklist -->
              <div class="area-capabilities-grid">
                ${area.capabilities.map(cap => `
                  <div class="capability-item">
                    <svg class="cap-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>${cap}</span>
                  </div>
                `).join('')}
              </div>

              <!-- US-09 Criterion 6: Request a Demo Button after EACH area (pre-ticked area tag) -->
              <div class="area-action-footer">
                <a href="#request-demo?area=${area.demoAreaTag}" 
                   class="btn-area-demo btn-cta-demo" 
                   data-demo-area="${area.demoAreaTag}"
                   id="demo-btn-${area.id}">
                  <span>Request a Demo for ${area.areaKey} Management</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
                <span class="area-demo-hint">✓ Pre-selects ${area.areaKey} Management in the demo scoping form</span>
              </div>
            </section>
          `).join('')}

          <!-- ==========================================================================
               US-08 CRITERION 4: WORKS ON SALESFORCE (Plain-Language & Brand Compliance)
               ========================================================================== -->
          <section class="feature-area-block works-on-salesforce-block" id="works-on-salesforce" aria-labelledby="heading-works-on-salesforce">
            <div class="area-header-pill-row">
              <span class="area-badge-tag">${data.worksOnSalesforce.badge}</span>
              <span class="area-index-num">Platform Fit</span>
            </div>

            <h2 class="area-main-title" id="heading-works-on-salesforce">${data.worksOnSalesforce.title}</h2>
            
            <div class="works-sf-content-card">
              <div class="works-sf-badges-row">
                <img src="${data.worksOnSalesforce.builtOnSalesforceSrc}" 
                     alt="Built on Salesforce logo mark" 
                     class="built-on-sf-badge-img" 
                     width="180" 
                     height="48" />
                <a href="${data.worksOnSalesforce.appExchangeUrl}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="appexchange-verified-pill"
                   aria-label="View EstateForce verified package on Salesforce AppExchange">
                  <img src="${data.worksOnSalesforce.appExchangeBadgeSrc}" alt="Salesforce AppExchange verified badge" width="130" height="32" />
                  <span>Verified 4.9 ★ ↗</span>
                </a>
              </div>

              <div class="works-sf-rich-text">
                <p>${data.worksOnSalesforce.text}</p>
              </div>

              <div class="works-sf-perks-grid">
                <div class="sf-perk-card">
                  <span class="sf-perk-icon" aria-hidden="true">📱</span>
                  <h4>Official Salesforce Mobile App</h4>
                  <p>Rep field visits, GPS geotags, and inventory holds work out-of-the-box on iOS and Android with zero extra app downloads.</p>
                </div>
                <div class="sf-perk-card">
                  <span class="sf-perk-icon" aria-hidden="true">🔒</span>
                  <h4>Enterprise Data Sovereignty</h4>
                  <p>100% native database architecture. Your real estate leads, pricing schedules, and customer KYC never leave your Salesforce cloud.</p>
                </div>
                <div class="sf-perk-card">
                  <span class="sf-perk-icon" aria-hidden="true">⚡</span>
                  <h4>Lightning Flow Ready</h4>
                  <p>Customize allotment approvals, automated WhatsApp triggers, and lead scoring matrices with standard point-and-click Flow Builder.</p>
                </div>
              </div>
            </div>

            <!-- US-08 Criterion 5: End-of-page Request a Demo button -->
            <div class="features-end-cta-row">
              <div class="end-cta-box">
                <h3 class="end-cta-title">Ready to see EstateForce inside your Salesforce sandbox?</h3>
                <p class="end-cta-sub">Our certified Salesforce solutions engineers will walk through your project inventory and custom lead sources.</p>
                <a href="#request-demo?area=all" class="btn-features-final-demo btn-cta-demo" id="features-bottom-demo-btn">
                  <span>${data.worksOnSalesforce.demoButtonLabel}</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>

          </section>

        </main>
      </div>

    </div>
  `;

  // Attach ScrollSpy / IntersectionObserver to highlight active sticky menu item (US-08 Criterion 3)
  setupFeaturesScrollspy(container);

  // Attach event telemetry for area demo buttons
  setupDemoClickListeners(container);

  // Attach interactive tour modal listener (US-28)
  container.querySelector('#features-open-tour-btn')?.addEventListener('click', () => {
    openProductTourModal('Lead');
  });

  // Attach free trial modal listener (US-29)
  container.querySelector('#features-open-trial-btn')?.addEventListener('click', () => {
    openFreeTrialModal();
  });
}

/**
 * ScrollSpy implementation: Highlights active area in sticky side menu as user scrolls
 */
function setupFeaturesScrollspy(container) {
  const sections = container.querySelectorAll('.feature-area-block');
  const navLinks = container.querySelectorAll('.sidebar-nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          if (link.dataset.target === id) {
            link.classList.add('is-active');
            link.setAttribute('aria-selected', 'true');
          } else {
            link.classList.remove('is-active');
            link.setAttribute('aria-selected', 'false');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/**
 * Attach telemetry and event listeners for all demo triggers on Features page
 */
function setupDemoClickListeners(container) {
  const demoButtons = container.querySelectorAll('.btn-cta-demo');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const area = btn.dataset.demoArea || btn.dataset.area || 'features_general';
      window.dispatchEvent(new CustomEvent('estateforce:demo_click', {
        detail: {
          source: 'features_page',
          preSelectedArea: area,
          timestamp: new Date().toISOString()
        }
      }));
    });
  });
}
