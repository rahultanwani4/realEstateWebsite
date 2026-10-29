import siteConfig from '../data/site-config.json';

/**
 * Validates US-12 Who It Is For Page configuration:
 * - Exactly 3 audiences required:
 *   1. Developers and builders
 *   2. Brokerages and agencies
 *   3. Sales and management teams
 * - Section title <= 60 characters
 * - Challenge text <= 400 characters
 * - Solution text <= 400 characters
 * - Alt text <= 150 characters
 * - Screenshot image required
 */
function validateWhoItIsForConfig(config) {
  const { whoItIsForPage } = config;
  if (!whoItIsForPage) {
    throw new Error('US-12 Error: whoItIsForPage configuration is required.');
  }

  const requiredAudiences = [
    'Developers and builders',
    'Brokerages and agencies',
    'Sales and management teams'
  ];

  const configuredAudiences = (whoItIsForPage.audiences || []).map(a => a.audience);
  requiredAudiences.forEach(reqAud => {
    if (!configuredAudiences.includes(reqAud)) {
      throw new Error(`US-12 Error: Audience '${reqAud}' must exist to publish.`);
    }
  });

  (whoItIsForPage.audiences || []).forEach(aud => {
    // Title <= 60 chars
    if (aud.sectionTitle && aud.sectionTitle.length > 60) {
      console.warn(`US-12 Warning: Section title for '${aud.audience}' exceeds 60 chars (${aud.sectionTitle.length}). Truncating.`);
      aud.sectionTitle = aud.sectionTitle.slice(0, 60);
    }

    // Challenge text <= 400 chars
    if (aud.challengeText && aud.challengeText.length > 400) {
      console.warn(`US-12 Warning: Challenge text for '${aud.audience}' exceeds 400 chars (${aud.challengeText.length}). Truncating.`);
      aud.challengeText = aud.challengeText.slice(0, 400);
    }

    // Solution text <= 400 chars
    if (aud.solutionText && aud.solutionText.length > 400) {
      console.warn(`US-12 Warning: Solution text for '${aud.audience}' exceeds 400 chars (${aud.solutionText.length}). Truncating.`);
      aud.solutionText = aud.solutionText.slice(0, 400);
    }

    // Alt text <= 150 chars
    if (aud.alt && aud.alt.length > 150) {
      console.warn(`US-12 Warning: Alt text for '${aud.audience}' exceeds 150 chars (${aud.alt.length}). Truncating.`);
      aud.alt = aud.alt.slice(0, 150);
    }

    if (!aud.screenshot) {
      throw new Error(`US-12 Error: Screenshot is required for '${aud.audience}'.`);
    }
  });

  return whoItIsForPage;
}

/**
 * Audience icons map with explicit width, height, and Tailwind classes
 */
const AUDIENCE_ICONS = {
  'developers-builders': `
    <svg viewBox="0 0 24 24" width="18" height="18" class="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="9" y1="22" x2="9" y2="22.01"></line>
      <line x1="15" y1="22" x2="15" y2="22.01"></line>
      <line x1="8" y1="6" x2="10" y2="6"></line>
      <line x1="14" y1="6" x2="16" y2="6"></line>
      <line x1="8" y1="10" x2="10" y2="10"></line>
      <line x1="14" y1="10" x2="16" y2="10"></line>
      <line x1="8" y1="14" x2="10" y2="14"></line>
      <line x1="14" y1="14" x2="16" y2="14"></line>
      <line x1="8" y1="18" x2="10" y2="18"></line>
      <line x1="14" y1="18" x2="16" y2="18"></line>
    </svg>
  `,
  'brokerages-agencies': `
    <svg viewBox="0 0 24 24" width="18" height="18" class="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,
  'sales-management-teams': `
    <svg viewBox="0 0 24 24" width="18" height="18" class="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  `
};

/**
 * Initializes and mounts US-12 (Who It Is For Page) using Tailwind CSS
 */
