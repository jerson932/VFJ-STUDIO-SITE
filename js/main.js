/* ==========================================================================
   VFJ STUDIO — Comportamiento del sitio
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Menú en pantallas pequeñas ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Aparición progresiva al hacer scroll ---------- */
  var revealables = document.querySelectorAll('.rv');
  if (revealables.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('in'); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealables.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ======================================================================
     GALERÍA — hoja de contactos con filtros y visor ampliado
     ====================================================================== */
  var sheet = document.getElementById('sheet');
  if (sheet && typeof PHOTOS !== 'undefined') {
    var current = 'todo';
    var shown = [];

    function build(cat) {
      current = cat;
      shown = (cat === 'todo') ? PHOTOS : PHOTOS.filter(function (p) { return p.c === cat; });
      sheet.innerHTML = '';
      shown.forEach(function (p, i) {
        var fig = document.createElement('figure');
        fig.className = 'frame';
        fig.style.animationDelay = Math.min(i * 28, 520) + 'ms';
        fig.setAttribute('role', 'button');
        fig.setAttribute('tabindex', '0');
        fig.setAttribute('aria-label', p.l + ', ampliar imagen');
        fig.dataset.i = i;
        fig.innerHTML =
          '<img src="images/thumb/' + p.f + '" alt="' + p.l + ' — VFJ Studio" loading="lazy" decoding="async">' +
          '<figcaption class="frame-tag"><i>FR.' + p.r + '</i> &nbsp;' + p.l + '</figcaption>';
        fig.addEventListener('click', function () { openViewer(i); });
        fig.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openViewer(i); }
        });
        sheet.appendChild(fig);
      });
      var counter = document.getElementById('sheetCount');
      if (counter) counter.textContent = String(shown.length).padStart(2, '0');
    }

    document.querySelectorAll('.filter').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.filter').forEach(function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
        build(b.dataset.cat);
      });
    });

    /* --- Visor --- */
    var viewer = document.getElementById('viewer');
    var vImg = document.getElementById('viewerImg');
    var vRef = document.getElementById('viewerRef');
    var vLab = document.getElementById('viewerLabel');
    var vPos = document.getElementById('viewerPos');
    var idx = 0;

    function openViewer(i) {
      idx = i;
      paint();
      viewer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      document.getElementById('viewerClose').focus();
    }
    function closeViewer() {
      viewer.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    function paint() {
      var p = shown[idx];
      vImg.src = 'images/' + p.f;
      vImg.alt = p.l + ' — VFJ Studio';
      vRef.textContent = 'FR.' + p.r;
      vLab.textContent = p.l;
      vPos.textContent = (idx + 1) + ' / ' + shown.length;
    }
    function step(d) {
      idx = (idx + d + shown.length) % shown.length;
      paint();
    }

    if (viewer) {
      document.getElementById('viewerClose').addEventListener('click', closeViewer);
      document.getElementById('viewerPrev').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
      document.getElementById('viewerNext').addEventListener('click', function (e) { e.stopPropagation(); step(1); });
      viewer.addEventListener('click', function (e) { if (e.target === viewer) closeViewer(); });
      document.addEventListener('keydown', function (e) {
        if (!viewer.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
      });
      /* Deslizar con el dedo */
      var x0 = null;
      viewer.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      viewer.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
        x0 = null;
      }, { passive: true });
    }

    build('todo');
  }

  /* ======================================================================
     REPRODUCTORES — el preview corre solo cuando está a la vista
     ====================================================================== */
  document.querySelectorAll('[data-goto="full"]').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.closest('.reel-item');
      if (item) { var t = item.querySelector('.player [data-act="full"]'); if (t) t.click(); }
    });
  });

  var players = document.querySelectorAll('.player');
  if (players.length) {
    if ('IntersectionObserver' in window && !reduce) {
      var vo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target.querySelector('video');
          if (!v) return;
          if (en.isIntersecting) {
            if (!v.dataset.full) { var pr = v.play(); if (pr) pr.catch(function () { }); }
          } else {
            v.pause();
          }
        });
      }, { threshold: 0.3 });
      players.forEach(function (p) { vo.observe(p); });
    }

    players.forEach(function (p) {
      var v = p.querySelector('video');
      var slug = p.dataset.slug;
      var btnPlay = p.querySelector('[data-act="full"]');
      var btnSound = p.querySelector('[data-act="sound"]');
      if (!v) return;

      /* Ver la versión completa con sonido */
      function goFull() {
        if (v.dataset.full) return;
        v.dataset.full = '1';
        v.src = 'videos/' + slug + '.mp4';
        v.loop = false;
        v.muted = false;
        v.controls = true;
        v.load();
        var pr = v.play(); if (pr) pr.catch(function () { v.muted = true; v.play(); });
        p.classList.add('is-full');
        var badge = p.querySelector('.player-badge');
        if (badge) badge.style.display = 'none';
        var ctrl = p.querySelector('.player-ctrl');
        if (ctrl) ctrl.style.display = 'none';
      }
      if (btnPlay) btnPlay.addEventListener('click', goFull);
      v.addEventListener('click', function () { if (!v.dataset.full) goFull(); });

      /* Silenciar / activar audio del preview */
      if (btnSound) {
        btnSound.addEventListener('click', function (e) { e.stopPropagation(); goFull(); });
      }
    });
  }

  /* ======================================================================
     FORMULARIO DE COTIZACIÓN — envío sin recargar la página
     ====================================================================== */
  var form = document.getElementById('quoteForm');
  if (form) {
    var msg = document.getElementById('formMsg');
    var btn = form.querySelector('button[type="submit"]');
    var btnTxt = btn ? btn.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      msg.className = 'form-msg';
      msg.textContent = '';
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) {
            msg.className = 'form-msg ok';
            msg.textContent = 'Solicitud enviada. Te respondemos por correo o WhatsApp dentro de 24 horas.';
            form.reset();
          } else {
            throw new Error(d.message || 'error');
          }
        })
        .catch(function () {
          msg.className = 'form-msg err';
          msg.innerHTML = 'No se pudo enviar. Escríbenos por WhatsApp al ' +
            '<a href="https://wa.me/50242373645" style="color:inherit;text-decoration:underline">4237-3645</a> ' +
            'o a jersonmelendez123@gmail.com';
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = btnTxt; }
        });
    });
  }

  /* ---------- Año en el pie ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

})();
