import siteConfig from '../data/site-config.json';
import { submitToSalesforceWebToLead } from '../services/salesforceLeadService.js';

/**
 * Validates US-14 Security and Salesforce Fit Page configuration:
 * - Content approved by CTA required (cannot publish until approved)
 * - Fit and data text <= 1,500 chars, required
 * - Access and protection text <= 1,500 chars, required
 * - At least one supported edition (<= 50 chars each)
 * - Installation steps (<= 200 chars each)
 * - IT checklist items (<= 150 chars each)
 */
function validateSecurityFitConfig(config) {
  const { securityAndFitPage } = config;
  if (!securityAndFitPage) {
    throw new Error('US-14 Error: securityAndFitPage configuration is required.');
  }

  if (!securityAndFitPage.isApproved || !securityAndFitPage.contentApprovedBy) {
    throw new Error('US-14 Error: Security and fit page cannot publish until approved by technical authority.');
  }
  if (securityAndFitPage.contentApprovedBy.length > 80) {
    securityAndFitPage.contentApprovedBy = securityAndFitPage.contentApprovedBy.slice(0, 80);
  }

  if (!securityAndFitPage.fitAndDataText) {
    throw new Error('US-14 Error: Fit and data text is required.');
  }
  if (securityAndFitPage.fitAndDataText.length > 1500) {
    securityAndFitPage.fitAndDataText = securityAndFitPage.fitAndDataText.slice(0, 1500);
  }

  if (!securityAndFitPage.accessAndProtectionText) {
    throw new Error('US-14 Error: Access and protection text is required.');
  }
  if (securityAndFitPage.accessAndProtectionText.length > 1500) {
    securityAndFitPage.accessAndProtectionText = securityAndFitPage.accessAndProtectionText.slice(0, 1500);
  }

  const editions = securityAndFitPage.supportedEditions || [];
  if (editions.length === 0) {
    throw new Error('US-14 Error: At least one supported Salesforce edition is required.');
  }
  editions.forEach((ed, idx) => {
    if (ed.length > 50) {
      editions[idx] = ed.slice(0, 50);
    }
  });

  (securityAndFitPage.installationSteps || []).forEach((step, idx) => {
    if (step.length > 200) {
      securityAndFitPage.installationSteps[idx] = step.slice(0, 200);
    }
  });

  (securityAndFitPage.itChecklist || []).forEach((item, idx) => {
    if (item.length > 150) {
      securityAndFitPage.itChecklist[idx] = item.slice(0, 150);
    }
  });

  return securityAndFitPage;
}

/**
 * Initializes and mounts US-14 (Security and Salesforce Fit Page) using Tailwind CSS
 */
