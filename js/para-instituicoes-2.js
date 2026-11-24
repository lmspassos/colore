(() => {
  // Os círculos do início podem ser arrastados (dentro da caixa) para misturar as cores
  const box = document.querySelector("[data-mix]");
  if (!box) return;
  box.querySelectorAll(".mc").forEach((c) => {
    let sx = 0, sy = 0, ox = 0, oy = 0, lim;
    c.addEventListener("pointerdown", (e) => {
      c.setPointerCapture(e.pointerId); c.classList.add("on");
      sx = e.clientX - ox; sy = e.clientY - oy;
      const b = box.getBoundingClientRect(), r = c.getBoundingClientRect();
      lim = [b.left - (r.left - ox), b.right - (r.right - ox), b.top - (r.top - oy), b.bottom - (r.bottom - oy)];
    });
    c.addEventListener("pointermove", (e) => {
      if (!c.hasPointerCapture(e.pointerId)) return;
      ox = Math.min(lim[1], Math.max(lim[0], e.clientX - sx)); oy = Math.min(lim[3], Math.max(lim[2], e.clientY - sy));
      c.style.translate = `${ox}px ${oy}px`;
    });
    c.addEventListener("pointerup", () => c.classList.remove("on"));
  });
})();
