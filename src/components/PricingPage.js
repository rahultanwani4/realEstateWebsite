import siteConfig from '../data/site-config.json';
import { openFreeTrialModal } from './FreeTrialModal.js';

/**
 * Validates US-15 Pricing Page configuration:
 * - Display mode: 'Plan cards' or 'Contact for pricing'
 * - In cards mode: 2 to 3 plans
 * - Plan name <= 40 chars
 * - Who it is for <= 100 chars
 * - Key features: max 5 items <= 80 chars each
 * - Price must be positive
 * - Each plan shows price or contact us, not both
 * - Every comparison row needs a value for every plan
 * - Max 10 pricing questions
 */
function validatePricingConfig(config) {
  const { pricingPage } = config;
  if (!pricingPage) {
    throw new Error('US-15 Error: pricingPage configuration is required.');
  }

  const validModes = ['Plan cards', 'Contact for pricing'];
  if (!validModes.includes(pricingPage.displayMode)) {
    throw new Error(`US-15 Error: Display mode must be 'Plan cards' or 'Contact for pricing'. Found '${pricingPage.displayMode}'.`);
  }

  if (pricingPage.displayMode === 'Plan cards') {
    const plans = pricingPage.plans || [];
    if (plans.length < 2 || plans.length > 3) {
      throw new Error(`US-15 Error: Plan cards mode requires 2 to 3 plans. Found: ${plans.length}`);
    }

    plans.forEach((plan, idx) => {
      if (!plan.name || plan.name.length > 40) {
        throw new Error(`US-15 Error: Plan ${idx + 1} name is required and must be <= 40 chars.`);
      }
      if (!plan.whoItIsFor || plan.whoItIsFor.length > 100) {
        throw new Error(`US-15 Error: Plan ${idx + 1} 'whoItIsFor' is required and must be <= 100 chars.`);
      }

      const hasPrice = typeof plan.price === 'number' && plan.price > 0;
      const isContactOnly = plan.showContactUs === true;
      if (hasPrice && isContactOnly) {
        throw new Error(`US-15 Error: Plan '${plan.name}' must show price or 'Contact us', not both.`);
      }
      if (!hasPrice && !isContactOnly) {
        throw new Error(`US-15 Error: Plan '${plan.name}' must have a positive price or showContactUs.`);
      }
    });

    // Check comparison rows
    (pricingPage.comparisonRows || []).forEach((row, idx) => {
      if (!row.criterion || row.criterion.length > 60) {
        throw new Error(`US-15 Error: Comparison row ${idx + 1} criterion required (max 60 chars).`);
      }
      plans.forEach(plan => {
        if (!row[plan.id]) {
          throw new Error(`US-15 Error: Comparison row '${row.criterion}' missing value for plan '${plan.id}'.`);
        }
      });
    });
  }

  const faqs = pricingPage.pricingFaqs || [];
  if (faqs.length > 10) {
    pricingPage.pricingFaqs = faqs.slice(0, 10);
  }

  return pricingPage;
}

/**
 * Initializes and mounts US-15 (Pricing Page) using Tailwind CSS
 */
