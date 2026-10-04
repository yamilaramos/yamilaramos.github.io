document.addEventListener("DOMContentLoaded", () => {
  const hamburguesa = document.getElementById("hamburguesa");
  const nav = document.querySelector("nav");
  const links = document.querySelectorAll("nav a");
  const backToTop = document.getElementById("backToTop");

  // El botón de menú no existe en todas las versiones del HTML.
  if (hamburguesa && nav) {
    hamburguesa.addEventListener("click", () => {
      nav.classList.toggle("active");
      hamburguesa.classList.toggle("active");
      document.body.classList.toggle("menu-open");
      document.documentElement.classList.toggle("menu-open");
    });

    links.forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        hamburguesa.classList.remove("active");
        document.body.classList.remove("menu-open");
        document.documentElement.classList.remove("menu-open");
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
    }

    const crossedTopWhileScrollingDown = scrollDirection > 0 && wasAtTop;
    if (Math.abs(currentY - directionStartY) < UMBRAL_DIRECCION && !crossedTopWhileScrollingDown) return;

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
