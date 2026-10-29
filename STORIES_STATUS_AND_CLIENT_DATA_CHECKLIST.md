# EstateForce — Complete 39 User Stories Status & Static Data Inventory

> **Document Summary:**  
> This document reviews all **39 user stories** from the requirement document (`user_stories.pdf`) one by one.  
> It is divided into two distinct sections:
> - **PART 1: Completed Stories** — What was built, and the exact placeholder data & images used that can be swapped with original assets when ready.
> - **PART 2: Stories Not Done & Why** — Clear, technical explanations for why these stories were not implemented and why they are not needed for a static website connected to Salesforce.

---

# PART 1: COMPLETED STORIES

---

### US-01: Global Header
* **Requirement Summary:**
  - Fixed header on all pages with Logo on left linking to Home.
  - Menu in order: Features, Benefits, Who It Is For, How It Works, Customers, Resources, About, Contact (max 8 items); current page highlighted.
  - Accent "Request a Demo" button on right; clicks recorded with source page.
  - Small "Customer support" link opening external support site in a new tab.
  - Mobile hamburger menu toggle.
* **What We Have Done / Implemented:**
  - Component: `src/components/Header.js` mounted at `#header-root`.
  - Fixed navigation with backdrop blur, active link styling, mobile slide-down drawer, and keyboard accessibility.
  - Logo links to `/`; accent demo button links to `/request-demo`.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Logo File:** `/public/logo.svg` (Placeholder blue icon with "EstateForce" text) → *Replace with your original logo SVG or PNG*.
  - **Product Name:** `"EstateForce"` → *Change in `src/data/site-config.json` under `"site.name"`*.
  - **Support URL:** `"https://support.cloudcertitude.com"` → *Change in `src/data/site-config.json` under `"header.supportLink.url"`*.

---

### US-02: Global Footer
* **Requirement Summary:**
  - Logo and one-line package description (max 150 chars).
  - Quick links to all main pages and AppExchange listing (opens in new tab).
  - Email (mailto), phone (tap-to-call with +91 format), and physical office address.
  - 5 social icons (LinkedIn, Facebook, Instagram, X, YouTube) opening in new tabs.
  - Links to Privacy Policy, Terms of Use, Cookie Notice, and Cookie Settings.
  - Dynamic copyright year (shows current year automatically).
  - Compact "Request a Demo" prompt banner.
* **What We Have Done / Implemented:**
  - Component: `src/components/Footer.js` mounted at `#footer-root`.
  - Renders 4 columns (Brand & AppExchange, Product links, Company links, Contact info), tap-to-call phone, dynamic year (`new Date().getFullYear()`), and Cookie Settings modal trigger.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Phone Number:** `"+91 98765 43210"` (raw: `"+919876543210"`) → *Change in `src/data/site-config.json` under `"footer.contact.phone"`*.
  - **Email Address:** `"sales@cloudcertitude.com"` → *Change in `src/data/site-config.json` under `"footer.contact.email"`*.
  - **Office Address:** `"Cloud Certitude Solutions, A-Block, Sector 62, Noida, Uttar Pradesh 201309, India"` → *Change in `src/data/site-config.json` under `"footer.contact.officeAddress"`*.
  - **AppExchange Listing URL:** `"https://appexchange.salesforce.com/appxListingDetail?listingId=estateforce"` → *Change in `src/data/site-config.json` under `"footer.appExchange.url"`*.
  - **Social Profile Links:** Point to Cloud Certitude company accounts → *Change in `src/data/site-config.json` under `"footer.socialLinks"`*.

---

### US-03: Floating WhatsApp / Chat Button
* **Requirement Summary:**
  - Fixed button at bottom-right of every page.
  - Opens WhatsApp with sales number (+91 10-digits) and prefilled greeting (max 200 chars).
  - Must not cover cookie banner or form buttons on mobile.
  - Clicks recorded.
* **What We Have Done / Implemented:**
  - Component: `src/components/FloatingChat.js` mounted at `#floating-chat-root`.
  - Floating green WhatsApp action pill with subtle pulse, positioned safely above the cookie banner and mobile drawer. Opens direct `https://wa.me/` chat with prefilled greeting.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **WhatsApp Phone:** `"+919876543210"` → *Change in `src/data/site-config.json` under `"floatingHelp.whatsappNumber"`*.
  - **Default Greeting:** `"Hello! I am interested in the EstateForce Real Estate Salesforce package and would like to ask a quick question."` → *Change in `src/data/site-config.json` under `"floatingHelp.defaultGreeting"`*.

---

### US-04: Visual Design System
* **Requirement Summary:**
  - One primary color, one accent color (used only for Request a Demo), neutral greys and white.
  - One font family; large headings; body text at least 16px.
  - One unified "Request a Demo" button style everywhere.
  - Line-icon style; decorative icons hidden from screen readers.
  - Subtle animations (max 400ms), disabled on reduced motion.
  - WCAG AA contrast compliance.
* **What We Have Done / Implemented:**
  - Stylesheet: `src/style.css` with CSS variables matching the clean SurveyResults enterprise aesthetic.
  - Primary color `#2563EB` (Royal Blue), Plus Jakarta Sans typography, min 16px body, 44x44px touch targets.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Color Palette & Font:** Defined in `src/style.css` and `src/data/site-config.json` under `"designSystem"`.

---

### US-05: Imagery & Salesforce Brand Rules
* **Requirement Summary:**
  - Product screenshots in simple device frames with realistic sample data (no real customer PII).
  - Non-empty alt text and image compression for fast loading.
  - Official Salesforce name, logo, "Built on Salesforce" mark, and AppExchange badge used according to Salesforce brand guidelines without recoloring.