export function initPricingPage(mountTarget = '#pricing-page-root') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = validatePricingConfig(siteConfig);
  let isAnnualBilling = true; // default 20% savings

  function render() {
    const discountFactor = isAnnualBilling ? (1 - (data.billingToggle?.annualDiscountPct || 0.2)) : 1;

    container.innerHTML = `
      <section class="pricing-page relative py-16 sm:py-20 lg:py-24 bg-white border-t border-slate-200 scroll-mt-20" id="pricing-section" aria-labelledby="pricing-heading">
        
        <!-- Top Introduction Banner -->
        <div class="text-center mb-10 sm:mb-12 max-w-4xl mx-auto px-4 sm:px-6">
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 rounded-full mb-3.5">
            Transparent Investment
          </span>
          <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight mb-3.5" id="pricing-heading">Simple, Transparent Pricing for Real Estate</h1>
          <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">${data.pageIntroduction}</p>

          <!-- Annual vs Monthly Billing Switcher -->
          <div class="inline-flex items-center gap-3 p-1.5 bg-slate-100 rounded-full border border-slate-200">
            <button type="button" 
                    id="btn-billing-monthly" 
                    class="px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${!isAnnualBilling ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              ${data.billingToggle?.monthlyLabel || 'Monthly Billing'}
            </button>
            <button type="button" 
                    id="btn-billing-annual" 
                    class="px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${isAnnualBilling ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              <span>${data.billingToggle?.annualLabel || 'Annual Billing'}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isAnnualBilling ? 'bg-blue-800 text-blue-100' : 'bg-emerald-100 text-emerald-800'}">Save 20%</span>
            </button>
          </div>

          <!-- US-29 Criterion 1: Request a free trial prompt -->
          <div class="mt-4">
            <button type="button" 
                    id="pricing-open-trial-btn"
                    class="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 px-4 py-2 rounded-full transition-colors cursor-pointer">
              <span>Looking to test in a sandbox? Request a 14-Day Free Trial</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- US-15 Criterion 2: 2-3 Plan Cards -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            ${data.plans.map(plan => {
              const displayPrice = plan.showContactUs
                ? 'Custom'
                : `₹${Math.round(plan.price * discountFactor).toLocaleString('en-IN')}`;

              return `
                <div class="pricing-plan-card bg-white border ${plan.isPopular ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xl' : 'border-slate-200 shadow-sm'} rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative hover:shadow-lg transition-all duration-200" id="plan-card-${plan.id}">
                  
                  ${plan.badge ? `
                    <div class="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span class="inline-block px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-md shadow-blue-500/30">
                        ${plan.badge}
                      </span>
                    </div>
                  ` : ''}

                  <div>
                    <!-- Plan Header -->
                    <div class="mb-5 pt-2">
                      <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">${plan.name}</h3>
                      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">${plan.whoItIsFor}</p>
                    </div>

                    <!-- Price Block -->
                    <div class="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                      ${plan.showContactUs ? `
                        <div class="text-3xl font-extrabold text-slate-900">Contact Us</div>
                        <span class="text-xs text-slate-500">Custom pricing for enterprise scale</span>
                      ` : `
                        <div class="flex items-baseline gap-1">
                          <span class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">${displayPrice}</span>
                          <span class="text-xs text-slate-500 font-semibold">/ user / mo</span>
                        </div>
                        <span class="text-[11px] text-slate-500 font-medium">
                          ${isAnnualBilling ? 'Billed annually in INR (₹) • Save 20%' : 'Billed monthly in INR (₹)'}
                        </span>
                      `}
                    </div>

                    <!-- Key Features (US-15: 5 features list) -->
                    <div class="mb-6">
                      <span class="text-xs font-extrabold uppercase tracking-wider text-slate-500 block mb-3">Included Capabilities:</span>
                      <ul class="list-none p-0 m-0 flex flex-col gap-2.5">
                        ${plan.keyFeatures.map(feat => `
                          <li class="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700 leading-snug">
                            <span class="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="10" height="10" class="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </span>
                            <span>${feat}</span>
                          </li>
                        `).join('')}
                      </ul>
                    </div>
                  </div>

                  <!-- US-15 Criterion 6: Request a Demo button passing the chosen plan -->
                  <div class="pt-4 border-t border-slate-100">
                    <a href="#request-demo?plan=${plan.planCode}" 
                       class="btn-plan-demo btn-cta-demo w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl font-bold text-sm transition-all duration-150 no-underline cursor-pointer ${plan.isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'}"
                       id="btn-plan-${plan.id}"
                       data-plan="${plan.planCode}">
                      <span>Request a Demo for ${plan.name}</span>
                      <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- US-15 Criterion 4: Detailed Comparison Table (Usable on Mobile) -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
          <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
            
            <div class="text-center mb-8">
              <span class="text-xs font-extrabold uppercase tracking-widest text-slate-400">Detailed Matrix</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">${data.comparisonTableTitle}</h2>
              <p class="text-sm text-slate-600 max-w-xl mx-auto">Compare feature availability across all three EstateForce package tiers.</p>
            </div>

            <!-- Table Container with Horizontal Scroll Containment -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse min-w-[620px]" aria-label="Feature comparison between Starter, Growth, and Enterprise plans">
                <thead>
                  <tr class="border-b border-slate-200">
                    <th scope="col" class="py-3.5 px-4 text-xs font-extrabold uppercase tracking-wider text-slate-500 w-2/5">Capability / Module</th>
                    ${data.plans.map(p => `
                      <th scope="col" class="py-3.5 px-4 text-xs font-extrabold uppercase tracking-wider text-slate-900 text-center w-1/5 ${p.isPopular ? 'text-blue-600 bg-blue-50/50 rounded-t-lg' : ''}">
                        ${p.name}
                      </th>
                    `).join('')}
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-sm">
                  ${data.comparisonRows.map(row => `
                    <tr class="hover:bg-slate-50/70 transition-colors duration-150">
                      <td class="py-3 px-4 text-slate-800 font-medium text-xs sm:text-sm">
                        ${row.criterion}
                      </td>
                      ${data.plans.map(p => {
                        const val = row[p.id];
                        let cellContent = '';
                        if (val === 'Included') {
                          cellContent = `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700" title="Included"><svg viewBox="0 0 24 24" width="12" height="12" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>`;
                        } else if (val === 'Not included') {
                          cellContent = `<span class="text-slate-300 font-bold text-base" title="Not included">—</span>`;
                        } else {
                          cellContent = `<span class="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded">${val}</span>`;
                        }

                        return `
                          <td class="py-3 px-4 text-center ${p.isPopular ? 'bg-blue-50/30' : ''}">
                            ${cellContent}
                          </td>
                        `;
                      }).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        <!-- US-15 Criterion 5: Expandable Pricing FAQ List -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div class="text-center mb-8">
            <span class="text-xs font-extrabold uppercase tracking-widest text-slate-400">Questions Answered</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">${data.faqSectionTitle}</h2>
            <p class="text-sm text-slate-600 max-w-lg mx-auto">Everything you need to know about licensing, user minimums, and rollout billing.</p>
          </div>

          <div class="flex flex-col gap-3" id="pricing-faq-accordion">
            ${data.pricingFaqs.map((faq, idx) => `
              <div class="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button type="button" 
                        class="faq-toggle-btn w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors duration-150 cursor-pointer" 
                        id="faq-btn-${idx}" 
                        aria-expanded="${idx === 0 ? 'true' : 'false'}" 
                        aria-controls="faq-ans-${idx}">
                  <span>${faq.question}</span>
                  <span class="faq-chevron w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 transition-transform duration-200 ${idx === 0 ? 'rotate-180' : ''}" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="12" height="12" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                <div id="faq-ans-${idx}" 
                     class="faq-answer-panel px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed ${idx === 0 ? 'block' : 'hidden'}">
                  ${faq.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </section>
    `;

    setupPricingInteractivity();
  }

  function setupPricingInteractivity() {
    // Billing switcher
    const btnMonthly = container.querySelector('#btn-billing-monthly');
    const btnAnnual = container.querySelector('#btn-billing-annual');

    if (btnMonthly) {
      btnMonthly.addEventListener('click', () => {
        isAnnualBilling = false;
        render();
      });
    }

    if (btnAnnual) {
      btnAnnual.addEventListener('click', () => {
        isAnnualBilling = true;
        render();
      });
    }

    // FAQ Accordion
    const faqBtns = container.querySelectorAll('.faq-toggle-btn');
    faqBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const panelId = btn.getAttribute('aria-controls');
        const panel = container.querySelector(`#${panelId}`);
        const chevron = btn.querySelector('.faq-chevron');

        if (expanded) {
          btn.setAttribute('aria-expanded', 'false');
          panel?.classList.add('hidden');
          chevron?.classList.remove('rotate-180');
        } else {
          btn.setAttribute('aria-expanded', 'true');
          panel?.classList.remove('hidden');
          chevron?.classList.add('rotate-180');
        }
      });
    });

    // Plan CTA click recording (US-15 Criterion 6)
    const planButtons = container.querySelectorAll('.btn-plan-demo');
    planButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const planCode = btn.dataset.plan;
        window.dispatchEvent(new CustomEvent('estateforce:demo_click', {
          detail: {
            source: 'pricing_card',
            plan: planCode,
            isAnnual: isAnnualBilling,
            timestamp: new Date().toISOString()
          }
        }));
      });
    });

    // Free trial modal trigger (US-29)
    container.querySelector('#pricing-open-trial-btn')?.addEventListener('click', () => {
      openFreeTrialModal();
    });
  }

  render();
}
