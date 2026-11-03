import { openImageLightbox } from './ImageLightbox.js';
import { scrollToSection } from '../utils/scrollHelper.js';

/**
 * Detailed Process Workflows and Salesforce Architecture for Core Modules
 */
export const processDetailsData = {
  'lead-management': {
    id: 'lead-management',
    title: 'Turn Every Enquiry into a Sales Opportunity',
    tag: 'Lead Management',
    badge: 'Enquiry Capture & Conversion',
    image: '/screenshots/real-estate-enquiry-dashboard.webp',
    imageAlt: 'Salesforce Real Estate New Enquiry Form with Customer Details and Project Interests',
    overview: 'A successful property sale starts with a well-managed enquiry. EstateForce gives your sales team a central place to capture prospective buyers, understand their requirements, and follow their progress from the first interaction through qualification and conversion.',
    keyMetrics: [
      { label: 'Capture Channels', value: 'Web & Walk-in' },
      { label: 'Customer Matching', value: 'Pre-Conversion' },
      { label: 'Qualification', value: 'Site-Visit Checks' }
    ],
    steps: [
      {
        step: '01',
        title: 'Capture Customer Enquiries',
        actor: 'Web Forms & Walk-in Desk',
        desc: 'Record enquiries received through website forms and walk-in interactions. Keep important customer details and enquiry sources together in one place, giving the sales team a clear starting point for every prospect.'
      },
      {
        step: '02',
        title: 'Keep Customers and Sales Teams Informed',
        actor: 'Automated Email Notifications',
        desc: 'Send acknowledgement emails to customers and notification emails to the assigned sales representative when an enquiry is created. When ownership changes, the new assignment can also be communicated so the responsible team member is aware of the enquiry.'
      },
      {
        step: '03',
        title: 'Guide Enquiries Through Qualification',
        actor: 'Qualification Engine & Checks',
        desc: 'Give sales teams a clear view of each enquiry’s progress through defined stages, from New and Follow-up to Qualified and Ready for Conversion. Process checks help maintain the required journey: a completed site visit is required before qualification, and a shortlisted project is required before an enquiry is ready for conversion.'
      },
      {
        step: '04',
        title: 'Identify Existing Customers and Convert',
        actor: 'Customer Matching & Conversion',
        desc: 'Before conversion, check for matching customer and contact records using available details such as mobile number, phone, company, and email. Where a match is found, the team can associate the enquiry with the existing record. Otherwise, the process can create the customer account and contact, along with a sales opportunity or offer, while carrying forward the shortlisted project interest.'
      }
    ],
    businessBenefits: [
      'Centralised visibility of customer enquiries and their progress.',
      'More consistent follow-up through customer and owner notifications.',
      'A structured qualification process supported by site-visit and project-shortlist requirements.',
      'Reduced duplicate customer records through matching checks before conversion.',
      'A smoother transition from enquiry management to the sales opportunity stage.'
    ]
  },
  'sales-management': {
    id: 'sales-management',
    title: 'Manage Every Customer Interaction with Confidence',
    tag: 'Sales Management',
    badge: 'Project & Visit Management',
    image: '/screenshots/project-add-on-dashboard.webp',
    imageAlt: 'Salesforce Project Add-On Dashboard with Site Visit History and Statuses',
    overview: 'Property buyers often compare more than one development before making a decision. EstateForce helps sales teams manage multiple project interests under a single customer enquiry, organise site visits, record outcomes, and take the next step towards an offer.',
    keyMetrics: [
      { label: 'Project Tracking', value: 'Multi-Project' },
      { label: 'Site Visits', value: 'Assigned & Tracked' },
      { label: 'Offer Creation', value: 'Post-Visit Enabled' }
    ],
    steps: [
      {
        step: '01',
        title: 'Track Interest Across Multiple Projects',
        actor: 'Multi-Project Association',
        desc: 'Associate multiple relevant projects with one enquiry instead of creating separate enquiries for the same buyer. Sales representatives can review the projects linked to a customer and keep each project interest organised.'
      },
      {
        step: '02',
        title: 'Schedule Visits and Assign the Responsible Representative',
        actor: 'Visit Scheduling & Calendar',
        desc: 'Arrange physical or virtual visits for a selected project. Capture the visit date and time, visit type, assigned site-visit representative, and customer preferences or remarks. Each visit remains associated with the relevant customer enquiry and project interest.'
      },
      {
        step: '03',
        title: 'Record Visit Outcomes',
        actor: 'Outcome & Feedback Tracking',
        desc: 'Update visits as completed, rescheduled, or cancelled. Record customer feedback and relevant remarks so the sales team has useful context for the next interaction. Rescheduling retains the visit history, while cancellation requires a reason to support clear record keeping.'
      },
      {
        step: '04',
        title: 'Move Interested Buyers Towards an Offer',
        actor: 'Offer Creation Engine',
        desc: 'When the offer-generation option is enabled for a completed visit, the system can create a sales opportunity or offer using the relevant customer, project, and ownership details. This helps the team continue the sales journey without having to recreate the information manually.'
      }
    ],
    businessBenefits: [
      'One customer enquiry can cover interest in multiple projects.',
      'Clear visibility of planned, completed, rescheduled, and cancelled visits.',
      'Better coordination through assigned visit representatives and recorded customer preferences.',
      'A consistent record of visit outcomes and follow-up context.',
      'A connected path from project interest and site visit to offer creation.'
    ]
  },
  'booking-management': {
    id: 'booking-management',
    title: 'Simplify Unit Selection and the Booking Journey',
    tag: 'Booking Management',
    badge: 'Inventory & Booking Operations',
    image: '/screenshots/salesforce-booking-form-record.webp',
    imageAlt: 'Salesforce Booking Form Record Page with Lifecycle Status Chevrons and Demands',
    overview: 'Once a buyer is ready to proceed, the booking process needs accurate inventory information, clear pricing, and reliable documentation. EstateForce connects unit selection, availability checks, additional charges, booking submission, payment-plan association, and customer letters in a structured workflow.',
    keyMetrics: [
      { label: 'Inventory Search', value: 'Project to Unit' },
      { label: 'Availability Checks', value: 'Pre-Booking Active' },
      { label: 'Transfers & Letters', value: 'Automated' }
    ],
    steps: [
      {
        step: '01',
        title: 'Find the Right Unit',
        actor: 'Project-to-Unit Hierarchy',
        desc: 'Browse inventory through a structured project, tower, floor, and unit selection process. Review relevant unit information such as unit type, carpet area, base sale price, and applicable tax details to support an informed selection.'
      },
      {
        step: '02',
        title: 'Check Availability Before Proceeding',
        actor: 'Availability & Hold Validation',
        desc: 'Validate that a unit is active and available before it is selected for a booking. The process also checks for existing booking records and token or pre-payment entries to help prevent the same unit from being reserved through overlapping transactions.'
      },
      {
        step: '03',
        title: 'Build a Clear Booking Cost',
        actor: 'Cost Aggregation & Pricing',
        desc: 'Add applicable parking and other project-related charges, such as configured amenities or maintenance-related costs. These amounts are brought into the overall offer calculation so the team can review the combined deal value.'
      },
      {
        step: '04',
        title: 'Submit or Transfer a Booking',
        actor: 'Submission & Unit Transfer',
        desc: 'On booking submission, create the booking application, update the unit’s booking status, and associate the customer with the selected payment plan. If a customer needs to move to another unit or tower, the booking transfer process supports cancellation of the previous booking, applicable transfer-fee calculation, payment reallocation, and reservation of the replacement unit.'
      },
      {
        step: '05',
        title: 'Generate Customer and Payment Milestone Documents',
        actor: 'Milestone & Demand Letter Engine',
        desc: 'Generate branded booking documents, including welcome, agreement, and allotment letters. Construction milestone demand letters can also be prepared with relevant milestone, due-date, payment-percentage, and bank-remittance information to support payment communication during project execution.'
      }
    ],
    businessBenefits: [
      'A guided inventory search from project through individual unit.',
      'Availability and existing-hold checks to help reduce duplicate booking risk.',
      'A consolidated view of base price, parking, and other applicable charges.',
      'A structured process for booking submission and unit transfers.',
      'Consistent, branded booking documents and construction milestone demand letters.'
    ]
  }
};

