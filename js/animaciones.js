document.addEventListener("DOMContentLoaded", () => {
  const hamburguesa = document.getElementById("hamburguesa");
  const nav = document.querySelector("nav");
  const links = document.querySelectorAll("nav a");
  const backToTop = document.getElementById("backToTop");

  /*
   * IMÁGENES POR TEMA — EDITÁ LAS RUTAS ACÁ.
   * Para cada imagen, completá "musgo" y/o "océano" con la ruta del archivo.
   * Dejá "" para que ese tema use la imagen original.
   * Subí primero los archivos a la carpeta img del repositorio.
   *
   * Para imágenes <img> se cambia "src".
   * Para imágenes de fondo (background) se cambia la imagen de fondo del elemento.
   */
  const themeImageConfig = [
    {
      nombre: "logoNav",
      selector: ".header-brand .logo-portafolio img",
      tipo: "src",
      original: "../img/texto-portafolio.png",
      musgo: "", // Ejemplo: "/img/tema-musgo/logo-nav.png"
      océano: "" // Ejemplo: "/img/tema-oceano/logo-nav.png"
    },
    {
      nombre: "heroPrincipal",
      selector: "#inicio.hero",
      tipo: "background",
      original: "../img/hero-final.png",
      musgo: "", // Ejemplo: "/img/tema-musgo/hero-principal.png"
      océano: "" // Ejemplo: "/img/tema-oceano/hero-principal.png"
    },
    {
      nombre: "heroSobreMi",
      selector: ".hero-sobremi",
      tipo: "background",
      original: "../img/hero-sobremi.png",
      musgo: "", // Ejemplo: "/img/tema-musgo/hero-sobremi.png"
      océano: "" // Ejemplo: "/img/tema-oceano/hero-sobremi.png"
    },
    {
      nombre: "heroStack",
      selector: ".stack-hero-panel",
      tipo: "background",
      original: "../img/stack-hero.png",
      musgo: "", // Ejemplo: "/img/tema-musgo/hero-stack.png"
      océano: "" // Ejemplo: "/img/tema-oceano/hero-stack.png"
    },
    {
      nombre: "heroProyectoMateria",
      selector: ".hero-materia",
      tipo: "background",
      original: "../img/hero-materia.png",
      musgo: "", // Ejemplo: "/img/tema-musgo/hero-materia.png"
      océano: "" // Ejemplo: "/img/tema-oceano/hero-materia.png"
    },
    {
      nombre: "heroProyectoADA",
      selector: ".hero-ada",
      tipo: "background",
      original: "../img/hero-ada.png",
      musgo: "", // Ejemplo: "/img/tema-musgo/hero-ada.png"
      océano: "" // Ejemplo: "/img/tema-oceano/hero-ada.png"
    },
    {
      nombre: "heroProyectoSoplo",
      selector: ".hero-soplo",
      tipo: "background",
      original: "../img/hero-soplo.png",
      musgo: "", // Ejemplo: "/img/tema-musgo/hero-soplo.png"
      océano: "" // Ejemplo: "/img/tema-oceano/hero-soplo.png"
    }
  ];

  const themeButtons = [...document.querySelectorAll(".hero-theme-switcher__button")];
  if (themeButtons.length) {
    const availableThemes = new Set(themeButtons.map(button => button.dataset.themeChoice));
    const storageKey = "yamila-portfolio-theme";
    const applyTheme = (theme, persist = false) => {
      if (!availableThemes.has(theme)) return;

      document.documentElement.dataset.theme = theme;

      // Cambia imágenes <img> o fondos CSS según la configuración de arriba.
      themeImageConfig.forEach(imageConfig => {
        const elements = document.querySelectorAll(imageConfig.selector);
        if (!elements.length) return;

        const source = imageConfig[theme] || imageConfig.original;
        if (!source) return;

        elements.forEach(element => {
          if (imageConfig.tipo === "background") {
            element.style.backgroundImage = `url("${source}")`;
          } else {
            element.setAttribute("src", source);
          }
        });
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

/* Header: activa el diseño de pastilla al desplazarse y vuelve al diseño original al llegar arriba.
   Se mantienen las transiciones CSS de entrada y salida; ya no se oculta según la dirección del scroll. */
(() => {
  const header = document.querySelector("header");
  if (!header) return;

  const UMBRAL = 40;

  const updateHeader = () => {
    const isScrolled = window.scrollY > UMBRAL;
    header.classList.toggle("scrolled", isScrolled);
    header.classList.remove("scroll-hidden", "scroll-revealing", "scroll-initial-hidden");
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
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
