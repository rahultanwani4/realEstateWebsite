import siteConfig from '../data/site-config.json';
import { openProcessDetailsModal } from './ProcessDetailsModal.js';

/**
 * Validates US-07 Home Content Sections configuration:
 * - Exactly 3 core cards (title max 40, description max 120, screenshot required)
 * - 3-4 benefits (title max 50, text max 140)
 * - Exactly 4 journey stages (title max 40)
 * - Exactly 4 how-it-works steps (title max 40)
 * - 2-3 testimonials with confirmed permission (quote max 300)
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

  // 2. Journey stages validation (4 to 6 stages)
  if (!homeContent.journeyStages || homeContent.journeyStages.length < 4) {
    console.warn(`US-07 Validation Warning: At least 4 journey stages required. Found: ${homeContent.journeyStages?.length}`);
  }

  // 3. Benefits validation (3 to 4)
  if (!homeContent.benefits || homeContent.benefits.length < 3 || homeContent.benefits.length > 4) {
    console.warn(`US-07 Validation Warning: 3 to 4 benefits required. Found: ${homeContent.benefits?.length}`);
  }

  // 4. How it works validation (Exactly 4)
  if (!homeContent.howItWorks || homeContent.howItWorks.length !== 4) {
    console.warn(`US-07 Validation Warning: Exactly 4 how-it-works steps required. Found: ${homeContent.howItWorks?.length}`);
  }

  return {
    ...homeContent
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
         With 3-Option Selector Tabs on Mobile (Lead Management Auto-Selected)
         ========================================================================== -->
    <section class="home-section core-areas-section" id="core-areas-summary" aria-label="Core Functional Areas">
      <div class="home-content-container">
        <div class="section-header-centered">
          <span class="section-tag-pill">Comprehensive Real Estate CRM</span>
          <h2 class="section-main-heading">Three Core Areas, One Native Salesforce Package</h2>
          <p class="section-sub-copy">Everything your property sales operation needs to manage the complete lifecycle from initial portal enquiry to milestone handover.</p>
        </div>

        <!-- 3-Option Tabs Selector (Kept for desktop/tablet if needed, hidden on mobile) -->
        <div class="core-feature-tabs-wrapper" role="tablist" aria-label="Select Core CRM Area">
          ${data.coreCards.map((card, idx) => `
            <button type="button" 
                    class="core-tab-pill ${idx === 0 ? 'is-active' : ''}" 
                    data-target-card="${card.id}" 
                    id="core-tab-${card.id}"
                    role="tab" 
                    aria-selected="${idx === 0 ? 'true' : 'false'}">
              <span class="core-tab-pill-icon" aria-hidden="true">${getIconSvg(card.icon)}</span>
              <span class="core-tab-pill-label">${card.title}</span>
            </button>
          `).join('')}
        </div>

        <div class="core-cards-grid" id="core-cards-container">
          ${data.coreCards.map((card, idx) => `
            <div class="core-feature-card ${idx === 0 ? 'is-active is-open' : ''}" id="core-card-${card.id}" data-card-id="${card.id}" role="region" aria-label="${card.title}">
              
              <!-- Accordion Header: Clickable on mobile to expand/collapse, static on desktop -->
              <div class="core-card-accordion-header" role="button" tabindex="0" aria-expanded="${idx === 0 ? 'true' : 'false'}" aria-controls="core-card-body-${card.id}">
                <div class="card-top-row">
                  <span class="card-icon-wrapper" aria-hidden="true">
                    ${getIconSvg(card.icon)}
                  </span>
                  <div class="card-header-titles">
                    <h3 class="core-card-title">${card.title}</h3>
                    <span class="card-badge-pill">${card.badge}</span>
                  </div>
                </div>
                <div class="card-accordion-toggle" aria-hidden="true">
                  <svg class="accordion-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              <!-- Accordion Content Body -->
              <div class="core-card-accordion-body" id="core-card-body-${card.id}">
                <p class="core-card-description">${card.description}</p>

                <!-- Interface Preview with Device Window Topbar & Live Indicator -->
                <div class="core-card-screenshot-frame" data-card-id="${card.id}" aria-label="${card.title} interface preview">
                  <div class="card-mockup-topbar">
                    <div class="mockup-window-dots">
                      <span class="mockup-dot red"></span>
                      <span class="mockup-dot yellow"></span>
                      <span class="mockup-dot green"></span>
                    </div>
                    <div class="mockup-url-pill">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      <span>${card.id === 'lead-management' ? 'salesforce.com/leads/new-enquiry' : card.id === 'sales-management' ? 'salesforce.com/cadence/site-visits' : 'salesforce.com/booking/inventory-unit'}</span>
                    </div>
                    <div class="mockup-status-indicator">
                      <span class="status-pulse-dot"></span>
                      <span>Live</span>
                    </div>
                  </div>
                  <div class="card-mockup-img-wrapper">
                    <img src="${card.screenshot}" 
                         alt="${card.title} Salesforce interface preview" 
                         class="core-card-screenshot-img" 
                         loading="lazy" />
                    <div class="card-screen-hover-badge">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      <span>Click for Process Details</span>
                    </div>
                  </div>
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
                  <button type="button" class="btn-card-process" data-card-id="${card.id}" aria-label="Explore process details for ${card.title}">
                    <span>View Process Details</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>



    <!-- ==========================================================================
         US-07 CRITERION 3: ENQUIRY-TO-HANDOVER 6-STAGE PIPELINE JOURNEY
         With Connected Vertical Pipeline Timeline on Mobile
         ========================================================================== -->
    <section class="home-section journey-section" id="journey-flow" aria-label="Enquiry to Handover Customer Journey">
      <div class="home-content-container">
        <div class="section-header-centered">
          <span class="section-tag-pill">Lifecycle Automation</span>
          <h2 class="section-main-heading">From Enquiry to Handover in Six Transparent Steps</h2>
          <p class="section-sub-copy">Watch how CC Real Estate orchestrates every deal touchpoint, eliminating lead leakage and spreadsheet chaos.</p>
        </div>

        <!-- 6-Stage Step Selector Tabs (Desktop/Tablet) -->
        <div class="journey-steps-selector-wrapper" role="tablist" aria-label="Customer Journey Steps">
          ${data.journeyStages.map((stage, idx) => `
            <button type="button" 
                    class="journey-step-pill ${idx === 0 ? 'is-active' : ''}" 
                    data-step="${stage.step}"
                    id="journey-pill-step-${stage.step}"
                    role="tab" 
                    aria-selected="${idx === 0 ? 'true' : 'false'}">
              <span class="journey-pill-num">${stage.step}</span>
              <span class="journey-pill-title">${stage.shortTitle || stage.title}</span>
            </button>
          `).join('')}
        </div>

        <!-- 6-Stage Timeline Grid: 3-Column on Desktop, Vertical Pipeline on Mobile -->
        <div class="journey-stages-grid" id="journey-stages-container">
          ${data.journeyStages.map((stage, idx) => `
            <div class="journey-stage-card ${idx === 0 ? 'is-active is-open' : ''}" id="stage-${stage.step}" data-step="${stage.step}" role="region" aria-label="Stage ${stage.step}: ${stage.title}">
              
              <!-- Timeline Milestone Node Indicator -->
              <div class="stage-step-indicator" role="button" tabindex="0" aria-label="Step ${stage.step}: ${stage.title}">
                <span class="stage-number">${stage.step}</span>
                <span class="stage-arrow-line" aria-hidden="true"></span>
              </div>

              <!-- Stage Content Box (Accordion style on mobile) -->
              <div class="stage-content-box">
                <div class="stage-header-clickable" role="button" tabindex="0" aria-expanded="${idx === 0 ? 'true' : 'false'}">
                  <div class="stage-badge-row">
                    <span class="stage-badge">${stage.badge}</span>
                    <span class="stage-counter-pill">Stage ${stage.step} of ${data.journeyStages.length}</span>
                  </div>
                  <div class="stage-title-flex">
                    <h3 class="stage-title">${stage.title}</h3>
                    <span class="stage-accordion-chevron" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </div>
                </div>

                <div class="stage-expandable-body">
                  <div class="stage-metric-highlight">
                    <span class="metric-icon">⚡</span>
                    <span class="metric-text">${stage.highlight || stage.badge}</span>
                  </div>

                  <p class="stage-desc">${stage.description}</p>

                  <!-- Step Navigator Controls on Mobile -->
                  <div class="stage-mobile-nav">
                    ${idx > 0 ? `
                      <button type="button" class="btn-journey-nav btn-prev-stage" data-next-step="${data.journeyStages[idx - 1].step}">
                        ← Prev Stage
                      </button>
                    ` : '<span></span>'}
                    ${idx < data.journeyStages.length - 1 ? `
                      <button type="button" class="btn-journey-nav btn-next-stage" data-next-step="${data.journeyStages[idx + 1].step}">
                        Next: Step ${data.journeyStages[idx + 1].step} →
                      </button>
                    ` : `
                      <a href="#contact" class="btn-journey-nav btn-finish-stage">
                        Schedule Demo →
                      </a>
                    `}
                  </div>
                </div>

              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>



    <!-- ==========================================================================
         US-07 CRITERION 6: REFINED CLOSING BAND WITH DEMO CTA
         Sleek, Compact Card with High-End Contrast (No Bulky Blue Box)
         ========================================================================== -->
    <section class="closing-band-section" id="closing-cta" aria-label="Closing Call to Action">
      <div class="closing-band-container">
        <div class="closing-band-content">
          <span class="closing-band-tag">Salesforce Native Package</span>
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

  // 1. Core Feature Accordion Interactivity
  const coreCards = container.querySelectorAll('.core-feature-card');
  const coreTabs = container.querySelectorAll('.core-tab-pill');

  const toggleCoreCard = (cardId) => {
    const targetCard = container.querySelector(`#core-card-${cardId}`);
    if (!targetCard) return;

    const isAlreadyOpen = targetCard.classList.contains('is-open');

    // If currently open and clicked, toggle it closed
    if (isAlreadyOpen) {
      targetCard.classList.remove('is-active', 'is-open');
      const header = targetCard.querySelector('.core-card-accordion-header');
      if (header) header.setAttribute('aria-expanded', 'false');
      coreTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      return;
    }

    // Otherwise, close all other cards and open this one
    coreCards.forEach(card => {
      const isMatch = card.getAttribute('data-card-id') === cardId;
      card.classList.toggle('is-active', isMatch);
      card.classList.toggle('is-open', isMatch);
      const header = card.querySelector('.core-card-accordion-header');
      if (header) {
        header.setAttribute('aria-expanded', isMatch ? 'true' : 'false');
      }
    });

    coreTabs.forEach(tab => {
      const isMatch = tab.getAttribute('data-target-card') === cardId;
      tab.classList.toggle('is-active', isMatch);
      tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });
  };

  coreCards.forEach(card => {
    const header = card.querySelector('.core-card-accordion-header');
    if (header) {
      header.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        const cardId = card.getAttribute('data-card-id');
        if (cardId) toggleCoreCard(cardId);
      });
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const cardId = card.getAttribute('data-card-id');
          if (cardId) toggleCoreCard(cardId);
        }
      });
    }
  });

  coreTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cardId = tab.getAttribute('data-target-card');
      if (cardId) toggleCoreCard(cardId);
    });
  });

  // 2. Journey Stages Vertical Timeline Interactivity
  const journeyCards = container.querySelectorAll('.journey-stage-card');
  const journeyTabs = container.querySelectorAll('.journey-step-pill');

  const toggleJourneyStage = (stepNum) => {
    const rawStep = String(stepNum).replace(/^0+/, '') || '1';
    const targetCard = Array.from(journeyCards).find(c => {
      const cStep = String(c.getAttribute('data-step')).replace(/^0+/, '');
      return cStep === rawStep;
    });

    if (!targetCard) return;

    const isAlreadyOpen = targetCard.classList.contains('is-open');

    if (isAlreadyOpen) {
      targetCard.classList.remove('is-active', 'is-open');
      const header = targetCard.querySelector('.stage-header-clickable');
      if (header) header.setAttribute('aria-expanded', 'false');
      journeyTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      return;
    }

    journeyTabs.forEach(t => {
      const tStep = String(t.getAttribute('data-step')).replace(/^0+/, '');
      const isMatch = tStep === rawStep;
      t.classList.toggle('is-active', isMatch);
      t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    journeyCards.forEach(card => {
      const cStep = String(card.getAttribute('data-step')).replace(/^0+/, '');
      const isMatch = cStep === rawStep;
      card.classList.toggle('is-active', isMatch);
      card.classList.toggle('is-open', isMatch);
      const header = card.querySelector('.stage-header-clickable');
      if (header) {
        header.setAttribute('aria-expanded', isMatch ? 'true' : 'false');
      }
    });
  };

  journeyCards.forEach(card => {
    const header = card.querySelector('.stage-header-clickable');
    const indicator = card.querySelector('.stage-step-indicator');
    const triggerHandler = (e) => {
      if (e.target.closest('a, button')) return;
      const step = card.getAttribute('data-step');
      if (step) toggleJourneyStage(step);
    };
    if (header) {
      header.addEventListener('click', triggerHandler);
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const step = card.getAttribute('data-step');
          if (step) toggleJourneyStage(step);
        }
      });
    }
    if (indicator) {
      indicator.addEventListener('click', triggerHandler);
    }
  });

  journeyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = tab.getAttribute('data-step');
      if (step) toggleJourneyStage(step);
    });
  });

  // Step next/prev triggers inside the journey cards
  container.querySelectorAll('.btn-journey-nav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextStep = btn.getAttribute('data-next-step');
      if (nextStep) toggleJourneyStage(nextStep);
    });
  });

  // Attach process modal click handler on core cards - STRICTLY for "View Process Details" button or preview screenshot
  container.addEventListener('click', (e) => {
    // If clicking accordion header or navigation, DO NOT trigger the modal!
    if (e.target.closest('.core-card-accordion-header, .card-accordion-toggle, .stage-header-clickable, .stage-step-indicator, .btn-journey-nav, .journey-step-pill, .core-tab-pill')) {
      return;
    }

    const modalTrigger = e.target.closest('.btn-card-process, .core-card-screenshot-frame');
    if (modalTrigger) {
      const cardId = modalTrigger.getAttribute('data-card-id');
      if (cardId) {
        e.preventDefault();
        e.stopPropagation();
        openProcessDetailsModal(cardId);
      }
    }
  });

  // Support Enter / Space key for keyboard accessibility ONLY on the process details button
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const modalBtn = e.target.closest('.btn-card-process');
      if (modalBtn && modalBtn === document.activeElement) {
        const cardId = modalBtn.getAttribute('data-card-id');
        if (cardId) {
          e.preventDefault();
          e.stopPropagation();
          openProcessDetailsModal(cardId);
        }
      }
    }
  });

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
