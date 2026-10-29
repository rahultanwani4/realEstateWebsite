import siteConfig from '../data/site-config.json';

/**
 * Validates US-03 Floating Chat / WhatsApp configuration:
 * - Help channel: "Live chat" or "WhatsApp"
 * - WhatsApp number: +91 followed by 10 digits
 * - Greeting: max 200 characters
 * - Show on pages: multi-select
 */
function validateChatConfig(config) {
  const { floatingHelp } = config;
  if (!floatingHelp) {
    throw new Error('US-03: Floating help configuration is required.');
  }

  // Greeting length validation
  if (floatingHelp.greeting && floatingHelp.greeting.length > 200) {
    console.warn(`US-03 Warning: Greeting exceeds 200 characters (${floatingHelp.greeting.length}). Truncating to 200.`);
    floatingHelp.greeting = floatingHelp.greeting.slice(0, 200);
  }

  // WhatsApp number format validation: +91 followed by 10 digits
  if (floatingHelp.channel === 'WhatsApp') {
    const rawNumber = (floatingHelp.whatsappNumber || '').replace(/[\s-]/g, '');
    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(rawNumber)) {
      console.warn(`US-03 Validation Warning: WhatsApp number must be +91 followed by 10 digits. Found: ${rawNumber}`);
    }
  }

  return floatingHelp;
}

/**
 * Records telemetry event for Chat/WhatsApp button clicks (US-03 Criterion 4)
 */
export function recordChatClick(channel, details = {}) {
  const eventData = {
    event: 'chat_click',
    channel: channel,
    details: details,
    timestamp: new Date().toISOString(),
    sourceUrl: window.location.href
  };

  window.dispatchEvent(new CustomEvent('estateforce:chat_click', { detail: eventData }));
  console.log('[Telemetry US-03] Chat button clicked:', eventData);

  // Show a toast confirmation
  showToast(`Initiated ${channel} conversation`);
}

function showToast(message) {
  let toast = document.getElementById('telemetry-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'telemetry-toast';
    toast.className = 'telemetry-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/**
 * Initializes and mounts the Floating Chat or WhatsApp button (US-03)
 */
export function initFloatingChat(mountSelector = '#floating-chat-root') {
  const container = document.querySelector(mountSelector);
  if (!container) return;

  const chatData = validateChatConfig(siteConfig);
  const isWhatsApp = chatData.channel === 'WhatsApp';

  // Format clean number for wa.me URL (removes '+' and spaces)
  const cleanNumber = (chatData.whatsappNumber || '').replace(/[^\d]/g, '');
  const encodedGreeting = encodeURIComponent(chatData.greeting || '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedGreeting}`;

  container.innerHTML = `
    <div class="floating-help-widget" id="floating-help-widget" role="complementary" aria-label="Quick Question and Support">
      
      <!-- Interactive Live Chat Popover Window (Accessible when Live Chat active or toggled) -->
      <div class="live-chat-window" id="live-chat-window" role="dialog" aria-modal="false" aria-labelledby="chat-header-title" hidden>
        <div class="chat-header">
          <div class="chat-header-info">
            <span class="chat-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </span>
            <div>
              <h4 id="chat-header-title" class="chat-title">${chatData.liveChat.title}</h4>
              <p class="chat-subtitle">${chatData.liveChat.subtitle}</p>
            </div>
          </div>
          <button type="button" class="chat-close-btn" id="chat-close-btn" aria-label="Close Chat Window">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="chat-body">
          <div class="chat-message agent-message">
            <p>${chatData.liveChat.initialMessage}</p>
            <span class="message-time">Just now</span>
          </div>

          <!-- Quick Starter Prompts -->
          <div class="quick-questions-box">
            <span class="quick-questions-label">Common questions:</span>
            <div class="quick-questions-list">
              ${chatData.liveChat.quickQuestions.map(q => `
                <button type="button" class="quick-question-btn" data-question="${q}">
                  ${q}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Direct WhatsApp escalation inside Live Chat window -->
        <div class="chat-footer-action">
          <a href="${whatsappUrl}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="btn-chat-whatsapp"
             id="chat-escalate-whatsapp">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.58c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.3"/>
            </svg>
            <span>Continue on WhatsApp (+91 98765 43210)</span>
          </a>
        </div>
      </div>

      <!-- Main Floating Trigger Button (US-03 Criterion 1, 2) -->
      ${isWhatsApp ? `
        <a href="${whatsappUrl}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="floating-chat-btn is-whatsapp" 
           id="floating-whatsapp-btn"
           aria-label="Ask a question on WhatsApp with prefilled greeting">
          <span class="floating-tooltip">Chat with us on WhatsApp</span>
          <svg class="whatsapp-icon" viewBox="0 0 24 24" width="34" height="34" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.58c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.3"/>
          </svg>
        </a>
      ` : `
        <button type="button" 
                class="floating-chat-btn is-livechat" 
                id="floating-livechat-btn" 
                aria-expanded="false" 
                aria-controls="live-chat-window" 
                aria-label="Ask a quick question via Live Chat">
          <span class="floating-tooltip">Ask a quick question</span>
          <svg class="chat-bubble-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      `}
    </div>
  `;

  setupFloatingChatInteractivity(chatData);
}

/**
 * Attaches click recording and toggle interaction
 */
function setupFloatingChatInteractivity(chatData) {
  const whatsappBtn = document.getElementById('floating-whatsapp-btn');
  const livechatBtn = document.getElementById('floating-livechat-btn');
  const chatWindow = document.getElementById('live-chat-window');
  const closeBtn = document.getElementById('chat-close-btn');
  const escalateWhatsapp = document.getElementById('chat-escalate-whatsapp');
  const quickButtons = document.querySelectorAll('.quick-question-btn');

  // WhatsApp button direct click tracking (US-03 Criterion 4)
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      recordChatClick('WhatsApp', { number: chatData.whatsappNumber });
    });
  }

  // Live Chat toggle
  if (livechatBtn && chatWindow) {
    livechatBtn.addEventListener('click', () => {
      const isHidden = chatWindow.hasAttribute('hidden');
      if (isHidden) {
        chatWindow.removeAttribute('hidden');
        livechatBtn.setAttribute('aria-expanded', 'true');
        recordChatClick('LiveChat_Opened');
      } else {
        chatWindow.setAttribute('hidden', '');
        livechatBtn.setAttribute('aria-expanded', 'false');
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        chatWindow.setAttribute('hidden', '');
        livechatBtn.setAttribute('aria-expanded', 'false');
        livechatBtn.focus();
      });
    }

    // Quick question clicks
    quickButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.getAttribute('data-question');
        recordChatClick('QuickQuestion_Selected', { question });
        btn.style.borderColor = 'var(--color-brand-blue)';
        btn.style.backgroundColor = '#F0F9FF';
      });
    });
  }

  if (escalateWhatsapp) {
    escalateWhatsapp.addEventListener('click', () => {
      recordChatClick('WhatsApp_Escalated', { number: chatData.whatsappNumber });
    });
  }
}
