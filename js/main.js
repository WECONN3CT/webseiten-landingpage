/* WECONN3CT Landingpage — Consent, Pixel, Reveal, Form-UX */
(function () {
    'use strict';

    var CONSENT_KEY = 'wc_consent';

    /* Anzeigen-Besucher sollen oben starten: die In-App-Browser von
       Facebook/Instagram stellen sonst gern die letzte Scroll-Position
       wieder her und landen mitten auf der Seite (z. B. am Formular).
       Nur ohne Anker in der URL eingreifen, damit #anfrage-Links
       weiterhin funktionieren. */
    if (!location.hash) {
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
        window.addEventListener('pageshow', function () { window.scrollTo(0, 0); });
    }

    /* ---------- Meta Pixel (nur nach Consent) ---------- */
    function loadPixel() {
        if (!window.WC_PIXEL_ID || window.WC_PIXEL_ID === 'DEINE_PIXEL_ID' || window.fbq) return;
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', window.WC_PIXEL_ID);
        window.fbq('track', 'PageView');
    }

    /* ---------- Consent Banner ---------- */
    var banner = document.getElementById('consentbanner');
    var consent = localStorage.getItem(CONSENT_KEY);

    if (consent === 'yes') {
        loadPixel();
    } else if (consent !== 'no' && banner) {
        banner.hidden = false;
    }

    if (banner) {
        var yes = document.getElementById('consent-yes');
        var no = document.getElementById('consent-no');
        var save = document.getElementById('consent-save');
        var marketingToggle = document.getElementById('consent-marketing');

        var decide = function (value) {
            var before = localStorage.getItem(CONSENT_KEY);
            localStorage.setItem(CONSENT_KEY, value);
            banner.hidden = true;
            syncConsentField();
            if (value === 'yes') loadPixel();
            /* Widerruf: das Pixel ist dann schon geladen — erst ein Reload
               entfernt es wirklich von der Seite */
            if (before === 'yes' && value === 'no') location.reload();
        };

        if (yes) yes.addEventListener('click', function () { decide('yes'); });
        if (no) no.addEventListener('click', function () { decide('no'); });
        if (save) save.addEventListener('click', function () {
            decide(marketingToggle && marketingToggle.checked ? 'yes' : 'no');
        });

        /* Zweite Ebene mit den Schaltern ein-/ausklappen */
        var details = document.getElementById('consent-details');
        var toggleDetails = document.getElementById('consent-toggle-details');
        if (toggleDetails && details) toggleDetails.addEventListener('click', function () {
            details.hidden = !details.hidden;
        });

        /* "Cookie-Einstellungen" im Footer: Banner mit gespeicherter Auswahl
           und offener zweiter Ebene wieder oeffnen — Widerruf muss so einfach
           sein wie die Einwilligung */
        var settings = document.getElementById('cookie-settings');
        if (settings) settings.addEventListener('click', function (e) {
            e.preventDefault();
            if (marketingToggle) {
                marketingToggle.checked = localStorage.getItem(CONSENT_KEY) === 'yes';
            }
            if (details) details.hidden = false;
            banner.hidden = false;
        });
    }

    /* Consent-Status ins Formular spiegeln (für CAPI serverseitig) */
    function syncConsentField() {
        var f = document.getElementById('f-consent');
        if (f) f.value = localStorage.getItem(CONSENT_KEY) === 'yes' ? '1' : '0';
    }
    syncConsentField();

    /* Klick-ID (?fbclid=...) aus der Anzeigen-URL ins Formular spiegeln —
       der Server baut daraus das fbc fürs CAPI-Matching. sessionStorage
       hält sie fest, falls die URL ohne Parameter neu geladen wird. */
    try {
        var fbclid = new URLSearchParams(location.search).get('fbclid');
        if (fbclid) sessionStorage.setItem('wc_fbclid', fbclid);
        var fbclidField = document.getElementById('f-fbclid');
        if (fbclidField) fbclidField.value = sessionStorage.getItem('wc_fbclid') || '';
    } catch (e) { /* Privacy-Modi ohne sessionStorage: dann eben ohne */ }

    /* Nur zum Testen: ?test_event_code=TEST123 an die Landingpage-URL haengen,
       dann taucht das CAPI-Event im "Events testen"-Tab des Events Managers
       auf. Im Normalbetrieb bleibt das Feld leer. */
    try {
        var testCode = new URLSearchParams(location.search).get('test_event_code');
        var testField = document.getElementById('f-testcode');
        if (testField && testCode) testField.value = testCode;
    } catch (e) {}

    /* ---------- Formular-UX ---------- */
    /* Wer noch keine Webseite hat, kann keine analysieren lassen:
       Adressfeld verschwindet, der Knopf verspricht dann ein Angebot statt einer Analyse */
    var statusSel = document.getElementById('f-status');
    var urlField = document.getElementById('url-field');
    var submitLabel = document.getElementById('submitlabel');
    if (statusSel && urlField) {
        var syncOfferState = function () {
            var ohneSeite = statusSel.value === 'nein';
            urlField.hidden = ohneSeite;
            if (submitLabel) {
                submitLabel.textContent = ohneSeite
                    ? 'Kostenloses Angebot anfordern'
                    : 'Kostenlose Analyse anfordern';
            }
        };
        statusSel.addEventListener('change', syncOfferState);
        syncOfferState();
    }

    var form = document.getElementById('leadform');
    if (form) {
        form.addEventListener('submit', function () {
            syncConsentField();
            var btn = document.getElementById('submitbtn');
            if (btn) {
                btn.disabled = true;
                if (submitLabel) submitLabel.textContent = 'Wird gesendet…';
                else btn.textContent = 'Wird gesendet…';
            }
            /* Browser-seitiges Lead-Event feuert auf der Dankeseite (mit eventID zur Deduplizierung) */
        });
    }

    /* ---------- Header: transparente Leiste zieht sich zur Glaspille zusammen ---------- */
    var header = document.querySelector('.site-header');
    if (header) {
        var shrunk = null;
        var syncHeader = function () {
            var next = window.scrollY > 20;
            if (next !== shrunk) {
                shrunk = next;
                header.classList.toggle('shrunk', next);
            }
        };
        window.addEventListener('scroll', syncHeader, { passive: true });
        window.addEventListener('resize', syncHeader, { passive: true });
        syncHeader();
    }

    /* ---------- Reveal on Scroll ----------
       Bewusst ohne IntersectionObserver: der feuert nicht, wenn das Dokument
       beim Scrollen nicht sichtbar ist (Prerender, Hintergrund-Tab, Embeds) —
       Inhalte blieben dann unsichtbar. Der rAF-gedrosselte Positions-Check
       ist bei ~24 Elementen genauso günstig und funktioniert überall. */
    var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    var ticking = false;

    function checkReveals() {
        ticking = false;
        if (!reveals.length) return;
        var limit = window.innerHeight * 0.94;
        reveals = reveals.filter(function (el) {
            if (el.getBoundingClientRect().top < limit) {
                el.classList.add('in');
                return false;
            }
            return true;
        });
    }

    function requestCheck() {
        if (!ticking) {
            ticking = true;
            /* setTimeout statt requestAnimationFrame: rAF pausiert in
               versteckten Dokumenten — dann würde nie wieder geprüft. */
            window.setTimeout(checkReveals, 80);
        }
    }

    window.addEventListener('scroll', requestCheck, { passive: true });
    window.addEventListener('resize', requestCheck, { passive: true });
    document.addEventListener('visibilitychange', requestCheck);
    checkReveals();

    /* ---------- Sticky-Knopf weicht dem Formular ----------
       Auf dem Handy steht das Formular gleich unter der Hero. Der feste Knopf
       am unteren Rand liegt dann genau ueber dem Absende-Knopf und fuehrt
       dorthin, wo man ohnehin schon ist. Also: sobald das Formular im Bild
       ist, faehrt er weg. Gleiche Drossel wie oben, kein zweiter Listener. */
    var cta = document.getElementById('mobilecta');
    var anfrage = document.getElementById('anfrage');
    if (cta && anfrage) {
        var syncCta = function () {
            var r = anfrage.getBoundingClientRect();
            /* sichtbar, sobald irgendein Teil des Formulars im Fenster steht */
            var sichtbar = r.bottom > 0 && r.top < window.innerHeight;
            cta.classList.toggle('away', sichtbar);
        };
        var ctaTicking = false;
        var requestCta = function () {
            if (ctaTicking) return;
            ctaTicking = true;
            window.setTimeout(function () { ctaTicking = false; syncCta(); }, 80);
        };
        window.addEventListener('scroll', requestCta, { passive: true });
        window.addEventListener('resize', requestCta, { passive: true });
        syncCta();
    }
})();
