import { initHeader } from './components/Header.js';
import { initFooter } from './components/Footer.js';
import { initFloatingChat } from './components/FloatingChat.js';
import { initExitIntentModal } from './components/ExitIntentModal.js';
import { initGlossaryTooltips } from './components/GlossaryTooltip.js';
import { initRouter } from './router.js';

// Mount Global Header (US-01)
initHeader('#header-root');

// Mount Global Footer (US-02)
initFooter('#footer-root');

// Mount Floating WhatsApp (US-03)
initFloatingChat('#floating-chat-root');

// Mount Exit-Intent Recovery Modal (US-32)
initExitIntentModal('#exit-intent-root');

// Initialize Plain Language & Accessibility Tooltips (US-35)
initGlossaryTooltips();

// Initialize Multi-Page Router (Section 6 & 8 of website_brief.pdf and US-06 to US-17)
initRouter();


