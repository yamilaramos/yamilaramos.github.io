(() => {
  const giro   = document.getElementById('giro');
  const stage  = giro.querySelector('.escenario');
  const fotos  = [...giro.querySelectorAll('.foto')];
  const N      = fotos.length;   // 4
  const PASOS  = 4;              // vuelta completa: las 4 fotos recorren todas las posiciones
  const VH_POR_PASO = 0.7;       // cuánto scrollear por paso (en alturas de pantalla)
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  let W, H, actual = 0, objetivo = 0;
 
  function medir() {
    W = stage.clientWidth; H = stage.clientHeight;
    giro.style.height = (H + PASOS * H * VH_POR_PASO) + 'px';
    actualizarObjetivo();
  }
 
  function actualizarObjetivo() {
    const recorrido = giro.offsetHeight - H;
    const scrolleado = Math.min(Math.max(-giro.getBoundingClientRect().top, 0), recorrido);
    objetivo = (scrolleado / recorrido) * PASOS;   // t va de 0 a PASOS
  }
 
  // Las 4 posiciones de la referencia (espejadas), como fracciones del escenario:
  // cx, cy = centro · w, h = tamaño
  const SLOTS = [
    { cx:1.07,  cy:0.44,  w:0.30, h:0.20 },  // 0 · pedacito asomando en el margen derecho
    { cx:0.865, cy:0.245, w:0.27, h:0.41 },  // 1 · arriba, pegada al borde
    { cx:0.535, cy:0.415, w:0.40, h:0.41 },  // 2 · medio, más a la izquierda
    { cx:0.805, cy:0.74,  w:0.39, h:0.41 }   // 3 · abajo, grande y pegada al borde
  ];
  const suave = f => f * f * (3 - 2 * f);     // easing entre posiciones
  const mezclar = (a, b, f) => a + (b - a) * f;
 
  // u = posición de la foto en la vuelta (0 a 4). Va de un slot al siguiente: 0→1→2→3→0
  function dibujar(t) {
    fotos.forEach((el, i) => {
      const u = ((i + t) % N + N) % N;
      const k = Math.floor(u), f = suave(u - k);
      const a = SLOTS[k], b = SLOTS[(k + 1) % N];
      const w = mezclar(a.w, b.w, f) * W, h = mezclar(a.h, b.h, f) * H;
      const x = mezclar(a.cx, b.cx, f) * W - w / 2;
      const y = mezclar(a.cy, b.cy, f) * H - h / 2;
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.zIndex = Math.round(u) % N + 1;  // medio sobre la de arriba, la de abajo sobre el medio
    });
  }
 
  // Offset inicial: foto 0 arriba (u=1), foto 1 en el medio (u=2), foto 2 abajo (u=3), foto 3 escondida (u=0)
  const OFFSET = 1;
  const dibujarConOffset = t => dibujar(t + OFFSET);
 
  function loop() {
    actual += (objetivo - actual) * (reducir ? 1 : 0.12); // suavizado
    dibujarConOffset(actual);
    requestAnimationFrame(loop);
  }
 
  addEventListener('scroll', actualizarObjetivo, { passive:true });
  addEventListener('resize', medir);
  medir(); loop();
})();
