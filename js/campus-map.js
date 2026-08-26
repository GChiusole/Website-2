/* Interactive campus map.
   Loads images/campus-map.svg (self-hosted OpenStreetMap vector data) and adds
   pan/zoom. No third-party requests and no cookies -- see contact.html.

   Interaction rules, chosen so the widget never traps page scrolling:
     - drag with the mouse to pan; two fingers to pan/pinch on touch
     - the AER button swaps in aerial imagery, loaded on first use only
     - ctrl/cmd + wheel zooms; a plain wheel keeps scrolling the page
     - +/- and Reset buttons, and arrow keys / +/- when focused          */
(function () {
    'use strict';

    var host = document.getElementById('campusMap');
    if (!host || !window.fetch) { return; }

    var BASE_W = 1000, BASE_H = 925.8;
    var MIN_W = 40;                       // deepest zoom: ~45 m across
    // Framed to show every orientation label at once; the office is still
    // unmistakable from the red pin and the highlighted building.
    var START_WIDE = { x: 62, y: 53, w: 890 };
    // Labels are held at a constant pixel size, so on a phone-width box the
    // wide frame packs them on top of each other. This one drops the outer
    // campus and keeps the office, the U-Bahn station and both car parks,
    // which spreads the remaining labels far enough apart to read.
    var START_NARROW = { x: 200, y: 340, w: 600 };
    var NARROW_PX = 420;                  // rendered map width, not viewport

    function startView(px) {
        var s = (px && px < NARROW_PX) ? START_NARROW : START_WIDE;
        return { x: s.x, y: s.y, w: s.w, h: s.w * BASE_H / BASE_W };
    }

    var START = startView(0);

    // Geometry arrives via js/campus-map-data.js (a plain script, so this works
    // over file:// too). If that is missing for any reason the static image
    // already in the markup simply stays put.
    if (typeof window.CAMPUS_SVG === 'string') { init(window.CAMPUS_SVG); }

    function init(markup) {
        host.insertAdjacentHTML('afterbegin', markup);
        var svg = host.querySelector('#campusSvg');
        if (!svg) { return; }

        // The interactive map replaces the static fallback image.
        var still = host.querySelector('.campus-static');
        if (still) { still.remove(); }
        [].forEach.call(host.querySelectorAll('[hidden]'), function (el) {
            el.removeAttribute('hidden');
        });

        svg.setAttribute('tabindex', '0');
        var markers = [].slice.call(svg.querySelectorAll('.mk')).map(function (el) {
            var m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(el.getAttribute('transform'));
            return { el: el, x: m ? +m[1] : 0, y: m ? +m[2] : 0 };
        });

        START = startView(svg.getBoundingClientRect().width);
        var view = { x: START.x, y: START.y, w: START.w, h: START.h };
        apply();

        // The frame is chosen from the rendered width, so a rotation or a
        // resize that crosses NARROW_PX needs a new one -- but only while the
        // map is still where it started, so it never yanks the view out from
        // under someone who has panned or zoomed.
        function reframe() {
            var next = startView(svg.getBoundingClientRect().width);
            if (next.w === START.w) { return; }
            var untouched = view.x === START.x && view.y === START.y && view.w === START.w;
            START = next;
            if (untouched) {
                view = { x: START.x, y: START.y, w: START.w, h: START.h };
                apply();
            }
        }
        window.addEventListener('resize', reframe);
        if (window.ResizeObserver) { new ResizeObserver(apply).observe(svg); }
        else { window.addEventListener('resize', apply); }

        function clamp() {
            view.w = Math.min(BASE_W, Math.max(MIN_W, view.w));
            view.h = view.w * BASE_H / BASE_W;
            // keep at least a quarter of the map on screen
            view.x = Math.min(BASE_W - view.w * 0.25, Math.max(-view.w * 0.75, view.x));
            view.y = Math.min(BASE_H - view.h * 0.25, Math.max(-view.h * 0.75, view.y));
        }

        function apply() {
            clamp();
            svg.setAttribute('viewBox', view.x + ' ' + view.y + ' ' + view.w + ' ' + view.h);
            // counter-scale the overlay so markers keep a constant size in CSS
            // pixels: on-screen size = r * k * (renderedWidth / view.w), so
            // k = view.w / renderedWidth holds it at the authored pixel size.
            var rect = svg.getBoundingClientRect();
            var k = rect.width ? view.w / rect.width : view.w / BASE_W;
            markers.forEach(function (m) {
                m.el.setAttribute('transform',
                    'translate(' + m.x + ' ' + m.y + ') scale(' + k.toFixed(4) + ')');
            });
            svg.classList.toggle('z-far', view.w >= 480);
            svg.classList.toggle('z-mid', view.w < 480);
            svg.classList.toggle('z-near', view.w < 230);
        }

        /* zoom about a point given in client coordinates */
        function zoomAt(factor, clientX, clientY) {
            var r = svg.getBoundingClientRect();
            var fx = (clientX - r.left) / r.width;
            var fy = (clientY - r.top) / r.height;
            var px = view.x + fx * view.w, py = view.y + fy * view.h;
            var before = view.w;
            view.w = Math.min(BASE_W, Math.max(MIN_W, view.w * factor));
            view.h = view.w * BASE_H / BASE_W;
            if (view.w === before) { return; }
            view.x = px - fx * view.w;
            view.y = py - fy * view.h;
            apply();
        }

        function zoomCentre(factor) {
            var r = svg.getBoundingClientRect();
            zoomAt(factor, r.left + r.width / 2, r.top + r.height / 2);
        }

        /* ---- mouse drag ---- */
        var drag = null;
        svg.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'touch') { return; }
            drag = { x: e.clientX, y: e.clientY };
            svg.setPointerCapture(e.pointerId);
            svg.classList.add('is-dragging');
        });
        svg.addEventListener('pointermove', function (e) {
            if (!drag) { return; }
            var r = svg.getBoundingClientRect();
            view.x -= (e.clientX - drag.x) * view.w / r.width;
            view.y -= (e.clientY - drag.y) * view.h / r.height;
            drag.x = e.clientX; drag.y = e.clientY;
            apply();
        });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
            svg.addEventListener(ev, function () { drag = null; svg.classList.remove('is-dragging'); });
        });

        /* ---- wheel: only with a modifier, so the page keeps scrolling ---- */
        svg.addEventListener('wheel', function (e) {
            if (!e.ctrlKey && !e.metaKey) { return; }
            e.preventDefault();
            zoomAt(e.deltaY > 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY);
        }, { passive: false });

        /* ---- touch: two fingers pan and pinch ---- */
        var touch = null;
        function dist(t) {
            return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
        }
        function mid(t) {
            return { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 };
        }
        svg.addEventListener('touchstart', function (e) {
            if (e.touches.length !== 2) { touch = null; return; }
            var t = [e.touches[0], e.touches[1]];
            touch = { d: dist(t), m: mid(t) };
        }, { passive: true });
        svg.addEventListener('touchmove', function (e) {
            if (e.touches.length !== 2 || !touch) { return; }
            e.preventDefault();
            var t = [e.touches[0], e.touches[1]];
            var d = dist(t), m = mid(t), r = svg.getBoundingClientRect();
            view.x -= (m.x - touch.m.x) * view.w / r.width;
            view.y -= (m.y - touch.m.y) * view.h / r.height;
            if (touch.d > 0) { zoomAt(touch.d / d, m.x, m.y); } else { apply(); }
            touch.d = d; touch.m = m;
        }, { passive: false });
        svg.addEventListener('touchend', function () { touch = null; }, { passive: true });

        /* ---- keyboard ---- */
        svg.addEventListener('keydown', function (e) {
            var step = view.w * 0.15, handled = true;
            switch (e.key) {
                case 'ArrowLeft':  view.x -= step; break;
                case 'ArrowRight': view.x += step; break;
                case 'ArrowUp':    view.y -= step; break;
                case 'ArrowDown':  view.y += step; break;
                case '+': case '=': zoomCentre(1 / 1.3); return;
                case '-': case '_': zoomCentre(1.3); return;
                case '0': view = { x: START.x, y: START.y, w: START.w, h: START.h }; break;
                default: handled = false;
            }
            if (handled) { e.preventDefault(); apply(); }
        });

        /* ---- aerial layer, fetched only when first switched on ---- */
        var aerial = svg.querySelector('#aerialLayer');
        var credit = document.getElementById('campusCredit');
        var VECTOR_CREDIT = credit ? credit.innerHTML : '';
        // Both licences require attribution: ODbL for the vector data,
        // CC BY 4.0 for the Bavarian orthophoto. Kept short but complete.
        var AERIAL_CREDIT =
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" ' +
            'rel="noopener">OSM</a> &middot; Luftbild <a href="https://geodaten.bayern.de" ' +
            'target="_blank" rel="noopener">BVV</a> ' +
            '<a href="https://creativecommons.org/licenses/by/4.0/deed.de" target="_blank" ' +
            'rel="noopener">CC BY 4.0</a>';

        function setLayer(on, btn) {
            if (on && aerial && !aerial.getAttribute('href')) {
                aerial.setAttribute('href', 'images/campus-aerial.webp');
            }
            if (aerial) { aerial.style.display = on ? '' : 'none'; }
            svg.classList.toggle('is-aerial', on);
            if (credit) { credit.innerHTML = on ? AERIAL_CREDIT : VECTOR_CREDIT; }
            if (btn) {
                btn.setAttribute('aria-pressed', on ? 'true' : 'false');
                btn.textContent = on ? 'MAP' : 'AER';
                btn.setAttribute('aria-label', on ? 'Switch to the map view' : 'Switch to aerial imagery');
            }
        }

        /* ---- buttons ---- */
        host.addEventListener('click', function (e) {
            var b = e.target.closest('[data-map]');
            if (!b) { return; }
            if (b.dataset.map === 'in')  { zoomCentre(1 / 1.4); }
            if (b.dataset.map === 'out') { zoomCentre(1.4); }
            if (b.dataset.map === 'layer') {
                setLayer(b.getAttribute('aria-pressed') !== 'true', b);
            }
            if (b.dataset.map === 'reset') {
                view = { x: START.x, y: START.y, w: START.w, h: START.h };
                apply();
            }
        });
    }
}());
