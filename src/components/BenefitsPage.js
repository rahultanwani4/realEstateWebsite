import siteConfig from '../data/site-config.json';
import { initRoiCalculator } from './RoiCalculator.js';

/**
 * Validates US-10 Benefits Page configurations
 */
function validateBenefitsConfig(config) {
  const { benefitsPage } = config;
  if (!benefitsPage) {
    throw new Error('US-10 Error: benefitsPage configuration is required.');
  }

  // Introduction <= 300 chars
  if (benefitsPage.pageIntroduction.length > 300) {
    console.warn('US-10 Warning: Page introduction exceeds 300 characters.');
  }

  // Exactly 4 roles required
  const requiredRoles = ['sales-head', 'sales-exec', 'owner-director', 'salesforce-admin'];
  const configuredRoleIds = (benefitsPage.roles || []).map(r => r.id);
  requiredRoles.forEach(r => {
    if (!configuredRoleIds.includes(r)) {
      console.warn(`US-10 Warning: Role '${r}' is required.`);
    }
  });

  // Verify proof figures: cannot publish without approval
  (benefitsPage.roles || []).forEach(role => {
    role.benefits.forEach(b => {
      if (b.proofFigure && b.proofApproved !== true) {
        console.warn(`US-10 Warning: Unapproved proof figure '${b.proofFigure}' suppressed.`);
        b.proofFigure = null;
      }
    });
  });

  // Comparison rows 3 to 8
  if (!benefitsPage.beforeVsAfter || benefitsPage.beforeVsAfter.length < 3 || benefitsPage.beforeVsAfter.length > 8) {
    console.warn(`US-10 Warning: 3 to 8 comparison rows required. Found: ${benefitsPage.beforeVsAfter?.length}`);
  }

  return benefitsPage;
}

/**
 * Initializes and mounts US-10 (Benefits Page by Role & Before vs After Matrix)
 */
