// _shared/matching.ts
// Reusable matching logic for tags and studios

interface TagRule {
  tag_id: string;
  keyword?: string;
  keywords?: string[];
  location_keywords?: string[];
}

interface Studio {
  id: string;
  location_match?: string[];
}

// Match tags based on content and location against tag rules
export function matchTags(
  content: string, 
  location: string, 
  rules: TagRule[], 
  tagMap: Record<string, string>
): string[] {
  try {
    const auto_tag_ids = rules.filter((r) => {
      // Check if any keyword in the rule matches the content
      const keywordMatch = r.keywords && Array.isArray(r.keywords) && r.keywords.some((keyword: string) => 
        content.includes(keyword.toLowerCase())
      );
      
      // Check if any location keyword matches the location
      const locationMatch = r.location_keywords && Array.isArray(r.location_keywords) && location && r.location_keywords.some((keyword: string) => 
        location.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // For backward compatibility, check single keyword field
      const legacyMatch = r.keyword && content.includes(r.keyword.toLowerCase());
      
      return keywordMatch || locationMatch || legacyMatch;
    }).map((r) => r.tag_id);
    
    return auto_tag_ids.map((id) => tagMap[id]).filter(Boolean);
  } catch (error) {
    console.error("Error in matchTags:", error);
    return [];
  }
}

// Match studio ID based on location against studio patterns
export function matchStudioId(location: string, studios: Studio[]): string | null {
  try {
    if (!location || !studios) return null;
    const lowerLoc = location.toLowerCase();
    const match = studios.find((s) => {
      if (!s.location_match || !Array.isArray(s.location_match)) return false;
      return s.location_match.some((pattern: string) => lowerLoc.includes(pattern.toLowerCase()));
    });
    return match?.id || null;
  } catch (error) {
    console.error("Error in matchStudioId:", error);
    return null;
  }
} 