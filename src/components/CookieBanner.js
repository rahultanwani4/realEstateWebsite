import siteConfig from '../data/site-config.json';

/**
 * US-27 Cookie Consent Banner Component
 * 
 * Criteria:
 * 1. Banner on first visit: Accept all, Reject non-essential, Manage preferences.
 * 2. Preferences let visitor switch Analytics and Marketing on or off; Essential always on.
 * 3. Analytics and marketing scripts load only after consent.
 * 4. Choice remembered for 12 months; reopened from "Cookie settings" in the footer.
 * 5. Links to the Cookie Notice (/cookie-notice); usable by keyboard.
 */

const STORAGE_KEY = 'estateforce_cookie_consent';
const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

export function getStoredCookieConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Check expiration (12 months)
    if (Date.now() - new Date(data.timestamp).getTime() > TWELVE_MONTHS_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

export function saveCookieConsent(consent) {
  const payload = {
    essential: true,
    analytics: Boolean(consent.analytics),
    marketing: Boolean(consent.marketing),
    timestamp: new Date().toISOString(),
    durationMonths: siteConfig.cookieConsent?.consentDurationMonths || 12
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // Ignore
  }

  // Dispatch global event for tracking and script initialization
  window.dispatchEvent(new CustomEvent('estateforce:cookie_consent_updated', { detail: payload }));
  return payload;
}

export function initCookieBanner(mountTarget = '#cookie-banner-root', force = false) {
  if (!force && siteConfig.cookieConsent?.enabled === false) {
    const existing = typeof mountTarget === 'string' ? document.querySelector(mountTarget) : mountTarget;
    if (existing) existing.innerHTML = '';
    return;
  }

  let root = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;

  if (!root) {
    root = document.createElement('div');
    root.id = 'cookie-banner-root';
    document.body.appendChild(root);
  }

  const config = siteConfig.cookieConsent || {
    bannerText: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.',
    consentDurationMonths: 12
  };

  function renderBanner() {
    const stored = getStoredCookieConsent();
    if (stored) {
      root.innerHTML = '';
      return;
    }

    root.innerHTML = `
      <aside class="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
             role="dialog"
             aria-modal="false"
             aria-label="Cookie consent banner"
             id="cookie-consent-banner">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          
          <div class="space-y-1.5 flex-1 pr-4">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-400"></span>
              <h2 class="text-sm font-bold text-white tracking-wide uppercase">Your Privacy Choices</h2>
            </div>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              ${config.bannerText}
              <a href="/cookie-notice" class="text-blue-400 hover:text-blue-300 underline font-semibold ml-1">Learn more in our Cookie Notice</a>.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 w-full md:w-auto">
            <button type="button" 
                    id="cookie-btn-reject"
                    class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none">
              Reject Non-Essential
            </button>
            <button type="button" 
                    id="cookie-btn-manage"
                    class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none">
              Manage Preferences
            </button>
            <button type="button" 
                    id="cookie-btn-accept-all"
                    class="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-sm transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none">
              Accept All
            </button>
          </div>

        </div>
      </aside>
    `;

    attachBannerListeners();
  }

  function attachBannerListeners() {
    const banner = root.querySelector('#cookie-consent-banner');
    if (!banner) return;

    banner.querySelector('#cookie-btn-accept-all')?.addEventListener('click', () => {
      saveCookieConsent({ analytics: true, marketing: true });
      renderBanner();
    });

    banner.querySelector('#cookie-btn-reject')?.addEventListener('click', () => {
      saveCookieConsent({ analytics: false, marketing: false });
      renderBanner();
    });

    banner.querySelector('#cookie-btn-manage')?.addEventListener('click', () => {
      openPreferencesModal();
    });
  }

  function openPreferencesModal() {
    const current = getStoredCookieConsent() || { analytics: false, marketing: false };
    
    let modalEl = document.getElementById('cookie-preferences-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'cookie-preferences-modal';
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
      <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
           role="dialog" 
           aria-modal="true" 
           aria-labelledby="cookie-modal-title">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
          
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 id="cookie-modal-title" class="text-xl font-extrabold text-slate-900 tracking-tight">Cookie Preferences</h2>
              <p class="text-xs text-slate-500 mt-0.5">Customize which cookie categories you permit.</p>
            </div>
            <button type="button" id="cookie-modal-close" class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100" aria-label="Close preferences">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            
            <!-- Essential Cookies (Always On) -->
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-slate-900">Essential Cookies</span>
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Always Active</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Necessary for basic website security, navigation, and remembering your cookie consent choices. Cannot be turned off.
              </p>
            </div>

            <!-- Analytics Cookies -->
            <div class="p-4 rounded-xl border border-slate-200 space-y-2 hover:border-blue-200 transition-colors">
              <div class="flex items-center justify-between">
                <label for="cookie-analytics-check" class="text-sm font-bold text-slate-900 cursor-pointer">
                  Analytics &amp; Performance
                </label>
                <input type="checkbox" 
                       id="cookie-analytics-check" 
                       class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                       ${current.analytics ? 'checked' : ''} />
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Allows us to count visits, traffic sources, and identify which real estate CRM modules are most popular to improve our solution.
              </p>
            </div>

            <!-- Marketing Cookies -->
            <div class="p-4 rounded-xl border border-slate-200 space-y-2 hover:border-blue-200 transition-colors">
              <div class="flex items-center justify-between">
                <label for="cookie-marketing-check" class="text-sm font-bold text-slate-900 cursor-pointer">
                  Marketing &amp; Attribution
                </label>
                <input type="checkbox" 
                       id="cookie-marketing-check" 
                       class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                       ${current.marketing ? 'checked' : ''} />
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Used to deliver relevant product announcements, track event attendance, and measure AppExchange referral campaigns.
              </p>
            </div>

          </div>

          <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button type="button" 
                    id="cookie-modal-save"
                    class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm">
              Save My Preferences
            </button>
          </div>

        </div>
      </div>
    `;

    // Modal listeners
    const closeBtn = modalEl.querySelector('#cookie-modal-close');
    const saveBtn = modalEl.querySelector('#cookie-modal-save');
    const analyticsBox = modalEl.querySelector('#cookie-analytics-check');
    const marketingBox = modalEl.querySelector('#cookie-marketing-check');

    const closeModal = () => {
      modalEl.innerHTML = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    
    // Escape key closes modal
    const keyHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', keyHandler);
      }
    };
    document.addEventListener('keydown', keyHandler);

    saveBtn?.addEventListener('click', () => {
      saveCookieConsent({
        analytics: Boolean(analyticsBox?.checked),
        marketing: Boolean(marketingBox?.checked)
      });
      closeModal();
      renderBanner();
    });
  }

  // Listen to global open event (triggered by footer "Cookie settings" button)
  window.addEventListener('estateforce:open_cookie_settings', () => {
    openPreferencesModal();
  });

  renderBanner();
}
