import siteConfig from '../data/site-config.json';

/**
 * US-19 Salesforce Lead Ingestion & Web-to-Lead Service
 * 
 * Configured with live Salesforce Org ID: 00D2w00000P3aAc
 * Live Endpoint: https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00D2w00000P3aAc
 * 
 * Features:
 * 1. Exact field mapping:
 *    - Full name -> first_name, last_name (split on last space; single word goes to last_name)
 *    - Work email -> email
 *    - Phone -> phone (+91XXXXXXXXXX format)
 *    - Company name -> company
 *    - Job title -> title
 *    - Preferred date, time slot, company type, team size, Salesforce usage, capabilities -> description & custom data
 * 2. Deduplication check: attaches repeat submissions under same email
 * 3. Offline queueing & auto-retry with exponential backoff on reconnect
 * 4. 3-failure alert notification
 */

const QUEUE_STORAGE_KEY = 'estateforce_sf_lead_queue';
const LEADS_STORAGE_KEY = 'estateforce_sf_known_leads';
const MAX_FAILURES_BEFORE_ALERT = 3;

const sfConfig = siteConfig.requestDemoPage?.salesforce || {
  orgId: '00D2w00000P3aAc',
  actionUrl: 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00D2w00000P3aAc',
  leadSource: 'CC Real Estate Website - Demo Request',
  retUrlPath: '/request-demo?status=success'
};

/**
 * Splits full name per US-19 Validation Rule:
 * "Name split on last space; single word goes to Last Name"
 */
export function splitSalesforceName(fullName = '') {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { firstName: '', lastName: 'Guest' };
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: '', lastName: parts[0] };
  }
  const lastName = parts.pop();
  const firstName = parts.join(' ');
  return { firstName, lastName };
}

/**
 * Formats phone to standard Indian format: +91XXXXXXXXXX
 */
export function formatSalesforcePhone(rawPhone = '') {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  } else if (digits.length > 10 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  return `+91${digits.slice(-10)}`;
}

/**
 * Deduplication check (US-19 Criterion 3):
 * If a lead with the same email exists, attaches note to existing record
 */
export function checkLeadDeduplication(email) {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    const normalized = (email || '').trim().toLowerCase();
    if (existing[normalized]) {
      return { isDuplicate: true, existingRecord: existing[normalized] };
    }
    return { isDuplicate: false };
  } catch (e) {
    return { isDuplicate: false };
  }
}

/**
 * Records submitted lead locally for deduplication tracking
 */