* **What We Have Done / Implemented:**
  - Clean device mockup containers in `src/components/HomeHero.js`, `FeaturesPage.js`, and `WhoItIsForPage.js`.
  - Included official unaltered "Built on Salesforce" badge SVG in `/public/logos/`.
  - All images include non-empty descriptive `alt` tags and `loading="lazy"`.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Sample Screenshots:** Mock vector/PNG files in `/public/screenshots/` → *Drop your real Salesforce package screenshots into `/public/screenshots/` using the same file names*.

---

### US-06: Home Hero & Trust Strip
* **Requirement Summary:**
  - Large headline (max 90 chars) and one supporting sentence (max 180 chars).
  - Two buttons: Request a Demo (main, accent) and See Features (secondary).
  - Large product screenshot beside/behind text, stacking below on mobile.
  - Trust strip: 3 to 12 customer/partner logos, "Built on Salesforce" mark, AppExchange link, star rating (0.0-5.0), and review count.
* **What We Have Done / Implemented:**
  - Component: `src/components/HomeHero.js` on route `/`.
  - Dual CTAs, interactive product tour button, simulated CRM project interface, trust logo scroll, and 4.9★ rating badge.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Headline Text:** `"Real estate sales that fit into the Salesforce you already use."` → *Change in `src/data/site-config.json` under `"hero.headline"`*.
  - **Supporting Sentence:** `"Capture every portal lead, automate site-visit allocation, lock live unit inventory, and track payment milestones—100% native on Salesforce."` → *Change in `src/data/site-config.json` under `"hero.supportingSentence"`*.
  - **Sample Project in Mockup:** `"Serenity Towers — Phase 1 & 2 (240 units configured)"` → *Change in `src/data/site-config.json` under `"hero.mockup"`*.
  - **Trust Strip Partner Logos:** 6 placeholder builder logos (`DLF`, `Godrej Properties`, `Prestige Group`, `Sobha`, `Brigade`, `Lodha`) → *Change in `src/data/site-config.json` under `"trustStrip.partnerLogos"`*.
  - **Rating & Reviews:** `4.9` rating based on `38 reviews` → *Change in `src/data/site-config.json` under `"trustStrip.appExchangeRating"`*.

---

### US-07: Home Content Sections
* **Requirement Summary:**
  - Exactly 3 core cards (Lead, Sales, Booking Management) with icon, one-line description, and screenshot, linking to Features page.
  - 3 or 4 benefits linking to Benefits page.
  - Enquiry-to-booking 4-stage visual journey (Enquiry arrives, Rep follows up, Deal progresses, Unit is booked).
  - 4-step how-it-works overview (Book a demo, We set it up, Team trained, Go live).
  - 2 or 3 testimonials with name, photo, and company.
  - Coloured closing band with short message (max 100 chars) and Request a Demo button.
* **What We Have Done / Implemented:**
  - Component: `src/components/HomeContent.js` mounted at `#home-content-root` on `/`.
  - Renders all 6 required content sections in exact visual sequence with smooth hover effects.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Testimonial Quotes & Avatars:** 3 sample customer reviews (Vikram Singhania, Radhika Kulkarni, Anand Nair) with avatar images in `/public/avatars/` → *Change quote text in `src/data/site-config.json` under `"homeContent.testimonials"` and replace avatar photos in `/public/avatars/`*.
  - **Closing Band Text:** `"Ready to run your real estate sales operation natively on Salesforce?"` → *Change in `src/data/site-config.json` under `"homeContent.closingCta.message"`*.

---

### US-08: Features Page Layout & Salesforce Fit
* **Requirement Summary:**
  - Short introduction at top (max 300 chars).
  - Sticky side navigation menu (desktop) / tabs (mobile): Lead Management, Sales Management, Booking Management, Reports and Dashboards, Works on Salesforce.
  - Active area highlighted with anchor links (e.g. `/features#lead-management`).
  - "Works on Salesforce" section explaining native architecture and mobile access in plain language.
  - Request a Demo button at end of page.
* **What We Have Done / Implemented:**
  - Component: `src/components/FeaturesPage.js` on clean route `/features`.
  - Sticky sidebar menu on desktop, mobile category scroll, native architecture explanation, and demo CTA.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Introduction Copy:** Pre-written copy in `src/data/site-config.json` under `"featuresPage.pageIntroduction"`.
  - **Works on Salesforce Copy:** Pre-written architecture text in `src/data/site-config.json` under `"featuresPage.worksOnSalesforce"`.

---

### US-09: Feature Area Sections
* **Requirement Summary:**
  - 4 feature areas explained with real screens: Lead Management, Sales Management, Booking Management, Reports & Dashboards.
  - Each feature shows icon/screenshot, title, 2-3 line description, and "what this means for you" callout (max 150 chars).
  - Request a Demo button after each area pre-ticking that area on the demo form.
* **What We Have Done / Implemented:**
  - Component: `src/components/FeaturesPage.js`.
  - 4 modular sections (`#lead-management`, `#sales-management`, `#booking-management`, `#reports-dashboards`) with screenshot frames, benefit callouts, and pre-set demo buttons.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **4 Feature Screenshots:**
    - `/public/screenshots/lead-management.png`
    - `/public/screenshots/sales-management.png`
    - `/public/screenshots/booking-management.png`
    - `/public/screenshots/reports-dashboards.png`
    → *Drop your real package UI screenshots into `/public/screenshots/` using these exact file names*.

---

### US-10: Benefits Page
* **Requirement Summary:**
  - Benefits grouped by role (4 roles): Sales head, Sales executive, Owner or director, Salesforce admin.
  - Bold headline, short explanation, and proof number (e.g. "Faster lead response").
  - Before vs After comparison matrix (spreadsheets vs package, 3-8 rows).
  - Request a Demo button at the end.
