// FAQ: anima o reposicionamento dos módulos (FLIP: mede antes, mede depois e anima a diferença).
(() => {
  const faq = document.querySelector(".faq");
  if (!faq || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const itens = [...faq.querySelectorAll("details")];
  const mede = () => itens.map((d) => d.getBoundingClientRect());
  let antes = null;
  faq.addEventListener("click", (e) => { if (e.target.closest("summary")) antes = mede(); }, true);
  faq.addEventListener("toggle", () => {
    if (!antes || !matchMedia("(min-width: 40rem)").matches) { antes = null; return; }
    const a = antes, depois = mede();
    antes = null; // o toggle de quem fecha e o de quem abre chegam juntos: só o primeiro anima
    itens.forEach((d, i) => {
      const x = a[i], y = depois[i];
      if (Math.abs(x.left - y.left) + Math.abs(x.top - y.top) + Math.abs(x.width - y.width) + Math.abs(x.height - y.height) < 1) return;
      d.animate(
        [
          { transform: `translate(${x.left - y.left}px, ${x.top - y.top}px)`, width: `${x.width}px`, height: `${x.height}px` },
          { transform: "none", width: `${y.width}px`, height: `${y.height}px` },
        ],
        { duration: 500, easing: "cubic-bezier(.2,.7,.2,1)" }
      );
    });
  }, true);
})();
