# ZETA Status (status.zeta.nl)

Publieke statuspagina van ZETA. **Deze repository bevat alleen openbare inhoud.**

- `site/` wordt automatisch gegenereerd door app.zeta.nl (statusmodule) en elke minuut bijgewerkt als er iets verandert.
  Niet met de hand aanpassen: het wordt overschreven.
- `incidents/` is de noodroute: als app.zeta.nl zelf niet werkt, kan een ZETA-medewerker hier een melding plaatsen
  (Markdown met front matter). Zie `incidents/LEESMIJ.md`.
- Publicatie: GitHub Pages (spiegel, https://zetanl.github.io/status-site/) en Cloudflare Workers (status.zeta.nl),
  via `.github/workflows/publiceer.yml`.

Geen klantnamen, IP-adressen of interne systeemnamen in deze repository.
