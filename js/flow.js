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
            gsap.set('.st-photo', { autoAlpha: 0 });
            gsap.set('#st-mark, #st-pop, .st-b', { autoAlpha: 0 });
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
        var POP = 'back.out(1.7)', SOFT = 'power2.out', OUT = 'power3.out',
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
        tl.from('#st-sw1', { x: -160, y: 60, scale: 0, autoAlpha: 0, duration: 0.6, ease: POP }, 0.4);
        tl.from('#st-sw2', { y: -140, scale: 0, autoAlpha: 0, duration: 0.6, ease: POP }, 0.55);
        tl.from('#st-sw3', { x: 160, y: 60, scale: 0, autoAlpha: 0, duration: 0.6, ease: POP }, 0.7);
        /* Farbtanz: die Punkte umkreisen sich einmal */
        tl.to('#st-sw1', { x: 125, y: -80, duration: 0.9, ease: MOVE }, 1.4);
        tl.to('#st-sw2', { x: 120, y: 90, duration: 0.9, ease: MOVE }, 1.4);
        tl.to('#st-sw3', { x: -245, y: -10, duration: 0.9, ease: MOVE }, 1.4);
        /* Verschmelzen in der Mitte */
        tl.to('#st-sw1', { x: 152, y: -22, scale: 0.45, duration: 0.55, ease: IN }, 2.6);
        tl.to('#st-sw2', { x: 27, y: 58, scale: 0.45, duration: 0.55, ease: IN }, 2.6);
        tl.to('#st-sw3', { x: -93, y: -32, scale: 0.45, duration: 0.55, ease: IN }, 2.6);
        tl.set('.st-sw', { autoAlpha: 0 }, 3.12);
        tl.fromTo('#st-pop', { autoAlpha: 1, scale: 0.3 }, { scale: 3.2, autoAlpha: 0, duration: 0.55, ease: SOFT }, 3.1);
        /* Funken sprühen */
        tl.fromTo('#st-b1', { autoAlpha: 1, x: 0, y: 0 }, { x: -90, y: -70, autoAlpha: 0, duration: 0.6, ease: SOFT }, 3.12);
        tl.fromTo('#st-b2', { autoAlpha: 1, x: 0, y: 0 }, { x: 95, y: -55, autoAlpha: 0, duration: 0.6, ease: SOFT }, 3.12);
        tl.fromTo('#st-b3', { autoAlpha: 1, x: 0, y: 0 }, { x: -70, y: 80, autoAlpha: 0, duration: 0.6, ease: SOFT }, 3.12);
        tl.fromTo('#st-b4', { autoAlpha: 1, x: 0, y: 0 }, { x: 85, y: 70, autoAlpha: 0, duration: 0.6, ease: SOFT }, 3.12);
        tl.fromTo('#st-b5', { autoAlpha: 1, x: 0, y: 0 }, { x: -20, y: -100, autoAlpha: 0, duration: 0.6, ease: SOFT }, 3.12);
        tl.fromTo('#st-b6', { autoAlpha: 1, x: 0, y: 0 }, { x: 25, y: 100, autoAlpha: 0, duration: 0.6, ease: SOFT }, 3.12);
        /* Das Design-Board entsteht */
        tl.from('#st-design', { scale: 0, rotation: -10, autoAlpha: 0, duration: 0.85, ease: 'elastic.out(1, 0.6)' }, 3.3);
        /* Daraus: Visitenkarte und Flyer */
        tl.from('#st-vk', { x: 220, y: -20, scale: 0.4, rotation: 8, autoAlpha: 0, duration: 0.7, ease: POP }, 4.5);
        tl.from('#st-fly', { x: -200, y: -10, scale: 0.4, rotation: -8, autoAlpha: 0, duration: 0.7, ease: POP }, 4.8);
        tl.to('#st-design', { y: -7, duration: 1.2, ease: IDLE, yoyo: true, repeat: 1 }, 5.9);
        tl.to('#st-vk', { y: 6, duration: 1.3, ease: IDLE, yoyo: true, repeat: 1 }, 6.0);
        tl.to('#st-fly', { y: -6, duration: 1.3, ease: IDLE, yoyo: true, repeat: 1 }, 6.1);

        /* ========== Kapitel 2: Das Branding formt die Webseite (9 – 17) ========== */
        tl.call(setDot(1), null, 9);
        cap(1, 9);
        tl.to('#st-vk', { x: -120, y: 90, scale: 0.6, autoAlpha: 0, duration: 0.6, ease: IN }, 9.4);
        tl.to('#st-fly', { x: 120, y: 90, scale: 0.6, autoAlpha: 0, duration: 0.6, ease: IN }, 9.5);
        tl.to('#st-browser', { autoAlpha: 1, duration: 0.01 }, 9.9);
        tl.from('#st-browser', { scale: 0.6, y: 60, duration: 0.75, ease: POP }, 9.9);
        tl.from('#st-browser .st-bar', { y: -20, autoAlpha: 0, duration: 0.4, ease: SOFT }, 10.5);
        tl.from('#st-browser .st-nav', { y: 14, autoAlpha: 0, duration: 0.4, ease: SOFT }, 10.65);
        /* Das Logo fliegt vom Design-Board in die Webseite */
        tl.set('#st-mark', { autoAlpha: 1 }, 10.6);
        tl.to('#st-design', { autoAlpha: 0, y: 60, scale: 0.7, duration: 0.55, ease: IN }, 10.7);
        tl.to('#st-mark', { x: -131, y: -70, scale: 0.38, duration: 0.85, ease: MOVE }, 10.8);
        tl.to('#st-mark', { y: -27, duration: 0.3, ease: IN }, 11.35);
        tl.set('#st-mark', { autoAlpha: 0 }, 11.68);
        tl.to('.st-nav .ndot', { autoAlpha: 1, duration: 0.01 }, 11.68);
        tl.from('.st-nav .ndot', { scale: 0, duration: 0.45, ease: 'back.out(2.6)' }, 11.68);
        /* Der Marken-Verlauf wischt über die graue Seite — Design angewendet */
        tl.to('#st-wipe', { scaleX: 1, duration: 0.8, ease: MOVE }, 12.1);
        tl.from('#st-browser .st-line', { x: -22, autoAlpha: 0, duration: 0.4, ease: SOFT, stagger: 0.12 }, 12.6);
        tl.from('#st-btn', { scale: 0.6, autoAlpha: 0, duration: 0.55, ease: 'back.out(2.2)' }, 13.0);
        tl.to('#st-browser', { y: -6, duration: 1.4, ease: IDLE, yoyo: true, repeat: 1 }, 14.2);

        /* ========== Kapitel 3: Fotos & Videos (17 – 24) ========== */
        tl.call(setDot(2), null, 17);
        cap(2, 17);
        tl.fromTo('#st-flash', { opacity: 0 }, { opacity: 0.7, duration: 0.08, ease: IN }, 17.6);
        tl.to('#st-flash', { opacity: 0, duration: 0.35, ease: SOFT }, 17.68);
        tl.from('#st-ph1', { x: -180, y: -60, rotation: -18, autoAlpha: 0, duration: 0.65, ease: POP }, 17.8);
        tl.fromTo('#st-flash', { opacity: 0 }, { opacity: 0.55, duration: 0.08, ease: IN }, 18.5);
        tl.to('#st-flash', { opacity: 0, duration: 0.35, ease: SOFT }, 18.58);
        tl.from('#st-ph2', { x: 180, y: 60, rotation: 16, autoAlpha: 0, duration: 0.65, ease: POP }, 18.7);
        tl.from('#st-stars', { scale: 0, autoAlpha: 0, rotation: -8, duration: 0.55, ease: 'back.out(2.4)' }, 19.6);
        tl.to('#st-hero', { scale: 1.04, duration: 0.4, ease: IDLE, yoyo: true, repeat: 1 }, 19.7);
        tl.to('#st-ph1', { y: '-=6', duration: 1.3, ease: IDLE, yoyo: true, repeat: 1 }, 20.5);
        tl.to('#st-ph2', { y: '+=6', duration: 1.3, ease: IDLE, yoyo: true, repeat: 1 }, 20.6);

        /* ========== Kapitel 4: SEO — Aufstieg auf Platz 1 (24 – 33.5) ========== */
        tl.call(setDot(3), null, 24);
        cap(3, 24);
        tl.to('#st-browser', { scale: 0.72, x: -250, y: 40, autoAlpha: 0.35, duration: 0.7, ease: MOVE }, 24.3);
        tl.to('.st-photo, #st-stars', { autoAlpha: 0, duration: 0.4, ease: IN }, 24.3);
        tl.to('#st-serp', { autoAlpha: 1, duration: 0.01 }, 24.9);
        tl.from('#st-serp', { y: 60, scale: 0.9, duration: 0.6, ease: POP }, 24.9);
        (function () {
            var q = { n: 0 }, txt = 'handwerker in bonn';
            tl.to(q, { n: txt.length, duration: 0.9, ease: 'none', onUpdate: function () {
                document.getElementById('st-q').textContent = txt.slice(0, Math.round(q.n));
            } }, 25.6);
        })();
        tl.to('#st-caret', { opacity: 0, duration: 0.3, ease: 'steps(1)', yoyo: true, repeat: 5 }, 25.4);
        tl.set('#st-caret', { opacity: 0 }, 27.2);
        tl.from('.st-row', { y: 26, autoAlpha: 0, duration: 0.45, ease: SOFT, stagger: 0.12 }, 26.8);
        /* Der Aufstieg: Platz 4 → 3 → 2 → 1 */
        tl.to('#st-own', { top: 116, duration: 0.55, ease: POP }, 28.1);
        tl.to('#st-r3', { top: 174, duration: 0.55, ease: MOVE }, 28.1);
        tl.to('#st-own', { top: 58, duration: 0.55, ease: POP }, 29.0);
        tl.to('#st-r2', { top: 116, duration: 0.55, ease: MOVE }, 29.0);
        tl.to('#st-own', { top: 0, duration: 0.6, ease: 'back.out(2)' }, 29.9);
        tl.to('#st-r1', { top: 58, duration: 0.6, ease: MOVE }, 29.9);
        tl.to('#st-p1', { scale: 1, duration: 0.5, ease: 'back.out(2.4)' }, 30.6);
        tl.to('#st-own', { scale: 1.04, duration: 0.35, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 30.8);

        /* ========== Kapitel 5: Besucher zählen hoch, Anfrage kommt (33.5 – 42) ========== */
        tl.call(setDot(4), null, 33.5);
        cap(4, 33.5);
        tl.to('#st-serp', { y: -60, autoAlpha: 0, duration: 0.55, ease: IN }, 33.8);
        tl.to('#st-browser', { scale: 1, x: 0, y: 0, autoAlpha: 1, duration: 0.7, ease: MOVE }, 34.1);
        tl.to('#st-counter', { autoAlpha: 1, duration: 0.01 }, 34.9);
        tl.from('#st-counter', { x: 60, scale: 0.85, duration: 0.55, ease: POP }, 34.9);
        var rips = ['#st-rip1', '#st-rip2', '#st-rip3'];
        for (var r = 0; r < 6; r++) {
            tl.fromTo(rips[r % 3], { x: 290 + (r % 3) * 22, y: 330 + (r % 2) * 14, autoAlpha: 0.85, scale: 0.4 },
                { scale: 2.6, autoAlpha: 0, duration: 0.55, ease: SOFT }, 35.5 + r * 0.55);
        }
        tl.to('#st-btn', { scale: 0.94, duration: 0.09, ease: IN, transformOrigin: '50% 50%' }, 35.5);
        tl.to('#st-btn', { scale: 1, duration: 0.3, ease: 'back.out(2.6)' }, 35.6);
        tl.to('#st-btn', { scale: 0.94, duration: 0.09, ease: IN }, 36.6);
        tl.to('#st-btn', { scale: 1, duration: 0.3, ease: 'back.out(2.6)' }, 36.7);
        (function () {
            var v = { n: 0 };
            tl.to(v, { n: 47, duration: 3.0, ease: 'power1.inOut', onUpdate: function () {
                document.getElementById('st-cnt').textContent = '+' + Math.round(v.n);
            } }, 35.4);
        })();
        tl.to('#st-counter', { scale: 1.05, duration: 0.3, ease: IDLE, yoyo: true, repeat: 1 }, 38.2);
        tl.to('#st-notif', { autoAlpha: 1, duration: 0.01 }, 39.0);
        tl.from('#st-notif', { y: -90, scale: 0.9, duration: 0.6, ease: 'back.out(1.7)' }, 39.0);
        tl.to('#st-notif', { scale: 1.03, duration: 0.35, ease: IDLE, yoyo: true, repeat: 1 }, 39.9);

        /* ========== Ausklang & Reset (42.2 – 43.6) ========== */
        tl.to('#stage', { autoAlpha: 0, duration: 0.55, ease: IN }, 42.2);
        tl.call(function () {
            gsap.set('#stage *', { clearProps: 'all' });
            setInitial();
        }, null, 42.85);
        tl.to('#stage', { autoAlpha: 1, duration: 0.4, ease: SOFT }, 43.0);
        tl.set({}, {}, 43.6);

        var CHAPTER_TIMES = [0, 9, 17, 24, 33.5];
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