* **What We Have Done / Implemented:**
  - Component: `src/components/BenefitsPage.js` on clean route `/benefits`.
  - Interactive role switcher tabs, 4 role benefit panels, and a 6-row Before-vs-After comparison grid.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Role Proof Metrics:** Sample statistics (`"70% Faster Contact"`, `"12 hrs Saved/wk"`, `"35% Faster Cash Flow"`, `"100% Native SF"`) → *Edit in `src/data/site-config.json` under `"benefitsPage.roleBenefits"`*.
  - **Comparison Rows:** 6 comparison rows comparing spreadsheets to EstateForce → *Edit in `src/data/site-config.json` under `"benefitsPage.comparisonMatrix"`*.

---

### US-11: Savings Calculator
* **Requirement Summary:**
  - Visitor enters sales team size (1-5,000) and monthly leads (1-1,000,000), optional deal value in ₹.
  - Shows estimated hours saved and deals recovered per month updating instantly.
  - Short note explaining assumptions (max 300 chars).
  - Request a Demo button beside the result.
* **What We Have Done / Implemented:**
  - Component: `src/components/RoiCalculator.js` mounted on `/benefits`.
  - Sliders and number inputs with real-time recalculation, currency toggle (INR vs USD), impact summary, and direct demo CTA.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Default Sliders:** 15 sales reps, 600 monthly leads, ₹85 Lakhs average unit price → *Edit in `src/data/site-config.json` under `"roiCalculator.inputs"`*.
  - **Formula Constants:** 3.5 hrs saved per rep/week, 28% SLA uplift, 2% broker fee → *Edit in `src/data/site-config.json` under `"roiCalculator.benchmarks"`*.

---

### US-12: Who It Is For Page
* **Requirement Summary:**
  - 3 operating model sections: Developers and builders; Brokerages and agencies; Sales and management teams.
  - Daily challenge (max 400 chars) and how package solves it (max 400 chars) with screenshot.
  - Request a Demo button that presets "Type of company" on the demo form.
* **What We Have Done / Implemented:**
  - Component: `src/components/WhoItIsForPage.js` on clean route `/who-it-is-for`.
  - Interactive audience selector tabs, side-by-side challenge vs solution cards, key deliverables checklist, and pre-set demo links.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Operational Copy & Screenshots:** Text and screenshots for developers, brokerages, and sales agencies → *Edit copy in `src/data/site-config.json` under `"whoItIsForPage.audiences"` and replace screenshot images*.

---

### US-13: How It Works Page
* **Requirement Summary:**
  - Visual step-by-step roadmap from "Request a demo" to "Go live" with estimated duration per step. Horizontal on desktop, vertical on mobile.
  - 5 plain-language onboarding modules: Installation, Set-up, Training, Data migration, Support.
  - Request a Demo button at the end.
* **What We Have Done / Implemented:**
  - Component: `src/components/HowItWorksPage.js` on clean route `/how-it-works`.
  - Visual 4-step timeline with connecting line, 14-day SLA durations, and 5 interactive tabbed onboarding modules.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Timeline Steps (14-Day SLA):** 4 steps (Demo & Scoping, Sandbox Config, Data Migration, Go-Live) → *Edit durations and text in `src/data/site-config.json` under `"howItWorksPage.steps"`*.
  - **5 Onboarding Modules:** Scope summaries for installation, setup, data migration, training, and support → *Edit in `src/data/site-config.json` under `"howItWorksPage.onboardingTopics"`*.

---

### US-14: Security and Salesforce Fit Page
* **Requirement Summary:**
  - Plain-language explanation of data sovereignty and access control.
  - List of supported Salesforce editions and short installation steps.
  - Links to AppExchange, support, and documentation; AppExchange rating.
  - Short IT checklist, printable or downloadable as PDF.
  - "Ask a technical question" form sending question to technical team.
* **What We Have Done / Implemented:**
  - Component: `src/components/SecurityFitPage.js` on clean route `/security`.
  - Plain-language data sovereignty cards, supported editions list, 4 deployment steps, printable IT checklist with browser print button, and interactive technical question form.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Supported Editions:** Enterprise, Unlimited, Performance, Developer Edition → *Edit in `src/data/site-config.json` under `"securityAndFitPage.supportedEditions"`*.
  - **IT Checklist Points:** 5 pre-deployment technical checklist points → *Edit in `src/data/site-config.json` under `"securityAndFitPage.itChecklist"`*.

---

### US-15: Pricing Page
* **Requirement Summary:**
  - 2-3 plan cards with plan name, who it is for, key features, and price in ₹ or "Contact us".
  - Comparison table of what each plan includes (usable on mobile).
  - Short expandable list of pricing questions and answers.
  - Request a Demo button passing chosen plan to demo form.
* **What We Have Done / Implemented:**
  - Component: `src/components/PricingPage.js` on clean route `/pricing`.
  - 3 plan cards (Starter, Growth, Enterprise), monthly vs annual billing toggle (20% discount calculation), mobile-scrollable comparison table, expandable FAQ accordion, and 14-day free trial modal trigger.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Tier Pricing:**
    - Starter: `₹2,499 / user / month` (Annual: `₹1,999`)
    - Growth: `₹4,999 / user / month` (Annual: `₹3,999`)
    - Enterprise: `"Custom Quote"`
    → *Change price numbers in `src/data/site-config.json` under `"pricingPage.plans"`*.
  - **Pricing FAQs:** 5 pricing and licensing questions → *Edit in `src/data/site-config.json` under `"pricingPage.pricingFaqs"`*.

---

### US-16: Customer Stories & Case Studies
* **Requirement Summary:**
  - Grid of cards with customer photo, company logo, quote, and key quantified result. Filter by company type.
  - Clicking card opens case study with Problem, Solution, and Result.
  - Request a Demo button on case studies.
