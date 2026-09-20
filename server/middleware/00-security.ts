/** Apply to SSR responses too: Cloudflare's static _headers file does not cover Workers. */
export const RESPONSE_HEADERS = {
  // Keep this list in the same order as public/_headers so drift shows in a diff.
  // No `preload`: that is effectively irreversible, and the zone must be clean
  // on the apex and www first.
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "content-security-policy": "object-src 'none'; base-uri 'self'",
} as const;

type ResponseEvent = { res: { headers: Headers }; req?: { method: string } };

export default async function securityHeaders(
  event: ResponseEvent,
  next: () => unknown | Promise<unknown>,
) {
  for (const [name, value] of Object.entries(RESPONSE_HEADERS)) event.res.headers.set(name, value);
  const result = await next();
  if (!(result instanceof Response)) return result;
  // Responses returned directly by other middleware can have immutable headers.
  const headers = new Headers(result.headers);
  for (const [name, value] of Object.entries(RESPONSE_HEADERS)) headers.set(name, value);
  const head = event.req?.method === "HEAD";
  if (head) await result.body?.cancel();
  return new Response(head ? null : result.body, {
    status: result.status,
    statusText: result.statusText,
    headers,
  });
}
