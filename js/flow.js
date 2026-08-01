/* WECONN3CT — System-Story: eine Bühne, 5 Kapitel, Endlos-Schleife (GSAP)
   Drei Druckfarben → Design → Branding (Visitenkarte/Flyer) → das Branding
   formt die Webseite → Fotos → SEO-Aufstieg auf Platz 1 → Besucher & Anfrage.
   Spielt automatisch, pausiert außerhalb des Sichtfelds, Punkte springen zu Kapiteln. */
(function () {
    'use strict';

    if (!window.gsap || !document.getElementById('stage')) return;
    gsap.registerPlugin(ScrollTrigger);

    var stage = document.getElementById('stage');
    var scaleBox = document.getElementById('stage-scale');

    function fit() {
        var vw = scaleBox.clientWidth;
        /* Mobil: näher an die Action zoomen (Basis 760 statt 900), Ränder werden sauber beschnitten */
        var base = vw < 640 ? 760 : 900;
        var s = Math.min(vw, 1124) / base;
        stage.style.transform = 'scale(' + s + ')';
        stage.style.marginLeft = ((vw - 900 * s) / 2) + 'px';
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
            gsap.set('#st-browser, #st-stars', { autoAlpha: 1 });
            gsap.set('#st-wipe', { scaleX: 1 });
            gsap.set('.st-nav .ndot', { autoAlpha: 1 });
            gsap.set('#cap2', { autoAlpha: 1 });
            dots[1].classList.add('on');
            return;
        }

        /* ---------- Anfangszustände ---------- */
        function setInitial() {
            gsap.set('#st-serp, #st-counter, #st-notif, #st-stars, #st-browser', { autoAlpha: 0 });
            gsap.set('.st-photo, #st-vid', { autoAlpha: 0 });
            gsap.set('#st-mark, #st-pop, .st-b, #st-scan, .seo-chip, #st-score, #st-cursor, .st-person', { autoAlpha: 0 });
            gsap.set('.st-nav .ndot', { autoAlpha: 0 });
            gsap.set('#st-wipe', { scaleX: 0 });
            gsap.set('#st-p1', { scale: 0, transformOrigin: '50% 50%' });
            gsap.set('#st-own', { top: 174 });
            gsap.set('#st-r1', { top: 0 }); gsap.set('#st-r2', { top: 58 }); gsap.set('#st-r3', { top: 116 });
            gsap.set('.cap', { autoAlpha: 0, y: 8 });
            gsap.set('#st-q', { textContent: '' });
            document.getElementById('st-cnt').textContent = '0';
        }
        setInitial();

        var tl = gsap.timeline({ paused: true, repeat: -1 });
        tl.timeScale(0.9);
        var POP = 'back.out(1.45)', SOFT = 'power2.out', OUT = 'power3.out',
            MOVE = 'power3.inOut', IN = 'power2.in', IDLE = 'sine.inOut';

        function cap(i, t) {
            CAPS.forEach(function (c, k) {
                if (k === i) tl.to(c, { autoAlpha: 1, y: 0, duration: 0.5, ease: SOFT }, t + 0.15);
                else tl.to(c, { autoAlpha: 0, duration: 0.3, ease: IN }, t);
            });
        }

        /* ========== Kapitel 1: Drei Farben → Design → Branding (0 – 9) ========== */
        tl.call(setDot(0), null, 0);
        cap(0, 0.1);
        tl.from('#st-sw1', { x: -160, y: 60, scale: 0, autoAlpha: 0, duration: 0.6, ease: POP }, 0.55);
        tl.from('#st-sw2', { y: -140, scale: 0, autoAlpha: 0, duration: 0.6, ease: POP }, 0.72);
        tl.from('#st-sw3', { x: 160, y: 60, scale: 0, autoAlpha: 0, duration: 0.6, ease: POP }, 0.89);
        /* Farbtanz: die Punkte kreisen umeinander und spiralen ins Zentrum */
        (function () {
            var o = { a: 0, r: 95 };
            var C = { x: 450, y: 195 };
            var PH = [-Math.PI / 2, Math.PI * 5 / 6, Math.PI / 6];
            var base = [[421, 71], [339, 214], [503, 214]];
            var els = ['#st-sw1', '#st-sw2', '#st-sw3'];
            tl.to(o, { a: Math.PI * 3, duration: 1.7, ease: 'power1.in', onUpdate: function () {
                for (var k = 0; k < 3; k++) {
                    var cx = C.x + o.r * Math.cos(PH[k] + o.a);
                    var cy = C.y + o.r * Math.sin(PH[k] + o.a);
                    gsap.set(els[k], { x: cx - 29 - base[k][0], y: cy - 29 - base[k][1] });
                }
            } }, 1.55);
            tl.to(o, { r: 6, duration: 1.7, ease: 'power2.in' }, 1.55);
        })();
        tl.to('.st-sw', { scale: 0.5, duration: 0.9, ease: IN }, 2.35);
        tl.set('.st-sw', { autoAlpha: 0 }, 3.25);
        tl.fromTo('#st-pop', { autoAlpha: 1, scale: 0.3 }, { scale: 3.2, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 3.25);
        /* Funken sprühen */
        tl.fromTo('#st-b1', { autoAlpha: 1, x: 0, y: 0 }, { x: -90, y: -70, autoAlpha: 0, duration: 0.6, ease: SOFT, immediateRender: false }, 3.27);
        tl.fromTo('#st-b2', { autoAlpha: 1, x: 0, y: 0 }, { x: 95, y: -55, autoAlpha: 0, duration: 0.6, ease: SOFT, immediateRender: false }, 3.27);
        tl.fromTo('#st-b3', { autoAlpha: 1, x: 0, y: 0 }, { x: -70, y: 80, autoAlpha: 0, duration: 0.6, ease: SOFT, immediateRender: false }, 3.27);
        tl.fromTo('#st-b4', { autoAlpha: 1, x: 0, y: 0 }, { x: 85, y: 70, autoAlpha: 0, duration: 0.6, ease: SOFT, immediateRender: false }, 3.27);
        tl.fromTo('#st-b5', { autoAlpha: 1, x: 0, y: 0 }, { x: -20, y: -100, autoAlpha: 0, duration: 0.6, ease: SOFT, immediateRender: false }, 3.27);
        tl.fromTo('#st-b6', { autoAlpha: 1, x: 0, y: 0 }, { x: 25, y: 100, autoAlpha: 0, duration: 0.6, ease: SOFT, immediateRender: false }, 3.27);
        /* Das Design-Board entsteht */
        tl.from('#st-design', { scale: 0, rotation: -10, autoAlpha: 0, duration: 0.85, ease: 'elastic.out(1, 0.7)' }, 3.45);
        /* Daraus: Visitenkarte und Flyer */
        tl.from('#st-vk', { x: 220, y: -20, scale: 0.4, rotation: 8, autoAlpha: 0, duration: 0.7, ease: POP }, 4.5);
        tl.from('#st-fly', { x: -200, y: -10, scale: 0.4, rotation: -8, autoAlpha: 0, duration: 0.7, ease: POP }, 4.8);
        tl.to('#st-design', { y: -7, duration: 1.2, ease: IDLE, yoyo: true, repeat: 1 }, 5.9);
        tl.to('#st-vk', { y: 6, duration: 1.3, ease: IDLE, yoyo: true, repeat: 1 }, 6.0);
        tl.to('#st-fly', { y: -6, duration: 1.3, ease: IDLE, yoyo: true, repeat: 1 }, 6.1);
        /* Leben in der Haltephase: die Farbchips des Boards schimmern nacheinander */
        tl.to('#st-design .d-chips i', { scale: 1.18, duration: 0.3, ease: IDLE, yoyo: true, repeat: 1, stagger: 0.14, transformOrigin: '50% 50%' }, 7.0);

        /* ========== Kapitel 2: Branding verschmilzt zur Webseite (9 – 17) ========== */
        tl.call(setDot(1), null, 9);
        cap(1, 9);
        /* Visitenkarte, Flyer und Design fliegen zusammen und stapeln sich */
        tl.to('#st-vk', { x: 240, y: -10, rotation: 0, scale: 0.5, duration: 0.65, ease: MOVE }, 9.65);
        tl.to('#st-fly', { x: -204, y: 17, rotation: 0, scale: 0.5, duration: 0.65, ease: MOVE }, 9.73);
        tl.to('#st-design', { x: -5, y: 19, scale: 0.75, duration: 0.65, ease: MOVE }, 9.81);
        /* Verschmelzen: Stapel zieht sich zusammen, Lichtblitz */
        tl.to('#st-vk, #st-fly, #st-design', { scale: 0.28, autoAlpha: 0, duration: 0.4, ease: IN }, 10.4);
        tl.fromTo('#st-pop', { x: 25, y: 60, autoAlpha: 1, scale: 0.4 },
            { scale: 4.2, autoAlpha: 0, duration: 0.6, ease: SOFT, immediateRender: false }, 10.7);
        tl.fromTo('#st-b1', { x: 25, y: 60, autoAlpha: 1 }, { x: -75, y: -10, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 10.75);
        tl.fromTo('#st-b2', { x: 25, y: 60, autoAlpha: 1 }, { x: 125, y: 10, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 10.75);
        tl.fromTo('#st-b3', { x: 25, y: 60, autoAlpha: 1 }, { x: 25, y: -80, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 10.75);
        /* Aus der Verschmelzung wächst die Webseite — organisch, federnd */
        tl.to('#st-browser', { autoAlpha: 1, duration: 0.01 }, 10.8);
        tl.from('#st-browser', { scale: 0.22, transformOrigin: '50% 50%', duration: 1.0, ease: 'elastic.out(1, 0.72)' }, 10.8);
        tl.from('#st-browser .st-bar', { y: -20, autoAlpha: 0, duration: 0.4, ease: SOFT }, 11.6);
        tl.from('#st-browser .st-nav', { y: 14, autoAlpha: 0, duration: 0.4, ease: SOFT }, 11.75);
        /* Das Logo rastet ein, der Marken-Verlauf wischt über die Seite */
        tl.to('.st-nav .ndot', { autoAlpha: 1, duration: 0.01 }, 12.1);
        tl.from('.st-nav .ndot', { scale: 0, rotation: -90, duration: 0.5, ease: 'back.out(2.1)' }, 12.1);
        tl.fromTo('#st-b4', { x: -251, y: -88, autoAlpha: 0.9, scale: 0.7 }, { x: -273, y: -114, autoAlpha: 0, duration: 0.5, ease: SOFT, immediateRender: false }, 12.2);
        tl.fromTo('#st-b5', { x: -251, y: -88, autoAlpha: 0.9, scale: 0.7 }, { x: -224, y: -112, autoAlpha: 0, duration: 0.5, ease: SOFT, immediateRender: false }, 12.23);
        tl.from('#st-browser .st-line', { x: -22, autoAlpha: 0, duration: 0.4, ease: SOFT, stagger: 0.12 }, 12.65);
        tl.from('#st-btn', { scale: 0.6, autoAlpha: 0, duration: 0.55, ease: 'back.out(1.9)' }, 13.1);
        tl.to('#st-browser', { y: -6, duration: 1.4, ease: IDLE, yoyo: true, repeat: 1 }, 14.4);
        tl.to('#st-hero .ph-ic', { scale: 1.15, duration: 0.35, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 15.5);
        tl.to('#st-btn', { scale: 1.04, duration: 0.4, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 16.0);

        /* ========== Kapitel 3: Fotos & Videos füllen die Seite (17 – 24) ========== */
        tl.call(setDot(2), null, 17);
        cap(2, 17);
        /* Blitz — das erste Foto entsteht und fliegt IN den Hero */
        tl.fromTo('#st-flash', { opacity: 0 }, { opacity: 0.7, duration: 0.08, ease: IN }, 17.5);
        tl.to('#st-flash', { opacity: 0, duration: 0.35, ease: SOFT }, 17.58);
        tl.to('#st-ph1', { autoAlpha: 1, duration: 0.01 }, 17.65);
        tl.from('#st-ph1', { x: -180, y: -40, rotation: -18, duration: 0.6, ease: POP }, 17.66);
        tl.to('#st-ph1', { x: 245, y: 55, rotation: 0, scale: 1.3, duration: 0.7, ease: MOVE }, 18.5);
        /* Beim Aufprall füllt sich der Hero mit Farbe, das Foto geht in der Seite auf */
        tl.to('#st-wipe', { scaleX: 1, duration: 0.45, ease: SOFT }, 19.1);
        tl.to('#st-ph1', { autoAlpha: 0, scale: 0.9, duration: 0.3, ease: IN }, 19.15);
        tl.to('#st-hero', { scale: 1.05, duration: 0.3, ease: IDLE, yoyo: true, repeat: 1 }, 19.2);
        /* Blitz — das Video dockt unten rechts an der Seite an */
        tl.fromTo('#st-flash', { opacity: 0 }, { opacity: 0.55, duration: 0.08, ease: IN }, 19.7);
        tl.to('#st-flash', { opacity: 0, duration: 0.35, ease: SOFT }, 19.78);
        tl.to('#st-vid', { autoAlpha: 1, duration: 0.01 }, 19.85);
        tl.from('#st-vid', { x: 160, y: -60, rotation: 14, duration: 0.6, ease: POP }, 19.86);
        tl.to('#st-vid', { x: -272, y: 12, rotation: 0, duration: 0.65, ease: MOVE }, 20.66);
        tl.to('#st-vid .play', { scale: 1.18, duration: 0.4, ease: IDLE, yoyo: true, repeat: 3, transformOrigin: '50% 50%' }, 21.3);
        /* Zweites Foto dockt links an */
        tl.to('#st-ph2', { autoAlpha: 1, duration: 0.01 }, 20.9);
        tl.from('#st-ph2', { x: -160, y: 60, rotation: -14, duration: 0.6, ease: POP }, 20.91);
        tl.to('#st-ph2', { x: -115, y: 56, rotation: 0, duration: 0.65, ease: MOVE }, 21.55);
        /* Die Seite ist jetzt schön: Sterne + Glanz */
        tl.to('#st-stars', { autoAlpha: 1, duration: 0.01 }, 22.3);
        tl.from('#st-stars', { scale: 0, rotation: -8, duration: 0.55, ease: 'back.out(2)' }, 22.31);
        tl.to('#st-browser', { scale: 1.02, duration: 0.4, ease: IDLE, yoyo: true, repeat: 1 }, 22.4);

        /* ========== Kapitel 4: SEO-Optimierung, dann Aufstieg auf Platz 1 (24 – 36.5) ========== */
        tl.call(setDot(3), null, 24);
        cap(3, 24);
        /* SEO-Scan fährt über die fertige Seite */
        tl.fromTo('#st-scan', { x: -60, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, immediateRender: false }, 24.55);
        tl.to('#st-scan', { x: 575, duration: 2.2, ease: 'power1.inOut' }, 24.6);
        tl.to('#st-scan', { autoAlpha: 0, duration: 0.3 }, 26.65);
        /* Prüf-Chips erscheinen genau dort, wo der Scan-Strahl sie "findet" — mit Ring-Puls */
        tl.to('#sc1', { autoAlpha: 1, duration: 0.01 }, 25.05);
        tl.from('#sc1', { scale: 0.55, y: -12, rotation: -5, duration: 0.6, ease: 'back.out(1.8)', transformOrigin: '50% 100%' }, 25.06);
        tl.fromTo('#st-rip1', { x: 216, y: 102, autoAlpha: 0.7, scale: 0.4 }, { scale: 2.2, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 25.07);
        tl.to('#sc3', { autoAlpha: 1, duration: 0.01 }, 26.35);
        tl.from('#sc3', { scale: 0.55, y: -12, rotation: 5, duration: 0.6, ease: 'back.out(1.8)', transformOrigin: '50% 100%' }, 26.36);
        tl.fromTo('#st-rip2', { x: 568, y: 118, autoAlpha: 0.7, scale: 0.4 }, { scale: 2.2, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 26.37);
        tl.to('#sc2', { autoAlpha: 1, duration: 0.01 }, 25.3);
        tl.from('#sc2', { scale: 0.55, y: -12, rotation: -5, duration: 0.6, ease: 'back.out(1.8)', transformOrigin: '50% 100%' }, 25.31);
        tl.fromTo('#st-rip3', { x: 216, y: 282, autoAlpha: 0.7, scale: 0.4 }, { scale: 2.2, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 25.33);
        /* Chips atmen leicht, während der Score klettert */
        tl.to('#sc1', { y: -3, duration: 1.1, ease: IDLE, yoyo: true, repeat: 1 }, 25.9);
        tl.to('#sc3', { y: 3, duration: 1.1, ease: IDLE, yoyo: true, repeat: 1 }, 27.1);
        /* SEO-Score zählt auf 100 */
        tl.to('#st-score', { autoAlpha: 1, duration: 0.01 }, 25.45);
        tl.from('#st-score', { scale: 0.5, y: 14, duration: 0.5, ease: 'back.out(2)' }, 25.46);
        (function () {
            var sc = { n: 0 };
            tl.to(sc, { n: 100, duration: 1.7, ease: 'power1.inOut', onUpdate: function () {
                document.getElementById('st-seo').textContent = Math.round(sc.n);
            } }, 25.65);
        })();
        tl.to('#st-score', { scale: 1.08, duration: 0.3, ease: IDLE, yoyo: true, repeat: 1 }, 27.45);
        tl.to('#st-browser', { scale: 1.015, duration: 0.35, ease: IDLE, yoyo: true, repeat: 1 }, 27.62);
        /* Optimiert — jetzt zur Suche */
        tl.to('.seo-chip, #st-score, .st-photo, #st-vid, #st-stars', { autoAlpha: 0, duration: 0.4, ease: IN }, 28.2);
        tl.to('#st-browser', { scale: 0.72, x: -250, y: 40, autoAlpha: 0.35, duration: 0.7, ease: MOVE }, 28.4);
        tl.to('#st-serp', { autoAlpha: 1, duration: 0.01 }, 29.0);
        tl.from('#st-serp', { y: 60, scale: 0.9, duration: 0.6, ease: POP }, 29.0);
        (function () {
            var q = { n: 0 }, txt = 'handwerker in bonn';
            tl.to(q, { n: txt.length, duration: 0.9, ease: 'none', onUpdate: function () {
                document.getElementById('st-q').textContent = txt.slice(0, Math.round(q.n));
            } }, 29.7);
        })();
        tl.to('#st-caret', { opacity: 0, duration: 0.3, ease: 'steps(1)', yoyo: true, repeat: 5 }, 29.5);
        tl.set('#st-caret', { opacity: 0 }, 31.3);
        tl.from('.st-row', { y: 26, autoAlpha: 0, duration: 0.45, ease: SOFT, stagger: 0.12 }, 30.9);
        /* Der Aufstieg: Platz 4 → 3 → 2 → 1 */
        tl.to('#st-own', { top: 116, duration: 0.55, ease: POP }, 32.2);
        tl.to('#st-r3', { top: 174, duration: 0.55, ease: MOVE }, 32.2);
        tl.to('#st-own', { top: 58, duration: 0.55, ease: POP }, 33.1);
        tl.to('#st-r2', { top: 116, duration: 0.55, ease: MOVE }, 33.1);
        tl.to('#st-own', { top: 0, duration: 0.6, ease: 'back.out(2)' }, 34.0);
        tl.to('#st-r1', { top: 58, duration: 0.6, ease: MOVE }, 34.0);
        tl.to('#st-p1', { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 34.7);
        tl.to('#st-own', { scale: 1.04, duration: 0.35, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 34.9);
        /* Der Mauszeiger kommt und klickt auf Platz 1 */
        tl.to('#st-cursor', { autoAlpha: 1, duration: 0.01 }, 35.15);
        tl.fromTo('#st-cursor', { x: 700, y: 430 }, { x: 455, y: 150, duration: 0.85, ease: MOVE, immediateRender: false }, 35.15);
        tl.to('#st-cursor', { scale: 0.82, duration: 0.09, ease: IN, transformOrigin: '20% 15%' }, 36.1);
        tl.to('#st-cursor', { scale: 1, duration: 0.28, ease: 'back.out(2.1)' }, 36.2);
        tl.fromTo('#st-rip1', { x: 447, y: 140, autoAlpha: 0.8, scale: 0.4 }, { scale: 2.6, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 36.15);
        tl.to('#st-own', { scale: 0.975, duration: 0.1, ease: IN, transformOrigin: '50% 50%' }, 36.15);
        tl.to('#st-own', { scale: 1, duration: 0.3, ease: 'back.out(2.1)' }, 36.25);

        /* ========== Kapitel 5: Besucher zählen hoch, Anfrage kommt (36.5 – 45) ========== */
        tl.call(setDot(4), null, 36.5);
        cap(4, 36.5);
        tl.to('#st-serp', { y: -60, autoAlpha: 0, duration: 0.55, ease: IN }, 36.8);
        tl.to('#st-cursor', { autoAlpha: 0, y: 190, duration: 0.4, ease: IN }, 36.8);
        tl.to('#st-browser', { scale: 1, x: 0, y: 0, autoAlpha: 1, duration: 0.7, ease: MOVE }, 37.1);
        /* Lead-Karte dockt rechts an */
        tl.to('#st-counter', { autoAlpha: 1, duration: 0.01 }, 37.6);
        tl.from('#st-counter', { x: 60, scale: 0.85, duration: 0.55, ease: POP, immediateRender: false }, 37.6);
        /* Besucher erscheinen links untereinander */
        ['#pp1', '#pp2', '#pp3'].forEach(function (p, k) {
            tl.to(p, { autoAlpha: 1, duration: 0.01 }, 37.8 + k * 0.15);
            tl.from(p, { scale: 0, y: 16, duration: 0.5, ease: 'back.out(1.9)', immediateRender: false }, 37.81 + k * 0.15);
        });
        /* Jeder Besucher: klickt den Button (→ Neue Anfrage), wandert nach rechts, wird zum Lead */
        function setLead(n) {
            return function () { document.getElementById('st-cnt').textContent = '+' + n; };
        }
        (function () {
            var runs = [
                { p: '#pp1', rip: '#st-rip1', t: 38.4, dyBtn: 194, dyLead: 49 },
                { p: '#pp2', rip: '#st-rip2', t: 40.25, dyBtn: 116, dyLead: -29 },
                { p: '#pp3', rip: '#st-rip3', t: 42.1, dyBtn: 38, dyLead: -107 }
            ];
            runs.forEach(function (r, k) {
                /* Zum Button (leicht vorgelehnt, weich abbremsend) */
                tl.to(r.p, { x: 195, y: r.dyBtn, scale: 0.8, rotation: 5, duration: 0.8, ease: MOVE }, r.t);
                tl.to(r.p, { rotation: 0, duration: 0.25, ease: SOFT }, r.t + 0.72);
                /* Klick: Button drückt, Ring pulst, die Anfrage-Push erscheint */
                tl.to('#st-btn', { scale: 0.94, duration: 0.09, ease: IN, transformOrigin: '50% 50%' }, r.t + 1.0);
                tl.to('#st-btn', { scale: 1, duration: 0.28, ease: 'back.out(2.1)' }, r.t + 1.1);
                tl.fromTo(r.rip, { x: 250, y: 332, autoAlpha: 0.85, scale: 0.4 },
                    { scale: 2.4, autoAlpha: 0, duration: 0.5, ease: SOFT, immediateRender: false }, r.t + 1.02);
                tl.fromTo('#st-notif', { y: -80, autoAlpha: 0 },
                    { y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.6)', immediateRender: false }, r.t + 1.15);
                /* Weiter nach rechts — als Lead ankommen */
                tl.to(r.p, { x: 739, y: r.dyLead, scale: 0.5, rotation: -4, duration: 0.8, ease: MOVE }, r.t + 1.35);
                tl.to(r.p, { autoAlpha: 0, rotation: 0, duration: 0.25, ease: IN }, r.t + 2.05);
                tl.call(setLead(k + 1), null, r.t + 2.15);
                tl.to('#st-counter', { scale: 1.08, duration: 0.25, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, r.t + 2.15);
                /* Push zieht sich zurück — außer beim letzten Lead */
                if (k < 2) {
                    tl.to('#st-notif', { y: -70, autoAlpha: 0, duration: 0.4, ease: IN }, r.t + 2.5);
                }
            });
        })();
        tl.to('#st-notif', { scale: 1.03, duration: 0.35, ease: IDLE, yoyo: true, repeat: 1 }, 44.75);

        /* ========== Ausklang & Reset (45.2 – 46.6) ========== */
        tl.to('#stage', { autoAlpha: 0, duration: 0.55, ease: IN }, 45.6);
        tl.call(function () {
            gsap.set('#stage *', { clearProps: 'all' });
            setInitial();
        }, null, 46.25);
        tl.to('#stage', { autoAlpha: 1, duration: 0.4, ease: SOFT }, 46.4);
        tl.set({}, {}, 47.0);

        var CHAPTER_TIMES = [0, 9, 17, 24, 36.5];
        dots.forEach(function (d) {
            d.addEventListener('click', function () {
                var i = parseInt(d.getAttribute('data-ch'), 10);
                gsap.set('#stage *', { clearProps: 'all' });
                setInitial();
                tl.play(CHAPTER_TIMES[i] + 0.01);
            });
        });

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
