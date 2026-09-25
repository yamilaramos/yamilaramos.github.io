const items = [
  {
    src: "/img/certificado.png",
    caption: "Desarrollo de Sitios Web — Escuela Da Vinci",
    descripcion: "Como parte de mi formación en desarrollo web, incorporé plugins a sitios en WordPress, realicé el maquetado de páginas con Elementor y configuré una tienda online mediante WooCommerce. Además, aprendí a administrar contenidos y configuraciones desde el panel de gestión, adquiriendo una base práctica para comprender el desarrollo y mantenimiento de sitios web.",
    logos: [
      { src: "/img/wordpress.png", class: "b-logos b-radius" },
      { src: "/img/elementor.png", class: "b-logos b-radius" },
      { src: "/img/woocommerce.png", class: "b-radius" }
    ]
  },

  {
    src: "/img/certificado-pescar.png",
    caption: "Desarrollo Web Full-stack — Educación IT",
    descripcion: "Durante mi formación en desarrollo web, adquirí conocimientos en HTML, CSS y JavaScript, aplicándolos en la creación y personalización de mi portafolio personal. También aprendí a estructurar interfaces, trabajar con diseño responsive y agregar interactividad a las páginas. Como parte del proceso, incorporé GitHub para gestionar y publicar mis proyectos, familiarizándome con el flujo necesario para llevar un desarrollo desde su creación hasta su publicación online.",
    logos: [
      { src: "/img/html.png" },
      { src: "/img/css.png" },
      { src: "/img/js.png", class: "b-radius" }
    ]
  },

  {
    src: "/img/certificado-adobe.jpeg",
    caption: "Diseño Gráfico — Adobe",
    descripcion: "Durante mi formación en diseño gráfico, profundicé en distintas herramientas de Adobe para la creación y edición de contenido visual. Utilicé Photoshop para la creación de mockups, Illustrator para el desarrollo de recursos gráficos y Acrobat para la edición y gestión de documentos PDF y presentaciones. Además, incorporé Adobe Express para producir y adaptar contenido visual de manera ágil según diferentes formatos y necesidades.",
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