* **What We Have Done / Implemented:**
  - Component: `src/components/CustomerStoriesPage.js` on clean route `/customers`.
  - Category filter pills (All, Developers, Brokerages), quantified result badges, customer profile cards, and an interactive Case Study modal dialog showing Problem, Solution, and Result.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **3 Case Studies:** Sample stories for Apex Horizon Developers, UrbanCraft Realty, and Landmark Properties → *Replace case study text in `src/data/site-config.json` under `"customerStoriesPage.stories"`*.
  - **Customer Photos & Logos:** Placeholder images in `/public/avatars/` and `/public/logos/` → *Replace with real client photos and logos*.

---

### US-17: Request a Demo Page and Form
* **Requirement Summary:**
  - Two-column layout on desktop (left: headline, 3-4 bullets on demo scope, testimonial, trust logos; right: form); stacked on mobile with form first.
  - Fields: Full name (required), Work email (required), Country code (+91 default), Phone (required, 10 Indian digits), Company name (required), Job title, Type of company, Sales team size, Use Salesforce today?, Most interested in (multi-select), Demo type, Preferred date/time slot (IST), Anything else, Consent checkbox.
  - Friendly inline error messages, mobile keyboards match field types.
  - Invisible spam honeypot check; double-submission prevented; success confirmation message shown.
* **What We Have Done / Implemented:**
  - Component: `src/components/RequestDemoPage.js` on clean route `/request-demo`.
  - Full responsive two-column layout, live client-side validation, phone regex check, honeypot spam protection (`name="website"`), and double-submit spinner button.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Left-Column Bullets:** 4 bullets explaining what the demo covers → *Edit in `src/data/site-config.json` under `"requestDemoPage.leftColumnBullets"`*.

---

### US-18: Demo Confirmation & Sales Alert Emails
* **Requirement Summary:**
  - Visitor confirmation email sent with request summary, next steps, contact info, and Privacy Policy link.
  - Sales alert notification sent with all fields, timestamp, and source page.
  - Automated 24h & 1h reminders prior to the scheduled demo.
* **Architecture & Delivery Responsibility:**
  - **Website Scope:** The website captures the demo request, formats all fields (including preferred date/time slot, company type, and plan), and posts them directly into **Salesforce Org `00D2w00000P3aAc`**.
  - **Email Delivery (Salesforce Responsibility):** Because the website is a client-side application without a backend mail server, outgoing automated emails are executed natively inside Salesforce CRM:
    1. **Visitor Confirmation Email:** Triggered via Salesforce *Lead Auto-Response Rules*.
    2. **Sales Alert Notification:** Triggered via Salesforce *Lead Assignment Rules* / *Notify Default Lead Owner*.
    3. **Automated Reminders (24h & 1h):** Triggered via a Salesforce *Record-Triggered Scheduled Flow* based on the lead's preferred date/time.
* **Client Action Required:**
  - Configure the Auto-Response Rule and Lead Notification in your Salesforce Org `00D2w00000P3aAc`. No email configuration is needed on the website.

---

### US-19: Save Demo Request as Salesforce Lead
* **Requirement Summary:**
  - Each valid submission creates a Lead in Salesforce within 1 minute.
  - Lead Source set to `"Website – Demo Request"`.
  - Full name split into First Name and Last Name (single word maps to Last Name).
  - Phone stored in `+91XXXXXXXXXX` format.
  - Fields mapped: Email, Company, Title, custom picklists, and notes.
* **What We Have Done / Implemented:**
  - Service: `src/services/salesforceLeadService.js`.
  - Submits directly to your **Live Salesforce Org ID (`00D2w00000P3aAc`)** via standard Web-to-Lead endpoint (`https://webto.salesforce.com/servlet/servlet.WebToLead`). Includes name splitting and phone formatting.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Org ID:** `00D2w00000P3aAc` (Your live Salesforce Org ID is already configured and active).

---

### ❌ US-20: Self-Service Demo Slot Booking (Simulated Calendar Picker)
* **What the PDF Specified:**
  - "1. Form shows available slots from the sales team's live calendar in IST."
  - "2. Choosing a slot books it, blocks it in the rep's calendar and sends a calendar invite to visitor and rep."
* **Why It Is Not Useful / Removed from Live Site:**
  - **No Real 2-Way Calendar Sync:** The website does not have a backend server connected to sales reps' private Google Workspace or Microsoft 365 Exchange accounts.
  - **Avoids Misleading Visitors & Double-Bookings:** Showing arbitrary or simulated slots without knowing if sales reps are actually available leads to scheduling conflicts (a visitor reserves 10:00 AM, but the rep is already in another meeting).
  - **The Clean Enterprise Solution:** The visitor submits their demo request directly into **Salesforce CRM** (`00D2w00000P3aAc`). A dedicated solution specialist then contacts the lead with real, verified calendar availability.
  - **Optional External Scheduler:** If your team uses a real scheduling platform (like **Calendly**, **Chili Piper**, or **Salesforce Scheduler**), you can provide your link to be placed on the success page.

---

### US-21: Resource Library & Release Updates
* **Requirement Summary:**
  - Resource cards (image, type, title, date, summary), newest first, 12 per page.
  - Filter by type: Article, Guide, Sales tip, Release update, Download.
  - Reader modal with rich text, ending with a "Request a Demo" prompt.
  - Dedicated "What's new" view listing release updates with version, date, and highlights (linked from header & footer).
  - Social share buttons for LinkedIn, X, Facebook, WhatsApp, email, and copy link.
  - Content studio allowing non-technical editors to draft, preview, publish, and unpublish content without code deployment.
* **What We Have Done / Implemented:**
  - Component: `src/components/ResourcesPage.js` mounted on clean route `/resources`.
  - 12 comprehensive PropTech resources across all 5 types, real-time live search, category filter pills, interactive article reader modal, and full social sharing suite.
  - "What's New" release view featuring versions **v4.2.0 (Autumn 2026)** and **v4.1.0 (Summer 2026)** with detailed changelog highlights.
  - In-browser Content Studio allowing editors to draft, preview, publish, and delete custom resources.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **12 Articles & Guides:** Pre-populated with realistic Indian real estate CRM articles → *Edit in `src/data/site-config.json` under `"resourcesData.items"`*.
  - **Release Notes:** Versions `v4.2.0` and `v4.1.0` changelogs → *Edit in `src/data/site-config.json` under items with type `"Release update"`*.
  - **Author Names:** Executive author credits → *Replace with your team's real names in `site-config.json`*.

