/**
 * Cloudflare Pages Function: POST /api/lead
 *
 * 1. Nimmt das Landingpage-Formular entgegen (Spam-Schutz via Honeypot)
 * 2. Benachrichtigung per Telegram (optional: TG_BOT_TOKEN + TG_CHAT_ID)
 * 3. Benachrichtigung per E-Mail (optional: FORMSPREE_ENDPOINT)
 * 4. Meta Conversions API "Lead"-Event — nur bei Consent
 *    (META_PIXEL_ID + META_ACCESS_TOKEN als Env-Vars in Cloudflare)
 * 5. Redirect auf /danke?eid=<event_id> — die Dankeseite feuert das
 *    Browser-Pixel-Event mit derselben eventID → Meta dedupliziert.
 *
 * Jede Benachrichtigung ist einzeln abschaltbar: fehlt eine Env-Var,
 * wird der Block uebersprungen. Keine davon darf den Redirect blockieren.
 *
 * Env-Vars (Cloudflare Pages → Settings → Environment variables):
 *   META_PIXEL_ID      – Pixel-ID aus dem Meta Events Manager
 *   META_ACCESS_TOKEN  – CAPI Access Token (Events Manager → Einstellungen → Conversions API)
 *   TG_BOT_TOKEN       – (optional) Telegram-Bot-Token für Lead-Benachrichtigung
 *   TG_CHAT_ID         – (optional) Telegram-Chat-ID
 *   FORMSPREE_ENDPOINT – (optional) überschreibt den fest hinterlegten
 *                        Formspree-Endpunkt. Die Mail geht an die Adresse,
 *                        mit der das Formspree-Konto angelegt wurde.
 */

async function sha256(value) {
    const data = new TextEncoder().encode(value.trim().toLowerCase());
    const hash = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context) {
    const { request, env } = context;

    let form;
    try {
        form = await request.formData();
    } catch {
        return new Response('Bad Request', { status: 400 });
    }

    const name = (form.get('name') || '').toString().trim().slice(0, 200);
    const email = (form.get('email') || '').toString().trim().slice(0, 200);
    const phone = (form.get('phone') || '').toString().trim().slice(0, 50);
    const status = (form.get('website_status') || '').toString().trim().slice(0, 50);
    const websiteRaw = (form.get('website_url') || '').toString().trim().slice(0, 300);
    // Ohne Schema geschrieben ("www.firma.de") laesst sich der Link sonst nicht anklicken
    const website = websiteRaw && !/^https?:\/\//i.test(websiteRaw)
        ? `https://${websiteRaw}`
        : websiteRaw;
    const consent = form.get('consent') === '1';
    const honeypot = (form.get('company') || '').toString().trim();

    const redirectTo = new URL('/danke', request.url);

    // Spam (Honeypot gefüllt) → still verwerfen, aber normal weiterleiten
    if (honeypot) {
        return Response.redirect(redirectTo.toString(), 303);
    }
    if (!name || !email || !email.includes('@')) {
        return new Response('Bitte Name und gültige E-Mail angeben.', { status: 400 });
    }

    const eventId = crypto.randomUUID();
    const statusLabels = {
        'nein': 'Noch keine Webseite',
        'veraltet': 'Webseite veraltet',
        'keine-anfragen': 'Webseite bringt keine Anfragen',
        'sonstiges': 'Sonstiges',
    };

    const tasks = [];

    // --- 1. Telegram-Benachrichtigung ---
    if (env.TG_BOT_TOKEN && env.TG_CHAT_ID) {
        const text = [
            '🔥 Neuer Lead — Webseiten-Landingpage',
            '',
            `👤 ${name}`,
            `✉️ ${email}`,
            phone ? `📞 ${phone}` : null,
            `🌐 Status: ${statusLabels[status] || status || 'k.A.'}`,
            website ? `🔍 Zu analysieren: ${website}` : null,
        ].filter(Boolean).join('\n');

        tasks.push(fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: env.TG_CHAT_ID, text }),
        }).catch(() => {}));
    }

    // --- 2. E-Mail ins Postfach (Formspree) ---
    // Bewusst serverseitig aufgerufen statt als Ziel des Formulars: so
    // bleiben Honeypot, CAPI-Event und die Weiterleitung auf /danke
    // erhalten. Formspree ist hier nur der Mail-Weg, kein Ersatz fuer
    // diese Function.
    //
    // Empfaenger ist die Adresse, mit der das Formspree-Konto angelegt
    // wurde (info@weconn3ct.de) — deshalb steht hier kein Empfaenger.
    // Das Feld `email` wertet Formspree automatisch als Reply-To aus:
    // eine Antwort aus dem Postfach geht direkt an den Interessenten.
    // Der Endpunkt steht fest im Code, weil Formspree-Endpunkte ohnehin
    // fuer den Browser gedacht und damit oeffentlich sind. Die Env-Var
    // sticht ihn, falls das Formular mal gewechselt wird.
    const formspreeEndpoint = env.FORMSPREE_ENDPOINT || 'https://formspree.io/f/xojggypa';

    if (formspreeEndpoint) {
        tasks.push(fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                _subject: `Neue Anfrage: ${name}`,
                Name: name,
                email,
                Telefon: phone || '—',
                Anliegen: statusLabels[status] || status || 'k.A.',
                'Zu analysieren': website || '—',
            }),
        }).then(async (res) => {
            if (!res.ok) console.error('Formspree antwortete mit', res.status, await res.text());
        }).catch((err) => console.error('Formspree nicht erreichbar:', err)));
    }

    // --- 3. Meta Conversions API (nur mit Consent) ---
    if (consent && env.META_PIXEL_ID && env.META_ACCESS_TOKEN) {
        const userData = {
            em: [await sha256(email)],
            client_ip_address: request.headers.get('CF-Connecting-IP') || undefined,
            client_user_agent: request.headers.get('User-Agent') || undefined,
        };
        if (phone) {
            userData.ph = [await sha256(phone.replace(/[^0-9+]/g, ''))];
        }
        const firstName = name.split(/\s+/)[0];
        if (firstName) userData.fn = [await sha256(firstName)];

        // fbp/fbc-Cookies für besseres Matching mitschicken, falls vorhanden
        const cookies = request.headers.get('Cookie') || '';
        const fbp = cookies.match(/_fbp=([^;]+)/)?.[1];
        const fbc = cookies.match(/_fbc=([^;]+)/)?.[1];
        if (fbp) userData.fbp = fbp;
        if (fbc) userData.fbc = fbc;

        const payload = {
            data: [{
                event_name: 'Lead',
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId,
                event_source_url: request.headers.get('Referer') || new URL('/', request.url).toString(),
                action_source: 'website',
                user_data: userData,
            }],
        };

        tasks.push(fetch(
            `https://graph.facebook.com/v21.0/${env.META_PIXEL_ID}/events?access_token=${env.META_ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }
        ).catch(() => {}));
    }

    // Benachrichtigung + CAPI dürfen den Redirect nicht blockieren/crashen
    context.waitUntil(Promise.allSettled(tasks));

    redirectTo.searchParams.set('eid', eventId);
    return Response.redirect(redirectTo.toString(), 303);
}
