// Heróis com círculos (início e páginas internas): as formas seguem o cursor (parallax) via --mx/--my.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll("[data-orb]").forEach((sec) => {
    const orb = sec.querySelector(".orb");
    let raf = 0;
    sec.addEventListener("mousemove", (e) => {
      const r = sec.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        orb.style.setProperty("--mx", (x / r.width - .5).toFixed(3));
        orb.style.setProperty("--my", (y / r.height - .5).toFixed(3));
      });
    });
    sec.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      orb.style.setProperty("--mx", 0);
      orb.style.setProperty("--my", 0);
    });
    // sair da janela pelo canto nem sempre dispara mouseleave no bloco
    document.documentElement.addEventListener("mouseleave", () => sec.dispatchEvent(new Event("mouseleave")));
  });
})();
