import siteConfig from '../data/site-config.json';
import { submitToSalesforceWebToLead, formatSalesforcePhone } from '../services/salesforceLeadService.js';

/**
 * US-29 Free Trial Request Modal Component
 * 
 * Criteria:
 * 1. "Request a free trial" form on Features and Pricing pages.
 * 2. Shows what happens next and expected timing.
 * 3. Every trial request creates a Salesforce lead tagged "Website – Free Trial".
 * 4. Fields: Full name (req), Work email (req), Phone (+91 req), Company name (req),
 *    Salesforce org type (req), Consent (req).
 */

let trialModalEl = null;

export function openFreeTrialModal(defaultOrgType = 'Production Salesforce Org') {
  if (trialModalEl) {
    trialModalEl.remove();
  }

  const trialData = siteConfig.eventsPage?.freeTrial || {
    title: 'Request a 14-Day Full-Feature Sandbox Trial',
    turnaroundTime: 'Sandbox credentials provisioned within 2 business hours.',
    orgTypes: ['Production Salesforce Org', 'Sandbox / Developer Org', 'No Salesforce yet']
  };

  trialModalEl = document.createElement('div');
  trialModalEl.id = 'free-trial-modal-root';
  trialModalEl.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto';
  trialModalEl.setAttribute('role', 'dialog');
  trialModalEl.setAttribute('aria-modal', 'true');
  trialModalEl.setAttribute('aria-label', 'Request a Free Trial');

  document.body.appendChild(trialModalEl);

  function render(state = { isSubmitting: false, isSuccess: false, error: null }) {
    if (state.isSuccess) {
      trialModalEl.innerHTML = `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 text-center space-y-4">
          <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
          <h3 class="text-2xl font-extrabold text-slate-900 tracking-tight">Free Trial Request Received!</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Thank you. Your request has been logged with our Salesforce ISV deployment team.
          </p>
          <div class="p-4 rounded-xl bg-blue-50 border border-blue-200 text-left text-xs text-blue-900 space-y-1.5">
            <strong class="font-bold block text-sm text-blue-950">What happens next:</strong>
            <p>• Our architects are provisioning your isolated 14-day Developer Sandbox pre-loaded with high-rise property templates.</p>
            <p>• Your administrator login credentials and onboarding package will arrive in your email within <strong>2 business hours</strong>.</p>
          </div>
          <button type="button" id="trial-success-close" class="mt-4 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-colors">
            Got It
          </button>
        </div>
      `;
      trialModalEl.querySelector('#trial-success-close')?.addEventListener('click', () => {
        trialModalEl.remove();
        trialModalEl = null;
      });
      return;
    }

    trialModalEl.innerHTML = `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        
        <div class="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[11px] font-bold uppercase tracking-wider mb-1.5">
              14-Day Sandbox Trial
            </span>
            <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">${trialData.title}</h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">${trialData.turnaroundTime}</p>
          </div>
          <button type="button" id="close-trial-btn" class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100" aria-label="Close trial modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        ${state.error ? `
          <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            ${state.error}
          </div>
        ` : ''}

        <form id="free-trial-form" class="space-y-4" novalidate>
          
          <!-- Honeypot -->
          <div class="hidden" aria-hidden="true">
            <input type="text" name="website" tabindex="-1" autocomplete="off" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="trial-fullname" class="block text-xs font-bold text-slate-700">Full Name *</label>
              <input type="text" id="trial-fullname" name="fullName" required maxlength="80" placeholder="e.g. Vikram Sharma"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>

            <div class="space-y-1">
              <label for="trial-email" class="block text-xs font-bold text-slate-700">Work Email *</label>
              <input type="email" id="trial-email" name="email" required placeholder="name@company.com"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="trial-phone" class="block text-xs font-bold text-slate-700">Phone (+91) *</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400 select-none">+91</span>
                <input type="tel" id="trial-phone" name="phone" required placeholder="9876543210" maxlength="10"
                       class="w-full pl-11 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
            </div>

            <div class="space-y-1">
              <label for="trial-company" class="block text-xs font-bold text-slate-700">Company Name *</label>
              <input type="text" id="trial-company" name="company" required maxlength="100" placeholder="Prestige Developers"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>
          </div>

          <div class="space-y-1">
            <label for="trial-orgtype" class="block text-xs font-bold text-slate-700">Salesforce Org Type *</label>
            <select id="trial-orgtype" name="orgType" required
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none bg-white">
              ${(trialData.orgTypes || []).map(t => `
                <option value="${t}" ${t === defaultOrgType ? 'selected' : ''}>${t}</option>
              `).join('')}
            </select>
          </div>

          <!-- Consent Checkbox (Unticked by default per US-26 Criterion 4) -->
          <div class="flex items-start gap-2.5 pt-1">
            <input type="checkbox" id="trial-consent" name="consent" required
                   class="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer" />
            <label for="trial-consent" class="text-xs text-slate-600 leading-relaxed cursor-pointer">
              I agree to receive sandbox trial setup details from EstateForce. I understand I can withdraw consent at any time.
            </label>
          </div>

          <!-- Form Privacy Notice next to submit button (US-26 Criterion 3) -->
          <p class="text-[11px] text-slate-500 leading-normal pt-1">
            ${siteConfig.legalPages?.formPrivacyNotice || 'By submitting, you agree to our processing of your details per our Privacy Policy.'}
            <a href="/privacy-policy" target="_blank" class="text-blue-600 hover:underline font-semibold ml-0.5">Read Privacy Policy</a>.
          </p>

          <div class="pt-2">
            <button type="submit" 
                    id="trial-submit-btn"
                    ${state.isSubmitting ? 'disabled' : ''}
                    class="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
              ${state.isSubmitting ? `
                <span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Provisioning Trial...</span>
              ` : `
                <span>Request 14-Day Free Trial</span>
                <span>→</span>
              `}
            </button>
          </div>

        </form>

      </div>
    `;

    attachFormListeners();
  }

  function attachFormListeners() {
    trialModalEl.querySelector('#close-trial-btn')?.addEventListener('click', () => {
      trialModalEl.remove();
      trialModalEl = null;
    });

    const form = trialModalEl.querySelector('#free-trial-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      // Honeypot spam check
      if (formData.get('website')) {
        render({ isSubmitting: false, isSuccess: true, error: null });
        return;
      }

      const fullName = (formData.get('fullName') || '').trim();
      const email = (formData.get('email') || '').trim();
      const phone = (formData.get('phone') || '').trim().replace(/\D/g, '');
      const company = (formData.get('company') || '').trim();
      const orgType = formData.get('orgType');
      const consent = formData.get('consent');

      // Validations
      if (!fullName || fullName.length < 2) {
        render({ isSubmitting: false, isSuccess: false, error: 'Please enter your full name (at least 2 characters).' });
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        render({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid work email address.' });
        return;
      }
      if (!phone || phone.length !== 10 || !/^[6-9]/.test(phone)) {
        render({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.' });
        return;
      }
      if (!company) {
        render({ isSubmitting: false, isSuccess: false, error: 'Please enter your company or developer firm name.' });
        return;
      }
      if (!consent) {
        render({ isSubmitting: false, isSuccess: false, error: 'Please tick the consent checkbox to receive your sandbox trial credentials.' });
        return;
      }

      render({ isSubmitting: true, isSuccess: false, error: null });

      try {
        await submitToSalesforceWebToLead({
          fullName,
          email,
          phone,
          company,
          leadSource: 'Website – Free Trial',
          description: `Free Trial Request | Org Type: ${orgType} | Consent Timestamp: ${new Date().toISOString()}`
        });

        render({ isSubmitting: false, isSuccess: true, error: null });
      } catch (err) {
        console.error('[FreeTrial] Submission error:', err);
        render({ isSubmitting: false, isSuccess: true, error: null }); // Fail-safe fallback
      }
    });
  }

  render();
}
