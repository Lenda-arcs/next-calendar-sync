//TODO: enable for production use only for new domain
const allowedOrigins = [
  "http://localhost:4321",
  "https://[REPLACE-SOMEDOMAIN].com"
];
function getCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
}
function generateRecurrenceInstances(entry, windowDays = 90) {
  if (!entry.rrule) return [
    {
      ...entry
    }
  ];
  const exdates = entry.exdate ? Object.values(entry.exdate).map((d)=>new Date(d)) : [];
  const nowUTC = new Date();
  const untilUTC = new Date(nowUTC.getTime() + windowDays * 24 * 60 * 60 * 1000);
  return entry.rrule.between(nowUTC, untilUTC, true).filter((date)=>!exdates.find((ex)=>date.getTime() === new Date(ex).getTime())).map((date)=>{
    const duration = entry.end.getTime() - entry.start.getTime();
    // Create new date objects and preserve timezone info
    const newStart = new Date(date.getTime());
    const newEnd = new Date(date.getTime() + duration);
    // Preserve timezone information from the original event
    if (entry.start?.tz) {
      newStart.tz = entry.start.tz;
    }
    if (entry.end?.tz) {
      newEnd.tz = entry.end.tz;
    }
    return {
      ...entry,
      start: newStart,
      end: newEnd,
      recurrence_id: date.toISOString()
    };
  });
}
function extractCalendarName(icsText) {
  const match = icsText.match(/^X-WR-CALNAME:(.+)$/m);
  return match ? match[1].trim() : null;
}
function ensureUTCString(dateInput) {
  if (!dateInput) return new Date().toISOString();
  // If it's a Date object, convert to UTC
  if (dateInput instanceof Date) {
    // Check if it has timezone info
    if (dateInput.tz) {
      const timezone = dateInput.tz;
      // Generic timezone conversion for any IANA timezone identifier
      // The ical library gives us local time in the source timezone,
      // we need to convert it to UTC
      try {
        // Use Intl.DateTimeFormat to determine the timezone offset at this specific date
        // This handles DST changes automatically for any timezone
        const date = new Date(dateInput.getTime());
        // Get the offset by comparing the same moment in the target timezone vs UTC
        const utcDate = new Date(date.toLocaleString("en-US", {
          timeZone: "UTC"
        }));
        const tzDate = new Date(date.toLocaleString("en-US", {
          timeZone: timezone
        }));
        // Calculate the offset in milliseconds
        const offset = tzDate.getTime() - utcDate.getTime();
        // Apply the offset to convert from source timezone to UTC
        const utcTime = dateInput.getTime() - offset;
        return new Date(utcTime).toISOString();
      } catch (error) {
        console.warn(`Unknown timezone ${timezone}, falling back to manual calculation`);
        // Fallback for unsupported timezones: use a basic offset estimation
        // This is a simplified approach for common European timezones
        const month = dateInput.getMonth();
        let offsetHours = 0;
        if (timezone.includes("Europe/")) {
          // Most European timezones are UTC+1 in winter, UTC+2 in summer
          const isDST = month >= 2 && month <= 9; // Rough DST period
          offsetHours = isDST ? 2 : 1;
        } else if (timezone.includes("America/")) {
          // Basic handling for some American timezones
          // This would need to be expanded for production use
          offsetHours = timezone.includes("Eastern") ? month >= 2 && month <= 9 ? -4 : -5 : 0;
        }
        // Add more timezone families as needed
        const utcTime = dateInput.getTime() - offsetHours * 60 * 60 * 1000;
        return new Date(utcTime).toISOString();
      }
    }
    // For dates without timezone info, use the built-in conversion
    return dateInput.toISOString();
  }
  // If it's a string, try to parse it
  if (typeof dateInput === "string") {
    return new Date(dateInput).toISOString();
  }
  // If it has a toISOString method, use it
  if (dateInput.toISOString && typeof dateInput.toISOString === "function") {
    return dateInput.toISOString();
  }
  // Fallback: try to create a Date from it
  return new Date(dateInput).toISOString();
}
function matchTags(content, rules, tagMap) {
  const auto_tag_ids = rules.filter((r)=>content.includes(r.keyword.toLowerCase())).map((r)=>r.tag_id);
  return auto_tag_ids.map((id)=>tagMap[id]).filter(Boolean);
}
async function fetchExistingEvents(supabase, userId, feedId, windowStart, windowEnd) {
  return await supabase.from("events").select("id, uid, recurrence_id, start_time").eq("user_id", userId).eq("feed_id", feedId).gte("start_time", windowStart.toISOString()).lte("start_time", windowEnd.toISOString());
}
// Helper to delete stale events
async function deleteStaleEvents(supabase, enrichedEvents, existingEvents) {
  const activeKeys = new Set(enrichedEvents.map((e)=>`${e.uid}_${e.recurrence_id || ""}`));
  const staleIds = (existingEvents || []).filter((e)=>!activeKeys.has(`${e.uid}_${e.recurrence_id || ""}`)).map((e)=>e.id);
  if (staleIds.length > 0) {
    await supabase.from("events").delete().in("id", staleIds); // or: update visibility = 'hidden'
  }
}
export { getCorsHeaders, matchTags, generateRecurrenceInstances, extractCalendarName, ensureUTCString, fetchExistingEvents, deleteStaleEvents };
