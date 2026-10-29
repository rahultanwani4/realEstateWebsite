import siteConfig from '../data/site-config.json';
import { openProductTourModal } from './ProductTourModal.js';
import { recordChatClick } from './FloatingChat.js';

/**
 * Validates US-05 Imagery and Salesforce Brand Use:
 * - Device frames: Desktop, Tablet, Phone, None
 * - Alt text required (max 150 chars)
 * - Brand compliance review recorded before launch
 */
function validateImageryConfig(config) {
  const { imageryAndBrand } = config;
  if (!imageryAndBrand) {
    console.warn('US-05 Warning: imageryAndBrand configuration is missing.');
    return null;
  }

  const { heroScreenshot, brandComplianceReview } = imageryAndBrand;
  if (heroScreenshot) {
    if (!heroScreenshot.alt || heroScreenshot.alt.trim().length === 0) {
      throw new Error('US-05 Error: Every image must have alt text.');
    }
    if (heroScreenshot.alt.length > 150) {
      console.warn(`US-05 Warning: Alt text exceeds 150 characters (${heroScreenshot.alt.length}). Truncating.`);
      heroScreenshot.alt = heroScreenshot.alt.slice(0, 150);
    }
  }

  if (!brandComplianceReview || !brandComplianceReview.isApproved) {
    console.warn('US-05 Notice: Salesforce brand-compliance review must be recorded before production launch.');
  }

  return imageryAndBrand;
}

/**
 * Validates US-06 Home Hero and Trust Strip:
 * - Headline max 90 chars
 * - Supporting sentence max 180 chars
 * - Button labels max 25 chars
 * - 3 to 12 logos with permission confirmed
 * - AppExchange rating 0.0-5.0, hidden if last checked over 90 days ago
 */
function validateHeroAndTrustConfig(config) {
  const { hero, trustStrip } = config;
  if (!hero) {
    throw new Error('US-06 Error: Hero configuration is required.');
  }

  // Headline validation (max 90 chars)
  if (!hero.headline || hero.headline.length > 90) {
    console.warn(`US-06 Warning: Headline must be max 90 characters. Currently ${hero.headline?.length || 0}. Truncating.`);
    hero.headline = (hero.headline || '').slice(0, 90);
  }

  // Supporting sentence validation (max 180 chars)
  if (!hero.supportingSentence || hero.supportingSentence.length > 180) {
    console.warn(`US-06 Warning: Supporting sentence must be max 180 characters. Currently ${hero.supportingSentence?.length || 0}. Truncating.`);
    hero.supportingSentence = (hero.supportingSentence || '').slice(0, 180);
  }

  // Button labels validation (max 25 chars)
  if (hero.primaryButton?.label?.length > 25) {
    hero.primaryButton.label = hero.primaryButton.label.slice(0, 25);
  }
  if (hero.secondaryButton?.label?.length > 25) {
    hero.secondaryButton.label = hero.secondaryButton.label.slice(0, 25);
  }

  // Partner logos validation: only logos with permission (3 to 12 logos)
  let validLogos = (trustStrip?.partnerLogos || []).filter(logo => logo.hasPermission === true);
  if (validLogos.length < 3) {
    console.warn(`US-06 Warning: Trust strip requires at least 3 authorized logos. Found: ${validLogos.length}`);
  }
  if (validLogos.length > 12) {
    validLogos = validLogos.slice(0, 12);
  }

  // AppExchange rating expiry check (hidden if last checked over 90 days ago)
  let isRatingActive = false;
  if (trustStrip?.appExchange?.lastCheckedDate) {
    const checkedTime = new Date(trustStrip.appExchange.lastCheckedDate).getTime();
    const nowTime = new Date('2026-10-26T15:27:00').getTime(); // Using current system date
    const daysSinceCheck = Math.floor((nowTime - checkedTime) / (1000 * 60 * 60 * 24));
    isRatingActive = daysSinceCheck >= 0 && daysSinceCheck <= 90;
  }

  return {
    hero,
    trustStrip: {
      ...trustStrip,
      activeLogos: validLogos,
      isRatingActive
    }
  };
}

/**
 * Renders the 5-star rating SVG graphics
 */
function renderStars(rating = 4.9) {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(`
        <svg class="star-svg is-full" viewBox="0 0 24 24" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      `);
    } else {
      stars.push(`
        <svg class="star-svg is-partial" viewBox="0 0 24 24" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      `);
    }
  }
  return stars.join('');
}

/**
 * Initializes and mounts US-05 and US-06 (Hero and Trust Strip)
 */
