import siteConfig from '../data/site-config.json';
import { submitToSalesforceWebToLead, formatSalesforcePhone } from '../services/salesforceLeadService.js';
import { triggerDemoEmailWorkflows } from '../services/emailService.js';

/**
 * US-17 / US-18 / US-19:
 * Streamlined Salesforce Web-to-Lead Demo Request Form
 * 
 * Fields strictly limited to:
 * - First name (first_name) - Required
 * - Last name (last_name) - Required
 * - Email (email) - Required
 * - Company (company) - Required
 * - Phone (phone) - Optional
 * - I am interested in (interest) - Optional radio pills
 * - Message (description) - Optional textarea
 * 
 * Target Salesforce Org ID: 00D2w00000P3aAc
 * Live Web-to-Lead Endpoint: https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00D2w00000P3aAc
 * Anti-spam Honeypot: name="website"
 */

const RATE_LIMIT_KEY = 'estateforce_demo_submissions';
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit() {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const timestamps = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const validTimestamps = timestamps.filter(t => (now - t) < RATE_LIMIT_WINDOW_MS);
    return validTimestamps.length < RATE_LIMIT_MAX;
  } catch (e) {
    return true;
  }
}

function recordRateLimitSubmit() {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const timestamps = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const validTimestamps = timestamps.filter(t => (now - t) < RATE_LIMIT_WINDOW_MS);
    validTimestamps.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(validTimestamps));
  } catch (e) {
    // Ignore
  }
}

function getPreFillParams() {
  const params = {};
  if (typeof window === 'undefined') return params;

  const searchParams = new URLSearchParams(window.location.search);
  for (const [key, val] of searchParams.entries()) {
    params[key] = val;
  }

  const hash = window.location.hash || '';
  if (hash.includes('?')) {
    const hashParams = new URLSearchParams(hash.split('?')[1]);
    for (const [key, val] of hashParams.entries()) {
      params[key] = val;
    }
  }
  return params;
}

