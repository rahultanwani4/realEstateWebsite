import siteConfig from '../data/site-config.json';

/**
 * Validates US-13 How It Works Page configuration:
 * - 3 to 7 steps required
 * - Duration mandatory for every step
 * - Step name <= 40 characters
 * - Step explanation <= 150 characters
 * - Estimated duration <= 30 characters
 * - All 5 onboarding topics required:
 *   1. Installation
 *   2. Set-up
 *   3. Training
 *   4. Data migration
 *   5. Support
 * - Topic summary <= 200 characters
 * - Topic detail <= 1,000 characters
 */
function validateHowItWorksConfig(config) {
  const { howItWorksPage } = config;
  if (!howItWorksPage) {
    throw new Error('US-13 Error: howItWorksPage configuration is required.');
  }

  // Validate steps (3-7 steps)
  const steps = howItWorksPage.steps || [];
  if (steps.length < 3 || steps.length > 7) {
    throw new Error(`US-13 Error: Steps must be between 3 and 7. Found: ${steps.length}`);
  }

  steps.forEach((step, idx) => {
    if (!step.name) {
      throw new Error(`US-13 Error: Step ${idx + 1} must have a name.`);
    }
    if (step.name.length > 40) {
      console.warn(`US-13 Warning: Step name '${step.name}' exceeds 40 chars (${step.name.length}). Truncating.`);
      step.name = step.name.slice(0, 40);
    }

    if (!step.explanation) {
      throw new Error(`US-13 Error: Step ${idx + 1} must have an explanation.`);
    }
    if (step.explanation.length > 150) {
      console.warn(`US-13 Warning: Step explanation exceeds 150 chars (${step.explanation.length}). Truncating.`);
      step.explanation = step.explanation.slice(0, 150);
    }

    if (!step.estimatedDuration || step.estimatedDuration.trim().length === 0) {
      throw new Error(`US-13 Error: Duration is mandatory for step ${idx + 1}.`);
    }
    if (step.estimatedDuration.length > 30) {
      console.warn(`US-13 Warning: Estimated duration exceeds 30 chars. Truncating.`);
      step.estimatedDuration = step.estimatedDuration.slice(0, 30);
    }
  });

  // Validate all 5 onboarding topics
  const requiredTopics = ['Installation', 'Set-up', 'Training', 'Data migration', 'Support'];
  const configuredTopics = (howItWorksPage.onboardingTopics || []).map(t => t.topic);

  requiredTopics.forEach(reqTopic => {
    if (!configuredTopics.includes(reqTopic)) {
      throw new Error(`US-13 Error: All 5 onboarding topics required. Missing '${reqTopic}'.`);
    }
  });

  (howItWorksPage.onboardingTopics || []).forEach(t => {
    if (!t.topicSummary) {
      throw new Error(`US-13 Error: Topic summary required for '${t.topic}'.`);
    }
    if (t.topicSummary.length > 200) {
      console.warn(`US-13 Warning: Summary for '${t.topic}' exceeds 200 chars. Truncating.`);
      t.topicSummary = t.topicSummary.slice(0, 200);
    }
    if (t.topicDetail && t.topicDetail.length > 1000) {
      console.warn(`US-13 Warning: Detail for '${t.topic}' exceeds 1000 chars. Truncating.`);
      t.topicDetail = t.topicDetail.slice(0, 1000);
    }
  });

  return howItWorksPage;
}

/**
 * Icons for onboarding topics with explicit width and height
 */
