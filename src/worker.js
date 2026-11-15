// status.zeta.nl op Cloudflare Workers.
// Statische bestanden (site/) komen uit de assets. Alles wat daar niet in staat (bv. /api/status.php, dat app.zeta.nl
// nog leest, en oude adressen met een 301) gaat door naar de oorspronkelijke server. Een subrequest naar dezelfde
// hostnaam slaat deze Worker over, dus dit veroorzaakt geen lus.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/') || url.pathname.endsWith('.php') || url.pathname.startsWith('/rss/')) {
      return fetch(request);
    }
    const antwoord = await env.ASSETS.fetch(request);
    if (antwoord.status === 404) {
      return fetch(request);
    }
    return beveiligd(antwoord, url.pathname);
  },
};

// Beveiligingsheaders op alles wat uit de assets komt. _headers wordt door Cloudflare NIET toegepast op antwoorden die via
// de Worker lopen, daarom hier. Turnstile (aanmeldformulier) vraagt script-src en frame-src challenges.cloudflare.com.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
  "font-src https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self' https://app.zeta.nl",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

function beveiligd(antwoord, pad) {
  const r = new Response(antwoord.body, antwoord);
  r.headers.set('Content-Security-Policy', CSP);
  r.headers.set('X-Content-Type-Options', 'nosniff');
  r.headers.set('Referrer-Policy', pad.includes('/abonneren/') ? 'no-referrer' : 'strict-origin-when-cross-origin');
  r.headers.set('X-Frame-Options', 'DENY');
  r.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  r.headers.set('Strict-Transport-Security', 'max-age=31536000');
  if (pad.endsWith('/') || /\.(html|json|xml)$/.test(pad)) {
    r.headers.set('Cache-Control', 'no-cache');
  }
  if (pad === '/status.json') {
    r.headers.set('Access-Control-Allow-Origin', '*');
  }
  return r;
}