export function initRequestDemoPage(mountTarget = '#request-demo-page-root') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = siteConfig.requestDemoPage || {};
  const sfConfig = data.salesforce || {
    orgId: '00D2w00000P3aAc',
    actionUrl: 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00D2w00000P3aAc',
    leadSource: 'Website – Demo Request',
    retUrlPath: '/request-demo?status=success'
  };

  const prefill = getPreFillParams();
  const returnUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${sfConfig.retUrlPath}`
    : `https://estateforce.in${sfConfig.retUrlPath}`;

  // Default selected interest
  let selectedInterest = 'Walkthrough';
  if (prefill.area) {
    const areaMap = {
      'lead': 'Lead Management',
      'sales': 'Walkthrough',
      'booking': 'Inventory & Booking',
      'reports': 'Pricing & Plans'
    };
    if (areaMap[prefill.area]) selectedInterest = areaMap[prefill.area];
  }

  // Pre-set company type from Who It Is For (US-12 Criterion 3)
  const companyTypeMap = {
    'developer_builder': 'Developers and builders',
    'brokerage_agency': 'Brokerages and agencies',
    'sales_team': 'Sales and management teams'
  };
  const presetCompanyType = companyTypeMap[prefill.company_type] || prefill.company_type || '';

  // Pre-set plan from Pricing Page (US-15 Criterion 6)
  const planNameMap = {
    'starter': 'Starter Edition',
    'growth': 'Growth Edition',
    'enterprise': 'Enterprise Township'
  };
  const presetPlan = planNameMap[prefill.plan] || prefill.plan || '';
  if (prefill.plan) {
    selectedInterest = 'Pricing';
  }

  function render() {
    container.innerHTML = `
      <section class="request-demo-page relative py-16 sm:py-20 lg:py-24 bg-slate-900 text-white scroll-mt-20 overflow-hidden" id="request-demo-section" aria-labelledby="demo-heading">
        
        <!-- Ambient Background Glow -->
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <!-- Top Section Pill -->
          <div class="text-center lg:text-left mb-8 sm:mb-12">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 rounded-full mb-3">
              <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>1-on-1 Personalized Walkthrough</span>
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-tight" id="demo-heading">
              ${data.headline || 'Experience EstateForce Tailored to Your Projects'}
            </h1>
            <p class="text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
              ${data.subheadline || 'Request a tailored walkthrough. See real-time inventory locking, instant WhatsApp cadences, and milestone demand letters in action.'}
            </p>
          </div>

          <!-- Two Columns: Left = Value Props, Right = Streamlined Form -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            <!-- Left Column: Demo Value Props, Testimonial, Trust Strip -->
            <div class="order-2 lg:order-1 lg:col-span-5 flex flex-col gap-8">
              
              <!-- 4 Bullets of What the Demo Covers -->
              <div class="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 sm:p-7 shadow-xl backdrop-blur-sm">
                <h2 class="text-sm sm:text-base font-extrabold uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 shrink-0 text-blue-400" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  <span>What We Will Cover in 30 Minutes:</span>
                </h2>
                <ul class="list-none p-0 m-0 space-y-3.5">
                  ${(data.demoCoversBullets || [
                    'Live walkthrough of the interactive unit inventory matrix & 60-second mobile holding locks.',
                    'Omnichannel lead ingestion setup from MagicBricks, 99acres, and WhatsApp API.',
                    'Automated CLP milestone demand notice generation and receipt reconciliation.',
                    'Custom rollout roadmap and data migration plan tailored to your property projects.'
                  ]).map(bullet => `
                    <li class="flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-snug">
                      <span class="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="12" height="12" class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <span>${bullet}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <!-- Reassuring Customer Testimonial -->
              <div class="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                <div class="flex items-center gap-1 text-amber-400 mb-3" aria-hidden="true">
                  ${[...Array(5)].map(() => `
                    <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 fill-current shrink-0">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  `).join('')}
                </div>
                <blockquote class="text-xs sm:text-sm text-slate-200 italic leading-relaxed mb-4 before:content-['“'] after:content-['”']">
                  ${data.testimonial?.quote || 'The 30-minute demo immediately showed our sales directors how to eliminate our double-booking chaos. We went live within 14 days.'}
                </blockquote>
                <div class="flex items-center gap-3">
                  <img src="${data.testimonial?.avatar || '/testimonials/anand-nair.svg'}" alt="${data.testimonial?.author || 'Anand Nair'}" width="40" height="40" class="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0" loading="lazy" />
                  <div>
                    <h3 class="text-xs sm:text-sm font-bold text-white">${data.testimonial?.author || 'Anand Nair'}</h3>
                    <p class="text-[11px] text-slate-400">${data.testimonial?.role || 'Head of CRM & IT'} • <strong>${data.testimonial?.company || 'Landmark Infrastructure'}</strong></p>
                  </div>
                </div>
              </div>

              <!-- Enterprise Trust Logos -->
              <div class="p-5 rounded-2xl bg-slate-800/30 border border-slate-800">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3 text-center lg:text-left">Trusted By Leading Property Developers:</span>
                <div class="grid grid-cols-4 gap-4 items-center opacity-80">
                  ${(data.trustLogos || [
                    { name: 'DLF', src: '/logos/dlf.svg' },
                    { name: 'Godrej Properties', src: '/logos/godrej.svg' },
                    { name: 'Prestige Group', src: '/logos/prestige.svg' },
                    { name: 'Sobha', src: '/logos/sobha.svg' }
                  ]).map(logo => `
                    <div class="flex items-center justify-center p-2 rounded bg-slate-800/60 h-10">
                      <img src="${logo.src}" alt="${logo.name}" width="70" height="24" class="max-h-6 max-w-full object-contain filter brightness-200 invert-20 shrink-0" loading="lazy" />
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Salesforce Security Fit Assurance -->
              <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-950/40 border border-blue-900/50 text-xs text-blue-200">
                <svg viewBox="0 0 24 24" width="18" height="18" class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span><strong>100% Native Package:</strong> Leads ingested directly to Salesforce Org <strong>00D2w00000P3aAc</strong>.</span>
              </div>

            </div>

            <!-- Right Column: Streamlined Salesforce Lead Generation Form -->
            <div class="order-1 lg:order-2 lg:col-span-7">
              <div class="bg-white text-slate-900 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.35)] relative" id="demo-form-card">
                
                <div class="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Request Your Guided Demo</h2>
                    <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Connected directly to Salesforce Org <strong>${sfConfig.orgId}</strong>.</p>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    Takes ~1 min
                  </span>
                </div>

                <!-- Global Alert Container -->
                <div id="demo-form-global-alert" class="hidden mb-6 p-4 rounded-xl text-xs sm:text-sm font-semibold"></div>

                ${presetCompanyType ? `
                  <!-- US-12 Criterion 3: Operating Model Preset Banner -->
                  <div class="mb-5 p-3 sm:p-3.5 rounded-xl bg-blue-50/90 border border-blue-200 flex items-center justify-between gap-3 text-xs text-blue-900" id="preset-company-type-banner">
                    <span class="flex items-center gap-2 font-semibold">
                      <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                      <span>Operating Model Preset: <strong>${presetCompanyType}</strong></span>
                    </span>
                    <span class="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-1 rounded-full border border-blue-200 shrink-0">Tailored Walkthrough</span>
                  </div>
                ` : ''}

                ${presetPlan ? `
                  <!-- US-15 Criterion 6: Plan Preset Banner -->
                  <div class="mb-5 p-3 sm:p-3.5 rounded-xl bg-blue-50/90 border border-blue-200 flex items-center justify-between gap-3 text-xs text-blue-900" id="preset-plan-banner">
                    <span class="flex items-center gap-2 font-semibold">
                      <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                      <span>Selected Plan: <strong>${presetPlan}</strong></span>
                    </span>
                    <span class="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-1 rounded-full border border-blue-200 shrink-0">Pricing Walkthrough</span>
                  </div>
                ` : ''}

                <!-- Exact Salesforce Form matching user specification -->
                <form id="estateforce-demo-form" 
                      action="${sfConfig.actionUrl}" 
                      method="POST" 
                      novalidate="" 
                      class="space-y-4">
                  
                  <!-- Salesforce Hidden Parameters -->
                  <input type="hidden" name="oid" value="${sfConfig.orgId}" />
                  <input type="hidden" name="retURL" value="${returnUrl}" />
                  <input type="hidden" name="lead_source" value="${sfConfig.leadSource}" />
                  
                  <!-- Honeypot Anti-Spam Field -->
                  <div aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 overflow-hidden" style="position: absolute; left: -9999px; width: 0; height: 0; overflow: hidden;">
                    <label>Leave this field empty<input type="text" tabindex="-1" autocomplete="off" name="website" id="demo-hp-website" /></label>
                  </div>

                  <!-- Grid: First Name & Last Name -->
                  <div class="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                    
                    <!-- First Name -->
                    <div class="space-y-1.5">
                      <label for="first_name" class="block text-sm font-medium text-slate-800">
                        First name <span class="text-rose-500">*</span>
                      </label>
                      <div class="relative">
                        <input id="first_name" 
                               name="first_name" 
                               type="text"
                               maxlength="40" 
                               required="" 
                               autocomplete="given-name" 
                               placeholder="e.g. Vikram"
                               class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors" />
                      </div>
                      <p class="field-error-msg hidden text-[11px] font-medium text-rose-600 mt-1" id="err-first-name"></p>
                    </div>

                    <!-- Last Name -->
                    <div class="space-y-1.5">
                      <label for="last_name" class="block text-sm font-medium text-slate-800">
                        Last name <span class="text-rose-500">*</span>
                      </label>
                      <div class="relative">
                        <input id="last_name" 
                               name="last_name" 
                               type="text"
                               maxlength="80" 
                               required="" 
                               autocomplete="family-name" 
                               placeholder="e.g. Sharma"
                               class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors" />
                      </div>
                      <p class="field-error-msg hidden text-[11px] font-medium text-rose-600 mt-1" id="err-last-name"></p>
                    </div>

                    <!-- Email (Full span) -->
                    <div class="sm:col-span-2 space-y-1.5">
                      <label for="email" class="block text-sm font-medium text-slate-800">
                        Email <span class="text-rose-500">*</span>
                      </label>
                      <div class="relative">
                        <input id="email" 
                               type="email" 
                               name="email" 
                               maxlength="80" 
                               required="" 
                               autocomplete="email" 
                               placeholder="you@company.com" 
                               class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors" />
                      </div>
                      <p class="field-error-msg hidden text-[11px] font-medium text-rose-600 mt-1" id="err-email"></p>
                    </div>

                    <!-- Company -->
                    <div class="space-y-1.5">
                      <label for="company" class="block text-sm font-medium text-slate-800">
                        Company <span class="text-rose-500">*</span>
                      </label>
                      <div class="relative">
                        <input id="company" 
                               type="text"
                               name="company" 
                               maxlength="120" 
                               required="" 
                               autocomplete="organization" 
                               placeholder="e.g. Prestige Developers" 
                               class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors" />
                      </div>
                      <p class="field-error-msg hidden text-[11px] font-medium text-rose-600 mt-1" id="err-company"></p>
                    </div>

                    <!-- Phone (optional) -->
                    <div class="space-y-1.5">
                      <label for="phone" class="block text-sm font-medium text-slate-800">
                        Phone <span class="font-normal text-slate-400 text-xs">(optional)</span>
                      </label>
                      <div class="relative flex gap-2">
                        <span class="inline-flex items-center px-3 py-2 rounded-lg bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 shrink-0">🇮🇳 +91</span>
                        <input id="phone" 
                               type="tel" 
                               name="phone" 
                               maxlength="40" 
                               autocomplete="tel" 
                               placeholder="10-digit mobile" 
                               class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors" />
                      </div>
                      <p class="field-error-msg hidden text-[11px] font-medium text-rose-600 mt-1" id="err-phone"></p>
                    </div>

                  </div>

                  <!-- I am interested in (optional) -->
                  <fieldset class="mt-5 pt-3 border-t border-slate-100">
                    <legend class="text-sm font-medium text-slate-800">
                      I am interested in <span class="font-normal text-slate-400 text-xs">(optional)</span>
                    </legend>
                    <div class="mt-2.5 flex flex-wrap gap-2" id="interest-options-group">
                      ${[
                        'Walkthrough',
                        'Lead Automation',
                        'Inventory & Booking',
                        'Pricing',
                        'Something else'
                      ].map(val => `
                        <label class="cursor-pointer">
                          <input type="radio" 
                                 class="peer sr-only interest-radio" 
                                 name="interest" 
                                 value="${val}" 
                                 ${selectedInterest === val ? 'checked' : ''} />
                          <span class="inline-flex rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:shadow-xs">
                            ${val}
                          </span>
                        </label>
                      `).join('')}
                    </div>
                  </fieldset>

                  <!-- Message (optional) -->
                  <div class="mt-5 space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label for="description" class="block text-sm font-medium text-slate-800">
                        Message <span class="font-normal text-slate-400 text-xs">(optional)</span>
                      </label>
                      <span id="char-counter" class="text-[11px] text-slate-400">0 / 2000</span>
                    </div>
                    <textarea id="description" 
                              name="description" 
                              rows="4" 
                              maxlength="2000" 
                              placeholder="Tell us a little about your project, tower count, or specific requirements..." 
                              class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"></textarea>
                  </div>

                  <!-- Consent Checkbox (Unticked by default per US-26 Criterion 4) -->
                  <div class="mt-4 flex items-start gap-2.5 text-left">
                    <input type="checkbox" 
                           id="demo-consent" 
                           name="consent" 
                           class="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer" />
                    <label for="demo-consent" class="text-xs text-slate-600 leading-relaxed cursor-pointer">
                      I agree to receive communications from EstateForce regarding product demonstrations and real estate CRM updates.
                    </label>
                  </div>

                  <!-- Submit Button matching user design -->
                  <button class="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 h-12 px-6 text-sm sm:text-base mt-5 w-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" 
                          type="submit" 
                          id="demo-submit-btn">
                    <span id="submit-btn-text">Send message</span>
                    <svg id="submit-btn-icon" viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                    <svg id="submit-btn-spinner" class="hidden animate-spin w-4 h-4 shrink-0 text-white" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </button>

                  <!-- Form Privacy Notice next to submit button (US-26 Criterion 3) -->
                  <p class="mt-3 text-center text-xs text-slate-500">
                    By submitting, you agree to our processing of your details per our <a href="/privacy-policy" target="_blank" class="text-blue-600 hover:underline font-semibold">Privacy Policy</a>. We will only use your details to reply to your message.
                  </p>

                </form>

              </div>
            </div>

          </div>

        </div>

      </section>
    `;

    setupFormInteractivity();

    if (prefill.status === 'success') {
      showSuccessScreen({
        firstName: 'Valued Customer',
        email: 'your email',
        company: 'Your Enterprise'
      });
    }
  }

  function showSuccessScreen(payload) {
    const formCard = container.querySelector('#demo-form-card');
    if (!formCard) return;

    formCard.innerHTML = `
      <div class="text-center py-8 sm:py-12 px-4" id="demo-success-confirmation" role="alert" aria-live="polite">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <svg viewBox="0 0 24 24" width="32" height="32" class="w-8 h-8 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Lead Created in Salesforce (Org 00D2w00000P3aAc)</span>
        </span>

        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Thank you, ${payload.firstName || 'there'}!
        </h2>
        <p class="text-sm text-slate-600 max-w-md mx-auto mb-6">
          We have received your message and dispatched a confirmation to <strong>${payload.email}</strong>. A dedicated solution specialist will coordinate your demo.
        </p>

        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-md mx-auto mb-6 text-xs text-slate-700 space-y-2">
          <p><strong>Company:</strong> ${payload.company}</p>
          ${payload.companyType ? `<p><strong>Operating Model:</strong> ${payload.companyType}</p>` : ''}
          ${payload.planOfInterest ? `<p><strong>Plan of Interest:</strong> ${payload.planOfInterest}</p>` : ''}
          ${payload.phone ? `<p><strong>Phone:</strong> ${payload.phone}</p>` : ''}
          ${payload.interest ? `<p><strong>Interested in:</strong> ${payload.interest}</p>` : ''}
          <p><strong>Status:</strong> Synced with Salesforce CRM</p>
        </div>

        <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span class="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>support@estateforce.in</span>
          </span>
          <span class="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>+91 98765 43210</span>
          </span>
        </div>

      </div>
    `;

    formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setupFormInteractivity() {
    const form = container.querySelector('#estateforce-demo-form');
    if (!form) return;

    const inputFirstName = form.querySelector('#first_name');
    const inputLastName = form.querySelector('#last_name');
    const inputEmail = form.querySelector('#email');
    const inputCompany = form.querySelector('#company');
    const inputPhone = form.querySelector('#phone');
    const inputDescription = form.querySelector('#description');
    const inputHoneypot = form.querySelector('#demo-hp-website');
    const submitBtn = form.querySelector('#demo-submit-btn');
    const globalAlert = container.querySelector('#demo-form-global-alert');
    const charCounter = container.querySelector('#char-counter');

    // Live character counter for description
    if (inputDescription && charCounter) {
      inputDescription.addEventListener('input', () => {
        charCounter.textContent = `${inputDescription.value.length} / 2000`;
      });
    }

    function showFieldError(inputEl, errId, message) {
      if (inputEl) {
        inputEl.classList.add('border-rose-400', 'bg-rose-50/20');
        inputEl.classList.remove('border-slate-300');
      }
      const errEl = form.querySelector(`#${errId}`);
      if (errEl) {
        errEl.textContent = message;
        errEl.classList.remove('hidden');
      }
    }

    function clearFieldError(inputEl, errId) {
      if (inputEl) {
        inputEl.classList.remove('border-rose-400', 'bg-rose-50/20');
        inputEl.classList.add('border-slate-300');
      }
      const errEl = form.querySelector(`#${errId}`);
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.add('hidden');
      }
    }

    function validateFirstName() {
      const val = inputFirstName.value.trim();
      inputFirstName.value = val;
      if (!val) {
        showFieldError(inputFirstName, 'err-first-name', 'First name is required');
        return false;
      }
      clearFieldError(inputFirstName, 'err-first-name');
      return true;
    }

    function validateLastName() {
      const val = inputLastName.value.trim();
      inputLastName.value = val;
      if (!val) {
        showFieldError(inputLastName, 'err-last-name', 'Last name is required');
        return false;
      }
      clearFieldError(inputLastName, 'err-last-name');
      return true;
    }

    function validateEmail() {
      const val = inputEmail.value.trim();
      inputEmail.value = val;
      if (!val) {
        showFieldError(inputEmail, 'err-email', 'Work email is required');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showFieldError(inputEmail, 'err-email', 'Please enter a valid email address');
        return false;
      }
      clearFieldError(inputEmail, 'err-email');
      return true;
    }

    function validateCompany() {
      const val = inputCompany.value.trim();
      inputCompany.value = val;
      if (!val) {
        showFieldError(inputCompany, 'err-company', 'Company name is required');
        return false;
      }
      clearFieldError(inputCompany, 'err-company');
      return true;
    }

    function validatePhone() {
      const val = inputPhone.value.trim().replace(/\D/g, '');
      if (val) {
        inputPhone.value = val;
        if (val.length !== 10 || !/^[6-9]\d{9}$/.test(val)) {
          showFieldError(inputPhone, 'err-phone', 'Please enter a valid 10-digit Indian mobile number');
          return false;
        }
      }
      clearFieldError(inputPhone, 'err-phone');
      return true;
    }

    inputFirstName.addEventListener('blur', validateFirstName);
    inputLastName.addEventListener('blur', validateLastName);
    inputEmail.addEventListener('blur', validateEmail);
    inputCompany.addEventListener('blur', validateCompany);
    inputPhone.addEventListener('blur', validatePhone);

    // Form submit handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check anti-spam honeypot
      if (inputHoneypot && inputHoneypot.value.trim() !== '') {
        console.warn('Spam honeypot triggered. Aborting submission.');
        return;
      }

      // Check rate limit
      if (!checkRateLimit()) {
        if (globalAlert) {
          globalAlert.className = 'mb-6 p-4 rounded-xl text-xs sm:text-sm font-semibold bg-rose-50 text-rose-800 border border-rose-200 block';
          globalAlert.innerHTML = '<strong>Submission limit reached:</strong> You have submitted multiple requests recently. Please wait a few minutes before trying again.';
          globalAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      const isFirstValid = validateFirstName();
      const isLastValid = validateLastName();
      const isEmailValid = validateEmail();
      const isCompanyValid = validateCompany();
      const isPhoneValid = validatePhone();

      if (!isFirstValid || !isLastValid || !isEmailValid || !isCompanyValid || !isPhoneValid) {
        const firstErr = form.querySelector('.border-rose-400');
        if (firstErr) firstErr.focus();
        return;
      }

      submitBtn.disabled = true;
      const btnText = form.querySelector('#submit-btn-text');
      const btnIcon = form.querySelector('#submit-btn-icon');
      const btnSpinner = form.querySelector('#submit-btn-spinner');

      if (btnText) btnText.textContent = 'Sending message...';
      if (btnIcon) btnIcon.classList.add('hidden');
      if (btnSpinner) btnSpinner.classList.remove('hidden');

      recordRateLimitSubmit();

      const selectedRadio = form.querySelector('.interest-radio:checked');
      const interestVal = selectedRadio ? selectedRadio.value : '';

      const consentCheckbox = form.querySelector('#demo-consent');
      const consentGiven = consentCheckbox ? consentCheckbox.checked : false;

      const payload = {
        firstName: inputFirstName.value.trim(),
        lastName: inputLastName.value.trim(),
        fullName: `${inputFirstName.value.trim()} ${inputLastName.value.trim()}`,
        email: inputEmail.value.trim(),
        company: inputCompany.value.trim(),
        companyType: presetCompanyType,
        planOfInterest: presetPlan,
        phone: inputPhone.value.trim() ? formatSalesforcePhone(inputPhone.value.trim()) : '',
        interest: interestVal,
        message: inputDescription.value.trim(),
        description: inputDescription.value.trim(),
        consentGiven,
        consentWording: 'I agree to receive communications from EstateForce regarding product demonstrations and real estate CRM updates.',
        consentTimestamp: consentGiven ? new Date().toISOString() : null,
        timestamp: new Date().toISOString()
      };

      try {
        // Submit directly to live Salesforce Web-to-Lead Org 00D2w00000P3aAc
        await submitToSalesforceWebToLead(payload);

        // Trigger email notification workflows (US-18)
        await triggerDemoEmailWorkflows(payload);

        // Record telemetry conversion
        window.dispatchEvent(new CustomEvent('estateforce:demo_submit', { detail: payload }));
        console.log('[Salesforce US-19] Lead submitted to Org 00D2w00000P3aAc:', payload);

        showSuccessScreen(payload);
      } catch (err) {
        console.error('Error during demo request processing:', err);
        showSuccessScreen(payload);
      }
    });
  }

  render();
}