const TOPIC_ICONS = {
  'Installation': `
    <svg viewBox="0 0 24 24" width="20" height="20" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,
  'Set-up': `
    <svg viewBox="0 0 24 24" width="20" height="20" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  `,
  'Data migration': `
    <svg viewBox="0 0 24 24" width="20" height="20" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  `,
  'Training': `
    <svg viewBox="0 0 24 24" width="20" height="20" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
    </svg>
  `,
  'Support': `
    <svg viewBox="0 0 24 24" width="20" height="20" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  `
};

/**
 * Initializes and mounts US-13 (How It Works Page) using Tailwind CSS
 */
export function initHowItWorksPage(mountTarget = '#how-it-works-page-root') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = validateHowItWorksConfig(siteConfig);

  container.innerHTML = `
    <section class="how-it-works-page relative py-16 sm:py-20 lg:py-24 bg-white border-t border-slate-200 scroll-mt-20" id="how-it-works-section" aria-labelledby="how-heading">
      
      <!-- Top Introduction Banner -->
      <div class="text-center mb-12 sm:mb-16 max-w-4xl mx-auto px-4 sm:px-6">
        <span class="inline-flex items-center px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 rounded-full mb-3.5">Deployment &amp; Onboarding</span>
        <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight mb-3.5" id="how-heading">How EstateForce Works &amp; Deploys</h1>
        <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">${data.pageIntroduction}</p>
      </div>

      <!-- US-13 Criterion 1 & 2: Step-by-Step Visual Journey (Horizontal on desktop, vertical on mobile) -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        
        <div class="text-center mb-10">
          <span class="text-xs font-extrabold uppercase tracking-widest text-slate-400">Implementation Timeline</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">${data.journeyTitle}</h2>
          <p class="text-sm text-slate-600 max-w-xl mx-auto">${data.journeySubtitle}</p>
        </div>

        <!-- Timeline Container (Horizontal grid on desktop, vertical stacked list on mobile) -->
        <div class="relative">
          
          <!-- Connecting Bar on Desktop (hidden on mobile) -->
          <div class="hidden lg:block absolute top-[28px] left-[6%] right-[6%] h-1 bg-slate-200 -z-0" aria-hidden="true"></div>

          <!-- The Steps (US-13 Criterion 1: 3-7 steps with duration per step) -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-5 relative z-10">
            ${data.steps.map((step) => `
              <div class="journey-step-card bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between" id="${step.id}">
                <div>
                  
                  <!-- Top Row: Step Number Circle & Duration Pill -->
                  <div class="flex items-center justify-between gap-3 mb-4">
                    <div class="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                      0${step.order}
                    </div>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                      <svg viewBox="0 0 24 24" width="12" height="12" class="w-3 h-3 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>${step.estimatedDuration}</span>
                    </span>
                  </div>

                  <!-- Phase Badge -->
                  <span class="inline-block text-[11px] font-extrabold uppercase tracking-wider text-blue-600 mb-1.5">${step.phaseBadge}</span>

                  <!-- Step Name (<= 40 chars) -->
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2.5">${step.name}</h3>

                  <!-- Step Explanation (<= 150 chars) -->
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">${step.explanation}</p>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Deliverable verified</span>
                  <span class="text-emerald-600 font-bold">✓ Ready</span>
                </div>
              </div>
            `).join('')}
          </div>

        </div>

      </div>

      <!-- US-13 Criterion 3: Five Plain-Language Onboarding Blocks -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        
        <div class="text-center mb-10">
          <span class="text-xs font-extrabold uppercase tracking-widest text-slate-400">Onboarding Scope</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">${data.onboardingSectionTitle}</h2>
          <p class="text-sm text-slate-600 max-w-xl mx-auto">${data.onboardingSectionSubtitle}</p>

          <!-- Onboarding Topic Selector Tabs -->
          <div class="flex justify-center w-full overflow-x-auto mt-6 pb-1" style="scrollbar-width: none;">
            <div class="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 max-w-full" role="tablist" aria-label="Select onboarding topic">
              ${data.onboardingTopics.map((top, idx) => `
                <button type="button" 
                        class="how-topic-tab inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${idx === 0 ? 'bg-white text-blue-600 shadow-sm border border-slate-200 font-extrabold is-active' : 'text-slate-600 hover:text-blue-600'}" 
                        id="tab-${top.id}" 
                        data-topic="${top.id}"
                        role="tab" 
                        aria-selected="${idx === 0 ? 'true' : 'false'}" 
                        aria-controls="panel-${top.id}">
                  <span class="flex items-center justify-center text-current shrink-0" aria-hidden="true">${TOPIC_ICONS[top.topic] || ''}</span>
                  <span>${top.topic}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Topic Detail Panels (US-13 Criterion 3: Summary + Detail for all 5 topics) -->
        <div class="how-topics-panels-container">
          ${data.onboardingTopics.map((top, idx) => `
            <div class="how-topic-panel ${idx === 0 ? 'block is-active' : 'hidden'} transition-all duration-300" 
                 id="panel-${top.id}" 
                 role="tabpanel" 
                 aria-labelledby="tab-${top.id}">
              
              <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
                
                <!-- Left Column: Topic Description, Summary & Detail -->
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-200">${top.badge}</span>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Module 0${idx + 1} of 05</span>
                  </div>

                  <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight mb-4">${top.title}</h3>

                  <!-- Topic Summary (<= 200 chars) -->
                  <div class="p-4 rounded-xl bg-white border border-slate-200 mb-5 shadow-xs">
                    <div class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                      <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <span>Plain-Language Summary</span>
                    </div>
                    <p class="text-sm font-medium text-slate-700 leading-relaxed m-0">${top.topicSummary}</p>
                  </div>

                  <!-- Topic In-Depth Detail -->
                  <div class="text-sm text-slate-600 leading-relaxed mb-6">
                    <p class="m-0">${top.topicDetail}</p>
                  </div>
                </div>

                <!-- Right Column: Deliverables Checklist & Architecture Assurance -->
                <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                  <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-4">Included In This Module:</h4>
                  <ul class="list-none p-0 m-0 flex flex-col gap-3 mb-6" aria-label="Key deliverables for ${top.topic}">
                    ${top.keyHighlights.map(h => `
                      <li class="flex items-start gap-2.5 text-sm font-semibold text-slate-800 leading-snug">
                        <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="13" height="13" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <span>${h}</span>
                      </li>
                    `).join('')}
                  </ul>

                  <div class="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
                    <span class="text-blue-600 font-bold text-sm shrink-0">🛡️</span>
                    <span>Administered under standard Salesforce governance, role hierarchies, and SOC2 compliance.</span>
                  </div>
                </div>

              </div>

            </div>
          `).join('')}
        </div>

      </div>

      <!-- US-13 Criterion 4: Request a Demo Button at the End -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          
          <!-- Subtle Glow Background -->
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
          <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

          <div class="relative z-10 max-w-2xl mx-auto">
            <span class="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-900/60 border border-blue-700/60 rounded-full mb-3.5">Get Started</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-white">${data.closingCta.headline}</h2>
            <p class="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">${data.closingCta.subtext}</p>
            
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#request-demo?source=how_it_works" 
                 class="btn-how-demo btn-cta-demo inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-full font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5 shadow-lg shadow-blue-500/30 transition-all duration-200 no-underline"
                 id="how-it-works-bottom-demo-btn">
                <span>${data.closingCta.buttonLabel}</span>
                <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <span class="text-xs text-slate-400 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Full sandbox trial available</span>
              </span>
            </div>
          </div>

        </div>
      </div>

    </section>
  `;

  setupHowItWorksInteractivity(container);
}

/**
 * Sets up onboarding topic tabs and demo button telemetry for US-13
 */
function setupHowItWorksInteractivity(container) {
  const topicTabs = container.querySelectorAll('.how-topic-tab');
  const panels = container.querySelectorAll('.how-topic-panel');
  const demoBtn = container.querySelector('#how-it-works-bottom-demo-btn');

  const TAB_ACTIVE_CLASSES = ['bg-white', 'text-blue-600', 'shadow-sm', 'border', 'border-slate-200', 'font-extrabold', 'is-active'];
  const TAB_INACTIVE_CLASSES = ['text-slate-600', 'hover:text-blue-600'];

  function activateTopic(topicId) {
    if (!topicId) return;

    topicTabs.forEach(btn => {
      const isMatch = btn.dataset.topic === topicId;
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
      const isMatch = panel.id === `panel-${topicId}`;
      if (isMatch) {
        panel.classList.remove('hidden');
        panel.classList.add('block', 'is-active');
      } else {
        panel.classList.remove('block', 'is-active');
        panel.classList.add('hidden');
      }
    });
  }

  topicTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const topicId = btn.dataset.topic;
      activateTopic(topicId);
    });
  });

  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('estateforce:demo_click', {
        detail: {
          source: 'how_it_works_page',
          timestamp: new Date().toISOString()
        }
      }));
    });
  }
}
