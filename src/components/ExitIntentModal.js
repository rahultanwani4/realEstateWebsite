import siteConfig from '../data/site-config.json';

/**
 * Initializes and manages US-32 Exit-Intent Recovery Modal
 * 
 * Rules:
 * - Desktop only (triggers when pointer Y <= 0 or moves towards top of viewport)
 * - Shown at most once per user session (using sessionStorage)
 * - NEVER shown on /request-demo or while active input is focused
 * - Closes on close button, Escape key, or clicking backdrop
 */
export function initExitIntentModal(mountTarget = '#exit-intent-root') {
  let container = document.querySelector(mountTarget);
  if (!container) {
    container = document.createElement('div');
    container.id = 'exit-intent-root';
    document.body.appendChild(container);
  }

  const config = siteConfig.exitIntent;
  if (!config || !config.enabled) return;

  const SESSION_KEY = 'estateforce_exit_intent_shown';

  function isFormActive() {
    const activeEl = document.activeElement;
    if (!activeEl) return false;
    const tag = activeEl.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select';
  }

  function isExcludedPath() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    return (config.excludedPaths || []).some(p => currentPath === p || currentHash.includes(p));
  }

  function showExitModal() {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    if (isExcludedPath()) return;
    if (isFormActive()) return;

    sessionStorage.setItem(SESSION_KEY, 'true');

    container.innerHTML = `
      <div id="exit-intent-backdrop" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 opacity-0 transition-opacity duration-300" role="dialog" aria-modal="true" aria-labelledby="exit-modal-title">
        <div id="exit-intent-dialog" class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 transform scale-95 transition-transform duration-300 relative">
          
          <!-- Close Button -->
          <button type="button" 
                  id="btn-close-exit-intent"
                  class="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close dialog">
            <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Top Icon & Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span>Exclusive Developer Offer</span>
          </div>

          <h2 id="exit-modal-title" class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug mb-3">
            ${config.headline}
          </h2>

          <p class="text-sm text-slate-600 leading-relaxed mb-6">
            ${config.subtext}
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3">
            <a href="${config.primaryButtonLink}" 
               id="exit-primary-cta"
               class="btn-cta-demo inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25 transition-all text-center no-underline cursor-pointer">
              <span>${config.primaryButtonText}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>

            <a href="${config.secondaryButtonLink}" 
               id="exit-secondary-cta"
               class="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center no-underline cursor-pointer">
              <span>${config.secondaryButtonText}</span>
            </a>
          </div>

          <p class="text-[11px] text-center text-slate-400 mt-4 m-0">
            No credit card or software installation required • 100% Native on Salesforce
          </p>

        </div>
      </div>
    `;

    const backdrop = container.querySelector('#exit-intent-backdrop');
    const dialog = container.querySelector('#exit-intent-dialog');
    const closeBtn = container.querySelector('#btn-close-exit-intent');
    const primaryBtn = container.querySelector('#exit-primary-cta');
    const secondaryBtn = container.querySelector('#exit-secondary-cta');

    // Trigger smooth fade-in
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      backdrop.classList.add('opacity-100');
      dialog.classList.remove('scale-95');
      dialog.classList.add('scale-100');
    }, 10);

    function closeModal() {
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0');
      dialog.classList.remove('scale-100');
      dialog.classList.add('scale-95');
      setTimeout(() => {
        container.innerHTML = '';
      }, 300);
      document.removeEventListener('keydown', handleKeyDown);
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') closeModal();
    }

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
    if (primaryBtn) primaryBtn.addEventListener('click', closeModal);
    if (secondaryBtn) secondaryBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', handleKeyDown);
  }

  // Detect mouse leaving viewport (desktop only)
  function handleMouseLeave(e) {
    if (e.clientY <= 10) {
      showExitModal();
    }
  }

  // Attach exit intent trigger after 5 seconds on site
  setTimeout(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
  }, 5000);
}