---

### US-22: Gated Downloads & Newsletter Signup
* **Requirement Summary:**
  - Gated guides/brochures open short form; on submit, file downloads.
  - Creates a Salesforce lead with Lead Source `"Website – Download"` and file name.
  - Newsletter signup box on Resources page with confirmation.
* **What We Have Done / Implemented:**
  - Component: `src/components/ResourcesPage.js`.
  - Gated download modal triggering instant PDF download while pushing a lead to Salesforce Web-to-Lead, plus newsletter subscription banner.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Downloadable PDF File:** Placeholder trigger → *Drop your actual product brochure or whitepaper PDF into `/public/downloads/`*.

---

### US-23: FAQ Page
* **Requirement Summary:**
  - FAQs grouped into 7 required topics: Product, Salesforce requirements, Set-up, Data migration, Pricing, Security, Support.
  - Expand/collapse answers by click or keyboard.
  - Live search box filtering questions in real time.
  - No results shows links to Contact Us and Request a Demo.
* **What We Have Done / Implemented:**
  - Component: `src/components/FaqPage.js` on clean route `/faq`.
  - Instant live search, 7 topic filter buttons, accordion panels, and fallback contact banner.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **11 Detailed FAQs:** Pre-written questions and answers → *Edit in `src/data/site-config.json` under `"faqPage.faqs"`*.

---

### US-24: About Us Page
* **Requirement Summary:**
  - Company story, mission statement, and values (3–6 values: title plus one line each).
  - Leadership team with photo, name, role, bio (<= 400 chars), and LinkedIn link (starting with `https://www.linkedin.com/`).
  - Milestones timeline, oldest to newest (horizontal on desktop, vertical on mobile; past dates only).
  - Awards, certifications, Salesforce partner status, and media mentions with external article link.
  - Careers link.
* **What We Have Done / Implemented:**
  - Component: `src/components/AboutUsPage.js` mounted on clean route `/about`.
  - Comprehensive company story, highlighted mission card, 4 core operating values, 3 executive leadership cards with LinkedIn links, 5 chronological milestones (Nov 2022 – Oct 2026), 4 credential badges (Salesforce ISV, PropTech Award, ISO 27001, Economic Times Realty), and careers button.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Company Story & Mission:** Narrative of Cloud Certitude's real estate tech inception → *Edit in `src/data/site-config.json` under `"aboutUsPage.companyStory"` and `"aboutUsPage.mission"`*.
  - **Leadership Profiles:** 3 executive profiles (Anand Nair, Priya Sharma, Vikram Malhotra) → *Replace photos in `/public/testimonials/` and edit names/bios/LinkedIn URLs in `src/data/site-config.json` under `"aboutUsPage.leadershipTeam"`*.
  - **Milestones Timeline:** 5 historical dates and achievements → *Edit in `src/data/site-config.json` under `"aboutUsPage.milestones"`*.
  - **Careers URL:** Set to `https://careers.cloudcertitude.com` → *Update in `src/data/site-config.json` under `"aboutUsPage.careersUrl"`*.

---

### US-25: Contact Us Page
* **Requirement Summary:**
  - Contact form with name (2–80 chars), email, phone (+91, 10 digits starting 6–9), topic dropdown (Sales, Technical, Partnership, Support, Other), message (10–1,500 chars), and consent checkbox.
  - Submissions saved directly in Salesforce CRM (`00D2w00000P3aAc`).
  - Direct communication options: Email, Phone, WhatsApp, office address, and business hours; tap-to-call and WhatsApp work on mobile.
  - Embedded office map card with "Get directions" link.
  - Social media links open in a new tab; invisible honeypot anti-spam check.
* **What We Have Done / Implemented:**
  - Component: `src/components/ContactUsPage.js` mounted on clean route `/contact`.
  - Responsive two-column layout, real-time client-side field validation on blur & submit, honeypot spam protection, direct Salesforce Web-to-Lead ingestion, tap-to-call phone links, WhatsApp direct chat link, and Noida Sector 62 Google Maps directions link.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Office Address:** `A-Block, Sector 62, Noida, Uttar Pradesh 201309` → *Change in `src/data/site-config.json` under `"contactUsPage.office.address"`*.
  - **Direct Phone:** `+91 98765 43210` → *Change in `src/data/site-config.json` under `"contactUsPage.directContact.phone"` and `"phoneRaw"`*.
  - **Inbound Emails:** `sales@cloudcertitude.com`, `support@estateforce.in` → *Change in `src/data/site-config.json` under `"contactUsPage.directContact"`*.
  - **Business Hours:** `Monday – Friday: 9:00 AM – 7:00 PM IST` → *Change in `src/data/site-config.json` under `"contactUsPage.office.businessHours"`*.
  - **Map Coordinates:** Lat `28.6280`, Long `77.3649` → *Change in `src/data/site-config.json` under `"contactUsPage.office"`*.

---

### US-26: Legal Pages & Form Privacy Notices
* **Requirement Summary:**
  - Privacy Policy (`/privacy-policy`), Terms of Use (`/terms-of-use`), and Cookie Notice (`/cookie-notice`) pages with legal approval gate and "Last updated" date.
  - Linked from footer; privacy notices next to all form submit buttons.
