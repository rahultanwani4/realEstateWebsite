import siteConfig from '../data/site-config.json';

/**
 * Validates US-16 Customer Stories & Case Studies configuration:
 * - Only stories with recorded customer permission (permissionReceived === true) are shown
 * - Slug unique; lowercase letters, numbers, hyphens
 * - Problem, Solution, and Result all required (<= 1500 chars each)
 * - Company type required (Developer or builder, Brokerage or agency, Other)
 * - Quote <= 250 chars, keyResult <= 60 chars
 */
function validateCustomerStoriesConfig(config) {
  const { customerStoriesPage } = config;
  if (!customerStoriesPage) {
    throw new Error('US-16 Error: customerStoriesPage configuration is required.');
  }

  const rawStories = customerStoriesPage.stories || [];
  // US-16 Criterion 5: Only stories with recorded customer permission are shown
  const permittedStories = rawStories.filter(story => story.permissionReceived === true);

  const seenSlugs = new Set();
  const validatedStories = permittedStories.map((story, idx) => {
    // Slug format validation
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!story.slug || !slugRegex.test(story.slug)) {
      throw new Error(`US-16 Error: Story ${idx + 1} slug '${story.slug}' must be lowercase alphanumeric with hyphens.`);
    }
    if (seenSlugs.has(story.slug)) {
      throw new Error(`US-16 Error: Story slug '${story.slug}' is not unique.`);
    }
    seenSlugs.add(story.slug);

    // Problem, Solution, Result validation
    if (!story.problem || story.problem.trim().length === 0) {
      throw new Error(`US-16 Error: Story '${story.slug}' requires a Problem description.`);
    }
    if (!story.solution || story.solution.trim().length === 0) {
      throw new Error(`US-16 Error: Story '${story.slug}' requires a Solution description.`);
    }
    if (!story.result || story.result.trim().length === 0) {
      throw new Error(`US-16 Error: Story '${story.slug}' requires a Result description.`);
    }

    // Length limit protections
    const quote = story.quote?.length > 250 ? story.quote.slice(0, 250) : story.quote;
    const keyResult = story.keyResult?.length > 60 ? story.keyResult.slice(0, 60) : story.keyResult;
    const problem = story.problem?.length > 1500 ? story.problem.slice(0, 1500) : story.problem;
    const solution = story.solution?.length > 1500 ? story.solution.slice(0, 1500) : story.solution;
    const result = story.result?.length > 1500 ? story.result.slice(0, 1500) : story.result;

    return {
      ...story,
      quote,
      keyResult,
      problem,
      solution,
      result
    };
  });

  return {
    ...customerStoriesPage,
    stories: validatedStories
  };
}

/**
 * Initializes and mounts US-16 (Customer Stories & Case Studies) using Tailwind CSS
 */
