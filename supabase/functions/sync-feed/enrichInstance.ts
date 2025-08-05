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
