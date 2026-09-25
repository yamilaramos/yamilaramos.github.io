
const items = [
  {
    src: "/img/certificado.png",
    caption: "Desarrollo de Sitios Web — Escuela Da Vinci",
    alt: "Certificado de Desarrollo de Sitios Web de Escuela Da Vinci",
    descripcion: 'Aprendí a incorporar plugins a sitios en <strong class="subrayado">WordPress</strong>, maquetar páginas con <strong class="subrayado">Elementor</strong> y configurar tiendas online mediante <strong class="subrayado">WooCommerce</strong>. Además, administré contenidos desde el panel de gestión, adquiriendo una base práctica para el mantenimiento de sitios web.',
    logos: [
      { src: "/img/wordpress.png", alt: "Logo de WordPress", class: "b-logos b-radius" },
      { src: "/img/elementor.png", alt: "Logo de Elementor", class: "b-logos b-radius" },
      { src: "/img/woocommerce.png", alt: "Logo de WooCommerce", class: "b-radius" }
    ]
  },

  {
    src: "/img/certificado-pescar.png",
    caption: "Desarrollo Web Full-stack — Educación IT",
    alt: "Certificado de Desarrollo Web Full-stack de Educación IT",
    descripcion: 'Puse en práctica conocimientos de <strong class="subrayado">HTML</strong>, <strong class="subrayado">CSS</strong>, <strong class="subrayado">JavaScript</strong> y <strong class="subrayado">React</strong> en proyectos trabajando en su estructura, diseño, interactividad, adaptación a distintos dispositivos y el proceso de publicación mediante <strong>GitHub</strong> para llevarlo a una página web online.',
    logos: [
      { src: "/img/html.png", alt: "Logo de HTML" },
      { src: "/img/css.png", alt: "Logo de CSS" },
      { src: "/img/js.png", alt: "Logo de JavaScript", class: "b-radius" },
      { src: "/img/react.png", alt: "Logo de React", class: "b-logos b-radius" }
    ]
  },

  {
    src: "/img/certificado-adobe.jpeg",
    caption: "Diseño Gráfico — Adobe",
    alt: "Certificado de Diseño Gráfico de Adobe",
    descripcion: 'Profundicé en herramientas de <strong>Adobe</strong> para el diseño y la comunicación visual. Desarrollé mockups y recursos gráficos con <strong class="subrayado">Photoshop</strong> e <strong class="subrayado">Illustrator</strong>, gestioné documentación con <strong class="subrayado">Acrobat</strong> y utilicé <strong class="subrayado">Adobe Express</strong> para crear contenido adaptable a distintos formatos.',
    logos: [
      { src: "/img/photoshop.png", alt: "Logo de Adobe Photoshop", class: "b-radius" },
      { src: "/img/illustrator.png", alt: "Logo de Adobe Illustrator", class: "b-radius b-logos" },
      { src: "/img/acrobat.png", alt: "Logo de Adobe Acrobat", class: "b-radius b-logos p-logos" },
      { src: "/img/adobe-express.png", alt: "Logo de Adobe Express", class: "b-radius b-logos" }
    ]
  },

  {
    src: "/img/certificado-ai.jpeg",
    caption: "Esenciales de IA — Google",
    alt: "Certificado de Esenciales de IA de Google",
    descripcion: 'Adquirí conocimientos en <strong>IA generativa</strong> y <strong>prompting</strong> para formular instrucciones precisas. Experimenté con <strong class="subrayado">Claude</strong>, <strong class="subrayado">Codex</strong> y <strong class="subrayado">Adobe Firefly</strong> para generar código e imágenes, incorporando estas herramientas en la resolución de problemas y en mi proceso creativo.',
    logos: [
      { src: "/img/claude.png", alt: "Logo de Claude", class: "logos-ai b-radius" },
      { src: "/img/chat-gpt.png", alt: "Logo de ChatGPT", class: "logos-ai b-radius" },
      { src: "/img/adobe-firefly.png", alt: "Logo de Adobe Firefly", class: "logos-ai b-radius" }
    ]
  },

  {
    src: "/img/certificado-ibm.jpeg",
    caption: "Análisis de Datos — IBM",
    alt: "Certificado de Análisis de Datos de IBM",
    descripcion: 'Desarrollé conocimientos en <strong class="subrayado">Python</strong> y <strong class="subrayado">SQL</strong> aplicándolos a proyectos de universidad. Fortalecí la lógica de programación y mi capacidad para resolver problemas de forma estructurada. Además, aprendí a trabajar con funciones, formato condicional y gráficos en <strong class="subrayado">Excel</strong>.',
    logos: [
      { src: "/img/python.png", alt: "Logo de Python", class: "logos-ai b-radius" },
      { src: "/img/sql.png", alt: "Logo de SQL", class: "b-radius" },
      { src: "/img/excel.png", alt: "Logo de Microsoft Excel", class: "logos-ai b-radius" }
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
    <img src="${item.src}" alt="${item.alt}">
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

    /* LOS OTROS QUEDAN OCULTOS */

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

    certDescripcion.innerHTML = actual.descripcion;

    certLogos.innerHTML = actual.logos
      .map(logo => `
        <img
          src="${logo.src}"
          class="${logo.class || ""}"
          alt="${logo.alt}"
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
