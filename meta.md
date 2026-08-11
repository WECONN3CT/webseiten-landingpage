# Meta-Kampagne & Tracking — Stand und offene Punkte

Stand: 11.08.2026 · Landingpage `landing.weconn3ct.de` · **Kampagne LIVE seit 06.08.**

## Eckdaten

| | |
|---|---|
| Datensatz / Pixel-ID | `793190807188093` („Landingpage Webseite SEO") |
| Werbekonto | `act 2515688668931117` (WECONN3CT GmbH, im Business-Portfolio `3685769665030288`) |
| Kampagne | „WEBSEITE & SEO 06.08" — Advantage+ Leads, Conversion-Event **Lead**, 25 €/Tag, Bad Honnef +30 km, ohne Enddatum |
| Anzeige | 1 Bild-Anzeige (Alena-Motiv 4:5), Ziel-URL `https://landing.weconn3ct.de`, UTM-Parameter gesetzt, CTA „Angebot einholen" |
| Live-Adresse | https://landing.weconn3ct.de |
| Repo | `WECONN3CT/webseiten-landingpage` (**öffentlich**) |
| Hosting | Cloudflare Pages, Auto-Deploy auf `main`; Env-Vars: `META_PIXEL_ID`, `META_ACCESS_TOKEN` (Secret), `TG_BOT_TOKEN` (Secret), `TG_CHAT_ID` |
| DNS `weconn3ct.de` | **Strato** — Nameserver NICHT zu Cloudflare umziehen |

## Kampagnen-Zwischenstand (Auswertung 08.08., erste ~36 h)

Vollständige Analyse: `~/Downloads/WECONN3CT-Kampagnen-Auswertung-08.08.2026.pdf`

- **Anzeige funktioniert:** CTR 2,20 % (Benchmark ~1 %), CPC 0,77 €, CPM 16,93 €, 1.408 Impressionen, 31 Klicks, 23,84 € ausgegeben.
- **Funnel-Knick:** nur 9 gemessene Landingpage-Aufrufe bei 31 Klicks — Mischung aus Consent-Messeffekt (Pixel feuert nur nach Zustimmung), Scroll-Bug und Ladezeit (beide 08.08. gefixt, s. u.).
- **Platzierungen:** IG Reels 510 Impr./12 Klicks, IG Feed 426/11 (nur 1 LP-Aufruf — beobachten!), FB Feed 229/7 (beste Ankunftsquote), IG Stories 143/1.
- **0 echte Leads** — bei <25 € Ausgaben statistisch bedeutungslos; Urteil erst ab ~120 € Gesamtausgaben fair.

### Checkpoints (geprüft 11.08., Auswertungsbogen als Claude-Artifact)

- [x] **Ankunftsquote:** gemessen ~30 % nach den Fixes (25–41 %, Ausreißer Sa 09.08. mit 0/10) — nicht die erhofften 50 %+, aber Messung ist consent-gated (schlanker Banner wird vermutlich öfter ignoriert als das alte Modal → Messquote sinkt, ohne dass real weniger ankommen). Echte Quote unbekannt → consent-blinde Zweitmessung via Cloudflare aufsetzen.
- [x] **Deduplizierung:** nicht bewertbar — seit den Test-Leads vom 06.08. kein Lead-Event mehr, Events Manager sagt „Daten werden noch analysiert". Kein Fehler sichtbar; nach dem ersten echten Lead erneut prüfen.
- [x] **IG Feed entwarnt:** 12 LP-Aufrufe bei 37 € Gesamt — beste Platzierung, bleibt drin.
- [ ] **Lead-Bilanz:** 0 Leads bei 108,07 € (Stand 11.08. abends). Bilanz-Entscheid auf ~150 € (~Fr 15.08.) verschoben, weil 9:16-Creative und CLS-Fix noch ausstehen. Bis dahin Lernphase nicht stören.
- [ ] **9:16-Version des Alena-Motivs** — weiterhin offen und weiterhin größter Hebel: Reels+Stories = ~51 € (47 % der Ausgaben) mit Balken-Optik.
- [ ] **CLS-Bug fixen:** CLS unverändert 0,335 (Font-Fixes haben es nicht behoben). Lighthouse: „Verursacher von Layout Shifts" rot + 421 KiB Bild-Einsparpotenzial. Reine Seiten-Änderung, Kampagne unberührt.

### Kampagnen-Zwischenstand 11.08. (Tag 6, 19:45 Uhr)

- Gesamt: 108,07 € · 6.319 Impr. · 105 Link-Klicks · CTR 1,66 % · CPC 1,03 € · CPM 17,10 € · 31 LP-Aufrufe (3,49 €) · **0 Leads**.
- PageSpeed mobil nachgemessen: **60 → 73**, LCP 4,9 → 3,1 s, TBT 0 ms — aber CLS weiter 0,335.
- Budget-Underdelivery: ~18 €/Tag statt 25 € (kleiner Radius) — kein Eingriff nötig, verschiebt aber die Bilanzschwelle.
- Tageswerte (Ausgaben / Link-Klicks / LP-Aufrufe): 06.: 6,71/11/2 · 07.: 17,13/20/7 · 08.: 30,77/32/13 · 09.: 18,07/10/0 · 10.: 17,90/20/5 · 11.: 17,52/12/4.

## Landingpage-Fixes vom 08.08. (alle live)

- **Scroll-Fix In-App-Browser:** FB/IG-Browser stellten die letzte Scroll-Position wieder her → Besucher landeten mitten auf der Seite. Jetzt: `scrollRestoration = manual` + mehrfaches Scroll-to-top (load/pageshow/150 ms) mit Interaktions-Guard, nur ohne URL-Hash (`main.js`).
- **Consent-Banner:** kompakte Karte **unten links** (vorher zentriertes Modal über der Headline). Zwei Ebenen: erste Ebene „Nur notwendige"/„Alle akzeptieren" gleichwertig (EuGH/DSK-Vorgabe), Schalter unter „Einstellungen" (nicht vorangekreuzt — Planet49!), Widerruf über Footer-Link „Cookie-Einstellungen".
- **Performance:** Google Fonts async (nicht mehr render-blockierend) + metrik-angepasste Fallback-Fonts (CLS), 10 Showcase-Bilder lazy. Vorher: PageSpeed 60, LCP 4,9 s, CLS 0,335. **Nachher-Messung steht aus** (PageSpeed-API-Tageslimit war erschöpft) → pagespeed.web.dev.

## Tracking — was läuft

- Pixel (nur nach Consent) + **CAPI** serverseitig (`functions/api/lead.js`), dedupliziert über gemeinsame `event_id` (Redirect `/danke?eid=…`).
- **fbc aus Klick-ID:** `?fbclid=` → Hidden-Field → `fb.1.<ts>.<fbclid>` falls kein `_fbc`-Cookie (Cookie hat Vorrang). Qualität des Event-Abgleichs dadurch 7,5 → **8,0/10**.
- **test_event_code-Support:** `https://landing.weconn3ct.de/?test_event_code=TESTxxx` öffnen, Banner akzeptieren, Formular absenden → Server-Event erscheint im „Events testen"-Tab (sonst prinzipbedingt unsichtbar!).
- Lead-Benachrichtigung: Telegram + Formspree-Mail (laufen **immer**, auch ohne Consent — nur Meta-Events sind consent-gated).
- Honeypot-Feld `company` verwirft Bots still.

## Kampagnen-Analyse per Claude

- Plugin **`claude-ads`** global installiert (`/ads audit`, `/ads monitor`, `/ads meta` — in neuen Sessions verfügbar). Read-only.
- **Workflow ohne API-Token (Standard):** Werbeanzeigenmanager per Browser-Extension öffnen → gewünschte Aufschlüsselung → „Exportieren" → CSV aus `~/Downloads` analysieren. So entstand die Auswertung vom 08.08.
- **API-Token (optional, Plan A):** Business-Portfolio hat noch keine eigene App → Token-Generierung gesperrt. Vorarbeit erledigt: Systemnutzer „Conversions API System User" hat das Werbekonto mit „Performance ansehen" (read-only) zugewiesen. Fehlt nur: Mentor registriert sich mit persönlichem FB-Profil auf developers.facebook.com als Entwickler + erstellt Business-App → dann Token generieren (ads_read) → macOS-Schlüsselbund.

## Wissenswertes / Stolperfallen

- Meta-Editor „verbessert" Anzeigentexte beim maschinellen Tippen ungefragt (letzte Primärtext-Zeile wurde zu „… anfordern ganz unverbindlich." verstümmelt — bei Bedarf von Hand korrigieren).
- Alle Meta-KI-Optimierungen (Overlays, Bild-/Text-Optimierung, KI-Bilder) bewusst AUS — fertig designtes Creative. Kampagnenbewertung zeigt deshalb 70 statt 100: ignorieren, reiner Upsell-Score.
- „Events testen" zeigt CAPI-Events nur mit test_event_code; CSV-Exporte je nach Zeitraum ohne den laufenden Tag — beides führte am 06.08. zu einem Fehlalarm „Tracking kaputt" (war es nicht).
- Env-Var-Änderungen in Cloudflare greifen erst mit neuem Deployment.
- **Keine Zugangsdaten in den Chat.** Tokens direkt in Cloudflare bzw. Schlüsselbund.
- Dieses Repo ist **öffentlich** — diese Datei enthält bewusst keine Geheimnisse.

## Erledigt-Archiv (Kurzfassung)

Domain bei Meta verifiziert (05.08., DNS-TXT bei Strato) · Telegram-Benachrichtigung getestet (05.08.) · Datenschutzerklärung um Pixel/CAPI ergänzt · Kundenstimmen mit echten Kundenlogos (06.08.) · Kampagne + Anzeige aufgesetzt und veröffentlicht (06.08.) · AEM/Event-Priorisierung hinfällig (von Meta 2025 abgeschafft).
