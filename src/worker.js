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
    return antwoord;
  },
};
