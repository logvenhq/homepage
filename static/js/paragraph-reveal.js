(() => {
  const textElements = [
    ...document.querySelectorAll(".content-section__title, .content-section__copy p"),
  ];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!textElements.length || reduceMotion.matches) return;

  let nextRevealAt = performance.now() + 2200;

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
        const now = performance.now();
        const delay = Math.max(0, nextRevealAt - now);

        window.setTimeout(() => entry.target.classList.add("is-visible"), delay);
        nextRevealAt = Math.max(nextRevealAt, now) + 180;
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 },
  );

  textElements.forEach((element) => observer.observe(element));

  reduceMotion.addEventListener("change", (event) => {
    if (!event.matches) return;

    observer.disconnect();
    textElements.forEach((element) => element.classList.add("is-visible"));
  });
})();
