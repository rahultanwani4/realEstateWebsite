import siteConfig from '../data/site-config.json';
import { recordDemoClick } from './Header.js';

/**
 * Validates footer configuration against US-02 validation rules:
 * - Valid email format
 * - Phone: +91 followed by 10 digits
 * - External URLs must be valid https
 * - Description max 150 characters
 */
function validateFooterConfig(config) {
  const { footer } = config;
  if (!footer) {
    throw new Error('US-02: Footer configuration is required.');
  }

  // Description length validation (max 150 characters)
  if (footer.packageDescription && footer.packageDescription.length > 150) {
    console.warn(`US-02 Warning: Package description exceeds 150 characters (${footer.packageDescription.length}). Truncating.`);
    footer.packageDescription = footer.packageDescription.slice(0, 150);
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (footer.contact?.email && !emailRegex.test(footer.contact.email)) {
    console.warn(`US-02 Warning: Invalid contact email format: ${footer.contact.email}`);
  }

  // Phone validation: +91 followed by 10 digits
  const phoneClean = (footer.contact?.phoneRaw || '').replace(/\s+/g, '');
  const phoneRegex = /^\+91\d{10}$/;
  if (phoneClean && !phoneRegex.test(phoneClean)) {
    console.warn(`US-02 Warning: Phone should be +91 followed by 10 digits. Found: ${phoneClean}`);
  }

  return footer;
}

/**
 * SVG Icons for Social Networks (US-02 Criterion 4)
 */
const socialIcons = {
  LinkedIn: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.84 6.75a1.61 1.61 0 1 0 0 3.22 1.61 1.61 0 0 0 0-3.22Z"/>
    </svg>
  `,
  X: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  `,
  YouTube: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  `,
  Facebook: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  `,
  Instagram: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  `
};

/**
 * Initializes and mounts the Global Footer (US-02)
 */
export function initFooter(mountSelector = '#footer-root') {
  const container = document.querySelector(mountSelector);
  if (!container) return;

  const footerData = validateFooterConfig(siteConfig);
  const { logo } = siteConfig.header;
  const currentYear = new Date().getFullYear(); // Dynamic copyright year (US-02 Criterion 6)

  container.innerHTML = `
    <footer class="site-footer" id="site-footer" role="contentinfo">
      
      <!-- 7. Compact "Request a Demo" Prompt Strip (US-02 Criterion 7) -->
      <div class="footer-cta-strip">
        <div class="footer-container footer-cta-content">
          <div class="footer-cta-text">
            <span class="footer-cta-label">Get Started</span>
            <p class="footer-cta-title">${footerData.demoPrompt.text}</p>
          </div>
          <a href="${footerData.demoPrompt.link}" 
             class="btn-footer-demo" 
             id="footer-demo-button"
             data-source-page="${footerData.demoPrompt.sourcePage}">
            <span>${footerData.demoPrompt.buttonLabel}</span>
            <svg class="cta-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>

      <!-- Main Footer Grid -->
      <div class="footer-main">
        <div class="footer-container footer-grid">
          
          <!-- Column 1: Brand Logo & One-line Description (US-02 Criterion 1) -->
          <div class="footer-col footer-col-brand">
            <a href="${logo.homeUrl}" class="footer-logo-link" aria-label="EstateForce Home">
              <img src="${logo.src}" alt="${logo.alt}" class="footer-logo-img" />
            </a>
            <p class="footer-description">
              ${footerData.packageDescription}
            </p>

            <!-- AppExchange Verified Badge Link (US-02 Criterion 2) -->
            <div class="appexchange-badge-box">
              <a href="${footerData.appExchange.url}" 
                 target="${footerData.appExchange.openInNewTab ? '_blank' : '_self'}" 
                 rel="noopener noreferrer" 
                 class="appexchange-link"
                 id="footer-appexchange-link">
                <svg class="sf-cloud-icon" viewBox="0 0 24 24" width="16" height="16" fill="#0284C7">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                </svg>
                <span>Salesforce AppExchange</span>
                <svg class="external-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                </svg>
              </a>
            </div>
          </div>

          <!-- Column 2 & 3: Grouped Quick Links (US-02 Criterion 2) -->
          ${footerData.quickLinksGrouped.map(group => `
            <div class="footer-col footer-col-links">
              <h3 class="footer-col-title">${group.title}</h3>
              <ul class="footer-link-list">
                ${group.links.map(link => `
                  <li>
                    <a href="${link.url}" class="footer-link">
                      ${link.label}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}

          <!-- Column 4: Contact Details (Email, Phone tap-to-call, Address) (US-02 Criterion 3) -->
          <div class="footer-col footer-col-contact">
            <h3 class="footer-col-title">Get in Touch</h3>
            <ul class="footer-contact-list">
              <li>
                <a href="mailto:${footerData.contact.email}" class="footer-contact-item">
                  <svg class="contact-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <span>${footerData.contact.email}</span>
                </a>
              </li>
              <li>
                <a href="tel:${footerData.contact.phoneRaw}" class="footer-contact-item" title="Tap to call">
                  <svg class="contact-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>${footerData.contact.phone}</span>
                </a>
              </li>
              <li class="footer-address">
                <svg class="contact-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${footerData.contact.officeAddress}</span>
              </li>
            </ul>

            <!-- 4. Social Icons with Screen-reader labels (US-02 Criterion 4) -->
            <div class="footer-social-box">
              <span class="sr-only">Social media links</span>
              <div class="footer-social-links">
                ${footerData.social.map(item => `
                  <a href="${item.url}" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     class="social-btn" 
                     aria-label="${item.screenReaderLabel}"
                     title="${item.network}">
                    ${socialIcons[item.network] || ''}
                  </a>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar: Dynamic Copyright & Legal Links (US-02 Criterion 5, 6) -->
      <div class="footer-bottom">
        <div class="footer-container footer-bottom-inner">
          <p class="copyright-line">
            © ${currentYear} ${footerData.legal.copyrightHolder}
          </p>
          <ul class="legal-nav">
            ${footerData.legal.links.map(item => `
              <li>
                <a href="${item.url}" 
                   class="legal-link"
                   ${item.isAction ? 'id="cookie-settings-trigger"' : ''}>
                  ${item.label}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </footer>
  `;

  setupFooterInteractivity();
}

/**
 * Attaches event listeners for demo button click tracking and cookie modal trigger
 */
function setupFooterInteractivity() {
  const footerDemoBtn = document.getElementById('footer-demo-button');
  if (footerDemoBtn) {
    footerDemoBtn.addEventListener('click', () => {
      const source = footerDemoBtn.getAttribute('data-source-page') || 'global_footer';
      recordDemoClick(source);
    });
  }

  const cookieSettingsBtn = document.getElementById('cookie-settings-trigger');
  if (cookieSettingsBtn) {
    cookieSettingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('estateforce:open_cookie_settings'));
      console.log('[US-02 / US-27] Cookie settings triggered');
    });
  }
}
