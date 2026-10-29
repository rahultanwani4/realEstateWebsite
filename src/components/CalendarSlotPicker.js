import siteConfig from '../data/site-config.json';

/**
 * US-20 Self-Service Demo Slot Booking Component
 * 
 * Criteria:
 * 1. Shows available slots in IST from sales calendar
 * 2. Only slots at least 4 hours ahead allowed
 * 3. Default slot length 30 minutes
 * 4. Assigned rep shown
 * 5. Instant calendar invite generation (.ics) + Google Calendar add link
 * 6. Online meeting link / in-person office address
 */

const BOOKINGS_STORAGE_KEY = 'estateforce_booked_demo_slots';

const calendarConfig = siteConfig.requestDemoPage?.calendarBooking || {
  timezone: 'IST',
  slotDurationMinutes: 30,
  minAdvanceHours: 4,
  assignedRep: 'Vikram Malhotra (Real Estate CRM Specialist)',
  onlineMeetingLink: 'https://meet.google.com/estateforce-demo-live',
  inPersonAddress: 'Cloud Certitude Real Estate Solutions Hub, Tower B, Sector 62, Noida, NCR, India'
};

/**
 * Generates available 30-min slots for a chosen date
 * Filters out slots that are less than 4 hours ahead (US-20 Validation)
 */
export function getAvailableSlotsForDate(dateStr) {
  if (!dateStr) return [];

  const rawBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  const bookedSlots = rawBookings ? JSON.parse(rawBookings) : [];

  const slots = [
    '10:00 AM – 10:30 AM',
    '10:45 AM – 11:15 AM',
    '11:30 AM – 12:00 PM',
    '12:15 PM – 12:45 PM',
    '02:00 PM – 02:30 PM',
    '02:45 PM – 03:15 PM',
    '03:30 PM – 04:00 PM',
    '04:15 PM – 04:45 PM',
    '05:00 PM – 05:30 PM'
  ];

  const now = new Date();
  const minValidTime = new Date(now.getTime() + calendarConfig.minAdvanceHours * 60 * 60 * 1000);

  return slots.map(slot => {
    // Parse start time to calculate 4-hour lead time restriction
    const [startPart] = slot.split(' – ');
    const [time, meridiem] = startPart.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    const slotDateTime = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+05:30`);
    const isTooEarly = slotDateTime < minValidTime;
    const isAlreadyBooked = bookedSlots.some(b => b.date === dateStr && b.slot === slot);

    return {
      slot,
      date: dateStr,
      dateTimeIso: slotDateTime.toISOString(),
      isAvailable: !isTooEarly && !isAlreadyBooked,
      disabledReason: isAlreadyBooked ? 'Already reserved' : (isTooEarly ? 'Requires 4h advance notice' : null)
    };
  });
}

/**
 * Generates an .ics calendar file for download
 */
export function generateIcsFile({ title, description, location, startDate, slotText }) {
  const [startPart] = slotText.split(' – ');
  const [time, meridiem] = startPart.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  const y = startDate.replace(/-/g, '');
  const startHoursStr = String(hours).padStart(2, '0');
  const startMinsStr = String(minutes).padStart(2, '0');
  const endHours = minutes + 30 >= 60 ? hours + 1 : hours;
  const endMins = (minutes + 30) % 60;
  const endHoursStr = String(endHours).padStart(2, '0');
  const endMinsStr = String(endMins).padStart(2, '0');

  const dtStart = `${y}T${startHoursStr}${startMinsStr}00`;
  const dtEnd = `${y}T${endHoursStr}${endMinsStr}00`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cloud Certitude//EstateForce Real Estate CRM//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    `DTSTART;TZID=Asia/Kolkata:${dtStart}`,
    `DTEND;TZID=Asia/Kolkata:${dtEnd}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return new Blob([ics], { type: 'text/calendar;charset=utf-8' });
}

/**
 * Generates a direct Google Calendar add event URL
 */
export function getGoogleCalendarUrl({ title, description, location, startDate, slotText }) {
  const [startPart] = slotText.split(' – ');
  const [time, meridiem] = startPart.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  const y = startDate.replace(/-/g, '');
  const startHoursStr = String(hours).padStart(2, '0');
  const startMinsStr = String(minutes).padStart(2, '0');
  const endHours = minutes + 30 >= 60 ? hours + 1 : hours;
  const endMins = (minutes + 30) % 60;
  const endHoursStr = String(endHours).padStart(2, '0');
  const endMinsStr = String(endMins).padStart(2, '0');

  const dates = `${y}T${startHoursStr}${startMinsStr}00/${y}T${endHoursStr}${endMinsStr}00`;

  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  return `${base}&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
}

/**
 * Saves a booked slot locally (blocks taken slot per US-20 Criterion 2)
 */
export function bookDemoSlot(booking) {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({
      ...booking,
      assignedRep: calendarConfig.assignedRep,
      bookedAt: new Date().toISOString()
    });
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;
  }
}
