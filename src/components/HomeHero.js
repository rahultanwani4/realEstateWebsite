import siteConfig from '../data/site-config.json';
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
 * Validates US-06 Home Hero Configuration:
 * - Headline max 90 chars
 * - Supporting sentence max 180 chars
 * - Button labels max 25 chars
 */
function validateHeroConfig(config) {
  const { hero } = config;
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

  return hero;
}

/**
 * Initializes and mounts Hero Section
 */
export function initHomeHero(mountSelector = '#app') {
  const container = document.querySelector(mountSelector);
  if (!container) return;

  const imageryAndBrand = validateImageryConfig(siteConfig);
  const hero = validateHeroConfig(siteConfig);

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
        
        <!-- Header Text Block -->
        <div class="hero-header-block">
          <h1 class="hero-heading">
            ${formattedHeadline}
          </h1>

          <p class="hero-description">
            ${hero.supportingSentence}
          </p>
        </div>

        <!-- Product Device Frame & Layered CRM Mockup (Directly visible below headline on mobile, Right column on Desktop) -->
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

            <!-- Workspace Body: Real Salesforce Product Screenshot -->
            <div class="dashboard-inner overflow-hidden rounded-b-xl bg-slate-900 cursor-zoom-in group relative" title="Click to inspect in full resolution">
              <img src="${imageryAndBrand?.heroScreenshot?.src || '/dashboard-hero.png'}" 
                   alt="${imageryAndBrand?.heroScreenshot?.alt || 'EstateForce Real Estate Salesforce CRM Workspace'}" 
                   class="w-full h-auto block shadow-inner"
                   style="image-rendering: auto;"
                   loading="eager" />
              <div class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 border border-slate-700/60 pointer-events-none">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>Click to expand 100%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- CTAs & Proof Checklist Block (Below Mockup on Mobile, Bottom Left on Desktop) -->
        <div class="hero-cta-block">
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

      </div>
    </section>
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
}
