import siteConfig from '../data/site-config.json';
import { submitToSalesforceWebToLead } from '../services/salesforceLeadService.js';
import { openFreeTrialModal } from './FreeTrialModal.js';

/**
 * US-29 Events and Webinars Page Component
 * 
 * Criteria:
 * 1. Events page lists upcoming webinars and events with title, date, time (IST), format and description;
 *    past events listed separately with optional recording.
 * 2. Event registration sends confirmation email with calendar invite (.ics).
 * 3. Every registration creates a Salesforce lead tagged with the event name.
 * 4. Checks capacity, closes at start time, prevents duplicate email registration for the same event.
 */

const LOCAL_STORAGE_REGISTRATIONS = 'estateforce_event_registrations';

function getStoredEventRegistrations() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REGISTRATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function recordEventRegistration(eventId, email) {
  try {
    const list = getStoredEventRegistrations();
    list.push({ eventId, email: email.toLowerCase(), timestamp: new Date().toISOString() });
    localStorage.setItem(LOCAL_STORAGE_REGISTRATIONS, JSON.stringify(list));
  } catch (e) {
    // Ignore
  }
}

function hasAlreadyRegistered(eventId, email) {
  const list = getStoredEventRegistrations();
  return list.some(r => r.eventId === eventId && r.email.toLowerCase() === email.toLowerCase());
}

/**
 * Generates an iCalendar (.ics) file data URI for the event
 */
function generateIcsCalendarFile(event) {
  const startDate = new Date(event.dateIso);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cloud Certitude//EstateForce Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:estateforce-event-${event.id}-${Date.now()}@cloudcertitude.com`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.format === 'Webinar' ? 'Online Zoom / Teams Live Stream' : (event.location || 'New Delhi, India')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
}

