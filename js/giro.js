(() => {
  const hero  = document.getElementById('inicio');
  const giro  = document.getElementById('giro');
  if (!hero || !giro) return;

  const stage = giro.querySelector('.escenario');
  const fotos = [...giro.querySelectorAll('.foto')];
  const N     = fotos.length;                 // 4 fotos
  const PASOS = 3;                            // 3 scrolls = 3 rotaciones → se ven las 4 fotos
  const html  = document.documentElement;

  const reducir    = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const escritorio = matchMedia('(min-width: 769px)');  // en mobile no se bloquea: queda el mosaico quieto
  const DURACION = reducir ? 0 : 1000;        // ms que dura cada rotación
  const ESPERA   = 400;                       // ms de pausa después de cada rotación (frena la inercia del trackpad)
  const TOL      = 2;                         // px de tolerancia para considerar que estamos arriba de todo

  let W, H, paso = 0, actual = 0, anim = 0, ocupadoHasta = 0, estabaArriba = true;

  // Las 4 posiciones (espejadas) como fracciones del escenario: cx, cy = centro · w, h = tamaño
  const SLOTS = [
    { cx:1.07,  cy:0.44, w:0.40, h:0.20 },
    { cx:0.865, cy:0.50, w:0.40, h:1.00 },
    { cx:0.535, cy:0.50, w:0.40, h:1.00 },
    { cx:0.805, cy:0.50, w:0.40, h:1.00 }
  ];
  const OFFSET  = 1;                          // foto 0 arriba, foto 1 medio, foto 2 abajo, foto 3 escondida
  const suave   = f => f * f * (3 - 2 * f);   // easing entre posiciones
  const mezclar = (a, b, f) => a + (b - a) * f;

  // u = posición de la foto en la vuelta (0 a 4). Va de un slot al siguiente: 0→1→2→3→0
  function dibujar(t) {
    fotos.forEach((el, i) => {
      const u = (((i + t + OFFSET) % N) + N) % N;
      const k = Math.floor(u), f = suave(u - k);
      const a = SLOTS[k], b = SLOTS[(k + 1) % N];
      const w = mezclar(a.w, b.w, f) * W, h = mezclar(a.h, b.h, f) * H;
      const x = mezclar(a.cx, b.cx, f) * W - w / 2;
      const y = mezclar(a.cy, b.cy, f) * H - h / 2;
      el.style.width  = w + 'px';
      el.style.height = h + 'px';
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.zIndex = Math.round(u) % N + 1;   // medio sobre la de arriba, la de abajo sobre el medio
    });
  }

  const arriba = () => scrollY <= TOL;

  // Mientras el giro no terminó, la página no se puede mover (ni con rueda, teclas, barra o touch)
  function actualizarBloqueo() {
    const bloquear = escritorio.matches && arriba() && paso < PASOS;
    html.style.overflow = bloquear ? 'hidden' : '';
  }

  function ir(nuevo) {
    paso = nuevo;
    html.style.overflow = 'hidden';            // bloqueado durante toda la animación
    ocupadoHasta = Infinity;
    cancelAnimationFrame(anim);
    const desde = actual, inicio = performance.now();
    const tick = ahora => {
      const p = DURACION ? Math.min((ahora - inicio) / DURACION, 1) : 1;
      actual = desde + (nuevo - desde) * p;
      dibujar(actual);
      if (p < 1) { anim = requestAnimationFrame(tick); return; }
      ocupadoHasta = performance.now() + ESPERA;
      setTimeout(actualizarBloqueo, ESPERA);   // si ya hizo los 3 scrolls, recién ahí se libera la página
    };
    anim = requestAnimationFrame(tick);
  }

  // dir = +1 (scroll hacia abajo) o -1 (hacia arriba)
  function intentar(dir) {
    if (!escritorio.matches || !arriba()) return;
    if (performance.now() < ocupadoHasta) return;
    const nuevo = paso + dir;
    if (nuevo < 0 || nuevo > PASOS) return;    // fuera de rango: la página se mueve normal
    ir(nuevo);
  }

  addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) < 2) return;
    intentar(e.deltaY > 0 ? 1 : -1);
  }, { passive: true });

  addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) intentar(1);
    else if (['ArrowUp', 'PageUp'].includes(e.key)) intentar(-1);
  });

  let y0 = null;                               // swipe en pantallas táctiles
  addEventListener('touchstart', e => { y0 = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', e => {
    if (y0 === null) return;
    const d = y0 - e.changedTouches[0].clientY; y0 = null;
    if (Math.abs(d) > 40) intentar(d > 0 ? 1 : -1);
  }, { passive: true });

  addEventListener('scroll', () => {
    const ahoraArriba = arriba();
    // Si vuelve arriba scrolleando, esperar un poco para que la inercia no rebobine el giro
    if (ahoraArriba && !estabaArriba) ocupadoHasta = Math.max(ocupadoHasta, performance.now() + 500);
    estabaArriba = ahoraArriba;
    // Si saltó más abajo (link del menú, recarga a mitad de página), el giro se da por terminado
    if (!ahoraArriba && paso < PASOS) { paso = PASOS; actual = PASOS; dibujar(actual); }
    actualizarBloqueo();
  }, { passive: true });

  function medir() { W = stage.clientWidth; H = stage.clientHeight; dibujar(actual); actualizarBloqueo(); }
  addEventListener('resize', medir);
  addEventListener('load', medir);
  escritorio.addEventListener('change', medir);

  if (!arriba()) { paso = PASOS; actual = PASOS; estabaArriba = false; }
  medir();
})();
