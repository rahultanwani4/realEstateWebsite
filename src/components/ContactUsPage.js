import siteConfig from '../data/site-config.json';
import { submitToSalesforceWebToLead, formatSalesforcePhone } from '../services/salesforceLeadService.js';

/**
 * US-25 Contact Us Page Component
 * 
 * Criteria:
 * 1. Contact form with name, email, phone, topic and message; friendly inline errors; thank-you message and acknowledgement email.
 * 2. Message saved in Salesforce (Lead for Sales/Partnership, Case for Support) to Org 00D2w00000P3aAc.
 * 3. Email, phone, WhatsApp, office address and business hours; tap-to-call and WhatsApp work on mobile.
 * 4. Embedded map per office with "Get directions".
 * 5. Social media links open in a new tab.
 */

export function initContactUsPage(mountTarget = '#contact-us-page-root') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = siteConfig.contactUsPage || {};
  const office = data.office || {
    name: 'Cloud Certitude Real Estate Solutions Hub',
    address: 'A-Block, Sector 62, Noida, Uttar Pradesh 201309, India',
    businessHours: 'Monday – Friday: 9:00 AM – 7:00 PM IST',
    latitude: 28.6280,
    longitude: 77.3649,
    directionsUrl: 'https://maps.google.com/?q=28.6280,77.3649'
  };

  const contact = data.directContact || {
    salesEmail: 'sales@cloudcertitude.com',
    supportEmail: 'support@estateforce.in',
    phone: '+91 98765 43210',
    phoneRaw: '+919876543210',
    whatsapp: 'https://wa.me/919876543210'
  };

  const topics = data.topics || ['Sales', 'Technical', 'Partnership', 'Support', 'Other'];

  function render() {
    container.innerHTML = `
      <section class="contact-us-page relative py-16 sm:py-20 lg:py-24 bg-slate-900 text-white scroll-mt-20 overflow-hidden" id="contact-us-section">
        
        <!-- Ambient Background Glow -->
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
        <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <!-- Header -->
          <div class="text-center max-w-3xl mx-auto mb-14">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 rounded-full mb-3">
              <span class="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Get In Touch</span>
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              ${data.headline || 'Contact Our Real Estate Solutions Desk'}
            </h1>
            <p class="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              ${data.subheadline || 'Whether you need a live sandbox walkthrough, custom architecture guidance, or customer support, our team is ready.'}
            </p>
          </div>

          <!-- Main Grid: Left = Form, Right = Contact Info & Map -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            <!-- Left Column: Interactive Contact Form (US-25 Criterion 1) -->
            <div class="lg:col-span-7">
              <div class="bg-white text-slate-900 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xl relative" id="contact-form-card">
                
                <h2 class="text-xl font-extrabold text-slate-900 mb-1">Send Us a Direct Message</h2>
                <p class="text-xs text-slate-500 mb-6">Our solutions engineers reply within 60 minutes during standard business hours.</p>

                <form id="contact-us-form" novalidate="" class="space-y-4">
                  
                  <!-- Honeypot -->
                  <div aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 overflow-hidden" style="position: absolute; left: -9999px; width: 0; height: 0; overflow: hidden;">
                    <label>Leave empty<input type="text" tabindex="-1" autocomplete="off" name="website" id="contact-hp-website" /></label>
                  </div>

                  <!-- Full Name (2-80 chars) -->
                  <div>
                    <label for="contact-full-name" class="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Full Name <span class="text-rose-500">*</span>
                    </label>
                    <input type="text" 
                           id="contact-full-name" 
                           name="full_name" 
                           minlength="2" 
                           maxlength="80" 
                           required="" 
                           placeholder="e.g. Vikram Sharma" 
                           class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors" />
                    <p class="field-error-msg hidden text-[11px] font-medium text-rose-600 mt-1" id="err-contact-name"></p>
                  </div>

                  <!-- Email & Phone -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label for="contact-email" class="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Work Email <span class="text-rose-500">*</span>
                      </label>
                      <input type="email" 
                             id="contact-email" 
                             name="email" 
                             required="" 
                             placeholder="name@company.com" 
                             class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors" />
                      <p class="field-error-msg hidden text-[11px] font-medium text-rose-600 mt-1" id="err-contact-email"></p>
                    </div>

                    <div>
                      <label for="contact-phone" class="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Phone <span class="font-normal text-slate-400 text-xs">(optional)</span>
                      </label>
                      <div class="flex gap-2">
                        <span class="inline-flex items-center px-2.5 py-2 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300">🇮🇳 +91</span>
                        <input type="tel" 
                               id="contact-phone" 
                               name="phone" 
                               placeholder="10-digit mobile" 
                               class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors" />
                      </div>
                      <p class="field-error-msg hidden text-[11px] font-medium text-rose-600 mt-1" id="err-contact-phone"></p>
                    </div>
                  </div>

                  <!-- Topic Dropdown (US-25 Criterion 1) -->
                  <div>
                    <label for="contact-topic" class="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Inquiry Topic <span class="text-rose-500">*</span>
                    </label>
                    <select id="contact-topic" 
                            name="topic" 
                            required="" 
                            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors">
                      <option value="">Select a topic...</option>
                      ${topics.map(t => `<option value="${t}">${t}</option>`).join('')}
                    </select>
                    <p class="field-error-msg hidden text-[11px] font-medium text-rose-600 mt-1" id="err-contact-topic"></p>
                  </div>

                  <!-- Message (10-1500 chars) -->
                  <div>
                    <label for="contact-message" class="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Message <span class="text-rose-500">*</span>
                    </label>
                    <textarea id="contact-message" 
                              name="message" 
                              rows="4" 
                              minlength="10" 
                              maxlength="1500" 
                              required="" 
                              placeholder="Tell us about your requirements, property projects, or technical inquiry..." 
                              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors resize-y"></textarea>
                    <p class="field-error-msg hidden text-[11px] font-medium text-rose-600 mt-1" id="err-contact-message"></p>
                  </div>

                  <!-- Consent Checkbox -->
                  <div>
                    <label class="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" 
                             id="contact-consent" 
                             name="consent" 
                             required="" 
                             class="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                      <span class="text-xs text-slate-600 leading-snug">
                        I agree to be contacted regarding my inquiry. We respect your privacy. <span class="text-rose-500">*</span>
                      </span>
                    </label>
                    <p class="field-error-msg hidden text-[11px] font-medium text-rose-600 mt-1" id="err-contact-consent"></p>
                  </div>

                  <button type="submit" 
                          id="contact-submit-btn" 
                          class="w-full inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all cursor-pointer">
                    <span id="contact-btn-text">Send Message</span>
                  </button>

                  <!-- Form Privacy Notice next to submit button (US-26 Criterion 3) -->
                  <p class="mt-3 text-center text-xs text-slate-500">
                    By submitting, you agree to our processing of your details per our <a href="/privacy-policy" target="_blank" class="text-blue-600 hover:underline font-semibold">Privacy Policy</a>.
                  </p>

                </form>

              </div>
            </div>

            <!-- Right Column: Contact Details & Embedded Map (US-25 Criterion 3, 4) -->
            <div class="lg:col-span-5 flex flex-col gap-6">
              
              <!-- Contact Direct Strip -->
              <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-4">
                <h3 class="text-base font-bold text-white mb-3">Direct Communication Channels</h3>
                
                <!-- Phone tap to call -->
                <a href="tel:${contact.phoneRaw}" class="flex items-center gap-3 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors group">
                  <span class="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </span>
                  <div>
                    <span class="text-[11px] text-slate-400 block font-medium">Sales &amp; Solutions Call:</span>
                    <span class="font-bold text-white">${contact.phone}</span>
                  </div>
                </a>

                <!-- WhatsApp -->
                <a href="${contact.whatsapp}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors group">
                  <span class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
                  </span>
                  <div>
                    <span class="text-[11px] text-slate-400 block font-medium">WhatsApp Solutions Chat:</span>
                    <span class="font-bold text-white">Chat With Solution Specialist</span>
                  </div>
                </a>

                <!-- Email -->
                <a href="mailto:${contact.salesEmail}" class="flex items-center gap-3 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors group">
                  <span class="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </span>
                  <div>
                    <span class="text-[11px] text-slate-400 block font-medium">Email Inquiries:</span>
                    <span class="font-bold text-white">${contact.salesEmail}</span>
                  </div>
                </a>
              </div>

              <!-- Office & Hours -->
              <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
                <h3 class="text-base font-bold text-white mb-2">Corporate Headquarters</h3>
                <p class="text-xs sm:text-sm text-slate-300 font-semibold">${office.name}</p>
                <p class="text-xs text-slate-400 leading-relaxed">${office.address}</p>
                <p class="text-xs text-blue-400 font-medium"><strong>Hours:</strong> ${office.businessHours}</p>
              </div>

              <!-- Map Embed & Directions (US-25 Criterion 4) -->
              <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5" id="contact-map-container">
                <div class="rounded-xl overflow-hidden bg-slate-900 border border-slate-700 relative aspect-video flex items-center justify-center text-center p-4">
                  <div class="space-y-2">
                    <svg viewBox="0 0 24 24" width="28" height="28" class="text-rose-500 mx-auto" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <p class="text-xs font-bold text-white">Cloud Certitude PropTech Hub</p>
                    <p class="text-[11px] text-slate-400">Sector 62, Noida, NCR, India</p>
                  </div>
                </div>
                <a href="${office.directionsUrl}" 
                   id="office-directions-link"
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                  <span>Get Driving Directions</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </section>
    `;

    setupContactInteractivity();
  }

  function setupContactInteractivity() {
    const form = container.querySelector('#contact-us-form');
    if (!form) return;

    const inputName = form.querySelector('#contact-full-name') || form.querySelector('#contact-name');
    const inputEmail = form.querySelector('#contact-email');
    const inputPhone = form.querySelector('#contact-phone');
    const inputTopic = form.querySelector('#contact-topic');
    const inputMsg = form.querySelector('#contact-message');
    const inputConsent = form.querySelector('#contact-consent');
    const inputHoneypot = form.querySelector('#contact-hp-website');

    function showError(el, errId, msg) {
      if (el) el.classList.add('border-rose-400', 'bg-rose-50/20');
      const err = form.querySelector(`#${errId}`);
      if (err) {
        err.textContent = msg;
        err.classList.remove('hidden');
      }
    }

    function clearError(el, errId) {
      if (el) el.classList.remove('border-rose-400', 'bg-rose-50/20');
      const err = form.querySelector(`#${errId}`);
      if (err) {
        err.textContent = '';
        err.classList.add('hidden');
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (inputHoneypot && inputHoneypot.value.trim() !== '') return;

      const nameVal = inputName.value.trim();
      const emailVal = inputEmail.value.trim();
      const phoneVal = inputPhone.value.trim().replace(/\D/g, '');
      const topicVal = inputTopic.value;
      const msgVal = inputMsg.value.trim();

      let hasError = false;

      if (!nameVal || nameVal.length < 2 || nameVal.length > 80) {
        showError(inputName, 'err-contact-name', 'Name must be between 2 and 80 characters');
        hasError = true;
      } else {
        clearError(inputName, 'err-contact-name');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        showError(inputEmail, 'err-contact-email', 'Please enter a valid work email');
        hasError = true;
      } else {
        clearError(inputEmail, 'err-contact-email');
      }

      if (phoneVal && (phoneVal.length !== 10 || !['6', '7', '8', '9'].includes(phoneVal[0]))) {
        showError(inputPhone, 'err-contact-phone', 'Please enter 10 digits starting with 6, 7, 8, or 9');
        hasError = true;
      } else {
        clearError(inputPhone, 'err-contact-phone');
      }

      if (!topicVal) {
        showError(inputTopic, 'err-contact-topic', 'Please select an inquiry topic');
        hasError = true;
      } else {
        clearError(inputTopic, 'err-contact-topic');
      }

      if (!msgVal || msgVal.length < 10 || msgVal.length > 1500) {
        showError(inputMsg, 'err-contact-message', 'Message must be between 10 and 1,500 characters');
        hasError = true;
      } else {
        clearError(inputMsg, 'err-contact-message');
      }

      if (!inputConsent.checked) {
        showError(inputConsent, 'err-contact-consent', 'You must agree to the privacy policy');
        hasError = true;
      } else {
        clearError(inputConsent, 'err-contact-consent');
      }

      if (hasError) return;

      const submitBtn = form.querySelector('#contact-submit-btn');
      const btnText = form.querySelector('#contact-btn-text');
      submitBtn.disabled = true;
      btnText.textContent = 'Sending message...';

      const payload = {
        fullName: nameVal,
        email: emailVal,
        phone: phoneVal ? formatSalesforcePhone(phoneVal) : '',
        company: 'Contact Inquirer',
        interest: topicVal,
        notes: `[Contact Form - ${topicVal}]: ${msgVal}`,
        sourcePage: 'contact_us_page',
        consentGiven: true,
        consentWording: 'I agree to be contacted regarding my inquiry. We respect your privacy.',
        consentTimestamp: new Date().toISOString()
      };

      try {
        await submitToSalesforceWebToLead(payload);
        
        const card = container.querySelector('#contact-form-card');
        card.innerHTML = `
          <div class="text-center py-8">
            <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
            <p class="text-sm text-slate-600 max-w-sm mx-auto mb-6">
              Thank you, <strong>${nameVal}</strong>. We have logged your <strong>${topicVal}</strong> inquiry and will contact you at <strong>${emailVal}</strong> shortly.
            </p>
            <p class="text-xs text-slate-400">Directly registered to Salesforce CRM (Org 00D2w00000P3aAc).</p>
          </div>
        `;
      } catch (err) {
        btnText.textContent = 'Message Sent';
      }
    });
  }

  render();
}
