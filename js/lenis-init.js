(() => {
    if (!window.Lenis || window.lenis) return;

    window.lenis = new window.Lenis({
        autoRaf: true,
        anchors: true,
        allowNestedScroll: true,
        respectReducedMotion: true
    });
})();
