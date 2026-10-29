import siteConfig from '../data/site-config.json';

/**
 * US-26 Legal Pages Component
 * 
 * Criteria:
 * 1. Privacy Policy (/privacy-policy), Terms of Use (/terms-of-use) and Cookie Notice (/cookie-notice) pages,
 *    with text from the legal team and a "Last updated" date.
 * 2. All three linked from the footer.
 * 3. Every form shows a short privacy notice with a Privacy Policy link next to the submit button.
 * 4. Consent tick boxes are unticked by default; consent wording and timestamp are stored with each submission.
 * 5. Legal page cannot publish unless approved (approvedByLegal === true).
 * 6. Last updated not in the future.
 */

export function initLegalPage(mountTarget = '#legal-page-root', documentType = 'privacyPolicy') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const legalConfig = siteConfig.legalPages || {};
  const doc = legalConfig[documentType] || legalConfig.privacyPolicy;

  // Validation: Legal page cannot publish unless approved
  if (!doc || !doc.approvedByLegal) {
    container.innerHTML = `
      <section class="py-20 px-4 text-center bg-white">
        <div class="max-w-md mx-auto">
          <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Legal Review Pending</h1>
          <p class="text-sm text-slate-600 mb-6">This legal document is currently under review by our compliance team and has not yet been approved for publishing.</p>
          <a href="/" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors">Return to Home</a>
        </div>
      </section>
    `;
    return;
  }

  // Validation: Last updated not in the future
  const lastUpdatedDate = new Date(doc.lastUpdated);
  const now = new Date();
  if (lastUpdatedDate > now) {
    console.warn(`[US-26] Warning: Last updated date (${doc.lastUpdated}) cannot be in the future.`);
  }

  const allLegalTabs = [
    { key: 'privacyPolicy', label: 'Privacy Policy', path: '/privacy-policy' },
    { key: 'termsOfUse', label: 'Terms of Use', path: '/terms-of-use' },
    { key: 'cookieNotice', label: 'Cookie Notice', path: '/cookie-notice' }
  ];

  container.innerHTML = `
    <div class="legal-page-wrapper bg-slate-50 min-h-screen py-12 sm:py-16">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Breadcrumbs & Quick Switcher -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200 mb-8">
          <div>
            <nav class="flex items-center gap-2 text-xs text-slate-500 mb-2" aria-label="Breadcrumb">
              <a href="/" class="hover:text-blue-600 transition-colors">Home</a>
              <span>/</span>
              <span class="text-slate-800 font-medium">Legal</span>
              <span>/</span>
              <span class="text-blue-600 font-semibold">${doc.title}</span>
            </nav>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" id="legal-doc-title">
              ${doc.title}
            </h1>
          </div>

          <!-- Document Selector Pills -->
          <div class="inline-flex rounded-xl bg-slate-200/80 p-1 border border-slate-300/80 shadow-inner">
            ${allLegalTabs.map(tab => `
              <a href="${tab.path}" 
                 class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab.key === documentType ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}">
                ${tab.label}
              </a>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <!-- Sticky Sidebar / Metadata Card -->
          <aside class="lg:col-span-1">
            <div class="sticky top-24 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Status</span>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Approved by Legal</span>
                </div>
              </div>

              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Last Updated</span>
                <p class="text-sm font-semibold text-slate-800" id="legal-last-updated">
                  ${new Date(doc.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div class="pt-4 border-t border-slate-100">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Governing Entity</span>
                <p class="text-xs text-slate-600 font-medium leading-relaxed">
                  Cloud Certitude Solutions Pvt. Ltd.<br>
                  Sector 62, Noida, India<br>
                  CIN: Enterprise ISV Partner
                </p>
              </div>

              <div class="pt-4 border-t border-slate-100">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Data Protection Officer</span>
                <a href="mailto:privacy@cloudcertitude.com" class="text-xs text-blue-600 hover:underline font-semibold block break-all">
                  privacy@cloudcertitude.com
                </a>
              </div>

              <div class="pt-4 border-t border-slate-100">
                <button type="button" 
                        onclick="window.print()" 
                        class="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  <span>Print Document</span>
                </button>
              </div>
            </div>
          </aside>

          <!-- Main Document Content Area -->
          <article class="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            
            <!-- Summary Callout -->
            <div class="p-5 rounded-xl bg-blue-50/70 border border-blue-100 text-slate-700 text-sm leading-relaxed mb-8">
              <strong class="text-blue-900 block font-semibold mb-1">Overview Summary</strong>
              ${doc.summary}
            </div>

            <!-- Content Sections -->
            <div class="space-y-8 divide-y divide-slate-100">
              ${(doc.sections || []).map((section, idx) => `
                <div class="${idx > 0 ? 'pt-8' : ''} space-y-3">
                  <h2 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    ${section.heading}
                  </h2>
                  <p class="text-sm text-slate-600 leading-relaxed sm:text-base">
                    ${section.content}
                  </p>
                </div>
              `).join('')}
            </div>

            <!-- Footer Closing Note -->
            <div class="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>© ${new Date().getFullYear()} Cloud Certitude Solutions Pvt. Ltd. All rights reserved.</p>
              <div class="flex items-center gap-3">
                <a href="/privacy-policy" class="hover:text-blue-600 transition-colors">Privacy</a>
                <span>•</span>
                <a href="/terms-of-use" class="hover:text-blue-600 transition-colors">Terms</a>
                <span>•</span>
                <a href="/cookie-notice" class="hover:text-blue-600 transition-colors">Cookies</a>
              </div>
            </div>

          </article>
        </div>

      </div>
    </div>
  `;
}
