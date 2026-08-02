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
        var mobile = vw < 700;
        /* Desktop: ganze Bühne (Textspalte + Szene). Mobil: auf die Szene gezoomt,
           der Text sitzt dann unter der Szene — beides innerhalb derselben Bühne. */
        var base = 900;
        var h = mobile ? 830 : 546;
        var s = Math.min(vw, 1124) / base;
        stage.style.transform = 'scale(' + s + ')';
        stage.style.marginLeft = (mobile ? 0 : (vw - 900 * s) / 2) + 'px';
        stage.style.height = h + 'px';
        scaleBox.style.height = (h * s) + 'px';
    }
    fit();
    window.addEventListener('resize', fit, { passive: true });

    /* Jedes Wort bekommt eine eigene Hülle, damit der Text lesegerecht einläuft */
    (function splitWords() {
        document.querySelectorAll('.st-txt p, .st-txt .k').forEach(function (el) {
            var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
            var nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);
            nodes.forEach(function (n) {
                if (!n.nodeValue.trim()) return;
                var frag = document.createDocumentFragment();
                n.nodeValue.split(/(\s+)/).forEach(function (part) {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                    var sp = document.createElement('span');
                    sp.className = 'w';
                    sp.textContent = part;
                    frag.appendChild(sp);
                });
                n.parentNode.replaceChild(frag, n);
            });
        });
    })();

    var mm = gsap.matchMedia();

    mm.add({
        reduce: '(prefers-reduced-motion: reduce)',
        ok: '(prefers-reduced-motion: no-preference)'
    }, function (ctx) {
        if (ctx.conditions.reduce) {
            gsap.set('#st-browser, #st-stars', { autoAlpha: 1 });
            gsap.set('#st-wipe', { scaleX: 1 });
            gsap.set('.st-nav .ndot', { autoAlpha: 1 });
            gsap.set('#tx2', { autoAlpha: 1 });
            return;
        }

        /* ---------- Anfangszustände ---------- */
        function setInitial() {
            gsap.set('#st-serp, #st-counter, #st-notif, #st-stars, #st-browser', { autoAlpha: 0 });
            gsap.set('.st-photo, #st-vid', { autoAlpha: 0 });
            gsap.set('#st-mark, #st-pop, .st-b, #st-scan, .seo-chip, #st-score, #st-cursor, .st-person', { autoAlpha: 0 });
            gsap.set('#st-seobar', { scaleX: 0 });
            gsap.set('.st-nav .ndot', { autoAlpha: 0 });
            gsap.set('#st-wipe', { scaleX: 0 });
            gsap.set('#st-p1', { scale: 0, transformOrigin: '50% 50%' });
            gsap.set('#st-own', { top: 174 });
            gsap.set('#st-r1', { top: 0 }); gsap.set('#st-r2', { top: 58 }); gsap.set('#st-r3', { top: 116 });
            gsap.set('.st-txt', { autoAlpha: 0 });
            gsap.set('#st-tab, #st-phone, #st-fit', { autoAlpha: 0 });
            gsap.set('#st-ads, #st-tapdot, #st-again', { autoAlpha: 0 });
            gsap.set('.st-sw, #st-design, #st-vk, #st-fly', { autoAlpha: 0 });
            gsap.set('.fin-card, #fin-logo, #fin-burst', { autoAlpha: 0 });
            gsap.set('.fin-card', { x: 0, y: 0, scale: 1 });
            gsap.set('#ig-feed', { y: 0 });
            gsap.set('#st-scene', { x: 0, scale: 1, transformOrigin: '50% 50%' });
            gsap.set('#st-q', { textContent: '' });
            document.getElementById('st-cnt').textContent = '0';
            document.getElementById('st-nname').textContent = 'Max M. · gerade eben';
        }
        setInitial();

        var tl = gsap.timeline({ paused: true, repeat: -1 });
        tl.timeScale(0.9);
        var PAN = 'power2.inOut';
        var POP = 'back.out(1.45)', SOFT = 'power2.out', OUT = 'power3.out',
            MOVE = 'power3.inOut', IN = 'power2.in', IDLE = 'sine.inOut';

        /* Textblock der Szene: Kicker und Satz laufen leicht versetzt ein */
        function say(sel, tIn, tOut) {
            tl.to(sel, { autoAlpha: 1, duration: 0.01 }, tIn);
            tl.from(sel + ' .k .w', { y: 12, autoAlpha: 0, duration: 0.5, ease: 'power2.out',
                stagger: 0.035, force3D: false, immediateRender: false }, tIn + 0.01);
            tl.from(sel + ' p .w', { y: 14, autoAlpha: 0, duration: 0.55, ease: 'power2.out',
                stagger: 0.018, force3D: false, immediateRender: false }, tIn + 0.16);
            tl.to(sel, { autoAlpha: 0, y: -14, duration: 0.5, ease: 'power1.in' }, tOut);
            tl.set(sel, { y: 0 }, tOut + 0.55);
        }

        /* ========== Kapitel 1: Drei Farben → Design → Branding (0 – 9) ========== */
        tl.set('#st-scene', { y: -14 }, 0);
        say('#tx1', 0.9, 8.4);
        tl.to('#st-sw1', { autoAlpha: 1, duration: 0.01 }, 0.2);
        tl.from('#st-sw1', { x: -160, y: 60, scale: 0, duration: 0.6, ease: POP, immediateRender: false }, 0.21);
        tl.to('#st-sw2', { autoAlpha: 1, duration: 0.01 }, 0.37);
        tl.from('#st-sw2', { y: -140, scale: 0, duration: 0.6, ease: POP, immediateRender: false }, 0.38);
        tl.to('#st-sw3', { autoAlpha: 1, duration: 0.01 }, 0.54);
        tl.from('#st-sw3', { x: 160, y: 60, scale: 0, duration: 0.6, ease: POP, immediateRender: false }, 0.55);
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
        tl.to('#st-design', { autoAlpha: 1, duration: 0.01 }, 3.45);
        tl.from('#st-design', { scale: 0, rotation: -10, duration: 0.85,
            ease: 'elastic.out(1, 0.7)', immediateRender: false }, 3.46);
        /* Daraus: Visitenkarte und Flyer */
        tl.to('#st-vk', { autoAlpha: 1, duration: 0.01 }, 4.5);
        tl.from('#st-vk', { x: 220, y: -20, scale: 0.4, rotation: 8, duration: 0.7, ease: POP, immediateRender: false }, 4.51);
        tl.to('#st-fly', { autoAlpha: 1, duration: 0.01 }, 4.8);
        tl.from('#st-fly', { x: -200, y: -10, scale: 0.4, rotation: -8, duration: 0.7, ease: POP, immediateRender: false }, 4.81);
        tl.to('#st-design', { y: -7, duration: 1.2, ease: IDLE, yoyo: true, repeat: 1 }, 5.9);
        tl.to('#st-vk', { y: 6, duration: 1.3, ease: IDLE, yoyo: true, repeat: 1 }, 6.0);
        tl.to('#st-fly', { y: -6, duration: 1.3, ease: IDLE, yoyo: true, repeat: 1 }, 6.1);
        /* Leben in der Haltephase: die Farbchips des Boards schimmern nacheinander */
        tl.to('#st-design .d-chips i', { scale: 1.18, duration: 0.3, ease: IDLE, yoyo: true, repeat: 1, stagger: 0.14, transformOrigin: '50% 50%' }, 7.0);

        /* ========== Kapitel 2: Branding verschmilzt zur Webseite (9 – 17) ========== */
        tl.to('#st-scene', { x: 158, y: 0, duration: 1.15, ease: PAN }, 8.95);
        say('#tx2', 10.9, 16.5);
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

        /* ========== Kapitel 3: Fotos & Videos füllen die Seite (17 – 24.4) ========== */
        tl.to('#st-scene', { x: -168, y: 0, duration: 1.35, ease: PAN }, 16.85);
        say('#tx3', 17.9, 23.7);
        /* Erst wenn die Kamera steht, entsteht das erste Foto: weicher Lichtblitz, kein Vollbild-Blinken */
        tl.fromTo('#st-flash', { opacity: 0, scale: 0.86 },
            { opacity: 0.5, scale: 1, duration: 0.16, ease: SOFT, immediateRender: false }, 18.28);
        tl.to('#st-flash', { opacity: 0, duration: 0.6, ease: 'power2.out' }, 18.44);
        tl.to('#st-ph1', { autoAlpha: 1, duration: 0.01 }, 18.3);
        tl.from('#st-ph1', { x: -170, y: -34, rotation: -16, scale: 0.82, duration: 0.7, ease: POP,
            immediateRender: false }, 18.31);
        /* Das Foto zieht in die Seite und färbt sie ein */
        tl.to('#st-ph1', { x: 245, y: 55, rotation: 0, scale: 1.3, duration: 0.85, ease: PAN }, 19.15);
        tl.to('#st-wipe', { scaleX: 1, duration: 0.55, ease: 'power2.out' }, 19.85);
        tl.to('#st-ph1', { autoAlpha: 0, scale: 1.42, duration: 0.45, ease: 'power2.out' }, 19.95);
        tl.to('#st-hero', { scale: 1.04, duration: 0.42, ease: IDLE, yoyo: true, repeat: 1 }, 20.05);
        /* Das Video dockt an: ohne Blitz, dafür mit weicher Landung */
        tl.to('#st-vid', { autoAlpha: 1, duration: 0.01 }, 20.55);
        tl.from('#st-vid', { x: 78, y: 104, rotation: 12, scale: 0.85, duration: 0.7, ease: POP,
            immediateRender: false }, 20.56);
        tl.to('#st-vid', { x: -220, y: 6, rotation: 0, duration: 0.75, ease: PAN }, 21.25);
        tl.to('#st-vid .play', { scale: 1.16, duration: 0.42, ease: IDLE, yoyo: true, repeat: 3,
            transformOrigin: '50% 50%' }, 22.0);
        /* Zweites Foto legt sich dazu */
        tl.to('#st-ph2', { autoAlpha: 1, duration: 0.01 }, 21.15);
        tl.from('#st-ph2', { x: -96, y: 62, rotation: -13, scale: 0.85, duration: 0.7, ease: POP,
            immediateRender: false }, 21.16);
        tl.to('#st-ph2', { x: -55, y: 56, rotation: 0, duration: 0.75, ease: PAN }, 21.85);
        /* Die Seite ist jetzt schön: Sterne + Glanz */
        tl.to('#st-stars', { autoAlpha: 1, duration: 0.01 }, 22.75);
        tl.from('#st-stars', { scale: 0, rotation: -8, duration: 0.55, ease: 'back.out(2)' }, 22.76);
        tl.to('#st-browser', { scale: 1.02, duration: 0.45, ease: IDLE, yoyo: true, repeat: 1 }, 22.85);

        /* ========== Kapitel 4: Auf jedem Gerät (24.5 – 32) ========== */
        tl.to('#st-scene', { x: 0, y: -30, duration: 1.2, ease: PAN }, 24.4);
        /* Die Requisiten des Foto-Kapitels treten ab, die Seite rückt in ihre neue Position */
        tl.to('.st-photo, #st-vid, #st-stars', { autoAlpha: 0, scale: 0.9, duration: 0.45, ease: IN }, 24.6);
        tl.to('#st-browser', { scale: 0.7, x: 33, duration: 1.0, ease: MOVE, transformOrigin: '50% 50%' }, 24.9);
        say('#tx4', 25.9, 31.2);
        /* Tablet und Handy schieben sich versetzt hinter der Seite hervor und richten sich aus */
        tl.to('#st-tab', { autoAlpha: 1, duration: 0.01 }, 25.85);
        tl.fromTo('#st-tab', { x: 335, y: 24, scale: 0.62, rotation: 4 },
            { x: 0, y: 0, scale: 1, rotation: -1.2, duration: 1.05, ease: 'power3.out', immediateRender: false }, 25.86);
        tl.to('#st-tab', { rotation: 0, duration: 0.5, ease: 'sine.out' }, 26.75);
        tl.to('#st-phone', { autoAlpha: 1, duration: 0.01 }, 26.25);
        tl.fromTo('#st-phone', { x: -302, y: 20, scale: 0.6, rotation: -4 },
            { x: 0, y: 0, scale: 1, rotation: 1.2, duration: 1.05, ease: 'power3.out', immediateRender: false }, 26.26);
        tl.to('#st-phone', { rotation: 0, duration: 0.5, ease: 'sine.out' }, 27.15);
        /* Dieselbe Seite baut sich auf jedem Schirm auf: von links nach rechts durchlaufend */
        tl.from('#st-tab .mnav', { autoAlpha: 0, y: -6, duration: 0.35, ease: SOFT }, 27.0);
        tl.from('#st-tab .mh', { scaleY: 0.45, autoAlpha: 0, duration: 0.42, ease: SOFT, transformOrigin: '50% 0%' }, 27.14);
        tl.from('#st-tab .ml', { x: -9, autoAlpha: 0, duration: 0.34, ease: SOFT, stagger: 0.07 }, 27.34);
        tl.from('#st-tab .mb', { scale: 0.55, autoAlpha: 0, duration: 0.5, ease: 'back.out(2)' }, 27.6);
        tl.from('#st-phone .mnav', { autoAlpha: 0, y: -6, duration: 0.35, ease: SOFT }, 27.3);
        tl.from('#st-phone .mh', { scaleY: 0.45, autoAlpha: 0, duration: 0.42, ease: SOFT, transformOrigin: '50% 0%' }, 27.44);
        tl.from('#st-phone .ml', { x: -9, autoAlpha: 0, duration: 0.34, ease: SOFT, stagger: 0.07 }, 27.64);
        tl.from('#st-phone .mb', { scale: 0.55, autoAlpha: 0, duration: 0.5, ease: 'back.out(2)' }, 27.9);
        tl.to('#st-fit', { autoAlpha: 1, duration: 0.01 }, 28.45);
        tl.from('#st-fit', { scale: 0.55, y: -12, duration: 0.55, ease: 'back.out(2)', immediateRender: false }, 28.46);
        /* Ruhephase: eine Welle läuft durch die drei Geräte, dann leichtes Schweben */
        tl.to('#st-tab', { y: -9, duration: 1.8, ease: IDLE, yoyo: true, repeat: 1 }, 28.9);
        tl.to('#st-browser', { y: -7, duration: 1.8, ease: IDLE, yoyo: true, repeat: 1 }, 29.15);
        tl.to('#st-phone', { y: -9, duration: 1.8, ease: IDLE, yoyo: true, repeat: 1 }, 29.4);
        tl.to('#st-tab .mb', { scale: 1.06, duration: 0.45, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 29.9);
        tl.to('#st-browser #st-btn', { scale: 1.05, duration: 0.45, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 30.05);
        tl.to('#st-phone .mb', { scale: 1.06, duration: 0.45, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 30.2);
        /* Geräte gleiten wieder hinter die Seite, die Webseite kommt zurück */
        tl.to('#st-fit', { autoAlpha: 0, y: -10, duration: 0.4, ease: IN }, 31.1);
        tl.to('#st-tab', { x: 300, y: 18, scale: 0.62, autoAlpha: 0, duration: 0.75, ease: 'power2.in' }, 31.25);
        tl.to('#st-phone', { x: -270, y: 16, scale: 0.62, autoAlpha: 0, duration: 0.75, ease: 'power2.in' }, 31.35);
        tl.to('#st-browser', { scale: 1, x: 0, y: 0, duration: 0.9, ease: MOVE }, 31.6);

        /* ========== Kapitel 5: SEO-Optimierung, dann Aufstieg auf Platz 1 (32 – 44.5) ========== */
        tl.to('#st-scene', { x: -158, y: 0, duration: 1.2, ease: PAN }, 31.9);
        say('#tx5', 32.7, 36.1);
        say('#tx6', 38.2, 44.1);
        /* SEO-Scan fährt über die fertige Seite */
        tl.fromTo('#st-scan', { x: -60, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, immediateRender: false }, 32.55);
        tl.to('#st-scan', { x: 575, duration: 2.2, ease: 'power1.inOut' }, 32.6);
        tl.to('#st-scan', { autoAlpha: 0, duration: 0.3 }, 34.65);
        /* Prüf-Chips erscheinen genau dort, wo der Scan-Strahl sie "findet" — mit Ring-Puls */
        tl.to('#sc1', { autoAlpha: 1, duration: 0.01 }, 33.05);
        tl.from('#sc1', { scale: 0.55, y: -12, rotation: -5, duration: 0.6, ease: 'back.out(1.8)', transformOrigin: '50% 100%' }, 33.06);
        tl.fromTo('#st-rip1', { x: 216, y: 102, autoAlpha: 0.7, scale: 0.4 }, { scale: 2.2, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 33.07);
        tl.to('#sc3', { autoAlpha: 1, duration: 0.01 }, 34.35);
        tl.from('#sc3', { scale: 0.55, y: -12, rotation: 5, duration: 0.6, ease: 'back.out(1.8)', transformOrigin: '50% 100%' }, 34.36);
        tl.fromTo('#st-rip2', { x: 568, y: 118, autoAlpha: 0.7, scale: 0.4 }, { scale: 2.2, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 34.37);
        tl.to('#sc2', { autoAlpha: 1, duration: 0.01 }, 33.3);
        tl.from('#sc2', { scale: 0.55, y: -12, rotation: -5, duration: 0.6, ease: 'back.out(1.8)', transformOrigin: '50% 100%' }, 33.31);
        tl.fromTo('#st-rip3', { x: 216, y: 282, autoAlpha: 0.7, scale: 0.4 }, { scale: 2.2, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 33.33);
        /* Chips atmen leicht, während der Score klettert */
        tl.to('#sc1', { y: -3, duration: 1.1, ease: IDLE, yoyo: true, repeat: 1 }, 33.9);
        tl.to('#sc3', { y: 3, duration: 1.1, ease: IDLE, yoyo: true, repeat: 1 }, 35.1);
        /* SEO-Score zählt auf 100 */
        tl.to('#st-score', { autoAlpha: 1, duration: 0.01 }, 33.45);
        tl.from('#st-score', { scale: 0.55, y: -16, duration: 0.55, ease: 'back.out(2)' }, 33.46);
        (function () {
            var sc = { n: 0 };
            tl.to(sc, { n: 100, duration: 1.7, ease: 'power1.inOut', onUpdate: function () {
                document.getElementById('st-seo').textContent = Math.round(sc.n);
            } }, 33.65);
        })();
        tl.fromTo('#st-seobar', { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: 'power1.inOut', immediateRender: false }, 33.65);
        tl.to('#st-score', { scale: 1.08, duration: 0.3, ease: IDLE, yoyo: true, repeat: 1 }, 35.45);
        tl.to('#st-browser', { scale: 1.015, duration: 0.35, ease: IDLE, yoyo: true, repeat: 1 }, 35.62);
        /* Optimiert — jetzt zur Suche */
        tl.to('.seo-chip, #st-score, .st-photo, #st-vid, #st-stars', { autoAlpha: 0, duration: 0.4, ease: IN }, 36.2);
        tl.to('#st-browser', { scale: 0.72, x: -55, y: 40, autoAlpha: 0.32, duration: 0.7, ease: MOVE }, 36.4);
        tl.to('#st-serp', { autoAlpha: 1, duration: 0.01 }, 37);
        tl.from('#st-serp', { y: 60, scale: 0.9, duration: 0.6, ease: POP }, 37);
        (function () {
            var q = { n: 0 }, txt = 'handwerker in bonn';
            tl.to(q, { n: txt.length, duration: 0.9, ease: 'none', onUpdate: function () {
                document.getElementById('st-q').textContent = txt.slice(0, Math.round(q.n));
            } }, 37.7);
        })();
        tl.to('#st-caret', { opacity: 0, duration: 0.3, ease: 'steps(1)', yoyo: true, repeat: 5 }, 37.5);
        tl.set('#st-caret', { opacity: 0 }, 39.3);
        tl.from('.st-row', { y: 26, autoAlpha: 0, duration: 0.45, ease: SOFT, stagger: 0.12 }, 38.9);
        /* Der Aufstieg: Platz 4 → 3 → 2 → 1 */
        tl.to('#st-own', { top: 116, duration: 0.55, ease: POP }, 40.2);
        tl.to('#st-r3', { top: 174, duration: 0.55, ease: MOVE }, 40.2);
        tl.to('#st-own', { top: 58, duration: 0.55, ease: POP }, 41.1);
        tl.to('#st-r2', { top: 116, duration: 0.55, ease: MOVE }, 41.1);
        tl.to('#st-own', { top: 0, duration: 0.6, ease: 'back.out(2)' }, 42);
        tl.to('#st-r1', { top: 58, duration: 0.6, ease: MOVE }, 42);
        tl.to('#st-p1', { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 42.7);
        tl.to('#st-own', { scale: 1.04, duration: 0.35, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 42.9);
        /* Der Mauszeiger kommt und klickt auf Platz 1 */
        tl.to('#st-cursor', { autoAlpha: 1, duration: 0.01 }, 43.15);
        tl.fromTo('#st-cursor', { x: 700, y: 430 }, { x: 455, y: 150, duration: 0.85, ease: MOVE, immediateRender: false }, 43.15);
        tl.to('#st-cursor', { scale: 0.82, duration: 0.09, ease: IN, transformOrigin: '20% 15%' }, 44.1);
        tl.to('#st-cursor', { scale: 1, duration: 0.28, ease: 'back.out(2.1)' }, 44.2);
        tl.fromTo('#st-rip1', { x: 447, y: 140, autoAlpha: 0.8, scale: 0.4 }, { scale: 2.6, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, 44.15);
        tl.to('#st-own', { scale: 0.975, duration: 0.1, ease: IN, transformOrigin: '50% 50%' }, 44.15);
        tl.to('#st-own', { scale: 1, duration: 0.3, ease: 'back.out(2.1)' }, 44.25);

        /* ========== Kapitel 6: Anzeigen bei Instagram (44.5 – 53.5) ========== */
        /* Erst räumt die Suche ab, dann fährt die Kamera, dann kommt das Handy */
        tl.to('#st-cursor', { autoAlpha: 0, duration: 0.3, ease: IN }, 44.4);
        tl.to('#st-serp', { y: -48, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, 44.45);
        tl.to('#st-browser', { scale: 0.82, autoAlpha: 0, duration: 0.65, ease: 'power2.in' }, 44.6);
        tl.to('#st-scene', { x: 0, y: 0, duration: 1.05, ease: PAN }, 44.9);
        tl.to('#st-ads', { autoAlpha: 1, duration: 0.01 }, 45.35);
        tl.from('#st-ads', { y: 78, scale: 0.88, duration: 1.0, ease: 'power3.out', immediateRender: false }, 45.36);
        say('#tx8', 45.6, 51.3);
        /* Der Feed scrollt: die Anzeige zieht vorbei ... */
        tl.fromTo('#ig-feed', { y: 0 }, { y: -100, duration: 1.5, ease: 'power1.inOut', immediateRender: false }, 46.2);
        tl.to('#st-ads .ad .im', { scale: 1.04, duration: 0.4, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 46.9);
        /* ... und taucht später wieder auf: so bleibt die Marke im Kopf */
        tl.to('#ig-feed', { y: -597, duration: 1.7, ease: 'power1.inOut' }, 48.1);
        tl.to('#st-again', { autoAlpha: 1, duration: 0.01 }, 49.2);
        tl.from('#st-again', { scale: 0.5, y: -12, duration: 0.55, ease: 'back.out(2)', immediateRender: false }, 49.21);
        tl.to('#ig-ad2 .im', { scale: 1.05, duration: 0.45, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 49.3);
        /* Finger tippt auf den Button der Anzeige */
        tl.to('#st-tapdot', { autoAlpha: 1, duration: 0.01 }, 50.0);
        tl.fromTo('#st-tapdot', { x: 706, y: 442, scale: 1.2 }, { x: 626, y: 328, scale: 1, duration: 0.75, ease: MOVE, immediateRender: false }, 50.0);
        tl.to('#st-tapdot', { scale: 0.72, duration: 0.12, ease: IN }, 50.85);
        tl.to('#st-tapdot', { scale: 1, duration: 0.3, ease: 'back.out(2.1)' }, 50.97);
        tl.to('#ig-ad2 .cta', { scale: 0.93, duration: 0.12, ease: IN, transformOrigin: '50% 50%' }, 50.85);
        tl.to('#ig-ad2 .cta', { scale: 1, duration: 0.3, ease: 'back.out(2.1)' }, 50.97);
        tl.fromTo('#st-rip1', { x: 633, y: 335, autoAlpha: 0.8, scale: 0.4 },
            { scale: 2.6, autoAlpha: 0, duration: 0.6, ease: SOFT, immediateRender: false }, 50.9);
        tl.to('#st-tapdot', { autoAlpha: 0, duration: 0.3, ease: IN }, 51.5);
        /* Der Klick führt weiter: Handy tritt ab, die Webseite kommt zurück */
        tl.to('#st-again', { autoAlpha: 0, y: -10, duration: 0.4, ease: IN }, 51.35);
        /* Der Tipp öffnet die Seite: die Kamera fährt ins Handy hinein ... */
        tl.to('#st-ads', { scale: 1.32, autoAlpha: 0, duration: 0.8, ease: 'power2.in',
            transformOrigin: '50% 42%' }, 51.55);

        /* ========== Kapitel 6: Besucher werden zu Leads (44.5 – 58) ========== */
        tl.to('#st-scene', { x: 0, y: -38, scale: 0.8, duration: 1.15, ease: 'power3.out' }, 51.75);
        say('#tx7', 53.2, 65.9);
        /* ... und die Webseite wächst genau dort heraus, wo die Anzeige stand */
        tl.to('#st-browser', { autoAlpha: 1, duration: 0.01 }, 51.75);
        tl.fromTo('#st-browser', { x: 189, y: 26, scale: 0.36 },
            { x: 0, y: 0, scale: 1, duration: 1.15, ease: 'power3.out', immediateRender: false }, 51.75);
        /* Lead-Karte dockt rechts an */
        tl.to('#st-counter', { autoAlpha: 1, duration: 0.01 }, 53.4);
        tl.from('#st-counter', { x: 60, scale: 0.85, duration: 0.55, ease: POP, immediateRender: false }, 53.4);
        /* Besucher erscheinen links untereinander */
        ['#pp1', '#pp2', '#pp3'].forEach(function (p, k) {
            tl.to(p, { autoAlpha: 1, duration: 0.01 }, 53.75 + k * 0.15);
            tl.from(p, { scale: 0, y: 16, duration: 0.5, ease: 'back.out(1.9)', immediateRender: false }, 53.76 + k * 0.15);
        });
        /* Jeder Besucher: klickt den Button (→ Neue Anfrage), wandert nach rechts, wird zum Lead */
        var NAMES = ['Max M. · gerade eben', 'Sarah K. · gerade eben', 'Tobias R. · gerade eben'];
        function setLead(n) {
            return function () { document.getElementById('st-cnt').textContent = '+' + n; };
        }
        function setName(i) {
            return function () { document.getElementById('st-nname').textContent = NAMES[i]; };
        }
        (function () {
            /* Gleichmäßiger Takt: 10,6 s Abstand — die Push hat Zeit zu wirken, bevor der Nächste startet */
            var runs = [
                { p: '#pp1', rip: '#st-rip1', t: 54.2, dyBtn: 194, dyLead: 49 },
                { p: '#pp2', rip: '#st-rip2', t: 56.8, dyBtn: 116, dyLead: -29 },
                { p: '#pp3', rip: '#st-rip3', t: 59.4, dyBtn: 38, dyLead: -107 }
            ];
            runs.forEach(function (r, k) {
                /* Zum Button: ruhig hinlaufen, leicht vorgelehnt, weich ankommen */
                tl.to(r.p, { x: 195, y: r.dyBtn, scale: 0.8, rotation: 5, duration: 1.0, ease: MOVE }, r.t);
                tl.to(r.p, { rotation: 0, duration: 0.3, ease: SOFT }, r.t + 0.9);
                /* Kurz schauen, dann klicken */
                tl.to('#st-btn', { scale: 0.94, duration: 0.1, ease: IN, transformOrigin: '50% 50%' }, r.t + 1.35);
                tl.to('#st-btn', { scale: 1, duration: 0.3, ease: 'back.out(2.1)' }, r.t + 1.46);
                tl.fromTo(r.rip, { x: 250, y: 332, autoAlpha: 0.85, scale: 0.4 },
                    { scale: 2.4, autoAlpha: 0, duration: 0.55, ease: SOFT, immediateRender: false }, r.t + 1.37);
                /* Name wechseln, dann fällt die Push ein */
                tl.call(setName(k), null, r.t + 1.42);
                tl.fromTo('#st-notif', { y: -80, autoAlpha: 0 },
                    { y: 0, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.6)', immediateRender: false }, r.t + 1.5);
                /* Weiter nach rechts — als Lead ankommen */
                tl.to(r.p, { x: 739, y: r.dyLead, scale: 0.5, rotation: -4, duration: 1.0, ease: MOVE }, r.t + 1.75);
                tl.to(r.p, { autoAlpha: 0, rotation: 0, duration: 0.3, ease: IN }, r.t + 2.6);
                tl.call(setLead(k + 1), null, r.t + 1.52);
                tl.to('#st-counter', { scale: 1.08, duration: 0.28, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, r.t + 1.52);
                tl.to('#st-counter', { scale: 1.04, duration: 0.25, ease: IDLE, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, r.t + 2.6);
                /* Push zieht sich zurück — außer beim letzten */
                if (k < 2) {
                    tl.to('#st-notif', { y: -70, autoAlpha: 0, duration: 0.45, ease: IN }, r.t + 2.9);
                }
            });
        })();
        /* Nach dem dritten Lead läuft der Zähler weiter hoch — das System arbeitet weiter */
        (function () {
            var c = { n: 3 };
            tl.to(c, { n: 28, duration: 2.6, ease: 'power2.out', onUpdate: function () {
                document.getElementById('st-cnt').textContent = '+' + Math.round(c.n);
            } }, 62.4);
        })();
        tl.to('#st-counter', { scale: 1.06, duration: 0.35, ease: IDLE, yoyo: true, repeat: 3, transformOrigin: '50% 50%' }, 62.7);
        tl.to('#st-notif', { scale: 1.03, duration: 0.35, ease: IDLE, yoyo: true, repeat: 1 }, 62.9);

        /* ========== Kapitel 8: Alles wird zur Marke (66.6 – 76.4) ========== */
        tl.to('#st-browser, #st-counter, #st-notif', { autoAlpha: 0, scale: 0.92, duration: 0.6, ease: IN }, 66.45);
        tl.to('#st-scene', { x: 0, y: 0, scale: 1, duration: 0.95, ease: PAN }, 66.85);
        /* Die sieben Leistungen stellen sich im Kreis auf */
        tl.to('.fin-card', { autoAlpha: 1, duration: 0.01 }, 67.3);
        tl.from('.fin-card', { scale: 0.84, y: 16, autoAlpha: 0, duration: 0.7, ease: OUT,
            stagger: 0.08, immediateRender: false }, 67.31);
        /* Erst verabschieden sich die Beschriftungen, dann setzt die Drehung ein */
        tl.to('.fin-card .lb', { autoAlpha: 0, y: -6, duration: 0.4, ease: IN }, 69.2);
        (function () {
            /* Der Ring ist eine Ellipse: quer ist mehr Platz als hoch.
               Beim Einziehen laufen beide Halbachsen auf denselben Wert zu,
               aus der Ellipse wird also unterwegs ein Kreis. */
            var RX = 306, RY = 156;
            var C = { x: 450, y: 258 };
            var BASE = [[450, 102], [689, 161], [748, 293], [583, 399], [317, 399], [152, 293], [211, 161]];
            var els = ['#fc0', '#fc1', '#fc2', '#fc3', '#fc4', '#fc5', '#fc6'];
            var ang0 = BASE.map(function (b) {
                return Math.atan2((b[1] - C.y) / RY, (b[0] - C.x) / RX);
            });
            var o = { a: 0, rx: RX, ry: RY };
            tl.to(o, { a: Math.PI * 2.4, duration: 2.4, ease: 'power2.in', onUpdate: function () {
                for (var k = 0; k < 7; k++) {
                    var ang = ang0[k] + o.a;
                    gsap.set(els[k], {
                        x: C.x + o.rx * Math.cos(ang) - BASE[k][0],
                        y: C.y + o.ry * Math.sin(ang) - BASE[k][1]
                    });
                }
            } }, 69.6);
            tl.to(o, { rx: 8, ry: 8, duration: 2.4, ease: 'power2.in' }, 69.6);
        })();
        tl.to('.fin-card', { scale: 0.2, duration: 1.2, ease: IN }, 70.9);
        tl.set('.fin-card', { autoAlpha: 0 }, 72.1);
        /* Aus dem Zusammenstoß kommt Licht, daraus steht die Marke */
        tl.fromTo('#fin-burst', { autoAlpha: 1, scale: 0.2 },
            { scale: 2.6, autoAlpha: 0, duration: 0.95, ease: SOFT, immediateRender: false }, 71.95);
        tl.fromTo('#fin-logo', { autoAlpha: 0, scale: 0.9 },
            { autoAlpha: 1, scale: 1, duration: 1.0, ease: OUT,
                transformOrigin: '50% 50%', immediateRender: false }, 72.15);
        /* Das Logo haelt, blendet weich ab — dann beginnt die Geschichte von vorn.
           Weil zum Schluss nur noch das Logo zu sehen ist, genuegt sein Abblenden:
           die Buehne ist danach leer, Kapitel 1 startet aus dem Nichts. */
        tl.to('#fin-logo', { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut' }, 76.4);
        tl.call(function () {
            gsap.set('#stage *:not(.w)', { clearProps: 'transform,opacity,visibility' });
            setInitial();
        }, null, 77.5);
        tl.set({}, {}, 78.3);

        function rewind() {
            tl.pause(0);
            gsap.set('#stage *:not(.w)', { clearProps: 'transform,opacity,visibility' });
            setInitial();
        }

        var st = ScrollTrigger.create({
            trigger: '.stage-wrap',
            start: 'top 85%',
            end: 'bottom top',
            onEnter: function () { tl.play(); },
            onEnterBack: function () { tl.play(); },
            /* Außer Sicht zurückspulen: wer wiederkommt, sieht die ganze
               Geschichte noch einmal — und wieder das Logo am Ende. */
            onLeave: rewind,
            onLeaveBack: rewind
        });

        /* Wer direkt auf dem Abschnitt landet (Ankerlink, kurze Seite, Reload
           mitten drin), löst kein onEnter aus — dann hier selbst starten. */
        if (st.isActive) tl.play();
        ScrollTrigger.addEventListener('refresh', function () {
            if (st.isActive && !tl.isActive()) tl.play();
        });

        return function () { tl.kill(); };
    });
})();
