(() => {
    const targets = Array.from(document.querySelectorAll("[data-parallax-depth]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!targets.length) return;

    let frameId = 0;

    const updateParallax = () => {
        frameId = 0;
        const viewportHeight = window.innerHeight || 1;

        targets.forEach((target) => {
            const rect = target.getBoundingClientRect();
            const range = viewportHeight / 2 + rect.height / 2;
            const progress = Math.max(
                -1,
                Math.min(1, (rect.top + rect.height / 2 - viewportHeight / 2) / range)
            );
            const depth = Number(target.dataset.parallaxDepth) || 0;

            target.style.setProperty("--parallax-y", `${(-progress * depth).toFixed(2)}px`);
        });
    };

    const requestParallaxUpdate = () => {
        if (!frameId) frameId = window.requestAnimationFrame(updateParallax);
    };

    const stopParallax = () => {
        window.removeEventListener("scroll", requestParallaxUpdate);
        window.removeEventListener("resize", requestParallaxUpdate);
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
        targets.forEach((target) => target.style.removeProperty("--parallax-y"));
    };

    const startParallax = () => {
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
