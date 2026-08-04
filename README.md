# WECONN3CT — Landingpage „Webseite erstellen lassen"

Meta-Ads-Landingpage mit Dankeseite und sauberem Conversion-Tracking (Pixel + Conversions API mit Deduplizierung).

**Stack:** Statisches HTML/CSS/JS + eine Cloudflare Pages Function (`/api/lead`). Kein Build-Schritt.

## Struktur

```
index.html            Landingpage (Formular)
danke.html            Dankeseite (noindex, feuert Pixel-Lead-Event)
css/style.css         Styles
js/main.js            Consent-Banner, Pixel-Loader, Animationen
functions/api/lead.js Formular-Handler: Telegram + Meta CAPI + Redirect /danke
robots.txt            /danke für Google gesperrt
```

## Tracking-Konzept

1. Formular POSTet an `/api/lead`
2. Function erzeugt eine `event_id`, schickt das **CAPI-Lead-Event** (serverseitig) und leitet auf `/danke?eid=<event_id>` weiter
3. Dankeseite feuert das **Pixel-Lead-Event** mit derselben `eventID`
4. Meta **dedupliziert** beide Signale → maximale Messgenauigkeit, keine Doppelzählung

Pixel lädt **nur nach Consent** (Banner). CAPI wird ebenfalls nur bei Consent gesendet (Hidden-Field `consent`).

## Setup (einmalig)

### 1. Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**
2. Repo `WECONN3CT/webseiten-landingpage` wählen
3. Build settings: **kein Framework, kein Build-Command, Output-Directory: `/`** → Deploy
4. **Wichtig:** Wenn Cloudflare anbietet, die Domain zu Cloudflare umzuziehen („Add site") → **überspringen!** Nur Pages nutzen, DNS bleibt bei Strato.

### 2. Subdomain bei Strato

DNS-Verwaltung → neuer Eintrag:

```
webseite.weconn3ct.de  →  CNAME  →  <projekt>.pages.dev
```

Danach in Cloudflare Pages → **Custom domains → Add** → `webseite.weconn3ct.de`.
⚠️ Keine bestehenden Einträge anfassen (MX/SPF = Microsoft-Mail, www = GitHub Pages).

### 3. Meta Pixel + Conversions API

1. [Meta Events Manager](https://business.facebook.com/events_manager2) → Pixel anlegen (falls nicht vorhanden) → **Pixel-ID** kopieren
2. Pixel-ID in `index.html` **und** `danke.html` eintragen (`WC_PIXEL_ID`)
3. Events Manager → Einstellungen → **Conversions API → Access Token generieren**
4. Cloudflare Pages → Settings → **Environment variables**:
   - `META_PIXEL_ID` = Pixel-ID
   - `META_ACCESS_TOKEN` = CAPI-Token
5. Domain `weconn3ct.de` im Business Manager **verifizieren** (Brand Safety → Domains)

### 4. Telegram-Benachrichtigung (optional, empfohlen)

Cloudflare Env-Vars:
- `TG_BOT_TOKEN` = Bot-Token
- `TG_CHAT_ID` = Chat-ID

### 5. Testen vor Kampagnen-Start

- [ ] Formular absenden → Weiterleitung auf `/danke` funktioniert
- [ ] Telegram-Nachricht kommt an
- [ ] Events Manager → **Test-Events**: Lead erscheint 2× (Browser + Server) und wird dedupliziert
- [ ] Event Match Quality > 6
- [ ] Mobil testen (Ladezeit, Formular)

## Offene Punkte vor Launch

- [x] Pixel-ID `793190807188093` in `index.html` + `danke.html` eingetragen
- [x] Datenschutzerklärung auf weconn3ct.de um Meta-Pixel/CAPI-Passus ergänzt
- [ ] `META_PIXEL_ID` + `META_ACCESS_TOKEN` als Env-Vars in Cloudflare Pages setzen
- [ ] Zahlen prüfen: „2–4 Wochen"