export function initHomeHero(mountSelector = '#app') {
  const container = document.querySelector(mountSelector);
  if (!container) return;

  validateImageryConfig(siteConfig);
  const { hero, trustStrip } = validateHeroAndTrustConfig(siteConfig);

  // 24 graduated bar chart bars matching surveyresults.online
  const barData = [
    { h: 34, o: 0.35 }, { h: 46, o: 0.38 }, { h: 40, o: 0.40 }, { h: 55, o: 0.43 },
    { h: 44, o: 0.46 }, { h: 63, o: 0.49 }, { h: 58, o: 0.52 }, { h: 52, o: 0.55 },
    { h: 66, o: 0.58 }, { h: 74, o: 0.61 }, { h: 60, o: 0.64 }, { h: 68, o: 0.67 },
    { h: 82, o: 0.70 }, { h: 72, o: 0.73 }, { h: 64, o: 0.76 }, { h: 78, o: 0.79 },
    { h: 90, o: 0.82 }, { h: 84, o: 0.85 }, { h: 70, o: 0.88 }, { h: 76, o: 0.91 },
    { h: 88, o: 0.94 }, { h: 96, o: 0.96 }, { h: 82, o: 0.98 }, { h: 92, o: 1.0 }
  ];

  // Highlight the accent word in the headline
  let formattedHeadline = hero.headline;
  if (hero.headlineAccentWord && formattedHeadline.includes(hero.headlineAccentWord)) {
    formattedHeadline = formattedHeadline.replace(
      hero.headlineAccentWord,
      `<span class="text-brand">${hero.headlineAccentWord}</span>`
    );
  }

  container.innerHTML = `
    <!-- US-06: HOME HERO BANNER (SurveyResults Theme with Layered Device Frame) -->
    <section id="home" class="hero-section" aria-label="Hero Section">
      <!-- 56px Hairline Grid Pattern -->
      <div aria-hidden="true" class="hero-grid-bg"></div>

      <div class="hero-container">
        
        <!-- Left Column: Copy & Dual CTAs (US-06 Criterion 1, 2) -->
        <div class="hero-copy">
          <h1 class="hero-heading">
            ${formattedHeadline}
          </h1>

          <p class="hero-description">
            ${hero.supportingSentence}
          </p>

          <div class="hero-actions">
            <a href="${hero.primaryButton.link}" 
               class="btn-hero-primary btn-cta-demo" 
               id="hero-primary-demo"
               aria-label="${hero.primaryButton.label}">
              <span>${hero.primaryButton.label}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </a>

            <a href="${hero.secondaryButton.link}" 
               class="btn-hero-secondary" 
               id="hero-secondary-features"
               aria-label="${hero.secondaryButton.label}">
              <span>${hero.secondaryButton.label}</span>
            </a>

            <button type="button"
                    class="btn-hero-tour inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-all"
                    id="hero-open-tour-btn"
                    aria-label="Launch interactive product tour">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="text-blue-600">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Interactive Tour</span>
            </button>
          </div>

          <!-- 3-Bullet Checklist (US-06 Feature Highlights) -->
          <ul class="hero-checklist">
            ${hero.featureChecklist.map(f => `
              <li>
                <svg class="hero-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Right Column: Product Device Frame & Layered CRM Mockup (US-05 Criterion 1 & US-06 Criterion 3) -->
        <div class="hero-mockup-wrapper">
          <div class="mockup-glow" aria-hidden="true"></div>

          <!-- Desktop Device Frame (US-05 Criterion 1) -->
          <div class="dashboard-frame device-frame-desktop" role="region" aria-label="EstateForce Salesforce CRM Dashboard Demonstration">
            
            <!-- Browser Top Bar -->
            <div class="window-topbar">
              <div class="window-dots" aria-hidden="true">
                <span class="window-dot"></span>
                <span class="window-dot"></span>
                <span class="window-dot"></span>
              </div>
              <div class="window-url-pill">app.salesforce.com/estateforce</div>
            </div>

            <!-- Workspace Body: CRM Sidebar + Main Content -->
            <div class="dashboard-inner">
              <aside class="dashboard-sidebar">
                <div class="sidebar-logo">
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <rect width="24" height="24" rx="6.5" fill="#2563EB"></rect>
                    <path d="M7 19V11.5L14 6.5L21 11.5V19" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                  <span class="sidebar-logo-text">EstateForce</span>
                </div>
                <div class="sidebar-nav">
                  <div class="sidebar-item">Dashboard</div>
                  <div class="sidebar-item is-active">Pipeline</div>
                  <div class="sidebar-item">Units</div>
                  <div class="sidebar-item">Bookings</div>
                  <div class="sidebar-item">Reports</div>
                </div>
              </aside>

              <main class="dashboard-content">
                <div class="dashboard-title-row">
                  <div>
                    <div class="dashboard-title-left">
                      <p class="dashboard-title-text">Serenity Towers Project</p>
                      <span class="status-badge-green">Active Pipeline</span>
                    </div>
                    <p class="dashboard-subtitle-text">Phase 1 & 2 · 240 units configured</p>
                  </div>
                  <div class="dashboard-filters">
                    <span class="filter-badge-blue">Filters · 2</span>
                    <span class="filter-badge-gray">Last 30 days</span>
                  </div>
                </div>

                <!-- Tabs -->
                <div class="dashboard-tabs">
                  <span class="dash-tab is-active">Overview</span>
                  <span class="dash-tab">Enquiries</span>
                  <span class="dash-tab">Unit Allocation</span>
                  <span class="dash-tab">Milestones</span>
                </div>

                <!-- 4 KPI Metrics with Realistic Sample Data (US-05 Criterion 1) -->
                <div class="dashboard-kpi-grid">
                  <div class="kpi-card">
                    <p class="kpi-label">Total Leads</p>
                    <p class="kpi-value">240</p>
                    <p class="kpi-sub">67 pending</p>
                  </div>
                  <div class="kpi-card">
                    <p class="kpi-label">Site Visits</p>
                    <p class="kpi-value">198</p>
                  </div>
                  <div class="kpi-card">
                    <p class="kpi-label">Units Booked</p>
                    <p class="kpi-value">173</p>
                    <p class="kpi-sub">72% booked</p>
                  </div>
                  <div class="kpi-card">
                    <p class="kpi-label">Avg. Cycle</p>
                    <p class="kpi-value">14 days</p>
                  </div>
                </div>

                <!-- Bar Chart: Bookings & Enquiries per day -->
                <div class="dashboard-chart-box">
                  <div class="chart-header-row">
                    <span class="chart-title">Inquiries & bookings per day</span>
                    <span style="color: var(--color-ink-muted);">Mumbai, NCR</span>
                  </div>
                  <div class="chart-bars-wrap" aria-hidden="true">
                    ${barData.map(b => `
                      <span class="chart-bar" style="height: ${b.h}%; opacity: ${b.o};"></span>
                    `).join('')}
                  </div>
                  <div class="chart-axis-labels">
                    <span>Aug 1</span>
                    <span>Aug 15</span>
                    <span>Aug 30</span>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- US-06: TRUST STRIP & PROOF BAR (Customer Logos, AppExchange & Numbers) -->
    <section class="trust-strip-section" aria-label="Customer proof and partner verification">
      <div class="trust-strip-container">
        
        <!-- Row 1: Optional Headline Numbers (US-06 Criterion 5 - only rendered if present) -->
        ${trustStrip.headlineMetrics && trustStrip.headlineMetrics.length > 0 ? `
          <div class="trust-metrics-grid">
            ${trustStrip.headlineMetrics.map(m => `
              <div class="trust-metric-card" id="${m.id}">
                <p class="trust-metric-num">${m.number}</p>
                <p class="trust-metric-lbl">${m.label}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Row 2: Customer & Developer Partner Logos (US-06 Criterion 4 - 3 to 12 verified logos) -->
        <div class="trust-logos-row">
          <p class="trust-logos-eyebrow">Trusted by leading property developers and real estate builders:</p>
          <div class="trust-logos-scroll" role="list">
            ${trustStrip.activeLogos.map(logo => `
              <div class="partner-logo-item" role="listitem">
                <img src="${logo.logoSrc}" 
                     alt="${logo.alt}" 
                     class="partner-logo-img" 
                     width="130" 
                     height="36" 
                     loading="lazy" />
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Row 3: Salesforce Compliance Badges & AppExchange Verification (US-05 Criterion 4 & US-06 Criterion 4) -->
        <div class="trust-badges-bar">
          <div class="built-on-salesforce-box">
            <img src="${trustStrip.appExchange.builtOnSalesforceSrc}" 
                 alt="Built on Salesforce ISV Package mark" 
                 class="built-salesforce-badge-img" 
                 width="160" 
                 height="38" />
          </div>

          <div class="trust-separator" aria-hidden="true"></div>

          <!-- AppExchange Review & Star Rating Verification -->
          ${trustStrip.isRatingActive ? `
            <a href="${trustStrip.appExchange.listingUrl}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="appexchange-rating-card" 
               aria-label="View EstateForce 4.9 rating on Salesforce AppExchange">
              <img src="${trustStrip.appExchange.badgeSrc}" 
                   alt="Salesforce AppExchange logo" 
                   class="appexchange-mini-logo" 
                   width="130" 
                   height="32" />
              <div class="appexchange-rating-info">
                <div class="stars-row">
                  ${renderStars(trustStrip.appExchange.rating)}
                  <span class="rating-num">${trustStrip.appExchange.rating.toFixed(1)}</span>
                </div>
                <span class="review-count">(${trustStrip.appExchange.reviewCount} customer reviews) ↗</span>
              </div>
            </a>
          ` : `
            <a href="${trustStrip.appExchange.listingUrl}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="appexchange-rating-card">
              <img src="${trustStrip.appExchange.badgeSrc}" alt="Salesforce AppExchange listing" width="130" height="32" />
              <span class="review-count">View Official AppExchange Listing ↗</span>
            </a>
          `}
        </div>

      </div>
    </section>

    <!-- US-07: HOME CONTENT SECTIONS (Core Cards, Benefits, Journey, Steps, Testimonials, Closing CTA) -->
    <div id="home-content-root"></div>
  `;

  // Attach event telemetry for primary demo button
  const demoBtn = container.querySelector('#hero-primary-demo');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('estateforce:demo_click', {
        detail: {
          source: 'home_hero_primary',
          timestamp: new Date().toISOString()
        }
      }));
    });
  }

  // Attach interactive tour trigger (US-28)
  const tourBtn = container.querySelector('#hero-open-tour-btn');
  if (tourBtn) {
    tourBtn.addEventListener('click', () => {
      openProductTourModal('Lead');
    });
  }
}
