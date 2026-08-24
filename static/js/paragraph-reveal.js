(() => {
  const textElements = [
    ...document.querySelectorAll(".content-section__title, .content-section__copy p"),
  ];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!textElements.length || reduceMotion.matches) return;

  let nextRevealAt = performance.now() + 1100;
  let hasScrolled = false;
  const pendingRevealTimers = new Map();

  textElements.forEach((element, index) => {
    element.dataset.revealText = "";
    element.dataset.revealOrder = index;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const entering = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (first, second) =>
            Number(first.target.dataset.revealOrder) - Number(second.target.dataset.revealOrder),
        );

      entering.forEach((entry) => {
        if (hasScrolled) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
          return;
        }

        const now = performance.now();
        const delay = Math.max(0, nextRevealAt - now);

        const timer = window.setTimeout(() => {
          entry.target.classList.add("is-visible");
          pendingRevealTimers.delete(entry.target);
        }, delay);

        pendingRevealTimers.set(entry.target, timer);
        nextRevealAt = Math.max(nextRevealAt, now) + 180;
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 },
  );

  textElements.forEach((element) => observer.observe(element));

  window.addEventListener(
    "scroll",
    () => {
      hasScrolled = true;

      pendingRevealTimers.forEach((timer, element) => {
        window.clearTimeout(timer);
        element.classList.add("is-visible");
      });
      pendingRevealTimers.clear();
    },
    { once: true, passive: true },
  );

  reduceMotion.addEventListener("change", (event) => {
    if (!event.matches) return;

    observer.disconnect();
    pendingRevealTimers.forEach((timer) => window.clearTimeout(timer));
    pendingRevealTimers.clear();
    textElements.forEach((element) => element.classList.add("is-visible"));
  });
})();
