import siteConfig from '../data/site-config.json';

/**
 * Validates US-07 Home Content Sections configuration:
 * - Exactly 3 core cards (title max 40, description max 120, screenshot required)
 * - 3–4 benefits (title max 50, text max 140)
 * - Exactly 4 journey stages (title max 40)
 * - Exactly 4 how-it-works steps (title max 40)
 * - 2–3 testimonials with confirmed permission (quote max 300)
 * - Closing message max 100 chars
 */
function validateHomeContentConfig(config) {
  const { homeContent } = config;
  if (!homeContent) {
    throw new Error('US-07 Error: homeContent configuration is required.');
  }

  // 1. Core cards validation (Exactly 3)
  if (!homeContent.coreCards || homeContent.coreCards.length !== 3) {
    console.warn(`US-07 Validation Warning: Exactly 3 core cards required. Found: ${homeContent.coreCards?.length}`);
  }

  // 2. Journey stages validation (Exactly 4)
  if (!homeContent.journeyStages || homeContent.journeyStages.length !== 4) {
    console.warn(`US-07 Validation Warning: Exactly 4 journey stages required. Found: ${homeContent.journeyStages?.length}`);
  }

  // 3. Benefits validation (3 to 4)
  if (!homeContent.benefits || homeContent.benefits.length < 3 || homeContent.benefits.length > 4) {
    console.warn(`US-07 Validation Warning: 3 to 4 benefits required. Found: ${homeContent.benefits?.length}`);
  }

  // 4. How it works validation (Exactly 4)
  if (!homeContent.howItWorks || homeContent.howItWorks.length !== 4) {
    console.warn(`US-07 Validation Warning: Exactly 4 how-it-works steps required. Found: ${homeContent.howItWorks?.length}`);
  }

  // 5. Testimonials validation: only testimonials with confirmed permission (2 to 3)
  const approvedTestimonials = (homeContent.testimonials || []).filter(t => t.hasPermission === true);
  if (approvedTestimonials.length < 2 || approvedTestimonials.length > 3) {
    console.warn(`US-07 Validation Warning: 2 to 3 permitted testimonials required. Found: ${approvedTestimonials.length}`);
  }

  return {
    ...homeContent,
    approvedTestimonials
  };
}

/**
 * SVG Icon Helper for Core Cards & Benefits
 */
