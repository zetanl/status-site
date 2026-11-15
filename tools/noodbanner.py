"""Noodroute: zet meldingen uit incidents/*.md als banner bovenaan site/index.html en site/en/index.html.
Alleen bedoeld voor als app.zeta.nl zelf niet werkt. Geen externe afhankelijkheden."""
import glob, html, os, re

NIVEAU = {"warn": "Werkt trager", "part": "Gedeeltelijke storing", "bad": "Storing", "maint": "Onderhoud"}
NIVEAU_EN = {"warn": "Slower than usual", "part": "Partial outage", "bad": "Outage", "maint": "Maintenance"}

meldingen = []
for pad in sorted(glob.glob("incidents/*.md")):
    if os.path.basename(pad).upper().startswith("LEESMIJ"):
        continue
    tekst = open(pad, encoding="utf-8").read().replace("\r\n", "\n")
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", tekst, re.S)
    if not m:
        continue
    kop = dict(re.findall(r"^(\w+):\s*(.*?)\s*(?:#.*)?$", m.group(1), re.M))
    meldingen.append((kop, m.group(2).strip()))

if meldingen:
    for doel, en in (("site/index.html", False), ("site/en/index.html", True)):
        if not os.path.exists(doel):
            continue
        blokken = []
        for kop, body in meldingen:
            niv = kop.get("niveau", "part")
            titel = kop.get("titel_en" if en else "titel_nl") or kop.get("titel_nl", "")
            label = (NIVEAU_EN if en else NIVEAU).get(niv, niv)
            blokken.append(
                '<div style="background:#fdf1ef;border:1px solid #f0c9c4;border-left:4px solid #d9252e;border-radius:11px;'
                'padding:14px 18px;margin:18px auto 0;max-width:848px;color:#24303c;font-family:Inter,Arial,sans-serif">'
                f'<b style="color:#8e2b20">{html.escape(label)}</b> &middot; <b>{html.escape(titel)}</b>'
                f'<p style="margin:.4rem 0 0">{html.escape(body)}</p></div>')
        pagina = open(doel, encoding="utf-8").read()
        pagina = pagina.replace("</header>", "</header>" + "".join(blokken), 1)
        open(doel, "w", encoding="utf-8").write(pagina)
    print(f"{len(meldingen)} noodmelding(en) geplaatst")
else:
    print("geen noodmeldingen")
