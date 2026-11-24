(() => {
    const tabList = document.querySelector(".sobre-mi-pestanas");
    if (!tabList) return;

    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
    let galleryLoaded = false;

    const loadLabGallery = () => {
        if (galleryLoaded) return;
        galleryLoaded = true;

        const script = document.createElement("script");
        script.src = "/js/sobre-mi-galeria.js?v=about-tabs-gallery-20261124";
        script.async = true;
        document.body.appendChild(script);
    };

    const refreshLayout = () => {
        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("scroll"));
        if (window.lenis && typeof window.lenis.resize === "function") {
            window.lenis.resize();
        }
    };

    const activateTab = (tab, moveFocus = false) => {
        const panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (!panel || tab.getAttribute("aria-selected") === "true") {
            if (moveFocus) tab.focus();
            return;
        }

        tabs.forEach((item) => {
            const selected = item === tab;
            item.classList.toggle("is-active", selected);
            item.setAttribute("aria-selected", String(selected));
            item.tabIndex = selected ? 0 : -1;
        });

        panels.forEach((item) => {
            if (!item) return;
            item.hidden = item !== panel;
            item.classList.remove("sobre-mi-vista--entrando");
        });

        panel.hidden = false;
        void panel.offsetWidth;
        panel.classList.add("sobre-mi-vista--entrando");
        panel.addEventListener("animationend", () => {
            panel.classList.remove("sobre-mi-vista--entrando");
            refreshLayout();
        }, { once: true });

        if (panel.id === "panel-lab") loadLabGallery();
        if (moveFocus) tab.focus();
        requestAnimationFrame(refreshLayout);
    };

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => activateTab(tab));
    });

    tabList.addEventListener("keydown", (event) => {
        const current = tabs.indexOf(event.target.closest('[role="tab"]'));
        if (current < 0) return;

        let next = null;
        if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next === null) return;

        event.preventDefault();
        activateTab(tabs[next], true);
    });
})();
