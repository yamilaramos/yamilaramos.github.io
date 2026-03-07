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
  }, {
    threshold: 0.2
  });

  elements.forEach(el => observer.observe(el));

  /* VOLVER AL INICIO */

  const backToTop = document.getElementById("backToTop");

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

  document.addEventListener("DOMContentLoaded", () => {
    const element = document.querySelector(".fade-modern-load");

    setTimeout(() => {
        element.classList.add("active");
    }, 400);
});
