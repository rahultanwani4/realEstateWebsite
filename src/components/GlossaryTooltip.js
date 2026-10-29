import siteConfig from '../data/site-config.json';

/**
 * US-35 Plain Language & Salesforce Glossary Tooltip Helper
 * 
 * Criteria:
 * 1. Plain, jargon-free wording; Salesforce terms explained inline or by tooltip (hover, tap and focus).
 * 2. Glossary terms unique.
 * 3. Works by keyboard and touch.
 */

export function initGlossaryTooltips() {
  const glossary = siteConfig.glossary?.terms || [];
  if (!glossary.length) return;

  // Add global styles for glossary tooltips if not already injected
  if (!document.getElementById('glossary-tooltip-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'glossary-tooltip-styles';
    styleEl.textContent = `
      .glossary-term-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        cursor: help;
        border-bottom: 1.5px dotted #0284c7;
        color: inherit;
        position: relative;
        text-decoration: none;
      }
      .glossary-term-badge:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
        border-radius: 2px;
      }
      .glossary-popover {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        width: 280px;
        max-width: 90vw;
        background: #0f172a;
        color: #f8fafc;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 12px 14px;
        font-size: 12px;
        line-height: 1.5;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        z-index: 100;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
      }
      .glossary-popover::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 6px;
        border-style: solid;
        border-color: #0f172a transparent transparent transparent;
      }
      .glossary-term-badge:hover .glossary-popover,
      .glossary-term-badge:focus .glossary-popover,
      .glossary-term-badge.is-active .glossary-popover {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }
    `;
    document.head.appendChild(styleEl);
  }
}

/**
 * Creates accessible glossary tooltip HTML markup
 */
export function renderGlossaryTerm(termName) {
  const glossary = siteConfig.glossary?.terms || [];
  const found = glossary.find(t => t.term.toLowerCase() === termName.toLowerCase());
  if (!found) return termName;

  return `
    <span class="glossary-term-badge" tabindex="0" role="button" aria-expanded="false" aria-label="${found.term}: ${found.plainText}">
      <span>${found.term}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-500 inline-block opacity-75">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <span class="glossary-popover" role="tooltip">
        <strong class="block text-blue-300 font-bold mb-1">${found.term} (Plain Language):</strong>
        <span>${found.plainText}</span>
      </span>
    </span>
  `;
}
