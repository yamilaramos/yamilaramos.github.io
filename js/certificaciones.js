
const items = [
  {
    src: "/img/certificado.png",
    caption: "Desarrollo de Sitios Web — Escuela Da Vinci",
    descripcion: 'Aprendí a incorporar plugins a sitios en <strong class="subrayado">WordPress</strong>, maquetar páginas con <strong class="subrayado">Elementor</strong> y configurar tiendas online mediante <strong class="subrayado">WooCommerce</strong>. Además, administré contenidos desde el panel de gestión, adquiriendo una base práctica para el mantenimiento de sitios web.',
    logos: [
      { src: "/img/wordpress.png", class: "b-logos b-radius" },
      { src: "/img/elementor.png", class: "b-logos b-radius" },
      { src: "/img/woocommerce.png", class: "b-radius" }
    ]
  },

  {
    src: "/img/certificado-pescar.png",
    caption: "Desarrollo Web Full-stack — Educación IT",
    descripcion: "Puse en práctica conocimientos de <strong>HTML</strong>, <strong>CSS</strong> y <strong>JavaScript</strong> en proyectos trabajando en su estructura, diseño, interactividad, adaptación a distintos dispositivos y el proceso de publicación mediante <strong>GitHub</strong> para llevarlo a una página web online.",
    logos: [
      { src: "/img/html.png" },
      { src: "/img/css.png" },
      { src: "/img/js.png", class: "b-radius" }
    ]
  },

  {
    src: "/img/certificado-adobe.jpeg",
    caption: "Diseño Gráfico — Adobe",
    descripcion: "Profundicé en herramientas de <strong>Adobe</strong> para el diseño y la comunicación visual. Desarrollé mockups y recursos gráficos con <strong>Photoshop</strong> e <strong>Illustrator</strong>, gestioné documentación con <strong>Acrobat</strong> y utilicé <strong>Adobe Express</strong> para crear contenido adaptable a distintos formatos.",
    logos: [
      { src: "/img/photoshop.png", class: "b-radius" },
      { src: "/img/illustrator.png", class: "b-radius b-logos" },
      { src: "/img/acrobat.png", class: "b-radius b-logos p-logos" }
    ]
  },

  {
    src: "/img/certificado-ai.jpeg",
    caption: "Esenciales de IA — Google",
    descripcion: "Adquirí conocimientos en <strong>IA generativa</strong> y <strong>prompting</strong> para formular instrucciones precisas. Experimenté con <strong>Claude</strong>, <strong>Codex</strong> y <strong>Adobe Firefly</strong> para generar código e imágenes, incorporando estas herramientas en la resolución de problemas y en mi proceso creativo.",
    logos: [
      { src: "/img/claude.png", class: "logos-ai b-radius" },
      { src: "/img/chat-gpt.png", class: "logos-ai b-radius" },
      { src: "/img/adobe-firefly.png", class: "logos-ai b-radius" }
    ]
  },

  {
    src: "/img/certificado-ibm.jpeg",
    caption: "Análisis de Datos — IBM",
    descripcion: "Desarrollé conocimientos en <strong>Python</strong> y <strong>SQL</strong> aplicándolos a proyectos de universidad. Fortalecí la lógica de programación y mi capacidad para resolver problemas de forma estructurada. Además, aprendí a trabajar con funciones, formato condicional y gráficos en <strong>Excel</strong>.",
    logos: [
      { src: "/img/python.png", class: "logos-ai b-radius" },
      { src: "/img/sql.png", class: "b-radius" },
      { src: "/img/excel.png", class: "logos-ai b-radius" }
    ]
  },
];

let activo = 0;

const pista = document.getElementById("pista");
const caption = document.getElementById("caption");
const certDescripcion = document.getElementById("certDescripcion");
const certLogos = document.getElementById("certLogos");


items.forEach((item, i) => {

  const div = document.createElement("div");

  div.className = "slide";
  div.dataset.index = i;

  div.innerHTML = `
    <img src="${item.src}" alt="${item.caption}">
  `;

  div.addEventListener("click", () => {
    activo = i;
    render();
  });

  pista.appendChild(div);
});


function render() {

  const total = items.length;
  const slides = pista.querySelectorAll(".slide");

  slides.forEach((slide, i) => {

    let diff = i - activo;

    /* Carrusel infinito */

    if (diff > total / 2) {
      diff -= total;
    }

    if (diff < -total / 2) {
      diff += total;
    }

    slide.className = "slide";

    if (diff === 0) {
      slide.classList.add("activo");
    }

    else if (diff === -1) {
      slide.classList.add("prev-1");
    }

    else if (diff === 1) {
      slide.classList.add("next-1");
    }

    /* LOS OTROS DOS QUEDAN OCULTOS */

    else {

      slide.classList.add("oculto");

      if (diff < 0) {
        slide.classList.add("izquierda");
      } else {
        slide.classList.add("derecha");
      }

    }

  });

  const actual = items[activo];

  caption.textContent = actual.caption;

  certDescripcion.classList.add("cert-fade");
  certLogos.classList.add("cert-fade");


  setTimeout(() => {

    // innerHTML permite interpretar las etiquetas <strong>
    certDescripcion.innerHTML = actual.descripcion;

    certLogos.innerHTML = actual.logos
      .map(logo => `
        <img
          src="${logo.src}"
          class="${logo.class || ""}"
          alt=""
        >
      `)
      .join("");

    certDescripcion.classList.remove("cert-fade");
    certLogos.classList.remove("cert-fade");

  }, 180);
}


document.getElementById("btnPrev").addEventListener("click", () => {

  activo = (activo - 1 + items.length) % items.length;

  render();

});


document.getElementById("btnNext").addEventListener("click", () => {

  activo = (activo + 1) % items.length;

  render();

});


render();
