/**
 * ImageLightbox.js
 * Provides full-resolution click-to-zoom inspection for all Salesforce product screenshots.
 * Resolves screenshot downscaling blur by allowing users to view real package UI in full 100% clarity.
 */

let activeLightboxEl = null;

export function openImageLightbox(imageSrc, imageAlt = 'Salesforce Package Screenshot') {
  if (activeLightboxEl) {
    activeLightboxEl.remove();
    activeLightboxEl = null;
  }

  activeLightboxEl = document.createElement('div');
  activeLightboxEl.id = 'screenshot-lightbox-overlay';
  activeLightboxEl.className = 'fixed inset-0 z-[9999] flex flex-col bg-slate-950/90 backdrop-blur-md p-3 sm:p-6 transition-opacity duration-200';
  activeLightboxEl.setAttribute('role', 'dialog');
  activeLightboxEl.setAttribute('aria-modal', 'true');
  activeLightboxEl.setAttribute('aria-label', imageAlt);

  activeLightboxEl.innerHTML = `
    <!-- Top Bar -->
    <div class="flex items-center justify-between pb-3 sm:pb-4 text-white border-b border-slate-800/80 shrink-0">
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Full Resolution View
        </span>
        <span class="text-xs sm:text-sm font-semibold text-slate-300 truncate max-w-[280px] sm:max-w-md">${imageAlt}</span>
      </div>

      <div class="flex items-center gap-2">
        <button type="button" 
                id="lightbox-close-btn" 
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700" 
                aria-label="Close screenshot modal">
          <span>Close (Esc)</span>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Image Viewer Area with Pan/Scroll -->
    <div class="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4 cursor-zoom-out" id="lightbox-backdrop-area">
      <div class="relative max-w-full max-h-full flex items-center justify-center">
        <img src="${imageSrc}" 
             alt="${imageAlt}" 
             id="lightbox-target-img"
             class="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-xl border border-slate-700/80 shadow-2xl transition-transform duration-200 select-none"
             style="image-rendering: auto;" />
      </div>
    </div>

    <!-- Bottom Help Text -->
    <div class="pt-2 text-center text-xs text-slate-400 shrink-0">
      <span>Tip: Click anywhere outside or press <kbd class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">Esc</kbd> to return</span>
    </div>
  `;

  document.body.appendChild(activeLightboxEl);
  document.body.style.overflow = 'hidden';

  const closeBtn = activeLightboxEl.querySelector('#lightbox-close-btn');
  const backdropArea = activeLightboxEl.querySelector('#lightbox-backdrop-area');
  const targetImg = activeLightboxEl.querySelector('#lightbox-target-img');

  function closeLightbox() {
    if (activeLightboxEl) {
      activeLightboxEl.remove();
      activeLightboxEl = null;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  }

  closeBtn.addEventListener('click', closeLightbox);
  backdropArea.addEventListener('click', (e) => {
    // Only close if clicked on backdrop, not directly on image
    if (e.target === backdropArea || e.target.id === 'lightbox-target-img') {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', handleKeyDown);
}

/**
 * Initializes global click delegates for all screenshot preview elements
 */
export function initImageLightbox() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.feature-screen-img, .feature-graphic-img, .dashboard-inner img, .who-audience-panel img');
    if (target && target.src) {
      // Don't open if clicking standard icons or SVGs unless it's a screenshot
      if (target.src.includes('/screenshots/') || target.src.includes('dashboard-hero')) {
        e.preventDefault();
        openImageLightbox(target.src, target.alt || 'Salesforce Package Screenshot');
      }
    }
  });
}
