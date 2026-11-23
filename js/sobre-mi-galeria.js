(() => {
    const track = document.getElementById("galeriaTrack");
    const previousButton = document.getElementById("galeriaAnterior");
    const nextButton = document.getElementById("galeriaSiguiente");
    const dotsContainer = document.getElementById("galeriaPuntos");

    if (!track || !previousButton || !nextButton || !dotsContainer) return;

    const originalSlides = Array.from(track.children);
    if (!originalSlides.length) return;

    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    const firstClone = originalSlides[0].cloneNode(true);
    lastClone.setAttribute("aria-hidden", "true");
    firstClone.setAttribute("aria-hidden", "true");
    lastClone.dataset.clone = "true";
    firstClone.dataset.clone = "true";
    track.insertBefore(lastClone, originalSlides[0]);
    track.appendChild(firstClone);

    const slides = Array.from(track.children);
    let activeSlide = 1;
    let scrollTimer;

    const nearestSlideIndex = () => {
        const left = track.scrollLeft;
        let nearest = 0;
        let nearestDistance = Infinity;

        slides.forEach((slide, index) => {
            const distance = Math.abs((slide.offsetLeft - track.offsetLeft) - left);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = index;
            }
        });

        return nearest;
    };

    const scrollToSlide = (index, smooth = true) => {
        const target = slides[index];
        if (!target) return;
        track.scrollTo({
            left: target.offsetLeft - track.offsetLeft,
            behavior: smooth ? "smooth" : "auto"
        });
    };

    const renderDots = (activeIndex) => {
        Array.from(dotsContainer.children).forEach((dot, index) => {
            if (index === activeIndex - 1) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    };

    originalSlides.forEach((slide, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "sobre-mi-galeria__punto";
        dot.setAttribute("aria-label", "Ir a la imagen " + (index + 1));
        dot.addEventListener("click", () => {
            activeSlide = index + 1;
            scrollToSlide(activeSlide);
        });
        dotsContainer.appendChild(dot);
    });

    const syncFromScroll = () => {
        const nearest = nearestSlideIndex();
        if (nearest === 0) {
            activeSlide = originalSlides.length;
            scrollToSlide(activeSlide, false);
        } else if (nearest === slides.length - 1) {
            activeSlide = 1;
            scrollToSlide(activeSlide, false);
        } else {
            activeSlide = nearest;
        }
        renderDots(activeSlide);
    };

    const move = (direction) => {
        const nearest = nearestSlideIndex();
        scrollToSlide(nearest + direction);
    };

    previousButton.addEventListener("click", () => move(-1));
    nextButton.addEventListener("click", () => move(1));

    track.addEventListener("scroll", () => {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(syncFromScroll, 120);
    });

    track.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
        }
    });

    window.addEventListener("resize", () => {
        const nearest = nearestSlideIndex();
        activeSlide = nearest === 0 ? originalSlides.length : nearest === slides.length - 1 ? 1 : nearest;
        scrollToSlide(activeSlide, false);
        renderDots(activeSlide);
    });

    window.requestAnimationFrame(() => {
        scrollToSlide(activeSlide, false);
        renderDots(activeSlide);
    });
})();