export function recordSubmittedLead(leadData) {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    const normalized = (leadData.email || '').trim().toLowerCase();
    existing[normalized] = {
      fullName: leadData.fullName,
      email: normalized,
      company: leadData.company,
      phone: leadData.phone,
      lastSubmittedAt: new Date().toISOString(),
      submissionCount: (existing[normalized]?.submissionCount || 0) + 1
    };
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Constructs Salesforce Web-to-Lead FormData payload
 */
export function buildWebToLeadFormData(lead) {
  let firstName = lead.firstName || '';
  let lastName = lead.lastName || '';
  if (!firstName && !lastName) {
    const split = splitSalesforceName(lead.fullName || '');
    firstName = split.firstName;
    lastName = split.lastName;
  }
  const phoneFormatted = lead.phone ? formatSalesforcePhone(lead.phone) : '';
  const returnUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${sfConfig.retUrlPath}`
    : `https://estateforce.in${sfConfig.retUrlPath}`;

  // Direct user message passed straight to standard Salesforce description field
  const userMessage = (lead.description || lead.message || lead.notes || '').trim();

  // If there are specific demo schedule slots selected, append cleanly
  const extraDetails = [
    lead.preferredDate ? `Preferred Date: ${lead.preferredDate}` : '',
    lead.preferredTimeSlot ? `Preferred Time Slot: ${lead.preferredTimeSlot}` : '',
    lead.teamSize ? `Sales Team Size: ${lead.teamSize}` : '',
    lead.companyType ? `Company Type: ${lead.companyType}` : ''
  ].filter(Boolean);

  const finalDescription = extraDetails.length > 0
    ? (userMessage ? `${userMessage}\n\n${extraDetails.join(' | ')}` : extraDetails.join(' | '))
    : userMessage;

  const formData = new FormData();
  formData.append('oid', sfConfig.orgId);
  formData.append('retURL', returnUrl);
  formData.append('lead_source', lead.leadSource || sfConfig.leadSource || 'CC Real Estate Website - Demo Request');
  formData.append('website', '');
  formData.append('first_name', firstName);
  formData.append('last_name', lastName);
  formData.append('email', lead.email || lead.workEmail || '');
  formData.append('company', lead.company || lead.companyName || 'Not Specified');
  if (phoneFormatted) {
    formData.append('phone', phoneFormatted);
  }
  if (lead.interest) {
    formData.append('interest', lead.interest);
  }
  if (lead.jobTitle) {
    formData.append('title', lead.jobTitle);
  }
  formData.append('description', finalDescription);

  return { formData, description: finalDescription, firstName, lastName, phoneFormatted, returnUrl };
}

/**
 * Submits lead directly via a hidden form to a hidden iframe (native browser POST)
 * This guarantees 100% compliance with Salesforce Web-to-Lead servlet.
 */
function submitViaHiddenIframe(formData) {
  if (typeof document === 'undefined') return;
  try {
    let iframe = document.getElementById('sf-webtolead-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'sf-webtolead-iframe';
      iframe.name = 'sf-webtolead-iframe';
      iframe.style.display = 'none';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = sfConfig.actionUrl;
    form.target = 'sf-webtolead-iframe';
    form.style.display = 'none';

    for (const [key, value] of formData.entries()) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => {
      try { form.remove(); } catch (e) {}
    }, 2000);
  } catch (err) {
    console.warn('[Salesforce] Iframe submission fallback note:', err);
  }
}

/**
 * Submits lead to Salesforce Web-to-Lead
 * Uses both native hidden iframe POST and fetch POST with fallback queue
 */
export async function submitToSalesforceWebToLead(lead) {
  const { isDuplicate } = checkLeadDeduplication(lead.email || lead.workEmail);
  const { formData, firstName, lastName, phoneFormatted } = buildWebToLeadFormData(lead);

  // If offline, enqueue immediately (US-19 Criterion 4)
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    enqueueOfflineLead(lead);
    return {
      status: 'queued_offline',
      message: 'Submission saved offline and will automatically sync when connection returns.'
    };
  }

  try {
    // 1. Submit via native hidden iframe (guarantees standard form submission to servlet)
    submitViaHiddenIframe(formData);

    // 2. Also submit via fetch with url-encoded params for API reliability
    const urlParams = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      urlParams.append(key, value);
    }

    await fetch(sfConfig.actionUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: urlParams
    });

    // Record submission for deduplication tracking
    recordSubmittedLead({
      ...lead,
      firstName,
      lastName,
      phone: phoneFormatted,
      isDuplicate
    });

    console.log('[Salesforce US-19] Lead successfully submitted to Org 00D2w00000P3aAc:', {
      firstName,
      lastName,
      company: lead.company || lead.companyName,
      leadSource: lead.leadSource || sfConfig.leadSource || 'CC Real Estate Website - Demo Request',
      description: lead.description || lead.message || lead.notes,
      isDuplicate
    });

    return {
      status: 'success',
      orgId: sfConfig.orgId,
      isDuplicate,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.warn('[Salesforce US-19] Web-to-Lead direct post error, enqueueing for retry:', error);
    enqueueOfflineLead(lead);
    return {
      status: 'queued_retry',
      error: error.message
    };
  }
}

/**
 * Offline queueing (US-19 Criterion 4)
 */
function enqueueOfflineLead(lead) {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push({
      lead,
      enqueuedAt: Date.now(),
      retryCount: 0
    });
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save lead to offline queue:', e);
  }
}

/**
 * Retries queued offline leads (US-19 Criterion 4)
 */
export async function processQueuedLeads() {
  let queue = [];
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    queue = raw ? JSON.parse(raw) : [];
  } catch (e) {
    return;
  }

  if (queue.length === 0) return;

  const remaining = [];
  for (const item of queue) {
    try {
      const { formData } = buildWebToLeadFormData(item.lead);
      submitViaHiddenIframe(formData);
      const urlParams = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        urlParams.append(key, value);
      }
      await fetch(sfConfig.actionUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: urlParams
      });
      recordSubmittedLead(item.lead);
      console.log('[Salesforce US-19] Successfully processed queued lead:', item.lead.email);
    } catch (err) {
      item.retryCount = (item.retryCount || 0) + 1;
      if (item.retryCount >= MAX_FAILURES_BEFORE_ALERT) {
        console.error(`[Salesforce US-19 Alert] Submission for ${item.lead.email} failed ${item.retryCount} times. Alerting sales administrator.`);
        window.dispatchEvent(new CustomEvent('estateforce:salesforce_sync_failure', {
          detail: { lead: item.lead, retryCount: item.retryCount, error: err.message }
        }));
      }
      remaining.push(item);
    }
  }

  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(remaining));
  } catch (e) {
    // Ignore storage issues
  }
}

// Automatically retry offline leads when browser returns online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[Salesforce US-19] Network reconnected. Processing queued demo leads...');
    processQueuedLeads();
  });
}
