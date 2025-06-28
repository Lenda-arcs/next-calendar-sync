// enrichInstance.ts
export function extractStudentCounts(description, isHistorical = false) {
  if (!isHistorical) return {
    studentsStudio: null,
    studentsOnline: null
  };
  const matchStudioCount = /#students\s+(\d+)/i.exec(description);
  const matchOnlineCount = /#online\s+(\d+)/i.exec(description);
  return {
    studentsStudio: matchStudioCount ? parseInt(matchStudioCount[1], 10) : null,
    studentsOnline: matchOnlineCount ? parseInt(matchOnlineCount[1], 10) : null
  };
}
export function matchStudioId(location, studios) {
  if (!location || !studios) return null;
  const lowerLoc = location.toLowerCase();
  const match = studios.find((s) => {
    if (!s.location_match || !Array.isArray(s.location_match)) return false;
    return s.location_match.some(pattern => lowerLoc.includes(pattern.toLowerCase()));
  });
  return match?.id || null;
}
