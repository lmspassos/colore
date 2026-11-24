(() => {
  // Os círculos do herói seguem o ponteiro (sem movimento reduzido)
  const m = document.querySelector("[data-mix]");
  if (!m || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const set = (x, y) => { m.style.setProperty("--mx", x.toFixed(2)); m.style.setProperty("--my", y.toFixed(2)); };
  addEventListener("pointermove", (e) => {
    const r = m.getBoundingClientRect();
    set(Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1)), Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1)));
  });
})();
