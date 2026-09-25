const items = [
  {
    src: "/img/certificado.png",
    caption: "Desarrollo de Sitios Web — Escuela Da Vinci",
    descripcion: "Aprendí a incorporar plugins a sitios en WordPress, maquetar páginas con Elementor y configurar tiendas online mediante WooCommerce. Además, administré contenidos desde el panel de gestión, adquiriendo una base práctica para el mantenimiento de sitios web.",
    logos: [
      { src: "/img/wordpress.png", class: "b-logos b-radius" },
      { src: "/img/elementor.png", class: "b-logos b-radius" },
      { src: "/img/woocommerce.png", class: "b-radius" }
    ]
  },

  {
    src: "/img/certificado-pescar.png",
    caption: "Desarrollo Web Full-stack — Educación IT",
    descripcion: "Puse en práctica conocimientos de HTML, CSS y JavaScript en proyectos personales, trabajando en la estructura, diseño, interactividad y la adaptación a distintos dispositivos. También aprendí a publicar mediante GitHub, comprendiendo el proceso para llevar un desarrollo a una página web online.", 
    logos: [
      { src: "/img/html.png" },
      { src: "/img/css.png" },
      { src: "/img/js.png", class: "b-radius" }
    ]
  },

  {
    src: "/img/certificado-adobe.jpeg",
    caption: "Diseño Gráfico — Adobe",
    descripcion: "Profundicé en herramientas de Adobe para el diseño y la comunicación visual. Desarrollé mockups y recursos gráficos con Photoshop e Illustrator, gestioné documentos PDF y presentaciones con Acrobat, y utilicé Adobe Express para crear contenido adaptable a distintos formatos.", 
    logos: [
      { src: "/img/photoshop.png", class: "b-radius" },
      { src: "/img/illustrator.png", class: "b-radius b-logos" },
      { src: "/img/acrobat.png", class: "b-radius b-logos p-logos" }
    ]
  },

  {
    src: "/img/certificado-ai.jpeg",
    caption: "Esenciales de IA — Google",
    descripcion: "Adquirí una base teórica sobre IA generativa y técnicas de prompting para formular instrucciones más precisas y obtener mejores resultados. Estos conocimientos me permitieron experimentar con herramientas como Codex, Claude y Adobe Firefly para la generación de código e imágenes, incorporando la IA como herramienta de apoyo para la resolución de problemas, la optimización de procesos creativos y mayor autonomía al desarrollar.",
    logos: [
      { src: "/img/claude.png", class: "logos-ai b-radius" },
      { src: "/img/chat-gpt.png", class: "logos-ai b-radius" },
      { src: "/img/adobe-firefly.png", class: "logos-ai b-radius" }
    ]
  },

  {
    src: "/img/certificado-ibm.jpeg",
    caption: "Análisis de Datos — IBM",
    descripcion: "Desarrollé una buena base en Python y C++, aplicándolos en proyectos universitarios y complementándolos con SQL durante mi formación en análisis de datos. Esta experiencia me permitió fortalecer la lógica de programación y el manejo de datos, además de familiarizarme con distintas herramientas y lenguajes para resolver problemas de forma estructurada. También incorporé un nivel intermedio de Excel, trabajando con funciones lógicas y de búsqueda, formato condicional, actualización de información y creación de gráficos.",
    logos: [
      { src: "/img/excel.png", class: "logos-ai b-radius" },
      { src: "/img/python.png", class: "logos-ai b-radius" },
      { src: "/img/sql.png", class: "b-radius" }
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

    certDescripcion.textContent = actual.descripcion;

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