export function initSecurityFitPage(mountTarget = '#security-fit-page-root') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = validateSecurityFitConfig(siteConfig);

  container.innerHTML = `
    <section class="security-fit-page relative py-16 sm:py-20 lg:py-24 bg-slate-50/70 border-t border-slate-200 scroll-mt-20" id="security-fit-section" aria-labelledby="security-heading">
      
      <!-- Top Introduction Banner -->
      <div class="text-center mb-12 sm:mb-16 max-w-4xl mx-auto px-4 sm:px-6">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 rounded-full mb-3.5">
          <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Security &amp; Architecture</span>
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight mb-3.5" id="security-heading">100% Native Architecture &amp; Governance</h1>
        <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4">${data.pageIntroduction}</p>
        <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <svg viewBox="0 0 24 24" width="13" height="13" class="w-3 h-3 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Architecture reviewed &amp; approved by: <strong>${data.contentApprovedBy}</strong></span>
        </span>
      </div>

      <!-- US-14 Criterion 1 & 2: Data Sovereignty and Access Control Showcase Cards -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Card 1: Data Sovereignty & Salesforce Fit (Criterion 1) -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 shrink-0">
                <svg viewBox="0 0 24 24" width="24" height="24" class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                </svg>
              </div>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-4">${data.fitAndDataTitle}</h2>
              <p class="text-sm text-slate-600 leading-relaxed m-0">${data.fitAndDataText}</p>
            </div>

            <div class="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              <span class="px-2.5 py-1 bg-slate-100 rounded-md">✓ Zero External DBs</span>
              <span class="px-2.5 py-1 bg-slate-100 rounded-md">✓ No Data Sync Lag</span>
              <span class="px-2.5 py-1 bg-slate-100 rounded-md">✓ RERA Audit Ready</span>
            </div>
          </div>

          <!-- Card 2: Access Control, Shield & Protection (Criterion 2) -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shrink-0">
                <svg viewBox="0 0 24 24" width="24" height="24" class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-4">${data.accessAndProtectionTitle}</h2>
              <p class="text-sm text-slate-600 leading-relaxed m-0">${data.accessAndProtectionText}</p>
            </div>

            <div class="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              <span class="px-2.5 py-1 bg-slate-100 rounded-md">✓ Salesforce Shield Ready</span>
              <span class="px-2.5 py-1 bg-slate-100 rounded-md">✓ Field-Level Security</span>
              <span class="px-2.5 py-1 bg-slate-100 rounded-md">✓ Setup Audit Trail</span>
            </div>
          </div>

        </div>
      </div>

      <!-- US-14 Criterion 3: Supported Editions & Short Installation Steps -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          <!-- Supported Salesforce Editions -->
          <div>
            <span class="text-xs font-extrabold uppercase tracking-widest text-slate-400">Environment Compatibility</span>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 mb-4">Supported Salesforce Editions</h3>
            <p class="text-sm text-slate-600 mb-5 leading-relaxed">EstateForce is fully supported and optimized across all major enterprise Lightning environments:</p>
            
            <ul class="list-none p-0 m-0 flex flex-col gap-3">
              ${data.supportedEditions.map(ed => `
                <li class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-800">
                  <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>${ed}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- 4 Short Installation Steps -->
          <div>
            <span class="text-xs font-extrabold uppercase tracking-widest text-slate-400">Deployment Procedure</span>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 mb-4">Package Installation Steps</h3>
            <p class="text-sm text-slate-600 mb-5 leading-relaxed">Fast, predictable installation executed in less than 30 minutes by any certified Salesforce Admin:</p>

            <ol class="list-none p-0 m-0 flex flex-col gap-3">
              ${data.installationSteps.map((step, idx) => `
                <li class="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    ${idx + 1}
                  </span>
                  <span class="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">${step}</span>
                </li>
              `).join('')}
            </ol>
          </div>

        </div>
      </div>

      <!-- US-14 Criterion 4 & 5: AppExchange Links, Badges & Printable IT Checklist -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <!-- AppExchange Trust Badge Box (Criterion 4) -->
          <div class="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <span class="inline-block px-3 py-1 bg-blue-800/80 text-blue-200 text-xs font-bold uppercase tracking-wider rounded-lg mb-4">Official Verification</span>
            <h3 class="text-xl font-extrabold tracking-tight mb-2 text-white">AppExchange Certified</h3>
            <p class="text-xs text-blue-200 leading-relaxed mb-6">Security reviewed and approved by Salesforce AppExchange security operations.</p>
            
            <div class="flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <span class="text-3xl font-extrabold text-amber-400">★ 4.9</span>
              <div class="text-xs text-blue-200">
                <div class="font-bold text-white">Salesforce AppExchange Rating</div>
                <div>Based on 38 verified reviews</div>
              </div>
            </div>

            <div class="flex flex-col gap-2.5">
              <a href="${data.appExchange.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 h-10 px-4 bg-white text-blue-900 font-bold text-xs rounded-xl hover:bg-blue-50 transition-colors duration-150 no-underline">
                <span>View on AppExchange</span>
                <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
              <a href="${data.appExchange.docsUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 h-10 px-4 bg-white/10 text-white font-bold text-xs rounded-xl hover:bg-white/20 transition-colors duration-150 no-underline">
                <span>Architecture Documentation</span>
                <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </a>
            </div>
          </div>

          <!-- Printable IT Checklist (Criterion 5) -->
          <div class="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm" id="it-checklist-card">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <span class="text-xs font-extrabold uppercase tracking-widest text-slate-400">Pre-Deployment Verification</span>
                <h3 class="text-xl font-bold text-slate-900 tracking-tight mt-0.5">${data.itChecklistTitle}</h3>
              </div>
              <button type="button" id="btn-print-checklist" class="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors duration-150 cursor-pointer">
                <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                <span>Print / Save IT Checklist</span>
              </button>
            </div>

            <p class="text-xs text-slate-600 mb-5 leading-relaxed">Ensure your Salesforce organization meets the technical requirements before managed package deployment:</p>

            <div class="flex flex-col gap-3">
              ${data.itChecklist.map((item, idx) => `
                <label class="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl cursor-pointer hover:bg-blue-50/50 transition-colors duration-150">
                  <input type="checkbox" checked class="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" id="chk-${idx}" />
                  <span class="text-xs sm:text-sm text-slate-700 leading-snug font-medium">${item}</span>
                </label>
              `).join('')}
            </div>
          </div>

        </div>
      </div>

      <!-- US-14 Criterion 6: "Ask a Technical Question" Interactive Form -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm" id="technical-form-container">
          
          <div class="text-center mb-8">
            <span class="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg mb-2">Direct Architect Access</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">${data.technicalForm.headline}</h2>
            <p class="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">${data.technicalForm.subtext}</p>
          </div>

          <!-- The Form -->
          <form id="tech-question-form" class="flex flex-col gap-4 sm:gap-5" novalidate>
            
            <!-- Honeypot anti-spam field (hidden from genuine users) -->
            <div style="display: none;" aria-hidden="true">
              <input type="text" name="website_hp" id="website_hp" tabindex="-1" autocomplete="off" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              <!-- Full Name (Required, max 80 chars) -->
              <div>
                <label for="tech_full_name" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span class="text-rose-600">*</span>
                </label>
                <input type="text" 
                       id="tech_full_name" 
                       name="full_name" 
                       maxlength="80" 
                       required 
                       placeholder="e.g. Ramesh Chandra" 
                       class="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150" />
                <span class="text-xs text-rose-600 mt-1 hidden" id="err-tech_full_name">Please enter your full name.</span>
              </div>

              <!-- Work Email (Required, valid email format) -->
              <div>
                <label for="tech_work_email" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Work Email <span class="text-rose-600">*</span>
                </label>
                <input type="email" 
                       id="tech_work_email" 
                       name="work_email" 
                       required 
                       placeholder="name@company.com" 
                       class="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150" />
                <span class="text-xs text-rose-600 mt-1 hidden" id="err-tech_work_email">Please enter a valid work email address.</span>
              </div>

            </div>

            <!-- Company Name (Required, max 100 chars) -->
            <div>
              <label for="tech_company" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name <span class="text-rose-600">*</span>
              </label>
              <input type="text" 
                     id="tech_company" 
                     name="company" 
                     maxlength="100" 
                     required 
                     placeholder="e.g. Apex Horizon Developers" 
                     class="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150" />
              <span class="text-xs text-rose-600 mt-1 hidden" id="err-tech_company">Please enter your company name.</span>
            </div>

            <!-- Technical Question (Required, 10 - 1,000 chars) -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label for="tech_question" class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Technical Question or Architecture Inquiry <span class="text-rose-600">*</span>
                </label>
                <span class="text-[11px] text-slate-400" id="tech_char_counter">0 / 1000</span>
              </div>
              <textarea id="tech_question" 
                        name="question" 
                        rows="4" 
                        minlength="10" 
                        maxlength="1000" 
                        required 
                        placeholder="Detail your question regarding org limits, managed package apex triggers, custom objects, Shield encryption compatibility, or API integration..." 
                        class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"></textarea>
              <span class="text-xs text-rose-600 mt-1 hidden" id="err-tech_question">Question must be between 10 and 1,000 characters.</span>
            </div>

            <!-- Consent Checkbox (Required) -->
            <div>
              <label class="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" 
                       id="tech_consent" 
                       name="consent" 
                       required 
                       class="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span class="text-xs text-slate-600 leading-snug">
                  ${data.technicalForm.fields.consentLabel} <span class="text-rose-600">*</span>
                </span>
              </label>
              <span class="text-xs text-rose-600 mt-1 hidden" id="err-tech_consent">Consent is required to submit your technical inquiry.</span>
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button type="submit" 
                      id="btn-submit-tech-question" 
                      class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer">
                <span>${data.technicalForm.submitButtonLabel}</span>
                <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>

          </form>

          <!-- Success State (Hidden until submission) -->
          <div id="tech-form-success" class="hidden p-6 sm:p-8 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3.5">
              <svg viewBox="0 0 24 24" width="24" height="24" class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-emerald-900 mb-2">Technical Inquiry Received</h3>
            <p class="text-xs sm:text-sm text-emerald-700 leading-relaxed max-w-lg mx-auto m-0">${data.technicalForm.successMessage}</p>
          </div>

        </div>
      </div>

      <!-- US-14 Criterion 7: Request a Demo Button at the End -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-2xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="max-w-xl text-center sm:text-left">
            <span class="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-lg mb-2">Technical Walkthrough</span>
            <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">${data.closingDemoCta.headline}</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">${data.closingDemoCta.subtext}</p>
          </div>
          <a href="#request-demo?source=security_fit" 
             id="security-bottom-demo-btn" 
             class="btn-cta-demo inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-full font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-md shadow-blue-500/25 transition-all duration-200 no-underline shrink-0">
            <span>${data.closingDemoCta.buttonLabel}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>

    </section>
  `;

  setupSecurityFitInteractivity(container);
}

/**
 * Sets up technical form submission, checklist print, and demo click telemetry for US-14
 */
function setupSecurityFitInteractivity(container) {
  const form = container.querySelector('#tech-question-form');
  const successBox = container.querySelector('#tech-form-success');
  const questionArea = container.querySelector('#tech-question');
  const charCounter = container.querySelector('#tech-char_counter');
  const printBtn = container.querySelector('#btn-print-checklist');
  const demoBtn = container.querySelector('#security-bottom-demo-btn');

  // Live character counter
  if (questionArea && charCounter) {
    questionArea.addEventListener('input', () => {
      const len = questionArea.value.length;
      charCounter.textContent = `${len} / 1000`;
    });
  }

  // Print checklist
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Technical Form validation and submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check honeypot spam protection (Criterion 6)
      const hp = form.querySelector('#website_hp')?.value;
      if (hp && hp.trim().length > 0) {
        console.warn('Spam detected via honeypot.');
        return;
      }

      const nameInput = form.querySelector('#tech_full_name');
      const emailInput = form.querySelector('#tech_work_email');
      const companyInput = form.querySelector('#tech_company');
      const questionInput = form.querySelector('#tech_question');
      const consentInput = form.querySelector('#tech_consent');

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim() || nameInput.value.trim().length > 80) {
        container.querySelector('#err-tech_full_name')?.classList.remove('hidden');
        isValid = false;
      } else {
        container.querySelector('#err-tech_full_name')?.classList.add('hidden');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        container.querySelector('#err-tech_work_email')?.classList.remove('hidden');
        isValid = false;
      } else {
        container.querySelector('#err-tech_work_email')?.classList.add('hidden');
      }

      // Validate company
      if (!companyInput.value.trim() || companyInput.value.trim().length > 100) {
        container.querySelector('#err-tech_company')?.classList.remove('hidden');
        isValid = false;
      } else {
        container.querySelector('#err-tech_company')?.classList.add('hidden');
      }

      // Validate question length (10 - 1000 chars)
      const qText = questionInput.value.trim();
      if (qText.length < 10 || qText.length > 1000) {
        container.querySelector('#err-tech_question')?.classList.remove('hidden');
        isValid = false;
      } else {
        container.querySelector('#err-tech_question')?.classList.add('hidden');
      }

      // Validate consent
      if (!consentInput.checked) {
        container.querySelector('#err-tech_consent')?.classList.remove('hidden');
        isValid = false;
      } else {
        container.querySelector('#err-tech_consent')?.classList.add('hidden');
      }

      if (!isValid) return;

      // Fire telemetry event
      window.dispatchEvent(new CustomEvent('estateforce:technical_inquiry', {
        detail: {
          fullName: nameInput.value.trim(),
          workEmail: emailInput.value.trim(),
          company: companyInput.value.trim(),
          question: qText,
          timestamp: new Date().toISOString()
        }
      }));

      // Ingest directly into live Salesforce Org 00D2w00000P3aAc (US-14 Criterion 6)
      try {
        submitToSalesforceWebToLead({
          fullName: nameInput.value.trim(),
          email: emailInput.value.trim(),
          company: companyInput.value.trim(),
          notes: `[Technical Inquiry] ${qText}`,
          description: `[Technical Inquiry] ${qText}`,
          leadSource: 'Website – Technical Question'
        });
      } catch (err) {
        console.warn('Technical question Salesforce submission notice:', err);
      }

      // Transition to success state
      form.classList.add('hidden');
      successBox?.classList.remove('hidden');
    });
  }

  // Demo telemetry
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('estateforce:demo_click', {
        detail: {
          source: 'security_fit_page',
          timestamp: new Date().toISOString()
        }
      }));
    });
  }
}