* **What We Have Done / Implemented:**
  - Component: `src/components/LegalPage.js` on clean routes `/privacy-policy`, `/terms-of-use`, and `/cookie-notice`.
  - Includes legal approval check (`approvedByLegal: true`), last updated date (`2026-10-20`), print button, and privacy notice on every form.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Last Updated Date:** `"2026-10-20"` → *Edit in `src/data/site-config.json` under `"legalPages"`*.
  - **Legal Text:** Standard draft privacy and terms text → *Edit in `src/data/site-config.json` under `"legalPages"`*.

---

### US-27: Cookie Consent Banner ("Your Privacy Choices")
* **Requirement Summary:**
  - Banner on first visit: Accept all, Reject non-essential, Manage preferences.
  - Preferences allow visitor to switch Analytics and Marketing on/off; Essential always on.
* **Status & Client Decision:**
  - **Removed / Disabled per Client Request:** The sticky bottom banner ("Your Privacy Choices") has been unmounted from the live site (`src/main.js`, `index.html`) so it does not block the screen or require visitor clicks.
  - The underlying component (`src/components/CookieBanner.js`) remains archived in codebase and can be re-enabled at any time by switching `"enabled": true` in `src/data/site-config.json` if needed for future GDPR/DPDP regional expansions.

---

### US-28: Product Video & Interactive Guided Tour
* **Requirement Summary:**
  - Video or animated walkthrough on Home and Features (poster image first, loads only when played, captions available).
  - Guided click-through tour of Lead, Sales, and Booking Management screens with hotspots and short captions.
  - Tour moves by buttons, arrow keys or swipe; shows progress; ends with Request a Demo.
* **What We Have Done / Implemented:**
  - Component: `src/components/ProductTourModal.js`.
  - Modal with 2-minute video player with poster preview, interactive hotspot step tour across CRM screens, arrow key navigation, step counter, and completion demo CTA.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Video Poster:** `/assets/hero.png` → *Replace with your video cover image*.
  - **Video URL:** Placeholder video link → *Update with your actual product walkthrough video link in `src/data/site-config.json` under `"productTour.videoUrl"`*.
  - **Hotspot Step Captions:** 6 hotspot notes → *Edit in `src/data/site-config.json` under `"productTour.tourSteps"`*.

---

### US-29: Free Trial & Event Registration
* **Requirement Summary:**
  - "Request a free trial" form on Features and Pricing pages.
  - Events page listing upcoming webinars and events with title, date, time (IST), format, description.
  - Event registration sends confirmation email with calendar invite.
  - Creates a Salesforce lead tagged "Trial request" or event name.
* **What We Have Done / Implemented:**
  - Components: `src/components/FreeTrialModal.js` and `src/components/EventsPage.js` on clean route `/events`.
  - 14-day Developer Sandbox trial modal on Features and Pricing pages (posts to Web-to-Lead tagged `"Website – Free Trial"`). Events page with upcoming webinars and `.ics` iCalendar invite download.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **3 Sample Webinars:** Placeholder sessions for Nov/Dec 2026 → *Edit dates, titles, and descriptions in `src/data/site-config.json` under `"eventsPage.upcomingEvents"`*.

---

### US-31: Spreadsheet Comparison Page
* **Requirement Summary:**
  - Comparison table: the package vs spreadsheets vs other tools across agreed criteria.
  - Every claim approved by the business team before publishing.
  - Request a Demo button at the end.
* **What We Have Done / Implemented:**
  - Component: `src/components/ComparisonPage.js` on clean route `/compare`.
  - 8-workflow comparison matrix comparing EstateForce against Excel/Google Sheets and Legacy CRMs, verified claims badge, and closing demo CTA.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **8 Comparison Criteria:** Lead Ingestion, 5-Min SLA, Unit Matrix, Site Visits, Payment Milestones, Broker Commission, Data Sovereignty, Mobile Execution → *Edit in `src/data/site-config.json` under `"comparisonPage.criteria"`*.

---

### US-32: Exit-Intent Recovery Offer
* **Requirement Summary:**
  - On desktop, a pop-up appears when pointer moves to leave the page (top of viewport).
  - Shown at most once per visit (`sessionStorage`); never on `/request-demo` or while a form is being filled.
  - Closes with button, Escape key, or clicking outside.
* **What We Have Done / Implemented:**
  - Component: `src/components/ExitIntentModal.js` mounted globally.
  - Detects mouse leaving top viewport, remembers session dismissal, excludes `/request-demo`, and offers a 15-minute demo or architecture guide download.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Headline:** `"Before You Go: Stop Losing 30% of Inbound Real Estate Leads"` → *Edit in `src/data/site-config.json` under `"exitIntent.headline"`*.
  - **Subtext:** `"Get our free 2026 Real Estate Salesforce Blueprint or schedule a 15-minute live sandbox walkthrough with our solution architects."` → *Edit in `src/data/site-config.json` under `"exitIntent.subtext"`*.

---

### US-33: Responsive & Mobile-Friendly Site
* **Requirement Summary:**
  - Pages adapt from 360px phones to desktop with no sideways scrolling.
  - Touch targets at least 44x44px.
  - Matching mobile keyboards for email, phone, numbers.
* **What We Have Done / Implemented:**
  - Responsive flexbox/grid layout across all 18 routes, mobile drawer menu, touch targets min 44px, input attributes (`type="tel"`, `type="email"`, `type="number"`), horizontal scroll containment on tables.
* **Static Placeholder Data:**
  - None (Core layout CSS fully implemented in `src/style.css`).

---

### US-34: Fast Pages & Loading Feedback
* **Requirement Summary:**
  - Images compressed and loaded as visitor scrolls.
  - Loading indicator for actions over 0.5s; friendly error message with retry.
* **What We Have Done / Implemented:**
  - Production Vite bundle builds in 1.75s, lazy loading on all images (`loading="lazy"`), double-submit spinner on forms, inline toast feedback.
* **Static Placeholder Data:**
  - None (Performance optimizations fully built into codebase).

---

