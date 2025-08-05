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

/**
 * ✅ NEW: Timezone-aware formatting for invoice components
 * Formats date and time separately for invoice displays
 * @param startTimeISO - Start time in ISO format
 * @param endTimeISO - End time in ISO format (optional)
 * @param timezone - User's timezone (defaults to browser's timezone)
 */
export function formatInvoiceDateTime(
  startTimeISO: string | null,
  endTimeISO: string | null,
  timezone?: string,
): {
  date: string;
  startTime: string;
  endTime: string;
  timeRange: string;
} {
  if (!startTimeISO) {
    return {
      date: "",
      startTime: "",
      endTime: "",
      timeRange: ""
    };
  }

  // Use browser's timezone as fallback
  const userTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    const startDate = new Date(startTimeISO);
    const endDate = endTimeISO ? new Date(endTimeISO) : null;

    // Check if dates are valid
    if (isNaN(startDate.getTime())) {
      console.warn('Invalid start_time:', startTimeISO);
      return {
        date: "Invalid date",
        startTime: "",
        endTime: "",
        timeRange: ""
      };
    }

    if (endDate && isNaN(endDate.getTime())) {
      console.warn('Invalid end_time:', endTimeISO);
      // Continue with just start date
    }

    // Format date
    const date = formatInTimeZone(startDate, userTimezone, "MMM d, yyyy");
    
    // Format start time
    const startTime = formatInTimeZone(startDate, userTimezone, "h:mm a");
    
    // Format end time if available
    const endTime = endDate && !isNaN(endDate.getTime()) 
      ? formatInTimeZone(endDate, userTimezone, "h:mm a") 
      : "";
    
    // Create time range string
    const timeRange = endTime ? `${startTime} - ${endTime}` : startTime;

    return {
      date,
      startTime,
      endTime,
      timeRange
    };
  } catch (error) {
    console.error('Error formatting invoice date:', error, { startTimeISO, endTimeISO });
    return {
      date: "Date error",
      startTime: "",
      endTime: "",
      timeRange: ""
    };
  }
}

/**
 * ✅ NEW: Simple timezone-aware date formatter for invoice cards
 * @param dateString - Date string in ISO format
 * @param timezone - User's timezone (defaults to browser's timezone)
 */
export function formatInvoiceDate(
  dateString: string | null,
  timezone?: string,
): string {
  if (!dateString) return "";
  
  const userTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return "Invalid date";
    }
    
    return formatInTimeZone(date, userTimezone, "MMM d, yyyy");
  } catch (error) {
    console.error('Error formatting invoice date:', error, { dateString });
    return "Date error";
  }
}

/**
 * ✅ NEW: Simple timezone-aware time formatter for invoice cards
 * @param dateString - Date string in ISO format
 * @param timezone - User's timezone (defaults to browser's timezone)
 */
export function formatInvoiceTime(
  dateString: string | null,
  timezone?: string,
): string {
  if (!dateString) return "";
  
  const userTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid time:', dateString);
      return "Invalid time";
    }
    
    return formatInTimeZone(date, userTimezone, "h:mm a");
  } catch (error) {
    console.error('Error formatting invoice time:', error, { dateString });
    return "Time error";
  }
} 