import { formatInTimeZone } from "date-fns-tz";

/**
 * Format date and time from ISO strings to user-friendly format
 * @param startTimeISO - Start time in ISO format
 * @param endTimeISO - End time in ISO format (optional)
 * @param timezone - User's timezone (defaults to browser's timezone)
 */
export function formatDateTime(
  startTimeISO: string | null,
  endTimeISO: string | null,
  timezone?: string,
): string {
  if (!startTimeISO) return "No date";

  // Use browser's timezone as fallback
  const userTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    const startDate = new Date(startTimeISO);
    const endDate = endTimeISO ? new Date(endTimeISO) : null;

    // Check if dates are valid
    if (isNaN(startDate.getTime())) {
      console.warn('Invalid start_time:', startTimeISO);
      return "Invalid date";
    }

    if (endDate && isNaN(endDate.getTime())) {
      console.warn('Invalid end_time:', endTimeISO);
      // Continue with just start date
    }

    const dateStr = formatInTimeZone(startDate, userTimezone, "MMMM d");
    const startTimeStr = formatInTimeZone(startDate, userTimezone, "HH:mm");
    const endTimeStr = endDate && !isNaN(endDate.getTime()) 
      ? formatInTimeZone(endDate, userTimezone, "HH:mm") 
      : "";

    return `${dateStr} · ${startTimeStr}${endTimeStr ? ` - ${endTimeStr}` : ""}`;
  } catch (error) {
    console.error('Error formatting date:', error, { startTimeISO, endTimeISO });
    return "Date error";
  }
}

/**
 * Format date and time for event cards (shorter format)
 * @param startTimeISO - Start time in ISO format
 * @param endTimeISO - End time in ISO format (optional)
 * @param timezone - User's timezone (defaults to browser's timezone)
 */
export function formatEventDateTime(
  startTimeISO: string | null,
  endTimeISO: string | null,
  timezone?: string,
): string {
  if (!startTimeISO) return "No date";

  // Use browser's timezone as fallback
  const userTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    const startDate = new Date(startTimeISO);
    const endDate = endTimeISO ? new Date(endTimeISO) : null;

    // Check if dates are valid
    if (isNaN(startDate.getTime())) {
      console.warn('Invalid start_time:', startTimeISO);
      return "Invalid date";
    }

    if (endDate && isNaN(endDate.getTime())) {
      console.warn('Invalid end_time:', endTimeISO);
      // Continue with just start date
    }

    const dateStr = formatInTimeZone(startDate, userTimezone, "EEE MMM d");
    const startTimeStr = formatInTimeZone(startDate, userTimezone, "h:mm a");
    const endTimeStr = endDate && !isNaN(endDate.getTime()) 
      ? formatInTimeZone(endDate, userTimezone, "h:mm a") 
      : "";

    return `${dateStr} • ${startTimeStr}${endTimeStr ? ` - ${endTimeStr}` : ""}`;
  } catch (error) {
    console.error('Error formatting event date:', error, { startTimeISO, endTimeISO });
    return "Date error";
  }
} 