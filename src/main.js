import { initHeader } from './components/Header.js';
import { initFooter } from './components/Footer.js';
import { initFloatingChat } from './components/FloatingChat.js';
import { initGlossaryTooltips } from './components/GlossaryTooltip.js';
import { initImageLightbox } from './components/ImageLightbox.js';
import { initRouter } from './router.js';

// Mount Global Header
initHeader('#header-root');

// Mount Global Footer
initFooter('#footer-root');

// Mount Floating WhatsApp
initFloatingChat('#floating-chat-root');

// Initialize Plain Language & Accessibility Tooltips
initGlossaryTooltips();

// Initialize High-Resolution Image Lightbox Inspection
initImageLightbox();

// Initialize Single-Page Router & Sections (#home, #features, #benefits, #how-it-works, #live-demo, #contact)
initRouter();
