// Heróis com círculos (início e páginas internas): as formas seguem o cursor (parallax) via --mx/--my.
// Na home, um círculo de cor acompanha o cursor e a cor muda a cada clique.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll("[data-orb]").forEach((sec) => {
    const orb = sec.querySelector(".orb"), cur = sec.querySelector(".cur");
    const cores = ["--orange", "--blue", "--green", "--pink", "--yellow"];
    let ci = 0, raf = 0;
    if (cur) cur.style.background = `var(${cores[0]})`;
    sec.addEventListener("mousemove", (e) => {
      const r = sec.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        orb.style.setProperty("--mx", (x / r.width - .5).toFixed(3));
        orb.style.setProperty("--my", (y / r.height - .5).toFixed(3));
        if (cur) { cur.style.left = x + "px"; cur.style.top = y + "px"; cur.style.transform = "translate(-50%,-50%) scale(1)"; }
      });
    });
    sec.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      orb.style.setProperty("--mx", 0);
      orb.style.setProperty("--my", 0);
      if (cur) cur.style.transform = "translate(-50%,-50%) scale(0)";
    });
    // sair da janela pelo canto nem sempre dispara mouseleave no bloco
    document.documentElement.addEventListener("mouseleave", () => sec.dispatchEvent(new Event("mouseleave")));
    if (cur) sec.addEventListener("click", () => { ci = (ci + 1) % cores.length; cur.style.background = `var(${cores[ci]})`; });
  });
})();
