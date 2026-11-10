/**
 * Smoothly scrolls to a section ID with precise offset for the sticky header
 * @param {string} targetId - Target section ID (with or without #)
 */
export function scrollToSection(targetId) {
  let cleanId = (targetId || '').replace(/^#/, '').split('?')[0];
  if (!cleanId || cleanId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Handle aliases for the demo and contact section
  if (cleanId === 'request-demo' || cleanId === 'demo' || cleanId === 'contact-us') {
    cleanId = 'contact';
  }

  const targetEl = document.getElementById(cleanId);
  if (!targetEl) return;

  const header = document.getElementById('site-header');
  const headerHeight = header ? header.offsetHeight : 64;

  const rect = targetEl.getBoundingClientRect();
  const targetY = window.scrollY + rect.top - headerHeight;

  window.scrollTo({
    top: Math.max(0, targetY),
    behavior: 'smooth'
  });
}
