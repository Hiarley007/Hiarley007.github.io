const menuButton = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuButton && primaryNav) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const projectCards = document.querySelectorAll(".project-card");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (finePointer.matches && !reducedMotion.matches) {
  projectCards.forEach((card) => {
    let pendingPointer = null;
    let animationFrame = 0;

    card.addEventListener("pointerenter", () => {
      card.classList.add("is-tilting");
    });

    card.addEventListener("pointermove", (event) => {
      pendingPointer = event;
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        if (!pendingPointer) return;

        const bounds = card.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (pendingPointer.clientX - bounds.left) / bounds.width));
        const y = Math.min(1, Math.max(0, (pendingPointer.clientY - bounds.top) / bounds.height));
        pendingPointer = null;

        card.style.setProperty("--spot-x", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--spot-y", `${(y * 100).toFixed(1)}%`);
        card.style.setProperty("--tilt-x", `${((0.5 - y) * 5).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${((x - 0.5) * 7).toFixed(2)}deg`);
      });
    });

    card.addEventListener("pointerleave", () => {
      pendingPointer = null;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      card.classList.remove("is-tilting");
      card.style.removeProperty("--spot-x");
      card.style.removeProperty("--spot-y");
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}

