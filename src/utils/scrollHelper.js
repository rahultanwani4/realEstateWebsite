/**
 * Smoothly scrolls to a section ID with precise offset for the sticky header
 * @param {string} targetId - Target section ID (with or without #)
 */
export function scrollToSection(targetId) {
  const cleanId = (targetId || '').replace(/^#/, '');
  if (!cleanId || cleanId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
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
