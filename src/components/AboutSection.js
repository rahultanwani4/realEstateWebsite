import siteConfig from '../data/site-config.json';

/**
 * About Section Component
 * 
 * Showcases:
 * - Cloud Certitude as a Salesforce Summit Partner
 * - Deep real estate track record and experience on active developer projects
 * - Link to official site: https://www.cloudcertitude.com/
 * - 100% Salesforce Native architecture philosophy
 */
export function initAboutSection(mountTarget = '#about') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  container.innerHTML = `
    <section class="about-section relative pt-10 pb-16 sm:pt-12 sm:pb-20 bg-white text-slate-900 border-t border-slate-200/80 overflow-hidden" id="about-section">
      
      <!-- Subtle Background Grid Pattern -->
      <div class="absolute inset-0 opacity-40 pointer-events-none" style="background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px); background-size: 56px 56px; mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent);" aria-hidden="true"></div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-full mb-3">
            <span class="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Salesforce Summit Partner • Real Estate Experts</span>
          </div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Backed by Cloud Certitude
          </h2>
          <p class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Delivering high-impact Salesforce consulting, custom AppExchange packages, and digital sales transformation across dozens of top-tier real estate developments.
          </p>
        </div>

        <!-- Main Narrative Section -->
        <div class="max-w-4xl mx-auto mb-16">
          <div class="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-5 sm:space-y-6">
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Engineering Proven Solutions for Leading Builders &amp; Brokerages
            </h3>
            <div class="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p>
                <strong>Cloud Certitude</strong> is a certified <strong>Salesforce Summit Partner</strong> - the highest partner designation awarded by Salesforce for technical excellence, implementation delivery, and client satisfaction.
              </p>
              <p>
                Over the past decade, our team of certified Salesforce architects and engineers has worked closely with major real estate developers, commercial builders, and large brokerages. Having experienced first-hand the daily chaos of real estate sales galleries - from lost portal enquiries and delayed follow-ups to inventory double-bookings and fragmented WhatsApp chats - we engineered <strong>CC Real Estate</strong>.
              </p>
              <p>
                Unlike generic CRMs or third-party web tools that trap your customer and financial data in external proprietary databases, CC Real Estate runs <strong>100% natively on Salesforce Lightning</strong>. Every lead, unit booking, and payment milestone lives directly inside your Salesforce organization with absolute data sovereignty.
              </p>
            </div>

            <!-- External Link Button to Cloud Certitude Website -->
            <div class="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a href="https://www.cloudcertitude.com/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                 id="btn-visit-cloudcertitude">
                <span>Visit Cloud Certitude Official Site</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>

              <a href="#contact" class="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition-all">
                <span>Contact Our Solution Architects</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Real Estate Capabilities Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
          
          <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:border-blue-400 hover:shadow-md transition-all">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="22" y1="11" x2="16" y2="11"></line>
              </svg>
            </div>
            <h4 class="text-base font-bold text-slate-900 mb-2">High-Density Project Expertise</h4>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Extensive hands-on implementation across multi-tower residential projects, commercial IT parks, integrated townships, and plotting layouts.
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:border-blue-400 hover:shadow-md transition-all">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <h4 class="text-base font-bold text-slate-900 mb-2">Automated Inventory Management</h4>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pioneered real-time visual tower matrices with atomic row locking to ensure zero unit double-bookings during high-rush project launch days.
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:border-blue-400 hover:shadow-md transition-all">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h4 class="text-base font-bold text-slate-900 mb-2">Certified Enterprise Support</h4>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Backed by our dedicated team of certified Salesforce consultants providing 14-day deployment, team training, and continuous AppExchange product enhancements.
            </p>
          </div>

        </div>

      </div>
    </section>
  `;
}