export function initBenefitsPage(mountSelector = '#benefits-page-root') {
  const container = document.querySelector(mountSelector);
  if (!container) return;

  const data = validateBenefitsConfig(siteConfig);

  container.innerHTML = `
    <div class="benefits-page-wrapper" id="benefits-page-top">
      
      <!-- Top Banner Introduction (US-10 Criterion 1) -->
      <section class="benefits-intro-banner" aria-label="Benefits Page Introduction">
        <div class="benefits-intro-container">
          <span class="section-tag-pill">Quantifiable Business Value</span>
          <h1 class="benefits-page-headline">Tailored for Every Real Estate Stakeholder</h1>
          <p class="benefits-page-subtext">${data.pageIntroduction}</p>
        </div>
      </section>

      <!-- Role-Based Benefits Section (US-10 Criterion 1, 2) -->
      <section class="benefits-by-role-section" aria-label="Benefits Tailored by Leadership Role">
        <div class="benefits-page-container">
          
          <!-- Role Navigation Selector Tabs -->
          <div class="role-tabs-bar" role="tablist" aria-label="Select your operational role">
            ${data.roles.map((role, idx) => `
              <button class="role-tab-btn ${idx === 0 ? 'is-active' : ''}" 
                      id="tab-${role.id}" 
                      data-role="${role.id}" 
                      role="tab" 
                      aria-selected="${idx === 0 ? 'true' : 'false'}" 
                      aria-controls="panel-${role.id}">
                <span class="tab-role-name">${role.label}</span>
              </button>
            `).join('')}
          </div>

          <!-- Role Content Panels -->
          <div class="role-panels-wrapper">
            ${data.roles.map((role, idx) => `
              <div class="role-benefit-panel ${idx === 0 ? 'is-active' : ''}" 
                   id="panel-${role.id}" 
                   role="tabpanel" 
                   aria-labelledby="tab-${role.id}">
                
                <div class="role-panel-header">
                  <h2 class="role-header-title">Benefits for ${role.label}</h2>
                  <p class="role-header-tagline">${role.tagline}</p>
                </div>

                <div class="role-cards-grid">
                  ${role.benefits.map((b) => `
                    <div class="role-value-card">
                      <div class="role-card-top">
                        <span class="value-check-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        ${b.proofFigure && b.proofApproved ? `
                          <span class="proof-number-badge">${b.proofFigure}</span>
                        ` : ''}
                      </div>

                      <h3 class="role-benefit-headline">${b.headline}</h3>
                      <p class="role-benefit-explanation">${b.explanation}</p>
                    </div>
                  `).join('')}
                </div>

              </div>
            `).join('')}
          </div>

        </div>
      </section>

      <!-- Before vs After Comparison Matrix (US-10 Criterion 3) -->
      <section class="comparison-matrix-section" id="comparison" aria-label="Before vs After Comparison Matrix">
        <div class="benefits-page-container">
          <div class="section-header-centered">
            <span class="section-tag-pill">Operational Transformation</span>
            <h2 class="section-main-heading">Spreadsheets vs. Native Salesforce</h2>
            <p class="section-sub-copy">See the stark contrast between running high-stakes real estate projects on disconnected Excel files versus an automated, native Salesforce package.</p>
          </div>

          <!-- Comparison Table (Desktop Grid / Mobile Stacked Cards) -->
          <div class="comparison-table-wrapper" role="region" aria-label="Comparison Table">
            <div class="comparison-table-header" role="row">
              <div class="comp-col-topic" role="columnheader">Operational Area</div>
              <div class="comp-col-before" role="columnheader">
                <span class="status-indicator is-before"></span>
                <span>Before (Spreadsheets &amp; Manual Tools)</span>
              </div>
              <div class="comp-col-after" role="columnheader">
                <span class="status-indicator is-after"></span>
                <span>After (EstateForce on Salesforce)</span>
              </div>
            </div>

            <div class="comparison-table-body">
              ${data.beforeVsAfter.map(row => `
                <div class="comparison-row" id="${row.id}" role="row">
                  <div class="comp-cell-topic" role="rowheader">
                    <span class="mobile-label-tag">Operational Area</span>
                    <strong>${row.topic}</strong>
                  </div>
                  <div class="comp-cell-before" role="cell">
                    <span class="mobile-status-tag is-before">Without EstateForce</span>
                    <p>${row.before}</p>
                  </div>
                  <div class="comp-cell-after" role="cell">
                    <span class="mobile-status-tag is-after">With EstateForce</span>
                    <p>${row.after}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- US-11: Interactive ROI & Savings Calculator -->
          <div id="roi-calculator-mount"></div>

          <!-- Final Conversion Band -->
          <div class="benefits-final-cta-band">
            <div class="final-cta-inner">
              <div class="final-cta-content">
                <h3 class="final-cta-heading">Ready to see these ROI improvements in your sales team?</h3>
                <p class="final-cta-sub">Book a 30-minute tailored walkthrough with our certified real estate Salesforce consultants.</p>
              </div>
              <div class="final-cta-action">
                <a href="#request-demo?source=benefits_page" class="btn-benefits-demo btn-cta-demo" id="benefits-bottom-demo-btn">
                  <span>Request a Demo</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  `;

  // Attach tab switching interactivity for role selector
  setupRoleTabs(container);

  // Mount US-11 Interactive ROI & Savings Calculator
  initRoiCalculator(container.querySelector('#roi-calculator-mount'));

  // Attach demo telemetry listener
  const demoBtn = container.querySelector('#benefits-bottom-demo-btn');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('estateforce:demo_click', {
        detail: {
          source: 'benefits_page_bottom',
          timestamp: new Date().toISOString()
        }
      }));
    });
  }
}

/**
 * Interactive role tab switching
 */
function setupRoleTabs(container) {
  const tabs = container.querySelectorAll('.role-tab-btn');
  const panels = container.querySelectorAll('.role-benefit-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetRole = tab.dataset.role;

      // Update tab active states
      tabs.forEach(t => {
        const isActive = t === tab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update panel visibility
      panels.forEach(p => {
        const isActive = p.id === `panel-${targetRole}`;
        p.classList.toggle('is-active', isActive);
      });
    });
  });
}
