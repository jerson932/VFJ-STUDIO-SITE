/* ==========================================================================
   VFJ STUDIO — Temas por temporada
   --------------------------------------------------------------------------
   Cambia los colores y la decoración del sitio según la fecha del visitante:
     · Halloween → todo octubre   (naranja, murciélagos y telaraña)
     · Navidad   → todo diciembre (rojo, luces navideñas y nieve)
     · El resto del año (incluido Año Nuevo) → diseño normal

   CAMBIAR FECHAS: editá la lista TEMPORADAS de abajo (formato MES-DÍA).

   VER UN TEMA SIN ESPERAR LA FECHA: agregá ?tema= al final de la dirección:
     index.html?tema=navidad     → muestra Navidad
     index.html?tema=halloween   → muestra Halloween
     index.html?tema=normal      → muestra el diseño normal
     index.html?tema=auto        → vuelve a usar la fecha
   (La vista previa se mantiene mientras navegás en esa pestaña.)
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Fechas de cada temporada (MES-DÍA, desde/hasta inclusive) ---------- */
  var TEMPORADAS = [
    { tema: 'halloween', desde: '10-01', hasta: '10-31' },
    { tema: 'navidad',   desde: '12-01', hasta: '12-31' }
  ];

  /* ---------- 2. Ajustes de cada tema ---------- */
  var TEMAS = {
    halloween: { barra: '#0F0C11' },
    navidad:   { barra: '#0B100D', luces: ['#FF4B4B', '#3DDC84', '#FFC94D', '#5AB0FF'] }
  };

  /* ---------- 3. Decidir qué tema toca hoy ---------- */
  function vistaPrevia() {
    var p = null;
    try { p = new URLSearchParams(window.location.search).get('tema'); } catch (e) {}
    try {
      if (p) {
        if (p === 'auto') sessionStorage.removeItem('vfj-tema');
        else sessionStorage.setItem('vfj-tema', p);
      } else {
        p = sessionStorage.getItem('vfj-tema');
      }
    } catch (e) {}
    return p === 'auto' ? null : p;
  }

  function temaPorFecha() {
    var d = new Date();
    var hoy = ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    for (var i = 0; i < TEMPORADAS.length; i++) {
      if (hoy >= TEMPORADAS[i].desde && hoy <= TEMPORADAS[i].hasta) return TEMPORADAS[i].tema;
    }
    return null;
  }

  var vista = vistaPrevia();
  var tema = vista ? (TEMAS[vista] ? vista : null) : temaPorFecha();
  if (!tema) return; // diseño normal: no se toca nada

  var cfg = TEMAS[tema];
  document.documentElement.setAttribute('data-tema', tema);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', cfg.barra);

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var chico = window.innerWidth < 640;

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function r1(n) { return Math.round(n * 10) / 10; }

  /* ---------- 4. Capa de decoración (no bloquea clics) ---------- */
  function capa() {
    var c = document.createElement('div');
    c.className = 'tm-capa';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    return c;
  }

  /* ===== HALLOWEEN ===== */
  var MURC = 'M32 9 L34.5 5.5 L34.2 10.8 L37 12 Q48 4 62 8 Q57 10 56 15 Q53 12 50 18 Q46 15 43 21 ' +
             'Q40 18 37 20 Q35 23 32 26 Q29 23 27 20 Q24 18 21 21 Q18 15 14 18 Q11 12 8 15 ' +
             'Q7 10 2 8 Q16 4 27 12 L29.8 10.8 L29.5 5.5 Z';

  function murcielagos(c) {
    var n = chico ? 3 : 6;
    for (var i = 0; i < n; i++) {
      var b = document.createElement('div');
      b.className = 'tm-murc' + (i % 2 ? ' izq' : '');
      b.style.top = r1(rnd(12, 78)) + 'vh';
      b.style.width = r1(rnd(30, 54)) + 'px';
      b.style.animationDuration = r1(rnd(18, 32)) + 's';
      b.style.animationDelay = '-' + r1(rnd(0, 30)) + 's';
      b.innerHTML =
        '<div class="tm-murc-ola" style="animation-duration:' + r1(rnd(2.6, 4.4)) + 's">' +
          '<svg viewBox="0 0 64 32" style="animation-duration:' + r1(rnd(.18, .3)) + 's"><path d="' + MURC + '"/></svg>' +
        '</div>';
      c.appendChild(b);
    }
  }

  function telarana(c) {
    // Telaraña anclada en la esquina superior derecha (100,0)
    var angs = [0, 16, 33, 52, 71, 90], radios = [20, 40, 61, 82, 100], d = '';
    function p(r, a) {
      var t = a * Math.PI / 180;
      return r1(100 - r * Math.cos(t)) + ' ' + r1(r * Math.sin(t));
    }
    angs.forEach(function (a) { d += 'M100 0 L' + p(104, a) + ' '; });
    radios.forEach(function (r) {
      d += 'M' + p(r, angs[0]) + ' ';
      for (var i = 1; i < angs.length; i++) {
        d += 'Q' + p(r * 0.86, (angs[i - 1] + angs[i]) / 2) + ' ' + p(r, angs[i]) + ' ';
      }
    });
    var w = document.createElement('div');
    w.className = 'tm-tela';
    w.innerHTML =
      '<svg viewBox="0 0 100 160"><path class="tm-hilos" d="' + d + '"/>' +
        '<g class="tm-arana">' +
          '<line x1="68" y1="-60" x2="68" y2="104"/>' +
          '<path class="tm-patas" d="M64 106 L57 101 M64 108 L56 108 M64 110 L57 115 M72 106 L79 101 M72 108 L80 108 M72 110 L79 115"/>' +
          '<ellipse cx="68" cy="109" rx="4.6" ry="5.6"/><circle cx="68" cy="103" r="3"/>' +
        '</g>' +
      '</svg>';
    c.appendChild(w);
  }

  /* ===== NAVIDAD ===== */
  function luces(colores) {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var box = document.createElement('div');
    box.className = 'tm-luces';
    box.setAttribute('aria-hidden', 'true');
    nav.appendChild(box);

    var ancho = 0;
    function pintar() {
      var w = nav.clientWidth;
      if (w === ancho) return;
      ancho = w;
      var seg = chico ? 70 : 92, cy = 26, d = 'M0 0', html = '', k = 0;
      for (var x0 = 0; x0 < w; x0 += seg) {
        d += ' Q' + (x0 + seg / 2) + ' ' + cy + ' ' + (x0 + seg) + ' 0';
        [1 / 3, 2 / 3].forEach(function (t) {
          var x = x0 + t * seg, y = 2 * (1 - t) * t * cy;
          html += '<i style="left:' + r1(x) + 'px;top:' + r1(y) + 'px;--c:' + colores[k % colores.length] +
                  ';animation-delay:-' + r1(rnd(0, 3)) + 's;animation-duration:' + r1(rnd(1.8, 3.4)) + 's"></i>';
          k++;
        });
      }
      box.innerHTML = '<svg class="tm-cable" width="' + w + '" height="30" viewBox="0 0 ' + w + ' 30"><path d="' + d + '"/></svg>' + html;
    }
    pintar();
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(pintar, 150); });
  }

  function nieve(c) {
    var n = chico ? 26 : 55;
    for (var i = 0; i < n; i++) {
      var f = document.createElement('i');
      var s = rnd(2, 6);
      f.className = 'tm-copo';
      f.style.left = r1(rnd(0, 100)) + '%';
      f.style.animationDuration = r1(rnd(11, 24)) + 's';
      f.style.animationDelay = '-' + r1(rnd(0, 24)) + 's';
      f.innerHTML = '<b style="width:' + r1(s) + 'px;height:' + r1(s) + 'px;opacity:' + r1(rnd(.35, .9)) +
                    ';animation-duration:' + r1(rnd(3, 6)) + 's;animation-delay:-' + r1(rnd(0, 6)) + 's' +
                    (s > 4.6 ? ';filter:blur(1px)' : '') + '"></b>';
      c.appendChild(f);
    }
  }

  /* ---------- 5. Poner la decoración cuando la página está lista ---------- */
  function decorar() {
    if (tema === 'halloween') {
      var c = capa();
      telarana(c);
      if (!reduce) murcielagos(c);
    }
    if (tema === 'navidad') {
      luces(cfg.luces);
      if (!reduce) nieve(capa());
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorar);
  else decorar();
})();