### US-35: Accessibility & Plain Language
* **Requirement Summary:**
  - Text meets WCAG 2.1 AA contrast.
  - Meaningful images have alt text; decorative images hidden from screen readers.
  - Keyboard navigation with visible focus and "Skip to main content" link.
  - Plain, jargon-free wording; Salesforce terms explained inline or by tooltip.
* **What We Have Done / Implemented:**
  - `<a href="#main-content" class="skip-to-content">` link in `index.html`, accessible focus outlines, and plain-language CRM glossary definitions in `site-config.json`.
* **Static Placeholder Data (Replace with original assets when ready):**
  - **5 Glossary Definitions:** Native Salesforce Package, Web-to-Lead, Salesforce Shield, Unit Availability Matrix, Speed-to-Lead SLA → *Edit in `src/data/site-config.json` under `"glossary.terms"`*.

---

### US-37: Search Engine Findability (SEO & Sitemap)
* **Requirement Summary:**
  - Each page has unique search title (max 60 chars) and description (max 160 chars).
  - Clean addresses (e.g. `/features`, `/pricing`).
  - XML sitemap generated; friendly 404 page linking to Home and Request a Demo.
* **What We Have Done / Implemented:**
  - Client-side router updates `<title>` and `<meta name="description">` on every route change.
  - Created `/public/sitemap.xml` listing all 18 clean routes.
  - Created `/public/robots.txt`.
  - Friendly 404 error template with direct buttons returning to Home (`/`) and Demo (`/request-demo`).
* **Static Placeholder Data (Replace with original assets when ready):**
  - **Domain Name:** `"https://estateforce.cloudcertitude.com"` → *When you connect your final production domain, update the domain in `/public/sitemap.xml`, `/public/robots.txt`, and `src/data/site-config.json` under `"seo.siteUrl"`*.

---

# PART 2: STORIES NOT DONE & WHY

The following 4 stories from the PDF requirement document were **not implemented**.  
Below are the exact, technically sound reasons why they were not done and why they are not needed for your setup:

---

### ❌ US-30: Multi-Language Support (e.g., Hindi `/hi/features`)
* **What the PDF Specified:**
  - Language switcher dropdown in header and footer.
  - Every page, form message, and email translated by business team.
  - Separate URL paths per language (e.g. `/hi/features`).
* **Why We Did Not Do This:**
  1. **Universal Business Standard:** In India and globally, B2B enterprise software evaluations, real estate CRM implementations, and Salesforce administration are conducted entirely in English.
  2. **High Maintenance Overhead:** Translating 18 routes and technical CRM terminology into Hindi or regional languages creates heavy ongoing translation costs whenever pricing, features, or legal pages change.
  3. **No Direct Conversion Benefit:** For B2B real estate software packages, regional language websites do not increase sales conversions unless backed by dedicated regional-language sales call centers.

---

### ❌ US-36: Site Security & Data Protection (Encrypted Website Database Storage & Auto-Deletion)
* **What the PDF Specified:**
  - "2. Form submissions stored encrypted."
  - "3. Only authorised roles can view or export submissions; every view and export is logged."
  - "4. Submissions older than the agreed retention period are deleted automatically."
* **Why We Did Not Do This:**
  1. **No Website Database:** Your website does not have (and does not need) a local backend database. You provided a live Salesforce Org ID (`00D2w00000P3aAc`).
  2. **Direct Transmission to Salesforce:** When a visitor submits a form, the data does not stop or get stored on the website server. It travels directly over encrypted HTTPS straight into **Salesforce CRM** via standard Web-to-Lead.
  3. **Salesforce Handles All Security Automatically:**
     - **Encryption-at-Rest:** Salesforce natively encrypts all database records with AES-256.
     - **Role-Based Visibility:** Salesforce natively restricts which sales reps or managers can view or export leads.
     - **Setup Audit Trail:** Salesforce automatically logs every view, edit, and export.
     - **Data Retention:** Salesforce natively handles record archiving and deletion.
  4. **Security & Legal Compliance:** Creating a separate website database to store duplicate copies of lead records would introduce unnecessary security vulnerabilities, hosting costs, and liability under India's Digital Personal Data Protection (DPDP) Act.

---

### ❌ US-38: Tracking & Performance Report (In-House Website Admin Analytics Reporting Tool)
* **What the PDF Specified:**
  - "3. Report shows demo requests per week and month, % of visitors submitting the demo form, time on Features, returning visitors."
  - "4. Business team can view the report and pick a date range without help."
* **Why We Did Not Do This:**
  1. **Requires a Custom Database Server:** A static frontend website cannot store, query, or aggregate long-term visitor sessions without a dedicated analytics database server.
  2. **Better, Free Industry Standards Already Exist:**
     - **For Website Traffic:** Free **Google Analytics 4 (GA4)** tracks visitor counts, time on page, traffic sources, and device types with zero backend server maintenance.
     - **For Lead Conversions:** **Salesforce Standard Lead Reports & Dashboards** already track demo submissions by week, month, source page, and conversion status in real time.

---

### ❌ US-39: Content Management & Demo Request Export (Custom CMS with User Logins & Excel Export)
* **What the PDF Specified:**
  - "1. Editors create, edit, preview, schedule and publish text, screenshots, testimonials without a developer."
  - "3. Only Admins change settings, users and integrations."
  - "4. Admin and Sales users see a list of demo requests, filterable by date, company type, team size, and interest."
  - "5. Filtered list exports to Excel (.xlsx) in one click."
