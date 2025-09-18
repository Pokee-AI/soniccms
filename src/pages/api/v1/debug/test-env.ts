import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const apiKey = context.request.headers.get('x-api-key');
  const expectedApiKey = context.locals.runtime.env.API_KEY;
  
  return new Response(JSON.stringify({
    receivedApiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'none',
    expectedApiKey: expectedApiKey ? `${String(expectedApiKey).substring(0, 8)}...` : 'none',
    apiKeyMatch: apiKey === expectedApiKey,
    hasApiKey: !!apiKey,
    hasExpectedApiKey: !!expectedApiKey,
    allEnvVars: Object.keys(context.locals.runtime.env)
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
