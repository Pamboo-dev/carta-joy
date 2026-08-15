/* ==========================================================================
   Carta Joy Wake Park — comportamiento
   El contenido ya viene renderizado en el HTML: este script solo agrega
   la capa de navegación (portada animada, barra fija, scroll spy, índice).
   ========================================================================== */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Portada: cruce lento entre escenas ------------------------------ */

  (function coverStage() {
    var frames = Array.prototype.slice.call(
      document.querySelectorAll('.cover__frame')
    );
    if (!frames.length) return;

    var cover = document.querySelector('.cover');
    if (frames.length < 2 || reduce.matches || !cover) return;

    cover.classList.add('is-cycling');
    frames[0].classList.add('is-live');

    var i = 0;
    var timer = null;

    // Las escenas siguientes se piden recién cuando la página ya cargó, para
    // no competir con la primera foto ni con las tipografías.
    function hydrate() {
      frames.forEach(function (f) {
        var src = f.getAttribute('data-src');
        if (!src) return;
        f.setAttribute('src', src);
        f.removeAttribute('data-src');
      });
    }

    if (document.readyState === 'complete') {
      hydrate();
    } else {
      window.addEventListener('load', hydrate);
    }

    function advance() {
      var next = (i + 1) % frames.length;
      // Si la escena todavía no llegó se saltea el turno: nunca se funde a negro.
      if (!frames[next].complete || frames[next].naturalWidth === 0) return;
      frames[i].classList.remove('is-live');
      i = next;
      frames[i].classList.add('is-live');
    }

    function start() {
      if (timer === null) timer = window.setInterval(advance, 6200);
    }
    function stop() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    // Solo anima mientras la portada está a la vista y la pestaña activa.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        function (entries) {
          entries[0].isIntersecting ? start() : stop();
        },
        { threshold: 0.01 }
      ).observe(cover);
    } else {
      start();
    }

    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
  })();

  /* ---- Barra fija: aparece al dejar la portada ------------------------- */

  var rail = document.querySelector('.rail');
  var railNow = document.querySelector('.rail__now');

  (function railToggle() {
    var cover = document.querySelector('.cover');
    if (!rail || !cover || !('IntersectionObserver' in window)) return;

    new IntersectionObserver(
      function (entries) {
        rail.classList.toggle('is-shown', !entries[0].isIntersecting);
      },
      { rootMargin: '-72% 0px 0px 0px', threshold: 0 }
    ).observe(cover);
  })();

  /* ---- Scroll spy ------------------------------------------------------ */

  (function scrollSpy() {
    var chapters = Array.prototype.slice.call(
      document.querySelectorAll('.chapter[id]')
    );
    if (!chapters.length || !('IntersectionObserver' in window)) return;

    var links = Array.prototype.slice.call(document.querySelectorAll('[data-goto]'));
    var visible = new Set();
    var current = '';

    function paint(id) {
      if (id === current) return;
      current = id;

      var chapter = document.getElementById(id);
      var name = chapter ? chapter.getAttribute('data-name') : '';

      if (railNow && name) {
        railNow.classList.add('is-swapping');
        window.setTimeout(
          function () {
            railNow.textContent = name;
            railNow.classList.remove('is-swapping');
          },
          reduce.matches ? 0 : 180
        );
      }

      links.forEach(function (a) {
        var on = a.getAttribute('data-goto') === id;
        if (on) {
          a.setAttribute('aria-current', 'true');
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }

    function resolve() {
      // Con varios capítulos en pantalla gana el que está más arriba.
      var best = '';
      var bestTop = Infinity;
      visible.forEach(function (id) {
        var top = document.getElementById(id).getBoundingClientRect().top;
        if (top < bestTop) {
          bestTop = top;
          best = id;
        }
      });

      // Si ninguno cruza la franja central —al llegar al pie del documento—
      // se toma el último que haya quedado por encima.
      if (!best) {
        var line = window.innerHeight * 0.55;
        chapters.forEach(function (c) {
          if (c.getBoundingClientRect().top <= line) best = c.id;
        });
      }

      if (best) paint(best);
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          entry.isIntersecting ? visible.add(id) : visible.delete(id);
        });
        resolve();
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    chapters.forEach(function (c) {
      io.observe(c);
    });

    // Un salto directo (enlace con ancla, o scroll restaurado al volver) puede
    // no cambiar ninguna intersección y por lo tanto no disparar el observer.
    window.addEventListener('hashchange', resolve);
    window.addEventListener('pageshow', resolve);
    requestAnimationFrame(resolve);
  })();

  /* ---- Hoja de índice -------------------------------------------------- */

  (function indexSheet() {
    var sheet = document.getElementById('sheet');
    var open = document.getElementById('sheet-open');
    var close = document.getElementById('sheet-close');
    if (!sheet || !open || !close) return;

    var lastFocus = null;

    function setOpen(on) {
      sheet.classList.toggle('is-open', on);
      sheet.setAttribute('aria-hidden', String(!on));
      open.setAttribute('aria-expanded', String(on));
      document.body.classList.toggle('is-locked', on);

      if (on) {
        var active = document.activeElement;
        // Si el foco estaba en el <body>, volver ahí no sirve: se usa el botón.
        lastFocus = active && active !== document.body ? active : open;
        close.focus();
      } else {
        (lastFocus || open).focus();
      }
    }

    open.addEventListener('click', function () {
      setOpen(true);
    });
    close.addEventListener('click', function () {
      setOpen(false);
    });

    sheet.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !sheet.classList.contains('is-open')) return;
      setOpen(false);
    });

    // Retención del foco dentro de la hoja abierta.
    sheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusables = sheet.querySelectorAll('a[href], button');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  })();

  /* ---- Aparición de capítulos ------------------------------------------ */

  (function reveal() {
    var targets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!targets.length) return;

    // Sin observer o con movimiento reducido no se oculta nada: se deja el
    // contenido tal como lo entrega el HTML.
    if (reduce.matches || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('js-reveal');

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    targets.forEach(function (el) {
      io.observe(el);
    });
  })();
})();
