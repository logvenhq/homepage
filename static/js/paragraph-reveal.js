(() => {
  const textElements = [
    ...document.querySelectorAll(".content-section__title, .content-section__copy p"),
  ];
  const keyStatements = [...document.querySelectorAll(".content-section__copy strong")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (keyStatements.length) {
    if (reduceMotion.matches) {
      keyStatements.forEach((statement) => statement.classList.add("is-emphasized"));
    } else {
      const statementObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-emphasized");
            statementObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -18%", threshold: 0.65 },
      );

      keyStatements.forEach((statement) => statementObserver.observe(statement));
    }
  }

  if (!textElements.length || reduceMotion.matches) return;

  const pendingRevealTimers = new Map();

  textElements.forEach((element, index) => {
    element.dataset.revealText = "";
    element.dataset.revealOrder = index;

    const timer = window.setTimeout(() => {
      element.classList.add("is-visible");
      pendingRevealTimers.delete(element);
    }, 1100 + index * 180);

    pendingRevealTimers.set(element, timer);
  });

  window.addEventListener(
    "scroll",
    () => {
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

    pendingRevealTimers.forEach((timer) => window.clearTimeout(timer));
    pendingRevealTimers.clear();
    textElements.forEach((element) => element.classList.add("is-visible"));
    keyStatements.forEach((statement) => statement.classList.add("is-emphasized"));
  });
})();
