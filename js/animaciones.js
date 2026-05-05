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

  // SCROLL ANIMATIONS
  const elements = document.querySelectorAll(
    '.scroll-fade-down, .scroll-fade-modern'
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
