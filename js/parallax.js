(() => {
    const targets = Array.from(document.querySelectorAll("[data-parallax-depth]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!targets.length) return;

    let frameId = 0;
    let hasInitialBaseline = false;
    const initialProgress = new WeakMap();

    const getProgress = (target, viewportHeight) => {
        // En el collage medimos la tarjeta, no la imagen transformada.
        // Así evitamos que el propio parallax altere la siguiente medición.
        const measurementTarget = target.closest(".hero-collage__card") || target;
        const rect = measurementTarget.getBoundingClientRect();
        const range = viewportHeight / 2 + rect.height / 2;

        return Math.max(
            -1,
            Math.min(1, (rect.top + rect.height / 2 - viewportHeight / 2) / range)
        );
    };

    const updateParallax = () => {
        frameId = 0;
        const viewportHeight = window.innerHeight || 1;

        targets.forEach((target) => {
            const progress = getProgress(target, viewportHeight);
            const depth = Number(target.dataset.parallaxDepth) || 0;

            if (!hasInitialBaseline) {
                initialProgress.set(target, progress);
                target.style.setProperty("--parallax-y", "0px");
                return;
            }

            const movement = progress - initialProgress.get(target);
            target.style.setProperty(
                "--parallax-y",
                `${(-movement * depth).toFixed(2)}px`
            );
        });

        // La primera medición fija el punto de partida sin mover las imágenes.
        hasInitialBaseline = true;
    };

    const requestParallaxUpdate = () => {
        if (!frameId) frameId = window.requestAnimationFrame(updateParallax);
    };

    const stopParallax = () => {
        window.removeEventListener("scroll", requestParallaxUpdate);
        window.removeEventListener("resize", requestParallaxUpdate);
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
        hasInitialBaseline = false;
        targets.forEach((target) => target.style.removeProperty("--parallax-y"));
    };

    const startParallax = () => {
        hasInitialBaseline = false;
        window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
        window.addEventListener("resize", requestParallaxUpdate, { passive: true });
        requestParallaxUpdate();
    };

    const handleMotionPreferenceChange = (event) => {
        if (event.matches) stopParallax();
        else startParallax();
    };

    if (reducedMotion.matches) stopParallax();
    else startParallax();

    if (typeof reducedMotion.addEventListener === "function") {
        reducedMotion.addEventListener("change", handleMotionPreferenceChange);
    } else {
        reducedMotion.addListener(handleMotionPreferenceChange);
    }
})();
