/**
 * Cloudflare Pages Function: POST /api/lead
 *
 * 1. Nimmt das Landingpage-Formular entgegen (Spam-Schutz via Honeypot)
 * 2. Benachrichtigung per Telegram (optional: TG_BOT_TOKEN + TG_CHAT_ID)
 * 3. Meta Conversions API "Lead"-Event — nur bei Consent
 *    (META_PIXEL_ID + META_ACCESS_TOKEN als Env-Vars in Cloudflare)
 * 4. Redirect auf /danke?eid=<event_id> — die Dankeseite feuert das
 *    Browser-Pixel-Event mit derselben eventID → Meta dedupliziert.
 *
 * Env-Vars (Cloudflare Pages → Settings → Environment variables):
 *   META_PIXEL_ID      – Pixel-ID aus dem Meta Events Manager
 *   META_ACCESS_TOKEN  – CAPI Access Token (Events Manager → Einstellungen → Conversions API)
 *   TG_BOT_TOKEN       – (optional) Telegram-Bot-Token für Lead-Benachrichtigung
 *   TG_CHAT_ID         – (optional) Telegram-Chat-ID
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
        ].filter(Boolean).join('\n');

        tasks.push(fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: env.TG_CHAT_ID, text }),
        }).catch(() => {}));
    }

    // --- 2. Meta Conversions API (nur mit Consent) ---
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
