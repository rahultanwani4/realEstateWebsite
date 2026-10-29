import siteConfig from '../data/site-config.json';

/**
 * US-24 About Us Page Component
 * 
 * Criteria:
 * 1. Company story, mission statement and values (3-6 values: title plus one line each).
 * 2. Leadership team with photo, name, role, bio (<= 400 chars) and LinkedIn link (starts with https://www.linkedin.com/).
 * 3. Milestones timeline, oldest to newest (horizontal desktop, vertical mobile; dates not in future).
 * 4. Awards, certifications, Salesforce partner status and media mentions (media mentions link to article).
 * 5. Careers link.
 */

export function initAboutUsPage(mountTarget = '#about-us-page-root') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = siteConfig.aboutUsPage || {};

  container.innerHTML = `
    <section class="about-us-page relative py-16 sm:py-20 lg:py-24 bg-slate-900 text-white scroll-mt-20 overflow-hidden" id="about-us-section">
      
      <!-- Ambient Lighting -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 rounded-full mb-3">
            <span class="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>About EstateForce &amp; Cloud Certitude</span>
          </span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ${data.headline || 'Built by Salesforce Architects. Engineered for Real Estate Leaders.'}
          </h1>
          <p class="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            ${data.subheadline || 'Bridging the gap between complex property development workflows and the world’s leading CRM platform.'}
          </p>
        </div>

        <!-- Section 1: Company Story & Mission (US-24 Criterion 1) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20 pb-16 border-b border-slate-800">
          <div class="lg:col-span-7 space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3">
              Our Journey &amp; Engineering Philosophy
            </h2>
            <p>
              ${data.companyStory}
            </p>
            <p>
              Rather than forcing developers onto rigid standalone software that locks property data into external proprietary silos, EstateForce is architected 100% natively on the Salesforce Lightning platform — giving property enterprises complete data sovereignty, uncompromised auditability, and immediate multi-project scalability.
            </p>
          </div>
          <div class="lg:col-span-5">
            <div class="bg-gradient-to-br from-blue-950/80 to-slate-900 border border-blue-800/60 rounded-3xl p-6 sm:p-8 shadow-xl">
              <span class="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">Our Mission</span>
              <p class="text-base sm:text-lg font-bold text-white leading-snug">
                “${data.mission}”
              </p>
              <div class="mt-6 pt-6 border-t border-blue-900/60 flex items-center gap-3 text-xs text-blue-200">
                <svg viewBox="0 0 24 24" width="20" height="20" class="text-blue-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Certified Salesforce ISV Partner Ecosystem</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Core Values (US-24 Criterion 1: 3-6 values) -->
        <div class="mb-20 pb-16 border-b border-slate-800">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Our Core Operating Values</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">The fundamental engineering principles behind every product decision we make.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${(data.values || []).map(val => `
              <div class="value-card bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 hover:border-blue-500/60 transition-colors">
                <span class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 text-xs font-extrabold">✓</span>
                <h3 class="text-base font-bold text-white mb-2">${val.title}</h3>
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${val.description}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 3: Leadership Team (US-24 Criterion 2) -->
        <div class="mb-20 pb-16 border-b border-slate-800" id="leadership-team-section">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Executive Leadership</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">Veteran enterprise architects and PropTech leaders committed to your success.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${(data.leadershipTeam || []).map(leader => `
              <div class="leader-card bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div class="w-20 h-20 rounded-2xl overflow-hidden mb-5 bg-slate-700 ring-2 ring-blue-500/30">
                    <img src="${leader.photo}" alt="${leader.name}" class="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 class="text-lg font-bold text-white">${leader.name}</h3>
                  <p class="text-xs text-blue-400 font-semibold mb-3">${leader.role}</p>
                  <p class="text-xs text-slate-300 leading-relaxed mb-4">${leader.bio}</p>
                </div>
                ${leader.linkedin ? `
                  <a href="${leader.linkedin}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold pt-3 border-t border-slate-700">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.84 6.75a1.61 1.61 0 1 0 0 3.22 1.61 1.61 0 0 0 0-3.22Z"/></svg>
                    <span>Connect on LinkedIn</span>
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 4: Milestones Timeline (US-24 Criterion 3: Oldest to Newest) -->
        <div class="mb-20 pb-16 border-b border-slate-800" id="milestones-timeline-section">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Our Evolution &amp; Milestones</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">From initial data architecture inception to powering 50,000+ units across India.</p>
          </div>
          <!-- Desktop Horizontal, Mobile Vertical Grid -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            ${(data.milestones || []).map((m, idx) => `
              <div class="milestone-step-card milestone-item bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 relative">
                <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-900/60 text-blue-300 border border-blue-700 mb-3 font-mono">
                  ${m.date}
                </span>
                <h3 class="text-sm font-bold text-white mb-1.5 leading-snug">${m.title}</h3>
                <p class="text-[11px] text-slate-300 leading-relaxed">${m.description}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 5: Credentials, Awards & Media Mentions (US-24 Criterion 4) -->
        <div class="mb-20 pb-16 border-b border-slate-800">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Awards, Certifications &amp; Media</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">Independently verified security, industry accolades, and press coverage.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            ${(data.credentials || []).map(cred => `
              <div class="credential-card bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-slate-300 mb-3">
                    ${cred.type}
                  </span>
                  <h3 class="text-sm font-bold text-white mb-1.5">${cred.title}</h3>
                  <p class="text-xs text-slate-400">${cred.issuer}</p>
                </div>
                ${cred.link ? `
                  <a href="${cred.link}" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold">
                    <span>Read Article</span>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline></svg>
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 6: Careers & Join Us (US-24 Criterion 5) -->
        <div class="text-center py-12 px-6 rounded-3xl bg-slate-800/60 border border-slate-700 max-w-3xl mx-auto">
          <h2 class="text-2xl font-extrabold text-white mb-2">Want to build the future of PropTech with us?</h2>
          <p class="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6">
            We are always looking for passionate Salesforce developers, UX designers, and real estate solutions consultants.
          </p>
          <a href="${data.careersUrl || 'https://careers.cloudcertitude.com'}" 
             id="about-careers-link"
             target="_blank" 
             rel="noopener noreferrer" 
             class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all">
            <span>Explore Open Positions</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        </div>

      </div>

    </section>
  `;
}