let activeModalEl = null;

/**
 * Opens the interactive Process Details Modal for a given module ID
 * @param {string} moduleId - 'lead-management' | 'sales-management' | 'booking-management'
 */
export function openProcessDetailsModal(moduleId) {
  const data = processDetailsData[moduleId];
  if (!data) return;

  if (activeModalEl) {
    activeModalEl.remove();
    activeModalEl = null;
  }

  const modal = document.createElement('div');
  modal.id = 'process-details-modal';
  modal.className = 'process-modal-backdrop';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', data.title);

  modal.innerHTML = `
    <div class="process-modal-dialog">
      <!-- Modal Header -->
      <div class="process-modal-header">
        <div class="process-modal-header-info">
          <div class="flex items-center gap-2">
            <span class="process-modal-badge">${data.badge}</span>
            <span class="process-modal-tag">${data.tag}</span>
          </div>
          <h2 class="process-modal-title">${data.title}</h2>
        </div>
        <button type="button" class="process-modal-close-btn" id="close-process-modal" aria-label="Close process details modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="process-modal-body">
        
        <!-- Live Interface Screenshot Card with Zoom -->
        <div class="process-modal-screen-card" id="process-screen-zoom-trigger" title="Click to view full screen">
          <img src="${data.image}" 
               alt="${data.imageAlt}" 
               class="process-modal-screen-img" 
               loading="eager" 
               decoding="async"
               fetchpriority="high" />
          <div class="process-modal-screen-overlay">
            <span class="process-modal-zoom-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Click for Full Resolution Screenshot</span>
            </span>
          </div>
        </div>

        <!-- Metrics Strip -->
        <div class="process-metrics-strip">
          ${data.keyMetrics.map(m => `
            <div class="process-metric-item">
              <p class="process-metric-val">${m.value}</p>
              <p class="process-metric-lbl">${m.label}</p>
            </div>
          `).join('')}
        </div>

        <!-- Overview Paragraph -->
        <p class="process-modal-overview">${data.overview}</p>

        <!-- Step-by-Step Execution Workflow -->
        <div class="process-workflow-section">
          <h3 class="process-workflow-heading">How the Process Works</h3>
          <div class="process-workflow-grid">
            ${data.steps.map(s => `
              <div class="process-step-card">
                <div class="process-step-header">
                  <span class="process-step-num">${s.step}</span>
                  <span class="process-step-actor">${s.actor}</span>
                </div>
                <h4 class="process-step-title">${s.title}</h4>
                <p class="process-step-desc">${s.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Business Benefits -->
        <div class="process-highlights-box">
          <h4 class="process-highlights-title">Business Benefits</h4>
          <ul class="process-highlights-list">
            ${(data.businessBenefits || []).map(b => `
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-600 shrink-0">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${b}</span>
              </li>
            `).join('')}
          </ul>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="process-modal-footer">
        <a href="#contact" class="btn-process-modal-demo" id="process-modal-request-demo">
          <span>Request Demo</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
        <button type="button" class="btn-process-modal-close" id="process-modal-secondary-close">
          <span>Close Details</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  activeModalEl = modal;

  // Handlers
  function closeModal() {
    if (activeModalEl) {
      activeModalEl.remove();
      activeModalEl = null;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    }
  }

  function handleKey(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  // Click triggers
  modal.querySelector('#close-process-modal')?.addEventListener('click', closeModal);
  modal.querySelector('#process-modal-secondary-close')?.addEventListener('click', closeModal);

  // Close when clicking backdrop outside dialog
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Lightbox zoom trigger
  modal.querySelector('#process-screen-zoom-trigger')?.addEventListener('click', () => {
    openImageLightbox(data.image, data.imageAlt);
  });

  // Demo CTA click
  modal.querySelector('#process-modal-request-demo')?.addEventListener('click', () => {
    closeModal();
    scrollToSection('contact');
  });

  document.addEventListener('keydown', handleKey);
}

// Prefetch process modal images in background on idle so modal opens instantly
if (typeof window !== 'undefined') {
  const prefetchModalScreens = () => {
    const list = [
      '/screenshots/real-estate-enquiry-dashboard.webp',
      '/screenshots/project-add-on-dashboard.webp',
      '/screenshots/salesforce-booking-form-record.webp'
    ];
    list.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prefetchModalScreens);
  } else {
    setTimeout(prefetchModalScreens, 1500);
  }
}
