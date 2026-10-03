(() => {
  const pin   = document.getElementById('heroPin');   // contenedor alto (lo agranda este script)
  const hero  = document.getElementById('inicio');    // la sección que queda fija (sticky)
  const giro  = document.getElementById('giro');
  if (!pin || !hero || !giro) return;
 
  const stage = giro.querySelector('.escenario');
  const fotos = [...giro.querySelectorAll('.foto')];
  const N     = fotos.length;          // 4
  const PASOS = 4;                     // cuántos "scrolls" hay antes de seguir a la siguiente sección
  const VH_POR_PASO = 0.8;             // cuánto hay que scrollear por paso (en alturas de pantalla)
 
  const reducir   = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const escritorio = matchMedia('(min-width: 769px)');  // en mobile no se fija: queda el mosaico quieto
 
  let W, H, pinTop = 0, actual = 0, objetivo = 0, sucio = true;
 
  // Las 4 posiciones (espejadas) como fracciones del escenario: cx, cy = centro · w, h = tamaño
  const SLOTS = [
    { cx:1.07,  cy:0.44,  w:0.30, h:0.20 },  // 0 · pedacito asomando en el margen derecho
    { cx:0.865, cy:0.245, w:0.27, h:0.41 },  // 1 · arriba, pegada al borde
    { cx:0.535, cy:0.415, w:0.40, h:0.41 },  // 2 · medio, más a la izquierda
    { cx:0.805, cy:0.74,  w:0.39, h:0.41 }   // 3 · abajo, grande y pegada al borde
  ];
  const OFFSET  = 1;                          // foto 0 arriba, foto 1 medio, foto 2 abajo, foto 3 escondida
  const suave   = f => f * f * (3 - 2 * f);   // easing entre posiciones
  const mezclar = (a, b, f) => a + (b - a) * f;
 
  function medir() {
    W = stage.clientWidth;
    H = stage.clientHeight;
    if (escritorio.matches) {
      // El hero se queda fijo justo debajo del header (top lo define el CSS)
      pinTop = parseFloat(getComputedStyle(hero).top) || 0;
      // Altura total = alto del hero + lo que hay que scrollear para los 4 pasos
      pin.style.height = (hero.offsetHeight + PASOS * VH_POR_PASO * innerHeight) + 'px';
    } else {
      pin.style.height = '';
    }
    actualizarObjetivo();
    sucio = true;
  }
 
  function actualizarObjetivo() {
    if (!escritorio.matches) { objetivo = 0; return; }
    const recorrido = pin.offsetHeight - hero.offsetHeight;
    if (recorrido <= 0) { objetivo = 0; return; }
    // El hero se pega cuando el borde de arriba del contenedor llega a pinTop
    const scrolleado = Math.min(Math.max(pinTop - pin.getBoundingClientRect().top, 0), recorrido);
    objetivo = (scrolleado / recorrido) * PASOS;   // va de 0 a PASOS
  }
 
  // u = posición de la foto en la vuelta (0 a 4). Va de un slot al siguiente: 0→1→2→3→0
  function dibujar(t) {
    fotos.forEach((el, i) => {
      const u = ((i + t) % N + N) % N;
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
 
  function loop() {
    const d = objetivo - actual;
    if (sucio || Math.abs(d) > 0.0005) {
      actual = (reducir || Math.abs(d) < 0.0005) ? objetivo : actual + d * 0.12;  // suavizado
      dibujar(actual + OFFSET);
      sucio = false;
    }
    requestAnimationFrame(loop);
  }
 
  addEventListener('scroll', actualizarObjetivo, { passive: true });
  addEventListener('resize', medir);
  addEventListener('load', medir);            // por si el alto del hero cambia al cargar imágenes/fuentes
  escritorio.addEventListener('change', medir);
 
  medir();
  actual = objetivo;                          // si recargan a mitad de página, no arranca desde cero
  loop();
})();
 
