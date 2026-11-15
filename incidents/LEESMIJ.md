# Noodroute: melding plaatsen zonder app.zeta.nl

Alleen gebruiken als app.zeta.nl zelf niet bereikbaar is. Maak in deze map een bestand
`JJJJ-MM-DD-korte-naam.md` (bijvoorbeeld via de GitHub-website of -app) met:

```
---
niveau: part            # warn | part | bad | maint
onderdelen: [email.zakelijk]
titel_nl: E-mail komt vertraagd binnen
titel_en: Incoming email is delayed
begint_op: 2026-11-16T09:12:00+01:00
---
Wat merkt u? Nieuwe e-mail komt later binnen. Wij werken aan een oplossing.
```

Na het opslaan publiceert de workflow binnen ongeveer een minuut een noodbanner bovenaan de pagina.
Zodra app.zeta.nl weer werkt, zet een medewerker de melding daar netjes in en verwijdert dit bestand.
