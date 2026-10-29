import siteConfig from '../data/site-config.json';

/**
 * US-18 Demo Emails Service:
 * - Visitor confirmation email (within 5 minutes)
 * - Sales team notification alert (within 1 minute)
 * - Automated 24-hour and 1-hour reminders
 * - Business-editable email templates with merge fields
 */

const EMAIL_LOG_STORAGE_KEY = 'estateforce_sent_demo_emails';
const REMINDERS_STORAGE_KEY = 'estateforce_scheduled_reminders';

const emailConfig = siteConfig.requestDemoPage?.emailNotifications || {
  senderName: 'EstateForce Demos',
  senderEmail: 'support@cloudcertitude.com',
  salesRecipients: ['sales@cloudcertitude.com'],
  reminderTimingHours: [24, 1],
  privacyPolicyLink: '/privacy',
  confirmationSubject: 'Your EstateForce Demo Request Confirmation - Next Steps',
  salesAlertSubject: '🔥 Hot Lead: New Real Estate Demo Request from {company_name}'
};

/**
 * Helper to replace merge fields in email templates
 */
export function populateEmailTemplate(template = '', mergeData = {}) {
  let result = template;
  for (const [key, value] of Object.entries(mergeData)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value ?? '');
  }
  return result;
}

/**
 * Renders visitor confirmation email (US-18 Criterion 1)
 */
export function renderVisitorConfirmationEmail(lead) {
  const subject = `Your EstateForce Demo Request Confirmation - Next Steps`;
  const bodyHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <div style="background-color: #2563eb; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">EstateForce</h1>
        <p style="color: #bfdbfe; margin: 4px 0 0; font-size: 14px;">Real Estate Package Built on Salesforce</p>
      </div>
      <div style="padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; margin-top: 0;">Hi <strong>${lead.fullName || 'there'}</strong>,</p>
        <p style="font-size: 15px; color: #475569;">
          Thank you for requesting a tailored walkthrough of EstateForce for <strong>${lead.company || lead.companyName}</strong>. We have received your request and assigned a senior real estate solutions architect.
        </p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
          <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb;">Summary of Your Request:</h3>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #334155;">
            <li><strong>Preferred Date:</strong> ${lead.preferredDate || 'To be scheduled'}</li>
            <li><strong>Preferred Time Slot:</strong> ${lead.preferredTimeSlot || 'Flexible'} (IST)</li>
            <li><strong>Demo Format:</strong> ${lead.demoType || 'Online'}</li>
            <li><strong>Sales Team Size:</strong> ${lead.teamSize ? lead.teamSize + ' users' : 'Enterprise'}</li>
            ${lead.mostInterestedIn && lead.mostInterestedIn.length ? `<li><strong>Capabilities:</strong> ${lead.mostInterestedIn.join(', ')}</li>` : ''}
          </ul>
        </div>

        <h3 style="font-size: 15px; color: #0f172a; margin-top: 24px;">Next Steps:</h3>
        <ol style="font-size: 14px; color: #475569; padding-left: 20px;">
          <li>Our solutions team is reviewing your requirements and preparing a customized sandbox.</li>
          <li>You will receive a calendar invite with direct meeting link credentials within 60 minutes.</li>
          <li>Feel free to reply directly to this email with any specific floor plans or CRM questions you'd like us to focus on.</li>
        </ol>

        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
          <p style="margin: 0 0 8px;">Need immediate assistance? Contact us at <strong>${siteConfig.requestDemoPage?.successMessage?.contactEmail || 'support@estateforce.in'}</strong> or call <strong>${siteConfig.requestDemoPage?.successMessage?.contactPhone || '+91 98765 43210'}</strong>.</p>
          <p style="margin: 0;">We respect your privacy. View our <a href="${emailConfig.privacyPolicyLink}" style="color: #2563eb; text-decoration: underline;">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  `;
  return { subject, bodyHtml, recipient: lead.email || lead.workEmail };
}

/**
 * Renders sales alert notification (US-18 Criterion 2)
 */
export function renderSalesAlertEmail(lead) {
  const subject = `🔥 Hot Lead: New Real Estate Demo Request from ${lead.company || lead.companyName}`;
  const bodyHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0;">
        <span style="background-color: #ef4444; color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">New Demo Lead</span>
        <h2 style="margin: 8px 0 0; font-size: 20px;">${lead.company || lead.companyName}</h2>
      </div>
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 24px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 140px;">Contact:</td><td style="padding: 8px 0; font-weight: 600;">${lead.fullName} (${lead.jobTitle || 'Executive'})</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Work Email:</td><td style="padding: 8px 0;"><a href="mailto:${lead.email || lead.workEmail}">${lead.email || lead.workEmail}</a></td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Company Type:</td><td style="padding: 8px 0;">${lead.companyType || 'Not specified'}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Sales Team Size:</td><td style="padding: 8px 0;">${lead.teamSize ? lead.teamSize + ' users' : 'Not specified'}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Uses Salesforce:</td><td style="padding: 8px 0;">${lead.usesSalesforce || 'Unknown'}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Requested Date:</td><td style="padding: 8px 0; font-weight: 600; color: #2563eb;">${lead.preferredDate || 'Flexible'} (${lead.preferredTimeSlot || 'Any'})</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Source Page:</td><td style="padding: 8px 0;">${lead.sourcePage || 'website'}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Campaign:</td><td style="padding: 8px 0;">${lead.campaign || 'website_q4_2026'}</td></tr>
          ${lead.notes ? `<tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Notes:</td><td style="padding: 8px 0; font-style: italic;">"${lead.notes}"</td></tr>` : ''}
        </table>
        <div style="margin-top: 20px; text-align: right;">
          <a href="https://webto.salesforce.com" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">Open in Salesforce CRM</a>
        </div>
      </div>
    </div>
  `;
  return { subject, bodyHtml, recipients: emailConfig.salesRecipients };
}

