// _shared/cors.ts
// Reusable CORS headers for Edge Functions

export function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "*", 
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET, PUT, DELETE"
  };
}

export function createCorsResponse(data: unknown, status: number = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...getCorsHeaders(origin),
      "Content-Type": "application/json"
    }
  });
}

export function createOptionsResponse(origin: string | null = null) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin)
  });
} 