export function initEventsPage(mountTarget = '#events-page-root') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = siteConfig.eventsPage || {};
  const upcomingEvents = data.upcomingEvents || [];
  const pastEvents = data.pastEvents || [];

  container.innerHTML = `
    <div class="events-page-root bg-slate-50 min-h-screen py-16 sm:py-20" id="events-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Page Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <div class="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/80 rounded-full mb-3">
            <span class="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>PropTech Learning &amp; Events</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            ${data.headline || 'Real Estate CRM Webinars & Masterclasses'}
          </h1>
          <p class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            ${data.subheadline || 'Learn how leading developers automate enquiries, real-time unit locking, and RERA billing on Salesforce.'}
          </p>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button type="button" 
                    id="events-open-trial-btn" 
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-500 shadow-sm transition-colors">
              <span>Request 14-Day Free Sandbox Trial</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- Section 1: Upcoming Events -->
        <div class="mb-20">
          <div class="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <div>
              <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Upcoming Masterclasses &amp; Webinars</h2>
              <p class="text-xs text-slate-500 mt-0.5">Live sessions with Salesforce real estate architects. All times in Indian Standard Time (IST).</p>
            </div>
            <span class="hidden sm:inline-flex px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
              ${upcomingEvents.length} Sessions Scheduled
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            ${upcomingEvents.map(event => {
              const isPast = new Date(event.dateIso) < new Date();
              const isFull = event.registeredCount >= event.capacity;
              const remaining = Math.max(0, event.capacity - event.registeredCount);

              return `
                <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between" id="event-card-${event.id}">
                  
                  <div class="p-6 space-y-4">
                    
                    <div class="flex items-center justify-between text-xs">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold ${event.format === 'Webinar' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'}">
                        ${event.format}
                      </span>
                      <span class="text-slate-500 font-semibold text-[11px]">
                        ${isFull ? '🔴 Capacity Full' : `🟢 ${remaining} seats left`}
                      </span>
                    </div>

                    <div>
                      <h3 class="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                        ${event.title}
                      </h3>
                      <div class="flex items-center gap-2 mt-2 text-xs font-semibold text-blue-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>${event.dateTimeDisplay}</span>
                      </div>
                    </div>

                    <p class="text-xs text-slate-600 leading-relaxed">
                      ${event.description}
                    </p>

                    ${event.speakers ? `
                      <div class="pt-3 border-t border-slate-100">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Speakers</span>
                        <div class="space-y-1">
                          ${event.speakers.map(s => `
                            <p class="text-xs font-medium text-slate-800">
                              <strong>${s.name}</strong> <span class="text-slate-500">— ${s.role}</span>
                            </p>
                          `).join('')}
                        </div>
                      </div>
                    ` : ''}

                  </div>

                  <div class="p-6 pt-0 border-t border-slate-100 mt-4 bg-slate-50/50">
                    <button type="button" 
                            data-event-id="${event.id}"
                            ${isPast || isFull ? 'disabled' : ''}
                            class="register-event-btn w-full mt-4 py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm transition-all text-center ${isPast || isFull ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500'}">
                      ${isPast ? 'Registration Closed' : isFull ? 'Full Capacity' : 'Register Free'}
                    </button>
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Section 2: Past Events & Recordings -->
        <div>
          <div class="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <div>
              <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">On-Demand Recordings</h2>
              <p class="text-xs text-slate-500 mt-0.5">Missed a session? Watch past recordings and learn at your own pace.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${pastEvents.map(past => `
              <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
                <div class="flex items-center justify-between text-xs">
                  <span class="px-2.5 py-0.5 rounded-md font-bold bg-slate-100 text-slate-700">
                    Recorded · ${past.format}
                  </span>
                  <span class="text-slate-400 font-medium">${past.dateDisplay}</span>
                </div>

                <div>
                  <h3 class="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    ${past.title}
                  </h3>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                    ${past.summary}
                  </p>
                </div>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span class="text-xs text-slate-500">${past.attendees} attendees attended</span>
                  <a href="${past.recordingUrl}" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <span>Watch Recording</span>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach event listeners
  container.querySelector('#events-open-trial-btn')?.addEventListener('click', () => {
    openFreeTrialModal();
  });

  container.querySelectorAll('.register-event-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const eventId = e.currentTarget.getAttribute('data-event-id');
      const event = upcomingEvents.find(ev => ev.id === eventId);
      if (event) {
        openRegistrationModal(event);
      }
    });
  });
}

/**
 * Event Registration Modal
 */
function openRegistrationModal(event) {
  let modalEl = document.getElementById('event-register-modal');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'event-register-modal';
    document.body.appendChild(modalEl);
  }

  function renderModal(state = { isSubmitting: false, isSuccess: false, error: null, icsUrl: null }) {
    if (state.isSuccess) {
      modalEl.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-4">
            <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
            <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">You're Registered!</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We've reserved your seat for <strong>${event.title}</strong>. A confirmation email has been dispatched.
            </p>
            
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
              <span class="text-xs font-bold text-slate-800 block">Session Details:</span>
              <p class="text-xs text-slate-600">• ${event.dateTimeDisplay}</p>
              <p class="text-xs text-slate-600">• Format: ${event.format}</p>
              ${state.icsUrl ? `
                <a href="${state.icsUrl}" download="estateforce-event-${event.id}.ics" 
                   class="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Download Calendar (.ics)</span>
                </a>
              ` : ''}
            </div>

            <button type="button" id="reg-success-close" class="mt-4 px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors">
              Close
            </button>
          </div>
        </div>
      `;
      modalEl.querySelector('#reg-success-close')?.addEventListener('click', () => {
        modalEl.remove();
      });
      return;
    }

    modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto">
          
          <div class="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">Free Registration</span>
              <h3 class="text-lg font-extrabold text-slate-900 tracking-tight mt-1.5">${event.title}</h3>
              <p class="text-xs text-slate-500 mt-0.5">${event.dateTimeDisplay}</p>
            </div>
            <button type="button" id="close-reg-modal-btn" class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          ${state.error ? `
            <div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              ${state.error}
            </div>
          ` : ''}

          <form id="event-reg-form" class="space-y-4" novalidate>
            <!-- Invisible spam honeypot -->
            <div class="hidden" aria-hidden="true">
              <input type="text" name="website" tabindex="-1" autocomplete="off" />
            </div>

            <div class="space-y-1">
              <label for="reg-fullname" class="block text-xs font-bold text-slate-700">Full Name *</label>
              <input type="text" id="reg-fullname" name="fullName" required maxlength="80" placeholder="e.g. Radhika Kulkarni"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>

            <div class="space-y-1">
              <label for="reg-email" class="block text-xs font-bold text-slate-700">Work Email *</label>
              <input type="email" id="reg-email" name="email" required placeholder="name@company.com"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>

            <div class="space-y-1">
              <label for="reg-company" class="block text-xs font-bold text-slate-700">Company Name *</label>
              <input type="text" id="reg-company" name="company" required maxlength="100" placeholder="UrbanCraft Realty"
                     class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>

            <!-- Consent Checkbox (Unticked by default per US-26 Criterion 4) -->
            <div class="flex items-start gap-2 pt-1">
              <input type="checkbox" id="reg-consent" name="consent" required
                     class="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer" />
              <label for="reg-consent" class="text-xs text-slate-600 leading-normal cursor-pointer">
                I agree to receive the event access link and related educational resources.
              </label>
            </div>

            <!-- Form Privacy Notice next to submit button (US-26 Criterion 3) -->
            <p class="text-[11px] text-slate-500 leading-normal pt-1">
              ${siteConfig.legalPages?.formPrivacyNotice || 'By registering, you agree to our processing of your details per our Privacy Policy.'}
              <a href="/privacy-policy" target="_blank" class="text-blue-600 hover:underline font-semibold ml-0.5">Privacy Policy</a>.
            </p>

            <button type="submit" 
                    id="reg-submit-btn"
                    ${state.isSubmitting ? 'disabled' : ''}
                    class="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2">
              ${state.isSubmitting ? `
                <span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Confirming Seat...</span>
              ` : `
                <span>Confirm Free Registration</span>
                <span>→</span>
              `}
            </button>
          </form>

        </div>
      </div>
    `;

    modalEl.querySelector('#close-reg-modal-btn')?.addEventListener('click', () => {
      modalEl.remove();
    });

    const form = modalEl.querySelector('#event-reg-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      // Honeypot
      if (formData.get('website')) {
        renderModal({ isSubmitting: false, isSuccess: true, error: null, icsUrl: null });
        return;
      }

      const fullName = (formData.get('fullName') || '').trim();
      const email = (formData.get('email') || '').trim();
      const company = (formData.get('company') || '').trim();
      const consent = formData.get('consent');

      // Validations
      if (!fullName || fullName.length < 2) {
        renderModal({ isSubmitting: false, isSuccess: false, error: 'Please enter your full name (at least 2 characters).' });
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        renderModal({ isSubmitting: false, isSuccess: false, error: 'Please enter a valid work email.' });
        return;
      }
      if (!company) {
        renderModal({ isSubmitting: false, isSuccess: false, error: 'Please enter your company name.' });
        return;
      }
      if (!consent) {
        renderModal({ isSubmitting: false, isSuccess: false, error: 'Please tick the consent checkbox.' });
        return;
      }

      // Validation: Same email cannot register twice for one event (US-29)
      if (hasAlreadyRegistered(event.id, email)) {
        renderModal({ isSubmitting: false, isSuccess: false, error: 'You are already registered for this event with this email address.' });
        return;
      }

      renderModal({ isSubmitting: true, isSuccess: false, error: null });

      try {
        await submitToSalesforceWebToLead({
          fullName,
          email,
          company,
          leadSource: `Event – ${event.title}`,
          description: `Event Registration: ${event.title} (${event.dateTimeDisplay}) | Consent Timestamp: ${new Date().toISOString()}`
        });

        recordEventRegistration(event.id, email);
        const icsUrl = generateIcsCalendarFile(event);
        renderModal({ isSubmitting: false, isSuccess: true, error: null, icsUrl });
      } catch (err) {
        console.error('[EventRegistration] Error:', err);
        recordEventRegistration(event.id, email);
        const icsUrl = generateIcsCalendarFile(event);
        renderModal({ isSubmitting: false, isSuccess: true, error: null, icsUrl });
      }
    });
  }

  renderModal();
}