export function initWhoItIsForPage(mountTarget = '#who-it-is-for-page-root') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = validateWhoItIsForConfig(siteConfig);

  container.innerHTML = `
    <section class="who-it-is-for-page relative py-16 sm:py-20 lg:py-24 bg-slate-50/60 border-t border-slate-200 scroll-mt-20" id="who-it-is-for-section" aria-labelledby="who-page-heading">
      
      <!-- Top Banner Introduction -->
      <div class="who-intro-banner text-center mb-10 sm:mb-12 max-w-4xl mx-auto px-4 sm:px-6">
        <span class="inline-flex items-center px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 rounded-full mb-3.5">Tailored Operating Models</span>
        <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight mb-3" id="who-page-heading">Engineered for Your Operating Model</h1>
        <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">${data.pageIntroduction}</p>

        <!-- Interactive Audience Navigation Tabs -->
        <div class="who-tabs-wrapper flex justify-center w-full overflow-x-auto pb-1" style="scrollbar-width: none;">
          <div class="who-tabs-bar inline-flex items-center gap-1.5 sm:gap-2 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm max-w-full" role="tablist" aria-label="Select your real estate operating model">
            ${data.audiences.map((aud, idx) => `
              <button type="button" 
                      class="who-tab-btn inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${idx === 0 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 -translate-y-0.5 is-active' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/80'}" 
                      id="who-tab-${aud.id}" 
                      data-audience="${aud.id}"
                      role="tab" 
                      aria-selected="${idx === 0 ? 'true' : 'false'}" 
                      aria-controls="audience-${aud.id}">
                <span class="flex items-center justify-center text-current shrink-0" aria-hidden="true">${AUDIENCE_ICONS[aud.id] || ''}</span>
                <span>${aud.audience}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 3 Structured Audience Showcase Panels (US-12 Criterion 1, 2, 3) -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        ${data.audiences.map((aud, idx) => `
          <article class="who-audience-panel ${idx === 0 ? 'block is-active' : 'hidden'} transition-all duration-300" 
                   id="audience-${aud.id}" 
                   role="tabpanel" 
                   aria-labelledby="who-tab-${aud.id}">
            
            <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center">
              
              <!-- Left Column: Copy, Operational Challenge, Package Solution & Pre-set Demo CTA -->
              <div class="flex flex-col">
                
                <div class="flex items-center justify-between gap-4 mb-3.5">
                  <span class="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-200">${aud.badge}</span>
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Model 0${idx + 1} of 03</span>
                </div>

                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight mb-5" id="heading-${aud.id}">${aud.sectionTitle}</h2>

                <!-- Operational Comparison Cards (Tailwind CSS Clean Style) -->
                <div class="flex flex-col gap-3.5 mb-6">
                  
                  <!-- The Daily Challenge Card (US-12 Criterion 2) -->
                  <div class="p-4 sm:p-5 rounded-xl bg-rose-50/70 border border-rose-200/80 transition-shadow duration-200 hover:shadow-sm" role="region" aria-label="The daily operational challenge for ${aud.audience}">
                    <div class="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-rose-700 mb-2">
                      <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12"></line>
                        <line x1="12" y1="16" x2="12.01"></line>
                      </svg>
                      <span>The Daily Operational Challenge</span>
                    </div>
                    <p class="text-sm leading-relaxed text-slate-700 m-0">${aud.challengeText}</p>
                  </div>

                  <!-- How EstateForce Solves It Card (US-12 Criterion 2) -->
                  <div class="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-200/80 transition-shadow duration-200 hover:shadow-sm" role="region" aria-label="How EstateForce solves this challenge for ${aud.audience}">
                    <div class="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-700 mb-2">
                      <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>How EstateForce on Salesforce Solves It</span>
                    </div>
                    <p class="text-sm leading-relaxed text-slate-700 m-0">${aud.solutionText}</p>
                  </div>

                </div>

                <!-- Key Capabilities Checklist -->
                ${aud.keyCapabilities && aud.keyCapabilities.length > 0 ? `
                  <div class="mb-6 pt-1">
                    <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Key Capabilities &amp; Deliverables:</h3>
                    <ul class="list-none p-0 m-0 flex flex-col gap-2.5" aria-label="Key capabilities for ${aud.audience}">
                      ${aud.keyCapabilities.map(cap => `
                        <li class="flex items-start gap-2.5 text-sm font-semibold text-slate-800 leading-snug">
                          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 shrink-0 mt-0.5" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          <span>${cap}</span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}

                <!-- US-12 Criterion 3: Request a Demo button that presets "Type of company" -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                  <a href="#request-demo?company_type=${aud.companyTypeTag}" 
                     class="btn-who-demo btn-cta-demo inline-flex items-center justify-center gap-2.5 h-11 px-6 rounded-full font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-md shadow-blue-500/25 transition-all duration-200 no-underline" 
                     id="demo-btn-${aud.id}"
                     data-company-type="${aud.companyTypeTag}">
                    <span>${aud.demoButtonLabel}</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                  <span class="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-full border border-emerald-200">
                    <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Presets <strong class="font-bold">${aud.audience}</strong> on demo form</span>
                  </span>
                </div>

              </div>

              <!-- Right Column: High-Resolution Screenshot in Clean Device Card (US-12 Criterion 2) -->
              <div class="w-full">
                <div class="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200/90 transition-transform duration-300 hover:-translate-y-1" role="region" aria-label="${aud.alt}">
                  <img src="${aud.screenshot}" 
                       alt="${aud.alt}" 
                       class="w-full h-auto block" 
                       loading="lazy" />
                </div>
              </div>

            </div>

            <!-- Bottom Cross-Audience Pager -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-7 pt-5 border-t border-slate-100">
              <span class="text-xs sm:text-sm font-semibold text-slate-500">Explore another operating model:</span>
              <div class="flex flex-wrap items-center gap-2">
                ${data.audiences.map((otherAud, otherIdx) => `
                  <button type="button" 
                          class="who-footer-pill px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border cursor-pointer ${otherIdx === idx ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold is-current' : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/60'}" 
                          data-target-audience="${otherAud.id}">
                    <span>0${otherIdx + 1}. ${otherAud.audience}</span>
                  </button>
                `).join('')}
              </div>
            </div>

          </article>
        `).join('')}
      </div>

    </section>
  `;

  setupWhoItIsForInteractivity(container);
}

/**
 * Sets up tab switching, bottom pager, hash navigation, and demo click recording for US-12
 */
function setupWhoItIsForInteractivity(container) {
  const tabButtons = container.querySelectorAll('.who-tab-btn');
  const panels = container.querySelectorAll('.who-audience-panel');
  const footerPills = container.querySelectorAll('.who-footer-pill');
  const demoButtons = container.querySelectorAll('.btn-who-demo');

  // Tailwind class sets for interactive states
  const TAB_ACTIVE_CLASSES = ['bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-500/25', '-translate-y-0.5', 'is-active'];
  const TAB_INACTIVE_CLASSES = ['text-slate-600', 'hover:text-blue-600', 'hover:bg-blue-50/80'];

  const PILL_ACTIVE_CLASSES = ['bg-blue-50', 'text-blue-600', 'border-blue-200', 'font-bold', 'is-current'];
  const PILL_INACTIVE_CLASSES = ['bg-slate-50', 'text-slate-600', 'border-slate-200', 'hover:text-blue-600', 'hover:border-blue-200', 'hover:bg-blue-50/60'];

  // Function to switch active audience tab
  function activateAudience(targetId) {
    if (!targetId) return;

    tabButtons.forEach(btn => {
      const isMatch = btn.dataset.audience === targetId;
      if (isMatch) {
        btn.classList.add(...TAB_ACTIVE_CLASSES);
        btn.classList.remove(...TAB_INACTIVE_CLASSES);
      } else {
        btn.classList.remove(...TAB_ACTIVE_CLASSES);
        btn.classList.add(...TAB_INACTIVE_CLASSES);
      }
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    panels.forEach(panel => {
      const isMatch = panel.id === `audience-${targetId}`;
      if (isMatch) {
        panel.classList.remove('hidden');
        panel.classList.add('block', 'is-active');
      } else {
        panel.classList.remove('block', 'is-active');
        panel.classList.add('hidden');
      }
    });

    footerPills.forEach(pill => {
      const isMatch = pill.dataset.targetAudience === targetId;
      if (isMatch) {
        pill.classList.add(...PILL_ACTIVE_CLASSES);
        pill.classList.remove(...PILL_INACTIVE_CLASSES);
      } else {
        pill.classList.remove(...PILL_ACTIVE_CLASSES);
        pill.classList.add(...PILL_INACTIVE_CLASSES);
      }
    });
  }

  // Top tab buttons click handler
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.audience;
      activateAudience(targetId);
    });
  });

  // Footer pills click handler
  footerPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetId = pill.dataset.targetAudience;
      activateAudience(targetId);
      // Smooth scroll back to top of section
      const section = container.querySelector('#who-it-is-for-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Check URL hash for direct audience deep-linking (e.g. #audience-brokerages-agencies)
  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#audience-')) {
      const audienceId = hash.replace('#audience-', '');
      activateAudience(audienceId);
    }
  }

  window.addEventListener('hashchange', checkUrlHash);
  checkUrlHash();

  // Pre-set company type telemetry click recording (US-12 Criterion 3)
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const companyType = btn.dataset.companyType || 'general';
      window.dispatchEvent(new CustomEvent('estateforce:demo_click', {
        detail: {
          source: 'who_it_is_for_page',
          company_type: companyType,
          timestamp: new Date().toISOString()
        }
      }));
    });
  });
}
