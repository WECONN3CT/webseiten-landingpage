/* WECONN3CT — System-Story: eine Bühne, 5 Kapitel, Endlos-Schleife (GSAP)
   Marke → Webseite → Fotos → SEO-Aufstieg auf Platz 1 → Besucher & Anfrage
   Spielt automatisch, pausiert außerhalb des Sichtfelds, Punkte springen zu Kapiteln.
   Bei prefers-reduced-motion: statisches Standbild. */
(function () {
    'use strict';

    if (!window.gsap || !document.getElementById('stage')) return;
    gsap.registerPlugin(ScrollTrigger);

    var stage = document.getElementById('stage');
    var scaleBox = document.getElementById('stage-scale');

    /* Bühne responsiv skalieren (Basis 900x470) */
    function fit() {
        var w = Math.min(scaleBox.clientWidth, 900);
        var s = w / 900;
        stage.style.transform = 'scale(' + s + ')';
        scaleBox.style.height = (470 * s) + 'px';
    }
    fit();
    window.addEventListener('resize', fit, { passive: true });

    var dots = Array.prototype.slice.call(document.querySelectorAll('.sdot'));
    function setDot(i) {
        return function () {
            dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
        };
    }

    var CAPS = ['#cap1', '#cap2', '#cap3', '#cap4', '#cap5'];
    var mm = gsap.matchMedia();

    mm.add({
        reduce: '(prefers-reduced-motion: reduce)',
        ok: '(prefers-reduced-motion: no-preference)'
    }, function (ctx) {
        if (ctx.conditions.reduce) {
            /* Statisches Standbild: fertige Webseite + Bildunterschrift */
            gsap.set('#st-browser, #st-stars', { autoAlpha: 1 });
            gsap.set('#cap2', { autoAlpha: 1 });
            dots[1].classList.add('on');
            return;
        }

        /* ---------- Anfangszustände ---------- */
        function setInitial() {
            gsap.set('#st-serp, #st-counter, #st-notif, #st-stars, #st-browser', { autoAlpha: 0 });
            gsap.set('.st-photo', { autoAlpha: 0 });
            gsap.set('#st-p1', { scale: 0, transformOrigin: '50% 50%' });
            gsap.set('#st-own', { top: 174 });
            gsap.set('#st-r1', { top: 0 }); gsap.set('#st-r2', { top: 58 }); gsap.set('#st-r3', { top: 116 });
            gsap.set('.cap', { autoAlpha: 0, y: 8 });
            gsap.set('#st-q', { textContent: '' });
            document.getElementById('st-cnt').textContent = '0';
        }
        setInitial();

        var tl = gsap.timeline({ paused: true, repeat: -1 });
        var POP = 'back.out(1.7)', SOFT = 'power2.out', OUT = 'power3.out',
            MOVE = 'power3.inOut', IN = 'power2.in', IDLE = 'sine.inOut';

        function cap(i, t) {
            CAPS.forEach(function (c, k) {
                if (k === i) tl.to(c, { autoAlpha: 1, y: 0, duration: 0.5, ease: SOFT }, t + 0.15);
                else tl.to(c, { autoAlpha: 0, duration: 0.3, ease: IN }, t);
            });
        }

        /* ========== Kapitel 1: Marke (0 – 6.5) ========== */
        tl.call(setDot(0), null, 0);
        cap(0, 0.1);
        tl.from('.st-sw', { scale: 0, autoAlpha: 0, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.14 }, 0.4);
        tl.to('.st-sw', { scale: 1.15, duration: 0.3, ease: IDLE, yoyo: true, repeat: 1, stagger: 0.1 }, 1.2);
        tl.to('#st-sw1', { x: 110, y: -25, scale: 0.3, autoAlpha: 0, duration: 0.5, ease: IN }, 2.0);
        tl.to('#st-sw2', { x: 27, y: -25, scale: 0.3, autoAlpha: 0, duration: 0.5, ease: IN }, 2.08);
        tl.to('#st-sw3', { x: -56, y: -25, scale: 0.3, autoAlpha: 0, duration: 0.5, ease: IN }, 2.16);
        tl.from('#st-logo', { scale: 0, rotation: -16, autoAlpha: 0, duration: 0.8, ease: 'elastic.out(1, 0.55)' }, 2.5);
        tl.from('#st-vk', { x: 140, y: 30, scale: 0.5, rotation: 8, autoAlpha: 0, duration: 0.65, ease: POP }, 3.3);
        tl.from('#st-fly', { x: -140, y: 30, scale: 0.5, rotation: -8, autoAlpha: 0, duration: 0.65, ease: POP }, 3.55);
        tl.to('#st-logo', { y: -7, duration: 1.2, ease: IDLE, yoyo: true, repeat: 1 }, 4.3);

        /* ========== Kapitel 2: Webseite entsteht (6.5 – 13) ========== */
        tl.call(setDot(1), null, 6.5);
        cap(1, 6.5);
        tl.to('#st-vk', { x: 150, y: -40, scale: 0.2, autoAlpha: 0, duration: 0.6, ease: IN }, 7.0);
        tl.to('#st-fly', { x: -130, y: -30, scale: 0.2, autoAlpha: 0, duration: 0.6, ease: IN }, 7.12);
        tl.to('#st-logo', { y: 40, scale: 0.35, autoAlpha: 0, duration: 0.6, ease: IN }, 7.24);
        tl.to('#st-browser', { autoAlpha: 1, duration: 0.01 }, 7.7);
        tl.from('#st-browser', { scale: 0.6, y: 60, duration: 0.75, ease: POP }, 7.7);
        tl.from('#st-browser .st-bar', { y: -20, autoAlpha: 0, duration: 0.4, ease: SOFT }, 8.3);
        tl.from('#st-browser .st-nav', { y: 14, autoAlpha: 0, duration: 0.4, ease: SOFT }, 8.45);
        tl.from('#st-hero', { scaleX: 0.7, autoAlpha: 0, duration: 0.5, ease: OUT }, 8.6);
        tl.from('#st-browser .st-line', { x: -22, autoAlpha: 0, duration: 0.4, ease: SOFT, stagger: 0.12 }, 8.8);
        tl.from('#st-btn', { scale: 0.6, autoAlpha: 0, duration: 0.55, ease: 'back.out(2.2)' }, 9.15);
        tl.to('#st-browser', { y: -6, duration: 1.4, ease: IDLE, yoyo: true, repeat: 1 }, 10.2);

        /* ========== Kapitel 3: Fotos & Videos (13 – 20) ========== */
        tl.call(setDot(2), null, 13);
        cap(2, 13);
        tl.fromTo('#st-flash', { opacity: 0 }, { opacity: 0.7, duration: 0.08, ease: IN }, 13.6);
        tl.to('#st-flash', { opacity: 0, duration: 0.35, ease: SOFT }, 13.68);
        tl.from('#st-ph1', { x: -180, y: -60, rotation: -18, autoAlpha: 0, duration: 0.65, ease: POP }, 13.8);
        tl.fromTo('#st-flash', { opacity: 0 }, { opacity: 0.55, duration: 0.08, ease: IN }, 14.5);
        tl.to('#st-flash', { opacity: 0, duration: 0.35, ease: SOFT }, 14.58);
        tl.from('#st-ph2', { x: 180, y: 60, rotation: 16, autoAlpha: 0, duration: 0.65, ease: POP }, 14.7);
        tl.from('#st-stars', { scale: 0, autoAlpha: 0, rotation: -8, duration: 0.55, ease: 'back.out(2.4)' }, 15.6);
        tl.to('#st-hero', { scale: 1.04, duration: 0.4, ease: IDLE, yoyo: true, repeat: 1 }, 15.7);
        tl.to('#st-ph1', { y: '-=6', duration: 1.3, ease: IDLE, yoyo: true, repeat: 1 }, 16.5);
        tl.to('#st-ph2', { y: '+=6', duration: 1.3, ease: IDLE, yoyo: true, repeat: 1 }, 16.6);

        /* ========== Kapitel 4: SEO — Aufstieg auf Platz 1 (20 – 29.5) ========== */
        tl.call(setDot(3), null, 20);
        cap(3, 20);
        tl.to('#st-browser', { scale: 0.72, x: -250, y: 40, autoAlpha: 0.35, duration: 0.7, ease: MOVE }, 20.3);
        tl.to('.st-photo, #st-stars', { autoAlpha: 0, duration: 0.4, ease: IN }, 20.3);
        tl.to('#st-serp', { autoAlpha: 1, duration: 0.01 }, 20.9);
        tl.from('#st-serp', { y: 60, scale: 0.9, duration: 0.6, ease: POP }, 20.9);
        /* Suche tippt sich */
        (function () {
            var q = { n: 0 }, txt = 'handwerker in bonn';
            tl.to(q, { n: txt.length, duration: 0.9, ease: 'none', onUpdate: function () {
                document.getElementById('st-q').textContent = txt.slice(0, Math.round(q.n));
            } }, 21.6);
        })();
        tl.to('#st-caret', { opacity: 0, duration: 0.3, ease: 'steps(1)', yoyo: true, repeat: 5 }, 21.4);
        tl.set('#st-caret', { opacity: 0 }, 23.2);
        /* Ergebnisse erscheinen — die eigene Seite GANZ UNTEN */
        tl.from('.st-row', { y: 26, autoAlpha: 0, duration: 0.45, ease: SOFT, stagger: 0.12 }, 22.8);
        /* Der Aufstieg: Platz 4 → 3 → 2 → 1, mit Federung */
        tl.to('#st-own', { top: 116, duration: 0.55, ease: POP }, 24.1);
        tl.to('#st-r3', { top: 174, duration: 0.55, ease: MOVE }, 24.1);
        tl.to('#st-own', { top: 58, duration: 0.55, ease: POP }, 25.0);
        tl.to('#st-r2', { top: 116, duration: 0.55, ease: MOVE }, 25.0);
        tl.to('#st-own', { top: 0, duration: 0.6, ease: 'back.out(2)' }, 25.9);
        tl.to('#st-r1', { top: 58, duration: 0.6, ease: MOVE }, 25.9);
        tl.to('#st-p1', { scale: 1, duration: 0.5, ease: 'back.out(2.4)' }, 26.6);
        tl.to('#st-own', { scale: 1.04, duration: 0.35, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 26.8);

        /* ========== Kapitel 5: Besucher zählen hoch, Anfrage kommt (29.5 – 38) ========== */
        tl.call(setDot(4), null, 29.5);
        cap(4, 29.5);
        tl.to('#st-serp', { y: -60, autoAlpha: 0, duration: 0.55, ease: IN }, 29.8);
        tl.to('#st-browser', { scale: 1, x: 0, y: 0, autoAlpha: 1, duration: 0.7, ease: MOVE }, 30.1);
        tl.to('#st-counter', { autoAlpha: 1, duration: 0.01 }, 30.9);
        tl.from('#st-counter', { x: 60, scale: 0.85, duration: 0.55, ease: POP }, 30.9);
        /* Mehrere Klicks: Ripple-Wellen auf dem Button, Besucher zählen hoch */
        var rips = ['#st-rip1', '#st-rip2', '#st-rip3'];
        for (var r = 0; r < 6; r++) {
            var rip = rips[r % 3], t0 = 31.5 + r * 0.55;
            tl.fromTo(rip, { x: 290 + (r % 3) * 22, y: 330 + (r % 2) * 14, autoAlpha: 0.85, scale: 0.4 },
                { scale: 2.6, autoAlpha: 0, duration: 0.55, ease: SOFT }, t0);
        }
        tl.to('#st-btn', { scale: 0.94, duration: 0.09, ease: IN, transformOrigin: '50% 50%' }, 31.5);
        tl.to('#st-btn', { scale: 1, duration: 0.3, ease: 'back.out(2.6)' }, 31.6);
        tl.to('#st-btn', { scale: 0.94, duration: 0.09, ease: IN }, 32.6);
        tl.to('#st-btn', { scale: 1, duration: 0.3, ease: 'back.out(2.6)' }, 32.7);
        (function () {
            var v = { n: 0 };
            tl.to(v, { n: 47, duration: 3.0, ease: 'power1.inOut', onUpdate: function () {
                document.getElementById('st-cnt').textContent = '+' + Math.round(v.n);
            } }, 31.4);
        })();
        tl.to('#st-counter', { scale: 1.05, duration: 0.3, ease: IDLE, yoyo: true, repeat: 1 }, 34.2);
        /* Payoff: die Anfrage */
        tl.to('#st-notif', { autoAlpha: 1, duration: 0.01 }, 35.0);
        tl.from('#st-notif', { y: -90, scale: 0.9, duration: 0.6, ease: 'back.out(1.7)' }, 35.0);
        tl.to('#st-notif', { scale: 1.03, duration: 0.35, ease: IDLE, yoyo: true, repeat: 1 }, 35.9);

        /* ========== Ausklang & Reset für die Schleife (38 – 39.6) ========== */
        tl.to('#stage', { autoAlpha: 0, duration: 0.55, ease: IN }, 38.2);
        tl.call(function () {
            gsap.set('#stage *', { clearProps: 'all' });
            setInitial();
        }, null, 38.85);
        tl.to('#stage', { autoAlpha: 1, duration: 0.4, ease: SOFT }, 39.0);
        tl.set({}, {}, 39.6);

        /* Punkte klicken = Kapitel anspringen */
        var CHAPTER_TIMES = [0, 6.5, 13, 20, 29.5];
        dots.forEach(function (d) {
            d.addEventListener('click', function () {
                var i = parseInt(d.getAttribute('data-ch'), 10);
                gsap.set('#stage *', { clearProps: 'all' });
                setInitial();
                tl.play(CHAPTER_TIMES[i] + 0.01);
            });
        });

        /* Nur spielen, wenn sichtbar */
        ScrollTrigger.create({
            trigger: '.stage-wrap',
            start: 'top 85%',
            end: 'bottom top',
            onEnter: function () { tl.play(); },
            onLeave: function () { tl.pause(); },
            onEnterBack: function () { tl.play(); },
            onLeaveBack: function () { tl.pause(); }
        });

        return function () { tl.kill(); };
    });
})();