/**
 * Dispatches demo emails and schedules reminders (US-18)
 */
export async function triggerDemoEmailWorkflows(lead) {
  const visitorEmail = renderVisitorConfirmationEmail(lead);
  const salesAlert = renderSalesAlertEmail(lead);

  // Store in simulated sent log for auditing and tracking
  try {
    const raw = localStorage.getItem(EMAIL_LOG_STORAGE_KEY);
    const log = raw ? JSON.parse(raw) : [];
    log.push({
      leadEmail: lead.email || lead.workEmail,
      visitorEmailSentAt: new Date().toISOString(),
      salesAlertSentAt: new Date().toISOString(),
      salesRecipients: emailConfig.salesRecipients,
      status: 'dispatched'
    });
    localStorage.setItem(EMAIL_LOG_STORAGE_KEY, JSON.stringify(log));

    // Schedule 24h and 1h reminders (US-18 Criterion 3)
    if (lead.preferredDate) {
      scheduleDemoReminders(lead);
    }
  } catch (e) {
    // Ignore storage issues
  }

  console.log('[Email US-18] Visitor confirmation dispatched to:', visitorEmail.recipient);
  console.log('[Email US-18] Sales alert notification dispatched to:', salesAlert.recipients);

  return {
    success: true,
    visitorEmail,
    salesAlert
  };
}

/**
 * Schedules reminders (US-18 Criterion 3)
 */
function scheduleDemoReminders(lead) {
  try {
    const raw = localStorage.getItem(REMINDERS_STORAGE_KEY);
    const reminders = raw ? JSON.parse(raw) : [];
    reminders.push({
      leadEmail: lead.email || lead.workEmail,
      preferredDate: lead.preferredDate,
      timeSlot: lead.preferredTimeSlot,
      timingHours: emailConfig.reminderTimingHours,
      meetingLink: 'https://meet.google.com/estateforce-demo-live',
      rescheduleLink: `${window.location.origin}/request-demo?action=reschedule`,
      cancelLink: `${window.location.origin}/request-demo?action=cancel`,
      isCancelled: false,
      scheduledAt: new Date().toISOString()
    });
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  } catch (e) {
    // Ignore
  }
}