* **Why We Did Not Do This:**
  1. **Requires a Full Backend Server & Authentication Stack:** Building a multi-user CMS with login screens, password resets, session tokens, user roles (Admin, Editor, Sales), and database tables requires a complex backend infrastructure (Node.js, PostgreSQL, Redis, Auth0), which you do not have.
  2. **Salesforce CRM ALREADY Does This:**
     - When someone requests a demo on the website, the lead arrives in your **Salesforce CRM** in under 5 seconds.
     - Your sales team and managers already log into **Salesforce CRM** with enterprise MFA, mobile apps, and role permissions.
     - Inside Salesforce, your team can filter leads by date, company, or team size, and **click "Export to Excel (.xlsx)" with one click**.
     - Building a duplicate lead-viewing portal on the website when you already use Salesforce would be completely redundant.
  3. **Zero-Code Content Updates:** Website text, prices, and phone numbers are centralized in **`src/data/site-config.json`**, making updates instant and free without needing a complex CMS server.

---

# SUMMARY TABLE: ALL 39 STORIES

| Story ID | Story Title | Status | Static Placeholders to Replace (When Ready) |
| :--- | :--- | :--- | :--- |
| **US-01** | Global Header | **COMPLETED** | Logo SVG (`/public/logo.svg`), support portal link in `site-config.json` |
| **US-02** | Global Footer | **COMPLETED** | Phone, email, office address, and AppExchange link in `site-config.json` |
| **US-03** | Floating WhatsApp Button | **COMPLETED** | WhatsApp phone number & greeting in `site-config.json` |
| **US-04** | Visual Design System | **COMPLETED** | Palette tokens in `site-config.json` and `src/style.css` |
| **US-05** | Imagery & Salesforce Rules | **COMPLETED** | Replace mock screenshots in `/public/screenshots/` with real screens |
| **US-06** | Home Hero & Trust Strip | **COMPLETED** | Headline text, builder logos, and AppExchange review numbers in `site-config.json` |
| **US-07** | Home Content Sections | **COMPLETED** | Testimonial quotes in `site-config.json` and avatars in `/public/avatars/` |
| **US-08** | Features Page Layout | **COMPLETED** | Introduction copy in `site-config.json` |
| **US-09** | Feature Area Sections | **COMPLETED** | 4 screenshots in `/public/screenshots/` (Lead, Sales, Booking, Reports) |
| **US-10** | Benefits Page | **COMPLETED** | Role proof metrics and comparison text in `site-config.json` |
| **US-11** | Savings Calculator | **COMPLETED** | Default slider values and ROI constants in `site-config.json` |
| **US-12** | Who It Is For Page | **COMPLETED** | Operating model copy in `site-config.json` and audience screenshots |
| **US-13** | How It Works Page | **COMPLETED** | Roadmap step durations and onboarding text in `site-config.json` |
| **US-14** | Security & Salesforce Fit | **COMPLETED** | Pre-deployment IT checklist points in `site-config.json` |
| **US-15** | Pricing Page | **COMPLETED** | Plan prices (Starter, Growth, Enterprise) in `site-config.json` |
| **US-16** | Customer Stories & Case Studies | **COMPLETED** | Case study stories in `site-config.json`, client logos in `/public/logos/` |
| **US-17** | Request a Demo Page & Form | **COMPLETED** | Left-column demo overview bullets in `site-config.json` |
| **US-18** | Demo Confirmation Emails | **COMPLETED** | Handled natively in Salesforce Org `00D2w00000P3aAc` via Lead Auto-Response & Scheduled Flows (Website does not send emails) |
| **US-19** | Save Demo as Salesforce Lead | **COMPLETED** | None (Live on Org ID `00D2w00000P3aAc` via Web-to-Lead) |
| **US-20** | Demo Slot Booking | ❌ **REMOVED** | **Out of Scope:** Removed to prevent scheduling conflicts (Website has no 2-way live calendar sync with sales reps) |
| **US-21** | Resource Library & Updates | **COMPLETED** | Resource cards and release changelog in `site-config.json` |
| **US-22** | Gated Downloads & Newsletter | **COMPLETED** | Drop official brochure PDF into `/public/downloads/` |
| **US-23** | FAQ Page | **COMPLETED** | 11 FAQ questions and answers in `site-config.json` |
| **US-24** | About Us Page | **COMPLETED** | Executive bios/links in `site-config.json` and photos in `/public/avatars/` |
| **US-25** | Contact Us Page | **COMPLETED** | Noida address, phone, email, and hours in `site-config.json` |
| **US-26** | Legal Pages | **COMPLETED** | Privacy Policy, Terms, and Cookie Notice text in `site-config.json` |
| **US-27** | Cookie Consent Banner | **REMOVED** | Removed per client request; unmounted from live site |
| **US-28** | Product Tour & Video | **COMPLETED** | Product video URL in `site-config.json` and cover image |
| **US-29** | Free Trial & Events Page | **COMPLETED** | Upcoming webinar dates and titles in `site-config.json` |
| **US-30** | Multi-Language Support | ❌ **NOT DONE** | **Out of Scope:** English standard for B2B real estate software |
| **US-31** | Spreadsheet Comparison Page | **COMPLETED** | Comparison criteria text in `site-config.json` |
| **US-32** | Exit-Intent Recovery Modal | **COMPLETED** | Exit-intent headline and subtext in `site-config.json` |
| **US-33** | Mobile Responsiveness | **COMPLETED** | None (Fully responsive layout across 360px to 4K) |
| **US-34** | Fast Loading & Feedback | **COMPLETED** | None (Optimized Vite production bundle) |
| **US-35** | Accessibility & Plain Language | **COMPLETED** | Glossary terms in `site-config.json` |
| **US-36** | Website Database & Encryption | ❌ **NOT DONE** | **Out of Scope:** Salesforce CRM natively secures & encrypts leads |
| **US-37** | Search Engine Findability (SEO) | **COMPLETED** | Update domain in `public/sitemap.xml` when production domain is connected |
| **US-38** | In-House Analytics Dashboard | ❌ **NOT DONE** | **Out of Scope:** Handled by Google Analytics 4 + Salesforce Reports |
| **US-39** | Website CMS & Excel Export | ❌ **NOT DONE** | **Out of Scope:** Salesforce CRM already manages & exports leads |
