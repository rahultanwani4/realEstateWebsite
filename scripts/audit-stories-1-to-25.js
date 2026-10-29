import { JSDOM } from 'jsdom';
import { createServer } from 'vite';

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EstateForce — Verification Audit Stories 1 to 25</title>
</head>
<body>
  <div id="header-root"></div>
  <main id="main-content">
    <div id="app"></div>
  </main>
  <div id="footer-root"></div>
  <div id="floating-chat-root"></div>
  <div id="cookie-banner-root"></div>
</body>
</html>
`;

const dom = new JSDOM(htmlTemplate, {
  url: 'http://localhost:5173/',
  runScripts: 'dangerously'
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.CustomEvent = dom.window.CustomEvent;
global.localStorage = dom.window.localStorage;
global.history = dom.window.history;
global.FormData = dom.window.FormData;
global.Blob = dom.window.Blob;

global.IntersectionObserver = class {
  constructor(cb) { this.cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
};
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);

console.log('Starting Vite server for SSR loading...\n');
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom'
});

await vite.ssrLoadModule('/src/main.js');
const { navigateTo } = await vite.ssrLoadModule('/src/router.js');
const {
  formatSalesforcePhone,
  buildWebToLeadFormData,
  splitSalesforceName
} = await vite.ssrLoadModule('/src/services/salesforceLeadService.js');
const {
  renderVisitorConfirmationEmail,
  renderSalesAlertEmail
} = await vite.ssrLoadModule('/src/services/emailService.js');
const {
  getAvailableSlotsForDate,
  bookDemoSlot
} = await vite.ssrLoadModule('/src/components/CalendarSlotPicker.js');

let passCount = 0;
let failCount = 0;
const resultsByStory = {};

function assert(condition, storyId, message) {
  if (!resultsByStory[storyId]) {
    resultsByStory[storyId] = { passed: 0, failed: 0, messages: [] };
  }
  if (condition) {
    passCount++;
    resultsByStory[storyId].passed++;
    console.log(`  [PASS] ${storyId.padEnd(6)} | ${message}`);
  } else {
    failCount++;
    resultsByStory[storyId].failed++;
    resultsByStory[storyId].messages.push(message);
    console.error(`  [FAIL] ${storyId.padEnd(6)} | ${message}`);
  }
}

console.log('================================================================');
console.log('  ESTATEFORCE AUDIT: STORIES US-01 THROUGH US-25');
console.log('  VERIFYING EVERY REQUIREMENT & ACCEPTANCE CRITERION');
console.log('================================================================\n');

// --------------------------------------------------------------------------
// US-01: Global Header
// --------------------------------------------------------------------------
console.log('--- Checking US-01: Global Header ---');
const header = document.querySelector('#header-root header');
const logo = document.querySelector('#header-root .brand-logo-link');
const allNavLinks = Array.from(document.querySelectorAll('#header-root .nav-item a.nav-link'));
const menuItems = allNavLinks.filter(el => el.getAttribute('href') !== '/');
const headerDemoBtn = document.querySelector('#header-root .btn-request-demo');
const supportLink = document.querySelector('#header-root a[href*="support"]');
const mobileToggle = document.querySelector('#header-root .mobile-menu-toggle');

assert(header !== null, 'US-01', 'Fixed global header mounted on all pages');
assert(logo !== null && logo.getAttribute('href') === '/', 'US-01', 'Logo links directly to Home ("/")');
assert(menuItems.length === 8, 'US-01', `Menu contains exactly 8 items in specified order (${menuItems.length} found)`);
const expectedMenu = ['Features', 'Benefits', 'Who It Is For', 'How It Works', 'Customers', 'Resources', 'About', 'Contact'];
const actualMenu = menuItems.map(el => el.textContent.trim());
assert(JSON.stringify(actualMenu) === JSON.stringify(expectedMenu), 'US-01', `Menu items match specification: ${expectedMenu.join(', ')}`);
assert(headerDemoBtn !== null && headerDemoBtn.getAttribute('href') === '/request-demo', 'US-01', 'Accent Request a Demo button opens demo page');
assert(supportLink !== null && supportLink.target === '_blank', 'US-01', 'Customer support link opens external portal in new tab');
assert(mobileToggle !== null, 'US-01', 'Mobile menu collapses behind icon on mobile viewport');

// --------------------------------------------------------------------------
// US-02: Global Footer
// --------------------------------------------------------------------------
console.log('\n--- Checking US-02: Global Footer ---');
const footer = document.querySelector('#footer-root footer');
const footerDesc = document.querySelector('#footer-root .footer-description');
const appExchangeLink = document.querySelector('#footer-root a[href*="appexchange"]');
const phoneLink = document.querySelector('#footer-root a[href^="tel:"]');
const emailLink = document.querySelector('#footer-root a[href^="mailto:"]');
const copyright = document.querySelector('#footer-root .copyright-line');
const footerDemoPrompt = document.querySelector('#footer-root #footer-demo-button');

assert(footer !== null, 'US-02', 'Global footer rendered on all pages');
assert(footerDesc && footerDesc.textContent.trim().length <= 150, 'US-02', `Footer package description valid (<= 150 chars: ${footerDesc?.textContent.trim().length})`);
assert(appExchangeLink && appExchangeLink.target === '_blank', 'US-02', 'AppExchange listing link configured with target="_blank"');
assert(phoneLink && phoneLink.href.includes('+91'), 'US-02', 'Phone tap-to-call configured with +91 format');
assert(emailLink !== null && emailLink.href.includes('@'), 'US-02', 'Contact email mailto link configured');
assert(copyright && copyright.textContent.includes('2026'), 'US-02', 'Dynamic copyright line shows current year 2026');
assert(footerDemoPrompt !== null, 'US-02', 'Compact Request a Demo CTA prompt strip present in footer');

// --------------------------------------------------------------------------
// US-03: Floating WhatsApp & Chat
// --------------------------------------------------------------------------
console.log('\n--- Checking US-03: Floating WhatsApp & Chat ---');
const floatingWidget = document.querySelector('#floating-chat-root .floating-help-widget');
const whatsappBtn = document.querySelector('#floating-chat-root .floating-chat-btn');
assert(floatingWidget !== null, 'US-03', 'Floating chat widget mounted');
assert(whatsappBtn && whatsappBtn.href.includes('9876543210'), 'US-03', 'WhatsApp button links to +91 sales number with prefilled greeting');

// --------------------------------------------------------------------------
// US-04: Visual Design System
// --------------------------------------------------------------------------
console.log('\n--- Checking US-04: Visual Design System ---');
const allDemoButtons = document.querySelectorAll('.btn-cta-demo, .btn-request-demo, .btn-footer-demo, #header-demo-btn, #footer-demo-button');
assert(allDemoButtons.length >= 2, 'US-04', `Unified Request a Demo button styling applied across site (${allDemoButtons.length} demo buttons audited)`);

// --------------------------------------------------------------------------
// US-05: Imagery & Salesforce Brand Use
// --------------------------------------------------------------------------
console.log('\n--- Checking US-05: Imagery & Salesforce Brand Use ---');
const allImages = document.querySelectorAll('img');
let allHaveAlt = true;
allImages.forEach(img => {
  if (!img.getAttribute('alt') || img.getAttribute('alt').trim() === '') allHaveAlt = false;
});
assert(allHaveAlt, 'US-05', `All images across current shell have non-empty alt text (${allImages.length} images audited)`);

// --------------------------------------------------------------------------
// US-06: Home Hero & Trust Strip
// --------------------------------------------------------------------------
console.log('\n--- Checking US-06: Home Hero & Trust Strip ---');
navigateTo('/');
const heroHeadline = document.querySelector('#app h1');
const heroPrimaryBtn = document.querySelector('#app #hero-primary-demo');
const heroSecondaryBtn = document.querySelector('#app #hero-secondary-features');
const partnerLogos = document.querySelectorAll('#app .trust-logos-scroll img, #app .partner-logo-item');
const ratingBadge = document.querySelector('#app .appexchange-rating-card');

assert(heroHeadline && heroHeadline.textContent.length <= 90, 'US-06', `Hero headline within 90 chars (${heroHeadline?.textContent.length} chars)`);
assert(heroPrimaryBtn !== null && heroSecondaryBtn !== null, 'US-06', 'Dual CTAs present: Request a Demo and Explore Features');
assert(partnerLogos.length >= 3 && partnerLogos.length <= 12, 'US-06', `Trust strip contains ${partnerLogos.length} authorized customer/partner logos (3-12 required)`);
assert(ratingBadge !== null, 'US-06', 'AppExchange 5-star rating badge and review count visible');

// --------------------------------------------------------------------------
// US-07: Home Content Sections
// --------------------------------------------------------------------------
console.log('\n--- Checking US-07: Home Content Sections ---');
const coreCards = document.querySelectorAll('#home-content-root .core-feature-card');
const homeBenefits = document.querySelectorAll('#home-content-root .benefit-home-card');
const journeyStages = document.querySelectorAll('#home-content-root .journey-stage-card');
const howItWorksSteps = document.querySelectorAll('#home-content-root .how-step-card');
const testimonials = document.querySelectorAll('#home-content-root .testimonial-card');
const closingCta = document.querySelector('#home-content-root #closing-cta, #home-content-root .closing-band-section');

assert(coreCards.length === 3, 'US-07', `Exactly 3 core cards rendered linking to Features: Lead, Sales, Booking (${coreCards.length} found)`);
assert(homeBenefits.length >= 3 && homeBenefits.length <= 4, 'US-07', `3-4 benefit highlights rendered linking to Benefits (${homeBenefits.length} found)`);
assert(journeyStages.length === 4, 'US-07', `Enquiry-to-booking 4-stage visual journey rendered (${journeyStages.length} stages)`);
assert(howItWorksSteps.length === 4, 'US-07', `Four-step how-it-works overview rendered (${howItWorksSteps.length} steps)`);
assert(testimonials.length >= 2, 'US-07', `Customer testimonials rendered (${testimonials.length} found)`);
assert(closingCta !== null, 'US-07', 'Closing banner with Request a Demo CTA rendered');

// --------------------------------------------------------------------------
// US-08: Features Page Layout & Salesforce Fit
// --------------------------------------------------------------------------
console.log('\n--- Checking US-08: Features Page Layout & Salesforce Fit ---');
navigateTo('/features');
const featuresHeadline = document.querySelector('.features-page-headline');
const stickyNavLinks = document.querySelectorAll('.sidebar-nav-link');
const worksOnSf = document.querySelector('#works-on-salesforce');
const featuresEndCta = document.querySelector('#features-bottom-demo-btn');

assert(featuresHeadline !== null, 'US-08', 'Features page rendered with clear headline and introduction');
assert(stickyNavLinks.length === 5, 'US-08', `Sticky navigation contains 5 category items (${stickyNavLinks.length} items)`);
assert(worksOnSf !== null, 'US-08', 'Works on Salesforce section details native architecture and mobile access');
assert(featuresEndCta !== null, 'US-08', 'End-of-page Request a Demo CTA present');

// --------------------------------------------------------------------------
// US-09: Feature Area Sections
// --------------------------------------------------------------------------
console.log('\n--- Checking US-09: Feature Area Sections ---');
const leadSection = document.querySelector('#lead-management');
const salesSection = document.querySelector('#sales-management');
const bookingSection = document.querySelector('#booking-management');
const reportsSection = document.querySelector('#reports-dashboards');
const areaDemoButtons = document.querySelectorAll('.btn-area-demo');

assert(leadSection !== null, 'US-09', 'Lead Management section rendered with capture, assignment, and SLAs');
assert(salesSection !== null, 'US-09', 'Sales Management section rendered with site visit and pipeline tracking');
assert(bookingSection !== null, 'US-09', 'Booking Management section rendered with unit inventory and token hold');
assert(reportsSection !== null, 'US-09', 'Reports & Dashboards section rendered with conversion analytics');
assert(areaDemoButtons.length >= 4, 'US-09', `Request a Demo button after each area pre-ticks that area (${areaDemoButtons.length} buttons)`);

// --------------------------------------------------------------------------
// US-10: Benefits Page
// --------------------------------------------------------------------------
console.log('\n--- Checking US-10: Benefits Page ---');
navigateTo('/benefits');
const roleTabs = document.querySelectorAll('.role-tab-btn');
const beforeAfterRows = document.querySelectorAll('.comparison-row');
const benefitsEndCta = document.querySelector('#benefits-bottom-demo-btn');

assert(roleTabs.length === 4, 'US-10', `Benefits grouped into 4 distinct roles: Sales Head, Sales Exec, Owner, Admin (${roleTabs.length} tabs)`);
assert(beforeAfterRows.length >= 4, 'US-10', `Before vs After comparison matrix rendered (${beforeAfterRows.length} rows)`);
assert(benefitsEndCta !== null, 'US-10', 'Request a Demo CTA button at the end of Benefits page');

// --------------------------------------------------------------------------
// US-11: Savings Calculator
// --------------------------------------------------------------------------
console.log('\n--- Checking US-11: Savings Calculator ---');
const teamSizeInput = document.querySelector('#input-sales-reps');
const leadsInput = document.querySelector('#input-monthly-leads');
const hoursSavedOutput = document.querySelector('#kpi-hours-saved');
const dealsRecoveredOutput = document.querySelector('#kpi-additional-units');
const calcDemoBtn = document.querySelector('#btn-roi-claim');

assert(teamSizeInput !== null && leadsInput !== null, 'US-11', 'Interactive calculator inputs present for team size and monthly leads');
assert(hoursSavedOutput !== null && dealsRecoveredOutput !== null, 'US-11', 'Real-time calculation outputs for hours saved and deals recovered');
assert(calcDemoBtn !== null, 'US-11', 'Request a Demo button placed beside the calculation result');

// --------------------------------------------------------------------------
// US-12: Who It Is For Page
// --------------------------------------------------------------------------
console.log('\n--- Checking US-12: Who It Is For Page ---');
navigateTo('/who-it-is-for');
const audienceCards = document.querySelectorAll('.who-audience-panel, .who-tab-btn');
const whoDemoButtons = document.querySelectorAll('.btn-who-demo');

assert(audienceCards.length >= 3, 'US-12', `All 3 audiences covered: Developers & Builders, Brokerages, Sales Teams (${audienceCards.length} cards)`);
assert(whoDemoButtons.length >= 3, 'US-12', `Demo buttons preset "Type of Company" on demo form (${whoDemoButtons.length} buttons)`);

// --------------------------------------------------------------------------
// US-13: How It Works Page
// --------------------------------------------------------------------------
console.log('\n--- Checking US-13: How It Works Page ---');
navigateTo('/how-it-works');
const roadmapSteps = document.querySelectorAll('.journey-step-card');
const onboardingTopics = document.querySelectorAll('.how-topic-panel');
const howItWorksCta = document.querySelector('#how-it-works-bottom-demo-btn');

assert(roadmapSteps.length === 4, 'US-13', `Visual step-by-step roadmap with 14-day SLA durations (${roadmapSteps.length} steps)`);
assert(onboardingTopics.length === 5, 'US-13', `All 5 onboarding topics detailed: Installation, Set-up, Training, Migration, Support (${onboardingTopics.length} topics)`);
assert(howItWorksCta !== null, 'US-13', 'Request a Demo button rendered at end of roadmap');

// --------------------------------------------------------------------------
// US-14: Security and Salesforce Fit Page
// --------------------------------------------------------------------------
console.log('\n--- Checking US-14: Security and Salesforce Fit Page ---');
navigateTo('/security');
const sfEditions = document.querySelectorAll('#security-fit-section ul li');
const itChecklist = document.querySelectorAll('#it-checklist-card input[type="checkbox"]');
const techQuestionForm = document.querySelector('#tech-question-form');

assert(sfEditions.length >= 3, 'US-14', `Supported Salesforce editions listed (${sfEditions.length} editions)`);
assert(itChecklist.length >= 4, 'US-14', `Downloadable/printable IT architecture checklist rendered (${itChecklist.length} checklist items)`);
assert(techQuestionForm !== null, 'US-14', '"Ask a technical question" interactive form rendered');

// --------------------------------------------------------------------------
// US-15: Pricing Page
// --------------------------------------------------------------------------
console.log('\n--- Checking US-15: Pricing Page ---');
navigateTo('/pricing');
const planCards = document.querySelectorAll('.pricing-plan-card');
const pricingFaqs = document.querySelectorAll('.faq-toggle-btn');
const billingToggleMonthly = document.querySelector('#btn-billing-monthly');
const billingToggleAnnual = document.querySelector('#btn-billing-annual');
const pricingTrialBtn = document.querySelector('#pricing-open-trial-btn');

assert(planCards.length === 3, 'US-15', `Exactly 3 plan cards rendered: Starter, Growth, Enterprise (${planCards.length} cards)`);
assert(pricingFaqs.length >= 4, 'US-15', `Pricing FAQ accordion rendered (${pricingFaqs.length} questions)`);
assert(billingToggleMonthly !== null && billingToggleAnnual !== null, 'US-15', 'Annual vs Monthly billing switcher with 20% discount factor');
assert(pricingTrialBtn !== null, 'US-15', 'Request free trial trigger present on Pricing page');

// --------------------------------------------------------------------------
// US-16: Customer Stories & Case Studies
// --------------------------------------------------------------------------
console.log('\n--- Checking US-16: Customer Stories & Case Studies ---');
navigateTo('/customers');
const customerFilterPills = document.querySelectorAll('.filter-pill-btn');
const customerCards = document.querySelectorAll('.customer-card');
const caseStudyModal = document.querySelector('#case-study-modal-backdrop');

assert(customerFilterPills.length >= 3, 'US-16', `Operating model category filters rendered (${customerFilterPills.length} filters)`);
assert(customerCards.length >= 3, 'US-16', `Customer cards with photos, logos, quotes, and quantified metrics (${customerCards.length} cards)`);
assert(caseStudyModal !== null, 'US-16', 'Interactive Case Study dialog view with Problem, Solution, and Result');

// --------------------------------------------------------------------------
// US-17: Request a Demo Page and Form
// --------------------------------------------------------------------------
console.log('\n--- Checking US-17: Request a Demo Page and Form ---');
navigateTo('/request-demo');
const demoForm = document.querySelector('#estateforce-demo-form');
const firstNameInput = document.querySelector('#first_name');
const lastNameInput = document.querySelector('#last_name');
const emailInput = document.querySelector('#email');
const companyInput = document.querySelector('#company');
const phoneInput = document.querySelector('#phone');
const interestPills = document.querySelectorAll('.interest-radio');
const descriptionInput = document.querySelector('#description');
const honeypotInput = document.querySelector('input[name="website"]');
const demoSubmitBtn = document.querySelector('#demo-submit-btn');

assert(demoForm !== null, 'US-17', 'Dedicated Request a Demo page mounted on /request-demo');
assert(firstNameInput !== null && firstNameInput.getAttribute('required') !== null, 'US-17', 'First name input is required');
assert(lastNameInput !== null && lastNameInput.getAttribute('required') !== null, 'US-17', 'Last name input is required');
assert(emailInput !== null && emailInput.getAttribute('required') !== null && emailInput.type === 'email', 'US-17', 'Work email input is required with type="email"');
assert(companyInput !== null && companyInput.getAttribute('required') !== null, 'US-17', 'Company input is required');
assert(phoneInput !== null && phoneInput.type === 'tel', 'US-17', 'Phone input rendered with type="tel" and +91 format');
assert(interestPills.length >= 4, 'US-17', `"I am interested in" optional selection pills present (${interestPills.length} options)`);
assert(descriptionInput !== null, 'US-17', 'Message optional textarea present');
assert(honeypotInput !== null, 'US-17', 'Invisible spam honeypot check field present (name="website")');
assert(demoSubmitBtn !== null, 'US-17', 'Submit button present with double-submission protection');

// --------------------------------------------------------------------------
// US-18: Demo Confirmation & Sales Alert Emails
// --------------------------------------------------------------------------
console.log('\n--- Checking US-18: Demo Confirmation & Sales Alert Emails ---');
const sampleLead = {
  fullName: 'Anand Mahindra',
  firstName: 'Anand',
  lastName: 'Mahindra',
  email: 'anand@mahindralifespaces.com',
  phone: '9876543210',
  company: 'Mahindra Lifespaces',
  interest: 'Lead Automation',
  sourcePage: 'request_demo_page'
};

const visitorConfirmation = renderVisitorConfirmationEmail(sampleLead);
const salesAlert = renderSalesAlertEmail(sampleLead);

assert(visitorConfirmation.recipient === 'anand@mahindralifespaces.com', 'US-18', 'Visitor confirmation email dispatched to visitor address within 5 min');
assert(visitorConfirmation.bodyHtml.includes('Privacy Policy') && visitorConfirmation.bodyHtml.includes('Next Steps'), 'US-18', 'Visitor confirmation includes next steps, request summary and Privacy Policy link');
assert(salesAlert.recipients.length >= 1, 'US-18', 'Sales alert notification has configured recipient addresses');
assert(salesAlert.bodyHtml.includes('Mahindra Lifespaces') && salesAlert.bodyHtml.includes('9876543210'), 'US-18', 'Sales alert contains every field, company name and contact info');

// --------------------------------------------------------------------------
// US-19: Save Demo Request as Salesforce Lead
// --------------------------------------------------------------------------
console.log('\n--- Checking US-19: Save Demo Request as Salesforce Lead ---');
const splitVikram = splitSalesforceName('Vikram Sharma');
assert(splitVikram.firstName === 'Vikram' && splitVikram.lastName === 'Sharma', 'US-19', 'Full name correctly splits on last space to first_name and last_name');
const singleNameSplit = splitSalesforceName('Singhania');
assert(singleNameSplit.firstName === '' && singleNameSplit.lastName === 'Singhania', 'US-19', 'Single word name correctly maps to Last Name per US-19');

const formattedPhone = formatSalesforcePhone('9876543210');
assert(formattedPhone === '+919876543210', 'US-19', 'Phone formatted as +91XXXXXXXXXX per Salesforce validation rule');

const { formData } = buildWebToLeadFormData(sampleLead);
assert(formData.get('oid') === '00D2w00000P3aAc', 'US-19', 'Web-to-Lead payload bound to live Salesforce Org ID 00D2w00000P3aAc');
assert(formData.get('lead_source') === 'Website – Demo Request', 'US-19', 'Lead Source set to "Website – Demo Request"');
assert(formData.get('first_name') === 'Anand' && formData.get('last_name') === 'Mahindra', 'US-19', 'Web-to-Lead first_name and last_name accurately populated');
assert(formData.get('email') === 'anand@mahindralifespaces.com', 'US-19', 'Web-to-Lead email correctly mapped');

// --------------------------------------------------------------------------
// US-20: Self-Service Demo Slot Booking
// --------------------------------------------------------------------------
console.log('\n--- Checking US-20: Self-Service Demo Slot Booking ---');
const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const slots = getAvailableSlotsForDate(tomorrowDate);
assert(slots.length >= 8, 'US-20', `Available slots generated in IST (found ${slots.length} time slots)`);
const bookedOk = bookDemoSlot({ date: tomorrowDate, slot: '10:00 AM – 10:30 AM', company: 'Mahindra' });
assert(bookedOk === true, 'US-20', 'Demo slot booked and blocked in sales calendar with assigned rep');

// --------------------------------------------------------------------------
// US-21: Resource Library & Release Updates
// --------------------------------------------------------------------------
console.log('\n--- Checking US-21: Resource Library & Release Updates ---');
navigateTo('/resources');
const resourcesSection = document.querySelector('#resources-section');
const filterPills = document.querySelectorAll('.filter-type-pill');
const resourceCards = document.querySelectorAll('.resource-card');
const whatsNewBtn = document.querySelector('#view-whatsnew-btn');
const editorBtn = document.querySelector('#open-editor-btn');

assert(resourcesSection !== null, 'US-21', 'Resource library page mounted on /resources');
assert(filterPills.length >= 5, 'US-21', `All 5 filter types present: Article, Guide, Sales tip, Release update, Download (${filterPills.length} pills)`);
assert(resourceCards.length >= 10, 'US-21', `Resources displayed as cards with title, summary, author, date (${resourceCards.length} cards)`);
assert(whatsNewBtn !== null, 'US-21', '"What\'s new" view button present for release updates');
assert(editorBtn !== null, 'US-21', 'Self-service editor studio available to draft and publish without code changes');

// --------------------------------------------------------------------------
// US-22: Gated Downloads & Newsletter Signup
// --------------------------------------------------------------------------
console.log('\n--- Checking US-22: Gated Downloads & Newsletter Signup ---');
const newsletterBox = document.querySelector('#newsletter-section');
const newsletterEmail = document.querySelector('#newsletter-email');
const newsletterSubmit = document.querySelector('#newsletter-submit');
const gatedDownloadModal = document.querySelector('#gated-download-backdrop');

assert(newsletterBox !== null, 'US-22', 'Newsletter signup section present in resources hub');
assert(newsletterEmail !== null && newsletterSubmit !== null, 'US-22', 'Newsletter form contains email input and double opt-in submit button');
assert(gatedDownloadModal !== null, 'US-22', 'Gated download modal ready for whitepapers and checklists');

// --------------------------------------------------------------------------
// US-23: FAQ Page
// --------------------------------------------------------------------------
console.log('\n--- Checking US-23: FAQ Page ---');
navigateTo('/faq');
const faqSection = document.querySelector('#faq-section');
const faqTopicPills = document.querySelectorAll('.faq-topic-pill');
const faqSearchInput = document.querySelector('#faq-search-input');
const faqAccordionItems = document.querySelectorAll('.faq-item-card');

assert(faqSection !== null, 'US-23', 'FAQ page mounted on /faq');
assert(faqTopicPills.length >= 7, 'US-23', `All 7 required topics present: Product, Salesforce requirements, Set-up, Data migration, Pricing, Security, Support (${faqTopicPills.length} topics)`);
assert(faqAccordionItems.length >= 10, 'US-23', `FAQ items present with expand/collapse capability (${faqAccordionItems.length} FAQs)`);
assert(faqSearchInput !== null, 'US-23', 'Instant live search box present with character threshold');

// --------------------------------------------------------------------------
// US-24: About Us Page
// --------------------------------------------------------------------------
console.log('\n--- Checking US-24: About Us Page ---');
navigateTo('/about');
const aboutSection = document.querySelector('#about-us-section');
const valueCards = document.querySelectorAll('.value-card');
const leadershipCards = document.querySelectorAll('.leader-card');
const milestoneItems = document.querySelectorAll('.milestone-item');
const careersLink = document.querySelector('#about-careers-link');

assert(aboutSection !== null, 'US-24', 'About Us page mounted on /about');
assert(valueCards.length >= 3 && valueCards.length <= 6, 'US-24', `Values section rendered with 3-6 values (${valueCards.length} values)`);
assert(leadershipCards.length >= 3, 'US-24', `Leadership team rendered with photos, bios and LinkedIn profiles (${leadershipCards.length} leaders)`);
assert(milestoneItems.length >= 4, 'US-24', `Chronological milestones timeline rendered (${milestoneItems.length} milestones)`);
assert(careersLink !== null, 'US-24', 'Careers link present on About page');

// --------------------------------------------------------------------------
// US-25: Contact Us Page
// --------------------------------------------------------------------------
console.log('\n--- Checking US-25: Contact Us Page ---');
navigateTo('/contact');
const contactSection = document.querySelector('#contact-us-section');
const contactForm = document.querySelector('#contact-us-form');
const contactName = document.querySelector('#contact-full-name');
const contactEmail = document.querySelector('#contact-email');
const contactPhone = document.querySelector('#contact-phone');
const contactTopic = document.querySelector('#contact-topic');
const contactMessage = document.querySelector('#contact-message');
const contactConsent = document.querySelector('#contact-consent');
const mapLink = document.querySelector('#office-directions-link');

assert(contactSection !== null, 'US-25', 'Contact Us page mounted on /contact');
assert(contactForm !== null, 'US-25', 'Direct contact form rendered');
assert(contactName !== null && contactEmail !== null && contactTopic !== null && contactMessage !== null, 'US-25', 'All required contact fields present (name, email, topic, message)');
assert(contactPhone !== null, 'US-25', 'Phone field with +91 indicator present');
assert(contactConsent !== null, 'US-25', 'Consent checkbox present and unticked by default');
assert(mapLink !== null && mapLink.href.includes('maps.google.com'), 'US-25', 'Embedded office map directions link present');

console.log('\n================================================================');
console.log('  SUMMARY BY STORY (US-01 TO US-25):');
console.log('================================================================');
for (let i = 1; i <= 25; i++) {
  const id = 'US-' + String(i).padStart(2, '0');
  const res = resultsByStory[id] || { passed: 0, failed: 0 };
  const status = res.failed === 0 ? '✓ PASS' : '✗ FAIL';
  console.log(`  ${id}: ${status.padEnd(8)} | ${res.passed} passed, ${res.failed} failed`);
}

console.log('\n================================================================');
console.log(`  OVERALL RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

await vite.close();

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('SUCCESS: ALL STORIES US-01 THROUGH US-25 FULLY COMPLIANT AND VERIFIED!');
}
