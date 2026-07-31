/* WECONN3CT — System-Grafik: GSAP-Choreografie
   Erzählt die Geschichte in Reihenfolge (Phasen 1-5), danach dauerhaft
   ruhiges "Leben" (Energie-Streifen, atmende Karten, +1-Pings).
   Kein Scroll-Scrubbing. Ohne JS bleibt das Diagramm statisch sichtbar. */
(function () {
    'use strict';

    if (!window.gsap || !document.querySelector('.flow-svg')) return;
    gsap.registerPlugin(ScrollTrigger);

    var mm = gsap.matchMedia();
    mm.add({
        reduce: '(prefers-reduced-motion: reduce)',
        ok: '(prefers-reduced-motion: no-preference)'
    }, function (ctx) {
        if (ctx.conditions.reduce) return; // statisch lassen

        /* Anfangszustände (erst hier verstecken → No-JS bleibt sichtbar) */
        gsap.set('.f-node', { transformOrigin: '50% 50%' });
        gsap.set('.fa-p1a, .fa-p1b, .fa-p2, .fa-social, .fa-pill, .fa-result, .fa-auto1, .fa-auto2, .fa-auto3, .fa-bar', { autoAlpha: 0, y: 20, scale: 0.92 });
        gsap.set('.fa-web', { autoAlpha: 0, scale: 0.7 });
        gsap.set('.f-sk', { autoAlpha: 0, y: 8 });
        gsap.set('.f-capg, .f-minicap', { autoAlpha: 0, y: 8 });
        gsap.set('.f-blob', { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
        gsap.set('.f-link', { strokeDashoffset: 1 });
        /* Ketten-Links zusätzlich ausblenden — ihre Pfeilspitzen (Marker)
           wären sonst trotz verstecktem Strich sichtbar */
        gsap.set('.f-chain, .f-link-dash', { autoAlpha: 0 });

        var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

        /* Phase 1 — Zuerst die Marke: Farben & Logo, daraus Visitenkarten & Flyer */
        tl.to('.f-blob', { autoAlpha: 0.09, scale: 1, duration: 1.1, ease: 'power2.out' }, 0)
          .to('.fa-cap1', { autoAlpha: 1, y: 0, duration: 0.45 }, 0.1)
          .to('.fa-p1a', { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 0.25)
          .to('.fl-p1chain', { autoAlpha: 1, strokeDashoffset: 0, duration: 0.35, ease: 'power2.inOut' }, 0.7)
          .to('.fa-p1b', { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.6)' }, 0.85)

        /* … und aus der Marke entsteht die Webseite (Grundgerüst + Texte) */
          .to('.fl-p1web', { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 0.95)
          .to('.fa-web', { autoAlpha: 1, scale: 1, duration: 0.75, ease: 'back.out(1.5)' }, 1.25)
          .to('.f-sk1', { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1 }, 1.7)

        /* Phase 2 — Echte Bilder & Videos füllen die Webseite, auch für Social Media */
          .to('.fa-cap2', { autoAlpha: 1, y: 0, duration: 0.45 }, 1.9)
          .to('.fa-p2', { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 2.05)
          .to('.fl-p2web', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, 2.3)
          .to('.f-sk2', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }, 2.75)
          .to('.fl-social', { autoAlpha: 1, strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, 2.75)
          .to('.fa-social', { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }, 2.95)

        /* Phase 3 — Gefunden werden: von selbst & mit Werbung, der Button erscheint */
          .to('.fa-cap3', { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06 }, 3.2)
          .to('.fa-pill', { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(2)', stagger: 0.09 }, 3.35)
          .to('.fl-reach', { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut', stagger: 0.08 }, 3.55)
          .to('.f-sk3', { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }, 4.1)

        /* Phase 4 — Das Ergebnis: Anfragen oder Bewerbungen, je nach Ziel */
          .to('.fa-cap4', { autoAlpha: 1, y: 0, duration: 0.45 }, 4.25)
          .to('.fl-result', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut', stagger: 0.12 }, 4.35)
          .to('.fa-result', { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.8)', stagger: 0.16 }, 4.55)

        /* Phase 5 — Der Arbeitsalltag: Automatisierung → KI-Agenten → eigene Software */
          .to('.fa-cap5', { autoAlpha: 1, y: 0, duration: 0.45 }, 4.95)
          .to('.fl-webauto', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, 5.05)
          .to('.fa-auto1', { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }, 5.3)
          .to('.fl-chain1', { autoAlpha: 1, strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut' }, 5.6)
          .to('.fa-auto2', { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }, 5.75)
          .to('.fl-chain2', { autoAlpha: 1, strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut' }, 6.05)
          .to('.fa-auto3', { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }, 6.2)

        /* Finale — die Klammer: ein Ansprechpartner */
          .to('.fa-bar', { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, 6.6)
          .add(startAmbient, 6.9);

        ScrollTrigger.create({
            trigger: '.flow-wrap',
            start: 'top 72%',
            once: true,
            onEnter: function () { tl.play(); }
        });

        /* Dauerhaftes, ruhiges Leben nach der Intro */
        function startAmbient() {
            gsap.to('.f-pulse', { opacity: 1, duration: 0.6 });
            document.querySelectorAll('.f-pulse').forEach(function (p, i) {
                gsap.fromTo(p, { strokeDashoffset: 1 }, {
                    strokeDashoffset: -1,
                    duration: 2.8 + (i % 5) * 0.5,
                    ease: 'none', repeat: -1,
                    delay: (i * 0.45) % 2
                });
            });
            document.querySelectorAll('.f-float').forEach(function (n, i) {
                gsap.to(n, {
                    y: (i % 2 ? 5 : -5),
                    duration: 2.6 + (i % 4) * 0.55,
                    ease: 'sine.inOut', yoyo: true, repeat: -1
                });
            });
            gsap.to('.f-blob', { rotation: 7, scale: 1.05, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1 });
            ping('.f-ping-l', 4.2, 1);
            ping('.f-ping-b', 6.8, 3.6);
        }

        function ping(sel, every, delay) {
            var el = document.querySelector(sel);
            if (!el) return;
            gsap.set(el, { transformOrigin: '50% 100%' });
            gsap.timeline({ repeat: -1, repeatDelay: every, delay: delay })
                .fromTo(el, { autoAlpha: 0, y: 10, scale: 0.8 }, { autoAlpha: 1, y: -4, scale: 1, duration: 0.45, ease: 'back.out(2)' })
                .to(el, { autoAlpha: 0, y: -18, duration: 0.7, ease: 'power1.in' }, '+=1.2');
        }
    });
})();
