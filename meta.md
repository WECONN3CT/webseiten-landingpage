# Meta-Tracking — offene Punkte

Stand: 05.08.2026 (aktualisiert) · Landingpage `landing.weconn3ct.de`

## Eckdaten

| | |
|---|---|
| Datensatz / Pixel-ID | `793190807188093` („Landingpage Webseite SEO") |
| Live-Adresse | https://landing.weconn3ct.de |
| Repo | `WECONN3CT/webseiten-landingpage` (**öffentlich**) |
| Hosting | Cloudflare Pages, Projekt `webseiten-landingpage`, Auto-Deploy auf `main` |
| DNS `weconn3ct.de` | **Strato** (`docks14.rzone.de`, `shades04.rzone.de`) — nicht Cloudflare |
| Env-Vars in Cloudflare | `META_PIXEL_ID` (Text), `META_ACCESS_TOKEN` (Secret) — gesetzt |

## Was bereits läuft

- Pixel-ID in `index.html` und `danke.html` eingetragen, live geprüft.
- CAPI-Token in Cloudflare hinterlegt, Deployment gezogen.
- Lead-Event kommt über **beide** Wege an (Spalte „Integration" = „Mehrere"),
  Qualität des Event-Abgleichs **7,5/10**.
- Deduplizierung: `functions/api/lead.js` erzeugt eine `event_id`, schickt sie
  per CAPI und hängt sie als `?eid=` an die Weiterleitung; `danke.html` feuert
  das Pixel-Event mit derselben ID.
- Beides feuert nur nach Consent (Banner + Hidden-Field `consent`).
- Datenschutzerklärung auf www.weconn3ct.de um Abschnitt 9 „Meta-Pixel und
  Conversions API" ergänzt (Repo `WECONN3CT/weconn3ctseite`, Commit `e1287d1`).
- Formspree-Spamfilter für das Formular abgeschaltet.
- **Domain `weconn3ct.de` bei Meta verifiziert** (05.08.2026, per DNS-TXT bei
  Strato, Host `@`). SPF- und Google-TXT-Einträge blieben unangetastet, per
  `dig` geprüft. Status in den Business Settings: „Verified".
- **Telegram-Benachrichtigung aktiv** (05.08.2026): `TG_BOT_TOKEN` (Secret) und
  `TG_CHAT_ID` in Cloudflare Production gesetzt, Deployment neu gezogen,
  Testanfrage kam in Telegram an. Der erste Bot-Token wurde nach einem
  versehentlichen Screenshot im Chat per `/revoke` rotiert.
- **Kampagne live** (06.08.2026): „WEBSEITE & SEO 06.08" im neuen Werbekonto
  des Business-Portfolios (act 2515688668931117). Ziel Leads, Conversion-Event
  **Lead** auf Datensatz 793190807188093, Ziel-URL landing.weconn3ct.de,
  UTM-Parameter gesetzt, 25 €/Tag, Bad Honnef +30 km, ohne Enddatum.
- **Klick-ID (fbc) im CAPI-Event** (06.08.2026): `?fbclid=` wird per Hidden-Field
  (`main.js` → sessionStorage) mitgeschickt; `lead.js` baut daraus
  `fb.1.<ts>.<fbclid>`, falls kein `_fbc`-Cookie da ist (Cookie hat Vorrang).
  War Metas Top-Empfehlung beim Qualitätswert (7,5/10, „+0,7 möglich").

## Erledigt / hinfällig

- ~~Ereignis-Priorisierung (Lead über PageView)~~ — **hinfällig**: Meta hat die
  Aggregierte Event-Messung samt manueller 8-Event-Rangfolge im Juni 2025
  abgeschafft. Der Tab existiert im Events Manager nicht mehr, alle Events
  werden automatisch verarbeitet. Auch die 72-Stunden-Sperre bei Änderungen
  entfällt damit.

## Offen

### 4. Deduplizierungsrate kontrollieren — in ein paar Tagen

Events Manager → Lead-Event → **Details ansehen**. Die aktuellen Werte sind
verzerrt, weil die ersten Testeinsendungen noch ohne CAPI-Token liefen (daher
7 Roh-Events bei weniger Anfragen). Sobald echte Leads durch sind: Die Rate darf
nicht bei 0 liegen — sonst zählt Meta jede Anfrage doppelt und der
Kosten-pro-Lead sieht besser aus, als er ist.

## Hinweise für die nächste Session

- **Keine Zugangsdaten in den Chat.** Tokens gehören direkt in Cloudflare.
  Ein CAPI-Token wurde in der Session vom 04.08. versehentlich im Chat geteilt
  und danach rotiert — der alte ist ungültig.
- Env-Var-Änderungen in Cloudflare greifen erst mit einem **neuen Deployment**
  (Deployments → ⋯ → Retry deployment) oder beim nächsten Push auf `main`.
- Falls Server-Events ausbleiben: Cloudflare → Projekt → Deployment →
  **Functions → Real-time Logs**, dort loggt `lead.js` jeden Fehlschlag.
- Dieses Repo ist **öffentlich** — diese Datei enthält bewusst keine Geheimnisse.
