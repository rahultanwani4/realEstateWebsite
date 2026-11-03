import siteConfig from '../data/site-config.json';

/**
 * Live Demo Section Component
 * 
 * Features:
 * - Single-page anchor target (#live-demo)
 * - HTML5 Video player supporting full stereo audio playback
 * - WebVTT Closed Captions (<track kind="captions">) support
 * - Dynamic synchronized caption overlay
 * - Interactive chapter markers to jump between CRM topics
 * - Fallback interactive walkthrough if local mp4 is not yet uploaded
 * - Sleek SurveyResults.online enterprise styling
 */
export function initLiveDemoSection(mountTarget = '#live-demo') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const data = siteConfig.liveDemo || {
    badge: 'Interactive Product Showcase',
    headline: 'See EstateForce in Action',
    subheadline: 'Watch how our native Salesforce package automates lead management, accelerates deal velocity, and simplifies unit bookings in real time.',
    video: {
      title: 'EstateForce End-to-End Real Estate Tour',
      poster: '/dashboard-hero.webp',
      src: '/demo-video.mp4',
      captionsSrc: '/demo-captions.vtt',
      durationDisplay: '4:30 min'
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Overview & Salesforce Native Setup' },
      { time: '01:05', seconds: 65, title: 'Lead Capture & WhatsApp Automation' },
      { time: '02:18', seconds: 138, title: 'Pipeline Deals & Site Visits' },
      { time: '03:30', seconds: 210, title: 'Unit Inventory & Booking Voucher' },
      { time: '04:15', seconds: 255, title: 'Executive Dashboards & Reports' }
    ]
  };

  container.innerHTML = `
    <section class="live-demo-section relative pt-10 pb-16 sm:pt-12 sm:pb-20 bg-slate-900 text-white overflow-hidden" id="live-demo-section">
      
      <!-- Background Ambient Grid and Gradient -->
      <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image: linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px); background-size: 56px 56px;" aria-hidden="true"></div>
      <div class="absolute -top-48 -right-48 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
      <div class="absolute -bottom-48 -left-48 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 rounded-full mb-3">
            <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>${data.badge || 'Live Product Showcase'}</span>
          </div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ${data.headline || 'Experience CC Real Estate Live'}
          </h2>
          <p class="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            ${data.subheadline || 'Watch a guided walkthrough of our native Salesforce package managing real estate leads, pipeline stages, and unit bookings with zero manual friction.'}
          </p>

          <!-- Audio & Captions Confirmation Strip -->
          <div class="mt-6 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300 bg-slate-800/80 border border-slate-700/80 rounded-full px-4 py-2">
            <span class="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <span>Audio Supported (Narration)</span>
            </span>
            <span class="text-slate-600">•</span>
            <span class="flex items-center gap-1.5 text-blue-400 font-semibold">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M10 9H8a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2M16 9h-2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2"></path>
              </svg>
              <span>Closed Captions (WebVTT .vtt)</span>
            </span>
            <span class="text-slate-600">•</span>
            <span class="flex items-center gap-1.5 text-amber-300 font-semibold">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${data.video?.durationDisplay || '4:30 min'} Tour</span>
            </span>
          </div>
        </div>

        <!-- Video Player Card Container -->
        <div class="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-w-5xl mx-auto" id="video-showcase-card">
          
          <!-- Browser / App Header Bar -->
          <div class="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span class="ml-2 font-mono text-slate-300 hidden sm:inline">EstateForce Guided Tour • 100% Native on Salesforce</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[11px] bg-blue-900/50 border border-blue-700/50 text-blue-300 px-2.5 py-0.5 rounded-full font-medium">
                HD 1080p
              </span>
            </div>
          </div>

          <!-- Video Viewport Frame -->
          <div class="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden" id="video-frame-container">
            
            <!-- Real HTML5 Video Element with Sound & WebVTT Captions -->
            <video 
              id="live-demo-video-tag" 
              class="w-full h-full object-cover" 
              controls 
              playsinline
              preload="metadata"
              poster="${data.video?.poster || '/dashboard-hero.webp'}"
              aria-label="EstateForce Guided Product Tour Video with Audio and Closed Captions">
              <source src="${data.video?.src || '/demo-video.mp4'}" type="video/mp4" />
              <track 
                id="live-demo-captions-track"
                kind="captions" 
                src="${data.video?.captionsSrc || '/demo-captions.vtt'}" 
                srclang="en" 
                label="English Captions" 
                default />
              Your browser does not support HTML5 video with audio and subtitles.
            </video>

            <!-- Video Poster / Launch Overlay (Before play) -->
            <div class="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center transition-all duration-300 cursor-pointer" id="video-play-overlay">
              <button 
                type="button" 
                id="btn-trigger-demo-play" 
                class="group flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/40"
                aria-label="Play product walkthrough video with sound and captions">
                <svg class="w-9 h-9 sm:w-10 sm:h-10 ml-1.5 fill-current text-white transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
              
              <h3 class="mt-5 text-xl sm:text-2xl font-bold text-white tracking-tight">
                ${data.video?.title || 'Watch Complete Package Walkthrough'}
              </h3>
              <p class="mt-2 text-xs sm:text-sm text-slate-300 max-w-md">
                Click to play with full audio narration and live closed captions (${data.video?.durationDisplay || '4:30 min'}).
              </p>
            </div>

            <!-- Synced Dynamic Captions Overlay Banner (Displayed during play) -->
            <div id="dynamic-captions-box" class="absolute bottom-14 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg max-w-xl text-center pointer-events-none border border-slate-700/80 shadow-lg opacity-0 transition-opacity duration-200 z-20">
              <span id="dynamic-captions-text">EstateForce: Native Salesforce Real Estate Package</span>
            </div>
          </div>

          <!-- Video Chapters Bar -->
          <div class="bg-slate-900 border-t border-slate-800 p-3 sm:p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                <span>Jump to Chapter:</span>
              </span>
              <span class="text-[11px] text-slate-500">Click any topic to skip ahead</span>
            </div>

            <div class="flex flex-wrap gap-2" id="video-chapters-list">
              ${(data.chapters || []).map((ch, idx) => `
                <button 
                  type="button" 
                  class="video-chapter-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700/80 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors ${idx === 0 ? 'border-blue-500 text-blue-300' : ''}" 
                  data-seconds="${ch.seconds}">
                  <span class="font-mono text-blue-400 text-[11px] font-bold">${ch.time}</span>
                  <span>${ch.title}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Bottom Actions Strip -->
          <div class="bg-slate-950 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <div class="text-xs text-slate-400 text-center sm:text-left">
              <p class="font-semibold text-slate-200">Want to test CC Real Estate with your own real estate projects?</p>
              <p class="text-slate-500 mt-0.5">We can install a live trial package directly into your Salesforce Sandbox in 24 hours.</p>
            </div>
            <a href="#contact" class="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0">
              <span>Schedule 1-on-1 Sandbox Walkthrough</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  `;

  setupLiveDemoInteractivity(container, data);
}

/**
 * Handles play, captions, chapter scrubbing and fallback tour simulation
 */
function setupLiveDemoInteractivity(container, data) {
  const video = container.querySelector('#live-demo-video-tag');
  const overlay = container.querySelector('#video-play-overlay');
  const triggerBtn = container.querySelector('#btn-trigger-demo-play');
  const captionsBox = container.querySelector('#dynamic-captions-box');
  const captionsText = container.querySelector('#dynamic-captions-text');
  const chapterBtns = container.querySelectorAll('.video-chapter-btn');

  // Scripted Fallback Captions & Timings for Demonstration
  const captionScript = [
    { start: 0, end: 4, text: "Welcome to EstateForce - the premier real estate CRM built natively on Salesforce." },
    { start: 4, end: 9, text: "Eliminate fragmented spreadsheets and unify your entire property sales lifecycle in one place." },
    { start: 9, end: 15, text: "Portal enquiries from 99acres, MagicBricks, Housing, and WhatsApp flow directly into Lightning Leads." },
    { start: 15, end: 21, text: "Automated round-robin distribution assigns incoming buyers to available sales executives in real time." },
    { start: 21, end: 27, text: "Track deals through customized property stages: from site visit scheduled to pricing negotiation." },
    { start: 27, end: 33, text: "Our interactive unit inventory matrix displays live tower, floor, and flat availability instantly." },
    { start: 33, end: 40, text: "Block units, calculate milestone payment schedules, and generate stamped booking vouchers with one click." },
    { start: 40, end: 47, text: "Executive dashboards deliver real-time visibility into inventory turnover, team velocity, and revenue." },
    { start: 47, end: 55, text: "Ready to test EstateForce in your own Salesforce org? Click below to request a guided sandbox demo." }
  ];

  function startPlayback() {
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }

    if (video) {
      video.play().catch(err => {
        console.log('[LiveDemo] Local video file playback notice:', err.message);
        // If local mp4 is not yet in /public, start interactive simulation
        startSimulatedTour();
      });
    }
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startPlayback();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      startPlayback();
    });
  }

  // Update dynamic captions on video timeupdate
  if (video) {
    video.addEventListener('timeupdate', () => {
      const cur = video.currentTime;
      const currentCaption = captionScript.find(c => cur >= c.start && cur <= c.end);
      if (currentCaption && captionsBox && captionsText) {
        captionsText.textContent = currentCaption.text;
        captionsBox.style.opacity = '1';
      } else if (captionsBox) {
        captionsBox.style.opacity = '0';
      }

      // Highlight active chapter
      let activeIdx = 0;
      data.chapters?.forEach((ch, idx) => {
        if (cur >= ch.seconds) activeIdx = idx;
      });
      chapterBtns.forEach((btn, idx) => {
        if (idx === activeIdx) {
          btn.classList.add('border-blue-500', 'text-blue-300');
        } else {
          btn.classList.remove('border-blue-500', 'text-blue-300');
        }
      });
    });

    video.addEventListener('ended', () => {
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      }
      if (captionsBox) {
        captionsBox.style.opacity = '0';
      }
    });
  }

  // Chapter buttons scrubbing
  chapterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sec = parseFloat(btn.dataset.seconds || '0');
      if (video) {
        video.currentTime = sec;
        startPlayback();
      }
      chapterBtns.forEach(b => b.classList.remove('border-blue-500', 'text-blue-300'));
      btn.classList.add('border-blue-500', 'text-blue-300');
    });
  });

  // Fallback visual tour simulation with real CRM screenshots & synced captions
  function startSimulatedTour() {
    const videoContainer = container.querySelector('#video-frame-container');
    if (!videoContainer) return;

    const tourSteps = [
      { img: '/screenshots/lead-management-preview.webp', title: '1. Automated Lead Capture & Round-Robin Routing', text: 'Incoming enquiries from portals and WhatsApp populate Salesforce Leads instantly.' },
      { img: '/screenshots/sales-management-preview.webp', title: '2. Deal Pipeline, Stages & Activity Timeline', text: 'Follow every buyer through custom stages: site visits, negotiations, and pricing approvals.' },
      { img: '/screenshots/booking-management-preview.webp', title: '3. Unit Inventory Grid & Milestone Payment Journeys', text: 'Sales reps lock units on the live architectural floor plan and generate digital booking vouchers.' },
      { img: '/dashboard-hero.webp', title: '4. Executive Dashboards & Revenue Velocity', text: 'Real-time sales velocity, lead conversion ratios, and collection milestones natively in Salesforce.' }
    ];

    let currentStepIdx = 0;
    videoContainer.innerHTML = `
      <div class="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4" id="simulated-tour-viewport">
        <div class="absolute top-3 left-4 z-20 flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-full text-xs text-white">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span id="sim-step-badge" class="font-semibold text-blue-300">1. Automated Lead Capture</span>
        </div>
        <div class="absolute top-3 right-4 z-20 flex items-center gap-2">
          <button type="button" id="sim-prev-btn" class="p-1 rounded bg-slate-800 text-white hover:bg-slate-700 text-xs px-2.5">◀ Prev</button>
          <button type="button" id="sim-next-btn" class="p-1 rounded bg-blue-600 text-white hover:bg-blue-500 text-xs px-2.5 font-bold">Next ▶</button>
        </div>
        <img id="sim-screenshot" src="${tourSteps[0].img}" alt="Salesforce Walkthrough Screen" class="max-h-[82%] max-w-full rounded-lg object-contain shadow-2xl border border-slate-800" />
        <div class="mt-2.5 text-center px-4 py-1.5 rounded-lg bg-slate-900/95 border border-slate-700 max-w-xl text-xs sm:text-sm text-slate-200">
          <p id="sim-caption-text" class="font-medium">${tourSteps[0].text}</p>
        </div>
      </div>
    `;

    const badge = videoContainer.querySelector('#sim-step-badge');
    const screenshot = videoContainer.querySelector('#sim-screenshot');
    const caption = videoContainer.querySelector('#sim-caption-text');
    const prevBtn = videoContainer.querySelector('#sim-prev-btn');
    const nextBtn = videoContainer.querySelector('#sim-next-btn');

    function updateSimStep(idx) {
      currentStepIdx = (idx + tourSteps.length) % tourSteps.length;
      const s = tourSteps[currentStepIdx];
      if (badge) badge.textContent = s.title;
      if (screenshot) screenshot.src = s.img;
      if (caption) caption.textContent = s.text;
    }

    prevBtn?.addEventListener('click', () => updateSimStep(currentStepIdx - 1));
    nextBtn?.addEventListener('click', () => updateSimStep(currentStepIdx + 1));

    // Auto rotate every 6 seconds
    const autoInterval = setInterval(() => {
      if (!document.contains(videoContainer)) {
        clearInterval(autoInterval);
        return;
      }
      updateSimStep(currentStepIdx + 1);
    }, 6000);
  }
}
