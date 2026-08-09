# Meta-Kampagne & Tracking — Stand und offene Punkte

Stand: 09.08.2026 · Landingpage `landing.weconn3ct.de` · **Kampagne LIVE seit 06.08.**

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

### Checkpoints (Anfang KW 33)

- [ ] Ankunftsquote Klick→Landingpage nach den Fixes prüfen (Erwartung: von 29 % Richtung 50 %+)
- [ ] Deduplizierungsrate im Events Manager prüfen (Lead-Event → Details; darf nicht 0 sein)
- [ ] Lead-Bilanz ab ~120 € Gesamtausgaben ziehen (erwarteter CPL 15–40 €)
- [ ] **9:16-Version des Alena-Motivs** für Reels/Stories nachliefern (größter Hebel — Reels ist die größte Platzierung, 4:5 wird dort mit Balken gezeigt); resettet die Lernphase nicht
- [ ] Falls IG Feed weitere ~20 € ohne LP-Aufrufe frisst: Platzierung ausschließen (erst nach Ankunftsquoten-Check)
- **Lernphase nicht stören:** Budget/Targeting/Creative-Grundgerüst bis zur Lead-Bilanz nicht anfassen.

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
