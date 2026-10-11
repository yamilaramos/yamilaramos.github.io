document.addEventListener("DOMContentLoaded", () => {
  const hamburguesa = document.getElementById("hamburguesa");
  const nav = document.querySelector("nav");
  const links = document.querySelectorAll("nav a");
  const backToTop = document.getElementById("backToTop");

  /*
   * IMÁGENES POR TEMA — EDITÁ LAS RUTAS ACÁ.
   * Poné la ruta de cada imagen dentro de "musgo" u "océano".
   * Dejá "" si querés conservar la imagen original en ese tema.
   *
   * Para sumar otra imagen:
   * 1. Agregá una entrada con su selector CSS y su ruta original.
   * 2. Completá las rutas "musgo" y "océano" si querés reemplazos.
   * Las rutas empiezan desde la raíz del sitio, por ejemplo: "/img/mi-imagen.jpg".
   *
   * Imágenes preparadas:
   * - titulo: imagen de título del inicio.
   * - mockupProceso: imágenes del proceso creativo.
   * - mockupStack: mockup principal de la sección Stack.
   */
  const themeImageConfig = [
    {
      nombre: "titulo",
      selector: "img.titulo",
      original: "/img/titulo-3.png",
      musgo: "", // Ejemplo: "/img/tema-musgo/titulo.png"
      océano: "" // Ejemplo: "/img/tema-oceano/titulo.png"
    },
    {
      nombre: "mockupProceso",
      selector: 'img[src="img/mockup-proceso.png"]',
      original: "img/mockup-proceso.png",
      musgo: "", // Ejemplo: "/img/tema-musgo/proceso.png"
      océano: "" // Ejemplo: "/img/tema-oceano/proceso.png"
    },
    {
      nombre: "mockupStack",
      selector: "img.mk-base",
      original: "./img/stack-mockup-after.png",
      musgo: "", // Ejemplo: "/img/tema-musgo/stack.png"
      océano: "" // Ejemplo: "/img/tema-oceano/stack.png"
    }
  ];

  const themeButtons = [...document.querySelectorAll(".hero-theme-switcher__button")];
  if (themeButtons.length) {
    const availableThemes = new Set(themeButtons.map(button => button.dataset.themeChoice));
    const storageKey = "yamila-portfolio-theme";
    const applyTheme = (theme, persist = false) => {
      if (!availableThemes.has(theme)) return;

      document.documentElement.dataset.theme = theme;

      // Actualiza solo las imágenes con una ruta definida para el tema elegido.
      themeImageConfig.forEach(imageConfig => {
        const image = document.querySelector(imageConfig.selector);
        if (!image) return;

        const source = imageConfig[theme] || imageConfig.original;
        if (source) image.setAttribute("src", source);
      });

      themeButtons.forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
      });

      if (persist) {
        try {
          window.localStorage.setItem(storageKey, theme);
        } catch {
          // El cambio de tema sigue funcionando si el navegador bloquea el almacenamiento.
        }
      }
    };

    let initialTheme = "original";
    try {
      const savedTheme = window.localStorage.getItem(storageKey);
      if (availableThemes.has(savedTheme)) initialTheme = savedTheme;
    } catch {
      // La página conserva el tema original si el almacenamiento no está disponible.
    }

    applyTheme(initialTheme);
    themeButtons.forEach(button => {
      button.addEventListener("click", () => applyTheme(button.dataset.themeChoice, true));
    });
  }

  // El botón de menú no existe en todas las versiones del HTML.
  if (hamburguesa && nav) {
    const actualizarEstadoMenu = (abierto) => {
      hamburguesa.setAttribute("aria-expanded", String(abierto));
      hamburguesa.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    };

    hamburguesa.addEventListener("click", () => {
      const abierto = nav.classList.toggle("active");
      hamburguesa.classList.toggle("active", abierto);
      document.body.classList.toggle("menu-open", abierto);
      document.documentElement.classList.toggle("menu-open", abierto);
      actualizarEstadoMenu(abierto);
    });

    links.forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        hamburguesa.classList.remove("active");
        document.body.classList.remove("menu-open");
        document.documentElement.classList.remove("menu-open");
        actualizarEstadoMenu(false);
      });
    });
  }

  // Revelar elementos al entrar en el viewport.
  const elements = document.querySelectorAll(
    '.scroll-fade-down, .scroll-fade-modern, .scroll-fade-modern-2'
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active", "show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    elements.forEach(element => observer.observe(element));
  } else {
    elements.forEach(element => element.classList.add("active", "show"));
  }

  // Botón para volver arriba.
  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("show", window.scrollY > 400);
    };

    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Entrada inicial del hero si el elemento está presente.
  const element = document.querySelector(".fade-modern-load");
  if (element) {
    setTimeout(() => element.classList.add("active"), 400);
  }
});

const tieneHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const cursor = document.getElementById("cursor");

if (cursor && tieneHover) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
    });

    const interactiveSelectors = "a, button, [data-cursor-hover]";

    document.addEventListener("mouseover", (event) => {
        if (event.target.tagName === "IMG") return;

        if (event.target.closest(interactiveSelectors)) {
            cursor.classList.add("is-hovering");
        }

        if (event.target.closest("a")) {
            cursor.classList.add("is-link");
        }

        if (event.target.closest("header nav")) {
            cursor.classList.add("in-header");
        }
    });

    document.addEventListener("mouseout", (event) => {
        if (event.target.tagName === "IMG") return;

        if (event.target.closest(interactiveSelectors)) {
            cursor.classList.remove("is-hovering");
        }

        if (event.target.closest("a")) {
            cursor.classList.remove("is-link");
        }

        if (event.target.closest("header nav")) {
            cursor.classList.remove("in-header");
        }
    });

    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        cursor.style.opacity = "1";
    });
}

(() => {
  const header = document.querySelector("header");
  if (!header) return;

  const UMBRAL = 40;
  const UMBRAL_DIRECCION = 4;
  let lastScrollY = window.scrollY;
  let scrollDirection = 0;
  let directionStartY = lastScrollY;
  let directionThreshold = UMBRAL_DIRECCION;

  const getHalfSectionHeight = () => {
    const midpoint = window.innerHeight / 2;
    const sections = [...document.querySelectorAll("main section")]
      .filter(section => section.offsetHeight > 0);

    if (!sections.length) return window.innerHeight / 2;

    const activeSection = sections.find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= midpoint && rect.bottom >= midpoint;
    });

    const section = activeSection || sections.reduce((nearest, candidate) => {
      const rect = candidate.getBoundingClientRect();
      const distance = midpoint < rect.top
        ? rect.top - midpoint
        : midpoint > rect.bottom
          ? midpoint - rect.bottom
          : 0;
      return !nearest || distance < nearest.distance
        ? { element: candidate, distance }
        : nearest;
    }, null)?.element;

    return Math.max(UMBRAL_DIRECCION, (section?.offsetHeight || window.innerHeight) / 2);
  };

  const onScroll = () => {
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - lastScrollY;
    const wasAtTop = lastScrollY <= UMBRAL;
    lastScrollY = currentY;

    const isScrolled = currentY > UMBRAL;
    header.classList.toggle("scrolled", isScrolled);

    if (!isScrolled) {
      header.classList.remove("scroll-hidden", "scroll-revealing", "scroll-initial-hidden");
      scrollDirection = 0;
      directionStartY = currentY;
      return;
    }

    if (delta === 0) return;

    const nextDirection = Math.sign(delta);
    if (nextDirection !== scrollDirection) {
      scrollDirection = nextDirection;
      directionStartY = wasAtTop ? UMBRAL : currentY - delta;
      directionThreshold = scrollDirection < 0
        ? getHalfSectionHeight()
        : UMBRAL_DIRECCION;
    }

    const crossedTopWhileScrollingDown = scrollDirection > 0 && wasAtTop;
    if (Math.abs(currentY - directionStartY) < directionThreshold && !crossedTopWhileScrollingDown) return;

    if (crossedTopWhileScrollingDown) {
      header.classList.add("scroll-hidden", "scroll-initial-hidden");
      header.classList.remove("scroll-revealing");
    } else {
      const isScrollingUp = scrollDirection < 0;
      header.classList.toggle("scroll-hidden", !isScrollingUp);
      header.classList.toggle("scroll-revealing", isScrollingUp);
      header.classList.remove("scroll-initial-hidden");
    }
    directionStartY = currentY;
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

(() => {
  const section = document.querySelector("#proceso");
  if (!section) return;

  const dividers = [...section.querySelectorAll(".proceso")];
  if (!dividers.length) return;

  let frame = 0;
  const alignDividersToPixels = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const pixelRatio = window.devicePixelRatio || 1;
      dividers.forEach(divider => {
        const documentY = divider.getBoundingClientRect().top + window.scrollY;
        const snappedY = Math.round(documentY * pixelRatio) / pixelRatio;
        divider.style.setProperty("--proceso-divider-offset", String(snappedY - documentY) + "px");
      });
    });
  };

  alignDividersToPixels();
  window.addEventListener("resize", alignDividersToPixels, { passive: true });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(alignDividersToPixels);
    observer.observe(section);
    dividers.forEach(divider => observer.observe(divider));
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(alignDividersToPixels);
  }
})();
