/**
 * 404 Page Not Found Component
 * Rendered when a user navigates to an unmatched or non-existent route.
 */
export function initNotFoundPage(mountTarget = '#app') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  container.innerHTML = `
    <section class="min-h-[75vh] flex items-center justify-center py-16 sm:py-24 px-4 bg-slate-50 text-slate-900 relative overflow-hidden" id="not-found-section" role="region" aria-labelledby="not-found-title">
      
      <!-- Subtle Background Grid Pattern -->
      <div class="absolute inset-0 opacity-40 pointer-events-none" style="background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px); background-size: 56px 56px; mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent);" aria-hidden="true"></div>

      <div class="max-w-2xl mx-auto text-center relative z-10">
        
        <!-- Error Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 rounded-full mb-6">
          <span class="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
          <span>404 Error • Page Not Found</span>
        </div>

        <!-- 404 Visual Number Display -->
        <div class="text-7xl sm:text-8xl font-black text-slate-300 tracking-tighter select-none mb-3">
          404
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4" id="not-found-title">
          We couldn’t find that page
        </h1>

        <p class="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed mb-8">
          The address you visited doesn't exist on CC Real Estate, might have been moved, or was mistyped.
        </p>

        <!-- Primary Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <a href="/" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Return to Home</span>
          </a>

          <a href="/request-demo" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm shadow-sm transition-all">
            <span>Request a Demo</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        <!-- Quick Links Hub -->
        <div class="pt-8 border-t border-slate-200">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Or explore popular pages:</p>
          <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
            <a href="/#features" class="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors">
              Features
            </a>
            <a href="/pricing" class="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors">
              Pricing Plans
            </a>
            <a href="/who-it-is-for" class="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors">
              Who It Is For
            </a>
            <a href="/faq" class="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors">
              FAQ
            </a>
            <a href="/resources" class="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors">
              Resources
            </a>
            <a href="/#contact" class="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors">
              Contact Desk
            </a>
          </div>
        </div>

      </div>
    </section>
  `;
}

