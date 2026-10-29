import siteConfig from '../data/site-config.json';

/**
 * Validates US-31 Comparison Page Configuration
 */
function validateComparisonConfig(config) {
  const { comparisonPage } = config;
  if (!comparisonPage) {
    throw new Error('US-31 Error: comparisonPage configuration is required in site-config.json');
  }

  if (!comparisonPage.claimsApprovedByBusiness) {
    throw new Error('US-31 Validation Error: Comparison claims must be marked approved by business team.');
  }

  if (!comparisonPage.criteria || comparisonPage.criteria.length < 5) {
    throw new Error('US-31 Validation Error: Comparison table requires at least 5 comparison criteria.');
  }

  return comparisonPage;
}

/**
 * Renders the Dedicated Comparison Page (US-31)
 */
export function initComparisonPage(mountTarget = '#app') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = validateComparisonConfig(siteConfig);

  // Group criteria by category for enhanced scannability
  const categories = {};
  data.criteria.forEach(item => {
    const cat = item.category || 'General Capabilities';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  container.innerHTML = `
    <div class="comparison-page-wrapper bg-slate-50 min-h-screen py-12 sm:py-16 lg:py-20 animate-fade-in" id="comparison-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Breadcrumb Navigation -->
        <nav class="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8" aria-label="Breadcrumb">
          <a href="/" class="hover:text-blue-600 transition-colors">Home</a>
          <span>/</span>
          <span class="text-slate-900 font-bold">Comparison</span>
        </nav>

        <!-- Page Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold uppercase tracking-wider mb-4">
            <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <span>Detailed Architectural Comparison</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            ${data.headline}
          </h1>
          <p class="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
            ${data.subtitle}
          </p>

          <!-- US-31 Criterion 2: Verified claims approval badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
            <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>All benchmark claims reviewed &amp; approved for publishing</span>
          </div>
        </div>

        <!-- US-31 Criterion 1: Comparison Table with Mobile Scroll Container -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-16">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[760px]" aria-label="Comparison of EstateForce vs Spreadsheets vs Legacy CRMs">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50/80">
                  <th scope="col" class="py-5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-500 w-1/3">
                    Capability &amp; Workflow
                  </th>
                  <th scope="col" class="py-5 px-6 text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50/70 border-x border-blue-100 w-1/4">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      <span>EstateForce (Native SF)</span>
                    </div>
                  </th>
                  <th scope="col" class="py-5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-700 w-1/5">
                    Excel &amp; Google Sheets
                  </th>
                  <th scope="col" class="py-5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-700 w-1/5">
                    Legacy / Generic CRMs
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
                ${Object.entries(categories).map(([categoryName, rows]) => `
                  <!-- Category Header Row -->
                  <tr class="bg-slate-100/60">
                    <td colspan="4" class="py-2.5 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100/80">
                      ${categoryName}
                    </td>
                  </tr>

                  <!-- Item Rows -->
                  ${rows.map(item => `
                    <tr class="hover:bg-slate-50/60 transition-colors">
                      <td class="py-4 px-6 font-bold text-slate-900 text-sm">
                        ${item.name}
                      </td>
                      
                      <!-- EstateForce Column (Highlighted) -->
                      <td class="py-4 px-6 bg-blue-50/30 border-x border-blue-100 text-slate-900 font-semibold text-xs sm:text-sm">
                        <div class="flex items-start gap-2">
                          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                            <svg viewBox="0 0 24 24" width="12" height="12" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          <span>${item.estateforce}</span>
                        </div>
                      </td>

                      <!-- Spreadsheets Column -->
                      <td class="py-4 px-6 text-slate-600 text-xs sm:text-sm">
                        <div class="flex items-start gap-2">
                          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                            <svg viewBox="0 0 24 24" width="12" height="12" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </span>
                          <span>${item.spreadsheets}</span>
                        </div>
                      </td>

                      <!-- Legacy CRMs Column -->
                      <td class="py-4 px-6 text-slate-600 text-xs sm:text-sm">
                        <div class="flex items-start gap-2">
                          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                            <svg viewBox="0 0 24 24" width="12" height="12" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                          </span>
                          <span>${item.legacyCrm}</span>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- US-31 Criterion 3: Request a Demo Button at the End -->
        <div class="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 text-center shadow-xl border border-blue-900/40 relative overflow-hidden">
          <div class="relative z-10 max-w-2xl mx-auto">
            <span class="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
              Transform Your Sales Operations
            </span>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4">
              ${data.closingCta.headline}
            </h2>
            <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              ${data.closingCta.subtext}
            </p>
            <a href="${data.closingCta.buttonLink}" 
               id="compare-bottom-demo-btn"
               class="btn-cta-demo inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all duration-200">
              <span>${data.closingCta.buttonText}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach telemetry
  const demoBtn = container.querySelector('#compare-bottom-demo-btn');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('estateforce:demo_click', {
        detail: {
          source: 'comparison_page',
          timestamp: new Date().toISOString()
        }
      }));
    });
  }
}
