/* WECONN3CT — System-Grafik: GSAP-Choreografie
   Einmalige Intro-Sequenz beim Reinscrollen + dauerhaft ruhiges "Leben"
   (Energie-Streifen, atmende Karten, +1-Pings). Kein Scroll-Scrubbing.
   Ohne JS bleibt das Diagramm komplett statisch sichtbar. */
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
        gsap.set('.fa-marke, .fa-social, .fa-pill, .fa-result, .fa-auto, .fa-bar', { autoAlpha: 0, y: 20, scale: 0.92 });
        gsap.set('.fa-web', { autoAlpha: 0, scale: 0.7 });
        gsap.set('.f-sk', { autoAlpha: 0, y: 8 });
        gsap.set('.f-cap', { autoAlpha: 0, y: 8 });
        gsap.set('.f-blob', { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
        gsap.set('.f-link', { strokeDashoffset: 1 });

        var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

        /* Akt 1: Blob blüht auf, die Webseite poppt ins Zentrum und baut sich */
        tl.to('.f-blob', { autoAlpha: 0.09, scale: 1, duration: 1.1, ease: 'power2.out' }, 0)
          .to('.fa-web', { autoAlpha: 1, scale: 1, duration: 0.75, ease: 'back.out(1.6)' }, 0.15)
          .to('.f-sk', { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.09 }, 0.6)
          .to('.f-cap', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.5)

        /* Akt 2: Marke & Content docken links an */
          .to('.fl-marke, .fl-social', { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.12 }, 0.85)
          .to('.fa-marke', { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.13 }, 0.95)
          .to('.fa-social', { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' }, 1.35)

        /* Akt 3: Reichweite feuert von oben */
          .to('.fl-reach', { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.1 }, 1.35)
          .to('.fa-pill', { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(2)', stagger: 0.1 }, 1.45)

        /* Akt 4: Ergebnisse poppen rechts raus */
          .to('.fl-result', { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut', stagger: 0.12 }, 1.85)
          .to('.fa-result', { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.8)', stagger: 0.16 }, 2)

        /* Akt 5: Automatisierung dockt unten an, die Klammer schließt */
          .to('.fl-auto', { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut', stagger: 0.1 }, 2.3)
          .to('.fa-auto', { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.12 }, 2.45)
          .to('.fa-bar', { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, 2.8)
          .add(startAmbient, 3.1);

        ScrollTrigger.create({
            trigger: '.flow-wrap',
            start: 'top 75%',
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
