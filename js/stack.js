document.querySelectorAll(".skills-track[data-repeat], .skills-track-2[data-repeat]").forEach((track) => {
  const repeatCount = Math.max(1, Number.parseInt(track.dataset.repeat, 10) || 1);
  const baseItems = Array.from(track.children).map((item) => item.cloneNode(true));

  for (let copy = 1; copy < repeatCount; copy += 1) {
    baseItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }

  track.classList.add("is-ready");
});

(() => {
  const selector = ".skill-item[data-tooltip], .skill-item-2[data-tooltip]";
  const portal = document.createElement("div");
  const tail = document.createElement("span");
  const bubble = document.createElement("span");

  portal.className = "skills-tooltip-portal";
  portal.id = "skills-tooltip-portal";
  portal.setAttribute("role", "tooltip");
  tail.className = "skills-tooltip-tail";
  bubble.className = "skills-tooltip-bubble";
  portal.append(tail, bubble);
  document.body.appendChild(portal);

  let activeItem = null;

  const positionPortal = () => {
    if (!activeItem) return;

    const itemRect = activeItem.getBoundingClientRect();
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const bubbleWidth = bubble.getBoundingClientRect().width;
    const bubbleHeight = bubble.offsetHeight;
    const horizontalPadding = 8;
    const anchorX = itemRect.left + itemRect.width / 2;
    const horizontalDirection = activeItem.matches(".skill-item") ? -1 : 1;
    const desiredX = anchorX + rootFontSize * 2 * horizontalDirection;
    const minX = bubbleWidth / 2 + horizontalPadding;
    const maxX = window.innerWidth - bubbleWidth / 2 - horizontalPadding;
    const bubbleX = maxX < minX ? window.innerWidth / 2 : Math.min(Math.max(desiredX, minX), maxX);
    const preferredPlacement = activeItem.matches(".skill-item-2") ? "bottom" : "top";
    const topY = itemRect.top - bubbleHeight - rootFontSize;
    const bottomY = itemRect.bottom + rootFontSize;
    const fitsAbove = topY >= horizontalPadding;
    const fitsBelow = bottomY + bubbleHeight <= window.innerHeight - horizontalPadding;
    let placement = preferredPlacement;

    if (placement === "top" && !fitsAbove && fitsBelow) placement = "bottom";
    if (placement === "bottom" && !fitsBelow && fitsAbove) placement = "top";

    const preferredY = placement === "top" ? topY : bottomY;
    const bubbleY = Math.min(
      Math.max(preferredY, horizontalPadding),
      Math.max(horizontalPadding, window.innerHeight - bubbleHeight - horizontalPadding)
    );

    portal.style.left = `${bubbleX}px`;
    portal.style.top = `${bubbleY}px`;
    portal.style.setProperty("--tail-offset-x", `${anchorX - bubbleX}px`);
    portal.dataset.placement = placement;
  };

  const showTooltip = (item) => {
    if (activeItem === item) return;

    activeItem?.classList.remove("tooltip-portaled");
    activeItem = item;
    item.classList.add("tooltip-portaled");
    bubble.textContent = item.dataset.tooltip;
    positionPortal();

    requestAnimationFrame(() => {
      if (activeItem === item) portal.classList.add("is-visible");
    });
  };

  const hideTooltip = (item) => {
    if (item && activeItem !== item) return;

    activeItem?.classList.remove("tooltip-portaled");
    activeItem = null;
    portal.classList.remove("is-visible");
  };

  document.addEventListener("pointerover", (event) => {
    const item = event.target instanceof Element ? event.target.closest(selector) : null;
    if (item) showTooltip(item);
  });

  document.addEventListener("pointerout", (event) => {
    const item = event.target instanceof Element ? event.target.closest(selector) : null;
    const nextTarget = event.relatedTarget;
    if (item && !(nextTarget instanceof Node && item.contains(nextTarget))) hideTooltip(item);
  });

  window.addEventListener("resize", positionPortal);
  window.addEventListener("scroll", positionPortal, true);
})();

/* COMPARAR */

(() => {
  const root = document.getElementById('mkCompare');
  const handle = root.querySelector('.mk-handle');
  const hero = root.closest('.stack-hero-panel');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const alignHandleToHero = () => {
    if (!hero) return;
    const heroRect = hero.getBoundingClientRect();
    const compareRect = root.getBoundingClientRect();
    handle.style.top = `${heroRect.top + heroRect.height / 2 - compareRect.top}px`;
  };

  if (hero) {
    const resizeObserver = new ResizeObserver(alignHandleToHero);
    resizeObserver.observe(hero);
    resizeObserver.observe(root);
    alignHandleToHero();
  }

  const EASE = 0.14;
  let target = 100, current = 100, dragging = false, raf = null;
  let introTimer = null, onRest = null;

  const clamp = (p) => Math.max(0, Math.min(100, p));

  const render = () => {
    current += (target - current) * (reduce ? 1 : EASE);
    if (Math.abs(target - current) < 0.05) current = target;
    root.style.setProperty('--pos', current + '%');
    handle.setAttribute('aria-valuenow', Math.round(current));
    if (current === target) {
      raf = null;
      const callback = onRest;
      onRest = null;
      if (callback) callback();
      return;
    }
    raf = requestAnimationFrame(render);
  };
  const moveTo = (p, callback = null) => {
    target = clamp(p);
    onRest = callback;
    if (!raf) raf = requestAnimationFrame(render);
  };
  const cancelIntro = () => {
    if (introTimer) clearTimeout(introTimer);
    introTimer = null;
    onRest = null;
  };

  const fromEvent = (e) => {
    const r = root.getBoundingClientRect();
    moveTo(((e.clientX - r.left) / r.width) * 100);
  };
  const stop = () => { dragging = false; root.classList.remove('is-dragging'); };

  root.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.mk-divider, .mk-handle')) return;
    cancelIntro();
    dragging = true;
    root.classList.add('is-dragging');
    root.setPointerCapture(e.pointerId);
    e.preventDefault();
    fromEvent(e);
  });
  root.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
  root.addEventListener('pointerup', stop);
  root.addEventListener('pointercancel', stop);

  handle.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { cancelIntro(); moveTo(target - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { cancelIntro(); moveTo(target + 5); e.preventDefault(); }
  });

  // Entrada: barre más allá del centro desde la derecha y vuelve al margen.
  if (!reduce) {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      moveTo(65, () => {
        introTimer = setTimeout(() => {
          introTimer = null;
          if (!dragging) moveTo(100);
        }, 500);
      });
    }, { threshold: 0.6 });
    io.observe(root);
  }
})();
