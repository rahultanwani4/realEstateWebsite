import siteConfig from '../data/site-config.json';
import { navigateTo } from '../router.js';

/**
 * US-28 Product Video and Interactive Tour Component
 * 
 * Criteria:
 * 1. Video or animated walkthrough on Home and Features; poster image first, loads only when played, captions available.
 * 2. Guided click-through tour of Lead, Sales and Booking Management screens with hotspots and short captions.
 * 3. Tour moves by buttons, arrow keys or swipe, shows progress (e.g. 3 of 12) and ends with Request a Demo.
 * 4. Video plays and tour completions are recorded.
 * 5. Business team can replace video, screenshots and captions.
 */

let activeModalEl = null;

export function recordTourEvent(eventName, details = {}) {
  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...details
  };
  window.dispatchEvent(new CustomEvent('estateforce:tour_telemetry', { detail: eventData }));
  console.log(`[US-28 Telemetry] ${eventName}:`, eventData);
}

export function openProductTourModal(defaultArea = 'Lead') {
  if (activeModalEl) {
    activeModalEl.remove();
  }

  const tourData = siteConfig.productTour || {};
  const tours = tourData.tours || [];
  const video = tourData.video || {};

  let currentTab = defaultArea; // 'Lead', 'Sales', 'Booking', or 'Video'
  let currentStepIdx = 0;

  activeModalEl = document.createElement('div');
  activeModalEl.id = 'product-tour-modal-root';
  activeModalEl.className = 'product-tour-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto';
  activeModalEl.setAttribute('role', 'dialog');
  activeModalEl.setAttribute('aria-modal', 'true');
  activeModalEl.setAttribute('aria-label', 'Product Interactive Tour and Video');

  document.body.appendChild(activeModalEl);

  function render() {
    const isVideoTab = currentTab === 'Video';
    const activeTour = tours.find(t => t.area.toLowerCase() === currentTab.toLowerCase()) || tours[0];
    const steps = activeTour ? activeTour.steps : [];
    const currentStep = steps[currentStepIdx] || steps[0];
    const totalSteps = steps.length;
    const isLastStep = currentStepIdx === totalSteps - 1;

    activeModalEl.innerHTML = `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh]">
        
        <!-- Modal Top Bar -->
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">EstateForce Interactive Tour</span>
          </div>

          <!-- Area Switcher Pills -->
          <div class="inline-flex rounded-xl bg-slate-200/80 p-1 border border-slate-300/80 shadow-inner overflow-x-auto max-w-[65%] sm:max-w-none">
            ${tours.map(t => `
              <button type="button" 
                      data-tab="${t.area}"
                      class="tour-tab-btn px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${currentTab.toLowerCase() === t.area.toLowerCase() ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                ${t.name}
              </button>
            `).join('')}
            <button type="button" 
                    data-tab="Video"
                    class="tour-tab-btn px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${currentTab === 'Video' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Video (${video.durationDisplay || '2 min'})</span>
            </button>
          </div>

          <button type="button" 
                  id="close-tour-modal-btn" 
                  class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/80 transition-colors shrink-0" 
                  aria-label="Close interactive tour">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-center bg-slate-900/5">
          ${isVideoTab ? `
            <!-- Video Player Tab (loads video only upon user interaction per US-28) -->
            <div class="relative w-full rounded-2xl overflow-hidden shadow-lg bg-slate-950 aspect-video max-w-4xl mx-auto flex items-center justify-center" id="video-tour-container">
              <img src="${video.poster || '/screenshots/lead-management-preview.svg'}" 
                   alt="Video Tour Poster" 
                   class="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div class="relative z-10 text-center p-6 space-y-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold shadow-md">
                  ${video.badge || 'Official Product Tour'}
                </span>
                <h3 class="text-xl sm:text-2xl font-extrabold text-white max-w-lg mx-auto tracking-tight">
                  ${video.title || 'EstateForce in 2 Minutes'}
                </h3>
                <p class="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Captions available in English (VTT compliant). Video runtime: ${video.durationDisplay}.
                </p>
                <button type="button" 
                        id="play-tour-video-btn"
                        class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-sm shadow-xl hover:bg-blue-500 hover:scale-105 transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Play Walkthrough</span>
                </button>
              </div>
            </div>
          ` : `
            <!-- Interactive Hotspot Tour Tab -->
            <div class="relative w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-md max-w-4xl mx-auto" id="tour-screen-canvas">
              
              <!-- Simulated CRM Screenshot with Dynamic Hotspot -->
              <div class="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-100 overflow-hidden select-none">
                <img src="${currentStep.screenshot}" 
                     alt="${currentStep.title}" 
                     class="w-full h-full object-cover object-top" />
                
                <!-- Pulsing Interactive Hotspot Marker -->
                <div class="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer"
                     style="left: ${currentStep.hotspot?.x || 50}%; top: ${currentStep.hotspot?.y || 50}%;"
                     id="tour-hotspot-marker">
                  <div class="relative flex items-center justify-center">
                    <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>
                    <span class="relative inline-flex items-center justify-center rounded-full h-7 w-7 bg-blue-600 text-white font-black text-xs shadow-lg border-2 border-white">
                      ${currentStepIdx + 1}
                    </span>
                  </div>
                </div>

                <!-- Floating Caption Card positioned adjacent to hotspot -->
                <div class="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md bg-slate-900/90 backdrop-blur-md text-white p-5 rounded-2xl border border-slate-700 shadow-2xl z-20 space-y-3">
                  <div class="flex items-center justify-between text-xs text-blue-300 font-semibold">
                    <span class="uppercase tracking-wider font-bold">${activeTour.name}</span>
                    <span class="bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800 text-[11px] font-mono">
                      Step ${currentStepIdx + 1} of ${totalSteps}
                    </span>
                  </div>
                  <div>
                    <h4 class="text-base font-bold text-white tracking-tight">${currentStep.title}</h4>
                    <p class="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">${currentStep.caption}</p>
                  </div>

                  <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span class="text-slate-400 text-[11px] hidden sm:inline">Use arrow keys ← →</span>
                    <div class="flex items-center gap-2 ml-auto">
                      ${currentStepIdx > 0 ? `
                        <button type="button" 
                                id="tour-step-prev"
                                class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold transition-colors">
                          ← Back
                        </button>
                      ` : ''}

                      ${isLastStep ? `
                        <button type="button" 
                                id="tour-finish-cta"
                                class="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-bold shadow-md transition-colors inline-flex items-center gap-1.5">
                          <span>Request a Demo</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </button>
                      ` : `
                        <button type="button" 
                                id="tour-step-next"
                                class="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-bold shadow-md transition-colors inline-flex items-center gap-1">
                          <span>Next</span>
                          <span>→</span>
                        </button>
                      `}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          `}
        </div>

        <!-- Modal Bottom Progress Dots -->
        <div class="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div class="flex items-center gap-2">
            ${!isVideoTab ? steps.map((_, idx) => `
              <button type="button" 
                      data-step-idx="${idx}"
                      class="tour-dot-btn w-2.5 h-2.5 rounded-full transition-all ${idx === currentStepIdx ? 'w-6 bg-blue-600' : 'bg-slate-300 hover:bg-slate-400'}"
                      aria-label="Go to step ${idx + 1}"></button>
            `).join('') : `
              <span class="font-medium text-slate-600">Video Walkthrough (100% Native on Salesforce)</span>
            `}
          </div>

          <div class="flex items-center gap-3">
            <span class="text-slate-400 text-[11px]">Press ESC to close</span>
            <button type="button" 
                    id="tour-close-bottom" 
                    class="font-bold text-slate-600 hover:text-slate-900">
              Close
            </button>
          </div>
        </div>

      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    // Close modal
    const closeModal = () => {
      if (activeModalEl) {
        activeModalEl.remove();
        activeModalEl = null;
      }
      document.removeEventListener('keydown', keyListener);
    };

    activeModalEl.querySelector('#close-tour-modal-btn')?.addEventListener('click', closeModal);
    activeModalEl.querySelector('#tour-close-bottom')?.addEventListener('click', closeModal);

    // Tab buttons
    activeModalEl.querySelectorAll('.tour-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        if (tab) {
          currentTab = tab;
          currentStepIdx = 0;
          render();
        }
      });
    });

    // Step navigation
    activeModalEl.querySelector('#tour-step-next')?.addEventListener('click', () => {
      currentStepIdx++;
      render();
    });

    activeModalEl.querySelector('#tour-step-prev')?.addEventListener('click', () => {
      if (currentStepIdx > 0) {
        currentStepIdx--;
        render();
      }
    });

    // Finish tour and open demo
    activeModalEl.querySelector('#tour-finish-cta')?.addEventListener('click', () => {
      recordTourEvent('tour_completed', { area: currentTab });
      closeModal();
      navigateTo('/request-demo');
    });

    // Step dots
    activeModalEl.querySelectorAll('.tour-dot-btn').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-step-idx'), 10);
        if (!isNaN(idx)) {
          currentStepIdx = idx;
          render();
        }
      });
    });

    // Video play
    activeModalEl.querySelector('#play-tour-video-btn')?.addEventListener('click', () => {
      recordTourEvent('video_played', { videoTitle: video.title });
      const videoContainer = activeModalEl.querySelector('#video-tour-container');
      if (videoContainer) {
        videoContainer.innerHTML = `
          <iframe class="w-full h-full border-0" 
                  src="${video.videoUrl}?autoplay=1&rel=0&modestbranding=1" 
                  title="${video.title}" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen></iframe>
        `;
      }
    });
  }

  // Keyboard navigation
  const keyListener = (e) => {
    if (e.key === 'Escape') {
      if (activeModalEl) {
        activeModalEl.remove();
        activeModalEl = null;
      }
      document.removeEventListener('keydown', keyListener);
    } else if (e.key === 'ArrowRight') {
      const activeTour = tours.find(t => t.area.toLowerCase() === currentTab.toLowerCase());
      if (activeTour && currentStepIdx < activeTour.steps.length - 1) {
        currentStepIdx++;
        render();
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentStepIdx > 0) {
        currentStepIdx--;
        render();
      }
    }
  };

  document.addEventListener('keydown', keyListener);
  render();
}