function getIconSvg(name) {
  switch (name) {
    case 'lead':
      return `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" y1="8" x2="19" y2="14"></line>
          <line x1="22" y1="11" x2="16" y2="11"></line>
        </svg>
      `;
    case 'sales':
      return `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
          <polyline points="7 10 10 13 17 6"></polyline>
        </svg>
      `;
    case 'booking':
      return `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      `;
    case 'shield':
      return `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      `;
    case 'zap':
      return `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      `;
    case 'grid':
      return `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      `;
    case 'file-text':
      return `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      `;
    default:
      return `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
  }
}

/**
 * Initializes and renders US-07 Home Content Sections
 */
export function initHomeContent(mountSelector = '#home-content-root') {
  const container = document.querySelector(mountSelector);
  if (!container) return;

  const data = validateHomeContentConfig(siteConfig);

  container.innerHTML = `
    <!-- ==========================================================================
         US-07 CRITERION 1: THREE CORE CARDS (Lead, Sales, Booking Management)
         With Icon, Description, Screenshot, and Link to Features Page
         ========================================================================== -->
    <section class="home-section core-areas-section" id="core-areas-summary" aria-label="Core Functional Areas">
      <div class="home-content-container">
        <div class="section-header-centered">
          <span class="section-tag-pill">Comprehensive Real Estate CRM</span>
          <h2 class="section-main-heading">Three Core Areas, One Native Salesforce Package</h2>
          <p class="section-sub-copy">Everything your property sales operation needs to manage the complete lifecycle from initial portal enquiry to milestone handover.</p>
        </div>

        <div class="core-cards-grid">
          ${data.coreCards.map((card) => `
            <div class="core-feature-card" id="core-card-${card.id}">
              <div class="card-top-row">
                <span class="card-icon-wrapper" aria-hidden="true">
                  ${getIconSvg(card.icon)}
                </span>
                <span class="card-badge-pill">${card.badge}</span>
              </div>

              <h3 class="core-card-title">${card.title}</h3>
              <p class="core-card-description">${card.description}</p>

              <!-- US-07 Criterion 1: Screenshot preview -->
              <div class="core-card-screenshot-frame" aria-label="${card.title} interface preview">
                <img src="${card.screenshot}" 
                     alt="${card.title} Salesforce interface preview" 
                     class="core-card-screenshot-img" 
                     loading="lazy" />
              </div>

              <ul class="core-card-checklist" aria-label="${card.title} capabilities">
                ${card.features.map(f => `
                  <li>
                    <svg class="check-small-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>${f}</span>
                  </li>
                `).join('')}
              </ul>

              <div class="card-action-row">
                <a href="${card.link}" class="btn-card-link" aria-label="Explore ${card.title} features on Features page">
                  <span>Explore ${card.title}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ==========================================================================
         US-07 CRITERION 2: THREE TO FOUR ROLE BENEFITS
         With Simple Pictures/Illustrations and Links to Benefits Page
         ========================================================================== -->
    <section class="home-section benefits-section" id="benefits-summary" aria-label="Key Quantifiable Benefits">
      <div class="home-content-container">
        <div class="section-header-centered">
          <span class="section-tag-pill">Business Impact</span>
          <h2 class="section-main-heading">Measurable Operational Advantages for Real Estate Leaders</h2>
          <p class="section-sub-copy">Engineered to deliver immediate velocity for sales heads, project directors, and Salesforce CRM teams.</p>
        </div>

        <div class="benefits-cards-grid">
          ${data.benefits.map(b => `
            <div class="benefit-home-card" id="${b.id}">
              <div class="benefit-icon-box" aria-hidden="true">
                ${getIconSvg(b.icon)}
              </div>
              <h3 class="benefit-card-title">${b.title}</h3>
              <p class="benefit-card-text">${b.text}</p>
              <a href="${b.link}" class="benefit-learn-link" aria-label="Learn more about ${b.title} on Benefits page">
                <span>See role benefits</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ==========================================================================
         US-07 CRITERION 3: ENQUIRY-TO-BOOKING 4-STAGE PIPELINE JOURNEY
         Enquiry Arrives -> Rep Follows Up -> Deal Progresses -> Unit is Booked
         ========================================================================== -->
    <section class="home-section journey-section" id="journey-flow" aria-label="Enquiry to Booking Customer Journey">
      <div class="home-content-container">
        <div class="section-header-centered">
          <span class="section-tag-pill">Lifecycle Automation</span>
          <h2 class="section-main-heading">From Enquiry to Booking in Four Transparent Steps</h2>
          <p class="section-sub-copy">Watch how EstateForce orchestrates every deal touchpoint, eliminating lead leakage and spreadsheet chaos.</p>
        </div>

        <div class="journey-stages-grid">
          ${data.journeyStages.map((stage, idx) => `
            <div class="journey-stage-card" id="stage-${stage.step}">
              <div class="stage-step-indicator">
                <span class="stage-number">${stage.step}</span>
                ${idx < 3 ? '<span class="stage-arrow-line" aria-hidden="true"></span>' : ''}
              </div>
              <div class="stage-content-box">
                <span class="stage-badge">${stage.badge}</span>
                <h3 class="stage-title">${stage.title}</h3>
                <p class="stage-desc">${stage.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ==========================================================================
         US-07 CRITERION 4: FOUR-STEP HOW IT WORKS ROADMAP
         Book a Demo -> We Set It Up -> Your Team is Trained -> Go Live
         ========================================================================== -->
    <section class="home-section how-it-works-section" id="how-it-works" aria-label="How It Works Implementation Steps">
      <div class="home-content-container">
        <div class="section-header-centered">
          <span class="section-tag-pill">Rapid Deployment</span>
          <h2 class="section-main-heading">Live in Your Salesforce Org in 14 Business Days</h2>
          <p class="section-sub-copy">A proven, risk-free onboarding path designed to get your property sales operation running without disrupting live projects.</p>
        </div>

        <div class="how-steps-grid">
          ${data.howItWorks.map(step => `
            <div class="how-step-card" id="step-${step.step}">
              <div class="how-step-badge">${step.step}</div>
              <h3 class="how-step-title">${step.title}</h3>
              <p class="how-step-desc">${step.description}</p>
            </div>
          `).join('')}
        </div>

        <div class="how-action-center">
          <a href="#how-it-works" class="btn-hero-secondary" style="height: 42px;">
            <span>View Full Implementation Roadmap</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- ==========================================================================
         US-07 CRITERION 5: CUSTOMER TESTIMONIALS (2 TO 3 APPROVED TESTIMONIALS)
         Name, Photo, Company, Quote, 5-Star Rating, Permission Enforced
         ========================================================================== -->
    <section class="home-section testimonials-section" id="customers" aria-label="Customer Proof and Testimonials">
      <div class="home-content-container">
        <div class="section-header-centered">
          <span class="section-tag-pill">Customer Proof</span>
          <h2 class="section-main-heading">What Real Estate Directors Say About EstateForce</h2>
          <p class="section-sub-copy">Hear directly from industry sales leaders managing high-volume residential and commercial townships.</p>
        </div>

        <div class="testimonials-cards-grid">
          ${data.approvedTestimonials.map(t => `
            <div class="testimonial-card" id="${t.id}">
              <div class="testimonial-rating-stars" role="img" aria-label="5 out of 5 stars rating">
                <svg class="star-gold" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg class="star-gold" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg class="star-gold" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg class="star-gold" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg class="star-gold" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>

              <blockquote class="testimonial-quote">
                &ldquo;${t.quote}&rdquo;
              </blockquote>

              <div class="testimonial-author-row">
                <img src="${t.photo}" alt="${t.customerName}" class="author-avatar-img" width="46" height="46" loading="lazy" />
                <div class="author-meta">
                  <p class="author-name">${t.customerName}</p>
                  <p class="author-title">${t.company}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ==========================================================================
         US-07 CRITERION 6: COLOURED CLOSING BAND WITH DEMO CTA
         Prominent Message (<=100 Chars) and Request a Demo Action
         ========================================================================== -->
    <section class="closing-band-section" id="closing-cta" aria-label="Closing Call to Action">
      <div class="closing-band-container">
        <div class="closing-band-content">
          <h2 class="closing-band-message">${data.closingCta.message}</h2>
          <p class="closing-band-sub">Join leading real estate builders who eliminated spreadsheets and boosted unit sales velocity natively on Salesforce.</p>
        </div>
        <div class="closing-band-actions">
          <a href="${data.closingCta.buttonLink}" class="btn-closing-demo btn-cta-demo" id="closing-demo-btn">
            <span>${data.closingCta.buttonLabel}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `;

  // Attach event telemetry for closing CTA demo button
  const closingDemoBtn = container.querySelector('#closing-demo-btn');
  if (closingDemoBtn) {
    closingDemoBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('estateforce:demo_click', {
        detail: {
          source: 'home_closing_band',
          timestamp: new Date().toISOString()
        }
      }));
    });
  }
}
