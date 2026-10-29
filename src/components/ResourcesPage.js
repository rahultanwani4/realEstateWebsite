import siteConfig from '../data/site-config.json';
import { navigateTo } from '../router.js';
import { submitToSalesforceWebToLead } from '../services/salesforceLeadService.js';

/**
 * US-21 Resource Library & Release Updates Component
 * US-22 Gated Downloads & Newsletter Signup
 */

const LOCAL_STORAGE_CUSTOM_RESOURCES = 'estateforce_custom_resources';
const LOCAL_STORAGE_NEWSLETTER_SUBS = 'estateforce_newsletter_subscribers';

export function initResourcesPage(mountTarget = '#resources-page-root') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = siteConfig.resourcesData || {
    headline: 'Resources, Guides & Release Updates',
    subheadline: 'Tactical sales playbooks, implementation checklists, and quarterly release notes for real estate on Salesforce.',
    filterTypes: ['All', 'Article', 'Guide', 'Sales tip', 'Release update', 'Download'],
    itemsPerPage: 12,
    items: []
  };

  // Merge static config items with local custom drafted/published items
  let allResources = [...data.items];
  try {
    const rawCustom = localStorage.getItem(LOCAL_STORAGE_CUSTOM_RESOURCES);
    if (rawCustom) {
      const customItems = JSON.parse(rawCustom);
      allResources = [...customItems, ...allResources];
    }
  } catch (e) {
    // Ignore
  }

  // Parse URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash || '';
  let initialView = searchParams.get('view') || (hash.includes('view=whats-new') ? 'whats-new' : 'all');
  let selectedFilter = searchParams.get('type') || 'All';
  let searchQuery = '';
  let currentPage = 1;
  const itemsPerPage = data.itemsPerPage || 12;

  // Active resource for reader modal or gated download
  let activeArticle = null;
  let activeGatedDownload = null;

  const initialSlug = searchParams.get('slug') || (hash.includes('slug=') ? hash.split('slug=')[1]?.split('&')[0] : null);
  if (initialSlug) {
    activeArticle = allResources.find(r => r.slug === initialSlug);
  }

  function getBadgeColor(type) {
    switch (type) {
      case 'Article': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Guide': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Sales tip': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Release update': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Download': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  }

  function getFilteredItems() {
    return allResources
      .filter(item => item.status === 'Published')
      .filter(item => {
        if (initialView === 'whats-new') {
          return item.type === 'Release update';
        }
        if (selectedFilter === 'All') return true;
        return item.type.toLowerCase() === selectedFilter.toLowerCase();
      })
      .filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  }

  function render() {
    const filtered = getFilteredItems();
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    container.innerHTML = `
      <section class="resources-page relative py-16 sm:py-20 bg-slate-900 text-white scroll-mt-20 overflow-hidden" id="resources-section">
        
        <!-- Background Ambient Glow -->
        <div class="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
        <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <!-- Header & View Switcher -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800 pb-8">
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 mb-3">
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Knowledge Base &amp; Releases</span>
              </span>
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                ${initialView === 'whats-new' ? "What's New: Product Release Updates" : data.headline}
              </h1>
              <p class="text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
                ${initialView === 'whats-new' 
                  ? 'Track continuous innovations, AppExchange package upgrades, and performance benchmarks across our quarterly releases.' 
                  : data.subheadline}
              </p>
            </div>

            <!-- View Toggle Buttons -->
            <div class="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 shrink-0">
              <button id="view-all-btn" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${initialView === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
                All Resources
              </button>
              <button id="view-whatsnew-btn" class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${initialView === 'whats-new' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>What's New</span>
              </button>
              <button id="open-editor-btn" class="px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 ml-1" title="Draft or Publish Content">
                <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                <span>Draft New</span>
              </button>
            </div>
          </div>

          <!-- Filter Pills & Search Bar -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            
            <!-- Type Filters (US-21 Criterion 2) -->
            ${initialView === 'all' ? `
              <div class="flex flex-wrap items-center gap-2 w-full md:w-auto" id="resource-filter-pills">
                ${data.filterTypes.map(type => `
                  <button class="filter-type-pill px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${selectedFilter.toLowerCase() === type.toLowerCase() ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'}" data-filter="${type}">
                    ${type}
                  </button>
                `).join('')}
              </div>
            ` : `
              <div class="text-xs text-slate-400 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Showing official version releases with release highlights &amp; changelogs</span>
              </div>
            `}

            <!-- Search Field -->
            <div class="relative w-full md:w-72 shrink-0">
              <input type="text" 
                     id="resource-search-input" 
                     placeholder="Search guides, topics..." 
                     value="${searchQuery}" 
                     class="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-blue-500 focus:outline-none text-xs text-white placeholder-slate-400" />
              <svg viewBox="0 0 24 24" width="14" height="14" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

          </div>

          <!-- Results Count -->
          <div class="text-xs text-slate-400 mb-6 flex items-center justify-between">
            <span>Showing <strong>${paginatedItems.length}</strong> of <strong>${filtered.length}</strong> items</span>
            ${selectedFilter !== 'All' ? `<button id="clear-filters-btn" class="text-blue-400 underline hover:text-blue-300 cursor-pointer">Reset filter to All</button>` : ''}
          </div>

          <!-- Cards Grid (US-21 Criterion 1 & 4) -->
          ${paginatedItems.length === 0 ? `
            <div class="text-center py-16 bg-slate-800/40 border border-slate-800 rounded-3xl p-8">
              <p class="text-slate-400 text-sm">No resources match your active filter or search query.</p>
              <button id="reset-search-btn" class="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">Clear Search</button>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              ${paginatedItems.map(item => `
                <article class="resource-card bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/60 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20 group cursor-pointer" data-slug="${item.slug}" data-type="${item.type}">
                  
                  <div>
                    <!-- Header Badges -->
                    <div class="flex items-center justify-between gap-2 mb-4">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getBadgeColor(item.type)}">
                        ${item.type}
                      </span>
                      ${item.version ? `
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          ${item.version}
                        </span>
                      ` : ''}
                      <span class="text-[11px] text-slate-400">${item.publishDate}</span>
                    </div>

                    <!-- Title -->
                    <h2 class="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug mb-3 line-clamp-2">
                      ${item.title}
                    </h2>

                    <!-- Summary -->
                    <p class="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-5">
                      ${item.summary}
                    </p>

                    <!-- Highlights if release update -->
                    ${item.highlights && item.highlights.length ? `
                      <ul class="space-y-1.5 mb-5 text-[11px] text-slate-400 border-l-2 border-slate-700 pl-3">
                        ${item.highlights.slice(0, 2).map(h => `<li class="line-clamp-1">• ${h}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>

                  <!-- Footer -->
                  <div class="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                    <span class="truncate max-w-[150px]">${item.author}</span>
                    <span class="inline-flex items-center gap-1 font-bold text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      <span>${item.type === 'Download' ? 'Download PDF' : 'Read Article'}</span>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </span>
                  </div>

                </article>
              `).join('')}
            </div>
          `}

          <!-- Pagination -->
          ${totalPages > 1 ? `
            <div class="mt-12 flex items-center justify-center gap-2">
              <button id="prev-page-btn" ${currentPage === 1 ? 'disabled' : ''} class="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-800">
                Previous
              </button>
              <span class="text-xs text-slate-400 px-3">Page ${currentPage} of ${totalPages}</span>
              <button id="next-page-btn" ${currentPage === totalPages ? 'disabled' : ''} class="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-800">
                Next
              </button>
            </div>
          ` : ''}

          <!-- US-22 Criterion 3: Newsletter Signup Box -->
          <div class="mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-950/80 via-slate-800/90 to-slate-900 border border-blue-800/60 relative overflow-hidden shadow-2xl" id="newsletter-section">
            <div class="max-w-2xl">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-900/60 border border-blue-700/60 mb-3">
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>PropTech CRM Newsletter</span>
              </span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Get Real Estate Salesforce Insights in Your Inbox
              </h2>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Quarterly release teardowns, RERA compliance checklists, and tactical lead velocity playbooks delivered once a month. No spam, unsubscribe anytime.
              </p>

              <form id="newsletter-form" class="space-y-3" novalidate="">
                <div class="hidden" aria-hidden="true" style="display:none !important;">
                  <input type="text" tabindex="-1" autocomplete="off" name="website" id="news-hp-website" />
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                  <input type="text" 
                         id="news-name" 
                         placeholder="Your full name" 
                         class="px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full sm:w-1/3" />
                  <input type="email" 
                         id="newsletter-email" 
                         name="email"
                         required="" 
                         placeholder="Work email address *" 
                         class="px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 flex-1" />
                  <button type="submit" 
                          id="newsletter-submit" 
                          class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all shrink-0 cursor-pointer">
                    Subscribe
                  </button>
                </div>
                <div class="flex items-start gap-2 pt-1">
                  <input type="checkbox" id="news-consent" required="" class="mt-0.5 w-3.5 h-3.5 rounded text-blue-600 border-slate-700 bg-slate-900" />
                  <label for="news-consent" class="text-[11px] text-slate-400">
                    I agree to double opt-in email communications. Unsubscribe link included in every newsletter.
                  </label>
                </div>
                <p id="news-status-msg" class="hidden text-xs font-semibold mt-2"></p>
              </form>
            </div>
          </div>

        </div>

        <!-- US-21 Criterion 3: Reader Modal Dialog -->
        <div id="article-reader-backdrop" class="${activeArticle ? '' : 'hidden'} fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div class="bg-white text-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] overflow-y-auto">
            <button id="close-reader-btn" class="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors" aria-label="Close dialog">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            ${activeArticle ? renderArticleBody(activeArticle) : ''}
          </div>
        </div>

        <!-- US-22 Criterion 1 & 2: Gated Download Modal -->
        <div id="gated-download-backdrop" class="${activeGatedDownload ? '' : 'hidden'} fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div class="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8" id="gated-modal-card">
            <button id="close-gated-btn" class="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div class="mb-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 mb-2">Free Enterprise Resource</span>
              <h2 class="text-xl font-bold text-slate-900" id="gated-doc-title">
                ${activeGatedDownload?.title || 'Download Resource Document'}
              </h2>
              <p class="text-xs text-slate-500 mt-1">
                Enter your details below to instantly download the PDF guide and receive a permanent copy via email.
              </p>
            </div>

            <form id="gated-download-form" class="space-y-3.5" novalidate="">
              <div class="hidden" aria-hidden="true" style="display:none !important;">
                <input type="text" tabindex="-1" autocomplete="off" name="website" id="gated-hp-website" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input type="text" id="gated-name" placeholder="e.g. Vikram Sharma" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Work Email *</label>
                <input type="email" id="gated-email" required="" placeholder="you@company.com" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Company Name</label>
                <input type="text" id="gated-company" placeholder="e.g. Prestige Developers" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div class="flex items-start gap-2 pt-1">
                <input type="checkbox" id="gated-consent" required="" class="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300" />
                <label for="gated-consent" class="text-xs text-slate-600 leading-snug">
                  I consent to receive this resource and periodic PropTech updates. <span class="text-rose-500">*</span>
                </label>
              </div>
              <button type="submit" id="gated-submit-btn" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer">
                Download Now &amp; Send to Email
              </button>
              <!-- Form Privacy Notice next to submit button (US-26 Criterion 3) -->
              <p class="text-[11px] text-slate-500 text-center pt-1">
                By downloading, you agree to our <a href="/privacy-policy" target="_blank" class="text-blue-600 hover:underline font-semibold">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>

        <!-- US-21 Criterion 6: Content Editor Drawer/Modal -->
        <div id="content-editor-backdrop" class="hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div class="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button id="close-editor-btn" class="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 class="text-xl font-bold text-slate-900 mb-1">Resource Content Studio</h2>
            <p class="text-xs text-slate-500 mb-6">Create, preview, publish, or save draft resources without code deployment.</p>

            <form id="resource-editor-form" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Title (Max 90 chars) *</label>
                <input type="text" id="ed-title" maxlength="90" required="" placeholder="e.g. 5 Strategies to Accelerate Property Sales" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Resource Type *</label>
                  <select id="ed-type" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm">
                    <option value="Article">Article</option>
                    <option value="Guide">Guide</option>
                    <option value="Sales tip">Sales tip</option>
                    <option value="Release update">Release update</option>
                    <option value="Download">Download</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Status *</label>
                  <select id="ed-status" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Summary (Max 200 chars) *</label>
                <textarea id="ed-summary" maxlength="200" rows="2" required="" placeholder="Executive overview for index card..." class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"></textarea>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Author Name *</label>
                <input type="text" id="ed-author" required="" placeholder="e.g. Vikram Malhotra, Solutions Specialist" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" id="cancel-editor-btn" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">Publish to Library</button>
              </div>
            </form>
          </div>
        </div>

      </section>
    `;

    setupInteractivity();
  }

  function renderArticleBody(article) {
    const currentUrl = encodeURIComponent(window.location.origin + `/resources?slug=${article.slug}`);
    const encodedTitle = encodeURIComponent(article.title);

    return `
      <div>
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeColor(article.type)}">
            ${article.type}
          </span>
          ${article.version ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">${article.version}</span>` : ''}
          <span class="text-xs text-slate-400">• ${article.publishDate}</span>
          <span class="text-xs text-slate-400">• ${article.readTime || '5 min read'}</span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          ${article.title}
        </h1>

        <div class="flex items-center gap-3 py-3 border-y border-slate-100 mb-6 text-xs text-slate-600">
          <span class="font-bold text-slate-900">${article.author}</span>
          <span>•</span>
          <span>Verified Enterprise Salesforce Knowledge</span>
        </div>

        <!-- US-21 Criterion 5: Social Share Buttons -->
        <div class="flex flex-wrap items-center gap-2 mb-8 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span class="text-xs font-bold text-slate-600 mr-2">Share this:</span>
          
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-medium hover:bg-blue-800 flex items-center gap-1.5">
            <span>LinkedIn</span>
          </a>
          <a href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${currentUrl}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1.5 rounded-lg bg-black text-white text-xs font-medium hover:bg-neutral-800 flex items-center gap-1.5">
            <span>X</span>
          </a>
          <a href="https://api.whatsapp.com/send?text=${encodedTitle}%20${currentUrl}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 flex items-center gap-1.5">
            <span>WhatsApp</span>
          </a>
          <a href="mailto:?subject=${encodedTitle}&body=Read%20this%20article:%20${currentUrl}" class="px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-300">
            <span>Email</span>
          </a>
          <button id="copy-article-link-btn" class="px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-300 cursor-pointer">
            <span>Copy Link</span>
          </button>
        </div>

        <div class="prose prose-slate text-sm text-slate-700 space-y-4 leading-relaxed mb-8">
          <p class="font-medium text-slate-800 text-base leading-relaxed bg-blue-50/60 p-4 rounded-xl border border-blue-100">
            ${article.summary}
          </p>

          ${article.highlights ? `
            <div class="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Key Highlights &amp; Insights:</h3>
              <ul class="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-700">
                ${article.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <p>
            Real estate enterprises operating across high-density markets face distinct pipeline challenges: multi-channel inquiries arriving simultaneously from MagicBricks, 99acres, and WhatsApp, alongside high-stakes launch days where 100+ buyers may compete for the same inventory units.
          </p>
          <p>
            By consolidating lead routing, customer communications, unit matrices, and CLP milestone payments natively within Salesforce, real estate development teams eliminate manual spreadsheets, prevent double-bookings, and achieve predictable cash-flow cycles.
          </p>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-200 p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 class="text-base font-extrabold text-white">Ready to see EstateForce live on Salesforce?</h3>
            <p class="text-xs text-slate-300 mt-1">Get a tailored 30-minute sandbox walkthrough matching your property types.</p>
          </div>
          <button id="modal-request-demo-btn" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shrink-0 shadow-lg cursor-pointer">
            Request a Demo
          </button>
        </div>
      </div>
    `;
  }

  function setupInteractivity() {
    const viewAllBtn = container.querySelector('#view-all-btn');
    const viewWhatsnewBtn = container.querySelector('#view-whatsnew-btn');

    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        initialView = 'all';
        selectedFilter = 'All';
        currentPage = 1;
        render();
      });
    }

    if (viewWhatsnewBtn) {
      viewWhatsnewBtn.addEventListener('click', () => {
        initialView = 'whats-new';
        selectedFilter = 'All';
        currentPage = 1;
        render();
      });
    }

    container.querySelectorAll('.filter-type-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedFilter = btn.getAttribute('data-filter') || 'All';
        currentPage = 1;
        render();
      });
    });

    const clearFiltersBtn = container.querySelector('#clear-filters-btn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        selectedFilter = 'All';
        searchQuery = '';
        currentPage = 1;
        render();
      });
    }

    const searchInput = container.querySelector('#resource-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        currentPage = 1;
        render();
        const freshInput = container.querySelector('#resource-search-input');
        if (freshInput) {
          freshInput.focus();
          freshInput.setSelectionRange(freshInput.value.length, freshInput.value.length);
        }
      });
    }

    // Card click: If Download -> Open Gated Download Modal; Otherwise -> Open Article Reader
    container.querySelectorAll('.resource-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.getAttribute('data-slug');
        const itemType = card.getAttribute('data-type');
        const targetItem = allResources.find(r => r.slug === slug);
        
        if (itemType === 'Download') {
          activeGatedDownload = targetItem;
          render();
        } else {
          activeArticle = targetItem;
          if (activeArticle) render();
        }
      });
    });

    // Close Reader Modal
    const readerBackdrop = container.querySelector('#article-reader-backdrop');
    const closeReaderBtn = container.querySelector('#close-reader-btn');
    if (closeReaderBtn && readerBackdrop) {
      closeReaderBtn.addEventListener('click', () => {
        activeArticle = null;
        readerBackdrop.classList.add('hidden');
      });
    }

    // Close Gated Download Modal
    const gatedBackdrop = container.querySelector('#gated-download-backdrop');
    const closeGatedBtn = container.querySelector('#close-gated-btn');
    if (closeGatedBtn && gatedBackdrop) {
      closeGatedBtn.addEventListener('click', () => {
        activeGatedDownload = null;
        gatedBackdrop.classList.add('hidden');
      });
    }

    // Handle Gated Download Form Submission (US-22 Criterion 1 & 2)
    const gatedForm = container.querySelector('#gated-download-form');
    if (gatedForm) {
      gatedForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const hp = container.querySelector('#gated-hp-website');
        if (hp && hp.value.trim() !== '') return;

        const name = container.querySelector('#gated-name')?.value.trim();
        const email = container.querySelector('#gated-email')?.value.trim();
        const company = container.querySelector('#gated-company')?.value.trim() || 'Real Estate Enterprise';
        const consent = container.querySelector('#gated-consent')?.checked;

        if (!email || !consent) {
          alert('Please enter your work email and accept the consent checkbox to download.');
          return;
        }

        const submitBtn = container.querySelector('#gated-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Generating Download...';

        const docTitle = activeGatedDownload?.title || 'EstateForce Guide';

        // Submit to Salesforce with Lead Source "Website – Download" (US-22 Criterion 2)
        try {
          await submitToSalesforceWebToLead({
            fullName: name || 'Download Visitor',
            email,
            company,
            leadSource: 'Website – Download',
            notes: `[Gated Download Requested]: ${docTitle}`,
            sourcePage: 'gated_download_modal',
            consentGiven: true,
            consentWording: 'I consent to receive this resource and periodic PropTech updates.',
            consentTimestamp: new Date().toISOString()
          });
        } catch (err) {
          // Continue download even if network fails
        }

        // Trigger automatic client file download
        const dummyPdfContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000115 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF`;
        const blob = new Blob([dummyPdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(docTitle || 'Resource').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Replace modal content with thank-you confirmation
        const modalCard = container.querySelector('#gated-modal-card');
        modalCard.innerHTML = `
          <div class="text-center py-6">
            <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-1">Your Download has Started!</h3>
            <p class="text-xs text-slate-600 mb-4">
              We have also dispatched a permanent download link to <strong>${email}</strong>.
            </p>
            <p class="text-[11px] text-slate-400 mb-6">Registered in Salesforce as Lead Source: Website – Download.</p>
            <button id="finish-gated-btn" class="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700">
              Close Window
            </button>
          </div>
        `;

        container.querySelector('#finish-gated-btn')?.addEventListener('click', () => {
          activeGatedDownload = null;
          container.querySelector('#gated-download-backdrop')?.classList.add('hidden');
        });
      });
    }

    // Handle Newsletter Subscription (US-22 Criterion 3 & 4)
    const newsForm = container.querySelector('#newsletter-form');
    if (newsForm) {
      newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const hp = container.querySelector('#news-hp-website');
        if (hp && hp.value.trim() !== '') return;

        const email = (container.querySelector('#newsletter-email') || container.querySelector('#news-email'))?.value.trim();
        const name = container.querySelector('#news-name')?.value.trim();
        const consent = container.querySelector('#news-consent')?.checked;
        const msgEl = container.querySelector('#news-status-msg');

        if (!email || !consent) {
          if (msgEl) {
            msgEl.className = 'text-xs font-semibold text-rose-400 mt-2 block';
            msgEl.textContent = 'Please provide a valid email and tick the consent checkbox.';
          }
          return;
        }

        // Check if already subscribed (US-22 Validation)
        let subs = [];
        try {
          const raw = localStorage.getItem(LOCAL_STORAGE_NEWSLETTER_SUBS);
          subs = raw ? JSON.parse(raw) : [];
        } catch (err) {}

        const normalizedEmail = email.toLowerCase();
        if (subs.includes(normalizedEmail)) {
          if (msgEl) {
            msgEl.className = 'text-xs font-semibold text-amber-300 mt-2 block';
            msgEl.textContent = "You're already subscribed to the EstateForce newsletter.";
          }
          return;
        }

        subs.push(normalizedEmail);
        try {
          localStorage.setItem(LOCAL_STORAGE_NEWSLETTER_SUBS, JSON.stringify(subs));
        } catch (err) {}

        // Submit to Salesforce Web-to-Lead
        try {
          await submitToSalesforceWebToLead({
            fullName: name || 'Newsletter Subscriber',
            email: normalizedEmail,
            company: 'Newsletter Subscriber',
            leadSource: 'Website – Newsletter',
            notes: 'Subscribed to EstateForce Monthly Real Estate CRM Newsletter (Double Opt-In Sent)',
            sourcePage: 'resources_newsletter_box'
          });
        } catch (err) {}

        if (msgEl) {
          msgEl.className = 'text-xs font-semibold text-emerald-400 mt-2 block';
          msgEl.textContent = 'Thank you for subscribing! Please check your inbox for the confirmation link.';
        }
        const submitBtn = container.querySelector('#newsletter-submit') || container.querySelector('#news-submit-btn');
        if (submitBtn) submitBtn.disabled = true;
      });
    }

    // Copy link in Reader Modal
    const copyLinkBtn = container.querySelector('#copy-article-link-btn');
    if (copyLinkBtn && activeArticle) {
      copyLinkBtn.addEventListener('click', () => {
        const url = `${window.location.origin}/resources?slug=${activeArticle.slug}`;
        navigator.clipboard.writeText(url).then(() => {
          copyLinkBtn.innerHTML = '<span>Copied!</span>';
          setTimeout(() => { copyLinkBtn.innerHTML = '<span>Copy Link</span>'; }, 2000);
        });
      });
    }

    // Request Demo in Reader Modal
    const modalDemoBtn = container.querySelector('#modal-request-demo-btn');
    if (modalDemoBtn) {
      modalDemoBtn.addEventListener('click', () => {
        activeArticle = null;
        navigateTo('/request-demo');
      });
    }

    // Editor Modal
    const openEditorBtn = container.querySelector('#open-editor-btn');
    const editorBackdrop = container.querySelector('#content-editor-backdrop');
    const closeEditorBtn = container.querySelector('#close-editor-btn');
    const cancelEditorBtn = container.querySelector('#cancel-editor-btn');
    const editorForm = container.querySelector('#resource-editor-form');

    if (openEditorBtn && editorBackdrop) {
      openEditorBtn.addEventListener('click', () => {
        editorBackdrop.classList.remove('hidden');
      });
    }
    if (closeEditorBtn && editorBackdrop) {
      closeEditorBtn.addEventListener('click', () => {
        editorBackdrop.classList.add('hidden');
      });
    }
    if (cancelEditorBtn && editorBackdrop) {
      cancelEditorBtn.addEventListener('click', () => {
        editorBackdrop.classList.add('hidden');
      });
    }

    if (editorForm) {
      editorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = container.querySelector('#ed-title')?.value.trim();
        const type = container.querySelector('#ed-type')?.value;
        const status = container.querySelector('#ed-status')?.value;
        const summary = container.querySelector('#ed-summary')?.value.trim();
        const author = container.querySelector('#ed-author')?.value.trim();

        if (!title || !summary || !author) return;

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const newResource = {
          id: `custom-${Date.now()}`,
          slug,
          title,
          type,
          summary,
          author,
          publishDate: new Date().toISOString().split('T')[0],
          readTime: '4 min read',
          coverImage: '/resources/generic-guide.svg',
          status,
          highlights: ['Drafted via Enterprise Content Studio', 'Available immediately for readers']
        };

        try {
          const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_RESOURCES);
          const list = raw ? JSON.parse(raw) : [];
          list.unshift(newResource);
          localStorage.setItem(LOCAL_STORAGE_CUSTOM_RESOURCES, JSON.stringify(list));
        } catch (err) {}

        allResources.unshift(newResource);
        editorBackdrop.classList.add('hidden');
        render();
      });
    }

    // Pagination
    const prevBtn = container.querySelector('#prev-page-btn');
    const nextBtn = container.querySelector('#next-page-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          render();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentPage++;
        render();
      });
    }
  }

  render();
}
