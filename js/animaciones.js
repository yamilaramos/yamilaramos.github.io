document.addEventListener("DOMContentLoaded", () => {

  const hamburguesa = document.getElementById("hamburguesa");
  const nav = document.querySelector("nav");
  const links = document.querySelectorAll("nav a");
  const backToTop = document.getElementById("backToTop");

  // Toggle menú
  hamburguesa.addEventListener("click", () => {
    nav.classList.toggle("active");
    hamburguesa.classList.toggle("active");
    document.body.classList.toggle("menu-open");
    document.documentElement.classList.toggle("menu-open");
  });

  // Cerrar al hacer click en links
  links.forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      hamburguesa.classList.remove("active");
      document.body.classList.remove("menu-open");
      document.documentElement.classList.remove("menu-open");
    });
  });
  
  // SCROLL 
const elements = document.querySelectorAll(
  '.scroll-fade-down, .scroll-fade-modern, .scroll-fade-modern-2'
);

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active', 'show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

elements.forEach(el => observer.observe(el));

  // BACK TO TOP
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // FADE LOAD
  const element = document.querySelector(".fade-modern-load");
  if (element) {
    setTimeout(() => {
      element.classList.add("active");
    }, 400);
  }

});

const cursor = document.getElementById("cursor");

if (cursor) {

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener("mousemove", (e) => {

        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";

    });

    const interactiveSelectors = "a, button, [data-cursor-hover]";

    document.addEventListener("mouseover", (e) => {

        if (e.target.tagName === "IMG") return; // las imágenes no disparan el hover

        // Expansión: en cualquier elemento interactivo
        if (e.target.closest(interactiveSelectors)) {
            cursor.classList.add("is-hovering");
        }

        // Inversión de color: SOLO en enlaces (a)
        if (e.target.closest("a")) {
            cursor.classList.add("is-link");
        }

    });

    document.addEventListener("mouseout", (e) => {

        if (e.target.tagName === "IMG") return;

        if (e.target.closest(interactiveSelectors)) {
            cursor.classList.remove("is-hovering");
        }

        if (e.target.closest("a")) {
            cursor.classList.remove("is-link");
        }

    });

    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        cursor.style.opacity = "1";
    });

}
