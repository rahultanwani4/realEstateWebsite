import siteConfig from '../data/site-config.json';
import { navigateTo } from '../router.js';

/**
 * US-23 FAQ Page Component
 * 
 * Criteria:
 * 1. Topics: Product, Salesforce requirements, Set-up, Data migration, Pricing, Security, Support.
 * 2. Answers expand and collapse by click or keyboard.
 * 3. Search box at the top filters questions and answers as the visitor types, highlighting matches.
 *    (Search starts after 2 characters; ignores case and extra spaces).
 * 4. No results shows links to Contact Us and Request a Demo.
 * 5. Page ends with "Still have questions? Request a demo or contact us."
 * 6. Business team can add, edit, reorder, and remove FAQs via interactive manager.
 */

const LOCAL_STORAGE_CUSTOM_FAQS = 'estateforce_custom_faqs';

export function initFaqPage(mountTarget = '#faq-page-root') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = siteConfig.faqPage || {
    headline: 'Frequently Asked Questions',
    subheadline: 'Everything you need to know about EstateForce real estate package.',
    topics: ['Product', 'Salesforce requirements', 'Set-up', 'Data migration', 'Pricing', 'Security', 'Support'],
    faqs: []
  };

  // Load custom FAQs from local storage if available
  let allFaqs = [...data.faqs];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_FAQS);
    if (raw) {
      const customList = JSON.parse(raw);
      allFaqs = [...customList, ...allFaqs];
    }
  } catch (e) {
    // Ignore
  }

  let selectedTopic = 'All';
  let searchTerm = '';
  const expandedFaqIds = new Set();

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightMatch(text, term) {
    const cleanTerm = term.trim();
    if (!cleanTerm || cleanTerm.length < 2) return text;
    const regex = new RegExp(`(${escapeRegExp(cleanTerm)})`, 'gi');
    return text.replace(regex, '<mark class="bg-amber-200 text-slate-900 rounded px-1 py-0.5 font-bold">$1</mark>');
  }

  function getFilteredFaqs() {
    const cleanSearch = searchTerm.trim().toLowerCase();
    const shouldSearch = cleanSearch.length >= 2;

    return allFaqs
      .filter(f => f.status === 'Published')
      .filter(f => {
        if (selectedTopic === 'All') return true;
        return f.topic.toLowerCase() === selectedTopic.toLowerCase();
      })
      .filter(f => {
        if (!shouldSearch) return true;
        return (
          f.question.toLowerCase().includes(cleanSearch) ||
          f.answer.toLowerCase().includes(cleanSearch)
        );
      })
      .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  }

  function render() {
    const filteredFaqs = getFilteredFaqs();
    const hasSearch = searchTerm.trim().length >= 2;

    container.innerHTML = `
      <section class="faq-page relative py-16 sm:py-20 lg:py-24 bg-slate-900 text-white scroll-mt-20 overflow-hidden" id="faq-section">
        
        <!-- Ambient Background Glow -->
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <!-- Heading -->
          <div class="text-center mb-10 sm:mb-14">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 rounded-full mb-3">
              <span class="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Help Center &amp; Answers</span>
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              ${data.headline}
            </h1>
            <p class="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-2 leading-relaxed">
              ${data.subheadline}
            </p>

            <!-- Search Box (US-23 Criterion 3) -->
            <div class="mt-8 max-w-xl mx-auto relative">
              <input type="text" 
                     id="faq-search-input" 
                     value="${searchTerm}" 
                     placeholder="Search questions or answers (e.g. double-booking, RERA, pricing)..." 
                     class="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xl transition-all" />
              <svg viewBox="0 0 24 24" width="18" height="18" class="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              ${searchTerm ? `<button id="clear-faq-search" class="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-white font-bold p-1">✕</button>` : ''}
            </div>
            ${hasSearch ? `<p class="text-xs text-slate-400 mt-2">Showing results matching "<span class="text-blue-400">${searchTerm.trim()}</span>"</p>` : ''}
          </div>

          <!-- Topic Filter Tabs (US-23 Criterion 1) -->
          <div class="flex flex-wrap items-center justify-center gap-2 mb-10" id="faq-topic-filters">
            <button class="faq-topic-btn faq-topic-pill px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${selectedTopic === 'All' ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'}" data-topic="All">
              All Topics
            </button>
            ${data.topics.map(topic => `
              <button class="faq-topic-btn faq-topic-pill px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${selectedTopic.toLowerCase() === topic.toLowerCase() ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'}" data-topic="${topic}">
                ${topic}
              </button>
            `).join('')}
          </div>

          <!-- FAQ Accordion List -->
          ${filteredFaqs.length === 0 ? `
            <!-- No Results State (US-23 Criterion 4) -->
            <div class="text-center py-16 px-6 rounded-3xl bg-slate-800/40 border border-slate-800 max-w-xl mx-auto" id="faq-no-results">
              <div class="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h3 class="text-lg font-bold text-white mb-2">No matching questions found</h3>
              <p class="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                We couldn't find an answer matching your query. Our dedicated real estate CRM specialists are happy to assist directly.
              </p>
              <div class="flex flex-wrap items-center justify-center gap-3">
                <a href="/contact" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors">
                  Contact Us
                </a>
                <a href="/request-demo" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs transition-colors">
                  Request a Demo
                </a>
              </div>
            </div>
          ` : `
            <div class="space-y-4" id="faq-accordion-container">
              ${filteredFaqs.map(faq => {
                const isExpanded = expandedFaqIds.has(faq.id);
                return `
                  <div class="faq-item faq-item-card rounded-2xl border transition-all duration-150 ${isExpanded ? 'bg-slate-800/90 border-blue-500/60 shadow-lg' : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'}" id="${faq.id}">
                    <button type="button" 
                            class="faq-question-btn w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                            aria-expanded="${isExpanded}"
                            data-faq-id="${faq.id}">
                      <div class="flex items-center gap-3">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-slate-300">
                          ${faq.topic}
                        </span>
                        <span class="text-sm sm:text-base font-bold text-white leading-snug">
                          ${highlightMatch(faq.question, searchTerm)}
                        </span>
                      </div>
                      <span class="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-400 bg-blue-950' : ''}">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                    </button>
                    ${isExpanded ? `
                      <div class="faq-answer-panel px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-700/40">
                        ${highlightMatch(faq.answer, searchTerm)}
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          `}

          <!-- Closing Prompt (US-23 Criterion 5) -->
          <div class="mt-16 text-center py-10 px-6 rounded-3xl bg-blue-950/40 border border-blue-900/60">
            <h2 class="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Still have questions?
            </h2>
            <p class="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
              Our certified Salesforce real estate architects can demonstrate live workflows tailored to your specific project inventory.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-4">
              <a href="/request-demo" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all">
                Request a Demo
              </a>
              <a href="/contact" class="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs sm:text-sm transition-all">
                Contact Us
              </a>
            </div>
          </div>

        </div>

      </section>
    `;

    setupFaqInteractivity();
  }

  function setupFaqInteractivity() {
    // Topic filtering
    container.querySelectorAll('.faq-topic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedTopic = btn.getAttribute('data-topic') || 'All';
        render();
      });
    });

    // Search input
    const searchInput = container.querySelector('#faq-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        render();
        const freshInput = container.querySelector('#faq-search-input');
        if (freshInput) {
          freshInput.focus();
          freshInput.setSelectionRange(freshInput.value.length, freshInput.value.length);
        }
      });
    }

    const clearSearch = container.querySelector('#clear-faq-search');
    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        searchTerm = '';
        render();
      });
    }

    // Accordion expand / collapse
    container.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-faq-id');
        if (expandedFaqIds.has(id)) {
          expandedFaqIds.delete(id);
        } else {
          expandedFaqIds.add(id);
        }
        render();
      });
    });
  }

  render();
}