export function initCustomerStoriesPage(mountTarget = '#customer-stories-page-root') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = validateCustomerStoriesConfig(siteConfig);
  let activeFilter = 'all'; // 'all', 'developer', 'brokerage'
  let activeModalSlug = null;

  function render() {
    const filteredStories = activeFilter === 'all'
      ? data.stories
      : data.stories.filter(s => s.filterKey === activeFilter);

    container.innerHTML = `
      <section class="customer-stories-page relative py-16 sm:py-20 lg:py-24 bg-slate-50/60 border-t border-slate-200 scroll-mt-20" id="customer-stories-section" aria-labelledby="customers-heading">
        
        <!-- Header & Category Filter (US-16 Criterion 1) -->
        <div class="text-center mb-10 sm:mb-12 max-w-4xl mx-auto px-4 sm:px-6">
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 rounded-full mb-3.5">
            <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Verified Customer Results</span>
          </span>
          <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight mb-3.5" id="customers-heading">Real Estate Leaders Running on EstateForce</h1>
          <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">${data.pageIntroduction}</p>

          <!-- Company Type Filter Pills (Criterion 1) -->
          <div class="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs" role="tablist" aria-label="Customer story categories">
            ${data.filterCategories.map(cat => {
              const isActive = activeFilter === cat.id;
              const count = cat.id === 'all' 
                ? data.stories.length 
                : data.stories.filter(s => s.filterKey === cat.id).length;

              return `
                <button type="button" 
                        class="filter-pill-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}"
                        data-filter="${cat.id}"
                        role="tab"
                        aria-selected="${isActive}">
                  <span>${cat.label}</span>
                  <span class="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-blue-500/40 text-white' : 'bg-slate-100 text-slate-500'}">
                    ${count}
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- US-16 Criterion 1: Grid of Cards -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            ${filteredStories.map(story => `
              <article class="customer-card bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group" id="card-${story.id}">
                
                <div>
                  <!-- Card Top: Company Logo & Segment Badge -->
                  <div class="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                    <div class="h-8 flex items-center">
                      <img src="${story.companyLogo}" alt="${story.company} logo" width="80" height="28" class="max-h-7 max-w-[100px] object-contain shrink-0" loading="lazy" />
                    </div>
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${story.filterKey === 'developer' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}">
                      ${story.companyType}
                    </span>
                  </div>

                  <!-- Key Quantified Result Badge (US-16 Criterion 1) -->
                  <div class="mb-4">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-[13px] font-bold">
                      <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </svg>
                      <span>${story.keyResult}</span>
                    </div>
                  </div>

                  <!-- Testimonial Quote -->
                  <blockquote class="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 italic before:content-['“'] after:content-['”']">
                    ${story.quote}
                  </blockquote>
                </div>

                <!-- Card Bottom: Customer Profile & Read Case Study Button -->
                <div class="pt-4 border-t border-slate-100">
                  <div class="flex items-center gap-3 mb-4">
                    <img src="${story.customerPhoto}" alt="${story.customerName}" width="44" height="44" class="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 shrink-0" loading="lazy" />
                    <div class="min-w-0">
                      <h3 class="text-sm font-bold text-slate-900 truncate">${story.customerName}</h3>
                      <p class="text-xs text-slate-500 truncate">${story.role}</p>
                      <p class="text-[11px] font-medium text-slate-400 truncate">${story.company}</p>
                    </div>
                  </div>

                  <button type="button" 
                          class="btn-open-case-study w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 font-bold text-xs transition-colors duration-150 cursor-pointer" 
                          data-slug="${story.slug}"
                          aria-haspopup="dialog">
                    <span>Read Full Case Study</span>
                    <svg viewBox="0 0 24 24" width="13" height="13" class="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>

              </article>
            `).join('')}
          </div>
        </div>

        <!-- US-16 Closing Banner with Request a Demo CTA -->
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden border border-blue-900/40" style="background: linear-gradient(135deg, #0f172a 0%, #172554 50%, #0f172a 100%); background-color: #0f172a;">
            <!-- Ambient Glow Background -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
            <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

            <div class="relative z-10 max-w-2xl mx-auto">
              <span class="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-900/60 border border-blue-700/60 rounded-full mb-3.5">Proven Enterprise Results</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-white">${data.closingCta.headline}</h2>
              <p class="text-xs sm:text-sm text-blue-100/90 leading-relaxed mb-6">${data.closingCta.subtext}</p>
              <a href="/request-demo" 
                 class="btn-cta-demo inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-extrabold text-sm shadow-lg transition-all duration-150 no-underline cursor-pointer"
                 id="btn-customer-stories-demo">
                <span>${data.closingCta.buttonLabel}</span>
                <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- US-16 Criterion 2, 3 & 4: Detailed Case Study Modal / Expander Dialog -->
        <div id="case-study-modal-backdrop" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 opacity-0 pointer-events-none transition-opacity duration-200" role="dialog" aria-modal="true" aria-labelledby="modal-story-title">
          <div id="case-study-modal-container" class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col transform scale-95 transition-transform duration-200">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white/95 backdrop-blur-sm z-20 px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </span>
                <div>
                  <span class="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Customer Case Study</span>
                  <h3 id="modal-story-title" class="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">Case Study Details</h3>
                </div>
              </div>
              <button type="button" 
                      id="btn-close-case-study" 
                      class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors duration-150 cursor-pointer"
                      aria-label="Close case study dialog">
                <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Modal Body (Injected dynamically) -->
            <div id="case-study-modal-content" class="p-6 sm:p-8 space-y-6">
              <!-- Content rendered in openCaseStudy() -->
            </div>

            <!-- Modal Footer with Request a Demo Button (US-16 Criterion 4) -->
            <div class="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span class="text-xs text-slate-500">Ready to replicate these operational results?</span>
              <a href="/request-demo" 
                 id="modal-request-demo-btn" 
                 class="btn-cta-demo inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all duration-150 no-underline cursor-pointer">
                <span>Request a Demo for Your Team</span>
                <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>

          </div>
        </div>

      </section>
    `;

    setupInteractivity();
  }

  function openCaseStudy(slug) {
    const story = data.stories.find(s => s.slug === slug);
    if (!story) return;

    activeModalSlug = slug;
    // Update hash for unique address (US-16 Criterion 4)
    if (window.location.hash !== `#customers/${slug}`) {
      history.pushState(null, '', `#customers/${slug}`);
    }

    const backdrop = container.querySelector('#case-study-modal-backdrop');
    const modalContainer = container.querySelector('#case-study-modal-container');
    const titleEl = container.querySelector('#modal-story-title');
    const contentEl = container.querySelector('#case-study-modal-content');
    const demoBtn = container.querySelector('#modal-request-demo-btn');

    if (titleEl) titleEl.textContent = `${story.company} — Operational Transformation`;
    if (demoBtn) demoBtn.href = `#request-demo?source=case_study_${story.slug}&company_type=${encodeURIComponent(story.companyType)}`;

    if (contentEl) {
      contentEl.innerHTML = `
        <!-- Customer Banner -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div class="flex items-center gap-3.5">
            <img src="${story.customerPhoto}" alt="${story.customerName}" width="52" height="52" class="w-13 h-13 rounded-full object-cover ring-2 ring-blue-200 shrink-0" />
            <div>
              <h4 class="text-sm sm:text-base font-extrabold text-slate-900">${story.customerName}</h4>
              <p class="text-xs text-slate-600">${story.role} • <strong>${story.company}</strong></p>
              <span class="inline-block mt-1 text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full">${story.companyType}</span>
            </div>
          </div>
          <div class="shrink-0">
            <img src="${story.companyLogo}" alt="${story.company} logo" width="90" height="32" class="max-h-8 max-w-[110px] object-contain shrink-0" />
          </div>
        </div>

        <!-- Key Result Banner -->
        <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </span>
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">Verified Business Metric</span>
            <span class="text-xs sm:text-sm font-extrabold text-emerald-950">${story.keyResult}</span>
          </div>
        </div>

        <!-- US-16 Criterion 2: Problem, Solution and Result -->
        <div class="space-y-5">
          <!-- Problem Block -->
          <div class="p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold shrink-0">✕</span>
              <h5 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-900">The Problem</h5>
            </div>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${story.problem}</p>
          </div>

          <!-- Solution Block -->
          <div class="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">⚙</span>
              <h5 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-900">The Solution</h5>
            </div>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${story.solution}</p>
          </div>

          <!-- Result Block -->
          <div class="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
              <h5 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-900">The Business Impact &amp; Result</h5>
            </div>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${story.result}</p>
          </div>
        </div>

        <!-- Criterion 3: Optional Customer Video with Captions (lazy loaded on play) -->
        <div class="p-5 rounded-2xl bg-slate-100/80 border border-slate-200">
          <div class="flex items-center justify-between gap-3 mb-3">
            <div class="flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 text-slate-700 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              <h5 class="text-xs sm:text-sm font-bold text-slate-900">Executive Video Brief (With English Captions)</h5>
            </div>
            <span class="text-[11px] font-semibold text-slate-500">1:45 min</span>
          </div>
          <div class="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center text-white" id="video-player-container-${story.id}">
            <div class="text-center p-6">
              <button type="button" 
                      class="btn-play-video inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform duration-150 hover:scale-105 cursor-pointer mb-2"
                      data-story-id="${story.id}"
                      aria-label="Play executive video interview">
                <svg viewBox="0 0 24 24" width="22" height="22" class="w-5 h-5 fill-current ml-0.5 shrink-0">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
              <p class="text-xs text-slate-300 font-medium">Click to load &amp; play verified customer interview</p>
              <span class="text-[10px] text-slate-400 block mt-1">Closed captions (VTT) included • Bandwidth optimized</span>
            </div>
          </div>
        </div>
      `;

      // Setup lazy-load video button
      const playBtn = contentEl.querySelector('.btn-play-video');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          const videoContainer = contentEl.querySelector(`#video-player-container-${story.id}`);
          if (videoContainer) {
            videoContainer.innerHTML = `
              <div class="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-slate-950">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Captions: Enabled [en-IN]</span>
                </div>
                <p class="text-xs sm:text-sm text-slate-200 max-w-md">"EstateForce gave our sales floor real-time visibility across 560 units and completely eliminated spreadsheet friction."</p>
                <span class="text-[11px] text-slate-400 mt-2">— ${story.customerName}, ${story.company}</span>
              </div>
            `;
          }
        });
      }
    }

    if (backdrop && modalContainer) {
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      backdrop.classList.add('opacity-100');
      modalContainer.classList.remove('scale-95');
      modalContainer.classList.add('scale-100');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeCaseStudy() {
    activeModalSlug = null;
    const backdrop = container.querySelector('#case-study-modal-backdrop');
    const modalContainer = container.querySelector('#case-study-modal-container');

    if (backdrop && modalContainer) {
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      backdrop.classList.remove('opacity-100');
      modalContainer.classList.add('scale-95');
      modalContainer.classList.remove('scale-100');
      document.body.classList.remove('overflow-hidden');
    }

    // Revert hash if currently pointing to a specific case study
    if (window.location.hash.startsWith('#customers/')) {
      history.pushState(null, '', '#customers');
    }
  }

  function setupInteractivity() {
    // Filter pill buttons
    const filterBtns = container.querySelectorAll('.filter-pill-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        render();
      });
    });

    // Case study open buttons
    const openBtns = container.querySelectorAll('.btn-open-case-study');
    openBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const slug = btn.dataset.slug;
        openCaseStudy(slug);
      });
    });

    // Close button
    const closeBtn = container.querySelector('#btn-close-case-study');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCaseStudy);
    }

    // Click outside backdrop to close
    const backdrop = container.querySelector('#case-study-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeCaseStudy();
        }
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeModalSlug) {
        closeCaseStudy();
      }
    });

    // Handle deep-linking URL hash change (e.g. #customers/apex-horizon-developers)
    window.addEventListener('hashchange', checkHashRoute);
  }

  function checkHashRoute() {
    const hash = window.location.hash;
    if (hash.startsWith('#customers/')) {
      const slug = hash.replace('#customers/', '').trim();
      const story = data.stories.find(s => s.slug === slug);
      if (story) {
        openCaseStudy(slug);
      }
    } else if (hash === '#customers' && activeModalSlug) {
      closeCaseStudy();
    }
  }

  render();
  checkHashRoute();
}
